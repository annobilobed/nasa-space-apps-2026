import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const PAGES = ['index.html', 'museum.html', 'archive.html', 'archive/opportunity.html', 'stories/opportunity.html', 'theatre.html', 'where.html', 'discoveries.html', 'knowledge.html', 'about.html', 'credits.html'];
for (const p of PAGES) {
  test(`axe: no serious or critical issues on ${p}`, async ({ page }) => {
    test.skip(test.info().project.name !== 'desktop');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(p, { waitUntil: 'networkidle' });
    const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    const bad = r.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(bad.map((v) => `${v.id} (${v.impact}): ${v.nodes.length} × ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`)).toEqual([]);
  });
}
