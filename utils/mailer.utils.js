// // utils/mailer.util.js
// const { Resend } = require('resend');
// const resend = new Resend(process.env.RESEND_API_KEY);

// async function sendContactEmail({ name, email, mobile, message }) {
//     const toEmail = process.env.TO_EMAIL;
//     const fromEmail = process.env.FROM_EMAIL;

//     try {
//         const html = `
//       <div style="font-family: Arial, sans-serif; line-height:1.5;">
//         <h2>New Contact Message from Portfolio</h2>
//         <p><strong>Name:</strong> ${name || '—'}</p>
//         <p><strong>Email:</strong> ${email || '—'}</p>
//         <p><strong>Mobile:</strong> ${mobile || '—'}</p>
//         <hr/>
//         <h3>Message:</h3>
//         <p>${message || '—'}</p>
//       </div>
//     `;

//         const response = await resend.emails.send({
//             from: `Portfolio Contact <${fromEmail}>`, // must be a verified sender in Resend
//             to: toEmail,
//             subject: `📩 New message from ${name || 'Unknown User'}`,
//             html,
//         });

//         console.log('✅ Email sent successfully:', response);
//         return response;
//     } catch (err) {
//         console.error('❌ Error sending email via Resend:', err.message);
//         throw new Error('Failed to send contact email');
//     }
// }

// module.exports = { sendContactEmail };







// utils/mailer.util.js
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

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
          body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f7f9fb;
            color: #333;
          }

          .container {
            max-width: 600px;
            margin: 24px auto;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            overflow: hidden;
          }

          .header {
            background: #0078d7;
            color: #ffffff;
            text-align: center;
            padding: 24px 16px;
          }

          .header h2 {
            margin: 0;
            font-size: 22px;
          }

          .content {
            padding: 24px;
          }

          .content p {
            font-size: 15px;
            margin: 8px 0;
          }

          .label {
            font-weight: 600;
            color: #0078d7;
          }

          .message-box {
            background-color: #f3f6fa;
            border-left: 4px solid #0078d7;
            padding: 16px;
            border-radius: 8px;
            margin-top: 20px;
            font-size: 15px;
            line-height: 1.5;
          }

          footer {
            background-color: #fafafa;
            border-top: 1px solid #eee;
            text-align: center;
            padding: 16px;
            font-size: 13px;
            color: #777;
          }

          footer a {
            color: #0078d7;
            text-decoration: none;
          }

          @media screen and (max-width: 600px) {
            .container {
              margin: 12px;
            }
            .header h2 {
              font-size: 20px;
            }
            .content {
              padding: 16px;
            }
            .message-box {
              font-size: 14px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New Contact Message</h2>
            <p>via Portfolio Website</p>
          </div>

          <div class="content">
            <p><span class="label">👤 Name:</span> ${name || '—'}</p>
            <p><span class="label">📧 Email:</span> ${email || '—'}</p>
            <p><span class="label">📱 Mobile:</span> ${mobile || '—'}</p>

            <div class="message-box">
              <p><strong>Message:</strong></p>
              <p>${message || '—'}</p>
            </div>
          </div>

          <footer>
            <p>Sent automatically from your <a href="https://resend.com">contact form</a>.</p>
          </footer>
        </div>
      </body>
      </html>
    `;

    const response = await resend.emails.send({
      from: `Portfolio Contact <${fromEmail}>`,
      to: toEmail,
      subject: `📩 New message from ${name || 'Unknown User'}`,
      html,
    });

    console.log('✅ Email sent successfully:', response);
    return response;
  } catch (err) {
    console.error('❌ Error sending email via Resend:', err.message);
    throw new Error('Failed to send contact email');
  }
}

module.exports = { sendContactEmail };
