/**
 * Lighthouse runner using the Node API + system Edge (Chromium). More robust
 * on Windows than the CLI with a non-default browser binary.
 *   node scripts/lighthouse-run.mjs <url> <mobile|desktop> <outJsonPath>
 */

import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const [url, formFactor = 'mobile', outPath] = process.argv.slice(2);
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

const chrome = await chromeLauncher.launch({
  chromePath: EDGE,
  chromeFlags: ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check'],
});

const desktop = formFactor === 'desktop';
const config = {
  extends: 'lighthouse:default',
  settings: {
    formFactor,
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    screenEmulation: desktop
      ? { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false }
      : { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75, disabled: false },
    emulatedUserAgent:
      'Mozilla/5.0 (Linux; Android 12) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Mobile Safari/537.36',
  },
};

const result = await lighthouse(url, { port: chrome.port, output: 'json' }, config);
// Edge can hold the temp-profile lock briefly on Windows → EPERM on cleanup.
// Results are already captured; swallow the cleanup error.
try {
  await chrome.kill();
} catch {
  /* temp-dir cleanup race — non-fatal */
}

const lhr = result.lhr;
const cats = Object.fromEntries(
  Object.entries(lhr.categories).map(([k, v]) => [k, Math.round((v.score ?? 0) * 100)])
);
const a = lhr.audits;
const summary = {
  formFactor,
  scores: cats,
  metrics: {
    FCP: a['first-contentful-paint']?.displayValue,
    LCP: a['largest-contentful-paint']?.displayValue,
    TBT: a['total-blocking-time']?.displayValue,
    CLS: a['cumulative-layout-shift']?.displayValue,
    SI: a['speed-index']?.displayValue,
    TTI: a['interactive']?.displayValue,
  },
};

if (outPath) {
  const { writeFileSync } = await import('node:fs');
  writeFileSync(outPath, JSON.stringify(lhr));
}

// Surface the highest-impact opportunities/failures for the report.
const failedAudits = Object.values(a)
  .filter((x) => x.score !== null && x.score < 1 && ['error', 'warning'].concat('').includes(x.scoreDisplayMode) === false)
  .filter((x) => x.score < 0.9 && x.details)
  .map((x) => `${x.id} (${Math.round((x.score ?? 0) * 100)})`)
  .slice(0, 12);

console.log(JSON.stringify({ ...summary, notablyImperfect: failedAudits }, null, 2));
