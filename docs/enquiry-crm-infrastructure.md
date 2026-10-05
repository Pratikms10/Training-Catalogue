# Enquiry storage and CRM handoff

All website enquiry forms use `POST /api/enquiries`. The server validates each submission and returns a reference only after it has been stored.

## Storage modes

- Local development defaults to **hybrid** storage: the enquiry and CRM outbox commit to PostgreSQL, then the same reference is added to the private Excel workbook documented in `enquiry-excel.md`. A success response is returned only after both writes complete. If the Excel write fails, retrying the same submission ID completes the mirror without duplicating the database lead.
- Vercel defaults to PostgreSQL using the existing server-only `DATABASE_URL`. Set `LEADS_STORAGE_MODE=postgres` to exercise the same path locally.
- Set `LEADS_STORAGE_MODE=excel` only when intentionally working offline; that mode does not queue leads for CRM.
- Apply migration `007_enquiries_crm_outbox.sql` to **each** database used by a deployment before accepting submissions. The migration has been applied to the database configured in this workspace; a different Vercel database must be migrated separately.
- Apply migration `008_contact_actions.sql` to each deployment database before expecting anonymous contact-link telemetry. It was applied to the database configured in this workspace. These events are separate from leads and are never queued to the CRM.

In PostgreSQL, `leads.enquiries` is the durable lead record. `leads.crm_outbox` receives a `pending` row in the **same transaction**. Retrying a submission with the same UUID returns its existing reference and does not create a second lead or outbox row. No public endpoint exposes lead records.

Run `npm run leads:status` to see aggregate counts without printing names, emails, or messages. Existing rows in the local Excel workbook are **not automatically imported** into PostgreSQL or queued for CRM; plan a reviewed backfill before historical leads are expected in the CRM.

## CRM connector boundary

No lead is currently sent to the internal CRM. The outbox stays `pending` until a connector is configured. `server/crmOutbox.mjs` provides leased batch claiming and guarded delivered/retry/blocked updates; it performs no network request. A future worker should:

1. Claim a batch with `claimCrmBatch`.
2. Map the saved enquiry to the CRM's required fields and send it using a server-only credential.
3. Use `submission_id` as the CRM idempotency/external key, because a retry may follow a successful send whose acknowledgement was lost.
4. Mark acknowledged records delivered; schedule transient failures for retry; block permanent validation failures for review.

The CRM API/webhook contract, authentication method, mapping, worker schedule, and monitoring policy remain to be supplied. Do not mark a record `delivered` merely because it was queued. Keep CRM credentials in environment secrets, never in frontend code or Git.

## Operational cautions

- Existing Excel rows from before hybrid mode are not automatically queued. New hybrid-mode submissions are queued.
- Vercel's local filesystem is not used for leads. The Vercel project must have a working `DATABASE_URL` and the leads migration.
- On Vercel, leads and contact actions live in PostgreSQL; an always-current `.xlsx` file is **not** created on Vercel. A reviewed export or external sheet/storage integration is still needed before the production data can be called an Excel workbook.
- The CRM outbox is at-least-once delivery infrastructure, not a completed integration. Keep failed/blocked queue counts under review once delivery starts.
