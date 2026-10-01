const AccountLedger = require('../modals/account_ledger_schema');
const LedgerEntry = require('../modals/ledger_entry_schema');
const asyncHandler = require('../utils/asyncHandler');
const { ApiError } = require('../utils/apierror');
const mongoose = require('mongoose');

// Helper to convert string to ObjectId
const toObjId = (id) => new mongoose.Types.ObjectId(id);

// Capitalize words helper
const capitalize = (val) => {
    if (!val || typeof val !== 'string') return '';
    return val
        .trim()
        .split(/\s+/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
};

/**
 * 1. Get All Ledgers with Summary (Total Payable, Total Receivable, Net Balance, entry count)
 */
const getAllLedgers = asyncHandler(async (req, res) => {
    const userId = req.userid;
    if (!userId) throw new ApiError(401, 'Unauthorized');

    const ledgers = await AccountLedger.find({ userid: userId }).sort({ name: 1 }).lean();

    // Aggregate summary per ledger
    const ledgerSummaries = await LedgerEntry.aggregate([
        { $match: { userid: toObjId(userId) } },
        {
            $group: {
                _id: '$ledgerId',
                totalCredit: {
                    $sum: { $cond: [{ $eq: ['$type', 'CREDIT'] }, '$amount', 0] }
                },
                totalDebit: {
                    $sum: { $cond: [{ $eq: ['$type', 'DEBIT'] }, '$amount', 0] }
                },
                transactionCount: { $sum: 1 },
                lastEntryDate: { $max: '$date' }
            }
        }
    ]);

    const summaryMap = {};
    ledgerSummaries.forEach(s => {
        summaryMap[s._id.toString()] = s;
    });

    let totalPayable = 0;
    let totalReceivable = 0;

    const populatedLedgers = ledgers.map(led => {
        const sum = summaryMap[led._id.toString()] || { totalCredit: 0, totalDebit: 0, transactionCount: 0, lastEntryDate: null };
        const totalCredit = sum.totalCredit;
        const totalDebit = sum.totalDebit;
        const netBalance = totalCredit - totalDebit;

        if (netBalance >= 0) {
            totalPayable += netBalance;
        } else {
            totalReceivable += Math.abs(netBalance);
        }

        return {
            ...led,
            totalCredit,
            totalDebit,
            netBalance,
            balanceStatus: netBalance >= 0 ? 'PAYABLE' : 'RECEIVABLE',
            transactionCount: sum.transactionCount,
            lastEntryDate: sum.lastEntryDate
        };
    });

    res.status(200).json({
        success: true,
        stats: {
            totalPayable,
            totalReceivable,
            netPayable: totalPayable - totalReceivable,
            totalLedgers: ledgers.length
        },
        ledgers: populatedLedgers
    });
});

/**
 * 2. Create New Account Ledger
 */
const createAccountLedger = asyncHandler(async (req, res) => {
    const userId = req.userid;
    const { name } = req.body;
    const formattedName = capitalize(name);

    if (!formattedName) {
        throw new ApiError(400, 'Ledger Name is required');
    }

    const existing = await AccountLedger.findOne({ userid: userId, name: formattedName }).lean();
    if (existing) {
        throw new ApiError(400, `Ledger "${formattedName}" already exists`);
    }

    const newLedger = await AccountLedger.create({
        userid: userId,
        name: formattedName
    });

    res.status(201).json({
        success: true,
        message: 'Ledger created successfully',
        ledger: newLedger
    });
});

/**
 * 3. Update Account Ledger Name
 */
const updateAccountLedger = asyncHandler(async (req, res) => {
    const userId = req.userid;
    const { id } = req.params;
    const { name } = req.body;
    const formattedName = capitalize(name);

    if (!formattedName) {
        throw new ApiError(400, 'Ledger Name is required');
    }

    const duplicate = await AccountLedger.findOne({
        userid: userId,
        name: formattedName,
        _id: { $ne: id }
    }).lean();

    if (duplicate) {
        throw new ApiError(400, `Ledger "${formattedName}" already exists`);
    }

    const updated = await AccountLedger.findOneAndUpdate(
        { _id: id, userid: userId },
        { name: formattedName },
        { returnDocument: 'after' }
    );

    if (!updated) {
        throw new ApiError(404, 'Ledger not found');
    }

    res.status(200).json({
        success: true,
        message: 'Ledger updated successfully',
        ledger: updated
    });
});

/**
 * 4. Delete Account Ledger
 */
const deleteAccountLedger = asyncHandler(async (req, res) => {
    const userId = req.userid;
    const { id } = req.params;

    const deleted = await AccountLedger.findOneAndDelete({ _id: id, userid: userId });
    if (!deleted) {
        throw new ApiError(404, 'Ledger not found');
    }

    await LedgerEntry.deleteMany({ ledgerId: id, userid: userId });

    res.status(200).json({
        success: true,
        message: 'Ledger and all associated entries deleted successfully'
    });
});

/**
 * 5. Get Single Ledger Statement with Running Balance & Date Filtering
 */
const getLedgerStatement = asyncHandler(async (req, res) => {
    const userId = req.userid;
    const { id } = req.params;
    const { year, month, fromDate, toDate } = req.query;

    const ledger = await AccountLedger.findOne({ _id: id, userid: userId }).lean();
    if (!ledger) {
        throw new ApiError(404, 'Ledger not found');
    }

    const filter = { userid: toObjId(userId), ledgerId: toObjId(id) };

    if (fromDate && toDate) {
        filter.date = {
            $gte: new Date(fromDate),
            $lte: new Date(new Date(toDate).setHours(23, 59, 59, 999))
        };
    } else if (year && year !== 'all') {
        const y = parseInt(year, 10);
        if (month !== undefined && month !== '' && month !== 'all') {
            const m = parseInt(month, 10);
            const start = new Date(y, m, 1);
            const end = new Date(y, m + 1, 0, 23, 59, 59, 999);
            filter.date = { $gte: start, $lte: end };
        } else {
            const start = new Date(y, 0, 1);
            const end = new Date(y, 11, 31, 23, 59, 59, 999);
            filter.date = { $gte: start, $lte: end };
        }
    }

    const allEntries = await LedgerEntry.find({ userid: userId, ledgerId: id }).sort({ date: 1, createdAt: 1 }).lean();

    let runningBalance = 0;
    let totalCredit = 0;
    let totalDebit = 0;

    const calculatedEntries = allEntries.map((item) => {
        const amt = Number(item.amount) || 0;
        if (item.type === 'CREDIT') {
            runningBalance += amt;
            totalCredit += amt;
        } else {
            runningBalance -= amt;
            totalDebit += amt;
        }

        return {
            ...item,
            runningBalance,
            balanceFormatted: runningBalance
        };
    });

    let filteredEntries = calculatedEntries;
    if (filter.date) {
        const startT = filter.date.$gte ? new Date(filter.date.$gte).getTime() : 0;
        const endT = filter.date.$lte ? new Date(filter.date.$lte).getTime() : Infinity;
        filteredEntries = calculatedEntries.filter(e => {
            const t = new Date(e.date).getTime();
            return t >= startT && t <= endT;
        });
    }

    // Show latest entries on top (newest date / entry first)
    const latestFirstEntries = [...filteredEntries].reverse();

    res.status(200).json({
        success: true,
        ledger,
        summary: {
            totalCredit,
            totalDebit,
            netBalance: totalCredit - totalDebit,
            balanceStatus: (totalCredit - totalDebit) >= 0 ? 'PAYABLE' : 'RECEIVABLE',
            transactionCount: calculatedEntries.length
        },
        entries: latestFirstEntries
    });
});

/**
 * 6. Add Entry to a Ledger (Debit / Credit)
 */
const addLedgerEntry = asyncHandler(async (req, res) => {
    const userId = req.userid;
    const { ledgerId, date, particular, type, amount } = req.body;

    if (!ledgerId || !particular || !type || amount === undefined) {
        throw new ApiError(400, 'Ledger, Particular, Type (CREDIT/DEBIT) and Amount are required');
    }

    if (!['CREDIT', 'DEBIT'].includes(type.toUpperCase())) {
        throw new ApiError(400, 'Entry type must be CREDIT or DEBIT');
    }

    const ledger = await AccountLedger.findOne({ _id: ledgerId, userid: userId });
    if (!ledger) {
        throw new ApiError(404, 'Account ledger not found');
    }

    const newEntry = await LedgerEntry.create({
        userid: userId,
        ledgerId,
        date: date ? new Date(date) : new Date(),
        particular: particular.trim(),
        type: type.toUpperCase(),
        amount: Math.abs(Number(amount))
    });

    res.status(201).json({
        success: true,
        message: 'Transaction entry added',
        entry: newEntry
    });
});

/**
 * 7. Update Ledger Entry
 */
const updateLedgerEntry = asyncHandler(async (req, res) => {
    const userId = req.userid;
    const { id } = req.params;
    const { date, particular, type, amount } = req.body;

    const updateData = {};
    if (date) updateData.date = new Date(date);
    if (particular) updateData.particular = particular.trim();
    if (type) updateData.type = type.toUpperCase();
    if (amount !== undefined) updateData.amount = Math.abs(Number(amount));

    const updated = await LedgerEntry.findOneAndUpdate(
        { _id: id, userid: userId },
        updateData,
        { returnDocument: 'after' }
    );

    if (!updated) {
        throw new ApiError(404, 'Ledger entry not found');
    }

    res.status(200).json({
        success: true,
        message: 'Entry updated successfully',
        entry: updated
    });
});

/**
 * 8. Delete Ledger Entry
 */
const deleteLedgerEntry = asyncHandler(async (req, res) => {
    const userId = req.userid;
    const { id } = req.params;

    const deleted = await LedgerEntry.findOneAndDelete({ _id: id, userid: userId });
    if (!deleted) {
        throw new ApiError(404, 'Entry not found');
    }

    res.status(200).json({
        success: true,
        message: 'Entry deleted successfully'
    });
});

module.exports = {
    getAllLedgers,
    createAccountLedger,
    updateAccountLedger,
    deleteAccountLedger,
    getLedgerStatement,
    addLedgerEntry,
    updateLedgerEntry,
    deleteLedgerEntry
};
