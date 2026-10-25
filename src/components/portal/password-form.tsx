"use client";

import { useFormState } from "react-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/admin/submit-button";
import { changePassword, type FormState } from "@/app/portal/(app)/actions";

export function PasswordForm() {
  const [state, formAction] = useFormState<FormState, FormData>(changePassword, {});
  return (
    <form action={formAction} className="space-y-4 rounded-xl border border-neutral-200 bg-white p-6">
      <h2 className="font-medium">Change password</h2>
      <div className="space-y-1.5">
        <Label htmlFor="password">New password</Label>
        <Input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="confirm">Repeat new password</Label>
        <Input id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={8} required />
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.ok && <p className="text-sm text-emerald-700">{state.ok}</p>}
      <SubmitButton pendingText="Saving…">Change password</SubmitButton>
    </form>
  );
}
