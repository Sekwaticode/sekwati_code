import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProjectForm } from "@/components/admin/project-form";
import type { Project } from "@/lib/portal/types";
import { updateProject } from "../../actions";

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data } = await supabase.from("projects").select("*").eq("id", params.id).maybeSingle();
  if (!data) notFound();
  const project = data as Project;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold">Edit {project.name}</h1>
      <ProjectForm
        action={updateProject.bind(null, project.id)}
        project={project}
        cancelHref={`/admin/projects/${project.id}`}
      />
    </div>
  );
}
