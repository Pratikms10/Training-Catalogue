/** Public contact destinations shared by every TechnoEdge site section. */
export const CONTACT_EMAIL = 'training@technoedgels.com';
export const CAREERS_EMAIL = 'hr@technoedgels.com';

export const CONTACT_PHONES = [
  { number: '9356433629', display: '+91 93564 33629', e164: '+919356433629' },
  { number: '7400068614', display: '+91 74000 68614', e164: '+917400068614' },
] as const;

export const whatsappUrl = (phone: (typeof CONTACT_PHONES)[number], message?: string) =>
  `https://wa.me/${phone.e164.slice(1)}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
