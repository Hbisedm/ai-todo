# TODO Web UI Polish Design

**Context**
- Current i18n/theme functionality is working, but the visual presentation feels inconsistent.
- The marketing page, auth pages, and dashboard do not yet share one clean product-style visual system.
- The global `main` layout rules are too broad and make the landing page feel overly centered and structurally flat.

**Goal**
- Refine the UI toward a product-oriented SaaS style that still feels portfolio-ready.
- Improve layout rhythm, spacing, card hierarchy, and control consistency without changing core functionality.
- Keep the current locale and theme systems intact.

## Chosen Direction

Use the recommended “Scheme 1” direction:
- More product-like and stable
- Less overly centered / poster-like
- Better visual hierarchy across marketing, auth, and dashboard surfaces

## Visual Intent

### Overall style
- Clean SaaS landing page
- Structured rather than dramatic
- Stronger grid, calmer spacing, more consistent card treatment
- One shared design language across landing, auth, and dashboard

### Desired feel
- Professional
- Trustworthy
- Portfolio-quality
- Modern, but not flashy

## Scope

### Marketing page
- Convert the hero into a proper two-column layout on desktop
- Keep stacked layout on smaller screens
- Improve spacing between hero, features, and preview sections
- Make the preview area read more like a compact product summary
- Improve card alignment and balance in the feature section

### Header
- Tighten spacing and width behavior
- Make language/theme controls feel like product toolbar controls
- Keep auth CTA visible but less visually noisy

### Auth pages
- Preserve centered flow but make the page feel less sparse
- Align auth card width, spacing, and surface treatment with the rest of the system
- Improve surrounding page framing so the card doesn’t appear to float awkwardly

### Global layout system
- Remove broad `main` rules that affect all routes equally
- Introduce route-specific layout behavior for marketing/auth/dashboard
- Normalize section widths, padding, radii, shadows, and gaps

## Non-goals
- No new product features
- No new components beyond what is needed to refine layout/styling
- No rebrand / illustration system / animation-heavy redesign
- No dashboard information architecture changes

## CSS Strategy

### Core change
Reduce global layout side effects and move toward page-specific layout classes.

### Planned approach
- Keep tokens in `app/globals.css`
- Narrow the generic `main` styling so it stops driving all route layouts
- Add stronger page-level classes for:
  - marketing shell / sections
  - auth page shell
  - dashboard page shell
- Reuse the current semantic theme variables instead of introducing a new styling system

## Component adjustments

### `components/layout/site-header.tsx`
- No structural behavior change
- Styling tuned for better spacing, alignment, and control grouping

### `components/marketing/hero-section.tsx`
- Keep existing content
- Improve visual composition for left/right split
- Better preview card stacking and sizing

### `components/marketing/feature-grid.tsx`
- Preserve content
- Improve equal-height card presentation and section spacing

### `components/marketing/product-preview.tsx`
- Preserve content
- Improve hierarchy between copy and stats/list preview

### Auth pages
- Keep form behavior intact
- Use layout framing from page/container styles instead of ad hoc centering

## Testing strategy

### Functional verification
- Existing auth/theme/locale behavior must continue to work
- Existing targeted E2E coverage should remain green

### Visual regression confidence
- Add at least one E2E assertion covering the refined landing structure, such as key heading + CTA + feature/preview visibility
- Manually inspect `/en`, `/en/login`, and `/zh/app` in the browser after styling changes

## Risks
- Over-broad CSS edits could unintentionally affect dashboard/auth pages
- Marketing and auth layout changes could regress responsive behavior
- Hydration/theme fixes already in progress should not be disturbed by UI polish changes

## Acceptance criteria
- Landing page reads as a two-column SaaS landing page on desktop
- Header feels more polished and consistent with the rest of the product
- Auth page framing feels intentional rather than sparse
- Dashboard remains visually consistent with the refined system
- Locale/theme/auth flows still work
