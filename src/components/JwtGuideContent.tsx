import React from 'react';

export const JwtGuideContent: React.FC = () => {
  return (
    <>
      {/* Premium Badge / Introduction Section */}
      <div className="bg-gradient-to-r from-teal-500/5 to-emerald-500/5 border border-teal-100/25 dark:border-teal-950/25 p-6 rounded-2xl mb-8 flex flex-col md:flex-row gap-6 items-center" id="introduction">
        <div className="space-y-2">
          <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest">Premium Security Architecture Resource</span>
          <p className="text-xs text-slate-555 dark:text-slate-400 leading-relaxed">
            This deep-dive guide explores the technical structure, token-based authentication lifecycles, and security protocols of JSON Web Tokens (JWT). From base64url parsing mechanics to asymmetric key validation (RS256 vs. HS256) and preventative measures against token hijacking, this guide outlines robust practices for modern web environments.
          </p>
        </div>
      </div>

      <p className="text-base text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
        JSON Web Tokens (JWT) have emerged as the industry standard for lightweight, stateless authentication and secure claim transmission across distributed systems. They are standard in microservice environments, OAuth 2.0 flows, and Single Page Applications (SPAs).
      </p>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350 mt-4">
        Despite their extensive deployment, JWTs are frequently misunderstood. Many developers treat JWTs as encrypted payloads, inadvertently exposing customer PII or corporate secrets inside plain Base64 strings. Others implement loose validation routines that leave their applications open to trivial signature bypass exploits.
      </p>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350 mt-3">
        To construct robust, enterprise-grade authentication frameworks, software architects must fully comprehend how JWT payloads are built, validated, parsed, and audited locally in-browser.
      </p>

      {/* SECTION 1: THE THREE-PART STRUCTURE */}
      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="jwt-structure">The Anatomy of a JWT: Header, Payload, and Signature</h2>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        A JSON Web Token in its serialized form is represented as a compact, URL-safe string containing exactly three segments separated by dots (<code className="font-mono">.</code>):
      </p>
      <div className="bg-slate-50 dark:bg-[#0c1019] p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 font-mono text-xs my-4 text-center break-all whitespace-normal">
        <span className="text-red-500 font-bold inline-block break-all">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9</span>
        <span className="text-slate-450 font-bold">.</span>
        <span className="text-blue-500 font-bold inline-block break-all">eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9</span>
        <span className="text-slate-450 font-bold">.</span>
        <span className="text-emerald-500 font-bold inline-block break-all">SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c</span>
      </div>

      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        Let us isolate and analyze each of these three distinct components:
      </p>

      <div className="space-y-4 my-6">
        <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/65 dark:border-slate-800">
          <h4 className="text-xs font-bold text-red-550 dark:text-red-400 uppercase tracking-wider mb-1.5">1. The Header: Metadata &amp; Algorithm</h4>
          <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed">
            The header declares the structural metadata for the token. It is a Base64URL-encoded JSON block containing parameters like the token type (usually <code className="font-mono">"typ": "JWT"</code>) and the cryptographic signing algorithm (such as <code className="font-mono">"alg": "HS256"</code> or <code className="font-mono">"alg": "RS256"</code>).
          </p>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/65 dark:border-slate-800">
          <h4 className="text-xs font-bold text-blue-550 dark:text-blue-400 uppercase tracking-wider mb-1.5">2. The Payload: User Claims &amp; Identity</h4>
          <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed">
            The payload houses the actual "claims"—assertions about the authenticated entity and associated metadata. It includes registered claims (e.g. <code className="font-mono">"sub"</code> for subject, <code className="font-mono">"exp"</code> for expiration, and <code className="font-mono">"iss"</code> for issuer) alongside custom claims required by your application context (such as roles, permissions, or user profiles).
          </p>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/65 dark:border-slate-800">
          <h4 className="text-xs font-bold text-emerald-550 dark:text-emerald-400 uppercase tracking-wider mb-1.5">3. The Signature: Cryptographic Verification</h4>
          <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed">
            The signature guarantees that the token has not been altered during transmission. It is created by taking the encoded header, the encoded payload, appending your application's private/secret key, and hashing the combination using the algorithm declared in the header.
          </p>
        </div>
      </div>

      {/* SECTION 2: SYMMETRIC VS ASYMMETRIC */}
      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="jwt-algorithms">Symmetric (HS256) vs. Asymmetric (RS256) Signing</h2>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        Choosing the right signing algorithm is a foundational architectural decision that dictates key distribution protocols across your system:
      </p>

      <div className="my-6 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-xs text-left border-collapse font-sans">
          <thead>
            <tr className="bg-slate-50 dark:bg-[#0c1019] border-b border-slate-200 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-200">
              <th className="p-3">Dimension</th>
              <th className="p-3">Symmetric (HS256)</th>
              <th className="p-3">Asymmetric (RS256)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150 dark:divide-slate-800 text-slate-650 dark:text-slate-350">
            <tr>
              <td className="p-3 font-semibold text-teal-650 dark:text-teal-400">Key Type</td>
              <td className="p-3">Single shared secret string.</td>
              <td className="p-3">Public/Private cryptographic keypair (RSA/ECDSA).</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-teal-650 dark:text-teal-400">Signing Power</td>
              <td className="p-3">Any microservice with the secret can sign tokens.</td>
              <td className="p-3">Only the central Auth server possesses the Private key.</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-teal-650 dark:text-teal-400">Verification</td>
              <td className="p-3">Requires sharing the secret key across all consumers.</td>
              <td className="p-3">Downstream services verify tokens freely using the Public key.</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-teal-650 dark:text-teal-400">Best For</td>
              <td className="p-3">Internal systems, simple monorepo architectures.</td>
              <td className="p-3">Multi-party, cross-tenant, and decentralized APIs.</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* SECTION 3: SECURITY VULNERABILITIES */}
      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="jwt-vulnerabilities">Top JWT Security Pitfalls &amp; Remedies</h2>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        JWT systems can fall victim to specific architectural flaws. Let's explore the most critical security vectors:
      </p>

      <ul className="list-disc pl-5 space-y-2 text-xs text-slate-650 dark:text-slate-350 my-4">
        <li><strong>The "alg: none" Bypass:</strong> Early JWT parsers had a vulnerability where setting the header algorithm parameter <code className="font-mono">"alg": "none"</code> bypassed verification entirely. Attackers could craft custom administrator tokens, strip the signature, and submit them. Modern JWT libraries explicitly disable the <code className="font-mono">none</code> algorithm by default.</li>
        <li><strong>Weak Shared Secrets:</strong> In HS256 setups, developers often use weak secrets (e.g. <code className="font-mono">"super-secret-key"</code>). Offline brute-force tools can guess these secrets in seconds. Secrets must contain at least 256 bits of high-entropy random data.</li>
        <li><strong>Confusing Base64 with Encryption:</strong> Never write sensitive or proprietary parameters (e.g. user passwords, bank information, API keys) inside your claims, because the token payload can be fully inspected by anyone who accesses it.</li>
      </ul>

      {/* SECTION 4: FAQS */}
      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="faqs">Frequently Asked Questions (FAQ)</h2>
      
      <div className="space-y-4 my-6">
        <div className="p-5 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">Q: Why are browser-native JWT decoders superior for checking secrets?</h4>
          <p className="text-[11px] text-slate-555 dark:text-slate-400 leading-relaxed">
            A: Sending your active session JWTs to external cloud-hosted decoding websites exposes authentication credentials to third parties. If those logs are intercepted, attackers can hijack user sessions easily. Local-first, sandboxed decoders process tokens exclusively within your browser's local sandbox, keeping keys confidential.
          </p>
        </div>
        <div className="p-5 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">Q: What are the best practices for token storage on client devices?</h4>
          <p className="text-[11px] text-slate-555 dark:text-slate-400 leading-relaxed">
            A: Storing JWTs inside standard <code className="font-mono">localStorage</code> is highly convenient, but exposes them to Cross-Site Scripting (XSS) extraction attacks. For critical workloads, serve tokens inside secure, server-set <code className="font-mono">HttpOnly; Secure; SameSite=Strict</code> cookies. This completely blocks browser scripts from reading or stealing your authentication state.
          </p>
        </div>
        <div className="p-5 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">Q: How should token expiration (exp) and revocation be managed?</h4>
          <p className="text-[11px] text-slate-555 dark:text-slate-400 leading-relaxed">
            A: Because JWT validation is stateless, a token remains valid until its <code className="font-mono">exp</code> timestamp passes, even if the user changes their password or is banned. To address this, use brief expiration intervals (e.g., 15 minutes) for access tokens, and pair them with a secure refresh token mechanism managed by a centralized, lightweight denylist database.
          </p>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800/80 p-6 md:p-8 rounded-2xl text-center space-y-4 my-8">
        <h3 className="text-base font-bold text-slate-900 dark:text-white font-sans">Summary: Architecting Token Frameworks Securely</h3>
        <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
          JSON Web Tokens are exceptionally efficient tools for stateless federation, but require careful security engineering. By using strong signature keys, disabling dangerous fallback algorithms, encrypting transport lanes, and checking payloads only in secure local tools, you can establish pristine developer frameworks.
        </p>
      </div>
    </>
  );
};
