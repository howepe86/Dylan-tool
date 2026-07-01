# ClientLedger — Agent Context

This file orients AI agents working in the ClientLedger codebase. For env setup, see [SETUP.md](./SETUP.md).

## Project Overview

**ClientLedger** — client relationship ROI tracker.

Users log time with clients (lunches, dinners, golf, meetings) via:

1. **Manual text entry** — primary MVP path (`/log`)
2. **Voice memo upload** — audio stored in Supabase Storage (transcription phase 2)
3. **Calendar sync** — Google Calendar OAuth scaffolded in `/settings` (phase 2)

For each client they track:

- **Time invested** — interactions with duration and activity type
- **Expenses** — meals, entertainment, travel tied to touchpoints
- **Revenue** — pipeline and closed deals
- **Reports** — quarterly and yearly rollups with ROI %

**Target users:** Consultants, account executives, and founders who entertain clients and need to justify relationship spend.

**Location:** `/Users/howepe/Downloads/Dylan-tool`

**Status:** Initial scaffold — auth, CRUD, reports MVP. Calendar OAuth and voice transcription not yet wired.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui (light theme, indigo accent) |
| Charts | Recharts |
| Forms | react-hook-form + zod |
| Tables | TanStack Table |
| Client state | TanStack Query |
| Dates | date-fns |
| Auth | Supabase Auth |
| Database | Supabase Postgres |
| Storage | Supabase (`voice-memos` bucket) |
| Deployment | Vercel |
| Package manager | npm |

---

## Auth & Routing

**Model:** Supabase Auth, sessions in HTTP-only cookies. Middleware refreshes session on matched routes.

**Middleware** (`middleware.ts`):

- Protects `/dashboard`, `/clients`, `/log`, `/reports`, `/settings` → redirect to `/login?next=...`
- Redirects authenticated users away from `/login`, `/signup` → `/dashboard`
- PKCE `code` param redirected to `/api/auth/callback`

**Supabase auth redirect URL:** `{NEXT_PUBLIC_APP_URL}/api/auth/callback`

| Route | Auth | Purpose |
|-------|------|---------|
| `/` | Public | Landing (authed → `/dashboard`) |
| `/login`, `/signup` | Public | Auth |
| `/dashboard` | Required | Overview + recent activity |
| `/clients`, `/clients/new`, `/clients/[id]` | Required | Client list and detail |
| `/log` | Required | Manual / voice activity entry |
| `/reports` | Required | Quarterly & yearly ROI |
| `/settings` | Required | Calendar connect (phase 2) |

---

## Cursor Rules

Rules in `.cursor/rules/` as `.mdc` files:

| Rule | Scope |
|------|-------|
| `clientledger-core.mdc` | Always apply |
| `react-components.mdc` | *(removed — see `ui.mdc`)* |
| `ui.mdc` | `components/**`, `app/**/*.tsx`, styling |
| `database.mdc` | `lib/db/**`, `supabase/**`, `types/database.ts` |
| `api-routes.mdc` | `app/api/**` |

UI patterns copied from **FlowShift** (`flowshiftv1`): zinc-950 dark shell, sky-600 primary, `MarketingPage` / `AuthPageShell` / dashboard sidebar.

---

## File Map

```
dylan-tool/
├── AGENTS.md
├── SETUP.md
├── README.md
├── middleware.ts
├── app/
│   ├── page.tsx                     ← marketing landing
│   ├── (auth)/login/ signup/
│   ├── (dashboard)/
│   │   ├── layout.tsx               ← sidebar shell
│   │   ├── dashboard/
│   │   ├── clients/ clients/new/ clients/[id]/
│   │   ├── log/
│   │   ├── reports/
│   │   └── settings/
│   └── api/
│       ├── auth/callback/ signout/
│       ├── clients/
│       ├── activities/
│       └── voice/upload/
├── components/
│   ├── auth/
│   ├── dashboard/
│   ├── layout/Sidebar.tsx
│   ├── marketing/                   ← FlowShift UI primitives
│   └── ui/
├── lib/
│   ├── db/clients.ts
│   ├── reports.ts
│   ├── env.ts
│   └── supabase*.ts
├── supabase/migrations/001_initial_schema.sql, 002_voice_storage.sql
└── types/database.ts
```

---

## Database Migrations

Run in Supabase SQL editor in order:

1. `001_initial_schema.sql` — profiles, clients, interactions, expenses, deals, calendar_connections, RLS
2. `002_voice_storage.sql` — `voice-memos` storage bucket + policies

**Important:** Use a **new** Supabase project for ClientLedger — do not reuse the FlowShift database.

---

## Phase 2 Backlog

1. Google Calendar OAuth + event import → `interactions` with `input_source: calendar`
2. Voice memo transcription (Whisper / Deepgram) → populate `notes` from audio
3. Deal pipeline board and edit flows
4. Export reports (CSV/PDF)
5. Stripe billing (optional)

---

## Useful Commands

```bash
npm install
cp .env.example .env.local   # fill Supabase keys
npm run dev
npm run build
```

## Useful Cursor Prompt

```
Following AGENTS.md, implement [feature] using the FlowShift UI patterns in .cursor/rules/react-components.mdc
```
