# 🇱🇹 LAF Fit — Karinis Treniruoklis

A mobile-first web app that helps Lithuanian civilians (ages 25–50) prepare for and pass the
**Lithuanian Armed Forces (LAF) physical fitness test** — push-ups, sit-ups (2 min), and the 3 km run.

> Context: per an LRT 2025 report, only ~19% of conscripts pass the first LAF fitness test. This app
> targets that gap with age-tailored plans, a 12-week progressive program, and a bilingual (LT/EN) UI.

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS 4 (military navy/forest palette + LT flag accents) |
| Database | Neon (Postgres) via **Prisma** |
| Auth | **NextAuth** (Credentials: email + password, bcrypt-hashed, JWT sessions) |
| i18n | i18next / react-i18next (LT + EN) |
| Hosting | Vercel (auto-deploy from `main`) |

## Features

- **Register / Login** — email + password; sessions via NextAuth
- **Per-user data** — each account has its own profile and workout history (Prisma → Neon)
- **Onboarding** — age, gender, fitness level, language, wake time → auto-assigns an age-group plan
- **Today** — today's workout, daily routine timeline, mark complete / skip / cheat day, streak counter
- **Exercise Guide / Schedule / Progress** — library per age group, 7-day + 12-week plan, LAF standards
- **Profile & Settings** — dark/light theme, LT/EN runtime switch, sign out

## Getting Started

```bash
npm install
# 1) Set up the database (see below), then:
npm run db:push      # create tables in Neon
npm run dev          # http://localhost:3000
```

### Environment

Copy `.env.example` to `.env` and fill in:

```
DATABASE_URL="postgresql://...    # Neon → Connect → Prisma / pooled string
NEXTAUTH_SECRET="..."             # generate: npx auth secret
NEXTAUTH_URL="http://localhost:3000"
```

### Database (Neon + Prisma)

1. Create a free Postgres project at [neon.tech](https://neon.tech).
2. Copy the connection string into `DATABASE_URL` in `.env`.
3. Push the schema: `npm run db:push` (creates `User`, `Profile`, `WorkoutLog`).
4. Inspect data anytime with `npx prisma studio`.

The data model lives in [`prisma/schema.prisma`](prisma/schema.prisma).

## Project Structure

```
src/
├── app/
│   ├── (app)/          # authenticated screens (Header + BottomNav layout)
│   │   ├── page.tsx           # Home / Today
│   │   ├── schedule, guide, progress, skip, profile, settings, notifications
│   ├── login, register, onboarding   # public + onboarding routes
│   ├── api/
│   │   ├── auth/[...nextauth]  # NextAuth handler
│   │   ├── register           # create account (bcrypt)
│   │   ├── profile            # GET/PUT current user's profile
│   │   └── logs               # GET/POST current user's workout logs
│   ├── layout.tsx, providers.tsx, globals.css
├── screens/            # screen components rendered by the routes above
├── components/         # common UI + layout (Header, BottomNav, AppLayout)
├── context/            # AppContext (profile, logs, theme, language)
├── data/               # age groups, schedule, routine, LAF standards
├── i18n/               # en.json / lt.json + init
├── lib/                # prisma, auth, db (client fetch), storage, utils
├── types/              # shared types + next-auth augmentation
└── middleware.ts       # route protection (redirects to /login)
```

## Deployment (Vercel)

1. Push to GitHub (done).
2. Import the repo at [vercel.com/new](https://vercel.com/new) — Next.js is auto-detected.
3. Add environment variables in **Project → Settings → Environment Variables**:
   `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` (your Vercel URL).
4. Every push to `main` auto-deploys.

```
Write code → git push → Vercel builds & deploys → users sign in → data stored in Neon
```
