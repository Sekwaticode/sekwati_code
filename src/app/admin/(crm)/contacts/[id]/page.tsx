import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { KindBadge, StatusBadge } from "@/components/admin/status-badge";
import { ActivityForm } from "@/components/admin/activity-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { formatDate, formatMoney, label, type Activity, type Contact } from "@/lib/crm/types";
import { addActivity, convertToClient, deleteContact } from "../actions";
import { createPortalLogin, removePortalLogin, resetPortalPassword } from "../portal-actions";
import { CreateLoginForm, ResetPasswordButton } from "@/components/admin/portal-access";
import { Pill } from "@/components/shared/badges";
import { formatDay, type Project } from "@/lib/portal/types";

export default async function ContactPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data } = await supabase.from("contacts").select("*").eq("id", params.id).maybeSingle();
  if (!data) notFound();
  const contact = data as Contact;

  const { data: activityData } = await supabase
    .from("activities")
    .select("*")
    .eq("contact_id", contact.id)
    .order("created_at", { ascending: false });
  const activities = (activityData ?? []) as Activity[];

  const [{ data: projectData }, { data: loginData }, { count: contractCount }] = await Promise.all([
    supabase
      .from("projects")
      .select("id, name, status, due_date")
      .eq("contact_id", contact.id)
      .order("created_at", { ascending: false }),
    supabase.from("client_users").select("user_id, email, created_at").eq("contact_id", contact.id),
    supabase.from("contracts").select("id", { count: "exact", head: true }).eq("contact_id", contact.id),
  ]);
  const projects = (projectData ?? []) as Pick<Project, "id" | "name" | "status" | "due_date">[];
  const logins = (loginData ?? []) as { user_id: string; email: string | null; created_at: string }[];

  const whatsappNumber = contact.phone?.replace(/\D/g, "").replace(/^0/, "27");

  return (
    <div className="space-y-6">
      <Link href="/admin/contacts" className="text-sm text-neutral-500 hover:text-neutral-900">
        ← All contacts
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{contact.name}</h1>
          {contact.company && <p className="text-neutral-500">{contact.company}</p>}
          <div className="mt-2 flex gap-2">
            <KindBadge kind={contact.kind} />
            <StatusBadge status={contact.status} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {contact.kind === "lead" && (
            <form action={convertToClient.bind(null, contact.id)}>
              <Button type="submit" size="sm">
                Convert to client
              </Button>
            </form>
          )}
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/contacts/${contact.id}/edit`}>Edit</Link>
          </Button>
          {projects.length === 0 && !contractCount ? (
            <DeleteButton action={deleteContact.bind(null, contact.id)} name={contact.name} />
          ) : (
            <span className="self-center text-xs text-neutral-400" title="Delete their projects and contracts first">
              Has projects/contracts
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-xl border border-neutral-200 bg-white p-6 lg:col-span-1">
          <h2 className="font-medium">Details</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <Detail term="Email">
              {contact.email ? (
                <a href={`mailto:${contact.email}`} className="hover:underline">
                  {contact.email}
                </a>
              ) : (
                "—"
              )}
            </Detail>
            <Detail term="Phone">
              {contact.phone ? (
                <span className="flex flex-wrap gap-x-3">
                  <a href={`tel:${contact.phone}`} className="hover:underline">
                    {contact.phone}
                  </a>
                  {whatsappNumber && (
                    <a
                      href={`https://wa.me/${whatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:underline"
                    >
                      WhatsApp
                    </a>
                  )}
                </span>
              ) : (
                "—"
              )}
            </Detail>
            <Detail term="Source">{contact.source ? label(contact.source) : "—"}</Detail>
            <Detail term="Service interest">{contact.service_interest ?? "—"}</Detail>
            <Detail term="Estimated value">{formatMoney(contact.estimated_value)}</Detail>
            <Detail term="Added">{formatDate(contact.created_at)}</Detail>
            <Detail term="Last updated">{formatDate(contact.updated_at)}</Detail>
          </dl>
          {contact.notes && (
            <div className="mt-6">
              <h3 className="text-sm font-medium">Notes</h3>
              <p className="mt-1 whitespace-pre-wrap text-sm text-neutral-700">{contact.notes}</p>
            </div>
          )}
        </section>

        <div className="space-y-6 lg:col-span-2">
        <section className="rounded-xl border border-neutral-200 bg-white p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-medium">Projects</h2>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/projects/new?contact=${contact.id}`}>New project</Link>
            </Button>
          </div>
          <ul className="mt-3 divide-y divide-neutral-100">
            {projects.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                <Link href={`/admin/projects/${p.id}`} className="font-medium hover:underline">
                  {p.name}
                </Link>
                <span className="flex items-center gap-3 text-neutral-500">
                  <span className="hidden sm:inline">Due {formatDay(p.due_date)}</span>
                  <Pill value={p.status} />
                </span>
              </li>
            ))}
            {projects.length === 0 && <li className="py-2 text-sm text-neutral-500">No projects yet.</li>}
          </ul>
        </section>

        <section className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="font-medium">Client portal access</h2>
          <p className="mt-1 text-sm text-neutral-500">
            A portal login lets this client follow their projects, approve milestones, upload files, raise requests
            and accept contracts at <span className="font-mono">/portal</span>.
          </p>
          {logins.length > 0 && (
            <ul className="mt-4 space-y-3">
              {logins.map((l) => (
                <li key={l.user_id} className="rounded-lg border border-neutral-200 p-3 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">{l.email ?? "Login"}</p>
                      <p className="text-xs text-neutral-500">Created {formatDay(l.created_at)}</p>
                    </div>
                    <div className="flex flex-wrap items-start gap-2">
                      <ResetPasswordButton action={resetPortalPassword.bind(null, contact.id, l.user_id)} />
                      <DeleteButton
                        action={removePortalLogin.bind(null, contact.id, l.user_id)}
                        name={l.email ?? "this login"}
                        label="Remove"
                        message={`Remove portal access for ${l.email ?? "this login"}? They won't be able to log in any more.`}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4">
            <CreateLoginForm
              action={createPortalLogin.bind(null, contact.id)}
              defaultEmail={logins.length === 0 ? contact.email ?? "" : ""}
            />
          </div>
        </section>

        <section className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="font-medium">Activity log</h2>
          <div className="mt-4">
            <ActivityForm action={addActivity.bind(null, contact.id)} />
          </div>
          <ol className="mt-6 space-y-4">
            {activities.map((a) => (
              <li key={a.id} className="border-l-2 border-neutral-200 pl-4">
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <span className="font-medium uppercase tracking-wide text-neutral-700">
                    {a.type === "whatsapp" ? "WhatsApp" : label(a.type)}
                  </span>
                  <span>·</span>
                  <span>{formatDate(a.created_at)}</span>
                </div>
                <p className="mt-1 whitespace-pre-wrap text-sm">{a.body}</p>
              </li>
            ))}
            {activities.length === 0 && (
              <li className="text-sm text-neutral-500">Nothing logged yet.</li>
            )}
          </ol>
        </section>
        </div>
      </div>
    </div>
  );
}

function Detail({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-neutral-500">{term}</dt>
      <dd className="mt-0.5 break-words">{children}</dd>
    </div>
  );
}
