import { EnquiryInputError } from './enquiries.mjs';

const channels = new Set(['call', 'email', 'whatsapp']);

export function validateContactAction(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new EnquiryInputError('Invalid contact action.');
  }
  const eventId = String(body.eventId || '');
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(eventId)) {
    throw new EnquiryInputError('Invalid contact action ID.');
  }
  const channel = String(body.channel || '');
  if (!channels.has(channel)) throw new EnquiryInputError('Invalid contact channel.');
  const sourcePage = String(body.sourcePage || '').trim();
  if (!sourcePage.startsWith('/') || sourcePage.startsWith('//') || sourcePage.length > 300) {
    throw new EnquiryInputError('Invalid source page.');
  }
  const destination = String(body.destination || '').trim().toLowerCase();
  const validDestination = channel === 'call'
    ? /^\+?[0-9]{10,15}$/.test(destination)
    : channel === 'email'
      ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(destination) && destination.length <= 254
      : /^[0-9]{10,15}$/.test(destination);
  if (!validDestination) throw new EnquiryInputError('Invalid contact destination.');
  const ctaLabel = String(body.ctaLabel || '').trim();
  if (ctaLabel.length > 160) throw new EnquiryInputError('CTA label is too long.');
  return { eventId: eventId.toLowerCase(), channel, destination, sourcePage, ctaLabel };
}

export async function saveContactActionToDatabase(pool, action) {
  const result = await pool.query(`
    INSERT INTO leads.contact_actions (event_id, channel, destination, source_page, cta_label)
    VALUES ($1::uuid, $2, $3, $4, $5)
    ON CONFLICT (event_id) DO NOTHING
  `, [action.eventId, action.channel, action.destination, action.sourcePage, action.ctaLabel]);
  return { duplicate: result.rowCount === 0 };
}
