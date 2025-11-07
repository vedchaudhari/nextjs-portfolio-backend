// utils/mailer.util.js
const nodemailer = require('nodemailer');

/**
 * Create transporter using SMTP (Gmail example). For production,
 */
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * Verify transporter on startup so you get early feedback if creds are wrong.
 */
transporter.verify()
    .then(() => console.log('📨 Mailer ready'))
    .catch((err) => {
        console.warn('⚠️ Mailer verification failed:', err?.message || err);
    });

/**
 * sendContactEmail
 * @param {Object} payload
 * @param {string} payload.name
 * @param {string} [payload.email]
 * @param {string} [payload.mobile]
 * @param {string} payload.message
 * @param {string} [payload.ip]
 * @param {string} [payload.userAgent]
 */
async function sendContactEmail({ name, email, mobile, message, ip, userAgent }) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error('Email credentials are not set in environment variables');
    }

    const to = process.env.TO_EMAIL || process.env.EMAIL_USER;
    const subject = `📩 New contact form message from ${name || 'Unknown'}`;

    const textBody = [
        `Name: ${name || '—'}`,
        `Email: ${email || '—'}`,
        `Mobile: ${mobile || '—'}`,
        `IP: ${ip || '—'}`,
        `User Agent: ${userAgent || '—'}`,
        '',
        'Message:',
        message || '—'
    ].join('\n');

    const htmlBody = `
    <div style="font-family: Arial, sans-serif; line-height:1.4;">
      <h2>New contact message</h2>
      <p><strong>Name:</strong> ${escapeHtml(name || '—')}</p>
      <p><strong>Email:</strong> ${escapeHtml(email || '—')}</p>
      <p><strong>Mobile:</strong> ${escapeHtml(mobile || '—')}</p>
      <p><strong>IP:</strong> ${escapeHtml(ip || '—')}</p>
      <p><strong>User Agent:</strong> ${escapeHtml(userAgent || '—')}</p>
      <hr/>
      <h3>Message</h3>
      <p>${nl2br(escapeHtml(message || '—'))}</p>
    </div>
  `;

    const mailOptions = {
        from: `"Website Contact" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text: textBody,
        html: htmlBody,
    };

    // sendMail returns an info object or throws an error
    return transporter.sendMail(mailOptions);
}

/**
 * Basic HTML escaping to avoid accidental injection in email content.
 */
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/**
 * convert newline to <br/>
 */
function nl2br(str) {
    return String(str).replace(/\r\n|\n\r|\r|\n/g, '<br/>');
}

module.exports = { sendContactEmail };
