import Link from "next/link";
import { notFound } from "next/navigation";
import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/admin/submit-button";
import { DeleteButton } from "@/components/admin/delete-button";
import { Pill, ProgressBar } from "@/components/shared/badges";
import { ActionForm } from "@/components/shared/action-form";
import { AutoSubmitSelect } from "@/components/shared/auto-submit-select";
import { FileUpload } from "@/components/shared/file-upload";
import { DocumentList } from "@/components/shared/document-list";
import {
  MILESTONE_STATUSES,
  formatDay,
  humanize,
  milestoneProgress,
  type Contract,
  type DocumentRow,
  type Milestone,
  type Project,
  type RequestRow,
} from "@/lib/portal/types";
import { addMilestone, deleteMilestone, deleteProject, setMilestoneStatus } from "../actions";

const MILESTONE_LABELS: Record<string, string> = {
  awaiting_approval: "Ready for client approval",
};

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data } = await supabase
    .from("projects")
    .select("*, contacts(id, name, company)")
    .eq("id", params.id)
    .maybeSingle();
  if (!data) notFound();
  const project = data as Project & { contacts: { id: string; name: string; company: string | null } | null };

  const [milestonesRes, docsRes, requestsRes, contractsRes] = await Promise.all([
    supabase.from("milestones").select("*").eq("project_id", project.id).order("position"),
    supabase.from("documents").select("*").eq("project_id", project.id).order("created_at", { ascending: false }),
    supabase.from("requests").select("*").eq("project_id", project.id).order("created_at", { ascending: false }),
    supabase.from("contracts").select("id, title, status, accepted_at").eq("project_id", project.id),
  ]);
  const milestones = (milestonesRes.data ?? []) as Milestone[];
  const documents = (docsRes.data ?? []) as DocumentRow[];
  const requests = (requestsRes.data ?? []) as RequestRow[];
  const contracts = (contractsRes.data ?? []) as Pick<Contract, "id" | "title" | "status" | "accepted_at">[];

  return (
    <div className="space-y-6">
      <Link href="/admin/projects" className="text-sm text-neutral-500 hover:text-neutral-900">
        ← All projects
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{project.name}</h1>
          {project.contacts && (
            <Link href={`/admin/contacts/${project.contacts.id}`} className="text-neutral-500 hover:underline">
              {project.contacts.name}
              {project.contacts.company ? ` · ${project.contacts.company}` : ""}
            </Link>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-neutral-600">
            <Pill value={project.status} />
            <span>Start: {formatDay(project.start_date)}</span>
            <span>Due: {formatDay(project.due_date)}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/projects/${project.id}/edit`}>Edit</Link>
          </Button>
          <DeleteButton
            action={deleteProject.bind(null, project.id)}
            name={project.name}
            message={`Delete "${project.name}" with all its milestones and files? This can't be undone.`}
          />
        </div>
      </div>

      {project.description && (
        <p className="whitespace-pre-wrap rounded-xl border border-neutral-200 bg-white p-6 text-sm text-neutral-700">
          {project.description}
        </p>
      )}

      <section className="rounded-xl border border-neutral-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-medium">Milestones</h2>
          <div className="w-full max-w-xs">
            <ProgressBar percent={milestoneProgress(milestones)} />
          </div>
        </div>
        <p className="mt-1 text-xs text-neutral-500">
          Set a milestone to &quot;Ready for client approval&quot; and the client can approve it or ask for changes in
          their portal.
        </p>

        <ol className="mt-4 divide-y divide-neutral-100">
          {milestones.map((m, i) => (
            <li key={m.id} className="flex flex-wrap items-start justify-between gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="font-medium">
                  <span className="text-neutral-400">{i + 1}.</span> {m.title}
                </p>
                {m.description && <p className="mt-0.5 text-sm text-neutral-600">{m.description}</p>}
                <p className="mt-1 text-xs text-neutral-500">
                  Due {formatDay(m.due_date)}
                  {m.responded_at && ` · client responded ${formatDay(m.responded_at)}`}
                </p>
                {m.client_feedback && (
                  <p className="mt-2 rounded-md bg-red-50 p-2 text-sm text-red-900">
                    <span className="font-medium">Client feedback:</span> {m.client_feedback}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <form action={setMilestoneStatus.bind(null, project.id, m.id)}>
                  <AutoSubmitSelect
                    name="status"
                    label={`Status of ${m.title}`}
                    defaultValue={m.status}
                    className="w-[210px]"
                    options={MILESTONE_STATUSES.map((s) => ({ value: s, label: MILESTONE_LABELS[s] ?? humanize(s) }))}
                  />
                </form>
                <form action={deleteMilestone.bind(null, project.id, m.id)}>
                  <button
                    type="submit"
                    className="rounded p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600"
                    aria-label={`Delete milestone ${m.title}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </li>
          ))}
          {milestones.length === 0 && <li className="py-3 text-sm text-neutral-500">No milestones yet.</li>}
        </ol>

        <ActionForm
          action={addMilestone.bind(null, project.id)}
          resetOnSuccess
          className="mt-4 space-y-3 rounded-lg bg-neutral-50 p-4"
        >
          <p className="text-sm font-medium">Add milestone</p>
          <div className="flex flex-wrap gap-3">
            <Input name="title" placeholder="Title" required className="max-w-xs bg-white" />
            <Input name="due_date" type="date" className="max-w-[170px] bg-white" aria-label="Due date" />
          </div>
          <Textarea name="description" rows={2} placeholder="Description (optional)" className="bg-white" />
          <SubmitButton size="sm" pendingText="Adding…">
            Add milestone
          </SubmitButton>
        </ActionForm>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="font-medium">Files</h2>
          <div className="mt-4">
            <FileUpload projectId={project.id} />
          </div>
          <div className="mt-4">
            <DocumentList documents={documents} canDelete viewer="staff" />
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-xl border border-neutral-200 bg-white p-6">
            <h2 className="font-medium">Requests</h2>
            <ul className="mt-3 divide-y divide-neutral-100">
              {requests.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                  <Link href={`/admin/requests/${r.id}`} className="hover:underline">
                    <span className="text-neutral-500">{humanize(r.type)}:</span> {r.title}
                  </Link>
                  <Pill value={r.status} />
                </li>
              ))}
              {requests.length === 0 && <li className="py-2 text-sm text-neutral-500">No requests.</li>}
            </ul>
          </section>

          <section className="rounded-xl border border-neutral-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">Contracts</h2>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/contracts/new?project=${project.id}`}>New contract</Link>
              </Button>
            </div>
            <ul className="mt-3 divide-y divide-neutral-100">
              {contracts.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                  <Link href={`/admin/contracts/${c.id}`} className="hover:underline">
                    {c.title}
                  </Link>
                  <Pill value={c.status} />
                </li>
              ))}
              {contracts.length === 0 && <li className="py-2 text-sm text-neutral-500">No contracts.</li>}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
