import "server-only";
import { createClient } from "@/lib/supabase/server";

/** Returns a Supabase client for the current user, or throws if they aren't staff. */
export async function requireStaff() {
  const supabase = createClient();
  const { data: isStaff } = await supabase.rpc("is_staff");
  if (!isStaff) throw new Error("Not authorised.");
  return supabase;
}

/** Returns the signed-in client's contact, or null. */
export async function getClientProfile() {
  const supabase = createClient();
  const { data } = await supabase.rpc("my_client_profile");
  const profile = Array.isArray(data) ? data[0] : data;
  return {
    supabase,
    profile: (profile ?? null) as { contact_id: string; name: string; company: string | null } | null,
  };
}

/** Pulls a trimmed, length-limited string out of a form, or null if empty. */
export function formText(formData: FormData, key: string, max = 500): string | null {
  const value = String(formData.get(key) ?? "").trim();
  return value ? value.slice(0, max) : null;
}

export function formDate(formData: FormData, key: string): string | null {
  const value = String(formData.get(key) ?? "").trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null;
}
