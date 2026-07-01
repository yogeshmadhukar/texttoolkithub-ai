import React from 'react';

export const SecureBase64GuideContent: React.FC = () => {
  return (
    <>
      {/* Premium Badge / Introduction Section */}
      <div className="bg-gradient-to-r from-emerald-500/5 to-teal-500/5 border border-emerald-100/25 dark:border-emerald-950/25 p-6 rounded-2xl mb-8 flex flex-col md:flex-row gap-6 items-center" id="introduction">
        <div className="space-y-2">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Premium Developer Security Resource</span>
          <p className="text-xs text-slate-555 dark:text-slate-400 leading-relaxed">
            This comprehensive guide provides an authoritative, deep-dive examination of Base64 encoding and decoding. It details the underlying mathematical mechanics of 6-bit byte stream translation, explains standard padding constraints, analyzes the severe security risks associated with third-party web converters, and provides a production-ready, browser-side TypeScript engine to perform high-fidelity, secure local transformations.
          </p>
        </div>
      </div>

      <p className="text-base text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
        Base64 is one of the most fundamental binary-to-text encoding systems in modern software engineering. It resides at the core of everyday internet infrastructure—quietly facilitating authorization headers, JWT payloads, Kubernetes secret configurations, email attachments, XML structures, and embedded inline images.
      </p>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350 mt-4">
        Despite its ubiquity, Base64 remains a source of frequent developer confusion and severe security vulnerabilities. Many software engineers treat Base64 as a pseudo-security measure, confusing it with cryptography, while others routinely expose sensitive database passwords, API tokens, and private SSH keys to untrusted third-party online decoders.
      </p>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350 mt-3">
        To build secure, modern web architectures, we must fully understand the exact mathematical translations governing binary byte regroupings, the importance of padding equality flags, the distinct constraints of URL-safe variants, and why sandboxed local execution is an absolute requirement for handling corporate or personal secrets.
      </p>

      {/* SECTION 1: THE CORE MECHANICS OF BASE64 */}
      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="mechanics">The Core Mechanics of Base64</h2>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        Before looking at the math, we must establish a critical industry rule: **Base64 is strictly an encoding mechanism, not encryption.** It provides exactly zero cryptographic privacy or security. Any person or automated parser that intercepts a Base64 string can decode it back to its original cleartext form in microseconds.
      </p>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350 mt-3">
        The primary purpose of Base64 is **data preservation**. Historically, communication channels (such as SMTP email protocols, legacy network sockets, or early database architectures) were designed to process only plain-text ASCII streams. If you attempted to send a binary file (such as an image or a compiled executable) through these channels, the systems would misinterpret raw binary control characters, leading to corrupted data payloads.
      </p>

      <blockquote className="border-l-4 border-emerald-500 pl-4 py-2 text-slate-650 dark:text-slate-350 font-serif italic text-sm my-6 bg-emerald-50/10 dark:bg-emerald-950/5 p-4 rounded-r-xl">
        &quot;Base64 guarantees that binary datasets can be safely transmitted over text-only protocols by translating raw byte values into a clean, universally compatible set of 64 printable ASCII characters.&quot;
      </blockquote>

      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        The Standard Base64 index table consists of exactly 64 printable characters, represented by the following sequence:
      </p>
      <div className="bg-slate-50 dark:bg-[#0c1019] p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 font-mono text-xs text-indigo-600 dark:text-indigo-400 my-4 text-center">
        A-Z (Indices 0–25) &bull; a-z (Indices 26–51) &bull; 0-9 (Indices 52–61) &bull; + (Index 62) &bull; / (Index 63)
      </div>

      {/* SECTION 2: HOW BASE64 ENCODES BYTES */}
      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="encoding-bytes">How Base64 Encodes Bytes: The 6-Bit Mathematical Translation</h2>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        To understand how Base64 operates under the hood, we must look at the alignment of bit blocks. Computers store standard characters as **8-bit bytes** (octets). Base64, however, translates data using **6-bit blocks** (sextets). 
      </p>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350 mt-3">
        The mathematical magic relies on finding the least common multiple between 8 and 6, which is **24**. This means that every group of 3 raw bytes (3 x 8 bits = 24 bits) maps perfectly to exactly 4 Base64 characters (4 x 6 bits = 24 bits):
      </p>

      <div className="bg-slate-50 dark:bg-[#0c1019] p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 font-mono text-xs text-slate-700 dark:text-slate-300 my-6 space-y-3">
        <div className="font-bold border-b border-slate-200 dark:border-slate-800 pb-1.5 text-slate-900 dark:text-white">
          Step-by-Step Bit Extraction Map (Input: &quot;ABC&quot;)
        </div>
        <div>
          <span className="text-indigo-600 dark:text-indigo-400 font-bold">1. Input Octets:</span>
          <br />
          Characters: &apos;A&apos; (ASCII 65), &apos;B&apos; (ASCII 66), &apos;C&apos; (ASCII 67)
        </div>
        <div>
          <span className="text-indigo-600 dark:text-indigo-400 font-bold">2. Binary Stream representation (24-bits total):</span>
          <br />
          01000001 01000010 01000011
        </div>
        <div>
          <span className="text-indigo-600 dark:text-indigo-400 font-bold">3. Re-grouping into 6-bit sextets:</span>
          <br />
          010000 | 010100 | 001001 | 000011
        </div>
        <div>
          <span className="text-indigo-600 dark:text-indigo-400 font-bold">4. Converting sextets to Decimal Indices:</span>
          <br />
          Block 1: 010000 &rarr; Index 16
          <br />
          Block 2: 010100 &rarr; Index 20
          <br />
          Block 3: 001001 &rarr; Index 9
          <br />
          Block 4: 000011 &rarr; Index 3
        </div>
        <div>
          <span className="text-indigo-600 dark:text-indigo-400 font-bold">5. Mapping Indices to Base64 Characters:</span>
          <br />
          Index 16 &rarr; &apos;Q&apos; &bull; Index 20 &rarr; &apos;U&apos; &bull; Index 9 &rarr; &apos;J&apos; &bull; Index 3 &rarr; &apos;D&apos;
          <br />
          <strong className="text-emerald-600 dark:text-emerald-400">Final Base64 Output: QUJD</strong>
        </div>
      </div>

      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        Because 3 bytes of input data consistently convert into 4 characters of output text, Base64 encoding introduces a fixed **33.3% size expansion** to your files. If you encode a 3 MB file, the resulting Base64 string will require approximately 4 MB of storage and bandwidth.
      </p>

      {/* SECTION 3: BASE64 PADDING RULES */}
      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="padding-rules">The Mechanics of Base64 Padding: Deciphering the Equal Sign (=)</h2>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        What happens when your input dataset is not perfectly divisible by 3 bytes? If you encode a string with a length of 1 or 2 bytes, you are left with remaining bits that cannot fill a complete 24-bit group. 
      </p>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350 mt-3">
        To address this alignment issue, Base64 uses **padding characters** (represented by the equal sign `=`). The padding rules ensure the encoded string length remains a perfect multiple of 4 characters:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="p-5 bg-slate-50 dark:bg-[#111622] rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
          <span className="text-xs font-bold text-indigo-500 font-mono">CASE 1: 2 BYTES REMAINING</span>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Single Pad Symbol (=)</h4>
          <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed">
            When 2 bytes of data are left (16 bits), the encoder appends 2 zero-bits to create an 18-bit block, which converts into 3 Base64 characters. To complete the 4-character group, the system appends **one padding equal sign (`=`)**.
          </p>
        </div>
        <div className="p-5 bg-slate-50 dark:bg-[#111622] rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
          <span className="text-xs font-bold text-indigo-500 font-mono">CASE 2: 1 BYTE REMAINING</span>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Double Pad Symbol (==)</h4>
          <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed">
            When 1 byte of data remains (8 bits), the encoder appends 4 zero-bits to create a 12-bit block, which converts into 2 Base64 characters. To fill the remaining positions in the 4-character group, the system appends **two padding equal signs (`==`)**.
          </p>
        </div>
      </div>

      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        While some modern decoders can guess the missing characters and process strings without padding, preserving the trailing `=` characters is critical when interacting with strict, low-level APIs or enterprise servers that expect fully standardized Base64 formats.
      </p>

      {/* SECTION 4: THE SECURITY RISKS OF ONLINE CONVERTERS */}
      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="security-risks">The Severe Security Vulnerabilities of Online Converters</h2>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        When developers are troubleshooting authentication issues, inspecting JSON Web Tokens (JWTs), or configuring server environments, they often search the web for terms like *&quot;Base64 decoder online&quot;*. 
      </p>
      <p className="leading-relaxed text-rose-600 dark:text-rose-400 font-semibold mt-3">
        From a cybersecurity perspective, this habit introduces immediate, severe risks:
      </p>

      <ul className="list-disc pl-5 space-y-3 text-xs text-slate-650 dark:text-slate-350 my-5">
        <li>
          <strong>Remote Server Data Leakage:</strong> Many online utilities transmit your input string directly to remote servers for processing. If you are decoding a string that contains private database passwords, customer files, API keys, or active session tokens, you are sending those sensitive assets over public networks to a third-party server.
        </li>
        <li>
          <strong>Persistent Logging and Database Leaks:</strong> Untrusted developer utilities often log inputs into local databases or text files for debugging, telemetry, or advertising profiles. A server breach or an exposed directory on their end instantly leaks your corporate secrets to the dark web.
        </li>
        <li>
          <strong>Man-in-the-Middle (MitM) Attacks:</strong> If an online conversion site is not using strict HTTPS or secure cookie configurations, attackers on the same network can intercept the plain-text passwords or secret keys you paste into the browser window.
        </li>
      </ul>

      {/* SECTION 5: THE SECURE LOCAL BROWSER SOLUTION */}
      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="local-solution">The Solution: Browser-Side, Sandboxed Processing</h2>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        To address these vulnerabilities, our local <a href="/tools/base64-encoder" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Base64 Encoder</a> and <a href="/tools/base64-decoder" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Base64 Decoder</a> tools run entirely in your local browser sandbox.
      </p>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350 mt-3">
        All string operations and byte conversions are processed directly inside your device&apos;s active RAM buffer using native Web APIs. Absolutely zero data is uploaded to remote servers, and no background telemetry or analytic packets are transmitted. This sandboxed architecture guarantees your corporate keys and customer databases remain completely secure and private.
      </p>

      <div className="my-6 space-y-4">
        <div className="flex gap-4 p-5 bg-slate-50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 rounded-xl">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">UTF-8</div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Handling Multi-Byte Character Arrays</h4>
            <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed">
              Traditional JavaScript methods like `window.btoa()` and `window.atob()` fail when processing multi-byte Unicode characters (such as emojis or non-English alphabets), throwing a string compilation error. To prevent this, our tools utilize a robust binary-to-text wrapper that safely maps characters to their raw UTF-8 byte arrays first, ensuring accurate encoding and decoding.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 6: URL-SAFE BASE64 VARIANTS */}
      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="url-safe">URL-Safe Base64 Variants: RFC 4648 Specifications</h2>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        In standard Base64 encoding, the index characters `+` (index 62) and `/` (index 63) are used. However, these characters represent system control symbols in URL paths and database query strings:
      </p>
      <ul className="list-disc pl-5 space-y-2 text-xs text-slate-650 dark:text-slate-350 my-4">
        <li>The slash character (`/`) is interpreted as a folder directory separator.</li>
        <li>The plus sign (`+`) is often converted by browsers into a standard space character (` `), corrupting the payload.</li>
        <li>The padding equal sign (`=`) is interpreted as a key-value query parameter assignment.</li>
      </ul>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        To prevent these issues, **RFC 4648** defines a specialized **URL-Safe Base64** specification. The URL-safe variant maps index 62 to the hyphen (`-`) and index 63 to the underscore (`_`), while allowing the trailing padding equal signs (`=`) to be stripped out entirely, ensuring safe transmission across browser URL fields and web routes.
      </p>

      {/* SECTION 7: DEVELOPER BLUEPRINT - TYPESCRIPT ALGORITHM */}
      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="developer-blueprint">Developer Blueprint: Building a Safe UTF-8 Base64 Engine in TypeScript</h2>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        For software engineers, DevOps specialists, and security advocates, implementing local, high-fidelity conversion utilities is a critical part of building secure software pipelines. Below is a production-ready TypeScript implementation of an advanced **Base64 Processing Engine** that fully supports standard and URL-safe formats, handles multi-byte UTF-8 character arrays, and manages padding configurations:
      </p>

      <div className="bg-slate-50 dark:bg-[#0c1019] p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 font-mono text-xs text-slate-700 dark:text-slate-300 my-4 whitespace-pre-wrap">
{`interface Base64Options {
  urlSafe: boolean;
  stripPadding: boolean;
}

// Encodes a standard string into secure, local Base64
export function encodeBase64(input: string, options: Base64Options): string {
  if (!input) return '';

  // 1. Convert string to a UTF-8 Uint8Array to support multi-byte Unicode characters
  const encoder = new TextEncoder();
  const byteArray = encoder.encode(input);

  // 2. Map binary bytes to standard Latin-1 string indices
  let binaryString = '';
  byteArray.forEach((byte) => {
    binaryString += String.fromCharCode(byte);
  });

  // 3. Perform local binary-to-ascii conversion
  let base64Result = window.btoa(binaryString);

  // 4. Handle URL-safe conversions if specified
  if (options.urlSafe) {
    base64Result = base64Result
      .replace(/\\+/g, '-')
      .replace(/\\//g, '_');
  }

  // 5. Handle padding removal
  if (options.stripPadding) {
    base64Result = base64Result.replace(/=+$/, '');
  }

  return base64Result;
}

// Decodes a local Base64 string back into standard UTF-8 text
export function decodeBase64(encoded: string, options: Base64Options): string {
  if (!encoded) return '';

  let sanitized = encoded.trim();

  // 1. Restore URL-safe characters back to standard indices
  if (options.urlSafe) {
    sanitized = sanitized
      .replace(/-/g, '+')
      .replace(/_/g, '/');
  }

  // 2. Re-apply missing padding characters if they were stripped
  if (options.stripPadding || sanitized.length % 4 !== 0) {
    const missingPadding = (4 - (sanitized.length % 4)) % 4;
    sanitized += '='.repeat(missingPadding);
  }

  // 3. Perform local ASCII-to-binary conversion
  const binaryString = window.atob(sanitized);

  // 4. Map Latin-1 indices back into a binary Uint8Array
  const byteArray = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    byteArray[i] = binaryString.charCodeAt(i);
  }

  // 5. Decode raw bytes back to a standard UTF-8 string
  const decoder = new TextDecoder('utf-8', { fatal: true });
  return decoder.decode(byteArray);
}`}
      </div>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        This program uses native browser Web APIs (`TextEncoder` and `TextDecoder`) to handle multi-byte Unicode characters and emojis safely, preventing any text corruption errors during encoding and decoding.
      </p>

      {/* SECTION 8: COMMON PRODUCTIVITY PITFALLS */}
      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="pitfalls">Common Base64 Pitfalls and How to Avoid Them</h2>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        Avoid these common architectural mistakes when implementing or using Base64 encoding in your systems:
      </p>

      <div className="space-y-4 my-6">
        <div className="p-5 bg-slate-50 dark:bg-[#111622] rounded-xl border border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-2">1. Using Base64 as a Security Hashing Layer</h4>
          <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed">
            <strong>The Problem:</strong> Storing database passwords or sensitive configuration strings in Base64 under the assumption that it hides the data. Because anyone can decode Base64 in milliseconds, this leaves your assets completely exposed.
            <br />
            <strong>The Fix:</strong> Always use strong, cryptographic hashing algorithms (like Argon2, bcrypt, or PBKDF2) to hash passwords, and industry-standard AES-256 encryption to secure sensitive static data.
          </p>
        </div>
        <div className="p-5 bg-slate-50 dark:bg-[#111622] rounded-xl border border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-2">2. Unicode Conversion Errors (The Mojibake Trap)</h4>
          <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed">
            <strong>The Problem:</strong> Attempting to use basic JavaScript `window.btoa()` directly on text containing special characters or emojis. This throws a `DOMException` error or corrupts the characters during decoding, a problem known as Mojibake.
            <br />
            <strong>The Fix:</strong> Always use `TextEncoder` and `TextDecoder` to convert your strings into raw UTF-8 binary byte arrays before performing Base64 conversions.
          </p>
        </div>
        <div className="p-5 bg-slate-50 dark:bg-[#111622] rounded-xl border border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-2">3. Overlooking Size Expansion in Database Storage</h4>
          <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed">
            <strong>The Problem:</strong> Storing large binary files (like high-resolution images or videos) as Base64 strings inside database rows. The 33.3% size expansion can rapidly bloat your database, degrading query performance and increasing storage costs.
            <br />
            <strong>The Fix:</strong> Store large binary files in secure Object Storage buckets (like Google Cloud Storage or AWS S3), and save only the secure file path URL inside your database rows.
          </p>
        </div>
      </div>

      {/* SECTION 9: FAQs */}
      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="faqs">Frequently Asked Questions (FAQ)</h2>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350 mb-6">
        Explore detailed, expert answers to the most common questions regarding Base64 byte mechanics, security rules, and performance standards:
      </p>

      <div className="space-y-4 my-6">
        <div className="p-5 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">Q: Why does Base64 make file sizes 33% larger?</h4>
          <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed">
            A: Base64 works by grouping binary data into 6-bit chunks, whereas standard file storage uses 8-bit bytes. Because 6 bits can only represent 64 possible values, Base64 requires 4 characters to represent 3 bytes of raw data. This conversion results in a fixed 33.3% increase in character length and file size.
          </p>
        </div>
        <div className="p-5 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">Q: What is the difference between standard Base64 and Base64URL?</h4>
          <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed">
            A: Standard Base64 uses the `+` and `/` characters, which can break when transmitted inside URL paths or database query strings. Base64URL replaces `+` with a hyphen (`-`) and `/` with an underscore (`_`), while allowing the trailing padding equal signs (`=`) to be removed, making it perfectly safe for browser URLs.
          </p>
        </div>
        <div className="p-5 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">Q: Is Base64 a secure way to hide client-side API keys?</h4>
          <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed">
            A: No, Base64 is not a security layer. Storing API keys or configuration passwords in Base64 offers zero protection. Any browser user can open the developer console and decode your keys instantly. You should always use server-side environment variables to manage sensitive API credentials.
          </p>
        </div>
        <div className="p-5 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">Q: How can I encode binary files or strings in a Node.js server instead of a browser?</h4>
          <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed">
            A: Node.js does not support native `window.btoa()` or `window.atob()` methods. Instead, you should use the high-performance, native `Buffer` class:
            <br />
            <code className="block font-mono text-[10px] mt-2 text-indigo-600 dark:text-indigo-400">
              // Encode: Buffer.from(rawText, &apos;utf-8&apos;).toString(&apos;base64&apos;);
              <br />
              // Decode: Buffer.from(encodedText, &apos;base64&apos;).toString(&apos;utf-8&apos;);
            </code>
          </p>
        </div>
      </div>

      {/* SECTION 10: SUMMARY & CHECKLIST */}
      <div className="bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800/80 p-6 md:p-8 rounded-2xl text-center space-y-4 my-8" id="summary">
        <h3 className="text-base font-bold text-slate-900 dark:text-white font-sans">Summary Checklist: Secure Base64 Guidelines</h3>
        <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
          Ensure your data conversions are secure and robust by following this quick quality checklist for Base64 operations:
        </p>
        <ul className="list-disc pl-5 text-left text-xs text-slate-650 dark:text-slate-455 space-y-2 max-w-lg mx-auto">
          <li><strong>No Server Uploads:</strong> Only decode credentials or passwords using local, client-side, sandboxed tools.</li>
          <li><strong>Use URL-Safe Variants:</strong> Swap `+` and `/` characters when placing Base64 strings in URL parameters or web routes.</li>
          <li><strong>Preserve Padding:</strong> Keep trailing equal signs (`=`) when sending data to strict backend services or APIs.</li>
          <li><strong>UTF-8 Compatibility:</strong> Always map strings to UTF-8 byte arrays first to prevent Unicode and emoji corruption.</li>
        </ul>
      </div>
    </>
  );
};
