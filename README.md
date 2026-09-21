<div align="center">

# 📊 ACCUSOFT

### *Enterprise Expense Management, Financial Ledger & Zero-Knowledge Credential Vault*

[![Live Demo](https://img.shields.io/badge/🌐_Live_Website-accusoft.battlefiesta.in-2563EB?style=for-the-badge)](https://accusoft.battlefiesta.in)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js_20+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express_5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

<br />

<a href="https://accusoft.battlefiesta.in" target="_blank">
  <img src="https://res.cloudinary.com/dusxlxlvm/image/upload/v1774069266/accusoft/assets/accusoft_homepage_aegkp1.webp" alt="Accusoft Dashboard Preview" width="100%" style="border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.12);" />
</a>

<br />
<br />

> **Accusoft** is a high-performance, modern full-stack enterprise web application designed for financial ledger tracking, expense categorization, interactive analytical reporting, document management, and client-side zero-knowledge encrypted credential security.

---

[✨ Key Features](#-key-features) •
[🌐 Live Deployment](#-live-deployment) •
[🛠️ Tech Stack](#️-tech-stack) •
[📁 Project Structure](#-project-structure)

---

</div>

<br />

## 🌐 Live Deployment

Accusoft is deployed and running live in production at:

### 🔗 **[https://accusoft.battlefiesta.in](https://accusoft.battlefiesta.in)**

---

## ✨ Key Features

### 💳 1. Comprehensive Expense & Voucher Management
- **Smart Tracking**: Real-time logging of operational and organizational expenses with category tags and dynamic filters.
- **Voucher Workflows**: Multi-stage office expense vouchers with automatic calculations, date ranges, and approval flows.
- **Dynamic Breakdown**: Filter by categories, date intervals, and custom attributes.

### 📈 2. Interactive Financial Analytics & Ledger
- **Visual Analytics**: Interactive data visualization powered by Chart.js and React-Chartjs-2.
- **Ledger Records**: Credit/Debit auditing with detailed breakdown, transaction logs, and statistical trends.
- **Export & Reporting**: Instant generation of financial summary tables and audit-ready data reports.

### 🔒 3. Zero-Knowledge Password & Credential Vault (Admin)
- **Client-Side E2EE**: Native Web Crypto API (`window.crypto.subtle`) hardware-accelerated encryption (AES-256-GCM + PBKDF2 with 100,000 rounds).
- **Zero Server Exposure**: The backend only stores ciphertext—master passwords and plaintext credentials never touch the network.
- **Productivity Tools**: Built-in cryptographic password generator, masked view with show/hide toggles, and one-click clipboard copy.

### 🎨 4. Cutting-Edge Modern UI & Theming
- **Dual Mode**: Seamless Dark / Light mode switching with full CSS custom property tokenization.
- **Dynamic Accent Colors**: Dynamic theme customization with live preview.
- **Fluid Micro-Interactions**: Smooth animations with Framer Motion and Lucide icons.
- **Toast Feedback**: Real-time status notifications using Sonner.

### 📂 5. Cloudinary & Document Management
- Direct media uploads and CDN integration via Cloudinary.
- Document and attachment handling with secure validation.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4 + Custom Design Tokens (Dark/Light Modes)
- **State Management**: Redux Toolkit + Redux Persist
- **Animations & Icons**: Framer Motion, Lucide React
- **Charts & Data**: Chart.js, React-Chartjs-2, Day.js
- **Cryptography**: Web Crypto API (`window.crypto.subtle`)

### **Backend**
- **Runtime & Framework**: Node.js 20+ / Express 5
- **Database**: MongoDB with Mongoose 9 ODM
- **Security**: JWT Authentication, Bcrypt, Helmet, CORS
- **Media & File Handling**: Cloudinary SDK, Multer

---

## 📁 Project Structure

```
Accusoft/
├── client/                     # React 19 + Vite Frontend SPA
│   ├── public/                 # Static assets, icons, manifest
│   ├── src/
│   │   ├── assets/             # Images, logos, icons, SVGs
│   │   ├── components/         # Reusable UI components & layouts
│   │   ├── pages/              # Routed pages (Admin, Vault, Expenses, Ledger, etc.)
│   │   ├── store/              # Redux slices (Auth, Theme, APIs)
│   │   ├── utils/              # Web Crypto vault, route guards, toast helpers
│   │   ├── App.jsx             # Top-level routing & layout
│   │   └── index.css           # Theme variables & Tailwind v4
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Express 5 + Node.js API
│   ├── conn/                   # MongoDB Mongoose connection
│   ├── controller/             # Business logic (Auth, Ledger, Vault, Expenses, Admin)
│   ├── middleware/             # JWT auth, RBAC authorization, Multer
│   ├── modals/                 # Mongoose database models & schemas
│   ├── router/                 # API endpoint routers
│   ├── utils/                  # Error handlers & API helpers
│   ├── index.js                # Server entry point
│   └── package.json
│
├── STRUCTURE.md                # Detailed file & architectural map
├── SECURITY.md                 # Cryptographic specs & security model
└── THEME.md                    # Color tokens & theme system
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/kumarjaikishan">Kumar Jaikishan</a>. Live at <a href="https://accusoft.battlefiesta.in">accusoft.battlefiesta.in</a></sub>
</div>
