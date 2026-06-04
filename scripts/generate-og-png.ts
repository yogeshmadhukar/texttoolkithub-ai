import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateOgPng() {
  const svgPath = path.resolve(__dirname, '../public/og-image.svg');
  const pngPath = path.resolve(__dirname, '../public/og-image.png');

  try {
    console.log('Generating og-image.png from og-image.svg via sharp...');
    await sharp(svgPath)
      .png()
      .toFile(pngPath);
    console.log('✔ Successfully generated og-image.png (1200x630)!');
  } catch (error) {
    console.error('Failed to generate og-image.png:', error);
  }
}

generateOgPng();
