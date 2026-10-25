"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "./submit-button";
import type { PortalState } from "@/app/admin/(crm)/contacts/portal-actions";

type Action = (prev: PortalState, formData: FormData) => Promise<PortalState>;

export function CreateLoginForm({ action, defaultEmail }: { action: Action; defaultEmail: string }) {
  const [state, formAction] = useFormState(action, {});
  if (state.password) return <NewPassword state={state} />;
  return (
    <form action={formAction} className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <Input name="email" type="email" required defaultValue={defaultEmail} placeholder="client@email.com" className="max-w-xs" />
        <SubmitButton size="sm" pendingText="Creating…" className="h-10">
          Create portal login
        </SubmitButton>
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
    </form>
  );
}

export function ResetPasswordButton({ action }: { action: Action }) {
  const [state, formAction] = useFormState(action, {});
  return (
    <div>
      <form
        action={formAction}
        onSubmit={(e) => {
          if (!confirm("Reset this client's password? Their old password stops working.")) e.preventDefault();
        }}
      >
        <SubmitButton size="sm" variant="outline" pendingText="Resetting…">
          Reset password
        </SubmitButton>
      </form>
      {state.error && <p className="mt-2 text-sm text-red-600">{state.error}</p>}
      {state.password && <NewPassword state={state} />}
    </div>
  );
}

function NewPassword({ state }: { state: PortalState }) {
  const [copied, setCopied] = useState(false);
  const portalUrl = typeof window !== "undefined" ? `${window.location.origin}/portal` : "/portal";
  const message = `Hi! Your Sekwaticode client portal is ready.\n\nLog in: ${portalUrl}\nEmail: ${state.email}\nTemporary password: ${state.password}\n\nPlease change your password after logging in (Account page).`;

  return (
    <div className="mt-3 space-y-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm">
      <p className="font-medium text-emerald-900">Login ready. Send these details to the client. The password won&apos;t be shown again.</p>
      <pre className="whitespace-pre-wrap rounded bg-white p-3 font-mono text-xs">{message}</pre>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={async () => {
          await navigator.clipboard.writeText(message);
          setCopied(true);
        }}
      >
        {copied ? "Copied" : "Copy message"}
      </Button>
    </div>
  );
}
