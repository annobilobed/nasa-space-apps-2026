// Renders the 7-slide presentation (assets-src/deck/deck.html) to a PDF that GitHub Pages serves:
//   public/submission/airxon-presentation.pdf
// Usage: node scripts/build-deck.mjs   (needs Playwright's Chromium; PW_CHROMIUM=path to use a specific build)
// PREVIEW=<folder> also writes one PNG per slide for checking.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const out = 'public/submission';
mkdirSync(out, { recursive: true });
const browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto('file://' + resolve('assets-src/deck/deck.html'), { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.pdf({ path: `${out}/airxon-presentation.pdf`, width: '1920px', height: '1080px', printBackground: true, preferCSSPageSize: true });
if (process.env.PREVIEW) {
  const slides = await page.$$('.slide');
  for (let i = 0; i < slides.length; i++) await slides[i].screenshot({ path: `${process.env.PREVIEW}/slide-${i + 1}.png` });
}
await browser.close();
console.log(`✓ ${out}/airxon-presentation.pdf`);
