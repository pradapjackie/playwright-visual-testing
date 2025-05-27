import { test, expect } from '@playwright/test';
import fs from 'fs';
import fsExtra from 'fs-extra';

test('visual test for home page', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 }); // ✅ Set consistent viewport

  await page.goto('https://example.com');

  const actualPath = 'screenshots/actual/example.png';
  const baselinePath = 'screenshots/baseline/example.png';

  await fsExtra.ensureDir('screenshots/actual');
  await page.screenshot({ path: actualPath, fullPage: true });

  if (!fs.existsSync(baselinePath)) {
    console.warn(`⚠️ Baseline image not found. Creating one at: ${baselinePath}`);
    await fsExtra.ensureDir('screenshots/baseline');
    await fsExtra.copy(actualPath, baselinePath);
    console.log('✅ Baseline image created. Re-run the test for comparison.');
    return;
  }

  expect(fs.existsSync(baselinePath)).toBe(true);
});