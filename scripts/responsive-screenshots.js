const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const OUTPUT_DIR = process.env.OUTPUT_DIR || path.join(__dirname, '..', 'responsive-screenshots');

const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'wide', width: 1440, height: 900 },
];

const PUBLIC_PAGES = [
  { route: '/', label: 'home' },
  { route: '/products', label: 'products' },
  { route: '/products/embroidered-anarkali-kurti', label: 'product-detail' },
  { route: '/categories/kurtis', label: 'category' },
  { route: '/search?q=kurti', label: 'search' },
  { route: '/cart', label: 'cart' },
  { route: '/blog', label: 'blog' },
  { route: '/login', label: 'login' },
  { route: '/register', label: 'register' },
  { route: '/wishlist', label: 'wishlist' },
  { route: '/checkout', label: 'checkout' },
];

const AUTH_PAGES = [
  { route: '/account/dashboard', label: 'account-dashboard' },
  { route: '/account/orders', label: 'account-orders' },
  { route: '/account/membership', label: 'account-membership' },
  { route: '/account/profile', label: 'account-profile' },
  { route: '/account/addresses', label: 'account-addresses' },
];

const ADMIN_PAGES = [
  { route: '/admin', label: 'admin-dashboard' },
  { route: '/admin/analytics', label: 'admin-analytics' },
  { route: '/admin/products', label: 'admin-products' },
  { route: '/admin/orders', label: 'admin-orders' },
  { route: '/admin/customers', label: 'admin-customers' },
  { route: '/admin/coupons', label: 'admin-coupons' },
  { route: '/admin/membership', label: 'admin-membership' },
  { route: '/admin/categories', label: 'admin-categories' },
  { route: '/admin/blog', label: 'admin-blog' },
];

function sanitizeFileName(str) {
  return str.replace(/[^a-z0-9.-]/gi, '_');
}

async function capturePage(browser, pageInfo, viewport, outputDir, errorLog) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const errors = [];
  const consoleListener = (msg) => {
    if (msg.type() === 'error') {
      errors.push(`[${msg.type()}] ${msg.text()}`);
    }
  };
  page.on('console', consoleListener);

  const url = `${BASE_URL}${pageInfo.route}`;
  let status = 'unknown';
  try {
    const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    status = response ? response.status().toString() : 'no-response';
    // Wait a bit for any lazy animations/images
    await page.waitForTimeout(1000);
  } catch (e) {
    status = `error: ${e.message}`;
  }

  const fileName = `${sanitizeFileName(pageInfo.label)}_${viewport.name}.png`;
  const filePath = path.join(outputDir, fileName);
  await page.screenshot({ path: filePath, fullPage: true });

  await context.close();

  errorLog.push({
    route: pageInfo.route,
    label: pageInfo.label,
    viewport: viewport.name,
    status,
    errors: errors.slice(0, 10),
  });

  return filePath;
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await chromium.launch();
  const errorLog = [];
  const startTime = Date.now();

  console.log(`Capturing public pages at ${BASE_URL}...`);
  for (const pageInfo of PUBLIC_PAGES) {
    for (const viewport of VIEWPORTS) {
      const filePath = await capturePage(browser, pageInfo, viewport, OUTPUT_DIR, errorLog);
      console.log(`  ${filePath}`);
    }
  }

  console.log(`\nSkipped auth-required pages: ${AUTH_PAGES.map(p => p.route).join(', ')}`);
  console.log(`Skipped admin pages: ${ADMIN_PAGES.map(p => p.route).join(', ')}`);

  await browser.close();

  const reportPath = path.join(OUTPUT_DIR, 'report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    baseUrl: BASE_URL,
    viewports: VIEWPORTS,
    capturedPages: PUBLIC_PAGES,
    skippedPages: [...AUTH_PAGES, ...ADMIN_PAGES],
    summary: errorLog,
    durationMs: Date.now() - startTime,
  }, null, 2));

  console.log(`\nDone. Report saved to ${reportPath}`);
  console.log(`Total screenshots: ${PUBLIC_PAGES.length * VIEWPORTS.length}`);
  console.log(`Pages with errors: ${errorLog.filter(e => e.status !== '200' && !e.status.startsWith('2')).length}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
