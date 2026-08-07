import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function generateOgPng() {
  const svgPath = path.resolve('./public/og-image.svg');
  const pngPath = path.resolve('./public/og-image.png');

  if (!fs.existsSync(svgPath)) {
    console.log('og-image.svg not found, skipping PNG generation.');
    return;
  }

  try {
    const svgBuffer = fs.readFileSync(svgPath);
    await sharp(svgBuffer)
      .resize(1200, 630)
      .png()
      .toFile(pngPath);
    console.log('Successfully generated public/og-image.png from public/og-image.svg');
  } catch (err) {
    console.error('Error generating og-image.png:', err);
  }
}

generateOgPng();
