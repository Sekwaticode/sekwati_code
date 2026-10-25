"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "./submit-button";
import { SOURCES, label, statusesFor, type Contact, type ContactKind } from "@/lib/crm/types";
import type { FormState } from "@/app/admin/(crm)/contacts/actions";
import { selectClass } from "./styles";

type Props = {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  contact?: Contact;
  defaultKind?: ContactKind;
  cancelHref: string;
};

export function ContactForm({ action, contact, defaultKind = "lead", cancelHref }: Props) {
  const [state, formAction] = useFormState(action, {});
  const [kind, setKind] = useState<ContactKind>(contact?.kind ?? defaultKind);
  const statuses = statusesFor(kind);

  return (
    <form action={formAction} className="space-y-6 rounded-xl border border-neutral-200 bg-white p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Type" htmlFor="kind">
          <select
            id="kind"
            name="kind"
            className={selectClass}
            value={kind}
            onChange={(e) => setKind(e.target.value as ContactKind)}
          >
            <option value="lead">Lead</option>
            <option value="client">Client</option>
          </select>
        </Field>
        <Field label="Status" htmlFor="status">
          <select
            id="status"
            name="status"
            key={kind}
            className={selectClass}
            defaultValue={contact && statuses.includes(contact.status) ? contact.status : statuses[0]}
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {label(s)}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Name *" htmlFor="name">
          <Input id="name" name="name" required maxLength={200} defaultValue={contact?.name} />
        </Field>
        <Field label="Company" htmlFor="company">
          <Input id="company" name="company" defaultValue={contact?.company ?? ""} />
        </Field>
        <Field label="Email" htmlFor="email">
          <Input id="email" name="email" type="email" defaultValue={contact?.email ?? ""} />
        </Field>
        <Field label="Phone / WhatsApp" htmlFor="phone">
          <Input id="phone" name="phone" type="tel" defaultValue={contact?.phone ?? ""} />
        </Field>
        <Field label="Source" htmlFor="source">
          <select id="source" name="source" className={selectClass} defaultValue={contact?.source ?? ""}>
            <option value="">—</option>
            {SOURCES.map((s) => (
              <option key={s} value={s}>
                {label(s)}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Service interest" htmlFor="service_interest">
          <Input
            id="service_interest"
            name="service_interest"
            placeholder="e.g. E-commerce site"
            defaultValue={contact?.service_interest ?? ""}
          />
        </Field>
        <Field label="Estimated value (R)" htmlFor="estimated_value">
          <Input
            id="estimated_value"
            name="estimated_value"
            inputMode="decimal"
            placeholder="10000"
            defaultValue={contact?.estimated_value ?? ""}
          />
        </Field>
      </div>
      <Field label="Notes" htmlFor="notes">
        <Textarea id="notes" name="notes" rows={4} defaultValue={contact?.notes ?? ""} />
      </Field>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <div className="flex gap-3">
        <SubmitButton pendingText="Saving…">{contact ? "Save changes" : "Create contact"}</SubmitButton>
        <Button variant="outline" asChild>
          <Link href={cancelHref}>Cancel</Link>
        </Button>
      </div>
    </form>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}
