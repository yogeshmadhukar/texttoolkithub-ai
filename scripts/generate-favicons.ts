import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SVG_LOGO = `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Rounded Squircle Background with Brand Indigo-600 to Indigo-700 Elegant Gradient -->
  <rect width="512" height="512" rx="120" fill="url(#brand-grad)" />
  <defs>
    <linearGradient id="brand-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6366f1" />
      <stop offset="100%" stop-color="#4f46e5" />
    </linearGradient>
  </defs>
  
  <!-- Sleek inner glow thin border -->
  <rect x="8" y="8" width="496" height="496" rx="112" stroke="#ffffff" stroke-opacity="0.18" stroke-width="12" />

  <!-- Lucide-style Wrench Icon in the center -->
  <g transform="translate(106, 106) scale(12.5)" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </g>
</svg>`;

// Standard ICO packer function to bundle 16x16 and 32x32 PNG buffers into a single ICO file
function packIco(pngBuffers: { width: number; height: number; buffer: Buffer }[]): Buffer {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type 1 (ICO)
  header.writeUInt16LE(pngBuffers.length, 4); // Count of images

  const directorySize = pngBuffers.length * 16;
  const entries: Buffer[] = [];
  const datas: Buffer[] = [];
  let currentOffset = 6 + directorySize;

  for (const png of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(png.width >= 256 ? 0 : png.width, 0);
    entry.writeUInt8(png.height >= 256 ? 0 : png.height, 1);
    entry.writeUInt8(0, 2); // Colors (0 since PNG)
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(png.buffer.length, 8); // Image data size
    entry.writeUInt32LE(currentOffset, 12); // Data offset

    entries.push(entry);
    datas.push(png.buffer);

    currentOffset += png.buffer.length;
  }

  return Buffer.concat([header, ...entries, ...datas]);
}

async function generateFavicons() {
  const publicDir = path.resolve(__dirname, '../public');
  const svgBuffer = Buffer.from(SVG_LOGO);

  console.log('Generating website branding favicons with sharp...');

  // 1. Generate PNGs in different sizes
  const sizes = {
    'favicon-16x16.png': 16,
    'favicon-32x32.png': 32,
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

  // 2. Generate favicon.ico using the 16x16 and 32x32 compiled PNG buffers
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
