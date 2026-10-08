# adminzz production setup

The application and database migration are in place. Configure these server-side values in the deployment environment before opening the owner workspace:

| Variable | Purpose |
| --- | --- |
| `ADMIN_OWNER_EMAIL` | The one email address allowed to sign in. Create this user in Supabase Auth first. |
| `SUPABASE_URL` | The project Supabase URL. |
| `SUPABASE_PUBLISHABLE_KEY` | Used only by the server to verify the owner password through Supabase Auth. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key used for blog-image uploads. Never prefix it with `VITE_`. |
| `SUPABASE_STORAGE_BUCKET` | Public bucket for optimized blog images, normally `technoedge-media`. |
| `ADMIN_ORIGIN` | Public website origin, for example `https://www.technoedgels.com`. |
| `ADMIN_IP_HASH_SALT` | A long random server secret used to hash login and comment IP addresses. |
| `CRON_SECRET` | A long random server secret. Vercel sends it to the scheduled publication route. |
| `RESEND_API_KEY` | Optional Resend API key for enquiry notifications. |
| `ADMIN_EMAIL_FROM` | Verified sender identity for enquiry notifications. |
| `ADMIN_NOTIFICATION_EMAIL` | Fallback owner email for enquiry notifications. |

## First owner

1. In Supabase Auth, create the single owner with `ADMIN_OWNER_EMAIL` and a strong password.
2. Add every value above through the Vercel project environment settings for Production and Preview as appropriate.
3. Ensure the `technoedge-media` bucket exists and accepts the server-side upload path `blogs/*`.
4. Deploy. Visit `/adminzz/login`; the route is excluded from the public navigation and carries `noindex` and no-store headers.

## Publishing and data migration

Migration `012_adminzz_cms` creates the admin, content, enquiry, comment, import, session, and audit tables. The existing 132 articles can be migrated with:

```powershell
npm run db:migrate
npm run db:migrate:insights -- --commit
```

The migration keeps each article slug, URL, featured image, and published state. Scheduled articles store their chosen time in UTC and show it in IST. Vercel calls `/api/cron/publish` every five minutes through the `CRON_SECRET`, so publishing does not require a GitHub push.
