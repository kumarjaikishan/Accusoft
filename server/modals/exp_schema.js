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
    date:{
        type:Date,
        required:true
    },
    // date: {
    //     type: Date,
    //     set: (value) => {
    //         return dayjs(value)        // parse input
    //             .utc()                 // convert to UTC
    //             .startOf("day")        // set time to 00:00:00 UTC
    //             .toDate();             // convert to native Date
    //     }
    // },
    // date: {
    //     type: Date,
    //     set: (value) => {
    //         // parse in Asia/Kolkata, get start of day in that timezone, then store UTC
    //         return dayjs.tz(value, "Asia/Kolkata").startOf("day").toDate();
    //     }
    // },
    amount: {
        type: Number,
        required: true
    },
    narration: {
        type: String,
        required: true
    }
}, { timestamps: true });

// ⚡ HIGH PERFORMANCE COMPOUND INDEXES
expe.index({ userid: 1, date: -1 });
expe.index({ userid: 1, ledger: 1, date: -1 });
expe.index({ userid: 1, createdAt: -1 });

const expense = new mongo.model("expense", expe);
module.exports = expense;