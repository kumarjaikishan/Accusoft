# GEMINI / ANTIGRAVITY ENGINE DIRECTIVES — Accusoft

This file is automatically loaded on all conversations within this workspace.

### Core Quick References:
- **Project Structure**: [STRUCTURE.md](./STRUCTURE.md)
- **Design Tokens & Dark Mode**: [THEME.md](./THEME.md)
- **Security & Zero-Knowledge Vault Rules**: [SECURITY.md](./SECURITY.md)
- **Project State & Roadmap**: [MEMORY.md](./MEMORY.md)
- **Customization Rules**: [.agents/rules/](./.agents/rules/)

### Mandatory Guidelines for all changes:
1. **Never break existing theming**: Accusoft uses CSS custom properties `--maincolor`, `--theme-page`, `--theme-surface`, `--theme-content`, etc. Check [THEME.md](./THEME.md) before styling new components.
2. **Zero-Knowledge Principle**: Any password or credential storage MUST be encrypted in the client browser with `window.crypto.subtle` (AES-256-GCM + PBKDF2). Server must only receive ciphertext.
3. **Backend Middleware**: Always protect user-specific API routes using `authmiddlewre` (`server/middleware/auth_middleware.js`).
4. **React & Redux State**: Auth state is in `Frontend/src/store/login.js`, theme in `Frontend/src/store/themeSlice.js`. Use Redux selectors and dispatch actions accordingly.
