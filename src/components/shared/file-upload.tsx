"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { recordDocument } from "@/app/files/actions";
import { Button } from "@/components/ui/button";
import { selectClass } from "@/components/admin/styles";
import { DOCUMENT_CATEGORIES, humanize } from "@/lib/portal/types";

const MAX_BYTES = 50 * 1024 * 1024;

export function FileUpload({ projectId }: { projectId: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState<string>("content");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  async function upload() {
    const files = Array.from(inputRef.current?.files ?? []);
    if (files.length === 0) {
      setMessage({ ok: false, text: "Choose a file first." });
      return;
    }
    setBusy(true);
    setMessage(null);
    const supabase = createClient();
    const failed: string[] = [];

    for (const file of files) {
      if (file.size > MAX_BYTES) {
        failed.push(`${file.name} (over 50 MB)`);
        continue;
      }
      const safeName = file.name.replace(/[^\w.\-]+/g, "_").slice(-120);
      const path = `${projectId}/${crypto.randomUUID()}-${safeName}`;
      const { error } = await supabase.storage
        .from("project-files")
        .upload(path, file, { contentType: file.type || undefined });
      if (error) {
        failed.push(`${file.name} (${error.message})`);
        continue;
      }
      const result = await recordDocument({
        projectId,
        path,
        fileName: file.name,
        size: file.size,
        mimeType: file.type,
        category,
      });
      if (result.error) failed.push(`${file.name} (${result.error})`);
    }

    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
    setMessage(
      failed.length
        ? { ok: false, text: `Some files failed: ${failed.join(", ")}` }
        : { ok: true, text: files.length === 1 ? "File uploaded." : `${files.length} files uploaded.` }
    );
    router.refresh();
  }

  return (
    <div className="space-y-3 rounded-lg border border-dashed border-neutral-300 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <input ref={inputRef} type="file" multiple className="max-w-full text-sm" disabled={busy} />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={`${selectClass} max-w-[150px]`}
          disabled={busy}
          aria-label="File type"
        >
          {DOCUMENT_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {humanize(c)}
            </option>
          ))}
        </select>
        <Button type="button" size="sm" onClick={upload} disabled={busy}>
          {busy ? "Uploading…" : "Upload"}
        </Button>
      </div>
      {message && (
        <p className={`text-sm ${message.ok ? "text-emerald-700" : "text-red-600"}`}>{message.text}</p>
      )}
      <p className="text-xs text-neutral-500">Up to 50 MB per file.</p>
    </div>
  );
}
