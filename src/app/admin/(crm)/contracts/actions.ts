"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireStaff, formText } from "@/lib/auth";
import { UUID_RE } from "@/lib/portal/types";

export type FormState = { error?: string };

async function projectBelongsTo(
  supabase: Awaited<ReturnType<typeof requireStaff>>,
  projectId: string,
  contactId: string
) {
  const { data } = await supabase.from("projects").select("contact_id").eq("id", projectId).maybeSingle();
  return data?.contact_id === contactId;
}

export async function createContract(_prev: FormState, formData: FormData): Promise<FormState> {
  const supabase = await requireStaff();
  const contactId = String(formData.get("contact_id") ?? "");
  const projectRaw = String(formData.get("project_id") ?? "");
  const title = formText(formData, "title", 200);
  const body = formText(formData, "body", 100000);

  if (!UUID_RE.test(contactId)) return { error: "Choose a client." };
  if (!title) return { error: "Title is required." };
  if (!body) return { error: "The contract text is empty." };
  const projectId = UUID_RE.test(projectRaw) ? projectRaw : null;
  if (projectId && !(await projectBelongsTo(supabase, projectId, contactId))) {
    return { error: "That project belongs to a different client." };
  }

  const { data, error } = await supabase
    .from("contracts")
    .insert({ contact_id: contactId, project_id: projectId, title, body })
    .select("id")
    .single();
  if (error) return { error: `Could not save: ${error.message}` };

  revalidatePath("/admin", "layout");
  redirect(`/admin/contracts/${data.id}`);
}

export async function updateContract(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const supabase = await requireStaff();
  const title = formText(formData, "title", 200);
  const body = formText(formData, "body", 100000);
  if (!title) return { error: "Title is required." };
  if (!body) return { error: "The contract text is empty." };

  const { error } = await supabase.from("contracts").update({ title, body }).eq("id", id).eq("status", "draft");
  if (error) return { error: error.message };

  revalidatePath("/admin", "layout");
  redirect(`/admin/contracts/${id}`);
}

export async function sendContract(id: string) {
  const supabase = await requireStaff();
  const { error } = await supabase
    .from("contracts")
    .update({ status: "sent", sent_at: new Date().toISOString() })
    .eq("id", id)
    .eq("status", "draft");
  if (error) throw new Error(error.message);
  revalidatePath("/admin", "layout");
  revalidatePath("/portal", "layout");
}

export async function withdrawContract(id: string) {
  const supabase = await requireStaff();
  const { error } = await supabase
    .from("contracts")
    .update({ status: "draft", sent_at: null })
    .eq("id", id)
    .eq("status", "sent");
  if (error) throw new Error(error.message);
  revalidatePath("/admin", "layout");
  revalidatePath("/portal", "layout");
}

export async function deleteContract(id: string) {
  const supabase = await requireStaff();
  const { error } = await supabase.from("contracts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin", "layout");
  redirect("/admin/contracts");
}
