const mongo = require('mongoose');
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

const expe = new mongo.Schema({
    userid: {
        type: mongo.Schema.Types.ObjectId,
        ref: 'user'
    },
    ledger: {
        type: mongo.Schema.Types.ObjectId,
        ref: 'ledger'
    },
    date: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    narration: {
        type: String,
        required: true
    },
    accountLedgerEntryId: {
        type: mongo.Schema.Types.ObjectId,
        ref: 'account_ledger_entry',
        default: null
    }
}, { timestamps: true });

// ⚡ HIGH PERFORMANCE COMPOUND INDEXES
expe.index({ userid: 1, date: -1 });
expe.index({ userid: 1, ledger: 1, date: -1 });
expe.index({ userid: 1, createdAt: -1 });
expe.index({ accountLedgerEntryId: 1 });

const expense = new mongo.model("expense", expe);
module.exports = expense;
