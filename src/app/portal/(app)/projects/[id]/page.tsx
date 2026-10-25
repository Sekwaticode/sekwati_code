import Link from "next/link";
import { notFound } from "next/navigation";
import { getClientProfile } from "@/lib/auth";
import { Pill, ProgressBar } from "@/components/shared/badges";
import { FileUpload } from "@/components/shared/file-upload";
import { DocumentList } from "@/components/shared/document-list";
import { MilestoneResponse } from "@/components/portal/milestone-response";
import {
  formatDay,
  milestoneProgress,
  type Contract,
  type DocumentRow,
  type Milestone,
  type Project,
  type RequestRow,
} from "@/lib/portal/types";
import { respondToMilestone } from "../../actions";

const CLIENT_MILESTONE_LABELS: Record<string, string> = {
  pending: "Not started",
  awaiting_approval: "Needs your approval",
  changes_requested: "Changes requested",
};

export default async function PortalProjectPage({ params }: { params: { id: string } }) {
  const { supabase, profile } = await getClientProfile();
  if (!profile) return null;

  const { data } = await supabase.from("projects").select("*").eq("id", params.id).maybeSingle();
  if (!data) notFound();
  const project = data as Project;

  const [milestonesRes, docsRes, requestsRes, contractsRes] = await Promise.all([
    supabase.from("milestones").select("*").eq("project_id", project.id).order("position"),
    supabase.from("documents").select("*").eq("project_id", project.id).order("created_at", { ascending: false }),
    supabase.from("requests").select("id, title, type, status").eq("project_id", project.id).order("created_at", { ascending: false }),
    supabase.from("contracts").select("id, title, status").eq("project_id", project.id),
  ]);
  const milestones = (milestonesRes.data ?? []) as Milestone[];
  const documents = (docsRes.data ?? []) as DocumentRow[];
  const requests = (requestsRes.data ?? []) as Pick<RequestRow, "id" | "title" | "type" | "status">[];
  const contracts = (contractsRes.data ?? []) as Pick<Contract, "id" | "title" | "status">[];

  return (
    <div className="space-y-6">
      <Link href="/portal" className="text-sm text-neutral-500 hover:text-neutral-900">
        ← All projects
      </Link>

      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold">{project.name}</h1>
          <Pill value={project.status} />
        </div>
        <p className="mt-1 text-sm text-neutral-600">
          Started {formatDay(project.start_date)} · Due {formatDay(project.due_date)}
        </p>
        {project.description && (
          <p className="mt-3 max-w-2xl whitespace-pre-wrap text-sm text-neutral-700">{project.description}</p>
        )}
      </div>

      <section className="rounded-xl border border-neutral-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-medium">Progress</h2>
          <div className="w-full max-w-xs">
            <ProgressBar percent={milestoneProgress(milestones)} />
          </div>
        </div>
        <ol className="mt-4 space-y-4">
          {milestones.map((m, i) => (
            <li key={m.id} id={`m-${m.id}`} className="flex gap-4">
              <span
                className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  m.status === "approved" ? "bg-emerald-500 text-white" : "bg-neutral-200 text-neutral-700"
                }`}
              >
                {m.status === "approved" ? "✓" : i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{m.title}</p>
                  <Pill value={m.status} labels={CLIENT_MILESTONE_LABELS} />
                </div>
                {m.description && <p className="mt-0.5 text-sm text-neutral-600">{m.description}</p>}
                {m.due_date && <p className="mt-0.5 text-xs text-neutral-500">Target {formatDay(m.due_date)}</p>}
                {m.status === "changes_requested" && m.client_feedback && (
                  <p className="mt-2 rounded-md bg-neutral-50 p-2 text-sm text-neutral-700">
                    <span className="font-medium">Your feedback:</span> {m.client_feedback}
                  </p>
                )}
                {m.status === "awaiting_approval" && (
                  <MilestoneResponse action={respondToMilestone.bind(null, project.id, m.id)} />
                )}
              </div>
            </li>
          ))}
          {milestones.length === 0 && <li className="text-sm text-neutral-500">Milestones will appear here soon.</li>}
        </ol>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="font-medium">Files</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Upload your text, images, logo and anything else we need for the site.
          </p>
          <div className="mt-4">
            <FileUpload projectId={project.id} />
          </div>
          <div className="mt-4">
            <DocumentList documents={documents} viewer="client" />
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-xl border border-neutral-200 bg-white p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-medium">Requests</h2>
              <Link
                href={`/portal/requests/new?project=${project.id}`}
                className="text-sm font-medium text-indigo-700 hover:underline"
              >
                New request
              </Link>
            </div>
            <ul className="mt-3 divide-y divide-neutral-100">
              {requests.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                  <Link href={`/portal/requests/${r.id}`} className="hover:underline">
                    {r.title}
                  </Link>
                  <Pill value={r.status} />
                </li>
              ))}
              {requests.length === 0 && <li className="py-2 text-sm text-neutral-500">No requests yet.</li>}
            </ul>
          </section>

          {contracts.length > 0 && (
            <section className="rounded-xl border border-neutral-200 bg-white p-6">
              <h2 className="font-medium">Contracts</h2>
              <ul className="mt-3 divide-y divide-neutral-100">
                {contracts.map((c) => (
                  <li key={c.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                    <Link href={`/portal/contracts/${c.id}`} className="hover:underline">
                      {c.title}
                    </Link>
                    <Pill value={c.status} labels={{ sent: "Awaiting your acceptance" }} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
