# Accusoft — Project Memory & Roadmap

## 📌 Project Overview
- **Project Name**: Accusoft
- **Tech Stack**: React 19 (Vite), Redux Toolkit, Tailwind CSS v4, Node.js (Express 5), MongoDB (Mongoose 9).
- **Core Domain**: Expense Tracking, Financial Ledger, Data Analysis, Document Management, Zero-Knowledge Credential Vault.

---

## 🚀 Active Feature Modules & Status

| Module | Status | Location | Notes |
| :--- | :--- | :--- | :--- |
| **Authentication** | Active | `server/controller/login_contoroller.js`, `Frontend/src/pages/login/` | JWT Bearer token + Refresh tokens |
| **Theme System** | Active | `Frontend/src/store/themeSlice.js`, `Frontend/src/index.css` | Light/Dark + dynamic `--maincolor` |
| **Expenses & Vouchers** | Active | `Frontend/src/pages/Expense/`, `Frontend/src/pages/voucher/` | Expense CRUD + categorization |
| **Financial Ledger** | Active | `Frontend/src/pages/dataAnalysis/` | Ledger breakdown, charts, summary |
| **Admin Dashboard** | Active | `Frontend/src/pages/admin/` | User management, contact queries, logs |
| **Cloudinary Photos** | Active | `Frontend/src/pages/photoCloudinary.jsx` | Cloud image uploads |
| **Password Vault** | Active | `Frontend/src/pages/admin/vault/`, `server/modals/vault_schema.js` | 🔒 Zero-Knowledge E2EE Credential Vault (Admin Only) with AES-256-GCM, PBKDF2 (100k rounds), 1-click copy for ID & Password, masked display, and password generator. |
| **App Starting Loader** | Active | `client/src/preloader.jsx`, `client/src/index.css` | 💫 Ultra-lightweight pure Tailwind & CSS 3D logo animation featuring floating levitation, light shimmer sweep, ascending financial growth micro-bars, sonar aura ripples, zero-JS fallback, and light/dark mode support. |
| **Animation Engine** | Active | `client/src/index.css`, Tailwind CSS v4 | ⚡ Pure Tailwind CSS & CSS keyframe animations (zero runtime JS overhead, `framer-motion` fully uninstalled). |
| **Server Benchmark Suite** | Active | `client/src/pages/serverTest/` | ⏱️ Concurrency & stress testing suite comparing Event Loop Blocking (`/admin/slow`) vs Worker Threads (`/admin/slowworker`) with live API ping & latency metrics. |
| **Branded Email System** | Active | `server/utils/emailTemplates.js`, `server/middleware/email_auth.js` | ✉️ Modern, high-conversion email verification, password reset, and verification landing page matching Accusoft's brand theme (`#0B1B3D`, `#0070F3`). |

---

## 🎯 Architecture Summary: Password Vault
1. **Zero-Knowledge Core**: Encrypted client-side with native `window.crypto.subtle`.
2. **Key Derivation**: PBKDF2-HMAC-SHA-256 (100,000 iterations).
3. **Data Security**: Encrypted with AES-GCM (256-bit) using unique 12-byte IVs.
4. **Permissions**: Admin-Only (`authmiddlewre` + `authorizationMiddleware(['admin'])` on server; `AdminRoute` + sidebar lock on client).
5. **Fields**:
   - `name`: Service / Title name
   - `id`: Username / Login ID / Email (with 1-click copy)
   - `password`: Secret password (case-sensitive, masked by default, show/hide eye toggle, 1-click copy)
   - `description`: Optional notes / recovery memo
