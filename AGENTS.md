# Accusoft — Project Master Rules & Agent Guidelines

Welcome to **Accusoft**, a full-stack MERN (MongoDB, Express, React, Node.js) enterprise expense management, financial ledger, and zero-knowledge credential security application.

---

## 🧭 Automatic Agent Directives (Read on Every Conversation)

Whenever working on this project, ALWAYS follow these core principles:

1. **Check Related Documentation First**:
   - Project Structure & Files: [`STRUCTURE.md`](./STRUCTURE.md)
   - Design System, Colors & Dark Mode: [`THEME.md`](./THEME.md)
   - Security & Cryptography: [`SECURITY.md`](./SECURITY.md)
   - Project Memory & Roadmap: [`MEMORY.md`](./MEMORY.md)
   - Modular Rules: [`.agents/rules/`](./.agents/rules/)

2. **Full-Stack Architecture Patterns**:
   - **Frontend**: React 19 + Vite + Tailwind CSS v4 + Redux Toolkit (`react-redux`, `redux-persist`) + Framer Motion + Lucide React + Sonner (toasts).
   - **Backend**: Node.js + Express 5 + Mongoose 9 + JWT authentication + Cloudinary + Helmet + Bcrypt.
   - **State Persistence**: Theme mode (`light`/`dark`) and user login state are managed in Redux (`Frontend/src/store/`).

3. **Styling & UI Aesthetics**:
   - Use CSS custom properties defined in `Frontend/src/index.css` (e.g., `--maincolor`, `--theme-page`, `--theme-surface`, `--theme-content`, `--theme-border`).
   - Dark mode toggle applies `.dark` class to `document.documentElement`.
   - Always ensure high aesthetic standards: smooth transitions, responsive layouts, glassmorphic modals, and consistent micro-interactions.

4. **Security & Cryptography (Zero-Knowledge Rule)**:
   - Plaintext passwords and sensitive personal credentials must **NEVER** be transmitted in plain text or decrypted on the server.
   - All credential vault operations must use **Web Crypto API (SubtleCrypto)** client-side encryption (AES-256-GCM + PBKDF2-SHA256).

5. **Code Quality**:
   - No unnecessary dependencies.
   - Clean async/await error handling with custom `ApiError` middleware on backend.
   - Maintain clear separation of concerns (Routes -> Middleware -> Controllers -> Models).
