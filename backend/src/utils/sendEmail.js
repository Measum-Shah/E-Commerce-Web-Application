import nodemailer from "nodemailer";

/**
 * Send an email using Brevo SMTP.
 * NEVER throws — email failure must never crash the order system.
 */
const sendEmail = async ({ to, subject, html }) => {
  try {
    // Transporter created inside function so env vars are always loaded
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: `"Premier Computers" <${process.env.BREVO_SMTP_USER}>`,
      to,
      subject,
      html
    });

    console.log(`[sendEmail] Email sent successfully to: ${to}`);
    return true;
  } catch (err) {
    console.error("[sendEmail] Failed to send email:", err.message);
    return false;
  }
};

export default sendEmail;