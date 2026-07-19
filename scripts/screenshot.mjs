/**
 * Viewport-accurate screenshots via system Edge + CDP (puppeteer-core).
 * Needed because plain `msedge --headless --screenshot` on Windows clamps
 * the window to ~516px wide, silently cropping narrow captures.
 *
 * Usage:
 *   node scripts/screenshot.mjs <url> <outDir> [name:widthxheight ...]
 * Example:
 *   node scripts/screenshot.mjs http://localhost:4175/ shots hero-390:390x844 hero-1440:1440x900
 * Options via env:
 *   FULLPAGE=1  capture full page height instead of the viewport
 */

import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

const [url, outDir, ...specs] = process.argv.slice(2);
if (!url || !outDir || specs.length === 0) {
  console.error('usage: node scripts/screenshot.mjs <url> <outDir> name:WxH ...');
  process.exit(1);
}
mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: true,
  args: ['--disable-gpu', '--hide-scrollbars'],
});

try {
  for (const spec of specs) {
    const match = spec.match(/^(.+):(\d+)x(\d+)$/);
    if (!match) {
      console.error(`bad spec: ${spec}`);
      continue;
    }
    const [, name, w, h] = match;
    const page = await browser.newPage();
    await page.setViewport({ width: +w, height: +h, deviceScaleFactor: 1 });
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
    // Let the boot sequence + hero intro settle.
    await page.evaluate(
      () =>
        new Promise((done) => {
          const check = () =>
            document.getElementById('boot') ? setTimeout(check, 150) : setTimeout(done, 1800);
          check();
        })
    );
    if (process.env.FULLPAGE === '1') {
      // Sweep the page so scroll-triggered reveals (IntersectionObserver)
      // fire before a full-page capture. Viewport captures keep whatever
      // position the page reached (e.g. a #hash deep link).
      await page.evaluate(async () => {
        const step = window.innerHeight * 0.8;
        for (let y = 0; y <= document.body.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 120));
        }
        window.scrollTo(0, 0);
        await new Promise((r) => setTimeout(r, 400));
      });
    } else {
      // Give in-view reveal timelines a beat to finish.
      await new Promise((r) => setTimeout(r, 1800));
    }
    const path = resolve(outDir, `${name}.png`);
    await page.screenshot({ path, fullPage: process.env.FULLPAGE === '1' });
    console.log(`✓ ${name}.png (${w}x${h}${process.env.FULLPAGE === '1' ? ', full page' : ''})`);
    await page.close();
  }
} finally {
  await browser.close();
}
