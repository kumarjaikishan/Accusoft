# Security and Cryptography Rules — Accusoft

## 🔒 Zero-Knowledge Security Principles
1. **Client-Side Encryption Only**:
   - The server and MongoDB must never receive plaintext secrets or passwords.
   - All encryption/decryption is performed using browser Web Crypto API (`window.crypto.subtle`).
2. **Cryptographic Standards**:
   - **Key Derivation**: PBKDF2-HMAC-SHA256 with >= 100,000 iterations and 16-byte random salt.
   - **Encryption Algorithm**: AES-GCM 256-bit with unique 12-byte IV per encryption call.
3. **Key Storage**:
   - Master encryption keys must NEVER be saved to `localStorage`, cookies, or persistent storage.
   - Keys reside only in React memory during an active unlocked session and are cleared upon lock/logout.
4. **Backend Security**:
   - All endpoints dealing with user vault data require `authmiddlewre`.
   - Never expose server error stack traces or cryptographic keys in API responses.
