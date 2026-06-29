import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.resolve(__dirname, '../public');
const LOGO_SVG_PATH = path.join(PUBLIC_DIR, 'logo.svg');

async function main() {
  console.log('Generating high-quality responsive brand assets from logo.svg...');

  if (!fs.existsSync(LOGO_SVG_PATH)) {
    console.error('Error: logo.svg not found at', LOGO_SVG_PATH);
    process.exit(1);
  }

  const svgBuffer = fs.readFileSync(LOGO_SVG_PATH);

  try {
    // 1. logo-custom.png (512x512)
    console.log('Generating logo-custom.png...');
    await sharp(svgBuffer)
      .resize(512, 512)
      .png()
      .toFile(path.join(PUBLIC_DIR, 'logo-custom.png'));

    // 2. favicon-16x16.png
    console.log('Generating favicon-16x16.png...');
    await sharp(svgBuffer)
      .resize(16, 16)
      .png()
      .toFile(path.join(PUBLIC_DIR, 'favicon-16x16.png'));

    // 3. favicon-32x32.png
    console.log('Generating favicon-32x32.png...');
    await sharp(svgBuffer)
      .resize(32, 32)
      .png()
      .toFile(path.join(PUBLIC_DIR, 'favicon-32x32.png'));

    // 4. favicon-96x96.png
    console.log('Generating favicon-96x96.png...');
    await sharp(svgBuffer)
      .resize(96, 96)
      .png()
      .toFile(path.join(PUBLIC_DIR, 'favicon-96x96.png'));

    // 5. favicon.ico (32x32)
    console.log('Generating favicon.ico...');
    await sharp(svgBuffer)
      .resize(32, 32)
      .png()
      .toFile(path.join(PUBLIC_DIR, 'favicon.ico'));

    // 6. apple-touch-icon.png (180x180)
    console.log('Generating apple-touch-icon.png...');
    await sharp(svgBuffer)
      .resize(180, 180)
      .png()
      .toFile(path.join(PUBLIC_DIR, 'apple-touch-icon.png'));

    // 7. android-chrome-192x192.png (192x192)
    console.log('Generating android-chrome-192x192.png...');
    await sharp(svgBuffer)
      .resize(192, 192)
      .png()
      .toFile(path.join(PUBLIC_DIR, 'android-chrome-192x192.png'));

    // 8. android-chrome-512x512.png (512x512)
    console.log('Generating android-chrome-512x512.png...');
    await sharp(svgBuffer)
      .resize(512, 512)
      .png()
      .toFile(path.join(PUBLIC_DIR, 'android-chrome-512x512.png'));

    // 9. og-image.png (1200x630 or 512x512)
    console.log('Generating og-image.png...');
    await sharp(svgBuffer)
      .resize(512, 512)
      .png()
      .toFile(path.join(PUBLIC_DIR, 'og-image.png'));

    console.log('All brand asset files successfully generated and standardized!');
  } catch (error) {
    console.error('Failed to generate brand asset files:', error);
    process.exit(1);
  }
}

main();
