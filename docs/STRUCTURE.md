# Accusoft — Project Structure & Architectural Map

## 📂 Repository Overview

```
Accusoft/
├── Frontend/                 # React 19 + Vite Frontend SPA (mapped to client/)
│   ├── public/              # Static assets, icons, manifest
│   ├── src/
│   │   ├── assets/          # Images, logos, icons, SVGs
│   │   ├── components/      # Reusable UI components
│   │   │   ├── common/      # Generic widgets (Button, DataTable, etc.)
│   │   │   ├── navbar/      # Navigation bar, mobile drawer, sidebar
│   │   │   └── footer/      # Footer widgets
│   │   ├── pages/           # Page route components
│   │   │   ├── admin/       # Admin dashboard, contacts, logs, user edits
│   │   │   ├── dataAnalysis/# Financial analytics & ledger details
│   │   │   ├── Expense/     # Expense tracker & charts
│   │   │   ├── filehandle/  # File & document uploads
│   │   │   ├── homePage/    # Main user dashboard
│   │   │   ├── landingPage/ # Public landing & marketing pages
│   │   │   ├── login/       # User login & registration
│   │   │   ├── others/      # Terms, Privacy, About, Contact
│   │   │   ├── password/    # Password reset & recovery
│   │   │   ├── Report/      # Financial & audit reports
│   │   │   ├── vault/       # 🔒 Zero-Knowledge Password & Credential Vault
│   │   │   └── voucher/     # Office expense vouchers
│   │   ├── store/           # Redux Toolkit store & slices
│   │   │   ├── api.js       # Base API configuration & axios/fetch helpers
│   │   │   ├── apicalls.js  # User data API hooks & dispatches
│   │   │   ├── login.js     # Auth & user session slice
│   │   │   ├── store.js     # Root Redux store configuration
│   │   │   └── themeSlice.js# Dark mode & accent color state
│   │   ├── utils/           # Utilities, crypto helpers, route guards
│   │   │   ├── cryptoVault.js # 🔒 Web Crypto API (AES-256-GCM + PBKDF2)
│   │   │   ├── protectedRoute.jsx # User auth route wrapper
│   │   │   ├── adminRoute.jsx     # Admin auth route wrapper
│   │   │   ├── innerLayout.jsx    # Dashboard layout (nav + sidebar + main)
│   │   │   └── toast.js           # Sonner toast helper
│   │   ├── App.jsx          # Route definitions & top-level layout
│   │   ├── index.css        # Global CSS, theme variables & Tailwind v4
│   │   ├── index.jsx        # App entry point
│   │   └── preloader.jsx    # Animated loading screen
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                   # Node.js + Express + Mongoose Backend
│   ├── conn/                # MongoDB database connection
│   ├── controller/          # Route controller logic
│   │   ├── admin_controller.js
│   │   ├── contact_controller.js
│   │   ├── exp_controller.js
│   │   ├── file_controller.js
│   │   ├── ledger_controller.js
│   │   ├── login_contoroller.js
│   │   ├── notes_controller.js
│   │   ├── s3_controller.js
│   │   ├── slow_controller.js
│   │   └── vault_controller.js  # 🔒 Encrypted vault CRUD & setup
│   ├── middleware/          # Express middlewares
│   │   ├── admin_middleware.js  # Admin check
│   │   ├── auth_middleware.js   # JWT verification (Bearer token)
│   │   ├── email_auth.js        # Email OTP / verification
│   │   └── multer_middleware.js # File upload handling
│   ├── modals/              # Mongoose schemas & models
│   │   ├── category_schema.js
│   │   ├── contact_schema.js
│   │   ├── exp_schema.js
│   │   ├── file_schema.js
│   │   ├── items_schema.js
│   │   ├── ledger_schema.js
│   │   ├── login_schema.js
│   │   ├── section_schema.js
│   │   ├── vault_schema.js      # 🔒 Ciphertext credential items
│   │   └── vault_meta_schema.js # 🔒 PBKDF2 salt & master verify hash
│   ├── router/              # Express API route declarations
│   │   └── route.js         # Main API router
│   ├── utils/               # Server utility helpers & error classes
│   ├── index.js             # Server entry point & Express app setup
│   └── package.json
│
├── .agents/                 # Workspace Agent Customizations Root
│   └── rules/               # Modular coding & security rules
│       ├── coding-standards.md
│       ├── theme-and-styling.md
│       ├── architecture-and-structure.md
│       └── security-and-crypto.md
│
├── docs/                    # Reference Documentation & System Specs
│   ├── STRUCTURE.md         # This structural breakdown
│   ├── THEME.md             # Design tokens & color system
│   ├── SECURITY.md          # Zero-Knowledge cryptography & auth architecture
│   └── MEMORY.md            # Current project memory & roadmap
│
├── AGENTS.md                # Agent master instruction entrypoint
└── GEMINI.md                # Engine directives
```
