"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  ACTIVITY_TYPES,
  CONTACT_KINDS,
  statusesFor,
  type ActivityType,
  type ContactKind,
  type ContactStatus,
} from "@/lib/crm/types";

export type FormState = { error?: string };

function text(formData: FormData, key: string, max = 500): string | null {
  const value = String(formData.get(key) ?? "").trim();
  return value ? value.slice(0, max) : null;
}

function parseContact(formData: FormData) {
  const kind = String(formData.get("kind") ?? "lead") as ContactKind;
  if (!CONTACT_KINDS.includes(kind)) return { error: "Choose lead or client." } as const;

  const status = String(formData.get("status") ?? "") as ContactStatus;
  const allowed = statusesFor(kind);
  const finalStatus = allowed.includes(status) ? status : allowed[0];

  const name = text(formData, "name", 200);
  if (!name) return { error: "Name is required." } as const;

  const email = text(formData, "email", 200);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "That email address doesn't look right." } as const;
  }

  const rawValue = text(formData, "estimated_value", 20);
  let estimated_value: number | null = null;
  if (rawValue) {
    estimated_value = Number(rawValue.replace(/[^\d.]/g, ""));
    if (!Number.isFinite(estimated_value)) return { error: "Estimated value must be a number." } as const;
  }

  return {
    data: {
      kind,
      status: finalStatus,
      name,
      company: text(formData, "company", 200),
      email,
      phone: text(formData, "phone", 50),
      source: text(formData, "source", 50),
      service_interest: text(formData, "service_interest", 200),
      estimated_value,
      notes: text(formData, "notes", 5000),
    },
  } as const;
}

export async function createContact(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseContact(formData);
  if ("error" in parsed) return { error: parsed.error };

  const supabase = createClient();
  const { data, error } = await supabase.from("contacts").insert(parsed.data).select("id").single();
  if (error) return { error: `Could not save: ${error.message}` };

  revalidatePath("/admin", "layout");
  redirect(`/admin/contacts/${data.id}`);
}

export async function updateContact(
  id: string,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = parseContact(formData);
  if ("error" in parsed) return { error: parsed.error };

  const supabase = createClient();
  const { error } = await supabase.from("contacts").update(parsed.data).eq("id", id);
  if (error) return { error: `Could not save: ${error.message}` };

  revalidatePath("/admin", "layout");
  redirect(`/admin/contacts/${id}`);
}

export async function convertToClient(id: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("contacts")
    .update({ kind: "client", status: "active" })
    .eq("id", id);
  if (error) throw new Error(error.message);

  await supabase
    .from("activities")
    .insert({ contact_id: id, type: "note", body: "Converted from lead to client." });

  revalidatePath("/admin", "layout");
}

export async function deleteContact(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("contacts").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin", "layout");
  redirect("/admin/contacts");
}

export async function addActivity(
  contactId: string,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const type = String(formData.get("type") ?? "note") as ActivityType;
  if (!ACTIVITY_TYPES.includes(type)) return { error: "Unknown activity type." };

  const body = text(formData, "body", 5000);
  if (!body) return { error: "Write something first." };

  const supabase = createClient();
  const { error } = await supabase.from("activities").insert({ contact_id: contactId, type, body });
  if (error) return { error: `Could not save: ${error.message}` };

  revalidatePath(`/admin/contacts/${contactId}`);
  return {};
}
