-- LAF Workout App — Supabase schema
-- Run this in your Supabase project: SQL Editor → New query → paste → Run.
-- Safe to re-run (idempotent).

-- =========================================================
-- profiles: one row per authenticated user
-- =========================================================
create table if not exists public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  name          text not null default 'Recruit',
  age           int  not null default 30,
  gender        text not null default 'M',           -- 'M' | 'F'
  fitness_level text not null default 'Intermediate', -- Beginner | Intermediate | Advanced
  language      text not null default 'EN',           -- 'EN' | 'LT'
  wake_time     text not null default '06:00',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- =========================================================
-- workout_logs: one row per user per day
-- =========================================================
create table if not exists public.workout_logs (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  log_date   date not null,
  status     text not null,           -- 'completed' | 'skipped' | 'cheat'
  reason     text,                    -- skip reason (optional)
  logged_at  timestamptz not null default now(),
  unique (user_id, log_date)
);

create index if not exists workout_logs_user_idx
  on public.workout_logs (user_id, log_date desc);

-- =========================================================
-- Row-Level Security: each user sees only their own rows
-- =========================================================
alter table public.profiles      enable row level security;
alter table public.workout_logs  enable row level security;

-- profiles policies
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- workout_logs policies
drop policy if exists "logs_select_own" on public.workout_logs;
create policy "logs_select_own" on public.workout_logs
  for select using (auth.uid() = user_id);

drop policy if exists "logs_insert_own" on public.workout_logs;
create policy "logs_insert_own" on public.workout_logs
  for insert with check (auth.uid() = user_id);

drop policy if exists "logs_update_own" on public.workout_logs;
create policy "logs_update_own" on public.workout_logs
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "logs_delete_own" on public.workout_logs;
create policy "logs_delete_own" on public.workout_logs
  for delete using (auth.uid() = user_id);
