# Coding Standards & Guidelines — Accusoft

## 💻 Frontend (React 19 + Vite)
1. **Functional Components**: Use modern functional components with hooks (`useState`, `useEffect`, `useCallback`, `useMemo`, `useSelector`, `useDispatch`).
2. **Lazy Loading**: Route pages in `App.jsx` must use `React.lazy()` and Suspense to keep the initial bundle lightweight.
3. **Icons**: Always import icons from `lucide-react` with descriptive names.
4. **Notifications**: Use `sonner` / `toast` for modern toast alerts.
5. **State Management**:
   - Complex global state (auth, theme) belongs in Redux (`Frontend/src/store/`).
   - Ephemeral UI states (modals, active tabs, form inputs) belong in local component state.

---

## ⚙️ Backend (Node.js + Express 5 + Mongoose 9)
1. **Controller Pattern**: Keep route handlers in `server/controller/` and wire them cleanly in `server/router/route.js`.
2. **Error Handling**: Use `try/catch` and pass errors to Express error handler middleware (`next({ statusCode, message })`).
3. **Mongoose Queries**: Always index queried fields (e.g., `userId`, `email`) and use `.lean()` for read-only queries.
4. **Async Middleware**: Authenticated routes must use `authmiddlewre` to inject `req.userid` and `req.user`.
