import { createClient } from "@/lib/supabase/server";
import { ProjectForm } from "@/components/admin/project-form";
import { createProject } from "../actions";

export default async function NewProjectPage({ searchParams }: { searchParams: { contact?: string } }) {
  const supabase = createClient();
  const { data } = await supabase
    .from("contacts")
    .select("id, name, company, kind")
    .order("kind", { ascending: true }) // "client" sorts before "lead"
    .order("name");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold">New project</h1>
      <ProjectForm
        action={createProject}
        contacts={data ?? []}
        defaultContactId={searchParams.contact}
        cancelHref={searchParams.contact ? `/admin/contacts/${searchParams.contact}` : "/admin/projects"}
      />
    </div>
  );
}
