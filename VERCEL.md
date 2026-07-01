# Vercel deployment

The GitHub repo deploys to the **`dylan-tool`** Vercel project (not `clientledger`).

Production URL: **https://dylan-tool-howepe86s-projects.vercel.app**

## Required environment variables

In Vercel → **dylan-tool** → **Settings** → **Environment Variables**, add these for **Production**, **Preview**, and **Development**:

| Name | Production value | Preview / Development value |
|------|------------------|----------------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://cudbdvtwmihidjzewshh.supabase.co` | same |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your `sb_publishable_...` key | same |
| `SUPABASE_SERVICE_ROLE_KEY` | your `sb_secret_...` key | same |
| `NEXT_PUBLIC_APP_URL` | `https://dylan-tool-howepe86s-projects.vercel.app` | `http://localhost:3000` |

Copy values from your local `.env.local` for the Supabase keys.

## After adding env vars

1. Vercel → **Deployments** → open the failed deploy → **Redeploy**
2. Update Supabase **Authentication → URL configuration**:
   - Site URL: `https://dylan-tool-howepe86s-projects.vercel.app`
   - Redirect URLs: `https://dylan-tool-howepe86s-projects.vercel.app/api/auth/callback`

## Why deploys fail

| Error | Fix |
|-------|-----|
| Missing env vars at build | Add variables in Vercel dashboard (see table above) |
| `No Output Directory named "public"` | Project must use **Next.js** framework — `vercel.json` sets `"framework": "nextjs"`. In Vercel → Settings → General, set Framework Preset to **Next.js** and clear **Output Directory** (leave blank). |

## Why the first deploy failed

The build runs `next build`, which imports server code. Previously `lib/env.ts` validated env vars at import time; Vercel had no env vars set yet, so the build exited with code 1.
