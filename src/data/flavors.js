// Single source of truth for the flavor menu.
// `sticker` is the cropped art in src/assets/flavors/<slug>.png, resized and
// converted to WebP at build time by astro:assets.
const art = import.meta.glob("../assets/flavors/*.png", { eager: true, import: "default" });
const sticker = (slug) => art[`../assets/flavors/${slug}.png`];

// `description` copy is a warm first draft — meant to be edited by the baker.
export const flavors = [
  {
    name: "The CCC",
    slug: "the-ccc",
    sticker: sticker("the-ccc"),
    description: "The Classic Chocolate Chip — the one that started it all.",
  },
  {
    name: "Banana Chip",
    slug: "banana-chip",
    sticker: sticker("banana-chip"),
    description: "Banana bread's cooler cousin, with little melty chocolate chips.",
  },
  {
    name: "Jam & Toast",
    slug: "jam-and-toast",
    sticker: sticker("jam-and-toast"),
    description: "Buttery and golden, swirled with sweet fruit jam.",
  },
  {
    name: "Oatmeal Raisin",
    slug: "oatmeal-raisin",
    sticker: sticker("oatmeal-raisin"),
    description: "Chewy, cozy oats with plump raisins. A warm hug, basically.",
  },
  {
    name: "Raspberry S'mores",
    slug: "raspberry-smores",
    sticker: sticker("raspberry-smores"),
    description: "Toasty marshmallow and chocolate with a tart raspberry surprise.",
  },
  {
    name: "Fudge Brownie",
    slug: "fudge-brownie",
    sticker: sticker("fudge-brownie"),
    description: "Rich, gooey, and deeply chocolate. For the serious cocoa lovers.",
  },
  {
    name: "Carrot Cake",
    slug: "carrot-cake",
    sticker: sticker("carrot-cake"),
    description: "Soft and spiced, with a little mascarpone dream.",
  },
  {
    name: "Nougat Crunch",
    slug: "nougat-crunch",
    sticker: sticker("nougat-crunch"),
    description: "Silky nougat and a satisfying crunch in every bite.",
  },
];
