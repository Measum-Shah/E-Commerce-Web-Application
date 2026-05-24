import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send an email using Resend.
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
    const { error } = await resend.emails.send({
      from: "Premier Computers <orders@premiercomputers.store>",
      to,
      subject,
      html
    });

    if (error) {
      console.error("[sendEmail] Resend API error:", error);
      return false;
    }

    console.log(`[sendEmail] Email sent successfully to: ${to}`);
    return true;
  } catch (err) {
    // ✅ CRITICAL: catch all errors — email failure must never crash the server
    console.error("[sendEmail] Unexpected error:", err.message);
    return false;
  }
};

export default sendEmail;