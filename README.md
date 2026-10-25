# sekwati_code

Marketing site for Sekwaticode (Next.js 14, deployed on Netlify), plus a private admin area at `/admin` for running the business.

## Running locally

```bash
npm install
cp .env.example .env.local   # then fill in the Supabase values
npm run dev
```

## Admin setup (one time)

The admin area uses [Supabase](https://supabase.com) for login and data.

1. **Create a Supabase project** (free tier is fine).
2. **Create the tables:** in the Supabase dashboard, open SQL Editor → New query, paste the contents of [`supabase/migrations/0001_crm.sql`](supabase/migrations/0001_crm.sql) and click Run.
3. **Turn off public sign-ups:** Authentication → Sign In / Providers → disable "Allow new users to sign up". Only people you invite should be able to log in.
4. **Create your login:** Authentication → Users → Add user → enter your email and a password (tick "Auto confirm").
5. **Make yourself staff:** in SQL Editor, run:
   ```sql
   insert into public.staff (user_id, full_name)
   select id, 'Your Name' from auth.users where email = 'you@example.com';
   ```
6. **Add the keys:** copy Project URL and the publishable key from Project Settings → API Keys into `.env.local`, and add the same two variables in Netlify → Site configuration → Environment variables.
7. Visit `/admin` and sign in.

Only users listed in `staff` can see CRM data. This is enforced by the database itself (row level security), so client logins can't see it.

## Client portal setup (one time)

Clients log in at `/portal` to follow their projects, approve milestones, upload files, raise revision/support requests and accept contracts.

1. **Create the tables:** in SQL Editor, paste and run [`supabase/migrations/0002_client_portal.sql`](supabase/migrations/0002_client_portal.sql). It's safe to run again. This also creates the private `project-files` storage bucket.
2. **Add the secret key:** copy the secret key (`sb_secret_...`) from Project Settings → API Keys into `.env.local` and Netlify as `SUPABASE_SECRET_KEY`. It's only used on the server, to create client logins. Never share it or give it a `NEXT_PUBLIC_` prefix.
3. **Give a client access:** open their contact in `/admin`, go to "Client portal access" and click "Create portal login". Copy the message with their temporary password and send it to them (e.g. on WhatsApp). They can change the password under Account.

Supabase's built-in email only sends to your own team, which is why logins are shared by hand for now. Email invites and notifications come in Phase 3.

## Roadmap

**Phase 1 — Business essentials**
- [x] Client and lead CRM
- [ ] Sales pipeline and follow-up reminders
- [ ] Quotation and invoice generation
- [ ] Payment recording and outstanding balances
- [ ] Project templates and task tracking

**Phase 2 — Client experience**
- [x] Secure client login and dashboard
- [x] Project progress and milestone approvals
- [x] Content and document uploads
- [x] Revision and support request tracking
- [x] Contracts and acceptance records

**Phase 3 — Automation**
- [ ] Email notifications and reminders
- [ ] Automatic project creation after payment
- [ ] Recurring service invoices
- [ ] Domain and hosting expiry alerts
- [ ] Dashboard reporting and profitability

**Phase 4 — Scale**
- [ ] Team roles and workload management
- [ ] Developer time tracking
- [ ] Client retention and recurring revenue reports
- [ ] Service-level agreements and support queues
- [ ] AI-assisted lead summaries and admin tasks
