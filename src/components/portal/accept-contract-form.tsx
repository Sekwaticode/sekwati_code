"use client";

import { useFormState } from "react-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/admin/submit-button";
import type { FormState } from "@/app/portal/(app)/actions";

export function AcceptContractForm({
  action,
  defaultName,
}: {
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
  defaultName: string;
}) {
  const [state, formAction] = useFormState(action, {});
  if (state.ok) return null; // page re-renders with the acceptance record

  return (
    <form action={formAction} className="space-y-4 rounded-xl border border-neutral-200 bg-white p-6">
      <h2 className="font-medium">Accept this contract</h2>
      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" name="agree" className="mt-0.5 h-4 w-4" required />
        I have read this contract and agree to its terms.
      </label>
      <div className="max-w-sm space-y-1.5">
        <Label htmlFor="signer_name">Type your full name as your signature</Label>
        <Input id="signer_name" name="signer_name" required minLength={2} maxLength={200} defaultValue={defaultName} />
      </div>
      <p className="text-xs text-neutral-500">
        We record your name, the date and time, your IP address and a fingerprint of the contract text as proof of
        acceptance.
      </p>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <SubmitButton pendingText="Accepting…">Accept contract</SubmitButton>
    </form>
  );
}
