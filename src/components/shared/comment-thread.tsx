import { formatDate } from "@/lib/crm/types";
import type { RequestComment } from "@/lib/portal/types";

/** The original request plus replies, shown as a conversation. */
export function CommentThread({
  opening,
  comments,
  viewer,
  clientName,
}: {
  opening: { body: string; created_at: string; by_staff: boolean };
  comments: RequestComment[];
  viewer: "staff" | "client";
  clientName: string;
}) {
  const who = (byStaff: boolean) =>
    byStaff ? (viewer === "staff" ? "You (Sekwaticode)" : "Sekwaticode") : viewer === "client" ? "You" : clientName;

  const items = [
    { id: "opening", body: opening.body, created_at: opening.created_at, by_staff: opening.by_staff },
    ...comments.map((c) => ({ id: c.id, body: c.body, created_at: c.created_at, by_staff: c.author_is_staff })),
  ];

  return (
    <ol className="space-y-4">
      {items.map((item) => (
        <li
          key={item.id}
          className={`rounded-lg p-4 ${item.by_staff ? "bg-indigo-50" : "border border-neutral-200 bg-white"}`}
        >
          <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
            <span className="font-medium text-neutral-800">{who(item.by_staff)}</span>
            <span>·</span>
            <span>{formatDate(item.created_at)}</span>
          </div>
          <p className="mt-1 whitespace-pre-wrap text-sm">{item.body}</p>
        </li>
      ))}
    </ol>
  );
}
