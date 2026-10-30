// Asserts the site essentials in the build output. Run after `npm run build`.
import { readFileSync, existsSync, statSync } from "node:fs";
import assert from "node:assert/strict";

const SITE = "https://evenbutterbakeshop.com";
const dist = (p) => new URL(`../dist/${p}`, import.meta.url);
const read = (p) => readFileSync(dist(p), "utf8");
const attr = (html, re) => html.match(re)?.[1];

const home = read("index.html");

// Share + browser chrome
assert.equal(attr(home, /<meta property="og:url" content="([^"]+)"/), `${SITE}/`);
assert.equal(attr(home, /<meta property="og:site_name" content="([^"]+)"/), "Even Butter Bake Shop");
assert.ok(attr(home, /<meta property="og:image:alt" content="([^"]+)"/), "missing og:image:alt");
assert.ok(attr(home, /<meta name="twitter:title" content="([^"]+)"/), "missing twitter:title");
assert.ok(attr(home, /<meta name="theme-color" content="([^"]+)"/), "missing theme-color");
const touch = attr(home, /<link rel="apple-touch-icon" href="([^"]+)"/);
assert.ok(touch && existsSync(dist(touch.slice(1))), "missing apple-touch-icon file");

// Keyboard focus is visible site-wide
const css = [...home.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)]
  .map((m) => read(m[1].slice(1)))
  .join("\n") + home;
assert.match(css, /:focus-visible\s*\{[^}]*outline/, "no global :focus-visible outline");

// Images on the homepage stay light
const imgs = [...home.matchAll(/<img[^>]+src="(\/[^"]+)"/g)].map((m) => m[1].split("?")[0]);
assert.ok(imgs.length > 0, "no images found");
for (const src of imgs) {
  const file = dist(src.slice(1));
  assert.ok(existsSync(file), `image missing: ${src}`);
  const kb = statSync(file).size / 1024;
  assert.ok(kb <= 120, `${src} is ${kb.toFixed(0)}KB (budget 120KB)`);
}

// Fonts are self-hosted: no render-blocking third-party stylesheet
assert.doesNotMatch(home, /fonts\.googleapis\.com|fonts\.gstatic\.com/, "Google Fonts still loaded");
assert.match(css, /@font-face\s*\{[^}]*Fredoka/, "Fredoka not self-hosted");
assert.match(css, /@font-face\s*\{[^}]*Nunito/, "Nunito not self-hosted");
assert.match(css, /@font-face\s*\{[^}]*Caveat/, "Caveat not self-hosted");

// Optimized images offer sizes so phones don't download desktop files
const optimized = [...home.matchAll(/<img[^>]+src="\/_astro\/[^"]+"[^>]*>/g)].map((m) => m[0]);
assert.ok(optimized.length >= 10, `expected optimized images, found ${optimized.length}`);
for (const tag of optimized) {
  assert.match(tag, /srcset="[^"]+\s\d+w/, `no width srcset: ${tag.slice(0, 80)}`);
  assert.match(tag, /sizes="[^"]+"/, `no sizes: ${tag.slice(0, 80)}`);
}

// FAQ section on the homepage
assert.match(home, /id="faq"/, "missing FAQ section");

// Privacy page exists and is linked from the footer
assert.ok(existsSync(dist("privacy/index.html")), "missing /privacy page");
assert.match(home, /href="\/privacy\/?"/, "privacy page not linked");
const privacy = read("privacy/index.html");
assert.match(privacy, /<h1[^>]*>[^<]*Privacy/i);
assert.match(privacy, /Supabase/, "privacy page should name where signups are stored");

// 404 page exists, is noindexed, and links home
assert.ok(existsSync(dist("404.html")), "missing 404 page");
const notFound = read("404.html");
assert.match(notFound, /<meta name="robots" content="noindex"/);
assert.match(notFound, /href="\/"/);

console.log("site check: ok");
