import { createClient } from '@supabase/supabase-js'

/**
 * Supabase client. Credentials come from Vite env vars at build time.
 * Copy .env.example to .env.local and fill in your project values.
 *
 * In Phase 1 the app works fully offline with localStorage, so a missing
 * client is tolerated — auth/sync features (Phase 2) require these vars.
 */
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase =
  url && anonKey ? createClient(url, anonKey) : null

export const isSupabaseConfigured = Boolean(url && anonKey)
