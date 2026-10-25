"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireStaff, formDate, formText } from "@/lib/auth";
import {
  DEFAULT_MILESTONES,
  MILESTONE_STATUSES,
  PROJECT_STATUSES,
  UUID_RE,
  type MilestoneStatus,
  type ProjectStatus,
} from "@/lib/portal/types";

export type FormState = { error?: string };

function parseProject(formData: FormData) {
  const name = formText(formData, "name", 200);
  if (!name) return { error: "Project name is required." } as const;
  const status = String(formData.get("status") ?? "planning") as ProjectStatus;
  return {
    data: {
      name,
      description: formText(formData, "description", 5000),
      status: PROJECT_STATUSES.includes(status) ? status : "planning",
      start_date: formDate(formData, "start_date"),
      due_date: formDate(formData, "due_date"),
    },
  } as const;
}

export async function createProject(_prev: FormState, formData: FormData): Promise<FormState> {
  const supabase = await requireStaff();
  const contactId = String(formData.get("contact_id") ?? "");
  if (!UUID_RE.test(contactId)) return { error: "Choose a client." };

  const parsed = parseProject(formData);
  if ("error" in parsed) return { error: parsed.error };

  const { data, error } = await supabase
    .from("projects")
    .insert({ ...parsed.data, contact_id: contactId })
    .select("id")
    .single();
  if (error) return { error: `Could not save: ${error.message}` };

  if (formData.get("default_milestones") === "on") {
    await supabase.from("milestones").insert(
      DEFAULT_MILESTONES.map((m, i) => ({ ...m, project_id: data.id, position: i }))
    );
  }

  revalidatePath("/admin", "layout");
  redirect(`/admin/projects/${data.id}`);
}

export async function updateProject(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const supabase = await requireStaff();
  const parsed = parseProject(formData);
  if ("error" in parsed) return { error: parsed.error };

  const { error } = await supabase.from("projects").update(parsed.data).eq("id", id);
  if (error) return { error: `Could not save: ${error.message}` };

  revalidatePath("/admin", "layout");
  redirect(`/admin/projects/${id}`);
}

export async function deleteProject(id: string) {
  const supabase = await requireStaff();

  // Remove stored files first so they don't linger in the bucket
  const { data: docs } = await supabase.from("documents").select("file_path").eq("project_id", id);
  if (docs && docs.length > 0) {
    await supabase.storage.from("project-files").remove(docs.map((d) => d.file_path));
  }

  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin", "layout");
  redirect("/admin/projects");
}

export async function addMilestone(projectId: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const supabase = await requireStaff();
  const title = formText(formData, "title", 200);
  if (!title) return { error: "Title is required." };

  const { data: last } = await supabase
    .from("milestones")
    .select("position")
    .eq("project_id", projectId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("milestones").insert({
    project_id: projectId,
    title,
    description: formText(formData, "description", 2000),
    due_date: formDate(formData, "due_date"),
    position: (last?.position ?? -1) + 1,
  });
  if (error) return { error: `Could not save: ${error.message}` };

  revalidatePath(`/admin/projects/${projectId}`);
  return {};
}

export async function setMilestoneStatus(projectId: string, milestoneId: string, formData: FormData) {
  const supabase = await requireStaff();
  const status = String(formData.get("status") ?? "") as MilestoneStatus;
  if (!MILESTONE_STATUSES.includes(status)) return;

  const update: Record<string, unknown> = { status };
  // Starting a new approval round clears the previous response
  if (status === "awaiting_approval" || status === "pending" || status === "in_progress") {
    update.responded_at = null;
    update.responded_by = null;
  }
  await supabase.from("milestones").update(update).eq("id", milestoneId).eq("project_id", projectId);
  revalidatePath(`/admin/projects/${projectId}`);
}

export async function deleteMilestone(projectId: string, milestoneId: string) {
  const supabase = await requireStaff();
  await supabase.from("milestones").delete().eq("id", milestoneId).eq("project_id", projectId);
  revalidatePath(`/admin/projects/${projectId}`);
}

export async function deleteDocument(projectId: string, documentId: string) {
  const supabase = await requireStaff();
  const { data: doc } = await supabase
    .from("documents")
    .select("file_path")
    .eq("id", documentId)
    .eq("project_id", projectId)
    .maybeSingle();
  if (!doc) return;
  await supabase.storage.from("project-files").remove([doc.file_path]);
  await supabase.from("documents").delete().eq("id", documentId);
  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath(`/portal/projects/${projectId}`);
}
