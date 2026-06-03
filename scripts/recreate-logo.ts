import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SVG_LOGO = `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Rounded Squircle Background in Royal Blue #1066e2 -->
  <rect width="512" height="512" rx="116" fill="#1066e2" />
  
  <!-- White Wrench Silhouette -->
  <!-- Main Head Circle -->
  <circle cx="256" cy="180" r="74" fill="#ffffff" />
  
  <!-- Neck Connection -->
  <rect x="220" y="220" width="72" height="40" fill="#ffffff" />
  
  <!-- Handle Grip -->
  <rect x="212" y="250" width="88" height="136" rx="28" fill="#ffffff" />
  
  <!-- Tapered Bottom End (Screwdriver / Wedge tip) -->
  <path d="M 226,380 L 286,380 L 274,420 C 273,423 270,425 266,425 L 246,425 C 242,425 239,423 238,420 Z" fill="#ffffff" />
  
  <!-- Blue Cuts/Carvings representing empty details -->
  <!-- Rotated head cutout (opening at 30 degrees) -->
  <g transform="rotate(30, 256, 180)">
    <rect x="234" y="90" width="44" height="90" rx="6" fill="#1066e2" />
    <circle cx="256" cy="180" r="22" fill="#1066e2" />
  </g>
  
  <!-- Two vertical slots on the handle grip -->
  <rect x="230" y="276" width="16" height="84" rx="8" fill="#1066e2" />
  <rect x="266" y="276" width="16" height="84" rx="8" fill="#1066e2" />
</svg>
`;

function generateLogo() {
  const outputPath = path.resolve(__dirname, '../public/logo.svg');
  fs.writeFileSync(outputPath, SVG_LOGO, 'utf8');
  console.log('✔ Successfully generated high-precision branding logo.svg in /public!');
}

generateLogo();
