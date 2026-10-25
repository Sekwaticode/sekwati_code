import Link from "next/link";
import { notFound } from "next/navigation";
import { getClientProfile } from "@/lib/auth";
import { Pill } from "@/components/shared/badges";
import { AcceptanceRecord } from "@/components/shared/acceptance-record";
import { AcceptContractForm } from "@/components/portal/accept-contract-form";
import { formatDay, type Contract } from "@/lib/portal/types";
import { acceptContract } from "../../actions";

export default async function PortalContractPage({ params }: { params: { id: string } }) {
  const { supabase, profile } = await getClientProfile();
  if (!profile) return null;

  const { data } = await supabase.from("contracts").select("*").eq("id", params.id).maybeSingle();
  if (!data) notFound();
  const contract = data as Contract;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/portal" className="text-sm text-neutral-500 hover:text-neutral-900">
        ← Back
      </Link>
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold">{contract.title}</h1>
          <Pill value={contract.status} labels={{ sent: "Awaiting your acceptance" }} />
        </div>
        {contract.sent_at && <p className="mt-1 text-sm text-neutral-500">Sent {formatDay(contract.sent_at)}</p>}
      </div>

      <AcceptanceRecord contract={contract} />

      <article className="whitespace-pre-wrap rounded-xl border border-neutral-200 bg-white p-6 text-sm leading-relaxed">
        {contract.body}
      </article>

      {contract.status === "sent" && (
        <AcceptContractForm action={acceptContract.bind(null, contract.id)} defaultName={profile.name} />
      )}
    </div>
  );
}
