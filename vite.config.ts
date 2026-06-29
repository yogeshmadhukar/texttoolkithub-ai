import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';
import sharp from 'sharp';

const PUBLIC_DIR = path.resolve(__dirname, 'public');
const BACKUP_DIR = path.resolve(__dirname, 'src/assets/default-logo-backup');

function ensureBackup() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
  const filesToBackup = [
    'logo.svg',
    'favicon.ico',
    'favicon-16x16.png',
    'favicon-32x32.png',
    'favicon-96x96.png',
    'apple-touch-icon.png',
    'android-chrome-192x192.png',
    'android-chrome-512x512.png'
  ];
  for (const file of filesToBackup) {
    const srcPath = path.join(PUBLIC_DIR, file);
    const destPath = path.join(BACKUP_DIR, file);
    if (fs.existsSync(srcPath) && !fs.existsSync(destPath)) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

export default defineConfig(() => {
  return {
    base: '/',
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'logo-uploader',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url === '/api/upload-logo' && req.method === 'POST') {
              let body = '';
              req.on('data', chunk => { body += chunk; });
              req.on('end', async () => {
                try {
                  const { mimeType, base64 } = JSON.parse(body);
                  if (!base64 || !mimeType) {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ error: 'Missing base64 or mimeType' }));
                    return;
                  }

                  ensureBackup();

                  const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
                  const buffer = Buffer.from(base64Data, 'base64');
                  
                  const isSvg = mimeType === 'image/svg+xml' || mimeType.includes('svg');
                  
                  if (isSvg) {
                    // Save SVGs directly
                    fs.writeFileSync(path.join(PUBLIC_DIR, 'logo-custom.svg'), buffer);
                    fs.writeFileSync(path.join(PUBLIC_DIR, 'logo.svg'), buffer);
                  } else {
                    // Optimize raster image with sharp and save as custom logo
                    const optimizedBuffer = await sharp(buffer)
                      .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
                      .png({ compressionLevel: 9, adaptiveFiltering: true })
                      .toBuffer();
                    
                    fs.writeFileSync(path.join(PUBLIC_DIR, 'logo-custom.png'), optimizedBuffer);
                    
                    // Create an SVG wrapper for the PNG custom logo so /logo.svg remains a valid SVG
                    const svgWrapper = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <image href="/logo-custom.png" width="512" height="512" x="0" y="0" />
</svg>`;
                    fs.writeFileSync(path.join(PUBLIC_DIR, 'logo-custom.svg'), svgWrapper);
                    fs.writeFileSync(path.join(PUBLIC_DIR, 'logo.svg'), svgWrapper);
                  }

                  // Standardize all sizes using sharp (both raster and SVG inputs are optimized here)
                  await sharp(buffer)
                    .resize(16, 16, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
                    .png()
                    .toFile(path.join(PUBLIC_DIR, 'favicon-16x16.png'));

                  await sharp(buffer)
                    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
                    .png()
                    .toFile(path.join(PUBLIC_DIR, 'favicon-32x32.png'));

                  await sharp(buffer)
                    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
                    .png()
                    .toFile(path.join(PUBLIC_DIR, 'favicon.ico'));

                  await sharp(buffer)
                    .resize(96, 96, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
                    .png()
                    .toFile(path.join(PUBLIC_DIR, 'favicon-96x96.png'));

                  await sharp(buffer)
                    .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
                    .png()
                    .toFile(path.join(PUBLIC_DIR, 'apple-touch-icon.png'));

                  await sharp(buffer)
                    .resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
                    .png()
                    .toFile(path.join(PUBLIC_DIR, 'android-chrome-192x192.png'));

                  await sharp(buffer)
                    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
                    .png()
                    .toFile(path.join(PUBLIC_DIR, 'android-chrome-512x512.png'));

                  // Update logo-config.ts to reflect custom logo
                  const configContent = `// Auto-generated logo configuration
export const logoConfig = {
  hasCustomLogo: true,
  logoType: '${isSvg ? 'svg' : 'png'}',
  updatedAt: ${Date.now()}
};
`;
                  fs.writeFileSync(path.resolve(__dirname, 'src/logo-config.ts'), configContent);

                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: true, logoType: isSvg ? 'svg' : 'png' }));
                } catch (err) {
                  console.error('Logo upload processing error:', err);
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: err instanceof Error ? err.message : 'Internal Server Error' }));
                }
              });
            } else if (req.url === '/api/reset-logo' && req.method === 'POST') {
              try {
                if (fs.existsSync(BACKUP_DIR)) {
                  const filesToRestore = [
                    'logo.svg',
                    'favicon.ico',
                    'favicon-16x16.png',
                    'favicon-32x32.png',
                    'favicon-96x96.png',
                    'apple-touch-icon.png',
                    'android-chrome-192x192.png',
                    'android-chrome-512x512.png'
                  ];
                  for (const file of filesToRestore) {
                    const backupPath = path.join(BACKUP_DIR, file);
                    const destPath = path.join(PUBLIC_DIR, file);
                    if (fs.existsSync(backupPath)) {
                      fs.copyFileSync(backupPath, destPath);
                    }
                  }

                  // Delete custom logos if they exist
                  const customPng = path.join(PUBLIC_DIR, 'logo-custom.png');
                  const customSvg = path.join(PUBLIC_DIR, 'logo-custom.svg');
                  if (fs.existsSync(customPng)) fs.unlinkSync(customPng);
                  if (fs.existsSync(customSvg)) fs.unlinkSync(customSvg);
                }

                // Reset config
                const configContent = `// Auto-generated logo configuration
export const logoConfig = {
  hasCustomLogo: false,
  logoType: 'default',
  updatedAt: ${Date.now()}
};
`;
                fs.writeFileSync(path.resolve(__dirname, 'src/logo-config.ts'), configContent);

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true }));
              } catch (err) {
                console.error('Logo reset processing error:', err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: err instanceof Error ? err.message : 'Internal Server Error' }));
              }
            } else {
              next();
            }
          });
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      proxy: {
        '/api-proxy/mymemory': {
          target: 'https://api.mymemory.translated.net',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api-proxy\/mymemory/, ''),
        },
        '/api-proxy/google': {
          target: 'https://translate.googleapis.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api-proxy\/google/, ''),
        }
      }
    },
  };
});
