# Even Butter Bake Shop Website — Implementation Plan

> **For agentic workers:** Build a static Astro site per the approved spec at
> `docs/superpowers/specs/2026-06-14-even-butter-website-design.md`. Steps use checkbox
> (`- [ ]`) syntax for tracking. Verification for this frontend project = the site builds
> cleanly (`npm run build`) and renders correctly in a browser preview (no console errors,
> sections present, responsive), in place of unit tests.

**Goal:** Ship a soft-pastel, single-page Astro brand site for Even Butter Bake Shop with a
waitlist form and GitHub Pages auto-deploy.

**Architecture:** Astro static site. One `Layout` defines design tokens + fonts. Sections are
components. The 8 flavors come from a single data file mapped into `FlavorCard`s. Source
sticker art is cropped out of MUNBYN screenshots into clean transparent PNGs. Waitlist posts
to Formspree (placeholder ID until launch). Deploy via GitHub Actions to Pages with a CNAME.

**Tech Stack:** Astro, vanilla CSS (custom properties), Google Fonts (Fredoka, Nunito,
Caveat), Python+Pillow (one-time asset crop), GitHub Actions.

---

## File structure

```
even-butter-site/
├─ astro.config.mjs            # site URL, build config
├─ package.json
├─ public/
│  ├─ CNAME                    # evenbutterbakeshop.com
│  ├─ favicon.svg
│  └─ images/
│     ├─ logo.png             # cropped main logo
│     ├─ marcel.png           # cropped van/cow mascot
│     └─ flavors/*.png        # 8 cropped flavor stickers
├─ scripts/
│  └─ crop_stickers.py         # one-time: crop circle art from resources/ screenshots
├─ src/
│  ├─ layouts/Layout.astro     # html shell, fonts, tokens, global css
│  ├─ styles/global.css        # tokens + base styles
│  ├─ data/flavors.js          # single source of truth (8 flavors)
│  ├─ components/
│  │  ├─ Hero.astro
│  │  ├─ MeetTheBaker.astro
│  │  ├─ FlavorCard.astro
│  │  ├─ FlavorMenu.astro
│  │  ├─ MarcelBand.astro
│  │  ├─ Waitlist.astro
│  │  ├─ SocialLinks.astro
│  │  └─ Footer.astro
│  └─ pages/index.astro        # assembles the sections
└─ .github/workflows/deploy.yml
```

---

## Task 1: Scaffold Astro project
- [ ] Create a minimal Astro project in the repo root (manual scaffold to avoid interactive CLI).
- [ ] `package.json` with `astro` dev/build/preview scripts; `astro.config.mjs` with
      `site: 'https://evenbutterbakeshop.com'`.
- [ ] `npm install`.
- [ ] Verify: `npm run build` succeeds on a placeholder `src/pages/index.astro`.

## Task 2: Crop sticker assets
- [ ] Write `scripts/crop_stickers.py` (Pillow): for each `resources/*.jpeg`, crop the
      circular sticker region (fixed box tuned to the 1018×1984 MUNBYN layout), then make the
      near-white background transparent so the cocoa ink art sits on pastel. Map filenames →
      `logo`, `marcel`, and the 8 flavor slugs.
- [ ] Run it; output to `public/images/`.
- [ ] Verify: open 2–3 outputs, confirm clean circular art with transparent background.

## Task 3: Design system (Layout + tokens + fonts)
- [ ] `src/styles/global.css`: CSS custom properties for palette (cream/butter/blush/sage/
      cocoa), font families, radii, spacing; base resets; `prefers-reduced-motion` guard.
- [ ] `src/layouts/Layout.astro`: html shell, meta/SEO/OG tags, Google Fonts links (Fredoka,
      Nunito, Caveat), favicon, imports global.css. Props: `title`, `description`.
- [ ] Verify: build succeeds; a test page shows the fonts + cream background.

## Task 4: Flavor data + FlavorCard + FlavorMenu
- [ ] `src/data/flavors.js`: array of 8 `{ name, slug, sticker, description }` with warm
      one-line descriptions (marked as draft copy).
- [ ] `FlavorCard.astro`: pastel rounded card, round sticker image, name, description, optional
      photo slot. `MarcelBand`-independent.
- [ ] `FlavorMenu.astro`: responsive grid mapping flavors → cards.
- [ ] Verify: grid renders all 8 with stickers, responsive at mobile + desktop widths.

## Task 5: Hero, MeetTheBaker, MarcelBand
- [ ] `Hero.astro`: logo + Marcel, tagline, "Notify me" button (anchors to #waitlist).
- [ ] `MeetTheBaker.astro`: warm draft bio, Pepper paw-print cameo, optional photo slot.
- [ ] `MarcelBand.astro`: van illustration + "deliveries coming soon" charm strip.
- [ ] Verify: sections render, alt text present, motion respects reduce-motion.

## Task 6: Waitlist, SocialLinks, Footer
- [ ] `Waitlist.astro`: `#waitlist` form (name + email + honeypot) posting to Formspree
      placeholder action; progressive-enhancement JS for inline success message.
- [ ] `SocialLinks.astro`: Instagram + TikTok links, "coming soon" state.
- [ ] `Footer.astro`: logo, "made with butter & love," paw print, copyright.
- [ ] Verify: form keyboard-navigable; submitting (JS on) shows inline confirmation.

## Task 7: Assemble index page
- [ ] `src/pages/index.astro`: import Layout + all sections in spec order.
- [ ] Verify in browser preview: full scroll, no console errors, mobile + desktop + check
      contrast of cocoa-on-cream.

## Task 8: Deploy config
- [ ] `public/CNAME` = `evenbutterbakeshop.com`; favicon.
- [ ] `.github/workflows/deploy.yml`: Astro → GitHub Pages on push to default branch.
- [ ] Push to `origin`; document the exact DNS records (apex A records + `www` CNAME) for the
      registrar in the final summary.

---

## Self-review against spec
- Purpose/goals (brand presence, waitlist, social) → Tasks 5/6.
- Brand identity, palette, type, motion → Tasks 2/3.
- Section structure (7 sections) → Tasks 4/5/6/7.
- Astro + components + flavors data → Tasks 1/3/4.
- Waitlist (Formspree, no-JS fallback) → Task 6.
- Asset crop → Task 2.
- Hosting/deploy + DNS → Task 8.
- Accessibility (AA, reduce-motion, alt, keyboard) → Tasks 3/5/6/7.
All spec sections covered.
