# Theme and Styling Rules — Accusoft

## 🎨 Theme Rules
1. **Never Hardcode Theme Colors**:
   - Do NOT use hardcoded colors like `bg-white` or `text-black` for main card containers and text.
   - Use CSS custom properties:
     - Background: `bg-[var(--theme-surface)]` or `bg-[var(--theme-page)]`
     - Text: `text-[var(--theme-content)]` or `text-[var(--contrast)]`
     - Borders: `border-[var(--theme-border)]`
     - Brand Accent: `bg-[var(--maincolor)]` or `text-[var(--maincolor)]`
2. **Dark Mode Compatibility**:
   - All interactive components must look flawless in both light and dark mode.
   - Tailwind `dark:` classes or CSS custom variables must be tested for contrast.
3. **Motion & Interaction**:
   - Use `framer-motion` for animated transitions (entering/exiting modals, list reorders, tab switches).
   - Add hover states, focus rings, and transitions on all buttons and interactive cards.
