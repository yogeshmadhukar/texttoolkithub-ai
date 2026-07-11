import React from 'react';

export const QrGuideContent: React.FC = () => {
  return (
    <>
      <div className="bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border border-indigo-100/25 dark:border-indigo-950/25 p-6 rounded-2xl mb-8 flex flex-col md:flex-row gap-6 items-center" id="introduction">
        <div className="space-y-2">
          <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Barcoding & Data Standard</span>
          <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed">
            This detailed guide dissects the matrix anatomy, encoding modes, Reed-Solomon algebraic error correction, and scanning tolerances of modern 2D Quick Response barcodes.
          </p>
        </div>
      </div>

      <p className="text-base text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
        Invented in 1994 by Masahiro Hara of Denso Wave (a subsidiary of Toyota), the Quick Response (QR) code revolutionized physical-to-digital tracking. Originally designed to trace automobile components during assembly, QR codes became globally ubiquitous due to their exceptionally rapid scanning speeds, multi-angle readability, and robust data persistence. Today, QR codes facilitate contactless mobile payments, digital boarding passes, inventory logistics, and seamless marketing connections in a single scan.
      </p>

      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="qr-anatomy">The Structural Anatomy of a 2D QR Matrix</h2>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        Unlike traditional linear barcodes that store information horizontally (1D), QR codes are two-dimensional (2D) square grids. The dark and light modules of this grid represent binary ones and zeros. To decode this binary structure, scanners utilize physical geometric anchors built directly into the QR pattern:
      </p>
      <ul className="list-disc pl-5 space-y-2 text-xs text-slate-650 dark:text-slate-350 my-4">
        <li><strong>Finder Patterns:</strong> The three prominent double-square symbols in the top-left, top-right, and bottom-left corners. These tell the camera scanner where the edges of the QR code lie and determine its rotational orientation.</li>
        <li><strong>Alignment Patterns:</strong> Smaller square structures (starting in Version 2) that help calibrate the scanner to compensate for physical distortion or angled camera perspectives.</li>
        <li><strong>Timing Patterns:</strong> One-module-wide alternating black-and-white rows and columns connecting the finder patterns. These define the baseline coordinate grid of the matrix.</li>
        <li><strong>Quiet Zone:</strong> A solid white margin surrounding the entire QR square. This separates the QR matrix from surrounding visual clutter, allowing the image processor to detect the code reliably. The quiet zone should be at least four modules wide.</li>
      </ul>

      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="error-correction">Reed-Solomon Algebraic Error Correction</h2>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        One of the most powerful features of QR codes is their ability to withstand physical damage—such as scratches, dirt, tears, or partial obstructions—without losing data. This durability is driven by **Reed-Solomon Error Correction**, a sophisticated polynomial-based error correction algorithm.
      </p>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350 mt-3">
        When generating a QR code, extra mathematical parity blocks are appended to the payload. When scanning, the parser uses these parity bytes to reconstruct missing or distorted data modules. QR codes support four error correction levels:
      </p>
      <div className="my-6 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-xs text-left border-collapse font-sans">
          <thead>
            <tr className="bg-slate-50 dark:bg-[#0c1019] border-b border-slate-200 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-200">
              <th className="p-3">Error Correction Level</th>
              <th className="p-3">Damage Tolerance Limit</th>
              <th className="p-3">Recommended Use Case</th>
              <th className="p-3">Matrix Density Impact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150 dark:divide-slate-800 text-slate-650 dark:text-slate-350">
            <tr>
              <td className="p-3 font-semibold">Level L (Low)</td>
              <td className="p-3">~7% of data restorable</td>
              <td className="p-3">High-resolution print media, clean screens</td>
              <td className="p-3">Lowest density: Fits maximum characters in a small grid.</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold">Level M (Medium)</td>
              <td className="p-3">~15% of data restorable</td>
              <td className="p-3">Default setting, general brochures, packaging</td>
              <td className="p-3">Balanced: Solid durability with modest density.</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold">Level Q (Quartile)</td>
              <td className="p-3">~25% of data restorable</td>
              <td className="p-3">Industrial environments, shipping labels</td>
              <td className="p-3">High density: Grid becomes visibly more complex.</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold">Level H (High)</td>
              <td className="p-3">~30% of data restorable</td>
              <td className="p-3">Outdoor banners, logos embedded inside codes</td>
              <td className="p-3">Highest density: Max durability, requiring a larger print size.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="styling-limits">Designing Custom QR Codes: The Scanning Pitfalls</h2>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        While custom-styled QR codes (with rounded modules, gradient colors, or center logos) look professional, they can easily cause scanning failures if design parameters exceed mathematical limits.
      </p>
      <ul className="list-disc pl-5 space-y-2 text-xs text-slate-650 dark:text-slate-350 my-4">
        <li><strong>Maintain High Contrast:</strong> Scanners work by measuring light reflectance. If the dark modules and light background have low contrast (e.g., gold on light yellow), the scanner's image binarizer will fail to resolve the grid coordinates.</li>
        <li><strong>Ensure a Solid Finder Pattern:</strong> Never deform, overlay, or break the three finder patterns. Scanners rely on these exact 1:1:3:1:1 module ratios to locate and parse the QR grid.</li>
        <li><strong>Use Level H for Logos:</strong> If placing a custom logo or icon in the center of the QR code, always use Level H error correction. This ensures the scanner can recover the data covered by the graphic.</li>
      </ul>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350 mt-3">
        Using our local-first <a href="/tools/qr-generator" className="text-indigo-650 dark:text-indigo-400 font-semibold hover:underline">QR Code Generator</a>, you can securely customize your QR payloads, export SVG vectors, and select optimal error correction parameters without sending sensitive credentials to third-party databases.
      </p>

      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="faqs">Frequently Asked Questions (FAQ)</h2>
      <div className="space-y-4 my-6">
        <div className="p-4 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">Q: Do QR codes have a character limit or size expiration date?</h4>
          <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed">
            A: QR codes do not expire; the encoded string data is physically embedded inside the module matrix. A Version 40 QR code with Level L correction can encode up to **7,089 numeric characters** or **2,953 binary bytes** of raw information.
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">Q: What is the difference between static and dynamic QR codes?</h4>
          <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed">
            A: Static QR codes directly embed the final destination payload. Dynamic QR codes encode a shortened redirection URL pointing to a web server. This server logs the scan metrics and forwards the client to the final target page, allowing you to modify the destination URL after print production.
          </p>
        </div>
      </div>
    </>
  );
};
