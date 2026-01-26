# MACEOS Academy - UI Design System

> A comprehensive design reference for maintaining visual consistency across the MACEOS Academy platform.

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Components](#components)
6. [Icons](#icons)
7. [Effects & Animations](#effects--animations)
8. [Responsive Design](#responsive-design)
9. [Best Practices](#best-practices)

---

## Design Philosophy

MACEOS Academy follows a **dark-mode-first, premium executive aesthetic** that conveys:

- **Authority & Prestige** — Dark backgrounds with strategic green accents
- **Modern Tech-Forward** — Clean lines, subtle gradients, glass morphism effects
- **Professional Elegance** — Generous whitespace, refined typography hierarchy
- **Accessibility** — High contrast ratios for readability

The overall vibe is **"Elite Tech Academy"** — think premium SaaS meets Ivy League institution.

---

## Color System

### Primary Palette

| Token                     | Hex Value   | Usage                                      |
|---------------------------|-------------|--------------------------------------------|
| `--color-primary`         | `#12e269`   | Primary actions, accents, highlights       |
| `--color-primary-dark`    | `#0ea34e`   | Hover states for primary elements          |

### Background Colors

| Token                     | Hex Value   | Usage                                      |
|---------------------------|-------------|--------------------------------------------|
| `--color-background-dark` | `#102218`   | Page background, main canvas               |
| `--color-background-light`| `#f6f8f7`   | Reserved for light mode (if implemented)   |
| `--color-surface-dark`    | `#193324`   | Elevated surfaces, cards                   |
| `--color-surface-darker`  | `#0b1811`   | Card hover states                          |
| `--color-card-dark`       | `#192e25`   | Card backgrounds                           |

### Border & Decorative

| Token                     | Hex Value   | Usage                                      |
|---------------------------|-------------|--------------------------------------------|
| `--color-surface-border`  | `#234833`   | Borders, dividers, subtle separators       |

### Text Colors

| Token                     | Hex Value   | Usage                                      |
|---------------------------|-------------|--------------------------------------------|
| `text-white`              | `#ffffff`   | Primary headings, important text           |
| `--color-text-secondary`  | `#92c9a9`   | Secondary text, descriptions               |
| `text-gray-300`           | Tailwind    | Body text, paragraphs                      |
| `text-gray-400`           | Tailwind    | Muted text, labels                         |
| `text-gray-500`           | Tailwind    | Very muted text, fine print                |

### Accent Colors (Secondary)

| Color      | Usage                                           |
|------------|------------------------------------------------|
| Blue-500   | Alternative track badges, secondary accents    |
| Red-400/500| Warning states, alert icons                    |

### Color Application Rules

1. **Primary green (`#12e269`)** is reserved for:
   - Call-to-action buttons
   - Icons in active/hover states
   - Section labels and badges
   - Accent highlights

2. **Never use primary green for large background areas** — keep it as accent only

3. **Use opacity variants** for subtle effects:
   - `bg-primary/10` — Icon backgrounds
   - `bg-primary/20` — Badge backgrounds
   - `border-primary/50` — Hover border states

---

## Typography

### Font Families

| Token           | Font Stack                  | Usage                        |
|-----------------|-----------------------------|-----------------------------|
| `--font-display`| `"Space Grotesk", sans-serif` | Headings, UI labels, nav    |
| `--font-body`   | `"Noto Sans", sans-serif`     | Body text, descriptions     |

### Type Scale

| Element         | Classes                                              | Usage                     |
|-----------------|-----------------------------------------------------|---------------------------|
| Hero H1         | `text-4xl md:text-6xl lg:text-7xl font-bold`        | Main page headlines       |
| Section H2      | `text-3xl md:text-4xl lg:text-5xl font-bold`        | Section titles            |
| Card H3         | `text-xl md:text-2xl font-bold`                     | Card headings             |
| Card H4         | `text-lg font-bold`                                 | Subsection titles         |
| Body Large      | `text-lg md:text-xl font-light`                     | Hero descriptions         |
| Body            | `text-sm md:text-base`                              | General paragraphs        |
| Small/Caption   | `text-xs font-medium`                               | Labels, metadata          |
| Overline        | `text-xs font-bold uppercase tracking-widest`       | Section labels, badges    |

### Typography Rules

1. **Headlines** always use `font-bold` and `font-display`
2. **Body text** uses `font-body` when specified for readability
3. **Tracking** (`tracking-tight` to `tracking-widest`) varies:
   - Tight: Large headlines
   - Wide/Widest: Uppercase labels and badges
4. **Line height**: Use `leading-tight` for headlines, `leading-relaxed` for body

---

## Spacing & Layout

### Container System

```html
<!-- Standard page container -->
<div class="container mx-auto px-4 md:px-8 lg:px-12">

<!-- Max-width variants -->
<div class="mx-auto max-w-4xl">   <!-- Content-focused sections -->
<div class="mx-auto max-w-6xl">   <!-- Card grids -->
<div class="mx-auto max-w-7xl">   <!-- Full-width sections -->
```

### Section Spacing

| Pattern                    | Usage                              |
|----------------------------|-----------------------------------|
| `py-16 md:py-20`           | Standard section padding          |
| `py-20 md:py-24`           | Emphasized sections               |
| `py-20 md:py-32`           | Hero-like sections                |
| `gap-4`                    | Tight element spacing             |
| `gap-6 lg:gap-8`           | Card grid gaps                    |
| `space-y-4` / `space-y-6`  | Vertical stacking                 |
| `mb-12` / `mb-16`          | Section header to content gap     |

### Grid Patterns

```html
<!-- 3-column feature grid -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">

<!-- 2-column track grid -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">

<!-- 5-column sector grid (responsive) -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">

<!-- Stats grid -->
<div class="grid grid-cols-2 gap-4">
```

---

## Components

### Buttons

#### Primary Button
```html
<button class="flex items-center justify-center gap-2 h-12 px-8 bg-primary hover:bg-primary-dark text-background-dark text-base font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(18,226,105,0.2)]">
  <span>Label</span>
  <span class="material-symbols-outlined text-lg">arrow_forward</span>
</button>
```

#### Secondary/Outline Button
```html
<button class="flex items-center justify-center h-12 px-8 bg-transparent border border-white/20 hover:border-primary/50 hover:bg-white/5 text-white text-base font-bold rounded-lg transition-all backdrop-blur-sm">
  <span>Label</span>
</button>
```

#### Compact Button (Navbar)
```html
<a class="h-9 px-4 bg-primary hover:bg-primary-dark text-sm font-bold text-background-dark rounded-lg">
  Apply Now
</a>
```

### Cards

#### Feature Card
- Background: `bg-surface-dark hover:bg-surface-darker`
- Border: `border border-surface-border hover:border-primary/50`
- Radius: `rounded-xl`
- Padding: `p-8`
- Has top accent line on hover (1px gradient)
- Icon in rounded container with hover color swap

#### Track Card (Large)
- Background: `bg-card-dark`
- Border: `border border-white/10 hover:border-primary/50`
- Radius: `rounded-2xl`
- Features: Hero image with gradient overlay, badge, feature list
- Hover: `shadow-[0_0_30px_rgba(18,226,105,0.1)]`

#### Sector Card (Compact)
- Background: `bg-[#152820] hover:bg-[#1a3026]`
- Border: `border border-white/5 hover:border-primary/30`
- Radius: `rounded-xl`
- Padding: `p-6`

#### Stats Card (Outcome Grid)
- Background: `bg-linear-to-br from-background-dark to-surface-dark`
- Border: `border border-surface-border`
- Radius: `rounded-2xl`
- Padding: `p-6`

### Badges

#### Status Badge
```html
<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-border/50 border border-[#326748] backdrop-blur-sm">
  <span class="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
  <span class="text-primary text-xs font-bold uppercase tracking-widest">Label</span>
</div>
```

#### Category Badge
```html
<!-- Primary variant -->
<span class="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-primary/20 text-primary">
  Label
</span>

<!-- Blue variant -->
<span class="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-blue-500/20 text-blue-300">
  Label
</span>
```

### Accordion (ModuleAccordion)

```html
<details class="group rounded-xl border border-surface-border bg-surface-dark open:border-primary/50 transition-all">
  <summary class="flex cursor-pointer list-none items-center justify-between p-6">
    <!-- Icon + Title + Chevron -->
  </summary>
  <div class="px-6 pb-6 pt-2">
    <!-- Content with left border line -->
  </div>
</details>
```

### Section Headers

#### Standard Pattern
```html
<div class="text-center mb-16">
  <h2 class="text-3xl font-bold mb-4">Title</h2>
  <p class="text-text-secondary">Subtitle description</p>
</div>
```

#### With Decorative Lines
```html
<div class="flex items-center gap-3">
  <span class="h-px w-8 bg-primary/50"></span>
  <h2 class="text-primary text-sm font-bold tracking-widest uppercase">Label</h2>
  <span class="h-px w-8 bg-primary/50"></span>
</div>
```

#### With Side Description
```html
<div class="flex flex-col md:flex-row justify-between md:items-end gap-4 border-b border-surface-border pb-8">
  <div class="max-w-2xl">
    <h2 class="text-primary text-sm font-bold uppercase tracking-widest mb-3">Label</h2>
    <h3 class="text-3xl md:text-5xl font-bold text-white">Title</h3>
  </div>
  <p class="text-gray-400 text-lg max-w-lg md:text-right">Description</p>
</div>
```

---

## Icons

### Icon Library

**Google Material Symbols (Outlined)** — Variable font with customizable weight/fill.

### Icon Classes

```css
/* Base icon */
.material-symbols-outlined {
  font-variation-settings: "FILL" 0, "wght" 300, "GRAD" 0, "opsz" 24;
}

/* Filled icon variant */
.icon-filled {
  font-variation-settings: "FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24;
}
```

### Common Icon Sizes

| Size Class   | Usage                          |
|--------------|-------------------------------|
| `text-base`  | Inline with text, small UI    |
| `text-lg`    | Button icons                  |
| `text-xl`    | Navbar icons                  |
| `text-2xl`   | Card icons                    |
| `text-3xl`   | Feature icons, stats          |
| `text-4xl`   | Large decorative icons        |
| `text-8xl`   | Background decorative icons   |

### Icon Container Patterns

```html
<!-- Standard icon container -->
<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
  <span class="material-symbols-outlined">icon_name</span>
</div>

<!-- With hover effect -->
<div class="w-12 h-12 rounded-lg bg-surface-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background-dark transition-colors">
  <span class="material-symbols-outlined text-2xl">icon_name</span>
</div>
```

### Commonly Used Icons

| Category       | Icons                                                    |
|---------------|----------------------------------------------------------|
| Navigation    | `menu`, `close`, `arrow_forward`, `expand_more`          |
| Actions       | `school`, `assignment_ind`, `gavel`, `payments`          |
| Features      | `trending_up`, `memory`, `hub`, `public`, `timer`        |
| Industries    | `directions_car`, `flight_takeoff`, `directions_boat`    |
| Status        | `check_circle`, `warning`, `verified`, `verified_user`   |
| Misc          | `science`, `lightbulb`, `rocket_launch`, `credit_card`   |

---

## Effects & Animations

### Transitions

```css
/* Standard transition */
transition-all
transition-colors
transition-transform
transition-opacity

/* Durations */
duration-300    /* Default for most interactions */
duration-700    /* Slow image zooms */
```

### Shadows

```css
/* Primary glow (buttons, cards) */
shadow-[0_0_20px_rgba(18,226,105,0.2)]
shadow-[0_0_30px_rgba(18,226,105,0.1)]

/* Text glow */
.text-glow {
  text-shadow: 0 0 20px rgba(18, 226, 105, 0.3);
}
```

### Backdrop Effects

```css
backdrop-blur-sm    /* Subtle blur */
backdrop-blur-md    /* Medium blur (navbar) */
```

### Gradients

```css
/* Overlay gradient (hero images) */
bg-linear-to-b from-background-dark/80 via-background-dark/50 to-background-dark

/* Card overlay gradient */
bg-linear-to-t from-card-dark via-card-dark/50 to-transparent

/* Text gradient */
text-transparent bg-clip-text bg-linear-to-r from-white via-gray-200 to-gray-500

/* Surface gradient */
bg-linear-to-br from-background-dark to-surface-dark
```

### Background Patterns

```css
/* Subtle grid pattern */
bg-[linear-gradient(to_right,#23483320_1px,transparent_1px),linear-gradient(to_bottom,#23483320_1px,transparent_1px)]
bg-size-[4rem_4rem]
mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]
```

### Animations

```css
/* Pulse animation (badges) */
animate-pulse

/* Hover scale */
group-hover:scale-105
group-hover:scale-110
```

---

## Responsive Design

### Breakpoint Strategy

| Breakpoint | Prefix | Target Devices        |
|------------|--------|-----------------------|
| Default    | —      | Mobile (< 640px)      |
| `sm:`      | 640px  | Large phones          |
| `md:`      | 768px  | Tablets               |
| `lg:`      | 1024px | Laptops               |
| `xl:`      | 1280px | Desktops              |

### Mobile-First Patterns

```html
<!-- Typography scaling -->
<h1 class="text-4xl md:text-6xl lg:text-7xl">

<!-- Grid collapsing -->
<div class="grid grid-cols-1 md:grid-cols-3">

<!-- Show/hide elements -->
<nav class="hidden md:flex">
<div class="md:hidden">

<!-- Spacing adjustments -->
<section class="py-16 md:py-20">
<div class="px-4 md:px-8 lg:px-12">
```

### Responsive Component Variants

- **StatsBar**: Uses `variant="compact"` prop for mobile layout
- **Navbar**: Full mobile menu with slide-down panel
- **Cards**: Stack vertically on mobile, grid on desktop
- **Section headers**: Stack text/description on mobile, side-by-side on desktop

---

## Best Practices

### Do's ✓

1. **Use semantic color tokens** — `bg-primary`, `text-text-secondary`, not raw hex
2. **Maintain consistent spacing** — Use the established padding/gap patterns
3. **Apply hover states** — Cards and interactive elements should have visible feedback
4. **Use the established card patterns** — Don't invent new card styles
5. **Keep icons within their containers** — Always wrap in styled divs
6. **Test at all breakpoints** — Mobile experience is critical

### Don'ts ✗

1. **Don't use light backgrounds** — This is a dark-mode-only design
2. **Don't overuse the primary green** — It's an accent, not a primary surface
3. **Don't skip transitions** — All interactive elements need smooth state changes
4. **Don't mix font families arbitrarily** — Display for UI, body for content
5. **Don't create new component patterns** — Extend existing ones instead
6. **Don't use sharp corners on containers** — Minimum `rounded-lg`, prefer `rounded-xl` or `rounded-2xl`

### Component Checklist

When creating new components, verify:

- [ ] Uses correct background color from palette
- [ ] Has appropriate border styling
- [ ] Includes hover state with transition
- [ ] Icons are properly sized and colored
- [ ] Text hierarchy follows type scale
- [ ] Spacing matches established patterns
- [ ] Works on mobile breakpoints
- [ ] Uses `group` and `group-hover` for card interactions

---

## Quick Reference

### Copy-Paste Snippets

#### Section Container
```html
<section class="py-20 px-4 sm:px-6 lg:px-8 bg-background-dark">
  <div class="mx-auto max-w-6xl">
    <!-- Content -->
  </div>
</section>
```

#### Card Container
```html
<div class="group rounded-xl border border-surface-border bg-surface-dark hover:border-primary/50 p-6 transition-all">
  <!-- Content -->
</div>
```

#### Icon + Text Row
```html
<div class="flex items-center gap-4">
  <div class="p-2 bg-primary/10 rounded-lg text-primary">
    <span class="material-symbols-outlined">icon_name</span>
  </div>
  <div>
    <h4 class="font-bold text-white">Title</h4>
    <p class="text-sm text-text-secondary">Description</p>
  </div>
</div>
```

---

*Last updated: January 2026*
