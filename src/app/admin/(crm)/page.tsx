import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/status-badge";
import { LEAD_STATUSES, formatDate, formatMoney, type Contact } from "@/lib/crm/types";

export default async function AdminHome() {
  const supabase = createClient();
  const { data } = await supabase
    .from("contacts")
    .select("id, kind, status, estimated_value");
  const contacts = (data ?? []) as Pick<Contact, "id" | "kind" | "status" | "estimated_value">[];

  const leads = contacts.filter((c) => c.kind === "lead");
  const clients = contacts.filter((c) => c.kind === "client");
  const openLeads = leads.filter((c) => c.status !== "won" && c.status !== "lost");
  const openValue = openLeads.reduce((sum, c) => sum + (Number(c.estimated_value) || 0), 0);

  const { data: recent } = await supabase
    .from("contacts")
    .select("id, name, company, kind, status, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
  const [openRequests, changeRequests, acceptedContracts] = await Promise.all([
    supabase.from("requests").select("id", { count: "exact", head: true }).eq("status", "open"),
    supabase
      .from("milestones")
      .select("id, title, project_id, projects(name)")
      .eq("status", "changes_requested"),
    supabase
      .from("contracts")
      .select("id, title, accepted_at, contacts(name)")
      .eq("status", "accepted")
      .gte("accepted_at", twoWeeksAgo),
  ]);
  const changes = (changeRequests.data ?? []) as unknown as {
    id: string;
    title: string;
    project_id: string;
    projects: { name: string } | null;
  }[];
  const accepted = (acceptedContracts.data ?? []) as unknown as {
    id: string;
    title: string;
    contacts: { name: string } | null;
  }[];
  const hasAttention = (openRequests.count ?? 0) > 0 || changes.length > 0 || accepted.length > 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Overview</h1>
        <Button asChild>
          <Link href="/admin/contacts/new">Add contact</Link>
        </Button>
      </div>

      {hasAttention && (
        <section className="rounded-xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="font-medium text-amber-900">Needs attention</h2>
          <ul className="mt-3 space-y-1.5 text-sm text-amber-900">
            {(openRequests.count ?? 0) > 0 && (
              <li>
                <Link href="/admin/requests?status=open" className="underline">
                  {openRequests.count} new client request{openRequests.count === 1 ? "" : "s"}
                </Link>
              </li>
            )}
            {changes.map((m) => (
              <li key={m.id}>
                <Link href={`/admin/projects/${m.project_id}`} className="underline">
                  Changes requested on &quot;{m.title}&quot;
                </Link>{" "}
                ({m.projects?.name})
              </li>
            ))}
            {accepted.map((c) => (
              <li key={c.id}>
                <Link href={`/admin/contracts/${c.id}`} className="underline">
                  {c.contacts?.name} accepted &quot;{c.title}&quot;
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Open leads" value={String(openLeads.length)} href="/admin/contacts?kind=lead" />
        <Stat label="Open lead value" value={formatMoney(openValue)} />
        <Stat label="Clients" value={String(clients.length)} href="/admin/contacts?kind=client" />
      </div>

      <section className="rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="font-medium">Leads by status</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {LEAD_STATUSES.map((s) => (
            <Link
              key={s}
              href={`/admin/contacts?kind=lead&status=${s}`}
              className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm hover:bg-neutral-50"
            >
              <StatusBadge status={s} />
              <span className="font-medium">{leads.filter((c) => c.status === s).length}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="font-medium">Recently added</h2>
        {recent && recent.length > 0 ? (
          <ul className="mt-3 divide-y divide-neutral-100">
            {recent.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-4 py-2 text-sm">
                <Link href={`/admin/contacts/${c.id}`} className="font-medium hover:underline">
                  {c.name}
                  {c.company && <span className="font-normal text-neutral-500"> · {c.company}</span>}
                </Link>
                <span className="flex items-center gap-3 text-neutral-500">
                  <StatusBadge status={c.status} />
                  <span className="hidden sm:inline">{formatDate(c.created_at)}</span>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-neutral-500">No contacts yet. Add your first lead to get started.</p>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value, href }: { label: string; value: string; href?: string }) {
  const body = (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <p className="text-sm text-neutral-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
  return href ? (
    <Link href={href} className="block hover:opacity-90">
      {body}
    </Link>
  ) : (
    body
  );
}
