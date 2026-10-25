import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KindBadge, StatusBadge } from "@/components/admin/status-badge";
import { selectClass } from "@/components/admin/styles";
import {
  ALL_STATUSES,
  CONTACT_KINDS,
  formatMoney,
  label,
  statusesFor,
  type Contact,
  type ContactKind,
  type ContactStatus,
} from "@/lib/crm/types";

type Search = { kind?: string; status?: string; q?: string };

export default async function ContactsPage({ searchParams }: { searchParams: Search }) {
  const kind = CONTACT_KINDS.includes(searchParams.kind as ContactKind)
    ? (searchParams.kind as ContactKind)
    : undefined;
  const status = ALL_STATUSES.includes(searchParams.status as ContactStatus)
    ? (searchParams.status as ContactStatus)
    : undefined;
  const q = (searchParams.q ?? "").trim().slice(0, 100);

  const supabase = createClient();
  let query = supabase
    .from("contacts")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(200);
  if (kind) query = query.eq("kind", kind);
  if (status) query = query.eq("status", status);
  if (q) {
    // Strip characters that have meaning in PostgREST filter syntax
    const safe = q.replace(/[,()*%\\]/g, " ");
    query = query.or(
      `name.ilike.%${safe}%,company.ilike.%${safe}%,email.ilike.%${safe}%,phone.ilike.%${safe}%`
    );
  }
  const { data, error } = await query;
  const contacts = (data ?? []) as Contact[];

  const statusOptions = kind ? statusesFor(kind) : ALL_STATUSES;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Contacts</h1>
        <Button asChild>
          <Link href={`/admin/contacts/new${kind ? `?kind=${kind}` : ""}`}>Add contact</Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 text-sm">
        <Tab href="/admin/contacts" active={!kind}>
          All
        </Tab>
        <Tab href="/admin/contacts?kind=lead" active={kind === "lead"}>
          Leads
        </Tab>
        <Tab href="/admin/contacts?kind=client" active={kind === "client"}>
          Clients
        </Tab>
      </div>

      <form className="flex flex-wrap gap-3" action="/admin/contacts">
        {kind && <input type="hidden" name="kind" value={kind} />}
        <Input
          name="q"
          defaultValue={q}
          placeholder="Search name, company, email or phone"
          className="max-w-xs"
        />
        <select name="status" defaultValue={status ?? ""} className={`${selectClass} max-w-[180px]`}>
          <option value="">Any status</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {label(s)}
            </option>
          ))}
        </select>
        <Button type="submit" variant="outline">
          Filter
        </Button>
      </form>

      {error && <p className="text-sm text-red-600">Could not load contacts: {error.message}</p>}

      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">Contact</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">Source</th>
              <th className="px-4 py-3 font-medium text-right">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {contacts.map((c) => (
              <tr key={c.id} className="hover:bg-neutral-50">
                <td className="px-4 py-3">
                  <Link href={`/admin/contacts/${c.id}`} className="font-medium hover:underline">
                    {c.name}
                  </Link>
                  {c.company && <div className="text-neutral-500">{c.company}</div>}
                </td>
                <td className="px-4 py-3">
                  <KindBadge kind={c.kind} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={c.status} />
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-neutral-600">
                  {c.email && <div>{c.email}</div>}
                  {c.phone && <div>{c.phone}</div>}
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-neutral-600">
                  {c.source ? label(c.source) : "—"}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">{formatMoney(c.estimated_value)}</td>
              </tr>
            ))}
            {contacts.length === 0 && !error && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-neutral-500">
                  No contacts match.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Tab({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-1.5 ${
        active ? "bg-neutral-900 text-white" : "bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100"
      }`}
    >
      {children}
    </Link>
  );
}
