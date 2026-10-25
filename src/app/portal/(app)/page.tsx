import Link from "next/link";
import { getClientProfile } from "@/lib/auth";
import { Pill, ProgressBar } from "@/components/shared/badges";
import {
  formatDay,
  milestoneProgress,
  type Contract,
  type MilestoneStatus,
  type Project,
  type RequestRow,
} from "@/lib/portal/types";

type ProjectRow = Pick<Project, "id" | "name" | "status" | "due_date"> & {
  milestones: { id: string; title: string; status: MilestoneStatus }[];
};

export default async function PortalHome() {
  const { supabase, profile } = await getClientProfile();
  if (!profile) return null;

  const [projectsRes, contractsRes, requestsRes] = await Promise.all([
    supabase
      .from("projects")
      .select("id, name, status, due_date, milestones(id, title, status)")
      .order("created_at", { ascending: false }),
    supabase.from("contracts").select("id, title, status, sent_at").eq("status", "sent"),
    supabase.from("requests").select("id, title, status").in("status", ["open", "in_progress"]),
  ]);
  const projects = (projectsRes.data ?? []) as ProjectRow[];
  const pendingContracts = (contractsRes.data ?? []) as Pick<Contract, "id" | "title" | "status" | "sent_at">[];
  const openRequests = (requestsRes.data ?? []) as Pick<RequestRow, "id" | "title" | "status">[];

  const approvals = projects.flatMap((p) =>
    p.milestones.filter((m) => m.status === "awaiting_approval").map((m) => ({ ...m, project: p }))
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Welcome, {profile.name.split(" ")[0]}</h1>
        {profile.company && <p className="text-neutral-500">{profile.company}</p>}
      </div>

      {(approvals.length > 0 || pendingContracts.length > 0) && (
        <section className="rounded-xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="font-medium text-amber-900">Waiting for you</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {pendingContracts.map((c) => (
              <li key={c.id}>
                <Link href={`/portal/contracts/${c.id}`} className="font-medium text-amber-900 underline">
                  Review and accept: {c.title}
                </Link>
              </li>
            ))}
            {approvals.map((m) => (
              <li key={m.id}>
                <Link href={`/portal/projects/${m.project.id}#m-${m.id}`} className="font-medium text-amber-900 underline">
                  Approve milestone: {m.title}
                </Link>{" "}
                <span className="text-amber-800">({m.project.name})</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="space-y-4">
        <h2 className="font-medium">Your projects</h2>
        {projects.length === 0 && (
          <p className="rounded-xl border border-neutral-200 bg-white p-6 text-sm text-neutral-500">
            No projects yet. We&apos;ll add yours here as soon as it starts.
          </p>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((p) => (
            <Link
              key={p.id}
              href={`/portal/projects/${p.id}`}
              className="block rounded-xl border border-neutral-200 bg-white p-5 transition hover:border-neutral-300 hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-medium">{p.name}</p>
                <Pill value={p.status} />
              </div>
              <div className="mt-4">
                <ProgressBar percent={milestoneProgress(p.milestones)} />
              </div>
              <p className="mt-2 text-xs text-neutral-500">
                {p.milestones.filter((m) => m.status === "approved").length} of {p.milestones.length} milestones
                done · Due {formatDay(p.due_date)}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-neutral-200 bg-white p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-medium">Open requests</h2>
          <Link href="/portal/requests/new" className="text-sm font-medium text-indigo-700 hover:underline">
            New request
          </Link>
        </div>
        <ul className="mt-3 divide-y divide-neutral-100">
          {openRequests.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-3 py-2 text-sm">
              <Link href={`/portal/requests/${r.id}`} className="hover:underline">
                {r.title}
              </Link>
              <Pill value={r.status} />
            </li>
          ))}
          {openRequests.length === 0 && <li className="py-2 text-sm text-neutral-500">Nothing open.</li>}
        </ul>
      </section>
    </div>
  );
}
