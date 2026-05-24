/**
 * Generates the HTML email body sent to the admin when a new order is placed.
 *
 * @param {Object} order  - Mongoose order document (populated)
 * @param {Object} user   - The customer who placed the order
 * @returns {Object}      - { subject, html }
 */
const orderPlacedAdminEmail = (order, user) => {
  const subject = `🛒 New Order Received — #${order._id.toString().slice(-8).toUpperCase()}`;

  const itemsRows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;">${item.name}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;text-align:center;">${item.quantity}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;text-align:right;">Rs. ${item.price.toLocaleString()}</td>
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
              <p style="margin:6px 0 0;color:#a0a0c0;font-size:13px;">Admin Order Notification</p>
            </td>
          </tr>

          <!-- Alert Banner -->
          <tr>
            <td style="background:#f0f7ff;padding:16px 32px;border-left:4px solid #2563eb;">
              <p style="margin:0;color:#1d4ed8;font-size:15px;font-weight:600;">
                🛒 A new order has been placed!
              </p>
              <p style="margin:4px 0 0;color:#3b82f6;font-size:13px;">
                Order ID: <strong>#${order._id.toString().slice(-8).toUpperCase()}</strong> &nbsp;|&nbsp;
                ${new Date(order.createdAt).toLocaleString("en-PK", { dateStyle: "medium", timeStyle: "short" })}
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:28px 32px;">

              <!-- Customer Info -->
              <h2 style="margin:0 0 14px;font-size:15px;color:#374151;border-bottom:2px solid #f3f4f6;padding-bottom:8px;">
                👤 Customer Details
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="color:#6b7280;font-size:13px;padding:4px 0;width:140px;">Name</td>
                  <td style="color:#111827;font-size:13px;padding:4px 0;font-weight:600;">${user.fullName}</td>
                </tr>
                <tr>
                  <td style="color:#6b7280;font-size:13px;padding:4px 0;">Email</td>
                  <td style="color:#111827;font-size:13px;padding:4px 0;">${user.email}</td>
                </tr>
                <tr>
                  <td style="color:#6b7280;font-size:13px;padding:4px 0;">Phone</td>
                  <td style="color:#111827;font-size:13px;padding:4px 0;">${user.phone || "Not provided"}</td>
                </tr>
              </table>

              <!-- Shipping Address -->
              <h2 style="margin:0 0 14px;font-size:15px;color:#374151;border-bottom:2px solid #f3f4f6;padding-bottom:8px;">
                📦 Shipping Address
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="color:#6b7280;font-size:13px;padding:4px 0;width:140px;">Full Name</td>
                  <td style="color:#111827;font-size:13px;padding:4px 0;">${order.shippingAddress.fullName}</td>
                </tr>
                <tr>
                  <td style="color:#6b7280;font-size:13px;padding:4px 0;">Phone</td>
                  <td style="color:#111827;font-size:13px;padding:4px 0;">${order.shippingAddress.phone}</td>
                </tr>
                <tr>
                  <td style="color:#6b7280;font-size:13px;padding:4px 0;">Address</td>
                  <td style="color:#111827;font-size:13px;padding:4px 0;">${order.shippingAddress.address}</td>
                </tr>
                <tr>
                  <td style="color:#6b7280;font-size:13px;padding:4px 0;">City</td>
                  <td style="color:#111827;font-size:13px;padding:4px 0;">${order.shippingAddress.city}${order.shippingAddress.area ? ", " + order.shippingAddress.area : ""}</td>
                </tr>
                ${order.shippingAddress.postalCode ? `
                <tr>
                  <td style="color:#6b7280;font-size:13px;padding:4px 0;">Postal Code</td>
                  <td style="color:#111827;font-size:13px;padding:4px 0;">${order.shippingAddress.postalCode}</td>
                </tr>` : ""}
              </table>

              <!-- Order Items -->
              <h2 style="margin:0 0 14px;font-size:15px;color:#374151;border-bottom:2px solid #f3f4f6;padding-bottom:8px;">
                🛍️ Order Items
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;">
                <thead>
                  <tr style="background:#f9fafb;">
                    <th style="padding:10px 12px;text-align:left;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;">Product</th>
                    <th style="padding:10px 12px;text-align:center;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;">Qty</th>
                    <th style="padding:10px 12px;text-align:right;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;">Price</th>
                    <th style="padding:10px 12px;text-align:right;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsRows}
                </tbody>
              </table>

              <!-- Payment & Totals -->
              <h2 style="margin:0 0 14px;font-size:15px;color:#374151;border-bottom:2px solid #f3f4f6;padding-bottom:8px;">
                💳 Payment Summary
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="color:#6b7280;font-size:13px;padding:4px 0;">Payment Method</td>
                  <td style="color:#111827;font-size:13px;padding:4px 0;text-align:right;text-transform:uppercase;font-weight:600;">${order.paymentMethod}</td>
                </tr>
                <tr>
                  <td style="color:#6b7280;font-size:13px;padding:4px 0;">Subtotal</td>
                  <td style="color:#111827;font-size:13px;padding:4px 0;text-align:right;">Rs. ${order.subtotal.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="color:#6b7280;font-size:13px;padding:4px 0;">Delivery Fee</td>
                  <td style="color:#111827;font-size:13px;padding:4px 0;text-align:right;">Rs. ${order.deliveryFee.toLocaleString()}</td>
                </tr>
                ${order.discount > 0 ? `
                <tr>
                  <td style="color:#16a34a;font-size:13px;padding:4px 0;">Discount${order.promoCode ? ` (${order.promoCode})` : ""}</td>
                  <td style="color:#16a34a;font-size:13px;padding:4px 0;text-align:right;">- Rs. ${order.discount.toLocaleString()}</td>
                </tr>` : ""}
                <tr>
                  <td style="color:#111827;font-size:15px;padding:10px 0 4px;font-weight:700;border-top:2px solid #f3f4f6;">Total Amount</td>
                  <td style="color:#2563eb;font-size:15px;padding:10px 0 4px;text-align:right;font-weight:700;border-top:2px solid #f3f4f6;">Rs. ${order.totalAmount.toLocaleString()}</td>
                </tr>
              </table>

              ${order.notes ? `
              <div style="background:#fffbeb;border:1px solid #fcd34d;border-radius:6px;padding:14px;margin-bottom:20px;">
                <p style="margin:0;font-size:13px;color:#92400e;"><strong>📝 Customer Note:</strong> ${order.notes}</p>
              </div>` : ""}

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:20px 32px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0;color:#9ca3af;font-size:12px;">
                Premier Computers &mdash; Admin Panel Notification<br/>
                This email was auto-generated. Do not reply.
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

export default orderPlacedAdminEmail;