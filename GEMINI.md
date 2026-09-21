# GEMINI / ANTIGRAVITY ENGINE DIRECTIVES — Accusoft

This file is automatically loaded on all conversations within this workspace.

### Core Documentation References:
- **Project Structure & Layout**: [docs/STRUCTURE.md](./docs/STRUCTURE.md)
- **Design Tokens & Dark Mode**: [docs/THEME.md](./docs/THEME.md)
- **Security & Zero-Knowledge Vault Rules**: [docs/SECURITY.md](./docs/SECURITY.md)
- **Project State & Roadmap**: [docs/MEMORY.md](./docs/MEMORY.md)
- **Customization Rules**: [.agents/rules/](./.agents/rules/)

### Mandatory Workflow & Guidelines:
1. **Pre-Task Check**: Always read the corresponding reference file in `./docs/` before proceeding with any code edits:
   - For UI / Theme / CSS adjustments -> read [docs/THEME.md](./docs/THEME.md).
   - For Vault / Cryptography / Auth -> read [docs/SECURITY.md](./docs/SECURITY.md).
   - For Architecture / Component structure -> read [docs/STRUCTURE.md](./docs/STRUCTURE.md).
   - For Roadmap & Milestone sync -> read [docs/MEMORY.md](./docs/MEMORY.md).
2. **Never break existing theming**: Accusoft uses CSS custom properties `--maincolor`, `--theme-page`, `--theme-surface`, `--theme-content`, etc. Check [docs/THEME.md](./docs/THEME.md) before styling components.
3. **Zero-Knowledge Principle**: Any password or credential storage MUST be encrypted in the client browser with `window.crypto.subtle` (AES-256-GCM + PBKDF2). Server must only receive ciphertext.
4. **Backend Middleware**: Always protect user-specific API routes using `authmiddlewre` (`server/middleware/auth_middleware.js`).
5. **React & Redux State**: Auth state is in `Frontend/src/store/login.js`, theme in `Frontend/src/store/themeSlice.js`. Use Redux selectors and dispatch actions accordingly.
