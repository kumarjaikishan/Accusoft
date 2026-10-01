const mongoose = require('mongoose');

const ledgerEntrySchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        index: true
    },
    ledgerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'account_ledger',
        required: true,
        index: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    particular: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['CREDIT', 'DEBIT'],
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    }
}, { timestamps: true });

// Compound indexes for fast querying and running balance computation
ledgerEntrySchema.index({ userid: 1, ledgerId: 1, date: 1, createdAt: 1 });
ledgerEntrySchema.index({ userid: 1, date: -1 });

const LedgerEntry = mongoose.model('account_ledger_entry', ledgerEntrySchema);
module.exports = LedgerEntry;
