import { humanize } from "@/lib/portal/types";

const COLORS: Record<string, string> = {
  // projects
  planning: "bg-sky-100 text-sky-800",
  in_progress: "bg-indigo-100 text-indigo-800",
  review: "bg-amber-100 text-amber-800",
  completed: "bg-emerald-100 text-emerald-800",
  on_hold: "bg-neutral-200 text-neutral-700",
  // milestones
  pending: "bg-neutral-100 text-neutral-700",
  awaiting_approval: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  changes_requested: "bg-red-100 text-red-800",
  // requests
  open: "bg-sky-100 text-sky-800",
  resolved: "bg-emerald-100 text-emerald-800",
  closed: "bg-neutral-200 text-neutral-700",
  // contracts
  draft: "bg-neutral-100 text-neutral-700",
  sent: "bg-amber-100 text-amber-800",
  accepted: "bg-emerald-100 text-emerald-800",
  // priority
  low: "bg-neutral-100 text-neutral-600",
  normal: "bg-neutral-100 text-neutral-700",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
};

/** Small coloured pill for any status value. `labels` lets a page rename a status. */
export function Pill({ value, labels }: { value: string; labels?: Record<string, string> }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ${
        COLORS[value] ?? "bg-neutral-100 text-neutral-700"
      }`}
    >
      {labels?.[value] ?? humanize(value)}
    </span>
  );
}

export function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-200">
        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${percent}%` }} />
      </div>
      <span className="w-10 text-right text-xs tabular-nums text-neutral-600">{percent}%</span>
    </div>
  );
}
