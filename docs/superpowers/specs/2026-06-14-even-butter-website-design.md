# Even Butter Bake Shop — Website Design Spec

**Date:** 2026-06-14
**Domain:** evenbutterbakeshop.com (owned)
**Repo:** github.com/MistaJoka/EvenButter-Site (local: `~/gitRepos/EvenButter-site`)
**Status:** Approved design — ready for implementation planning

---

## 1. Purpose & goals

A pre-launch brand-presence site for Even Butter Bake Shop, a small-batch home bakery
run by the owner's wife. She is not taking orders yet. The site exists to:

1. **Represent the brand** — show her style, vibe, and offerings beautifully.
2. **Capture a waitlist** — a "notify me" form so interested visitors can be told when
   orders open. Signups go to her inbox via a no-backend form service.
3. **Point to social** — Instagram/TikTok links, marked "coming soon" until accounts exist.

No e-commerce, no ordering, no prices in this phase. Mobile-first (most visitors arrive
on a phone).

### Non-goals (YAGNI)
- No shopping cart, payments, or order management.
- No CMS or admin UI — content lives in the repo as data/markdown.
- No blog (can be added later; Astro supports it cleanly when wanted).
- No user accounts or backend server.

---

## 2. Brand identity

**Even Butter Bake Shop** — playful, cozy, hand-drawn, indie home-baker. Cookies and
small treats.

- **Logo:** "Even" in a small script, **BUTTER** in big bouncy hand-drawn bubble letters,
  "Bake Shop" in small handwriting, all inside a sketchy double-circle stamp ring. Black ink.
- **Mascot:** **Marcel** — a doodled cow in a chef's hat driving a delivery van with a gift
  box on top. The heart of the brand's personality.
- **Owner's personality** (drives the aesthetic): soft, kind, hardworking, does things the
  right way, organized, loves cute things, loves baking. Likes soft colors and calm,
  non-overstimulating spaces. Fan of Smoko (kawaii) figures.
- **Pepper** — her Boston Terrier. Appears as a small recurring cameo (doodle / paw print).

### Design language
- **Aesthetic:** her crisp black-ink hand-drawn logo and stickers placed on soft pastel
  backgrounds. Kawaii cuteness (Smoko-style: rounded, soft) without clutter. Calm and tidy,
  reflecting that she does things "the right way."

### Palette
| Name  | Hex      | Role |
|-------|----------|------|
| Cream | `#FBF4E6` | Page background / canvas |
| Butter| `#F6D87A` | Warm primary accent |
| Blush | `#F6C6CE` | Soft secondary accent |
| Sage  | `#C9DBC4` | Soft secondary accent |
| Cocoa | `#4A3429` | Ink — text, logo, illustrations (warm brown, not harsh black) |

These are starting values; exact shades may be nudged during build for contrast/AA.
Body text (Cocoa on Cream) must meet WCAG AA.

### Typography (all free Google Fonts)
- **Headings:** Fredoka — rounded, friendly, echoes the bouncy logo while staying tidy.
- **Body:** Nunito — soft, rounded, highly readable.
- **Handwritten accent:** Caveat — for occasional hand-written-note touches (sparingly).

### Texture & motion
Generous whitespace, rounded corners, occasional tiny doodles (star, paw print, butter pat).
Gentle, optional float/wiggle animations that MUST respect `prefers-reduced-motion`.

---

## 3. Site structure

Single-page vertical scroll. Section order:

1. **Hero** — logo, Marcel the cow, tagline, primary "Notify me" call-to-action
   (smooth-scrolls to the waitlist).
2. **Meet the baker** — her story; warm, personal. Pepper cameo. Optional photo slot.
3. **The flavors** — grid of the 8 flavor sticker cards, each with a one-line cute
   description. No prices. Photo slots ready for real bake photos later.
4. **Marcel's van** — a charm strip using the van illustration; "deliveries coming soon."
5. **Notify me** — the waitlist form (name + email) posting to a form service.
6. **Follow** — social links (Instagram/TikTok), marked "coming soon" until live.
7. **Footer** — logo, "made with butter & love," paw print, copyright.

### The 8 flavors (single source of truth in data)
Banana Chip · The CCC · Jam & Toast · Oatmeal Raisin · Raspberry S'mores ·
Fudge Brownie · Carrot Cake · Nougat Crunch

---

## 4. Technical architecture

### Stack
- **Astro** static site → outputs plain HTML/CSS for GitHub Pages. Component model keeps
  the repeated flavor cards DRY and makes future additions (photos, flavors) trivial.
- Minimal dependencies. TypeScript optional. No client framework needed; small vanilla JS
  only for the waitlist form's progressive-enhancement success state.

### Components
- `Layout.astro` — base shell: fonts, meta tags, favicon, global styles, color tokens.
- `Hero.astro`
- `MeetTheBaker.astro`
- `FlavorCard.astro` — props: `name`, `sticker` (image), `description`, optional `photo`.
- `FlavorMenu.astro` — maps over the flavors data → `FlavorCard`.
- `MarcelBand.astro`
- `Waitlist.astro`
- `SocialLinks.astro`
- `Footer.astro`

### Data
- `src/data/flavors.{json,ts}` — array of `{ name, slug, sticker, description, photo? }`.
  Single source of truth for the flavor grid.

### Design tokens
- CSS custom properties for the palette, fonts, radii, and spacing, defined once in the
  layout (e.g. `:root { --cream: #FBF4E6; ... }`).

### Waitlist form
- Posts to **Formspree** (free tier). The form ID is added before launch (placeholder until
  then). Works as a plain HTML form POST with **no JavaScript required**; when JS is present,
  it submits via fetch and shows a friendly inline "you're on the list!" confirmation without
  a page navigation. Includes a honeypot field for spam.

### Assets / image prep
- Source images in `resources/` are screenshots from the MUNBYN label app — each round
  sticker sits inside a phone-app UI card. A small script (Pillow or ImageMagick) **crops the
  circular sticker region** out of each screenshot to produce clean logo + Marcel + 8 flavor
  images. Output saved into the Astro `src/assets/` (or `public/`) tree.
- Cleaner vector/transparent exports from the owner can replace these later with no code
  changes (same filenames / data entries).

### Hosting & deploy
- **GitHub Pages**, auto-deployed via a **GitHub Actions** workflow on push to the default
  branch (Astro build → deploy).
- `CNAME` file with `evenbutterbakeshop.com`.
- Astro config `site` (and `base` if needed) set for the custom domain.
- DNS: provide the exact records to point evenbutterbakeshop.com at GitHub Pages
  (A records for the apex + `www` CNAME), to be entered at the domain registrar.

### Accessibility & performance
- Mobile-first, responsive.
- Cocoa-on-Cream body text meets WCAG AA contrast.
- `prefers-reduced-motion` respected for all animation.
- Semantic HTML, alt text on all images, keyboard-navigable form.
- Static + minimal JS → fast by default.

---

## 5. Content

First-draft, warm placeholder copy will be written for all sections and clearly marked for
the owner to edit:
- **Tagline** — options to pick from, e.g. "Small-batch treats, made the right way" /
  "Sweet things, baked with love" / "Even better, by the batch."
- **Meet the baker** — short, warm bio capturing her vibe.
- **Flavor descriptions** — one cute line each for the 8 flavors.

Content the owner provides before launch: final tagline + bio, social handles, the Formspree
form ID, and (optionally) a photo of herself and real bake photos.

---

## 6. Open items to confirm during implementation
- Exact social platforms + handles (placeholders until provided).
- Whether to include a photo of the baker in "Meet the baker" (slot built either way).
- Final tagline selection.
- Formspree account + form ID (or chosen equivalent service).
