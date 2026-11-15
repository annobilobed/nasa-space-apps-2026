import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';

const PAGES = ['index.html', 'museum.html', 'archive.html', 'archive/opportunity.html', 'archive/apollo-11-lrrr.html', 'archive/voyager-1.html',
  'stories.html', 'stories/opportunity.html', 'theatre.html', 'where.html', 'discoveries.html', 'knowledge.html', 'about.html', 'credits.html', '404.html'];
const FIX = process.env.FIXTURES!;

function watch(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });
  // Browsers routinely abort media range requests once metadata is read (ERR_ABORTED): not an error.
  page.on('requestfailed', (r) => { if (r.url().startsWith('http://127.0.0.1') && !(/\.(mp4|webm)$/.test(r.url()) && /ABORTED/.test(r.failure()?.errorText ?? ''))) errors.push(`failed: ${r.url()} ${r.failure()?.errorText}`); });
  page.on('response', (r) => { if (r.url().startsWith('http://127.0.0.1') && r.status() >= 400) errors.push(`${r.status()}: ${r.url()}`); });
  return errors;
}

for (const p of PAGES) {
  test(`loads cleanly, no overflow: ${p}`, async ({ page }) => {
    const errors = watch(page);
    await page.goto(p, { waitUntil: 'networkidle' });
    await expect(page.locator('h1').first()).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, 'horizontal overflow (px)').toBeLessThanOrEqual(1);
    // every image has alt (decorative ones use alt="")
    expect(await page.locator('img:not([alt])').count()).toBe(0);
    // one h1
    expect(await page.locator('h1').count()).toBe(1);
    expect(errors).toEqual([]);
  });
}

test('every internal link resolves', async ({ page, request }) => {
  test.skip(test.info().project.name !== 'desktop');
  const seen = new Set<string>(); const queue = ['http://127.0.0.1:4400/index.html']; const bad: string[] = [];
  while (queue.length) {
    const url = queue.shift()!;
    if (seen.has(url)) continue; seen.add(url);
    const res = await request.get(url);
    if (res.status() !== 200) { bad.push(`${res.status()} ${url}`); continue; }
    if (!url.endsWith('.html')) continue;
    const html = await res.text();
    for (const m of html.matchAll(/(?:href|src)="([^"#]+)(#[^"]*)?"/g)) {
      const u = new URL(m[1], url);
      if (u.origin === 'http://127.0.0.1:4400') queue.push(u.href);
    }
    for (const m of html.matchAll(/srcset="([^"]+)"/g)) for (const part of m[1].split(',')) queue.push(new URL(part.trim().split(' ')[0], url).href);
  }
  expect(bad).toEqual([]);
  expect(seen.size).toBeGreaterThan(100);
});

test('hero headline and CTAs appear and work', async ({ page }) => {
  await page.goto('index.html');
  await expect(page.locator('#hero-title')).toContainText('Somewhere beyond Earth');
  await page.waitForTimeout(3000);
  const box = await page.locator('#hero-title .w').first().boundingBox();
  expect(box!.height).toBeGreaterThan(20);
  await expect(page.locator('#hero-title .w > span').first()).toBeInViewport();
  await page.getByRole('link', { name: 'Explore the legacy' }).click();
  await expect(page).toHaveURL(/museum\.html$/);
});

test('hero is usable with reduced motion', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('http://127.0.0.1:4400/index.html');
  await expect(page.getByRole('link', { name: 'Discover the stories' })).toBeVisible();
  const op = await page.locator('[data-intro="sub"]').evaluate((e) => getComputedStyle(e).opacity);
  expect(Number(op)).toBe(1);
  await ctx.close();
});

test('archive search, filters, sort and hash presets', async ({ page }) => {
  await page.goto('archive.html');
  const visible = () => page.locator('[data-results] > li:not([hidden])');
  await page.getByRole('searchbox', { name: 'Search the archive' }).fill('hematite');
  await expect(visible()).toHaveCount(1);
  await expect(visible().first()).toContainText('Opportunity');
  await page.getByRole('searchbox', { name: 'Search the archive' }).fill('seismometer');
  await expect.poll(() => visible().count()).toBeGreaterThanOrEqual(3); // InSight, Viking 1, Viking 2
  await page.getByRole('searchbox', { name: 'Search the archive' }).fill('zzzz-nothing');
  await expect(page.locator('[data-empty]')).toBeVisible();
  await page.locator('[data-empty] [data-reset]').click();
  await expect(visible()).toHaveCount(await page.locator('[data-results] > li').count());
  await page.getByLabel('Destination').selectOption('moon');
  for (const li of await visible().all()) await expect(li).toContainText('The Moon');
  await page.getByRole('button', { name: 'Left in place' }).click();
  for (const li of await visible().all()) await expect(li).toContainText('Left in place');
  await page.getByLabel('Destination').selectOption('');
  await page.getByRole('button', { name: 'All', exact: true }).click();
  await page.getByLabel('Sort by').selectOption('launch-asc');
  await expect(visible().first()).toContainText('Surveyor 3');
  await page.goto('archive.html#operational');
  for (const li of await visible().all()) await expect(li).toContainText('Still operational');
});

test('museum filter and exhibit panel', async ({ page }) => {
  await page.goto('museum.html');
  await page.getByRole('button', { name: 'Deep-space hardware' }).click();
  await expect(page.locator('#moon')).toBeHidden();
  await expect(page.locator('#deep-space')).toBeVisible();
  await page.getByRole('button', { name: 'All exhibits' }).click();
  await page.locator('[data-exhibit="surveyor-3"]').click();
  const dlg = page.locator('[data-panel]');
  await expect(dlg).toBeVisible();
  await expect(dlg.locator('#panel-title')).toHaveText(/Surveyor 3/);
  await expect(dlg.locator('img')).toHaveJSProperty('complete', true);
  expect(await dlg.locator('img').evaluate((i: HTMLImageElement) => i.naturalWidth)).toBeGreaterThan(0);
  await page.keyboard.press('Escape');
  await expect(dlg).toBeHidden();
});

test('location explorer: hash select, pins, zoom, deep space', async ({ page }) => {
  await page.goto('where.html#opportunity');
  await expect(page.locator('#panel-mars')).toBeVisible();
  await expect(page.locator('[data-detail="mars"]')).toContainText('Opportunity');
  await expect(page.locator('[data-detail="mars"]')).toContainText('Approximate');
  await page.getByRole('tab', { name: /The Moon/ }).click();
  await page.getByRole('button', { name: /Apollo 11 retroreflector/ }).first().click();
  await expect(page.locator('[data-detail="moon"]')).toContainText('Also at this site');
  await page.locator('[data-detail="moon"] [data-also]').first().click();
  await expect(page.locator('[data-detail="moon"] h3')).toContainText('Eagle');
  await page.locator('#panel-moon [data-zoom="in"]').click();
  const z = await page.locator('#panel-moon [data-stage]').evaluate((e) => e.style.getPropertyValue('--z'));
  expect(Number(z)).toBeGreaterThan(1);
  await page.getByRole('tab', { name: /Deep space/ }).click();
  await expect(page.locator('#panel-deep')).toContainText('Voyager 1');
  const link = page.locator('[data-detail="moon"] a.btn');
  await page.getByRole('tab', { name: /The Moon/ }).click();
  await link.click();
  await expect(page).toHaveURL(/archive\/apollo-11-eagle\.html$/);
});

test('opportunity story: timeline tabs, keyboard, tau slider', async ({ page }) => {
  await page.goto('stories/opportunity.html');
  const tabs = page.getByRole('tab');
  await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');
  await page.locator('[data-tl-next]').click();
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('[data-item="1"]')).toBeVisible();
  await tabs.nth(1).focus();
  await page.keyboard.press('End');
  await expect(tabs.last()).toHaveAttribute('aria-selected', 'true');
  await page.locator('[data-tau-input]').fill('10.8');
  await expect(page.locator('[data-tau-out]')).toContainText('last day');
  await expect(page.locator('[data-tau-out]')).toContainText('0.00');
});



test('discoveries: compare slider, layers, laser', async ({ page }) => {
  await page.goto('discoveries.html');
  await page.locator('[data-compare-input]').fill('20');
  await expect(page.locator('[data-compare]')).toHaveAttribute('style', /--pos:\s*20%/);
  await page.getByRole('button', { name: 'Core', exact: true }).click();
  await expect(page.locator('[data-layer-info="core"]')).toBeVisible();
  await page.getByRole('button', { name: 'Fire a laser pulse' }).click();
  await expect(page.locator('[data-laser-out]')).toContainText('Returned after 2.56 s', { timeout: 6000 });
});

test('knowledge glossary filter and FAQ', async ({ page }) => {
  await page.goto('knowledge.html');
  await page.getByLabel('Find a word').fill('hematite');
  await expect(page.locator('[data-term]:not([hidden])')).toHaveCount(1);
  await expect(page.locator('[data-term]:not([hidden]) dt')).toHaveText('Hematite');
  await page.getByText('Will Opportunity ever wake up?').click();
  await expect(page.getByText('NASA tried for eight months')).toBeVisible();
});

test('gallery lightbox opens and closes', async ({ page }) => {
  await page.goto('archive/opportunity.html');
  await page.locator('[data-g-open="1"]').click();
  await expect(page.locator('[data-lightbox]')).toBeVisible();
  await page.locator('[data-lb-next]').click();
  await page.locator('[data-lb-close]').click();
  await expect(page.locator('[data-lightbox]')).toBeHidden();
});

test('mobile menu opens, traps nothing, closes on Escape', async ({ page }) => {
  test.skip(test.info().project.name !== 'mobile');
  await page.goto('index.html');
  const btn = page.locator('[data-menu-btn]');
  await btn.click();
  await expect(page.locator('#mobile-nav')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#mobile-nav')).toBeHidden();
  await btn.click();
  await page.locator('#mobile-nav').getByRole('link', { name: 'Theatre' }).click();
  await expect(page).toHaveURL(/theatre\.html$/);
});

test('keyboard: skip link and visible focus', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop');
  await page.goto('archive.html');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip')).toBeFocused();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  const outline = await page.evaluate(() => getComputedStyle(document.activeElement!).outlineStyle);
  expect(outline).not.toBe('none');
});



test('archive suggestions and remembered filters', async ({ page }) => {
  await page.goto('archive.html');
  await page.locator('[data-suggest="interstellar"]').click();
  await expect.poll(() => page.locator('[data-results] > li:not([hidden])').count()).toBe(2);
  await page.locator('[data-results] > li:not([hidden]) a.stretched').first().click();
  await expect(page).toHaveURL(/archive\/voyager-\d\.html$/);
  await page.goBack();
  await expect(page.getByRole('searchbox', { name: 'Search the archive' })).toHaveValue('interstellar');
  await expect.poll(() => page.locator('[data-results] > li:not([hidden])').count()).toBe(2);
});

test('theatre plays NASA archive films, switches films and toggles captions', async ({ page }) => {
  await page.goto('theatre.html');
  const player = page.locator('[data-player]');
  await page.locator('[data-big-play]').click();
  await expect(player).toHaveClass(/is-playing/);
  await expect.poll(() => page.locator('video:not([hidden])').evaluate((v: HTMLVideoElement) => v.currentTime), { timeout: 8000 }).toBeGreaterThan(0.4);
  await page.locator('[data-play]').click();
  await expect(player).not.toHaveClass(/is-playing/);
  await page.locator('[data-cc]').click();
  await expect(page.locator('[data-cc]')).toHaveAttribute('aria-pressed', 'false');
  await page.locator('[data-seek]').fill('500');
  await expect.poll(() => page.locator('video:not([hidden])').evaluate((v: HTMLVideoElement) => v.currentTime)).toBeGreaterThan(15);
  await page.locator('[data-select-film="nasa-mission-complete"]').click();
  await expect(page.locator('video[data-film="nasa-mission-complete"]')).toBeVisible();
  await expect(page.locator('[data-now="nasa-mission-complete"]')).toBeVisible();
  await expect(player).toHaveClass(/is-playing/);
  await expect(page.locator('[data-error]')).toBeHidden();
});

test('theatre shows the AIRXON documentary first, labelled as AI-generated, with captions and chapters', async ({ page }) => {
  const errors = watch(page);
  await page.goto('theatre.html');
  const film = page.locator('video[data-film="opportunity-the-last-signal"]');
  await expect(film).toBeVisible();
  await expect(page.locator('[data-now="opportunity-the-last-signal"] .ai-tag')).toBeVisible();
  await expect(page.locator('#about-film')).toContainText('Google Flow');
  await expect(page.locator('#about-film')).toContainText('ElevenLabs');
  await expect(page.locator('#about-film')).toContainText('CapCut');
  await expect(page.locator('#about-film')).toContainText('airbags');
  expect(await film.evaluate((v: HTMLVideoElement) => v.textTracks[0]?.label)).toBe('English');
  await page.locator('[data-chapter="121.1"]').click();
  await expect(page.locator('[data-player]')).toHaveClass(/is-playing/);
  await expect.poll(() => film.evaluate((v: HTMLVideoElement) => v.currentTime), { timeout: 8000 }).toBeGreaterThan(121);
  await expect.poll(() => film.evaluate((v: HTMLVideoElement) => v.textTracks[0].cues?.length ?? 0)).toBeGreaterThan(30);
  await expect(page.locator('[data-error]')).toBeHidden();
  expect(errors).toEqual([]);
});

test('journey film scrubs with scroll from the hero', async ({ page }) => {
  await page.goto('index.html');
  await expect(page.locator('[data-journey-video]')).toHaveClass(/is-ready/, { timeout: 10000 });
  const H = await page.evaluate(() => innerHeight);
  await page.evaluate((y) => window.scrollTo(0, y), H * 2);
  await expect.poll(() => page.locator('[data-journey-video]').evaluate((v: HTMLVideoElement) => v.currentTime), { timeout: 8000 }).toBeGreaterThan(1);
  const w1 = await page.locator('[data-vw]').textContent();
  await page.evaluate((y) => window.scrollTo(0, y), H * 4);
  await expect.poll(() => page.locator('[data-vw]').textContent()).not.toBe(w1);
  await page.evaluate((y) => window.scrollTo(0, y), H * 9.5);
  await expect.poll(() => page.locator('[data-journey-video]').evaluate((v: HTMLVideoElement) => v.currentTime / v.duration)).toBeGreaterThan(0.9);
});

test('Home link on the home page returns to the top', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop');
  await page.goto('index.html');
  await page.evaluate(() => window.scrollTo(0, 6000));
  await page.waitForTimeout(400);
  await page.mouse.wheel(0, -300);              // scrolling up reveals the auto-hiding header
  await page.waitForTimeout(800);
  await page.locator('nav.primary a', { hasText: 'Home' }).click();
  await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 5000 }).toBeLessThan(5);
  await expect(page).toHaveURL(/index\.html$/);
});

test('home is reachable from every page and the logo loads', async ({ page }) => {
  for (const p of ['archive/spirit.html', 'stories/opportunity.html', 'where.html']) {
    await page.goto(p);
    const logo = page.locator('.brand img.logo');
    await expect(logo).toBeVisible();
    expect(await logo.evaluate((i: HTMLImageElement) => i.naturalWidth)).toBeGreaterThan(0);
    if (test.info().project.name === 'desktop') await expect(page.locator('nav.primary a', { hasText: 'Home' })).toBeVisible();
  }
  await page.locator('.brand').click();
  await expect(page).toHaveURL(/index\.html$/);
});

for (const p of ['index.html', 'stories/opportunity.html', 'archive/apollo-17-lrv.html', 'knowledge.html', 'where.html', 'theatre.html', 'credits.html', 'about.html', 'discoveries.html', 'museum.html', 'archive.html']) {
  test(`no em or en dashes in visible text: ${p}`, async ({ page }) => {
    test.skip(test.info().project.name !== 'desktop');
    await page.goto(p);
    const txt = await page.evaluate(() => document.body.innerText + ' ' + document.title);
    expect(txt.match(/[\u2013\u2014]/g) ?? []).toEqual([]);
  });
}

test('every menu tab opens its page at the top, including after back and reload', async ({ page }) => {
  const tabs = ['Home', 'Museum', 'Stories', 'Theatre', 'Archive', 'Where now?', 'Discoveries', 'Learn', 'About'];
  const mobile = test.info().project.name === 'mobile';
  await page.goto('knowledge.html');
  for (const name of tabs) {
    await page.evaluate(() => window.scrollTo(0, Math.min(2500, document.documentElement.scrollHeight)));
    await page.waitForTimeout(300);
    await page.evaluate(() => window.scrollBy(0, -300)); // scrolling up reveals the auto-hiding header
    await page.waitForTimeout(500);
    if (mobile) {
      await page.locator('[data-menu-btn]').click();
      await page.locator('#mobile-nav').getByRole('link', { name, exact: true }).click();
    } else {
      await page.locator('nav.primary').getByRole('link', { name, exact: true }).click();
    }
    await page.waitForLoadState('load');
    await expect.poll(() => page.evaluate(() => window.scrollY), { message: `${name} should open at the top` }).toBeLessThan(5);
  }
  // back and reload also return to the top
  await page.evaluate(() => window.scrollTo(0, 2000));
  await page.reload(); await page.waitForLoadState('load');
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(5);
  await page.goBack(); await page.waitForLoadState('load');
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(5);
});

test('links to a section still jump to that section', async ({ page }) => {
  await page.goto('stories/opportunity.html#final');
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(500);
});
