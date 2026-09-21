# Accusoft — Security & Zero-Knowledge Architecture

## 🛡️ Core Security Architecture

Accusoft uses **Zero-Knowledge Client-Side End-to-End Encryption (E2EE)** for all sensitive user credentials (passwords, identity IDs, card info, secure notes).

```
[ Browser (Client) ]                                       [ Node.js Backend & MongoDB ]
====================                                       =============================
1. User enters Master Password
2. PBKDF2-HMAC-SHA256 (100k iters)
   -> 256-bit AES-GCM Key
3. AES-GCM-256 local Encrypt / Decrypt
4. Plaintext NEVER sent to network!
                                            HTTPS / JWT
5. Send CIPHERTEXT + IV only --------------> API ----------> Store CIPHERTEXT only
                                                            (Server CANNOT read data)
```

---

## 🔐 Cryptography Specifications

| Layer | Standard | Details |
| :--- | :--- | :--- |
| **API** | `window.crypto.subtle` | Hardware-accelerated browser Web Crypto API |
| **Key Derivation** | PBKDF2-HMAC-SHA256 | 100,000 iterations + 16-byte random salt per user |
| **Encryption** | AES-GCM 256-bit | Authenticated encryption with 12-byte random IV per record |
| **Integrity** | Built-in GCM Tag | Guarantees tamper-proofing and data integrity |
| **Master Verify** | SHA-256 HMAC | Used to verify master password locally without sending the master key |

---

## 🚫 Critical Security Rules (Do Not Violate)

1. **NEVER send plaintext passwords or master passwords to the backend**.
2. **NEVER store encryption keys in `localStorage` or `sessionStorage` in plaintext**. Keys are held exclusively in React memory while the tab is active and wiped immediately when locking or logging out.
3. **Always use unique IVs (Initialization Vectors)** for every single encryption operation.
4. **Backend Authorization**: Every vault endpoint MUST be authenticated via `authmiddlewre` and scoped strictly to `req.userid`.
