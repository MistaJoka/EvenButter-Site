// Asserts SEO tags in the built homepage. Run after `npm run build`.
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const SITE = "https://evenbutterbakeshop.com";
const html = readFileSync(new URL("../dist/index.html", import.meta.url), "utf8");

const canonical = html.match(/<link rel="canonical" href="([^"]+)"/);
assert.ok(canonical, "missing <link rel=canonical>");
assert.equal(canonical[1], `${SITE}/`);

const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
assert.ok(ld, "missing JSON-LD script");
const graph = JSON.parse(ld[1])["@graph"];
assert.ok(Array.isArray(graph), "JSON-LD should be an @graph");
const data = graph.find((n) => n["@type"] === "Bakery");
assert.ok(data, "missing Bakery node");

// Site name in search results (developers.google.com/search/docs/appearance/site-names)
const website = graph.find((n) => n["@type"] === "WebSite");
assert.ok(website, "missing WebSite node");
assert.equal(website.name, "Even Butter Bake Shop");
assert.equal(website.url, `${SITE}/`);
assert.deepEqual(website.alternateName, ["Even Butter", "evenbutterbakeshop.com"]);
assert.deepEqual(website.publisher, { "@id": `${SITE}/#bakery` });
assert.equal(JSON.parse(ld[1])["@context"], "https://schema.org");
assert.equal(data["@type"], "Bakery");
assert.equal(data["@id"], `${SITE}/#bakery`);
assert.equal(data.name, "Even Butter Bake Shop");
assert.equal(data.url, `${SITE}/`);
assert.equal(data.logo, `${SITE}/images/logo.png`);
assert.ok(data.description?.length > 0, "missing description");
assert.deepEqual(data.address, {
  "@type": "PostalAddress",
  addressLocality: "North Miami",
  addressRegion: "FL",
  addressCountry: "US",
});
assert.deepEqual(data.areaServed, { "@type": "City", name: "North Miami, FL" });
assert.deepEqual(data.founder, { "@type": "Person", name: "Rachel" });

const title = html.match(/<title>([^<]+)<\/title>/)?.[1] ?? "";
assert.match(title, /North Miami, FL/, "title missing location");
const metaDesc = html.match(/<meta name="description" content="([^"]+)"/)?.[1] ?? "";
assert.match(metaDesc, /North Miami/, "meta description missing location");

const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)];
assert.equal(h1s.length, 1, "expected exactly one <h1>");
const h1Text = h1s[0][1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
assert.match(h1Text, /cookies/i, "h1 should describe the product");
assert.match(h1Text, /North Miami/, "h1 should name the location");

const body = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<head>[\s\S]*?<\/head>/g, "");
assert.match(body, /North Miami/, "visible copy missing location");
assert.match(body, /Rachel/, "visible copy missing baker name");

console.log("seo check: ok");
