import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Pill, ProgressBar } from "@/components/shared/badges";
import { formatDay, milestoneProgress, type MilestoneStatus, type ProjectStatus } from "@/lib/portal/types";

type Row = {
  id: string;
  name: string;
  status: ProjectStatus;
  due_date: string | null;
  contacts: { id: string; name: string; company: string | null } | null;
  milestones: { status: MilestoneStatus }[];
};

export default async function ProjectsPage() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("id, name, status, due_date, contacts(id, name, company), milestones(status)")
    .order("updated_at", { ascending: false });
  const projects = (data ?? []) as unknown as Row[];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <Button asChild>
          <Link href="/admin/projects/new">New project</Link>
        </Button>
      </div>

      {error && <p className="text-sm text-red-600">Could not load projects: {error.message}</p>}

      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">Project</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium min-w-[160px]">Progress</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">Due</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {projects.map((p) => {
              const waiting = p.milestones.filter((m) => m.status === "changes_requested").length;
              return (
                <tr key={p.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/projects/${p.id}`} className="font-medium hover:underline">
                      {p.name}
                    </Link>
                    {p.contacts && (
                      <div className="text-neutral-500">
                        {p.contacts.name}
                        {p.contacts.company ? ` · ${p.contacts.company}` : ""}
                      </div>
                    )}
                    {waiting > 0 && (
                      <div className="mt-1 text-xs font-medium text-red-700">Client requested changes</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Pill value={p.status} />
                  </td>
                  <td className="px-4 py-3">
                    <ProgressBar percent={milestoneProgress(p.milestones)} />
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-neutral-600">{formatDay(p.due_date)}</td>
                </tr>
              );
            })}
            {projects.length === 0 && !error && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-neutral-500">
                  No projects yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
