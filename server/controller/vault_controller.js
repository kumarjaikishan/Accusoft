const Vault = require('../modals/vault_schema');
const VaultMeta = require('../modals/vault_meta_schema');
const asyncHandler = require('../utils/asyncHandler');

// 🔍 Check if Vault is Initialized & Fetch Crypto Metadata
const getVaultMeta = asyncHandler(async (req, res) => {
    const userId = req.userid;
    const meta = await VaultMeta.findOne({ userId });

    if (!meta) {
        return res.status(200).json({
            isInitialized: false,
            message: "Vault has not been set up yet."
        });
    }

    return res.status(200).json({
        isInitialized: true,
        salt: meta.salt,
        checkCiphertext: meta.checkCiphertext,
        checkIv: meta.checkIv,
        hint: meta.hint || ""
    });
});

// 🔑 Initialize or Setup Master Password Crypto Metadata
const initVault = asyncHandler(async (req, res) => {
    const userId = req.userid;
    const { salt, checkCiphertext, checkIv, hint } = req.body;

    if (!salt || !checkCiphertext || !checkIv) {
        return res.status(400).json({
            message: "Missing cryptographic setup parameters (salt, checkCiphertext, checkIv)."
        });
    }

    let meta = await VaultMeta.findOne({ userId });

    if (meta) {
        // If already initialized, update
        meta.salt = salt;
        meta.checkCiphertext = checkCiphertext;
        meta.checkIv = checkIv;
        meta.hint = hint || '';
        await meta.save();
    } else {
        meta = await VaultMeta.create({
            userId,
            salt,
            checkCiphertext,
            checkIv,
            hint: hint || ''
        });
    }

    return res.status(201).json({
        message: "Vault initialized successfully.",
        isInitialized: true,
        salt: meta.salt,
        checkCiphertext: meta.checkCiphertext,
        checkIv: meta.checkIv
    });
});

// 📂 Get All Encrypted Vault Items for Authenticated User
const getVaultItems = asyncHandler(async (req, res) => {
    const userId = req.userid;
    const items = await Vault.find({ userId }).sort({ updatedAt: -1 }).lean();

    return res.status(200).json({
        count: items.length,
        items
    });
});

// ➕ Create a New Encrypted Vault Item
const createVaultItem = asyncHandler(async (req, res) => {
    const userId = req.userid;
    const { name, encryptedData, iv, tags } = req.body;

    if (!name || !encryptedData || !iv) {
        return res.status(400).json({
            message: "Name, encrypted data payload, and IV are required."
        });
    }

    const item = await Vault.create({
        userId,
        name: name.trim(),
        encryptedData,
        iv,
        tags: Array.isArray(tags) ? tags : []
    });

    return res.status(201).json({
        message: "Credential saved securely.",
        item
    });
});

// ✏️ Update an Encrypted Vault Item
const updateVaultItem = asyncHandler(async (req, res) => {
    const userId = req.userid;
    const { id } = req.params;
    const { name, encryptedData, iv, tags } = req.body;

    if (!name || !encryptedData || !iv) {
        return res.status(400).json({
            message: "Name, encrypted data payload, and IV are required."
        });
    }

    const item = await Vault.findOne({ _id: id, userId });
    if (!item) {
        return res.status(404).json({
            message: "Credential not found or unauthorized."
        });
    }

    item.name = name.trim();
    item.encryptedData = encryptedData;
    item.iv = iv;
    if (Array.isArray(tags)) {
        item.tags = tags;
    }
    await item.save();

    return res.status(200).json({
        message: "Credential updated securely.",
        item
    });
});

// 🗑️ Delete an Encrypted Vault Item
const deleteVaultItem = asyncHandler(async (req, res) => {
    const userId = req.userid;
    const { id } = req.params;

    const item = await Vault.findOneAndDelete({ _id: id, userId });
    if (!item) {
        return res.status(404).json({
            message: "Credential not found or unauthorized."
        });
    }

    return res.status(200).json({
        message: "Credential deleted successfully."
    });
});

module.exports = {
    getVaultMeta,
    initVault,
    getVaultItems,
    createVaultItem,
    updateVaultItem,
    deleteVaultItem
};
