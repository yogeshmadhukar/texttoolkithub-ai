import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Standard ICO file packer to bundle multi-resolution 16x16 and 32x32 PNGs into a favicon.ico
function packIco(pngBuffers: { width: number; height: number; buffer: Buffer }[]): Buffer {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type 1 (ICO)
  header.writeUInt16LE(pngBuffers.length, 4); // File count

  const directorySize = pngBuffers.length * 16;
  const entries: Buffer[] = [];
  const datas: Buffer[] = [];
  let currentOffset = 6 + directorySize;

  for (const png of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(png.width >= 256 ? 0 : png.width, 0);
    entry.writeUInt8(png.height >= 256 ? 0 : png.height, 1);
    entry.writeUInt8(0, 2); // Color palette
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixels
    entry.writeUInt32LE(png.buffer.length, 8); // Size of visual data
    entry.writeUInt32LE(currentOffset, 12); // File offset location

    entries.push(entry);
    datas.push(png.buffer);

    currentOffset += png.buffer.length;
  }

  return Buffer.concat([header, ...entries, ...datas]);
}

async function generateFavicons() {
  const publicDir = path.resolve(__dirname, '../public');
  const sourcePath = path.join(publicDir, 'logo.svg');

  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Source logo SVG file not found at: ${sourcePath}`);
  }

  console.log(`Source image located at: ${sourcePath}`);
  console.log('Generating website branding favicons with sharp...');

  const svgBuffer = fs.readFileSync(sourcePath);

  // Targets and sizes requested
  const sizes = {
    'favicon-16x16.png': 16,
    'favicon-32x32.png': 32,
    'favicon-96x96.png': 96,
    'apple-touch-icon.png': 180,
    'android-chrome-192x192.png': 192,
    'android-chrome-512x512.png': 512,
  };

  const pngResolutions: { width: number; height: number; buffer: Buffer }[] = [];

  for (const [filename, size] of Object.entries(sizes)) {
    const filePath = path.join(publicDir, filename);
    const buffer = await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toBuffer();
    
    fs.writeFileSync(filePath, buffer);
    console.log(`✔ Generated: ${filename} (${size}x${size})`);

    if (size === 16 || size === 32) {
      pngResolutions.push({ width: size, height: size, buffer });
    }
  }

  // Generate favicon.ico bundling multi-resolution version
  const icoPath = path.join(publicDir, 'favicon.ico');
  const icoBuffer = packIco(pngResolutions);
  fs.writeFileSync(icoPath, icoBuffer);
  console.log('✔ Generated: favicon.ico (multi-resolution 16x16 + 32x32)');

  console.log('🎉 Brand asset generation complete! All favicon formats have been successfully updated in /public.');
}

generateFavicons().catch((error) => {
  console.error('Error generating favicons:', error);
  process.exit(1);
});
