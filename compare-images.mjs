import fs from 'fs';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import fsExtra from 'fs-extra';

const baselinePath = 'screenshots/baseline/example.png';
const actualPath = 'screenshots/actual/example.png';
const diffPath = 'screenshots/diff/example-diff.png';

const img1 = PNG.sync.read(fs.readFileSync(baselinePath));
const img2 = PNG.sync.read(fs.readFileSync(actualPath));
const { width, height } = img1;
const diff = new PNG({ width, height });

// Ensure diff folder exists
await fsExtra.ensureDir('screenshots/diff');

const mismatchedPixels = pixelmatch(
    img1.data,
    img2.data,
    diff.data,
    width,
    height,
    {
      threshold: 0.15,     // sensitivity
      includeAA: true,     // handle antialiasing
      alpha: 0.8,
    }
);

fs.writeFileSync(diffPath, PNG.sync.write(diff));

const totalPixels = width * height;
const mismatchPercentage = (mismatchedPixels / totalPixels) * 100;

console.log(`🧪 Mismatched Pixels: ${mismatchedPixels}`);
console.log(`📊 Mismatch Percentage: ${mismatchPercentage.toFixed(2)}%`);

if (mismatchPercentage > 0.5) {
  console.error(`❌ Visual test failed. Difference exceeds 0.5%`);
  process.exit(1);
} else {
  console.log(`✅ Visual test passed.`);
}