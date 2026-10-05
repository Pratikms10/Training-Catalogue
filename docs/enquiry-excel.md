# Local Excel enquiry capture

The Catalogue proposal form, Home contact form, and E-Learning enquiry form save a submission through `POST /api/enquiries` before showing success or opening a WhatsApp/email draft. The response contains a reference generated from the saved submission; retrying the same submission does not add another row.

Run the site with `npm run dev`. The first successful submission creates `data/private/website-enquiries.xlsx` with these sheets:

- `Enquiries` for Catalogue and organisation contacts
- `Trainer applications` for the Home trainer form
- `Contact actions` for anonymous clicks on phone, email, and WhatsApp links. This is a link-open attempt, **not** a confirmed call, message, application, or sales lead.

The file is excluded from Git. Keep it in a private, backed-up location and do not put it in `public`, `dist`, or a shared repository. Set `LEADS_WORKBOOK_PATH` to an absolute path if a different local location is needed. A browser visitor cannot download the workbook through the website.

Excel may lock the file while it is open. Close the workbook before accepting more submissions; if a write fails, the website shows an error instead of a success message. The previous workbook is preserved by writing a temporary file and replacing it only after the new workbook is complete.

This is a **local-first workbook**, not a Vercel production data store. By default, a local submission also commits to PostgreSQL and creates a pending CRM outbox row before being mirrored to this workbook. Vercel uses the durable PostgreSQL path after migration 007 is applied to its configured database. New PostgreSQL enquiries are queued for a future CRM connector; they are not yet delivered to the CRM. See `enquiry-crm-infrastructure.md`.

The Careers email links log an anonymous email-link click in `Contact actions`; the website does not receive the applicant's CV or know whether the email was sent. Insights comments remain browser-local and are not sales enquiries. Phone and standalone email/WhatsApp clicks are never represented as completed enquiries.
