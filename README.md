# ClientLedger

Track client time, entertainment expenses, and closed revenue — by quarter and by year.

Log lunches, dinners, golf outings, and meetings manually, via voice memo, or (soon) from your calendar. See ROI per client at a glance.

## Features (MVP)

- Supabase auth (signup / login)
- Client management
- Activity logging with optional expense and deal fields
- Voice memo upload to Supabase Storage
- Quarterly and yearly reports with ROI

## Phase 2

- Google Calendar sync
- Voice transcription
- Deal pipeline editing

## Quick start

See **[SETUP.md](./SETUP.md)** for Supabase project creation, migrations, and Vercel deploy.

```bash
cp .env.example .env.local
npm install
npm run dev
```

## Agent context

See **[AGENTS.md](./AGENTS.md)** for architecture, routes, and Cursor rules.

## Stack

Next.js 14 · TypeScript · Tailwind · Supabase · Vercel

UI patterns adapted from [FlowShift](https://flowshift.org) (dark zinc shell, sky primary).
