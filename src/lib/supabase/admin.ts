import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client with full rights, used only to create client portal logins.
 * Never import this from a client component. Always check is_staff() before using it.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secret) return null;
  return createClient(url, secret, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
