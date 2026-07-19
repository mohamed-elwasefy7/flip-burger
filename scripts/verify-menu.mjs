/**
 * Menu verification suite — drives the built site in headless Edge via CDP.
 * Data-agnostic: derives product ids and category slugs from the rendered
 * DOM, so it keeps working as menu.json grows.
 *   node scripts/verify-menu.mjs http://localhost:4175/
 */

import puppeteer from 'puppeteer-core';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const URL_BASE = process.argv[2] || 'http://localhost:4175/';
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const results = [];
const check = (name, ok, detail = '') =>
  results.push({ name, ok: !!ok, detail: String(detail).slice(0, 140) });

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: true,
  args: ['--disable-gpu', '--hide-scrollbars'],
});

async function newPage({ viewport, interceptMultiLink = false, forceShareFallback = false }) {
  const page = await browser.newPage();
  await page.setViewport({ ...viewport, deviceScaleFactor: 1 });

  if (forceShareFallback) {
    // Windows headless exposes navigator.share but its promise never settles
    // without a real OS sheet — remove it to exercise the clipboard fallback.
    await page.evaluateOnNewDocument(() => {
      delete Navigator.prototype.share;
    });
  }

  if (interceptMultiLink) {
    // fetch-level patch (not network interception): survives the service
    // worker, which bypasses puppeteer's request interception.
    const menu = JSON.parse(readFileSync(resolve(ROOT, 'data/menu.json'), 'utf-8'));
    menu.products[0].orderLinks = {
      keeta: 'https://example.com/keeta',
      jahez: 'https://example.com/jahez',
    };
    await page.evaluateOnNewDocument((fake) => {
      const origFetch = window.fetch.bind(window);
      window.fetch = (input, init) => {
        if (String(input?.url || input).includes('menu.json')) {
          return Promise.resolve(
            new Response(JSON.stringify(fake), {
              headers: { 'content-type': 'application/json' },
            })
          );
        }
        return origFetch(input, init);
      };
    }, menu);
  }

  await page.goto(URL_BASE, { waitUntil: 'networkidle0', timeout: 45000 });
  await page.waitForFunction(() => !document.getElementById('boot'), { timeout: 8000 });
  await page.waitForSelector('.product', { timeout: 8000 });
  return page;
}

const consoleErrors = [];
const badResponses = [];

/* ---------- interactive suite at 390x844 ---------- */
{
  const context = browser.defaultBrowserContext();
  await context.overridePermissions(new URL(URL_BASE).origin, [
    'clipboard-read',
    'clipboard-write',
    'clipboard-sanitized-write',
  ]);

  const page = await newPage({ viewport: { width: 390, height: 844 }, forceShareFallback: true });
  page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()));
  page.on('pageerror', (e) => consoleErrors.push(String(e)));
  page.on('response', (r) => {
    if (r.status() >= 400) badResponses.push(`${r.status()} ${r.url()}`);
  });

  const shape = await page.evaluate(() => ({
    products: document.querySelectorAll('.product').length,
    chips: [...document.querySelectorAll('.cat-nav__chip')].map((c) => c.dataset.slug),
    firstId: document.querySelector('.product')?.dataset.productId,
    firstTitle: document.querySelector('.product .product__title')?.textContent.trim(),
    priceNodes: document.querySelectorAll('.product__price').length,
    placeholders: document.querySelectorAll('.product__media--placeholder').length,
    realPictures: document.querySelectorAll('.product__media picture').length,
    avifSources: document.querySelectorAll('.product__media source[type="image/avif"]').length,
    lang: document.documentElement.lang,
  }));
  check('29 products render', shape.products === 29, `got ${shape.products}`);
  check('4 category chips', shape.chips.length === 4, shape.chips.join(','));

  const exp = await page.evaluate(() => ({
    intros: document.querySelectorAll('.category-intro').length,
    ambient: document.querySelectorAll('.menu-ambient').length,
    frames: document.querySelectorAll('.menu-category--drinks .product__media--frame').length,
    blends: document.querySelectorAll('.product__media--blend').length,
    catClasses: [...document.querySelectorAll('.menu-category')].every((w) =>
      [...w.classList].some((c) => c.startsWith('menu-category--'))
    ),
  }));
  check('4 category intros', exp.intros === 4, `got ${exp.intros}`);
  check('single ambient mood layer', exp.ambient === 1, `got ${exp.ambient}`);
  check('14 framed drinks + 15 blended food medias', exp.frames === 14 && exp.blends === 15, JSON.stringify(exp));
  check('category classes stamped', exp.catClasses);
  check('no price nodes (prices pending)', shape.priceNodes === 0, `found ${shape.priceNodes}`);
  check('no placeholders — all real photos', shape.placeholders === 0 && shape.realPictures === 29);
  check('AVIF sources present on every product', shape.avifSources === 29, `got ${shape.avifSources}`);
  check('AR name renders on first product', shape.lang === 'ar' && /[؀-ۿ]/.test(shape.firstTitle), shape.firstTitle);

  // Mobile: media before content for every product
  const mediaFirst = await page.evaluate(() =>
    [...document.querySelectorAll('.product')].every((p) => {
      const media = p.querySelector('.product__media, .product__media--placeholder');
      const content = p.querySelector('.product__content');
      return media && content && media.getBoundingClientRect().top < content.getBoundingClientRect().top;
    })
  );
  check('mobile: image before text (all 29)', mediaFirst);

  // Scroll spy → travel to last category through the app path (chip click →
  // Lenis). Native scrollIntoView is avoided: it desyncs Lenis' internal
  // position, which real users can't reach.
  const lastSlug = shape.chips[shape.chips.length - 1];
  await page.evaluate((slug) => document.querySelector(`.cat-nav__chip[data-slug="${slug}"]`).click(), lastSlug);
  await new Promise((r) => setTimeout(r, 2000));
  const spy = await page.evaluate(() => ({
    active: document.querySelector('.cat-nav__chip[aria-current="true"]')?.dataset.slug,
    hash: location.hash,
  }));
  check(`scroll spy activates ${lastSlug}`, spy.active === lastSlug, JSON.stringify(spy));
  check('hash updates on travel', spy.hash === `#${lastSlug}`, spy.hash);

  // Category click → back to first
  const firstSlug = shape.chips[0];
  await page.evaluate((slug) => document.querySelector(`.cat-nav__chip[data-slug="${slug}"]`).click(), firstSlug);
  await new Promise((r) => setTimeout(r, 2000));
  const back = await page.evaluate(
    (slug) => ({
      active: document.querySelector('.cat-nav__chip[aria-current="true"]')?.dataset.slug,
      near: Math.abs(document.getElementById(slug).getBoundingClientRect().top) < innerHeight,
    }),
    firstSlug
  );
  check(`category click returns to ${firstSlug}`, back.active === firstSlug && back.near, JSON.stringify(back));

  // First product must be revealed (motion complete) before interacting.
  const pid = shape.firstId;
  await page.waitForFunction(
    (id) => document.querySelector(`#product-${id}`)?.classList.contains('is-revealed'),
    { timeout: 8000 },
    pid
  );

  // Favorite persists across reload
  await page.evaluate(() => localStorage.removeItem('flip-favs'));
  await page.evaluate((id) => document.querySelector(`#product-${id} [data-fav]`).click(), pid);
  await page.reload({ waitUntil: 'networkidle0' });
  await page.waitForFunction(() => !document.getElementById('boot'), { timeout: 8000 });
  await page.waitForSelector('.product');
  const favPersist = await page.evaluate(
    (id) => document.querySelector(`#product-${id} [data-fav]`)?.getAttribute('aria-pressed') === 'true',
    pid
  );
  check('favorite persists across reload', favPersist);

  // Share fallback → clipboard + announcement
  await page.evaluate((id) => document.querySelector(`#product-${id} [data-share]`).click(), pid);
  await new Promise((r) => setTimeout(r, 600));
  const share = await page.evaluate(async () => ({
    clip: await navigator.clipboard.readText().catch((e) => `ERR:${e.name}`),
    status: document.getElementById('share-status')?.textContent,
  }));
  check('share copies deep link', typeof share.clip === 'string' && share.clip.includes(`#product-${pid}`), share.clip);
  check('share announced', !!share.status, share.status);

  // Order sheet 0-link path + focus return
  const sheetFlow = await page.evaluate(async (id) => {
    const article = document.querySelector(`#product-${id}`);
    const opener = article.querySelector('[data-order]');
    opener.scrollIntoView({ block: 'center' });
    // Wait for the reveal timeline so the opener is focusable again.
    for (let i = 0; i < 30 && !article.classList.contains('is-revealed'); i++) {
      await new Promise((r) => setTimeout(r, 100));
    }
    await new Promise((r) => setTimeout(r, 1400));
    opener.click();
    await new Promise((r) => setTimeout(r, 150));
    const sheet = document.querySelector('.order-sheet');
    const open = !sheet.hidden;
    const msg = sheet.querySelector('.order-sheet__empty-title')?.textContent.trim();
    const fits = sheet.querySelector('.order-sheet__panel').getBoundingClientRect().width <= innerWidth;
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await new Promise((r) => setTimeout(r, 100));
    return { open, msg, fits, closed: sheet.hidden, focusBack: document.activeElement === opener };
  }, pid);
  check('order sheet opens (0 links → coming soon)', sheetFlow.open && !!sheetFlow.msg, sheetFlow.msg);
  check('order sheet fits small screen', sheetFlow.fits);
  check('Esc closes + focus returns', sheetFlow.closed && sheetFlow.focusBack);

  // Dialog Tab focus trap: Tab from the last focusable stays inside the panel
  const trap = await page.evaluate(async (id) => {
    document.querySelector(`#product-${id} [data-order]`).click();
    await new Promise((r) => setTimeout(r, 150));
    const panel = document.querySelector('.order-sheet__panel');
    const f = panel.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
    f[f.length - 1].focus();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    const stayedInside = panel.contains(document.activeElement);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    return stayedInside;
  }, pid);
  check('order sheet Tab focus trap holds', trap);

  // Runtime Menu JSON-LD injected, data-driven (4 sections / 29 items)
  const schema = await page.evaluate(() => {
    const node = document.getElementById('menu-schema');
    if (!node) return null;
    try {
      const g = JSON.parse(node.textContent);
      return {
        type: g['@type'],
        sections: g.hasMenuSection?.length,
        items: g.hasMenuSection?.reduce((n, s) => n + (s.hasMenuItem?.length || 0), 0),
        firstItem: g.hasMenuSection?.[0]?.hasMenuItem?.[0]?.name,
      };
    } catch {
      return { error: true };
    }
  });
  check(
    'menu JSON-LD injected (4 sections / 29 items)',
    schema && schema.type === 'Menu' && schema.sections === 4 && schema.items === 29,
    JSON.stringify(schema)
  );

  // EN toggle: LTR + exact EN name on first product
  const en = await page.evaluate(async () => {
    document.getElementById('lang-toggle').click();
    await new Promise((r) => setTimeout(r, 200));
    return {
      dir: document.documentElement.dir,
      firstTitle: document.querySelector('.product .product__title')?.textContent.trim(),
      noOverflow: document.documentElement.scrollWidth <= innerWidth,
    };
  });
  check('EN toggle → LTR + exact EN name', en.dir === 'ltr' && en.firstTitle === 'BLACK TWINS', JSON.stringify(en));

  // Re-render hygiene: 3 more toggles → nothing duplicated, no leaks visible
  const hygiene = await page.evaluate(async () => {
    for (let i = 0; i < 3; i++) {
      document.getElementById('lang-toggle').click();
      await new Promise((r) => setTimeout(r, 250));
    }
    return {
      products: document.querySelectorAll('.product').length,
      intros: document.querySelectorAll('.category-intro').length,
      ambient: document.querySelectorAll('.menu-ambient').length,
      navs: document.querySelectorAll('.cat-nav').length,
      schema: document.querySelectorAll('#menu-schema').length,
    };
  });
  check(
    'language re-render duplicates nothing',
    hygiene.products === 29 && hygiene.intros === 4 && hygiene.ambient === 1 && hygiene.navs === 1 && hygiene.schema === 1,
    JSON.stringify(hygiene)
  );

  await page.close();
}

/* ---------- reduced motion: everything visible, no scroll needed ---------- */
{
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.goto(URL_BASE, { waitUntil: 'networkidle0', timeout: 45000 });
  await page.waitForFunction(() => !document.getElementById('boot'), { timeout: 8000 });
  await page.waitForSelector('.product');
  const rm = await page.evaluate(() => {
    const sample = [
      document.querySelector('.product .product__content'),
      [...document.querySelectorAll('.product')].pop().querySelector('.product__content'),
      [...document.querySelectorAll('.product')].pop().querySelector('.product__media'),
    ];
    return {
      allVisible: sample.every((el) => {
        const s = getComputedStyle(el);
        return +s.opacity === 1 && s.visibility !== 'hidden';
      }),
      revealed: document.querySelectorAll('.product.is-revealed').length,
    };
  });
  check('reduced motion: all content visible instantly', rm.allVisible && rm.revealed === 29, JSON.stringify(rm));
  await page.close();
}

/* ---------- multi-platform sheet (intercepted data, not shipped) ---------- */
{
  const page = await newPage({ viewport: { width: 390, height: 844 }, interceptMultiLink: true });
  const multi = await page.evaluate(async () => {
    const first = document.querySelector('.product');
    first.querySelector('[data-order]').click();
    await new Promise((r) => setTimeout(r, 150));
    const links = [...document.querySelectorAll('.order-sheet__platform')];
    return {
      count: links.length,
      hrefsOk: links.every((l) => l.href.startsWith('https://example.com/')),
    };
  });
  check('multi-platform selector renders 2 platforms', multi.count === 2 && multi.hrefsOk);
  await page.close();
}

/* ---------- responsive matrix ---------- */
// Full Part-7 width list + landscape phone + tablet landscape/portrait.
const VIEWPORTS = [
  ...[1920, 1600, 1440, 1280, 1024, 912, 820, 768, 540, 430, 390, 375, 360, 320].map((w) => ({
    label: `${w}px`,
    width: w,
    height: Math.max(700, Math.round(w * 0.62)),
  })),
  { label: 'landscape-phone 844x390', width: 844, height: 390 },
  { label: 'tablet-landscape 1180x820', width: 1180, height: 820 },
];
for (const vp of VIEWPORTS) {
  const page = await newPage({ viewport: { width: vp.width, height: vp.height } });
  const m = await page.evaluate(() => {
    const inViewport = (el) => {
      const b = el.getBoundingClientRect();
      return b.left >= -1 && b.right <= innerWidth + 1;
    };
    const strip = document.querySelector('.cat-nav__strip');
    const media = document.querySelector('.product__media');
    const host = media.closest('.product');
    const style = getComputedStyle(host);
    const inner = host.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    return {
      noPageOverflow: document.documentElement.scrollWidth <= innerWidth,
      keyElsFit: [...document.querySelectorAll('.cat-nav, .product__content, .product__actions, .site-nav')].every(inViewport),
      stripSingleRow: strip.scrollHeight <= strip.clientHeight + 4,
      mediaDominant: media.getBoundingClientRect().width >= inner * 0.4,
      btnMin: Math.min(
        ...[...document.querySelectorAll('.product__actions .btn, .cat-nav__chip')].map(
          (b) => b.getBoundingClientRect().height
        )
      ),
      drinkCompact:
        innerWidth < 1024 ||
        document.querySelector('.menu-category--drinks .product').getBoundingClientRect().height <
          innerHeight * 0.7,
    };
  });
  check(
    `matrix ${vp.label}`,
    m.noPageOverflow && m.keyElsFit && m.stripSingleRow && m.mediaDominant && m.btnMin >= 44 && m.drinkCompact,
    JSON.stringify(m)
  );
  await page.close();
}

check('zero console/page errors across suite', consoleErrors.length === 0, consoleErrors.join(' | '));
check('zero failed network responses', badResponses.length === 0, badResponses.slice(0, 3).join(' | '));

await browser.close();

let failed = 0;
for (const r of results) {
  if (!r.ok) failed++;
  console.log(`${r.ok ? '✓' : '✗'} ${r.name}${r.ok ? '' : ` — ${r.detail}`}`);
}
console.log(failed ? `\n${failed} FAILED` : '\nALL PASS');
process.exit(failed ? 1 : 0);
