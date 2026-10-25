"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { requireStaff, formText } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export type PortalState = { error?: string; email?: string; password?: string };

const NO_SECRET =
  "Client logins need the SUPABASE_SECRET_KEY environment variable. See the README, \"Client portal setup\".";

function tempPassword() {
  // 14 characters, letters and digits, easy to send over WhatsApp
  return randomBytes(12).toString("base64url").replace(/[-_]/g, "x").slice(0, 14);
}

/** Make sure this user really is a portal login for this contact (and not, say, a staff member). */
async function assertClientUser(
  supabase: Awaited<ReturnType<typeof requireStaff>>,
  contactId: string,
  userId: string
) {
  const { data } = await supabase
    .from("client_users")
    .select("user_id")
    .eq("user_id", userId)
    .eq("contact_id", contactId)
    .maybeSingle();
  if (!data) throw new Error("That login doesn't belong to this contact.");
}

export async function createPortalLogin(
  contactId: string,
  _prev: PortalState,
  formData: FormData
): Promise<PortalState> {
  const supabase = await requireStaff();
  const admin = createAdminClient();
  if (!admin) return { error: NO_SECRET };

  const email = formText(formData, "email", 200)?.toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Enter a valid email address." };

  const password = tempPassword();
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error || !data.user) {
    if (error?.code === "email_exists" || /already/i.test(error?.message ?? "")) {
      return { error: "A login with that email already exists. Use a different email, or remove the old login first." };
    }
    return { error: `Could not create login: ${error?.message ?? "unknown error"}` };
  }

  const { error: linkError } = await supabase.rpc("link_client_user", {
    p_contact: contactId,
    p_user: data.user.id,
  });
  if (linkError) {
    await admin.auth.admin.deleteUser(data.user.id);
    return { error: `Could not link login: ${linkError.message}` };
  }

  await supabase
    .from("activities")
    .insert({ contact_id: contactId, type: "note", body: `Client portal login created for ${email}.` });

  revalidatePath(`/admin/contacts/${contactId}`);
  return { email, password };
}

export async function resetPortalPassword(
  contactId: string,
  userId: string,
  _prev: PortalState
): Promise<PortalState> {
  const supabase = await requireStaff();
  const admin = createAdminClient();
  if (!admin) return { error: NO_SECRET };
  await assertClientUser(supabase, contactId, userId);

  const password = tempPassword();
  const { data, error } = await admin.auth.admin.updateUserById(userId, { password });
  if (error) return { error: `Could not reset password: ${error.message}` };

  return { email: data.user?.email ?? undefined, password };
}

export async function removePortalLogin(contactId: string, userId: string) {
  const supabase = await requireStaff();
  await assertClientUser(supabase, contactId, userId);

  const admin = createAdminClient();
  if (admin) {
    // Deleting the auth user also removes the client_users link
    await admin.auth.admin.deleteUser(userId);
  } else {
    await supabase.from("client_users").delete().eq("user_id", userId);
  }

  await supabase
    .from("activities")
    .insert({ contact_id: contactId, type: "note", body: "Client portal login removed." });

  revalidatePath(`/admin/contacts/${contactId}`);
}
