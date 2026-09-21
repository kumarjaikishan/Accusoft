// const expense = require('../modals/exp_schema')
const user = require('../modals/login_schema')
const expense = require('../modals/exp_schema')
const ledger = require('../modals/ledger_schema')
const asyncHandler = require('../utils/asyncHandler')
const { ApiError } = require('../utils/apierror')


// *--------------------------------------
// * Admin get all user expense data Logic
// *--------------------------------------
const allexpense = asyncHandler(async (req, res, next) => {
    // console.log(req.user);
    const query = await expense.find().populate([{ path: 'userid', select: "name" }, { path: 'ledger', select: 'ledger' }]).sort({ date: -1, _id: -1 });
    return res.status(200).json({
        explist: query
    })
})

// *--------------------------------------
// * Admin get all user Logic
// *--------------------------------------
const alluser = asyncHandler(async (req, res, next) => {
    // Run user fetching and aggregation in parallel
    const [users, expenseCounts] = await Promise.all([
        user.find().select('-password -refreshTokens').sort({ createdAt: -1 }).lean(),
        expense.aggregate([
            {
                $group: {
                    _id: "$userid",
                    totalExpenses: { $sum: 1 }
                }
            }
        ])
    ]);

    // O(1) Map lookup with null safety
    const countMap = new Map(
        expenseCounts
            .filter(e => e && e._id)
            .map(e => [String(e._id), e.totalExpenses])
    );

    const usersWithExpenseCount = users.map(u => ({
        ...u,
        totalExpenses: countMap.get(String(u._id)) || 0
    }));

    return res.status(200).json({
        users: usersWithExpenseCount
    });
});


// *--------------------------------------
// * Admin user data update Logic
// *--------------------------------------
const userupdate = asyncHandler(async (req, res, next) => {
    const { id, name, phone, email, admin, verified } = req.body;
    if (id == null || name == null || phone == null || email == null || admin == null || verified == null) {
        throw new ApiError(422, "All Fields are Required");
    }

    const query = await user.findByIdAndUpdate(
        { _id: id },
        { name, phone, email, isadmin: admin, isverified: verified },
        { new: true }
    );
    if (!query) {
        throw new ApiError(422, "Id Incorrect");
    }
    return res.status(200).json({
        message: "User Updated"
    });
});

// *--------------------------------------
// * Admin user delete & user Expense Delete Logic
// *--------------------------------------
const removeuser = asyncHandler(async (req, res, next) => {
    const { id } = req.body;
    if (!id) {
        throw new ApiError(422, "Id is Required");
    }

    const [query] = await Promise.all([
        user.findByIdAndDelete(id),
        expense.deleteMany({ userid: id }),
        ledger.deleteMany({ userid: id })
    ]);

    if (!query) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json({
        message: "User Removed"
    });
});

// *--------------------------------------
// * Admin user delete & user Expense Delete Logic
// *--------------------------------------
const admindash = asyncHandler(async (req, res, next) => {
    const usersCount = await user.countDocuments();
    const expensesCount = await expense.countDocuments();
    return res.status(200).json({
        userlen: usersCount,
        explen: expensesCount
    });
})



module.exports = { admindash, allexpense, alluser, userupdate, removeuser };

