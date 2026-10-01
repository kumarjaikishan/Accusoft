# Accusoft — Project Memory & Roadmap

## 📌 Project Overview
- **Project Name**: Accusoft
- **Tech Stack**: React 19 (Vite), Redux Toolkit, Tailwind CSS v4, Node.js (Express 5), MongoDB (Mongoose 9).
- **Core Domain**: Expense Tracking, Financial Ledger, Data Analysis, Document Management, Zero-Knowledge Credential Vault.

---

## 🚀 Active Feature Modules & Status

| Module | Status | Location | Notes |
| :--- | :--- | :--- | :--- |
| **Authentication & OAuth** | Active | `server/controller/login_contoroller.js`, `client/src/pages/login/`, `client/src/components/GoogleAuthButton.jsx` | 6-Digit Email OTP verification, Google Identity Services (GSI) 1-click popup OAuth ID Token flow, JWT Bearer tokens + bounded refresh token rotation. |
| **Theme System** | Active | `client/src/store/themeSlice.js`, `client/src/index.css` | Light/Dark + dynamic `--maincolor` |
| **Expenses & Vouchers** | Active | `client/src/pages/Expense/`, `client/src/pages/voucher/` | Expense CRUD + categorization + MongoDB `$facet` aggregation |
| **Financial Ledger** | Active | `client/src/pages/dataAnalysis/` | Ledger breakdown, dynamic year selection, charts, drill-down |
| **Admin Dashboard** | Active | `client/src/pages/admin/` | User management, contact queries, logs |
| **API Telemetry & Logger** | Active | `client/src/pages/admin/logger/` | Modularized architecture with `useLoggerData` hook, StatCards, FilterBar, EndpointSidebar, and Timeline components |
| **Cloudinary Profile** | Active | `client/src/pages/photoCloudinary.jsx` | Profile details + avatar uploads with client-side canvas WebP conversion & auto-refreshed `useApi` |
| **Password Vault** | Active | `client/src/pages/admin/vault/`, `server/modals/vault_schema.js` | 🔒 Zero-Knowledge E2EE Credential Vault (Admin Only) with AES-256-GCM, PBKDF2 (100k rounds), 1-click copy for ID & Password, masked display, and password generator. |
| **Util Account Ledgers** | Active | `client/src/pages/util/AccountLedgers.jsx`, `client/src/pages/util/LedgerStatementDetail.jsx`, `server/controller/account_ledger_controller.js` | 📖 Full debit/credit financial ledger & account statement system with running balance, CSV export, printable layout, and real-time total payable / receivable metrics. |
| **Util Todo Task Manager** | Active | `client/src/pages/util/TodoPage.jsx`, `server/controller/todo_controller.js` | ✅ Modern interactive Task Manager with priorities, categories, due dates, tags, and bulk clear tools. |
| **App Starting Loader** | Active | `client/src/preloader.jsx`, `client/src/index.css` | 💫 Ultra-lightweight pure Tailwind & CSS 3D logo animation featuring floating levitation, light shimmer sweep, ascending financial growth micro-bars, sonar aura ripples, zero-JS fallback, and light/dark mode support. |
| **Animation Engine** | Active | `client/src/index.css`, Tailwind CSS v4 | ⚡ Pure Tailwind CSS & CSS keyframe animations (zero runtime JS overhead, `framer-motion` fully uninstalled). |
| **Server Benchmark Suite** | Active | `client/src/pages/serverTest/` | ⏱️ Concurrency & stress testing suite comparing Event Loop Blocking (`/admin/slow`) vs Worker Threads (`/admin/slowworker`) with live API ping & latency metrics. |
| **Branded Email & OTP System** | Active | `server/utils/emailTemplates.js`, `server/middleware/email_auth.js` | ✉️ Modern, high-conversion 6-digit OTP email verification and password reset matching Accusoft's brand theme (`#0B1B3D`, `#0070F3`). |
| **DPDP & Privacy Consent** | Active | `client/src/components/PrivacyBanner.jsx`, `client/src/pages/others/Policy.jsx`, `server/modals/login_schema.js` | 🍪 Indian DPDP Act 2023 & GDPR compliant privacy notice banner with cross-device MongoDB profile sync, grievance officer contact, and transparent session storage declaration. |

---

## 🎯 Architecture & Optimization Summary
1. **Unified Error & Async Flow**: Backend controllers (`exp_controller.js`, `notes_controller.js`, `login_contoroller.js`) use `asyncHandler` + custom `ApiError`.
2. **Optimized Aggregations**: MongoDB `$facet` pipelines used in `explistRange` and `getCategories` to reduce Node.js CPU overhead.
3. **Cleaned Redux Store**: Removed dead `createAsyncThunk` and hardcoded endpoints from `api.js` and `login.js`; global state uses `useUserApi` with `useApi` handling automated token refresh and logging.
4. **Component Modularization**: Large single-file views like `logger.jsx` broken into reusable subcomponents and custom hooks (`useLoggerData`, `useChartPreferences`).
5. **Zero-Knowledge Core**: Encrypted client-side with native `window.crypto.subtle` (AES-256-GCM + PBKDF2).
