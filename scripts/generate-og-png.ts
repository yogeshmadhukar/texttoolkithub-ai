import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateOgPng() {
  const svgPath = path.resolve(__dirname, '../public/og-image.svg');
  const pngPath = path.resolve(__dirname, '../public/og-image.png');
  const distPngPath = path.resolve(__dirname, '../dist/og-image.png');

  try {
    const sharpModule = await import('sharp').catch(() => null);
    if (!sharpModule) {
      console.warn('Notice: sharp is not available in this environment. Skipping og-image.png re-generation.');
      return;
    }
    const sharp = sharpModule.default;
    console.log('Generating og-image.png from og-image.svg via sharp...');
    await sharp(svgPath).png().toFile(pngPath);
    if (fs.existsSync(path.resolve(__dirname, '../dist'))) {
      await sharp(svgPath).png().toFile(distPngPath);
    }
    console.log('✔ Successfully generated og-image.png (1200x630)!');
  } catch (error) {
    console.warn('Notice: Failed to generate og-image.png:', error);
  }
}

generateOgPng();
