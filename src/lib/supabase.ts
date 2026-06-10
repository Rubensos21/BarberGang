import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Treat placeholder values the same as missing — return null so the app
// shows a clear "not configured" message instead of a network crash.
const isConfigured =
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes("TU_PROJECT_ID") &&
  !supabaseAnonKey.includes("TU_ANON_KEY");

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
