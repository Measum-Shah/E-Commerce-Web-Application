/**
 * Generates the HTML email body sent to the customer when their order is placed.
 *
 * @param {Object} order  - Mongoose order document
 * @param {Object} user   - The customer
 * @returns {Object}      - { subject, html }
 */
const orderPlacedCustomerEmail = (order, user) => {
  const subject = `✅ Order Confirmed — #${order._id.toString().slice(-8).toUpperCase()} | Premier Computers`;

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
              <p style="margin:6px 0 0;color:#a0a0c0;font-size:13px;">Order Confirmation</p>
            </td>
          </tr>

          <!-- Success Banner -->
          <tr>
            <td style="background:#f0fdf4;padding:20px 32px;border-left:4px solid #16a34a;">
              <p style="margin:0;color:#15803d;font-size:16px;font-weight:700;">
                🎉 Thank you, ${user.fullName.split(" ")[0]}! Your order has been placed.
              </p>
              <p style="margin:6px 0 0;color:#16a34a;font-size:13px;">
                We have received your order and will process it shortly.
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:28px 32px;">

              <!-- Order Info -->
              <div style="background:#f9fafb;border-radius:6px;padding:16px;margin-bottom:24px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="color:#6b7280;font-size:13px;">Order ID</td>
                    <td style="color:#111827;font-size:13px;font-weight:700;text-align:right;">#${order._id.toString().slice(-8).toUpperCase()}</td>
                  </tr>
                  <tr>
                    <td style="color:#6b7280;font-size:13px;padding-top:6px;">Order Date</td>
                    <td style="color:#111827;font-size:13px;text-align:right;padding-top:6px;">${new Date(order.createdAt).toLocaleString("en-PK", { dateStyle: "medium", timeStyle: "short" })}</td>
                  </tr>
                  <tr>
                    <td style="color:#6b7280;font-size:13px;padding-top:6px;">Payment Method</td>
                    <td style="color:#111827;font-size:13px;text-align:right;padding-top:6px;text-transform:uppercase;font-weight:600;">${order.paymentMethod}</td>
                  </tr>
                  <tr>
                    <td style="color:#6b7280;font-size:13px;padding-top:6px;">Status</td>
                    <td style="text-align:right;padding-top:6px;">
                      <span style="background:#fef3c7;color:#92400e;font-size:12px;font-weight:600;padding:3px 10px;border-radius:20px;text-transform:uppercase;">
                        ${order.orderStatus}
                      </span>
                    </td>
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

              <!-- Price Summary -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
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
                  <td style="color:#111827;font-size:15px;padding:10px 0 4px;font-weight:700;border-top:2px solid #f3f4f6;">Total Paid</td>
                  <td style="color:#2563eb;font-size:15px;padding:10px 0 4px;text-align:right;font-weight:700;border-top:2px solid #f3f4f6;">Rs. ${order.totalAmount.toLocaleString()}</td>
                </tr>
              </table>

              <!-- Shipping Address -->
              <h2 style="margin:0 0 14px;font-size:15px;color:#374151;border-bottom:2px solid #f3f4f6;padding-bottom:8px;">
                📦 Delivering To
              </h2>
              <div style="background:#f9fafb;border-radius:6px;padding:14px;margin-bottom:24px;">
                <p style="margin:0;color:#111827;font-size:13px;line-height:1.7;">
                  <strong>${order.shippingAddress.fullName}</strong><br/>
                  ${order.shippingAddress.address}<br/>
                  ${order.shippingAddress.city}${order.shippingAddress.area ? ", " + order.shippingAddress.area : ""}${order.shippingAddress.postalCode ? " " + order.shippingAddress.postalCode : ""}<br/>
                  📞 ${order.shippingAddress.phone}
                </p>
              </div>

              <!-- What's Next -->
              <div style="background:#eff6ff;border-radius:6px;padding:16px;margin-bottom:8px;">
                <p style="margin:0 0 8px;color:#1d4ed8;font-size:14px;font-weight:700;">What happens next?</p>
                <p style="margin:0;color:#3b82f6;font-size:13px;line-height:1.7;">
                  1. We will confirm your order shortly.<br/>
                  2. Your item will be packed and dispatched.<br/>
                  3. You will receive another email when your order ships.<br/>
                  4. Delivery usually takes 2–5 business days.
                </p>
              </div>

            </td>
          </tr>

          <!-- Contact -->
          <tr>
            <td style="padding:0 32px 28px;">
              <p style="margin:0;color:#6b7280;font-size:13px;text-align:center;">
                Questions? Contact us at
                <a href="mailto:premiercomputers007@gmail.com" style="color:#2563eb;text-decoration:none;">premiercomputers007@gmail.com</a>
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

export default orderPlacedCustomerEmail;