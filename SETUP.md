# ClientLedger setup

Step-by-step instructions for Supabase, local dev, and Vercel deploy.

## 1. Create a new Supabase project

**Use a dedicated project** — do not reuse FlowShift's database.

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) → **New project**
2. Name it e.g. `clientledger` (region near your users)
3. Copy from **Settings → API**:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (server only)

## 2. Run migrations

In **SQL Editor**, run each file in order:

| File | Purpose |
|------|---------|
| `supabase/migrations/001_initial_schema.sql` | Tables + RLS + signup trigger |
| `supabase/migrations/002_voice_storage.sql` | Voice memo storage bucket |

Or link Supabase CLI / MCP to this project and apply migrations from the repo.

## 3. Configure auth redirect

**Authentication → URL configuration:**

- Site URL: `http://localhost:3000` (local) or your production URL
- Redirect URLs: `{APP_URL}/api/auth/callback`

## 4. Local env

```bash
cp .env.example .env.local
# Edit .env.local with your Supabase keys
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) → sign up → add a client → log an activity.

## 5. Deploy to Vercel

1. Push repo to GitHub
2. Import project in Vercel (Next.js auto-detected)
3. Add the same env vars in **Vercel → Settings → Environment Variables**
4. Set `NEXT_PUBLIC_APP_URL` to your production URL (e.g. `https://clientledger.vercel.app`)
5. Update Supabase auth redirect URLs to match production

## 6. Cursor MCP (optional)

Point the Supabase MCP at your **ClientLedger** project (not FlowShift) in `~/.cursor/mcp.json` so agents can run migrations and SQL against the right database.

## Smoke test

1. Sign up with a test account
2. Add client "Acme Corp"
3. Log activity: lunch, $120 expense, $50k closed deal
4. Open **Reports** → verify Q expense, revenue, and ROI
