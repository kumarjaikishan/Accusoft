const mongo = require('mongoose');

const fileSchema = new mongo.Schema({
    userid: {
        type: mongo.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    fileUrls: [{
        filename: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }],
    emailRecipients: [{
        type: String,
        required: true
    }],
    message: {
        type: String,
    },
    days: {
        type: Number,
        required: true
    },
    sent: {
        type: Boolean,
        default: false
    }
});

const fileHandle = new mongo.model("filehandle", fileSchema);
module.exports = fileHandle;
