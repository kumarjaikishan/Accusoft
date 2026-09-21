const mongo = require('mongoose');

const ledexp = new mongo.Schema({
    userid: {
        type: mongo.Schema.Types.ObjectId,
        ref: 'user',
    },
    ledger: {
        type: String,
        required: true
    },
    budget: {
        type: Number,
    }
}, { timestamps: true });

// ⚡ HIGH PERFORMANCE COMPOUND INDEX
ledexp.index({ userid: 1, ledger: 1 });
ledexp.index({ userid: 1, createdAt: -1 });

const ledmodel = new mongo.model("ledger", ledexp);
module.exports = ledmodel;