"use server";

import { revalidatePath } from "next/cache";
import { requireStaff, formText } from "@/lib/auth";
import {
  REQUEST_PRIORITIES,
  REQUEST_STATUSES,
  type RequestPriority,
  type RequestStatus,
} from "@/lib/portal/types";

export async function updateRequest(id: string, formData: FormData) {
  const supabase = await requireStaff();
  const update: Record<string, string> = {};
  const status = formData.get("status") as RequestStatus | null;
  const priority = formData.get("priority") as RequestPriority | null;
  if (status && REQUEST_STATUSES.includes(status)) update.status = status;
  if (priority && REQUEST_PRIORITIES.includes(priority)) update.priority = priority;
  if (Object.keys(update).length === 0) return;

  await supabase.from("requests").update(update).eq("id", id);
  revalidatePath("/admin", "layout");
  revalidatePath(`/portal/requests/${id}`);
}

export async function staffReply(id: string, _prev: { error?: string }, formData: FormData) {
  const supabase = await requireStaff();
  const body = formText(formData, "body", 5000);
  if (!body) return { error: "Write a reply first." };

  const { error } = await supabase.from("request_comments").insert({ request_id: id, body });
  if (error) return { error: `Could not send: ${error.message}` };

  // Replying to a new request moves it to "in progress"
  await supabase.from("requests").update({ status: "in_progress" }).eq("id", id).eq("status", "open");

  revalidatePath(`/admin/requests/${id}`);
  revalidatePath(`/portal/requests/${id}`);
  return {};
}
