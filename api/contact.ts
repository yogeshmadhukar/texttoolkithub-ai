import nodemailer from 'nodemailer';

// Simple in-memory rate limiter per IP (max 5 requests per 10 mins)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minutes
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return false;
  }

  if (record.count >= 5) {
    return true;
  }

  record.count += 1;
  return false;
}

// Helper to escape HTML characters to prevent XSS in HTML emails
function escapeHtml(text: string): string {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Remove control characters and newlines to prevent email header injection
function sanitizeHeader(text: string): string {
  return String(text).replace(/[\r\n\t]/g, ' ').trim();
}

export async function handleContactRequest(req: any, res: any) {
  // CORS & Methods Handling
  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method Not Allowed. Only POST requests are supported.' }));
    return;
  }

  // Extract client IP & User Agent
  const xForwardedFor = req.headers ? (req.headers['x-forwarded-for'] || req.headers['X-Forwarded-For']) : undefined;
  const rawIp = Array.isArray(xForwardedFor) ? xForwardedFor[0] : (xForwardedFor || (req.socket ? req.socket.remoteAddress : '127.0.0.1'));
  const ipAddress = sanitizeHeader(String(rawIp || '127.0.0.1').split(',')[0]);
  const userAgent = sanitizeHeader(req.headers ? (req.headers['user-agent'] || 'Unknown User Agent') : 'Unknown');

  // Rate Limiting
  if (isRateLimited(ipAddress)) {
    res.statusCode = 429;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Too many contact requests from your IP. Please try again in a few minutes.' }));
    return;
  }

  try {
    // Parse request body
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    } else if (!body) {
      body = {};
    }

    const { name, email, category, message, honeypot } = body;

    // Honeypot trap for automated bots
    if (honeypot && String(honeypot).trim().length > 0) {
      // Fake successful response to trick spam bots without sending email
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true, ticketId: `TK-${Math.floor(100000 + Math.random() * 900000)}` }));
      return;
    }

    // Server-Side Field Validation
    const cleanName = sanitizeHeader(name || '');
    const cleanEmail = sanitizeHeader(email || '');
    const cleanCategory = sanitizeHeader(category || 'General Feedback');
    const cleanMessage = String(message || '').trim();

    if (!cleanName || cleanName.length < 2 || cleanName.length > 100) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Validation Error: Name must be between 2 and 100 characters.' }));
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail) || cleanEmail.length > 255) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Validation Error: Please provide a valid email address.' }));
      return;
    }

    if (!cleanMessage || cleanMessage.length < 10 || cleanMessage.length > 5000) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Validation Error: Message must be between 10 and 5,000 characters.' }));
      return;
    }


    // SMTP Credentials Check
    const smtpHost = process.env.SMTP_HOST || 'smtp.hostinger.com';
    const smtpPort = Number(process.env.SMTP_PORT) || 465;
    const smtpSecure = process.env.SMTP_SECURE !== 'false'; // default true for 465
    const smtpUser = process.env.SMTP_USER || 'support@texttoolkithub.com';
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpPass) {
      console.error('[SMTP Error]: Hostinger SMTP_PASS environment variable is not defined.');
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ 
        error: 'Email Service Configuration Error: Hostinger SMTP password is missing on server. Please configure SMTP_PASS in Environment Variables.' 
      }));
      return;
    }

    // Create Hostinger Nodemailer Transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure, // true for 465, false for 587
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        rejectUnauthorized: true,
      },
      connectionTimeout: 10000,
    });

    const formattedDate = new Date().toUTCString();
    const ticketId = `TK-${Math.floor(100000 + Math.random() * 900000)}`;

    // Prepare HTML template for Admin Notification Email
    const adminEmailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>New Contact Form Submission – TextToolkitHub</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f9; color: #1e293b; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { background: #0f172a; padding: 24px; color: #ffffff; text-align: left; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 700; tracking-tight; }
    .header p { margin: 6px 0 0; font-size: 13px; color: #94a3b8; }
    .content { padding: 28px; }
    .field-group { margin-bottom: 20px; }
    .field-label { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px; margin-bottom: 4px; }
    .field-value { font-size: 14px; color: #0f172a; line-height: 1.5; font-weight: 500; }
    .message-box { background: #f8fafc; border-left: 4px solid #6366f1; padding: 16px; border-radius: 6px; font-size: 14px; color: #334155; white-space: pre-wrap; word-break: break-word; }
    .meta-table { width: 100%; border-collapse: collapse; margin-top: 24px; font-size: 12px; background: #f8fafc; border-radius: 8px; overflow: hidden; }
    .meta-table td { padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #475569; }
    .meta-table td strong { color: #0f172a; }
    .footer { background: #f1f5f9; padding: 16px 28px; font-size: 12px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Contact Form Submission – TextToolkitHub</h1>
      <p>Reference Ticket ID: <strong>${ticketId}</strong></p>
    </div>
    <div class="content">
      <div class="field-group">
        <div class="field-label">Name</div>
        <div class="field-value">${escapeHtml(cleanName)}</div>
      </div>
      
      <div class="field-group">
        <div class="field-label">Email</div>
        <div class="field-value"><a href="mailto:${escapeHtml(cleanEmail)}" style="color: #4f46e5; text-decoration: none;">${escapeHtml(cleanEmail)}</a></div>
      </div>

      <div class="field-group">
        <div class="field-label">Category / Subject</div>
        <div class="field-value">${escapeHtml(cleanCategory)}</div>
      </div>

      <div class="field-group">
        <div class="field-label">Message</div>
        <div class="message-box">${escapeHtml(cleanMessage).replace(/\n/g, '<br/>')}</div>
      </div>

      <table class="meta-table">
        <tr>
          <td><strong>Date &amp; Time:</strong></td>
          <td>${formattedDate}</td>
        </tr>
        <tr>
          <td><strong>IP Address:</strong></td>
          <td>${escapeHtml(ipAddress)}</td>
        </tr>
        <tr>
          <td><strong>User Agent:</strong></td>
          <td>${escapeHtml(userAgent)}</td>
        </tr>
      </table>
    </div>
    <div class="footer">
      Automated System Alert from TextToolkitHub Hostinger SMTP Gateway
    </div>
  </div>
</body>
</html>
`;

    // --- SMTP AUDIT & TRANSMISSION ---
    console.log('================== SMTP AUDIT START ==================');
    console.log(`[SMTP Audit] SMTP Host: "${smtpHost}"`);
    console.log(`[SMTP Audit] SMTP Port: ${smtpPort}`);
    console.log(`[SMTP Audit] SSL/TLS (Secure): ${smtpSecure}`);
    console.log(`[SMTP Audit] Auth Username (User): "${smtpUser}"`);
    console.log(`[SMTP Audit] Auth Password defined: ${smtpPass ? `YES (length: ${smtpPass.length} chars)` : 'NO'}`);
    console.log(`[SMTP Audit] Admin Recipient (To): "support@texttoolkithub.com"`);
    console.log(`[SMTP Audit] User Recipient (To): "${cleanEmail}"`);
    console.log('======================================================');

    // 1. Verifying SMTP Connection / Configuration
    console.log('[SMTP Audit] Step 1: Performing transporter.verify() connection and auth handshake...');
    try {
      await transporter.verify();
      console.log('[SMTP Audit] Step 1 SUCCESS: SMTP connection and credentials handshake verified successfully.');
    } catch (verifyErr: any) {
      console.error('[SMTP Audit Error] Step 1 FAILURE: SMTP connection/auth handshake failed:', verifyErr);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ 
        error: `SMTP Configuration / Connection Verification Failed: ${verifyErr.message || 'Unknown verification error'}` +
               (verifyErr.code ? ` (Code: ${verifyErr.code})` : '') +
               (verifyErr.response ? ` (Response: ${verifyErr.response})` : '') +
               (verifyErr.responseCode ? ` (Response Code: ${verifyErr.responseCode})` : '') +
               (verifyErr.command ? ` (Command: ${verifyErr.command})` : '')
      }));
      return;
    }

    // 2. Send Admin Notification Email
    console.log('[SMTP Audit] Step 2: Sending Admin Notification Email...');
    let adminEmailInfo;
    try {
      adminEmailInfo = await transporter.sendMail({
        from: `"TextToolkitHub System" <${smtpUser}>`,
        to: 'support@texttoolkithub.com',
        replyTo: `"${sanitizeHeader(cleanName)}" <${cleanEmail}>`,
        subject: `New Contact Form Submission – TextToolkitHub`,
        html: adminEmailHtml,
      });

      console.log('[SMTP Audit] Step 2 SUCCESS: Admin Notification Email was transmitted.');
      console.log('[SMTP Audit] Message ID:', adminEmailInfo.messageId);
      console.log('[SMTP Audit] Envelope:', JSON.stringify(adminEmailInfo.envelope));
      console.log('[SMTP Audit] Accepted Recipients:', JSON.stringify(adminEmailInfo.accepted));
      console.log('[SMTP Audit] Rejected Recipients:', JSON.stringify(adminEmailInfo.rejected));
      console.log('[SMTP Audit] SMTP Server Response:', adminEmailInfo.response);

      // Verify recipient was accepted
      const adminAccepted = (adminEmailInfo.accepted || []).map((e: string) => e.toLowerCase());
      const isAdminAccepted = adminAccepted.includes('support@texttoolkithub.com');
      if (!isAdminAccepted) {
        throw new Error(`Recipient support@texttoolkithub.com was NOT accepted by SMTP server. Rejected: ${JSON.stringify(adminEmailInfo.rejected)}`);
      }
    } catch (sendErr: any) {
      console.error('[SMTP Audit Error] Step 2 FAILURE: Admin email transmission failed:', sendErr);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        error: `SMTP Error: Admin email transmission failed: ${sendErr.message || 'Unknown sending error'}` +
               (sendErr.code ? ` (Code: ${sendErr.code})` : '') +
               (sendErr.response ? ` (Response: ${sendErr.response})` : '') +
               (sendErr.responseCode ? ` (Response Code: ${sendErr.responseCode})` : '') +
               (sendErr.command ? ` (Command: ${sendErr.command})` : '')
      }));
      return;
    }

    // Prepare HTML template for Automatic Acknowledgement Email to Sender
    const ackEmailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>We've Received Your Message – TextToolkitHub</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f9; color: #1e293b; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { background: #4f46e5; padding: 28px; color: #ffffff; text-align: center; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 700; }
    .header p { margin: 6px 0 0; font-size: 13px; color: #e0e7ff; }
    .content { padding: 28px; }
    p { font-size: 14px; line-height: 1.6; color: #334155; margin: 0 0 16px; }
    .summary-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin: 20px 0; }
    .summary-title { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; margin-bottom: 8px; letter-spacing: 0.5px; }
    .summary-text { font-size: 13px; color: #475569; font-style: italic; white-space: pre-wrap; word-break: break-word; }
    .footer { background: #f8fafc; padding: 20px; font-size: 12px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0; }
    .footer a { color: #4f46e5; text-decoration: none; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>TextToolkitHub Support</h1>
      <p>Thank you for reaching out to us</p>
    </div>
    <div class="content">
      <p>Hello <strong>${escapeHtml(cleanName)}</strong>,</p>
      <p>We have successfully received your message regarding <strong>${escapeHtml(cleanCategory)}</strong>. Our engineering and editorial team will review your inquiry and get back to you within 12 to 24 hours.</p>
      
      <div class="summary-box">
        <div class="summary-title">Summary of Your Message (Ref: ${ticketId})</div>
        <div class="summary-text">"${escapeHtml(cleanMessage)}"</div>
      </div>

      <p>If you have any additional details or updates to provide, simply reply directly to this email.</p>

      <p>Best regards,<br/><strong>The TextToolkitHub Team</strong></p>
    </div>
    <div class="footer">
      TextToolkitHub – Free Online Text &amp; PDF Utilities<br/>
      <a href="https://texttoolkithub.com">https://texttoolkithub.com</a> | <a href="mailto:support@texttoolkithub.com">support@texttoolkithub.com</a>
    </div>
  </div>
</body>
</html>
`;

    // 3. Send Automatic Acknowledgement Email to User
    console.log('[SMTP Audit] Step 3: Sending Automatic Acknowledgement Email to User...');
    let ackEmailInfo;
    try {
      ackEmailInfo = await transporter.sendMail({
        from: `"TextToolkitHub Support" <${smtpUser}>`,
        to: `"${sanitizeHeader(cleanName)}" <${cleanEmail}>`,
        subject: `We've received your message – TextToolkitHub Support`,
        html: ackEmailHtml,
      });

      console.log('[SMTP Audit] Step 3 SUCCESS: Acknowledgement Email was transmitted.');
      console.log('[SMTP Audit] Message ID (Ack):', ackEmailInfo.messageId);
      console.log('[SMTP Audit] Envelope (Ack):', JSON.stringify(ackEmailInfo.envelope));
      console.log('[SMTP Audit] Accepted Recipients (Ack):', JSON.stringify(ackEmailInfo.accepted));
      console.log('[SMTP Audit] Rejected Recipients (Ack):', JSON.stringify(ackEmailInfo.rejected));
      console.log('[SMTP Audit] SMTP Server Response (Ack):', ackEmailInfo.response);

      // Verify recipient was accepted
      const ackAccepted = (ackEmailInfo.accepted || []).map((e: string) => e.toLowerCase());
      const isAckAccepted = ackAccepted.includes(cleanEmail.toLowerCase());
      if (!isAckAccepted) {
        throw new Error(`Recipient ${cleanEmail} was NOT accepted by SMTP server. Rejected: ${JSON.stringify(ackEmailInfo.rejected)}`);
      }
    } catch (ackErr: any) {
      console.error('[SMTP Audit Error] Step 3 FAILURE: Acknowledgement email transmission failed:', ackErr);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        error: `SMTP Error: Automated acknowledgement email to sender failed: ${ackErr.message || 'Unknown sending error'}` +
               (ackErr.code ? ` (Code: ${ackErr.code})` : '') +
               (ackErr.response ? ` (Response: ${ackErr.response})` : '') +
               (ackErr.responseCode ? ` (Response Code: ${ackErr.responseCode})` : '') +
               (ackErr.command ? ` (Command: ${ackErr.command})` : '')
      }));
      return;
    }

    console.log('[SMTP Audit] ALL STAGES COMPLETED SUCCESSFULY. Transmitting positive API response.');
    console.log('=================== SMTP AUDIT END ===================');

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ 
      success: true, 
      ticketId, 
      message: 'Your message was sent successfully via Hostinger SMTP. An automated acknowledgement has been delivered to your email.' 
    }));

  } catch (err: any) {
    console.error('[SMTP Server Error]: Global email transmission handler failed:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ 
      error: `Failed to send email. General Handler Exception: ${err.message || 'Unknown Error'}` 
    }));
  }
}

// Vercel Serverless Function Export
export default async function handler(req: any, res: any) {
  return handleContactRequest(req, res);
}
