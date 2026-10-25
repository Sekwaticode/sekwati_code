import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Pill } from "@/components/shared/badges";
import { REQUEST_STATUSES, formatDay, humanize, type RequestRow, type RequestStatus } from "@/lib/portal/types";

type Row = RequestRow & {
  contacts: { name: string; company: string | null } | null;
  projects: { name: string } | null;
};

export default async function RequestsPage({ searchParams }: { searchParams: { status?: string } }) {
  const filter = searchParams.status;
  const supabase = createClient();
  let query = supabase
    .from("requests")
    .select("*, contacts(name, company), projects(name)")
    .order("created_at", { ascending: false })
    .limit(200);

  if (filter === "all") {
    // no filter
  } else if (REQUEST_STATUSES.includes(filter as RequestStatus)) {
    query = query.eq("status", filter as RequestStatus);
  } else {
    query = query.in("status", ["open", "in_progress"]);
  }
  const { data, error } = await query;
  const requests = (data ?? []) as unknown as Row[];
  const active = filter === "all" || REQUEST_STATUSES.includes(filter as RequestStatus) ? filter : "active";

  const tabs: [string, string][] = [
    ["active", "Open & in progress"],
    ...REQUEST_STATUSES.map((s) => [s, humanize(s)] as [string, string]),
    ["all", "All"],
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Revision & support requests</h1>

      <div className="flex flex-wrap gap-2 text-sm">
        {tabs.map(([key, text]) => (
          <Link
            key={key}
            href={key === "active" ? "/admin/requests" : `/admin/requests?status=${key}`}
            className={`rounded-full px-3 py-1.5 ${
              active === key
                ? "bg-neutral-900 text-white"
                : "border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100"
            }`}
          >
            {text}
          </Link>
        ))}
      </div>

      {error && <p className="text-sm text-red-600">Could not load requests: {error.message}</p>}

      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">Request</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Priority</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">Opened</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {requests.map((r) => (
              <tr key={r.id} className="hover:bg-neutral-50">
                <td className="px-4 py-3">
                  <Link href={`/admin/requests/${r.id}`} className="font-medium hover:underline">
                    {r.title}
                  </Link>
                  <div className="text-neutral-500">
                    {humanize(r.type)} · {r.contacts?.name ?? "Unknown client"}
                    {r.projects ? ` · ${r.projects.name}` : ""}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Pill value={r.status} />
                </td>
                <td className="px-4 py-3">
                  <Pill value={r.priority} />
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-neutral-600">{formatDay(r.created_at)}</td>
              </tr>
            ))}
            {requests.length === 0 && !error && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-neutral-500">
                  Nothing here.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
