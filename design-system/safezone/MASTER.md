# Design System Master File — SafeZone Frontend

> **LOGIC:** When building a specific page, first check `design-system/safezone/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file. Otherwise, use this Master file exclusively.

---

**Project:** SafeZone Institutional Dashboard
**Theme Style:** Soft UI Evolution + Linear/Stripe Style
**Layout Style:** Bento Grid Layout
**Generated:** 2026-05-28
**Target Stack:** Angular 17+ / Standalone Components / Vanilla CSS

---

## 🎨 Global Design Tokens

### 1. Color Palette (Linear + Stripe + OLED Dark Mode)

#### Light Mode Palette:
| Token Name | Hex Code | CSS Variable | Purpose |
|:---|:---|:---|:---|
| **Primary Navy** | `#0f172a` (slate-900) | `--color-primary` | Headings, primary branding, dark sidebars |
| **Secondary Slate** | `#475569` (slate-600) | `--color-secondary` | Body text, icons, subtext |
| **Accent Blue** | `#3b82f6` (blue-500) | `--color-accent` | Primary actions, links, active states |
| **Accent Glow** | `#60a5fa` (blue-400) | `--color-accent-glow` | Hover glows, soft outlines |
| **Success Emerald** | `#10b981` (emerald-500) | `--color-success` | Positive states, safe alerts, badges |
| **Warning Amber** | `#f59e0b` (amber-500) | `--color-warning` | Pending, medium risk, warning badges |
| **Destructive Red** | `#ef4444` (red-500) | `--color-destructive` | Emergencies, logs, high risk badges |
| **App Background** | `#f8fafc` (slate-50) | `--color-background` | Global main view background |
| **Card Background** | `#ffffff` | `--color-card` | White bento cards |
| **Sidebar Background**| `#0f172a` (slate-900) | `--color-sidebar` | Deep navy sidebar |
| **Border Slate** | `#e2e8f0` (slate-200) | `--color-border` | Light, crisp borders |

#### OLED Dark Mode Palette:
| Token Name | Hex Code | CSS Variable | Purpose |
|:---|:---|:---|:---|
| **OLED Black** | `#000000` | `--color-primary-dark` | Full black base background |
| **Midnight Gray** | `#121212` | `--color-bg-dark` | Deep dark grey for widgets and cards |
| **Luminous Text** | `#f8fafc` (slate-50) | `--color-text-dark` | Main body/heading text in dark mode |
| **Muted Dark Gray** | `#334155` (slate-700) | `--color-border-dark` | Dark crisp borders |
| **Glow Accent** | `#3b82f6` | `--color-accent-dark` | Glowing blue actions |

---

### 2. Spacing Variables (Spacious & Balanced)
Generous margins and paddings to allow content to breathe (Linear spacing system):

| Token | Value | Rem Equivalent | Primary Usage |
|:---|:---|:---|:---|
| `--space-xs` | `4px` | `0.25rem` | Badge padding, micro gaps |
| `--space-sm` | `8px` | `0.5rem` | Icon-to-text spacing, small gap |
| `--space-md` | `16px` | `1.0rem` | Small card padding, gap within items |
| `--space-lg` | `24px` | `1.5rem` | Bento Card padding, grid gap, standard padding |
| `--space-xl` | `32px` | `2.0rem` | Page margins, container padding |
| `--space-2xl`| `48px` | `3.0rem` | Section offsets, large hero margins |

---

### 3. Typography (Google Font Outfit + Inter)
Clean sans-serif fonts optimized for corporate/security platforms:

*   **Heading Font:** `Outfit`, sans-serif (weights: 500, 600, 700)
*   **Body Font:** `Inter`, sans-serif (weights: 400, 500, 600)
*   **Google Fonts Import:**
    ```css
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@500;600;700&display=swap');
    ```

---

### 4. Shadows & Soft UI Depth
Softer than default flat shadows but clearer than pure neumorphism (avoiding low contrast issues):

*   **`--shadow-soft`**: `0 2px 8px -1px rgba(15, 23, 42, 0.03), 0 4px 20px -2px rgba(15, 23, 42, 0.05)` (Standard card lift)
*   **`--shadow-hover`**: `0 10px 25px -3px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.03)` (Card hover lift)
*   **`--shadow-active`**: `inset 0 2px 4px rgba(15, 23, 42, 0.06)` (Pressed states)
*   **`--border-radius-card`**: `16px` (Modern organic rounded corners)
*   **`--border-radius-input`**: `10px`

---

## 📐 Component-Specific Specifications

### 1. Buttons
*   **Primary Button:** Background in blue accent (`#3b82f6`), white text, `8px` padding. Transitions smoothly on hover (scale factor `1.01` and active scale down `0.98`).
*   **Secondary Button:** Transparent background, `1px solid var(--color-border)` and accent color text.
*   **Outline/Linear Button:** Clean border, light shadow, and micro icon alignment.

```css
.btn {
  padding: 10px 18px;
  font-family: 'Outfit', sans-serif;
  font-weight: 600;
  border-radius: 10px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.btn:active {
  transform: scale(0.98);
}
```

---

### 2. Tables (DataTable Premium)
*   **Row Spacing:** Comfortable row padding (`12px 16px`) and Compact option (`8px 12px`).
*   **Sticky Header:** Table header (`thead th`) must remain sticky when scrolling vertically.
*   **Aesthetic Details:** Thin `1px` lines, borderless sides, and a subtle glowing row highlight on hover.

```css
.sz-table {
  width: 100%;
  border-collapse: collapse;
}

.sz-table th {
  position: sticky;
  top: 0;
  background-color: var(--color-background);
  z-index: 10;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border);
}

.sz-table tbody tr {
  border-bottom: 1px solid var(--color-border);
  transition: background-color 0.2s ease;
}

.sz-table tbody tr:hover {
  background-color: rgba(59, 130, 246, 0.04);
}
```

---

### 3. Forms & Inputs (Floating Labels & Validation)
*   **Inputs:** Thin border, minimal background tint, rounded corner curves.
*   **Focus Ring:** Glowing `3px` light blue outline (`rgba(59, 130, 246, 0.15)`).
*   **Validation States:** Explicit green (`--color-success`) and red (`--color-destructive`) border states on validation events.

```css
.form-input {
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 12px 16px;
  transition: all 0.2s ease;
}

.form-input:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  outline: none;
}
```

---

### 4. Modals & Overlays
*   **Overlay Background:** Dark slate background with a blurred layer (`backdrop-filter: blur(6px)`).
*   **Scale Entrance:** Modal grows from `scale(0.95)` to `scale(1)` in `200ms`.

```css
.modal-overlay {
  background-color: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  border-radius: 16px;
  box-shadow: var(--shadow-hover);
  animation: modalScaleIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modalScaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
```

---

### 5. Alerts & Notifications
*   **Alert Container:** Thin borders, soft solid background fills, and contextual symbols (errors, success, tips).
*   **Badge States:** Micro indicator dot tags with soft colored glowing text blocks.

```css
.alert-banner {
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  gap: 12px;
}
```

---

### 6. Cards & Bento Grid (Linear + Stripe)
*   **Bento Grid Grid:** `grid-template-columns: repeat(12, 1fr)`.
*   **Card Styling:** White background, thin border, soft drop-shadow, lifting slightly on hover.

---

## ♿ Accessibility & Responsive Layouts

### 1. Responsive Viewports
*   **Mobile:** `<= 768px` (gaps down to `16px`, sidebar hidden, navigation toggles active).
*   **Tablet:** `768px` to `1024px` (grid switches columns where needed).
*   **Desktop:** `>= 1024px` (gaps standard `24px` or `32px`).

### 2. Accessibility Compliance (WCAG AA)
*   **Contrast:** All body text must maintain a minimum `4.5:1` contrast ratio.
*   **Outline Navigation:** Interactive elements must render a clear, visible focus outline (`:focus-visible`) for keyboard navigation.
*   **No Emojis as Icons:** Emojis are forbidden as functional interface icons. Use high-definition SVG icons instead.
*   **Motion Settings:** Respect user preferences via media queries:
    ```css
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
      }
    }
    ```
