import nodemailer from "nodemailer";

// Create transporter once — reused for all emails
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD  // Gmail App Password (not your real password)
  }
});

/**
 * Send an email using Nodemailer + Gmail SMTP.
 * NEVER throws — email failure must never crash the order system.
 *
 * @param {Object} options
 * @param {string}   options.to      - Recipient email address
 * @param {string}   options.subject - Email subject line
 * @param {string}   options.html    - HTML body
 * @returns {Promise<boolean>}       - true if sent, false if failed
 */
const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"Premier Computers" <${process.env.SMTP_EMAIL}>`,
      to,
      subject,
      html
    });

    console.log(`[sendEmail] Email sent successfully to: ${to}`);
    return true;
  } catch (err) {
    // ✅ CRITICAL: catch all errors — email failure must never crash the server
    console.error("[sendEmail] Failed to send email:", err.message);
    return false;
  }
};

export default sendEmail;