/**
 * Generates the HTML email body sent to the customer when admin updates order status.
 *
 * @param {Object} order  - Updated order document (populated with user)
 * @param {Object} user   - The customer
 * @returns {Object}      - { subject, html }
 */

const STATUS_META = {
  pending: {
    emoji: "⏳",
    label: "Pending",
    color: "#92400e",
    bg: "#fef3c7",
    border: "#f59e0b",
    message: "Your order has been received and is waiting to be confirmed."
  },
  confirmed: {
    emoji: "✅",
    label: "Confirmed",
    color: "#065f46",
    bg: "#d1fae5",
    border: "#10b981",
    message: "Great news! Your order has been confirmed and will be prepared soon."
  },
  processing: {
    emoji: "⚙️",
    label: "Processing",
    color: "#1e40af",
    bg: "#dbeafe",
    border: "#3b82f6",
    message: "Your order is currently being processed and packed for shipment."
  },
  shipped: {
    emoji: "🚚",
    label: "Shipped",
    color: "#5b21b6",
    bg: "#ede9fe",
    border: "#8b5cf6",
    message: "Your order is on its way! Expect delivery within 2–5 business days."
  },
  delivered: {
    emoji: "🎉",
    label: "Delivered",
    color: "#065f46",
    bg: "#d1fae5",
    border: "#10b981",
    message: "Your order has been delivered successfully. Enjoy your purchase!"
  },
  cancelled: {
    emoji: "❌",
    label: "Cancelled",
    color: "#991b1b",
    bg: "#fee2e2",
    border: "#ef4444",
    message: "Your order has been cancelled. If you have questions, please contact us."
  }
};

const orderStatusUpdateEmail = (order, user) => {
  const meta = STATUS_META[order.orderStatus] || {
    emoji: "📋",
    label: order.orderStatus,
    color: "#374151",
    bg: "#f3f4f6",
    border: "#9ca3af",
    message: `Your order status has been updated to ${order.orderStatus}.`
  };

  const subject = `${meta.emoji} Order Update: ${meta.label} — #${order._id.toString().slice(-8).toUpperCase()} | Premier Computers`;

  const itemsRows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;">${item.name}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;text-align:center;">${item.quantity}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;text-align:right;">Rs. ${item.subtotal.toLocaleString()}</td>
      </tr>`
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:30px 0;">
    <tr>
      <td align="center">
        <table width="620" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#1a1a2e;padding:28px 32px;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">Premier Computers</h1>
              <p style="margin:6px 0 0;color:#a0a0c0;font-size:13px;">Order Status Update</p>
            </td>
          </tr>

          <!-- Status Banner -->
          <tr>
            <td style="background:${meta.bg};padding:20px 32px;border-left:4px solid ${meta.border};">
              <p style="margin:0;color:${meta.color};font-size:17px;font-weight:700;">
                ${meta.emoji} ${meta.label}
              </p>
              <p style="margin:6px 0 0;color:${meta.color};font-size:13px;opacity:0.85;">
                ${meta.message}
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:28px 32px;">

              <p style="margin:0 0 24px;color:#374151;font-size:14px;">
                Hi <strong>${user.fullName.split(" ")[0]}</strong>, here is the latest update on your order.
              </p>

              <!-- Order Info -->
              <div style="background:#f9fafb;border-radius:6px;padding:16px;margin-bottom:24px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="color:#6b7280;font-size:13px;">Order ID</td>
                    <td style="color:#111827;font-size:13px;font-weight:700;text-align:right;">#${order._id.toString().slice(-8).toUpperCase()}</td>
                  </tr>
                  <tr>
                    <td style="color:#6b7280;font-size:13px;padding-top:6px;">Current Status</td>
                    <td style="text-align:right;padding-top:6px;">
                      <span style="background:${meta.bg};color:${meta.color};font-size:12px;font-weight:700;padding:3px 12px;border-radius:20px;text-transform:uppercase;">
                        ${meta.label}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td style="color:#6b7280;font-size:13px;padding-top:6px;">Updated At</td>
                    <td style="color:#111827;font-size:13px;text-align:right;padding-top:6px;">${new Date().toLocaleString("en-PK", { dateStyle: "medium", timeStyle: "short" })}</td>
                  </tr>
                </table>
              </div>

              <!-- Order Items -->
              <h2 style="margin:0 0 14px;font-size:15px;color:#374151;border-bottom:2px solid #f3f4f6;padding-bottom:8px;">
                🛍️ Your Items
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;">
                <thead>
                  <tr style="background:#f9fafb;">
                    <th style="padding:10px 12px;text-align:left;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;">Product</th>
                    <th style="padding:10px 12px;text-align:center;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;">Qty</th>
                    <th style="padding:10px 12px;text-align:right;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsRows}
                </tbody>
              </table>

              <!-- Total -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="color:#111827;font-size:15px;padding:8px 0;font-weight:700;border-top:2px solid #f3f4f6;">Order Total</td>
                  <td style="color:#2563eb;font-size:15px;padding:8px 0;text-align:right;font-weight:700;border-top:2px solid #f3f4f6;">Rs. ${order.totalAmount.toLocaleString()}</td>
                </tr>
              </table>

              <!-- Delivered special message -->
              ${order.orderStatus === "delivered" ? `
              <div style="background:#f0fdf4;border-radius:6px;padding:16px;margin-bottom:16px;text-align:center;">
                <p style="margin:0;color:#15803d;font-size:15px;font-weight:700;">🎉 Thank you for shopping with Premier Computers!</p>
                <p style="margin:8px 0 0;color:#16a34a;font-size:13px;">We hope you love your purchase. Come back for more great deals!</p>
              </div>` : ""}

              <!-- Cancelled message -->
              ${order.orderStatus === "cancelled" ? `
              <div style="background:#fff7ed;border-radius:6px;padding:16px;margin-bottom:16px;">
                <p style="margin:0;color:#c2410c;font-size:13px;">
                  If you did not request this cancellation or have any concerns, please contact us immediately at
                  <a href="mailto:premiercomputers0007@gmail.com" style="color:#2563eb;">premiercomputers0007@gmail.com</a>
                </p>
              </div>` : ""}

            </td>
          </tr>

          <!-- Contact -->
          <tr>
            <td style="padding:0 32px 28px;">
              <p style="margin:0;color:#6b7280;font-size:13px;text-align:center;">
                Questions? Reach us at
                <a href="mailto:premiercomputers0007@gmail.com" style="color:#2563eb;text-decoration:none;">premiercomputers0007@gmail.com</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:20px 32px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0;color:#9ca3af;font-size:12px;">
                © 2025 Premier Computers. All rights reserved.<br/>
                This is an automated email — please do not reply directly.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;

  return { subject, html };
};

export default orderStatusUpdateEmail;