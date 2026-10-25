"use client";

import { createBrowserClient } from "@supabase/ssr";

/** Supabase client for the browser. Used for direct file uploads to storage. */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
