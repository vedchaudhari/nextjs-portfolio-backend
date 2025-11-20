const { Resend } = require('resend');
const logger = require('./logger.utils');

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send contact form email using Resend
 * @param {Object} params - Email parameters
 * @param {string} params.name - Sender's name
 * @param {string} params.email - Sender's email
 * @param {string} params.mobile - Sender's mobile (optional)
 * @param {string} params.message - Message content
 * @returns {Promise} Resend API response
 */
async function sendContactEmail({ name, email, mobile, message }) {
  const toEmail = process.env.TO_EMAIL;
  const fromEmail = process.env.FROM_EMAIL;

  try {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>New Contact Message</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
          }

          .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          }

          .header {
            background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
            color: #ffffff;
            padding: 40px 30px;
            text-align: center;
          }

          .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
          }

          .header p {
            font-size: 14px;
            opacity: 0.9;
          }

          .content {
            padding: 40px 30px;
          }

          .info-row {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            padding: 16px;
            background: #f8fafc;
            border-radius: 12px;
            border-left: 4px solid #06b6d4;
          }

          .info-row .icon {
            font-size: 24px;
            margin-right: 12px;
          }

          .info-row .label {
            font-size: 12px;
            color: #64748b;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
          }

          .info-row .value {
            font-size: 16px;
            color: #1e293b;
            font-weight: 500;
          }

          .message-box {
            background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
            border-radius: 12px;
            padding: 24px;
            margin-top: 30px;
            border-left: 4px solid #3b82f6;
          }

          .message-box h3 {
            font-size: 14px;
            color: #64748b;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 12px;
          }

          .message-box p {
            font-size: 15px;
            color: #1e293b;
            line-height: 1.7;
            white-space: pre-wrap;
            word-wrap: break-word;
          }

          .footer {
            background: #f8fafc;
            padding: 24px 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
          }

          .footer p {
            font-size: 13px;
            color: #64748b;
            margin-bottom: 8px;
          }

          .footer a {
            color: #06b6d4;
            text-decoration: none;
            font-weight: 500;
          }

          .footer a:hover {
            text-decoration: underline;
          }

          .timestamp {
            font-size: 12px;
            color: #94a3b8;
            margin-top: 8px;
          }

          @media screen and (max-width: 600px) {
            body {
              padding: 10px;
            }

            .header {
              padding: 30px 20px;
            }

            .header h1 {
              font-size: 24px;
            }

            .content {
              padding: 30px 20px;
            }

            .info-row {
              padding: 12px;
            }

            .message-box {
              padding: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📬 New Contact Message</h1>
            <p>You've received a new message from your portfolio website</p>
          </div>

          <div class="content">
            <div class="info-row">
              <div class="icon">👤</div>
              <div>
                <div class="label">Name</div>
                <div class="value">${name || 'Not provided'}</div>
              </div>
            </div>

            <div class="info-row">
              <div class="icon">📧</div>
              <div>
                <div class="label">Email</div>
                <div class="value">${email || 'Not provided'}</div>
              </div>
            </div>

            <div class="info-row">
              <div class="icon">📱</div>
              <div>
                <div class="label">Mobile</div>
                <div class="value">${mobile || 'Not provided'}</div>
              </div>
            </div>

            <div class="message-box">
              <h3>💬 Message</h3>
              <p>${message || 'No message content'}</p>
            </div>
          </div>

          <div class="footer">
            <p>This email was sent automatically from your <a href="${process.env.FRONTEND_URL || '#'}">portfolio contact form</a></p>
            <p class="timestamp">Received at: ${new Date().toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'long'
    })}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const response = await resend.emails.send({
      from: `Portfolio Contact <${fromEmail}>`,
      to: toEmail,
      subject: `📩 New message from ${name || 'Unknown User'}`,
      html,
      replyTo: email || undefined
    });

    logger.success('Email sent successfully', { id: response.id });
    return response;
  } catch (err) {
    logger.error('Failed to send email via Resend', err);
    throw new Error('Failed to send contact email');
  }
}

module.exports = { sendContactEmail };
