import { Download, Trash2 } from "lucide-react";
import { deleteDocument } from "@/app/admin/(crm)/projects/actions";
import { formatBytes, formatDay, humanize, type DocumentRow } from "@/lib/portal/types";

export function DocumentList({
  documents,
  canDelete = false,
  viewer,
}: {
  documents: DocumentRow[];
  canDelete?: boolean;
  viewer: "staff" | "client";
}) {
  if (documents.length === 0) {
    return <p className="text-sm text-neutral-500">No files yet.</p>;
  }
  return (
    <ul className="divide-y divide-neutral-100">
      {documents.map((d) => (
        <li key={d.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
          <div className="min-w-0">
            <a href={`/files/${d.id}`} className="flex items-center gap-2 font-medium hover:underline">
              <Download className="h-4 w-4 shrink-0 text-neutral-400" aria-hidden />
              <span className="truncate">{d.file_name}</span>
            </a>
            <p className="mt-0.5 text-xs text-neutral-500">
              {humanize(d.category)} · {formatBytes(d.size_bytes)} · {formatDay(d.created_at)} · uploaded by{" "}
              {d.uploaded_by_staff ? (viewer === "staff" ? "us" : "Sekwaticode") : viewer === "staff" ? "client" : "you"}
            </p>
          </div>
          {canDelete && (
            <form action={deleteDocument.bind(null, d.project_id, d.id)}>
              <button
                type="submit"
                className="rounded p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600"
                aria-label={`Delete ${d.file_name}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </form>
          )}
        </li>
      ))}
    </ul>
  );
}
