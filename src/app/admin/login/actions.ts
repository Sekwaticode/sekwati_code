"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type LoginState = { error?: string };

const HOMES = ["/admin", "/portal"] as const;
type Home = (typeof HOMES)[number];

export async function signIn(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const nextRaw = String(formData.get("next") ?? "/admin");
  const next: Home = HOMES.includes(nextRaw as Home) ? (nextRaw as Home) : "/admin";

  if (!email || !password) return { error: "Enter your email and password." };

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    if (error.code === "invalid_credentials") {
      return {
        error:
          next === "/admin"
            ? "Incorrect email or password. Note: this is a user under Authentication → Users in your Supabase project, not your supabase.com account."
            : "Incorrect email or password.",
      };
    }
    if (error.code === "email_not_confirmed") {
      return { error: "This email isn't confirmed yet." };
    }
    return { error: `Sign-in failed: ${error.message}` };
  }

  // Send people to the area they belong in
  const [{ data: isStaff }, { data: isClient }] = await Promise.all([
    supabase.rpc("is_staff"),
    supabase.rpc("is_client"),
  ]);
  if (isStaff && !isClient) redirect("/admin");
  if (isClient && !isStaff) redirect("/portal");
  redirect(next);
}

export async function signOut(formData: FormData) {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect(formData.get("area") === "portal" ? "/portal/login" : "/admin/login");
}
