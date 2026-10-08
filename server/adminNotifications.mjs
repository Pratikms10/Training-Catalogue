function htmlEscape(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

async function recordDelivery(pool, values) {
  await pool.query(`
    INSERT INTO admin.email_deliveries (
      message_type, recipient, entity_id, status, provider_id, error_message
    ) VALUES ($1, $2, $3, $4, $5, $6)
  `, [values.type, values.recipient, values.entityId || '', values.status, values.providerId || null, values.error || null]);
}

export async function sendEnquiryNotification(pool, enquiry, reference) {
  if (!pool || typeof pool.query !== 'function') return { status: 'disabled' };
  let recipient = process.env.ADMIN_NOTIFICATION_EMAIL?.trim();
  if (!recipient) {
    const result = await pool.query(`
      SELECT recipient_email FROM admin.notification_preferences
      WHERE enquiry_email_enabled = true ORDER BY updated_at DESC LIMIT 1
    `).catch(() => ({ rows: [] }));
    recipient = result.rows[0]?.recipient_email;
  }
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.ADMIN_EMAIL_FROM?.trim();
  if (!recipient || !apiKey || !from) {
    await recordDelivery(pool, { type: 'new_enquiry', recipient: recipient || '', entityId: enquiry.submissionId, status: 'disabled' }).catch(() => {});
    return { status: 'disabled' };
  }
  const adminOrigin = String(process.env.ADMIN_ORIGIN || process.env.APP_URL || '').replace(/\/$/, '');
  const subject = `New TechnoEdge enquiry ${reference}`;
  const html = `
    <div style="font-family:Arial,sans-serif;color:#111827;line-height:1.6">
      <h1 style="color:#01266A">New website enquiry</h1>
      <p><strong>Reference:</strong> ${htmlEscape(reference)}</p>
      <p><strong>Name:</strong> ${htmlEscape(enquiry.name)}<br>
      <strong>Email:</strong> ${htmlEscape(enquiry.email)}<br>
      <strong>Organisation:</strong> ${htmlEscape(enquiry.company)}<br>
      <strong>Type:</strong> ${htmlEscape(enquiry.kind)}<br>
      <strong>Interest:</strong> ${htmlEscape(enquiry.courseTitle || enquiry.service || enquiry.trainerExpertise)}<br>
      <strong>Source:</strong> ${htmlEscape(enquiry.sourcePage)}</p>
      <p>${htmlEscape(enquiry.notes)}</p>
      ${adminOrigin ? `<p><a href="${htmlEscape(`${adminOrigin}/adminzz/enquiries/${enquiry.submissionId}`)}" style="background:#01266A;color:white;padding:12px 18px;text-decoration:none;border-radius:7px">Open enquiry</a></p>` : ''}
    </div>`;
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [recipient], subject, html }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.message || 'Email provider rejected the notification.');
    await recordDelivery(pool, { type: 'new_enquiry', recipient, entityId: enquiry.submissionId, status: 'sent', providerId: result.id });
    return { status: 'sent', id: result.id };
  } catch (error) {
    await recordDelivery(pool, { type: 'new_enquiry', recipient, entityId: enquiry.submissionId, status: 'failed', error: error.message }).catch(() => {});
    return { status: 'failed' };
  }
}
