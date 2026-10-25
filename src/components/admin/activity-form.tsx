"use client";

import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "./submit-button";
import { selectClass } from "./styles";
import { ACTIVITY_TYPES, label } from "@/lib/crm/types";
import type { FormState } from "@/app/admin/(crm)/contacts/actions";

export function ActivityForm({
  action,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
}) {
  const [state, formAction] = useFormState(action, {});
  const formRef = useRef<HTMLFormElement>(null);
  const submitted = useRef(false);

  // Clear the box after a successful save
  useEffect(() => {
    if (submitted.current && !state.error) formRef.current?.reset();
    submitted.current = false;
  }, [state]);

  return (
    <form
      ref={formRef}
      action={(fd) => {
        submitted.current = true;
        formAction(fd);
      }}
      className="space-y-3"
    >
      <div className="flex gap-3">
        <select name="type" className={`${selectClass} max-w-[150px]`} defaultValue="note">
          {ACTIVITY_TYPES.map((t) => (
            <option key={t} value={t}>
              {t === "whatsapp" ? "WhatsApp" : label(t)}
            </option>
          ))}
        </select>
      </div>
      <Textarea name="body" rows={3} placeholder="What happened? e.g. Called, sent quote for 5-page site" required />
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <SubmitButton size="sm" pendingText="Adding…">
        Add to log
      </SubmitButton>
    </form>
  );
}
