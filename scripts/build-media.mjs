// Builds responsive WebP variants + a credits manifest from assets-src/.
// Run: node scripts/build-media.mjs
import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { catalog, maps } from './media-catalog.mjs';

const OUT = 'public/media';
mkdirSync(OUT, { recursive: true });
mkdirSync('src/data', { recursive: true });
const meta = JSON.parse(readFileSync('assets-src/nasa/meta.json', 'utf8'));
const manifest = {};

async function variants(input, slug, widths, quality = 74) {
  const img = sharp(input, { limitInputPixels: false });
  const { width, height } = await img.metadata();
  const made = [];
  for (const w of widths) {
    if (w > width && made.length) continue;
    const tw = Math.min(w, width);
    const file = `${slug}-${tw}.webp`;
    if (!existsSync(`${OUT}/${file}`)) {
      await sharp(input, { limitInputPixels: false }).resize({ width: tw }).webp({ quality, effort: 5 }).toFile(`${OUT}/${file}`);
    }
    made.push(tw);
  }
  // tiny blurred placeholder (inline data URI) for progressive loading
  const lqip = await sharp(input, { limitInputPixels: false }).resize({ width: 24 }).blur(1).webp({ quality: 40 }).toBuffer();
  return { width, height, widths: [...new Set(made)], lqip: `data:image/webp;base64,${lqip.toString('base64')}` };
}

for (const c of catalog) {
  const m = meta[c.id];
  if (!m) throw new Error(`missing metadata for ${c.id}`);
  const widths = c.pano ? [960, 1920, 3200] : [480, 960, 1600];
  const v = await variants(`assets-src/nasa/${c.id}.jpg`, c.slug, widths);
  manifest[c.slug] = {
    slug: c.slug, nasaId: c.id, kind: c.kind, mission: c.mission, alt: c.alt,
    title: m.title?.startsWith('KSC-') || m.title?.startsWith('ARC-') || m.title === 'Saturn Apollo Program' ? `${m.title} (${c.id})` : m.title,
    credit: m.credit && m.credit !== 'NASA or National Aeronautics and Space Administration' ? m.credit : 'NASA',
    date: m.date, center: m.center,
    source: c.source || m.source,
    library: m.source,
    usage: 'NASA content is generally not subject to copyright in the United States. Used for educational purposes under NASA Images and Media Usage Guidelines; no endorsement implied.',
    ...v,
  };
  console.log('✓', c.slug, v.widths.join(','));
}
for (const c of maps) {
  const v = await variants(`assets-src/maps/${c.file}`, c.slug, c.file.endsWith('.png') ? [600, 1200, 1800] : [2048, 4096], 80);
  manifest[c.slug] = { slug: c.slug, nasaId: null, kind: c.kind, mission: c.mission, alt: c.alt, title: c.title,
    credit: c.credit, date: null, source: c.source, library: c.source,
    usage: c.file.endsWith('.png') ? 'Orthographic projection rendered by AIRXON (scripts/render-globe.py) from NASA Trek mosaic data. Not a photograph.' : 'Assembled by AIRXON from NASA Trek WMTS tiles (zoom level 3). NASA data; no endorsement implied.', ...v };
  console.log('✓', c.slug);
}
writeFileSync('src/data/media.json', JSON.stringify(manifest, null, 1));
console.log('manifest entries:', Object.keys(manifest).length);
