"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useFormState } from "react-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "./submit-button";
import { selectClass } from "./styles";

type State = { error?: string };

export function ContractForm({
  action,
  contacts,
  projects,
  defaults,
  cancelHref,
}: {
  action: (prev: State, formData: FormData) => Promise<State>;
  contacts?: { id: string; name: string; company: string | null }[];
  projects?: { id: string; name: string; contact_id: string }[];
  defaults: { title: string; body: string; contact_id?: string; project_id?: string };
  cancelHref: string;
}) {
  const [state, formAction] = useFormState(action, {});
  const [contactId, setContactId] = useState(defaults.contact_id ?? "");
  const clientProjects = useMemo(
    () => (projects ?? []).filter((p) => p.contact_id === contactId),
    [projects, contactId]
  );

  return (
    <form action={formAction} className="space-y-6 rounded-xl border border-neutral-200 bg-white p-6">
      {contacts && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="contact_id">Client *</Label>
            <select
              id="contact_id"
              name="contact_id"
              required
              className={selectClass}
              value={contactId}
              onChange={(e) => setContactId(e.target.value)}
            >
              <option value="" disabled>
                Choose a client…
              </option>
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                  {c.company ? ` · ${c.company}` : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="project_id">Project (optional)</Label>
            <select
              id="project_id"
              name="project_id"
              key={contactId}
              className={selectClass}
              defaultValue={clientProjects.some((p) => p.id === defaults.project_id) ? defaults.project_id : ""}
            >
              <option value="">—</option>
              {clientProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
      <div className="space-y-1.5">
        <Label htmlFor="title">Title *</Label>
        <Input id="title" name="title" required maxLength={200} defaultValue={defaults.title} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="body">Contract text *</Label>
        <Textarea id="body" name="body" rows={22} required defaultValue={defaults.body} className="font-mono text-xs leading-relaxed" />
        <p className="text-xs text-neutral-500">
          The client sees exactly this text. Fill in every [bracketed] part before sending.
        </p>
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <div className="flex gap-3">
        <SubmitButton pendingText="Saving…">Save draft</SubmitButton>
        <Button variant="outline" asChild>
          <Link href={cancelHref}>Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
