# Architecture and Structure Rules — Accusoft

## 🏗️ Structure Guidelines
1. **Frontend Directory Structure**:
   - `src/components/`: Reusable components (e.g., `DataTable`, `Button`, `navbar`, `footer`).
   - `src/pages/`: Page-level route views (organized by domain, e.g., `vault/`, `Expense/`, `admin/`).
   - `src/store/`: Redux Toolkit slices (`login.js`, `themeSlice.js`, `api.js`).
   - `src/utils/`: Shared utilities, cryptographic engines, layouts, and route guards.
2. **Backend Directory Structure**:
   - `server/modals/`: Mongoose model schemas.
   - `server/controller/`: Business logic per feature domain.
   - `server/middleware/`: Authentication and file upload middlewares.
   - `server/router/`: Express router registering controller handlers.
3. **Route Registration**:
   - All client routes must be registered in `Frontend/src/App.jsx` with appropriate protection wrapper (`ProtectedRoutes` or `AdminRoute`).
