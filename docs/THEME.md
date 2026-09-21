# Accusoft — Theme & Design System Documentation

## 🎨 Design Philosophy
Accusoft uses a cohesive, modern UI featuring:
- Seamless **Light / Dark Mode** switching powered by Redux (`themeSlice.js`) and `.dark` CSS selector on `<html>`.
- Dynamic accent color customization via `--maincolor`.
- Glassmorphism, smooth micro-interactions (`framer-motion`), and accessible contrast ratios.

---

## 🖌️ CSS Variables System (`Frontend/src/index.css`)

### Page & Surface Tokens (Tailwind v4 mapped)
| Variable | Light Theme | Dark Theme | Purpose |
| :--- | :--- | :--- | :--- |
| `--theme-page` | `#f1f5f9` | `#0f172a` | Main page background |
| `--theme-surface` | `#f8fafc` | `#1e293b` | Card & container surfaces |
| `--theme-content` | `#334155` | `#f8fafc` | Primary typography & icons |
| `--theme-border` | `#e2e8f0` | `#334155` | Subtle container borders |

### Dynamic Custom Property Tokens
| Variable | Light Mode | Dark Mode | Usage |
| :--- | :--- | :--- | :--- |
| `--maincolor` | Dynamic (`#0a3d62`) | Dynamic (`#172138`) | Primary brand accent, button background |
| `--hovercolor` | `#012336` | `#323232` | Hover state for buttons/links |
| `--cardBackground`| `#dbe1e6` | `#0F172A` | Elevated cards |
| `--background` | `#f0f0f0` | `#222222` | Modal wrapper background |
| `--contrast` | `#151516` | `#d1d1d1` | High contrast text / icons |
| `--tableborder` | `rgb(190, 185, 185)` | `rgb(73, 72, 72)` | Table grid lines |
| `--editicon` | `rgb(7, 120, 182)` | `rgb(7, 120, 182)` | Edit action color |
| `--deleteicon` | `rgb(220, 7, 25)` | `rgb(220, 7, 25)` | Delete / destructive action |

### Layout Dimensions
| Variable | Value (Desktop) | Value (Mobile) |
| :--- | :--- | :--- |
| `--navheight` | `70px` | `50px` |
| `--sidebarwide` | `210px` | `210px` |
| `--sidebarnarrow`| `80px` | `80px` |
| `--footerheight` | `25px` | `20px` |

---

## 🌓 Dark Mode Implementation Pattern

In React components, leverage Tailwind's `dark:` variant and CSS custom properties:
```jsx
<div className="bg-[var(--theme-surface)] text-[var(--theme-content)] border border-[var(--theme-border)] rounded-2xl p-6 shadow-lg transition-colors duration-300">
  <h2 className="text-xl font-semibold text-[var(--contrast)]">Component Title</h2>
  <button className="bg-[var(--maincolor)] hover:opacity-90 text-white px-4 py-2 rounded-xl transition-all">
    Action
  </button>
</div>
```

---

## ✨ Micro-Animations & UI Components
- **Modals**: Glassmorphism backdrop (`backdrop-filter: blur(8px); background: rgba(0,0,0,0.4)`).
- **Tooltips / Badges**: Use rounded pill tags with subtle opacity tints (`bg-emerald-500/15 text-emerald-600 dark:text-emerald-400`).
- **Icons**: Always import from `lucide-react`.
