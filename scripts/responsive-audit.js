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

async function auditPage(browser, pageInfo, viewport) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const url = `${BASE_URL}${pageInfo.route}`;
  let status = 'unknown';
  try {
    const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    status = response ? response.status().toString() : 'no-response';
    await page.waitForTimeout(1000);
  } catch (e) {
    status = `error: ${e.message}`;
  }

  // Measure horizontal overflow
  const metrics = await page.evaluate(() => {
    const docWidth = Math.max(
      document.body?.scrollWidth || 0,
      document.documentElement?.scrollWidth || 0,
      document.body?.offsetWidth || 0,
      document.documentElement?.offsetWidth || 0
    );
    const winWidth = window.innerWidth;
    const overflow = Math.max(0, docWidth - winWidth);

    // Find elements that overflow horizontally
    const overflowElements = [];
    if (overflow > 0) {
      const all = document.querySelectorAll('*');
      for (const el of all) {
        const rect = el.getBoundingClientRect();
        if (rect.right > winWidth + 1 || rect.left < -1) {
          const tag = el.tagName.toLowerCase();
          const className = el.className ? String(el.className).split(' ').slice(0, 3).join(' ') : '';
          const id = el.id || '';
          overflowElements.push({
            tag,
            id,
            className,
            right: rect.right,
            left: rect.left,
            width: rect.width,
          });
          if (overflowElements.length >= 20) break;
        }
      }
    }

    return { docWidth, winWidth, overflow, overflowElements };
  });

  // Detect missing images
  const missingImages = await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll('img'));
    return images
      .filter(img => !img.complete || img.naturalWidth === 0)
      .map(img => ({
        src: img.src,
        alt: img.alt,
        className: img.className ? String(img.className).split(' ').slice(0, 3).join(' ') : '',
      }));
  });

  await context.close();

  return {
    route: pageInfo.route,
    label: pageInfo.label,
    viewport: viewport.name,
    status,
    ...metrics,
    missingImages: missingImages.slice(0, 10),
  };
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await chromium.launch();
  const results = [];

  console.log(`Auditing public pages at ${BASE_URL}...`);
  for (const pageInfo of PUBLIC_PAGES) {
    for (const viewport of VIEWPORTS) {
      const result = await auditPage(browser, pageInfo, viewport);
      results.push(result);
      const overflow = result.overflow > 0 ? `overflow: ${result.overflow}px` : 'no overflow';
      const missing = result.missingImages.length > 0 ? `missing: ${result.missingImages.length}` : 'no missing images';
      console.log(`  ${result.label} ${viewport.name} - ${overflow}, ${missing}, status ${result.status}`);
    }
  }

  await browser.close();

  const reportPath = path.join(OUTPUT_DIR, 'audit.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    baseUrl: BASE_URL,
    viewports: VIEWPORTS,
    capturedPages: PUBLIC_PAGES,
    results,
  }, null, 2));

  console.log(`\nDone. Audit saved to ${reportPath}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
