import { label, type ContactKind, type ContactStatus } from "@/lib/crm/types";

const STATUS_STYLES: Record<ContactStatus, string> = {
  new: "bg-sky-100 text-sky-800",
  contacted: "bg-indigo-100 text-indigo-800",
  qualified: "bg-violet-100 text-violet-800",
  proposal: "bg-amber-100 text-amber-800",
  won: "bg-emerald-100 text-emerald-800",
  lost: "bg-neutral-200 text-neutral-700",
  active: "bg-emerald-100 text-emerald-800",
  inactive: "bg-neutral-200 text-neutral-700",
};

export function StatusBadge({ status }: { status: ContactStatus }) {
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}>
      {label(status)}
    </span>
  );
}

export function KindBadge({ kind }: { kind: ContactKind }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${
        kind === "client" ? "border-emerald-300 text-emerald-800" : "border-sky-300 text-sky-800"
      }`}
    >
      {label(kind)}
    </span>
  );
}
