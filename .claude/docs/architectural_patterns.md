# Architectural Patterns

## Standalone Components (no NgModules)

All components use `standalone: true` and declare their own imports inline.
- `src/app/app.component.ts:8` — root standalone component
- `src/app/home/home.component.ts:8` — feature standalone component

New components must be added to the `imports` array of whichever parent component renders them; there is no shared module to register them in.

## Static JSON Import for Data

Content data is statically imported at compile time — no HTTP calls, no services, no state management library.

```
public/assets/experiences.json
  → imported directly in home.component.ts:5
  → assigned to a typed component property (Experience[])
  → rendered via *ngFor in home.component.html
```

To add or update experience entries, edit `public/assets/experiences.json` only. The shape is enforced by `src/app/interface/experience.ts`.

This pattern means all data is bundled; there is no lazy-loading or runtime fetching.

## SEO / Meta Management in ngOnInit

`home.component.ts` (the only page component) owns all SEO concerns:
- Angular `Title` service sets the page title — `home.component.ts:21`
- Angular `Meta` service injects `<meta>` tags (description, OG, Twitter) — `home.component.ts:22`
- A private method appends a `<script type="application/ld+json">` Schema.org Person block to `<head>` — `home.component.ts` (`addStructuredData`)

If more route-level pages are added, this pattern should be replicated per-component (not centralized), since each page controls its own head metadata.

## CSS Custom Properties for Theming

All design tokens are declared as CSS custom properties on `:root` in `src/styles.css`. Component stylesheets (`home.component.css`) reference these variables directly — no SCSS variables or a separate theme file.

Key tokens (defined in `src/styles.css:1`):
- `--primary-color` — dark navy background
- `--secondary-color` — cyan accent
- `--text-color` — body text gray
- `--highlight-color` — emphasized text white

Add new tokens in `src/styles.css`; do not hard-code color values in component stylesheets.

## Single Anchor-Based Navigation (No Router)

`src/app/app.routes.ts` has an empty routes array. All navigation uses HTML anchor links (`#about`, `#experience`, `#contact`) targeting `id` attributes within `home.component.html`. CSS `scroll-behavior: smooth` handles scrolling.

Router guards, resolvers, and lazy-loaded modules are not used and should not be introduced unless the site gains multiple distinct pages.

## Interface-Driven Typing

Data model types live in `src/app/interface/` and are imported wherever that data is consumed.
- `src/app/interface/experience.ts` — `Experience` interface used in `home.component.ts`

Keep interfaces in this directory. Do not inline type definitions inside component files.
