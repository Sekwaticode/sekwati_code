"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "./submit-button";
import { selectClass } from "./styles";
import { PROJECT_STATUSES, humanize, type Project } from "@/lib/portal/types";

type State = { error?: string };

export function ProjectForm({
  action,
  project,
  contacts,
  defaultContactId,
  cancelHref,
}: {
  action: (prev: State, formData: FormData) => Promise<State>;
  project?: Project;
  contacts?: { id: string; name: string; company: string | null; kind: string }[];
  defaultContactId?: string;
  cancelHref: string;
}) {
  const [state, formAction] = useFormState(action, {});

  return (
    <form action={formAction} className="space-y-6 rounded-xl border border-neutral-200 bg-white p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {contacts && (
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="contact_id">Client *</Label>
            <select
              id="contact_id"
              name="contact_id"
              required
              className={selectClass}
              defaultValue={defaultContactId ?? ""}
            >
              <option value="" disabled>
                Choose a client…
              </option>
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                  {c.company ? ` · ${c.company}` : ""}
                  {c.kind === "lead" ? " (lead)" : ""}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="name">Project name *</Label>
          <Input id="name" name="name" required maxLength={200} defaultValue={project?.name} placeholder="e.g. Business website" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="status">Status</Label>
          <select id="status" name="status" className={selectClass} defaultValue={project?.status ?? "planning"}>
            {PROJECT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {humanize(s)}
              </option>
            ))}
          </select>
        </div>
        <div />
        <div className="space-y-1.5">
          <Label htmlFor="start_date">Start date</Label>
          <Input id="start_date" name="start_date" type="date" defaultValue={project?.start_date ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="due_date">Due date</Label>
          <Input id="due_date" name="due_date" type="date" defaultValue={project?.due_date ?? ""} />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="description">Description (visible to the client)</Label>
        <Textarea id="description" name="description" rows={4} defaultValue={project?.description ?? ""} />
      </div>
      {!project && (
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="default_milestones" defaultChecked className="h-4 w-4" />
          Add standard website milestones (Discovery, Design, Development, Review, Launch)
        </label>
      )}

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <div className="flex gap-3">
        <SubmitButton pendingText="Saving…">{project ? "Save changes" : "Create project"}</SubmitButton>
        <Button variant="outline" asChild>
          <Link href={cancelHref}>Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
