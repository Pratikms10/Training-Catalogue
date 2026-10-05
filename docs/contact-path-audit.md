# Contact-path audit

Reviewed page by page on 5 October 2026. A form submission is a lead only when the API confirms storage and returns a reference. Opening a `tel:`, `mailto:`, or WhatsApp link records a separate anonymous contact action; it does not prove that a conversation occurred.

| Page | Contact paths | Where data goes |
| --- | --- | --- |
| Home | Organisation and trainer forms; direct phone and WhatsApp links in contact section, footer, and floating contact choices | Submitted forms: `Enquiries` or `Trainer applications` and PostgreSQL lead/outbox. Direct links: `Contact actions` and PostgreSQL contact actions. |
| E-Learning | Enquiry modal; direct email in contact section/footer and shared footer phone/WhatsApp | Submitted form: `Enquiries` and PostgreSQL lead/outbox. Its selected e-learning level is in the requirements text. Direct links: contact actions only. |
| Catalogue and programme details | Proposal, training-plan, discuss, outline, header/footer enterprise enquiry forms; direct phone, email, WhatsApp | Submitted forms: `Enquiries` and PostgreSQL lead/outbox, with a source CTA ID. Direct links: contact actions only. |
| Insights and articles | Shared footer direct contact links and its enquiry route to the Home form; article comments | Direct links: contact actions. Home enquiry: stored after submission. Article comments remain in browser local storage only; they are not shared or captured as leads. |
| Careers and role pages | HR email dialog and shared footer links | Email-link clicks: contact actions only. CV/email contents are handled by the applicant's email app and are **not** stored by this website. |

Local development mirrors new leads and contact actions to `data/private/website-enquiries.xlsx`. Production on Vercel stores both in PostgreSQL, because its function filesystem is not durable. No CRM connection is active yet; only genuine submitted enquiries enter the pending CRM outbox.
