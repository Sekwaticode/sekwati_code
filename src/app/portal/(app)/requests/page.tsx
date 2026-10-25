import Link from "next/link";
import { getClientProfile } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/shared/badges";
import { formatDay, humanize, type RequestRow } from "@/lib/portal/types";

export default async function PortalRequestsPage() {
  const { supabase, profile } = await getClientProfile();
  if (!profile) return null;

  const { data } = await supabase
    .from("requests")
    .select("*, projects(name)")
    .order("created_at", { ascending: false });
  const requests = (data ?? []) as (RequestRow & { projects: { name: string } | null })[];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Requests</h1>
          <p className="text-sm text-neutral-500">Ask for changes to your site or get help with anything.</p>
        </div>
        <Button asChild>
          <Link href="/portal/requests/new">New request</Link>
        </Button>
      </div>

      <ul className="divide-y divide-neutral-100 rounded-xl border border-neutral-200 bg-white">
        {requests.map((r) => (
          <li key={r.id}>
            <Link
              href={`/portal/requests/${r.id}`}
              className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 hover:bg-neutral-50"
            >
              <div>
                <p className="font-medium">{r.title}</p>
                <p className="text-sm text-neutral-500">
                  {humanize(r.type)}
                  {r.projects ? ` · ${r.projects.name}` : ""} · {formatDay(r.created_at)}
                </p>
              </div>
              <Pill value={r.status} />
            </Link>
          </li>
        ))}
        {requests.length === 0 && (
          <li className="px-5 py-10 text-center text-sm text-neutral-500">You haven&apos;t sent any requests yet.</li>
        )}
      </ul>
    </div>
  );
}
