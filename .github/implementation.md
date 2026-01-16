# MACEOS Academy - Vue/Nuxt 4 Implementation Plan

## Overview
Port the three HTML mockup files (code1.html, code2.html, code3.html) into a Nuxt 4 Vue application with proper component architecture, universal styling, and organized file structure ready for future dashboard expansion.

---

## 1. File Structure

```
app/
├── app.vue                    # Root app with NuxtPage
├── assets/
│   └── css/
│       └── main.css          # Universal Tailwind + fonts + custom utilities
├── components/
│   ├── landing/              # Landing page specific components
│   │   ├── HeroSection.vue
│   │   ├── StatsBar.vue
│   │   ├── MissionSection.vue
│   │   ├── ProgramTracks.vue
│   │   ├── CurriculumSection.vue
│   │   ├── OutcomesSection.vue
│   │   ├── IndustrySectors.vue
│   │   └── AdmissionsPath.vue
│   ├── layout/               # Shared layout components
│   │   ├── TheNavbar.vue     # Navigation (from code3.html style)
│   │   └── TheFooter.vue
│   └── ui/                   # Reusable UI components
│       ├── FeatureCard.vue
│       ├── StatCard.vue
│       ├── TrackCard.vue
│       ├── SectorCard.vue
│       └── ModuleAccordion.vue
├── layouts/
│   └── default.vue           # Default layout with navbar/footer
└── pages/
    └── index.vue             # Landing page
```

---

## 2. Tailwind Theme Configuration

### Colors (from HTML files)
```js
colors: {
  primary: "#12e269",
  "primary-dark": "#0ea34e",
  "background-light": "#f6f8f7",
  "background-dark": "#102218",
  "surface-dark": "#193324",
  "surface-darker": "#0b1811",
  "surface-border": "#234833",
  "card-dark": "#192e25",
  "text-secondary": "#92c9a9",
}
```

### Fonts
- **Display/Headings**: Space Grotesk (300-700)
- **Body**: Noto Sans (400-700)

---

## 3. Universal Styling (main.css)

1. Import Tailwind CSS
2. Import Google Fonts (Space Grotesk, Noto Sans, Material Symbols)
3. Define custom Tailwind theme via `@theme`
4. Add utility classes:
   - `.text-glow` - green text shadow
   - `.icon-filled` - Material icon filled style
   - Scrollbar hide utility

---

## 4. Navigation (from code3.html)

### Links to sections:
| Link | Target Section |
|------|----------------|
| Curriculum | #curriculum |
| Programs | #programs |
| Admissions | #admissions |
| Research | #outcomes |

### Features:
- Sticky header with backdrop blur
- Logo with school icon
- Mobile hamburger menu (placeholder)
- "Apply Now" CTA button

---

## 5. Landing Page Sections (in order)

### Section 1: Hero (from code1.html)
- Full-width background image with gradient overlay
- "Admissions Open" badge with pulse animation
- Main headline with gradient text
- Description paragraph
- Two CTA buttons (Apply, Download Prospectus)

### Section 2: Stats Bar (from code1.html)
- Horizontal layout with 3 stats
- Icons: public, workspace_premium, groups
- Values: 50+ Partners, Top 1% Ranking, 200+ Mentors

### Section 3: Mission Pillars (from code1.html)
- Grid background pattern
- Section header with "Our Vision" label
- 3 feature cards with hover effects
- Icons: trending_up, memory, hub

### Section 4: Program Tracks (from code2.html)
- Two-column card layout
- Static Track (6 months, cohort-based)
- Dynamic Track (2 years, self-paced)
- Background images with hover scale effect

### Section 5: Industry Sectors (from code2.html)
- Bento grid layout (5 columns on desktop)
- Sectors: Automotive, Aviation, Maritime, AI Mobility, Space
- Hover effects on cards

### Section 6: Curriculum Modules (from code3.html)
- Accordion/details components
- 3 modules with expandable content
- Module 1: Strategic EV Markets
- Module 2: Innovation & Autonomous Systems
- Module 3: Global Supply Chain Leadership

### Section 7: Outcomes (from code3.html)
- Two-column layout
- Left: Description + feature cards
- Right: Stats grid (94%, 500+, Innovation highlight)

### Section 8: Admissions Path (from code3.html)
- 3-step horizontal timeline
- Steps: Application Review, Committee Approval, Secure Enrollment
- Code of Conduct card with CTA

### Section 9: Footer
- Brand logo
- Links: Privacy, Terms, Contact
- Copyright

---

## 6. Component Props Design

### FeatureCard.vue
```ts
props: {
  icon: string
  title: string
  description: string
}
```

### StatCard.vue
```ts
props: {
  icon: string
  value: string
  label: string
}
```

### TrackCard.vue
```ts
props: {
  badge: string
  badgeColor: 'primary' | 'blue'
  title: string
  subtitle: string
  features: Array<{icon: string, title: string, description: string, variant?: 'warning'}>
  image: string
  ctaText: string
  ctaVariant: 'primary' | 'outline'
}
```

### ModuleAccordion.vue
```ts
props: {
  icon: string
  title: string
  subtitle: string
  content: string
  checkpoints?: string[]
  defaultOpen?: boolean
}
```

---

## 7. Animation Guidelines (Minimal)

Keep animations subtle:
- **Hover transitions**: 300ms for colors, borders, transforms
- **Scale on hover**: max 1.05 scale factor
- **No heavy animations**: Remove pulse animations except for status indicators
- **Accordion**: Simple rotate on chevron icon

---

## 8. Implementation Order

1. ✅ Create implementation.md (this file)
2. Set up main.css with Tailwind theme and fonts
3. Update nuxt.config.ts (fix CSS path)
4. Create default layout with TheNavbar and TheFooter
5. Create reusable UI components
6. Create landing page section components
7. Assemble index.vue page
8. Test and verify all sections work

---

## 9. Notes

- Use `<NuxtLink>` for internal navigation
- Use smooth scroll for section navigation
- Dark mode is default (class="dark" on html)
- Material Symbols Outlined for all icons
- Mobile responsive design preserved from HTML
- No external dependencies needed beyond Tailwind
