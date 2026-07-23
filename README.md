# CanSoft Solutions — React Landing Page

A React + Vite + Tailwind rebuild of the CanSoft Solutions landing page, matching the original design theme (colors, typography, glass cards).

## Sections
- **Hero** — headline + CTA buttons
- **About** — company stats and intro
- **Projects (Portfolio)** — filterable grid of all AI projects; click any card to open a full case-study detail page (`/projects/:id`) with overview, highlights, tools, and gallery
- **Contact** — working form UI (client-side only)

## Getting started

```bash
npm install
npm run dev       # start local dev server
npm run build     # production build -> dist/
npm run preview   # preview the production build
```

## Project structure

```
src/
  components/   Navbar, Hero, About, Projects, ProjectCard, Contact, Footer
  pages/        Home.jsx, ProjectDetail.jsx
  data/         projectsData.js (all 20 project entries)
  hooks/        useReveal.js (scroll-reveal animation)
```

## Notes
- Routing is handled by `react-router-dom`. Each project links to `/projects/:id`.
- Design tokens (colors, spacing, font sizes) are configured in `tailwind.config.js` to match the original theme exactly.
- The contact form currently shows a success state on submit; wire it up to your backend/email service of choice.
