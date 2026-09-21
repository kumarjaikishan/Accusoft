const mongoose = require('mongoose');

const vaultMetaSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        unique: true,
        index: true
    },
    salt: {
        type: String,
        required: [true, 'Cryptographic salt is required']
    },
    // Verification ciphertext & IV to validate master password on client without sending master password to server
    checkCiphertext: {
        type: String,
        required: [true, 'Check ciphertext is required']
    },
    checkIv: {
        type: String,
        required: [true, 'Check IV is required']
    },
    hint: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

const VaultMeta = mongoose.model('VaultMeta', vaultMetaSchema);
module.exports = VaultMeta;
