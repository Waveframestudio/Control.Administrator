import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

// ─── Environment Variables ────────────────────────────────────────────────────
// Copy .env.example → .env and fill in your Supabase project credentials

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '') as string;
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '') as string;

const fallbackUrl = 'https://placeholder-project.supabase.co';
const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder';

const isMissingOrPlaceholder =
  !supabaseUrl ||
  !supabaseAnonKey ||
  supabaseUrl.includes('your-project-id') ||
  supabaseAnonKey.includes('your-anon-key-here');

if (isMissingOrPlaceholder) {
  console.warn(
    '[Supabase] Warning: Missing or placeholder environment variables.\n' +
    'The application is using a fallback client and will not be able to connect to your database.\n' +
    'Please copy .env.example -> .env and fill VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  );
}

const activeUrl = isMissingOrPlaceholder ? fallbackUrl : supabaseUrl;
const activeKey = isMissingOrPlaceholder ? fallbackKey : supabaseAnonKey;

// ─── Supabase Client ──────────────────────────────────────────────────────────
// Single shared instance — import this everywhere in the app.

export const supabase = createClient<Database>(activeUrl, activeKey, {
  auth: {
    // Persist session in localStorage (default behavior — suitable for web apps)
    persistSession: true,
    // Auto-refresh the JWT before it expires
    autoRefreshToken: true,
    // Detect the session from URL fragment (needed for magic links / OAuth)
    detectSessionInUrl: true,
  },
});
