# 🇱🇹 LAF Fit — Karinis Treniruoklis

A mobile-first **PWA** that helps Lithuanian civilians (ages 25–50) prepare for and pass the
**Lithuanian Armed Forces (LAF) physical fitness test** — push-ups, sit-ups (2 min), and the 3 km run.

> Context: per an LRT 2025 report, only ~19% of conscripts pass the first LAF fitness test. This app
> targets that gap with age-tailored plans, a 12-week progressive program, and bilingual (LT/EN) UI.

## Features (Phase 1 — MVP)

- **Onboarding** — age, gender, fitness level, language, wake time → auto-assigns an age-group plan
- **Today** — today's workout, daily routine timeline, mark complete / skip / cheat day, streak counter
- **Exercise Guide** — exercise library per age group (25–30, 31–40, 41–50) with form-cue placeholders
- **Schedule** — 7-day weekly plan + 12-week progressive phases (Foundation → Volume → Test Prep)
- **Progress** — workout/streak stats + LAF standards reference (charts land in Phase 2)
- **Profile & Settings** — dark/light theme, LT/EN runtime switch
- **Offline-capable PWA** — installable, works without a connection

## Tech Stack

| Layer | Tech |
|---|---|
| Build | Vite 8 + React 19 + TypeScript |
| Styling | Tailwind CSS 4 (military navy/forest palette + LT flag accents) |
| Routing | React Router 7 |
| i18n | i18next / react-i18next (LT + EN) |
| PWA | vite-plugin-pwa (Workbox) |
| Backend (Phase 2) | Supabase — PostgreSQL + Magic Link auth |
| Charts (Phase 2) | Recharts |
| Hosting | Vercel (auto-deploy from `main`) |

## Getting Started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build to dist/
npm run preview    # preview the production build
```

### Authentication & per-user data (Supabase)

Accounts (email + password) and each user's workout history are stored in Supabase,
isolated per user via Row-Level Security. To set it up:

1. Create a free project at [supabase.com](https://supabase.com).
2. In the dashboard: **SQL Editor → New query**, paste [`supabase/schema.sql`](supabase/schema.sql), and **Run**.
3. (Optional, for faster local testing) **Authentication → Sign In / Providers → Email**: turn **Confirm email** off so new sign-ups log in immediately.
4. **Project Settings → API**: copy the Project URL and `anon` public key.
5. Copy `.env.example` to `.env.local` and fill in:

```
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR-ANON-KEY
```

6. Restart `npm run dev`. Register → onboarding → your plan & history.

> On Vercel, add the same two env vars in **Project → Settings → Environment Variables**.

Theme and language are device-level (localStorage); profile and logs are per-account (Supabase).

## Project Structure

```
src/
├── components/   # common UI + layout (Header, BottomNav)
├── pages/        # Onboarding, Home, Schedule, ExerciseGuide, Progress, SkipCheatDay, Profile, Settings, Notifications
├── context/      # AppContext — profile, logs, theme, language
├── data/         # age groups, week schedule, daily routine, LAF standards (source of truth)
├── hooks/        # (reserved for progressive-overload logic)
├── i18n/         # en.json / lt.json + init
├── lib/          # storage, supabase, utils
└── types/        # shared TypeScript types
```

## Roadmap

- **Phase 2** — Supabase auth + cloud sync, progress charts, web-push notifications
- **Phase 3** — Lottie exercise animations, 12-week progressive-overload engine, beta with conscripts
- **Phase 4** — community leaderboard, video integration, native wrappers

## Deployment (Vercel)

1. Push this repo to GitHub.
2. Import the repo at [vercel.com/new](https://vercel.com/new) — framework preset **Vite** (auto-detected).
3. Add `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` env vars (when using Phase 2 features).
4. Every push to `main` auto-deploys.
