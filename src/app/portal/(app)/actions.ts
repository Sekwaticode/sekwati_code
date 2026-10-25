"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { formText, getClientProfile } from "@/lib/auth";
import { REQUEST_TYPES, UUID_RE, type RequestType } from "@/lib/portal/types";

export type FormState = { error?: string; ok?: string };

async function requireClient() {
  const { supabase, profile } = await getClientProfile();
  if (!profile) throw new Error("Not authorised.");
  return { supabase, profile };
}

export async function respondToMilestone(
  projectId: string,
  milestoneId: string,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const { supabase } = await requireClient();
  const approve = formData.get("decision") === "approve";
  const feedback = formText(formData, "feedback", 5000);

  const { error } = await supabase.rpc("respond_to_milestone", {
    p_milestone: milestoneId,
    p_approve: approve,
    p_feedback: feedback ?? "",
  });
  if (error) return { error: error.message };

  revalidatePath(`/portal/projects/${projectId}`);
  revalidatePath("/portal");
  revalidatePath(`/admin/projects/${projectId}`);
  return { ok: approve ? "Approved. Thank you!" : "Thanks, we've received your feedback." };
}

export async function createRequest(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase, profile } = await requireClient();
  const type = String(formData.get("type") ?? "support") as RequestType;
  const title = formText(formData, "title", 200);
  const description = formText(formData, "description", 5000);
  const projectRaw = String(formData.get("project_id") ?? "");

  if (!REQUEST_TYPES.includes(type)) return { error: "Choose a request type." };
  if (!title) return { error: "Add a short title." };
  if (!description) return { error: "Describe what you need." };

  const { data, error } = await supabase
    .from("requests")
    .insert({
      contact_id: profile.contact_id,
      project_id: UUID_RE.test(projectRaw) ? projectRaw : null,
      type,
      title,
      description,
      priority: formData.get("urgent") === "on" ? "high" : "normal",
    })
    .select("id")
    .single();
  if (error) return { error: `Could not send: ${error.message}` };

  revalidatePath("/portal", "layout");
  revalidatePath("/admin", "layout");
  redirect(`/portal/requests/${data.id}`);
}

export async function clientReply(requestId: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireClient();
  const body = formText(formData, "body", 5000);
  if (!body) return { error: "Write a message first." };

  const { error } = await supabase.from("request_comments").insert({ request_id: requestId, body });
  if (error) return { error: `Could not send: ${error.message}` };

  revalidatePath(`/portal/requests/${requestId}`);
  revalidatePath(`/admin/requests/${requestId}`);
  return {};
}

export async function acceptContract(contractId: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireClient();
  const name = formText(formData, "signer_name", 200);
  if (formData.get("agree") !== "on") return { error: "Tick the box to confirm you agree." };
  if (!name || name.length < 2) return { error: "Type your full name." };

  const h = headers();
  const ip =
    h.get("x-nf-client-connection-ip") ?? // Netlify
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    "unknown";
  const userAgent = h.get("user-agent") ?? "unknown";

  const { error } = await supabase.rpc("accept_contract", {
    p_contract: contractId,
    p_signer_name: name,
    p_ip: ip,
    p_user_agent: userAgent,
  });
  if (error) return { error: error.message };

  revalidatePath(`/portal/contracts/${contractId}`);
  revalidatePath("/portal");
  revalidatePath("/admin", "layout");
  return { ok: "Contract accepted." };
}

export async function changePassword(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireClient();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (password.length < 8) return { error: "Use at least 8 characters." };
  if (password !== confirm) return { error: "The two passwords don't match." };

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };
  return { ok: "Password changed." };
}
