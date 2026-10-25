import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/delete-button";
import { Pill } from "@/components/shared/badges";
import { AcceptanceRecord } from "@/components/shared/acceptance-record";
import { formatDay, type Contract } from "@/lib/portal/types";
import { deleteContract, sendContract, withdrawContract } from "../actions";

export default async function AdminContractPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data } = await supabase
    .from("contracts")
    .select("*, contacts(id, name), projects(id, name)")
    .eq("id", params.id)
    .maybeSingle();
  if (!data) notFound();
  const contract = data as Contract & {
    contacts: { id: string; name: string } | null;
    projects: { id: string; name: string } | null;
  };

  const { count: portalUsers } = await supabase
    .from("client_users")
    .select("user_id", { count: "exact", head: true })
    .eq("contact_id", contract.contact_id);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/admin/contracts" className="text-sm text-neutral-500 hover:text-neutral-900">
        ← All contracts
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{contract.title}</h1>
          <p className="mt-1 text-sm text-neutral-600">
            {contract.contacts && (
              <Link href={`/admin/contacts/${contract.contacts.id}`} className="hover:underline">
                {contract.contacts.name}
              </Link>
            )}
            {contract.projects && (
              <>
                {" · "}
                <Link href={`/admin/projects/${contract.projects.id}`} className="hover:underline">
                  {contract.projects.name}
                </Link>
              </>
            )}
          </p>
          <div className="mt-2 flex items-center gap-3 text-sm text-neutral-600">
            <Pill value={contract.status} labels={{ sent: "Awaiting client" }} />
            {contract.sent_at && <span>Sent {formatDay(contract.sent_at)}</span>}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {contract.status === "draft" && (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/contracts/${contract.id}/edit`}>Edit</Link>
              </Button>
              <form action={sendContract.bind(null, contract.id)}>
                <Button type="submit" size="sm">
                  Send to client
                </Button>
              </form>
            </>
          )}
          {contract.status === "sent" && (
            <form action={withdrawContract.bind(null, contract.id)}>
              <Button type="submit" variant="outline" size="sm">
                Withdraw to draft
              </Button>
            </form>
          )}
          {contract.status !== "accepted" && (
            <DeleteButton
              action={deleteContract.bind(null, contract.id)}
              name={contract.title}
              message={`Delete the contract "${contract.title}"?`}
            />
          )}
        </div>
      </div>

      {contract.status !== "accepted" && !portalUsers && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          This client has no portal login yet, so they can&apos;t see or accept the contract. Create one from their{" "}
          {contract.contacts ? (
            <Link href={`/admin/contacts/${contract.contacts.id}`} className="underline">
              contact page
            </Link>
          ) : (
            "contact page"
          )}
          .
        </p>
      )}

      <AcceptanceRecord contract={contract} />

      <article className="whitespace-pre-wrap rounded-xl border border-neutral-200 bg-white p-6 text-sm leading-relaxed">
        {contract.body}
      </article>
    </div>
  );
}
