import { createClient } from "@/lib/supabase/server";
import { ContractForm } from "@/components/admin/contract-form";
import { CONTRACT_TEMPLATE } from "@/lib/portal/contract-template";
import { createContract } from "../actions";

export default async function NewContractPage({
  searchParams,
}: {
  searchParams: { contact?: string; project?: string };
}) {
  const supabase = createClient();
  const [{ data: contacts }, { data: projects }] = await Promise.all([
    supabase.from("contacts").select("id, name, company").order("name"),
    supabase.from("projects").select("id, name, contact_id").order("name"),
  ]);

  const fromProject = projects?.find((p) => p.id === searchParams.project);
  const contactId = fromProject?.contact_id ?? searchParams.contact;
  const contactName = contacts?.find((c) => c.id === contactId)?.name;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold">New contract</h1>
      <ContractForm
        action={createContract}
        contacts={contacts ?? []}
        projects={projects ?? []}
        defaults={{
          title: fromProject ? `Agreement: ${fromProject.name}` : "Website development agreement",
          body: contactName ? CONTRACT_TEMPLATE.replace("[Client name / company]", contactName) : CONTRACT_TEMPLATE,
          contact_id: contactId,
          project_id: fromProject?.id,
        }}
        cancelHref={fromProject ? `/admin/projects/${fromProject.id}` : "/admin/contracts"}
      />
    </div>
  );
}
