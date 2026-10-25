import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/shared/badges";
import { formatDay, type Contract } from "@/lib/portal/types";

type Row = Pick<Contract, "id" | "title" | "status" | "sent_at" | "accepted_at" | "created_at"> & {
  contacts: { name: string; company: string | null } | null;
  projects: { name: string } | null;
};

export default async function ContractsPage() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("contracts")
    .select("id, title, status, sent_at, accepted_at, created_at, contacts(name, company), projects(name)")
    .order("created_at", { ascending: false });
  const contracts = (data ?? []) as unknown as Row[];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Contracts</h1>
        <Button asChild>
          <Link href="/admin/contracts/new">New contract</Link>
        </Button>
      </div>

      {error && <p className="text-sm text-red-600">Could not load contracts: {error.message}</p>}

      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">Contract</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">Sent</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">Accepted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {contracts.map((c) => (
              <tr key={c.id} className="hover:bg-neutral-50">
                <td className="px-4 py-3">
                  <Link href={`/admin/contracts/${c.id}`} className="font-medium hover:underline">
                    {c.title}
                  </Link>
                  <div className="text-neutral-500">
                    {c.contacts?.name}
                    {c.projects ? ` · ${c.projects.name}` : ""}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Pill value={c.status} labels={{ sent: "Awaiting client" }} />
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-neutral-600">{formatDay(c.sent_at)}</td>
                <td className="px-4 py-3 hidden md:table-cell text-neutral-600">{formatDay(c.accepted_at)}</td>
              </tr>
            ))}
            {contracts.length === 0 && !error && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-neutral-500">
                  No contracts yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
