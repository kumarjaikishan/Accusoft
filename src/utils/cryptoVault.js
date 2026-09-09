/**
 * 🔒 Accusoft Zero-Knowledge Web Crypto Vault Engine
 * 
 * Implements hardware-accelerated, client-side End-to-End Encryption (E2EE):
 * - Key Derivation: PBKDF2-HMAC-SHA-256 (100,000 iterations + 16-byte random salt)
 * - Encryption: AES-GCM (256-bit key + 12-byte unique IV per record)
 * - Zero-Knowledge: Plaintext passwords/IDs and master keys NEVER leave the browser memory.
 */

// Verification constant to validate master password on the client side
const VERIFICATION_PAYLOAD = "ACCUSOFT_VAULT_E2EE_VERIFY_OK";
const PBKDF2_ITERATIONS = 100000;

// ---------- BASE64 / ARRAYBUFFER CONVERSION UTILITIES ----------

export const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
};

export const base64ToArrayBuffer = (base64) => {
    const binary = window.atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
};

// ---------- CRYPTOGRAPHIC KEY DERIVATION ----------

/**
 * Generate a random 16-byte cryptographic salt in Base64
 */
export const generateSalt = () => {
    const saltBytes = window.crypto.getRandomValues(new Uint8Array(16));
    return arrayBufferToBase64(saltBytes.buffer);
};

/**
 * Derive AES-GCM 256-bit CryptoKey from Master Password and Salt
 */
export const deriveMasterKey = async (masterPassword, saltBase64) => {
    const encoder = new TextEncoder();
    const passwordKey = await window.crypto.subtle.importKey(
        "raw",
        encoder.encode(masterPassword),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );

    const saltBuffer = base64ToArrayBuffer(saltBase64);

    const aesKey = await window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: saltBuffer,
            iterations: PBKDF2_ITERATIONS,
            hash: "SHA-256"
        },
        passwordKey,
        {
            name: "AES-GCM",
            length: 256
        },
        false, // Not extractable for maximum security in browser memory
        ["encrypt", "decrypt"]
    );

    return aesKey;
};

// ---------- VERIFICATION TOKENS ----------

/**
 * Create a verification token for Master Password setup
 */
export const createVerificationToken = async (cryptoKey) => {
    const encoder = new TextEncoder();
    const ivBytes = window.crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: ivBytes
        },
        cryptoKey,
        encoder.encode(VERIFICATION_PAYLOAD)
    );

    return {
        checkCiphertext: arrayBufferToBase64(encrypted),
        checkIv: arrayBufferToBase64(ivBytes.buffer)
    };
};

/**
 * Verify derived Master Key against stored checkCiphertext and checkIv
 */
export const verifyMasterKey = async (cryptoKey, checkCiphertext, checkIv) => {
    try {
        const ciphertextBuffer = base64ToArrayBuffer(checkCiphertext);
        const ivBuffer = base64ToArrayBuffer(checkIv);

        const decryptedBuffer = await window.crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: new Uint8Array(ivBuffer)
            },
            cryptoKey,
            ciphertextBuffer
        );

        const decoder = new TextDecoder();
        const decryptedText = decoder.decode(decryptedBuffer);
        return decryptedText === VERIFICATION_PAYLOAD;
    } catch (err) {
        return false;
    }
};

// ---------- RECORD ENCRYPTION & DECRYPTION ----------

/**
 * Encrypt sensitive credential payload object { id, password, description }
 * Preserves exact case sensitivity and special characters.
 */
export const encryptCredential = async (payloadObj, cryptoKey) => {
    const encoder = new TextEncoder();
    const ivBytes = window.crypto.getRandomValues(new Uint8Array(12));
    const jsonString = JSON.stringify(payloadObj);

    const encrypted = await window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: ivBytes
        },
        cryptoKey,
        encoder.encode(jsonString)
    );

    return {
        encryptedData: arrayBufferToBase64(encrypted),
        iv: arrayBufferToBase64(ivBytes.buffer)
    };
};

/**
 * Decrypt credential payload back to { id, password, description }
 */
export const decryptCredential = async (encryptedDataBase64, ivBase64, cryptoKey) => {
    try {
        const ciphertextBuffer = base64ToArrayBuffer(encryptedDataBase64);
        const ivBuffer = base64ToArrayBuffer(ivBase64);

        const decryptedBuffer = await window.crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: new Uint8Array(ivBuffer)
            },
            cryptoKey,
            ciphertextBuffer
        );

        const decoder = new TextDecoder();
        const jsonString = decoder.decode(decryptedBuffer);
        return JSON.parse(jsonString);
    } catch (err) {
        console.error("Decryption failed for item:", err);
        return null;
    }
};

// ---------- PASSWORD GENERATOR & STRENGTH ANALYZER ----------

/**
 * Generate cryptographically secure random password
 */
export const generateSecurePassword = ({
    length = 16,
    uppercase = true,
    lowercase = true,
    numbers = true,
    symbols = true
} = {}) => {
    const upperChars = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // removed ambiguous I, O
    const lowerChars = "abcdefghijkmnopqrstuvwxyz"; // removed ambiguous l
    const numChars = "23456789";                   // removed ambiguous 0, 1
    const symChars = "!@#$%^&*()_+~|}{[]:;?><,.-=";

    let charPool = "";
    const mandatoryChars = [];

    if (uppercase) {
        charPool += upperChars;
        mandatoryChars.push(upperChars[Math.floor(Math.random() * upperChars.length)]);
    }
    if (lowercase) {
        charPool += lowerChars;
        mandatoryChars.push(lowerChars[Math.floor(Math.random() * lowerChars.length)]);
    }
    if (numbers) {
        charPool += numChars;
        mandatoryChars.push(numChars[Math.floor(Math.random() * numChars.length)]);
    }
    if (symbols) {
        charPool += symChars;
        mandatoryChars.push(symChars[Math.floor(Math.random() * symChars.length)]);
    }

    if (!charPool) {
        charPool = lowerChars + numChars;
    }

    const randomValues = new Uint32Array(length);
    window.crypto.getRandomValues(randomValues);

    const passwordArr = [...mandatoryChars];
    for (let i = mandatoryChars.length; i < length; i++) {
        passwordArr.push(charPool[randomValues[i] % charPool.length]);
    }

    // Fisher-Yates Shuffle with crypto random values
    for (let i = passwordArr.length - 1; i > 0; i--) {
        const j = randomValues[i] % (i + 1);
        [passwordArr[i], passwordArr[j]] = [passwordArr[j], passwordArr[i]];
    }

    return passwordArr.join('');
};

/**
 * Calculate password strength score and label
 */
export const calculatePasswordStrength = (password) => {
    if (!password) return { score: 0, label: "Empty", color: "text-slate-400", bg: "bg-slate-300 dark:bg-slate-700" };

    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 2) {
        return { score: 1, label: "Weak", color: "text-rose-500", bg: "bg-rose-500" };
    }
    if (score <= 4) {
        return { score: 2, label: "Medium", color: "text-amber-500", bg: "bg-amber-500" };
    }
    if (score <= 6) {
        return { score: 3, label: "Strong", color: "text-emerald-500", bg: "bg-emerald-500" };
    }
    return { score: 4, label: "Very Strong", color: "text-emerald-400", bg: "bg-emerald-400" };
};
