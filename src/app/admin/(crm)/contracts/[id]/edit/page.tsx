import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ContractForm } from "@/components/admin/contract-form";
import type { Contract } from "@/lib/portal/types";
import { updateContract } from "../../actions";

export default async function EditContractPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data } = await supabase.from("contracts").select("*").eq("id", params.id).maybeSingle();
  if (!data) notFound();
  const contract = data as Contract;
  if (contract.status !== "draft") redirect(`/admin/contracts/${contract.id}`);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold">Edit contract</h1>
      <ContractForm
        action={updateContract.bind(null, contract.id)}
        defaults={{ title: contract.title, body: contract.body }}
        cancelHref={`/admin/contracts/${contract.id}`}
      />
    </div>
  );
}
