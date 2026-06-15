import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const URL = process.env.URL || "http://localhost:4321/";
const W = Number(process.env.W || 390);
const H = Number(process.env.H || 800);

const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new", args: ["--hide-scrollbars"] });
const page = await browser.newPage();
await page.setViewport({ width: W, height: H, deviceScaleFactor: 2 });
await page.goto(URL, { waitUntil: "networkidle0" });

const report = await page.evaluate(() => {
  const doc = document.documentElement;
  const vw = doc.clientWidth;
  const offenders = [];
  for (const el of document.querySelectorAll("*")) {
    const r = el.getBoundingClientRect();
    if (r.right > vw + 1) {
      offenders.push({
        tag: el.tagName.toLowerCase(),
        cls: el.className?.toString().slice(0, 40),
        right: Math.round(r.right),
        width: Math.round(r.width),
      });
    }
  }
  return {
    viewport: vw,
    scrollWidth: doc.scrollWidth,
    overflow: doc.scrollWidth > vw,
    offenders: offenders.slice(0, 12),
  };
});

console.log(JSON.stringify(report, null, 2));

if (process.env.SHOT) {
  await page.screenshot({ path: process.env.SHOT, fullPage: true });
  console.log("shot ->", process.env.SHOT);
}
await browser.close();
