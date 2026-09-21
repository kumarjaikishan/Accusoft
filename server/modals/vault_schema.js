const mongoose = require('mongoose');

const vaultSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        index: true
    },
    name: {
        type: String,
        required: [true, 'Name / Service title is required'],
        trim: true,
        index: true
    },
    encryptedData: {
        type: String,
        required: [true, 'Encrypted data payload is required']
    },
    iv: {
        type: String,
        required: [true, 'Initialization vector is required']
    },
    tags: {
        type: [String],
        default: []
    }
}, {
    timestamps: true
});

const Vault = mongoose.model('Vault', vaultSchema);
module.exports = Vault;
