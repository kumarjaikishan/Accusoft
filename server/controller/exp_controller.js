const ledger = require('../modals/ledger_schema')
const expense = require('../modals/exp_schema')
const user = require('../modals/login_schema')
const asyncHandler = require('../utils/asyncHandler')
const { ApiError } = require('../utils/apierror')
const dayjs = require('dayjs')


// *--------------------------------------
// * User Registration Logic
// *--------------------------------------
// const allexpe = asyncHandler(async (req, res, next) => {
//   const query = await expense.find()
//   for (const doc of query) {
//     doc.date = dayjs(doc.date).toDate();
//     await doc.save();
//   }

//   return res.status(200).json({message:'updated'}); 
// });

// const allexpe = asyncHandler(async (req, res, next) => {
//   await expense.updateMany(
//     { date: { $type: "string" } }, // only update if date is stored as string
//     [
//       {
//         $set: {
//           date: {
//             $dateFromString: { dateString: "$date" }
//           }
//         }
//       }
//     ]
//   );

//   res.status(200).json({ message: 'All string dates converted to Date objects' });
// });

const allexpe = asyncHandler(async (req, res, next) => {
    await expense.updateMany(
        { date: { $type: "string" } }, // only if date is stored as string
        [
            {
                $set: {
                    date: {
                        $dateFromString: {
                            dateString: "$date",
                            timezone: "UTC" // ensures ISO normalization
                        }
                    }
                }
            }
        ]
    );

    res.status(200).json({ message: 'All string dates converted to Date objects in UTC' });
});

const addexpense = asyncHandler(async (req, res, next) => {
    //  throw new ApiError(400, "All Fields are Required");
    const { ledger, date, amount, narration } = req.body;

    if (!ledger || !date || !amount || !narration) {
        throw new ApiError(400, "All Fields are Required");
    }

    await expense.create({
        userid: req.userid,
        ledger,
        date,
        amount,
        narration
    });

    // smart denormalized update
    await user.updateOne(
        { _id: req.userid },
        { $max: { lastActivity: new Date() } }
    );

    return res.status(201).json({
        message: "Expense Added"
    })
})

const delmany = asyncHandler(async (req, res, next) => {
    const id = req.body.ExpIds;
    const userId = req.userid;
    console.log("id",id);

    if (!Array.isArray(id) || id.length === 0) {
        throw new ApiError(422, "Valid ID array required");
    }

    const result = await expense.deleteMany({
        _id: { $in: id },
        userid: userId
    });

    if (result.deletedCount === 0) {
        throw new ApiError(403, "No expenses deleted or unauthorized access");
    }

    return res.status(200).json({
        message: "Deleted Successfully",
        data: result
    })
})

const Admindelmany = asyncHandler(async (req, res, next) => {
    const id = req.body.id;
    // console.log(id);
    if (!Array.isArray(id) || id.length === 0) {
        throw new ApiError(422, "Valid ID array required");
    }

    const result = await expense.deleteMany({
        _id: { $in: id },
    });

    if (result.deletedCount === 0) {
        throw new ApiError(403, "No expenses deleted or unauthorized access");
    }

    return res.status(200).json({
        message: "Deleted Successfully",
        data: result
    })
})

const updateexp = asyncHandler(async (req, res, next) => {
    const { _id, ledger, date, amount, narration } = req.body;
    const userId = req.userid;

    const result = await expense.findByIdAndUpdate({ _id, userid: userId }, {
        ledger,
        date,
        amount, narration
    });

    if (!result) {
        throw new ApiError(
            403,
            "You are not allowed to update this expense"
        );
    }

    return res.status(200).json({
        message: "Updated Successfully"
    });
})

const Asminupdateexp = asyncHandler(async (req, res, next) => {
    const { _id, ledger, date, amount, narration } = req.body;

    const result = await expense.findByIdAndUpdate({ _id }, {
        ledger,
        date,
        amount, narration
    });

    if (!result) {
        throw new ApiError(
            403,
            "You are not allowed to update this expense"
        );
    }

    return res.status(200).json({
        message: "Updated Successfully"
    });
})

// Real server-side pagination + search, done inside Mongo instead of
// pulling the whole collection into node and slicing it in JS.
// Uses $facet so the paginated page, the total matching-row count, and the
// sum of the *filtered* amount are all computed in a single round trip.
const explist = asyncHandler(async (req, res, next) => {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
    const search = (req.query.search || '').trim();
    const skip = (page - 1) * limit;

    const mongoose = require('mongoose');

    const pipeline = [
        { $match: { userid: new mongoose.Types.ObjectId(req.userid) } },
        {
            $lookup: {
                from: 'ledgers',
                localField: 'ledger',
                foreignField: '_id',
                as: 'ledger',
            },
        },
        { $unwind: { path: '$ledger', preserveNullAndEmptyArrays: true } },
    ];

    if (search) {
        const safe = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(safe, 'i');
        pipeline.push({
            $match: {
                $or: [
                    { narration: regex },
                    { 'ledger.ledger': regex },
                    // amount is numeric; match it as a string for free-text search
                    { $expr: { $regexMatch: { input: { $toString: '$amount' }, regex: safe, options: 'i' } } },
                ],
            },
        });
    }

    pipeline.push({ $sort: { date: -1, _id: -1 } });

    pipeline.push({
        $facet: {
            items: [
                { $skip: skip },
                { $limit: limit },
                {
                    $project: {
                        _id: 1,
                        date: 1,
                        amount: 1,
                        narration: 1,
                        'ledger._id': 1,
                        'ledger.ledger': 1,
                    },
                },
            ],
            meta: [
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        sumAmount: { $sum: '$amount' },
                    },
                },
            ],
        },
    });

    const [result] = await expense.aggregate(pipeline);
    const meta = result?.meta?.[0] || { total: 0, sumAmount: 0 };

    res.json({
        message: 'ok',
        total: meta.total,
        sumAmount: meta.sumAmount,
        page,
        limit,
        items: result?.items || [],
    });
})

// Dashboard aggregation: totals per ledger for a given month/year, computed
// in Mongo instead of shipping every expense row to the client and summing
// there. Ledgers with zero expenses in the period are still included (so the
// dashboard cards match the previous client-side behaviour).
const ledgerSummary = asyncHandler(async (req, res, next) => {
    const month = parseInt(req.query.month); // 0-indexed, matches frontend
    const year = parseInt(req.query.year);

    if (Number.isNaN(month) || Number.isNaN(year)) {
        throw new ApiError(400, 'month and year are required');
    }

    const mongoose = require('mongoose');
    const startDate = dayjs(`${year}-${String(month + 1).padStart(2, '0')}-01`).startOf('month').toDate();
    const endDate = dayjs(startDate).endOf('month').toDate();

    const [ledgers, sums] = await Promise.all([
        ledger.find({ userid: req.userid }).select({ ledger: 1, budget: 1 }).sort({ createdAt: -1 }),
        expense.aggregate([
            {
                $match: {
                    userid: new mongoose.Types.ObjectId(req.userid),
                    date: { $gte: startDate, $lte: endDate },
                },
            },
            { $group: { _id: '$ledger', totalSum: { $sum: '$amount' } } },
        ]),
    ]);

    const sumByLedger = new Map(sums.map((s) => [String(s._id), s.totalSum]));

    let allLedgerSum = 0;
    let allLedgerBudgetSum = 0;

    const items = ledgers.map((l) => {
        const totalSum = sumByLedger.get(String(l._id)) || 0;
        const budget = Number(l.budget || 0);
        allLedgerSum += totalSum;
        allLedgerBudgetSum += budget;
        return { _id: l._id, ledger: l.ledger, budget, totalSum };
    });

    items.push({
        _id: 'Total',
        ledger: 'Total',
        budget: allLedgerBudgetSum,
        totalSum: allLedgerSum,
    });

    res.json({ message: 'ok', items });
})

// Home dashboard: today/yesterday/week/month/year totals, a trailing
// monthly chart, and the 5 most recent transactions - all computed by Mongo
// in one pass instead of scanning the user's entire expense history in the
// browser on every page load.
const homeSummary = asyncHandler(async (req, res, next) => {
    const mongoose = require('mongoose');
    const uid = new mongoose.Types.ObjectId(req.userid);

    const today = dayjs();
    const yesterday = today.subtract(1, 'day');
    const ranges = {
        todaysum: [today.startOf('day').toDate(), today.endOf('day').toDate()],
        weeksum: [yesterday.subtract(6, 'day').startOf('day').toDate(), yesterday.endOf('day').toDate()],
        monthsum: [yesterday.subtract(1, 'month').startOf('day').toDate(), yesterday.endOf('day').toDate()],
        yearsum: [yesterday.subtract(1, 'year').startOf('day').toDate(), yesterday.endOf('day').toDate()],
    };

    const facet = {};
    for (const key of Object.keys(ranges)) {
        const [gte, lte] = ranges[key];
        facet[key] = [
            { $match: { date: { $gte: gte, $lte: lte } } },
            { $group: { _id: null, sum: { $sum: '$amount' } } },
        ];
    }

    const [minDateResult] = await expense.aggregate([
        { $match: { userid: uid } },
        { $group: { _id: null, minDate: { $min: '$date' } } },
    ]);

    const minDate = minDateResult?.minDate ? dayjs(minDateResult.minDate) : null;
    const currentMonth = today.startOf('month');
    const startMonth = minDate ? minDate.startOf('month') : currentMonth;
    const monthsToGenerate = minDate
        ? Math.min(currentMonth.diff(startMonth, 'month') + 1, 12)
        : 1;
    const chartStart = today.subtract(monthsToGenerate - 1, 'month').startOf('month').toDate();

    const [sumFacets, monthlyRows, recent] = await Promise.all([
        expense.aggregate([{ $match: { userid: uid } }, { $facet: facet }]),
        expense.aggregate([
            { $match: { userid: uid, date: { $gte: chartStart } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m', date: '$date' } },
                    total: { $sum: '$amount' },
                },
            },
        ]),
        expense
            .find({ userid: req.userid })
            .populate({ path: 'ledger', select: 'ledger' })
            .sort({ date: -1, _id: -1 })
            .limit(5),
    ]);

    const sums = {};
    for (const key of Object.keys(ranges)) {
        sums[key] = sumFacets?.[0]?.[key]?.[0]?.sum || 0;
    }
    sums.dailyAvg = Math.floor(sums.monthsum / Math.min(dayjs().diff(dayjs().subtract(1, 'month'), 'day'), 30));
    sums.monthlyAvg = Math.floor(sums.yearsum / Math.min(monthsToGenerate, 12));

    const monthlyMap = new Map(monthlyRows.map((r) => [r._id, r.total]));
    const monthlyData = [];
    for (let i = 0; i < monthsToGenerate; i++) {
        const m = today.subtract(i, 'month');
        const key = m.format('YYYY-MM');
        monthlyData.unshift({ month: m.format('MMM YY'), total: monthlyMap.get(key) || 0 });
    }

    res.json({ message: 'ok', sums, monthlyData, recent });
})

// Report page: expenses within an explicit date range (+ optional ledger
// name), computed server-side instead of filtering the user's whole
// expense history in the browser on every keystroke/date change.
const explistRange = asyncHandler(async (req, res, next) => {
    const { from, to, ledger: ledgerName } = req.query;
    if (!from || !to) {
        throw new ApiError(400, 'from and to are required');
    }

    const mongoose = require('mongoose');
    const startDate = dayjs(from).startOf('day').toDate();
    const endDate = dayjs(to).endOf('day').toDate();

    const pipeline = [
        { $match: { userid: new mongoose.Types.ObjectId(req.userid), date: { $gte: startDate, $lte: endDate } } },
        { $lookup: { from: 'ledgers', localField: 'ledger', foreignField: '_id', as: 'ledger' } },
        { $unwind: { path: '$ledger', preserveNullAndEmptyArrays: true } },
    ];

    if (ledgerName && ledgerName !== 'all') {
        pipeline.push({ $match: { 'ledger.ledger': ledgerName } });
    }

    pipeline.push({ $sort: { date: -1, _id: -1 } });

    const items = await expense.aggregate(pipeline);
    const sumAmount = items.reduce((acc, val) => acc + Number(val.amount || 0), 0);

    res.json({ message: 'ok', items, sumAmount });
})

// Ledger detail drill-down: expenses for one ledger (or all) within a given
// month/year, computed server-side instead of filtering the whole expense
// history whenever the user changes the month.
const ledgerDetailList = asyncHandler(async (req, res, next) => {
    const { ledgerId, month, year } = req.query;
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    if (Number.isNaN(monthNum) || Number.isNaN(yearNum)) {
        throw new ApiError(400, 'month and year are required');
    }

    const mongoose = require('mongoose');
    const startDate = dayjs(`${yearNum}-${String(monthNum + 1).padStart(2, '0')}-01`).startOf('month').toDate();
    const endDate = dayjs(startDate).endOf('month').toDate();

    const match = { userid: new mongoose.Types.ObjectId(req.userid), date: { $gte: startDate, $lte: endDate } };
    if (ledgerId && ledgerId !== 'all') {
        match.ledger = new mongoose.Types.ObjectId(ledgerId);
    }

    const items = await expense
        .find(match)
        .populate({ path: 'ledger', select: 'ledger' })
        .sort({ date: -1, _id: -1 })
        .lean();

    const sumAmount = items.reduce((acc, val) => acc + Number(val.amount || 0), 0);

    res.json({ message: 'ok', items, sumAmount });
})

const expdetail = asyncHandler(async (req, res, next) => {
    const { expId } = req.body;
    if (!expId) {
        throw new ApiError(400, "Expense Id is Required");
    }

    const result = await expense.findOne({ _id: expId }).populate({ path: 'ledger', select: 'ledger' }).lean();
    if (result) {
        return res.json({
            data: result
        });
    }
});

const userledger = asyncHandler(async (req, res, next) => {
    const { userledger } = req.body;
    if (!userledger || userledger.length < 1) {
        throw new ApiError(422, "Ledger Can't be Blank");
    }

    const result = await user.findByIdAndUpdate({ _id: req.userid }, { ledger: userledger });
    if (result) {
        return res.json({
            message: "ledger sync",
            data: result
        });
    }
});

const userdata = asyncHandler(async (req, res, next) => {
    const [profile, ledgere] = await Promise.all([
        user.findById(req.user._id).select('-password -refreshTokens').lean(),
        ledger.find({ userid: req.user._id }).select('ledger budget').sort({ createdAt: -1 }).lean()
    ]);

    if (!profile) {
        throw new ApiError(404, "User profile not found");
    }

    return res.status(200).json({
        user: profile,
        ledger: ledgere || []
    });
});

module.exports = { 
    userdata, 
    userledger, 
    addexpense, 
    expdetail, 
    Admindelmany, 
    Asminupdateexp, 
    explist, 
    ledgerSummary, 
    homeSummary, 
    explistRange, 
    ledgerDetailList, 
    allexpe, 
    delmany, 
    updateexp 
};