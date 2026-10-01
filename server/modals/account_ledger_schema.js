const mongoose = require('mongoose');

const ledgerItemSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });

// Compound indexes
ledgerItemSchema.index({ userid: 1, name: 1 });
ledgerItemSchema.index({ userid: 1, createdAt: -1 });

const AccountLedger = mongoose.model('account_ledger', ledgerItemSchema);
module.exports = AccountLedger;
