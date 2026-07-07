# Portfolio — Joseph C. Alcantara

Personal portfolio website for a Senior Software Engineer. Deployed to AWS S3 at https://www.alcantarajoseph.com/.

## Tech Stack

- Angular 18 (standalone components, no NgModules)
- TypeScript 5.4 (strict mode)
- Plain CSS with custom properties (no SCSS)
- Karma + Jasmine for tests
- ESLint (`eslint.config.mjs`)

## Project Structure

```
src/app/
  app.component.ts        # Root shell — renders <app-home>
  app.config.ts           # Bootstrap config (provideRouter, provideAnimationsAsync)
  app.routes.ts           # Routes array (currently empty; nav uses anchor links)
  home/                   # Single-page content component (all visible UI)
  interface/              # Shared TypeScript interfaces
public/assets/
  experiences.json        # Source of truth for work history
  Alcantara-Joseph-Resume.pdf
src/
  styles.css              # CSS custom properties (:root) and base resets
  index.html              # SEO meta tags and canonical URL
.github/workflows/
  main.yml                # CI: lint → build:prod → sync to S3
```

## Build & Test Commands

```bash
npm start                 # Dev server at localhost:4200
npm run build             # Production build → dist/portfolio-joseph/browser/
npm run build:prod        # Explicit production build
npm run build:uat         # UAT configuration build
npm test                  # Karma tests (Chrome)
npm run watch             # Dev build with file watching
```

CI runs `npx eslint src/**` before building. The build enforces budget limits:
initial bundle ≤ 500 kB (error at 1 MB), component styles ≤ 2 kB (error at 4 kB).

## Key Files

- `src/app/home/home.component.ts:1` — main component; owns SEO meta injection and experience data
- `src/app/interface/experience.ts:1` — `Experience` interface (id, date, position, company, description, skills)
- `public/assets/experiences.json:1` — edit here to update work history
- `angular.json:1` — asset pipeline, build configs, budget limits
- `.github/workflows/main.yml:1` — full CI/CD pipeline (lint, build, S3 deploy)

## Deployment

GitHub Actions on push to `main`:
1. Lint (`npx eslint src/**`)
2. Build (`npm run build:prod`)
3. Upload `dist/portfolio-joseph/browser/` → `s3://www.alcantarajoseph.com` (ap-southeast-2)
   Cache-control: `max-age=0`

## Additional Documentation

| Topic | File |
|---|---|
| Architectural patterns & design decisions | `.claude/docs/architectural_patterns.md` |
