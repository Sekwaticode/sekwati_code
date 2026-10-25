"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { DOCUMENT_CATEGORIES, UUID_RE, type DocumentCategory } from "@/lib/portal/types";

/**
 * Records a file that the browser has already uploaded to storage.
 * Used by both staff and clients; the database rules decide who may do it.
 */
export async function recordDocument(input: {
  projectId: string;
  path: string;
  fileName: string;
  size: number;
  mimeType: string;
  category: string;
}): Promise<{ error?: string }> {
  const { projectId, path, fileName, size, mimeType } = input;
  if (!UUID_RE.test(projectId) || !path.startsWith(`${projectId}/`) || path.includes("..")) {
    return { error: "Invalid upload." };
  }
  const category: DocumentCategory = DOCUMENT_CATEGORIES.includes(input.category as DocumentCategory)
    ? (input.category as DocumentCategory)
    : "other";

  const supabase = createClient();
  const { error } = await supabase.from("documents").insert({
    project_id: projectId,
    file_path: path,
    file_name: fileName.slice(0, 255),
    size_bytes: Number.isFinite(size) ? size : null,
    mime_type: mimeType.slice(0, 100) || null,
    category,
  });
  if (error) {
    // Don't leave an orphaned file behind
    await supabase.storage.from("project-files").remove([path]);
    return { error: `Could not save the file record: ${error.message}` };
  }

  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath(`/portal/projects/${projectId}`);
  return {};
}
