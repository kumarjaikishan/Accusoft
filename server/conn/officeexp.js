const mongo = require('mongoose');

const officeexp = new mongo.Schema({
    voucher:{
        type:Number
    },
    ledger:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    narration:{
        type:String,
        required:true
    }
})
const office = new mongo.model("officeexpense",officeexp);
module.exports=office;