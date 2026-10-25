"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/admin/submit-button";
import type { FormState } from "@/app/portal/(app)/actions";

export function MilestoneResponse({ action }: { action: (prev: FormState, fd: FormData) => Promise<FormState> }) {
  const [state, formAction] = useFormState(action, {});
  const [mode, setMode] = useState<"choose" | "changes">("choose");

  if (state.ok) return <p className="mt-3 text-sm font-medium text-emerald-700">{state.ok}</p>;

  return (
    <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
      <p className="text-sm font-medium text-amber-900">This milestone is ready for your review.</p>
      {mode === "choose" ? (
        <div className="mt-3 flex flex-wrap gap-2">
          <form action={formAction}>
            <input type="hidden" name="decision" value="approve" />
            <SubmitButton size="sm" pendingText="Approving…">
              Approve
            </SubmitButton>
          </form>
          <Button size="sm" variant="outline" type="button" onClick={() => setMode("changes")}>
            Request changes
          </Button>
        </div>
      ) : (
        <form action={formAction} className="mt-3 space-y-2">
          <input type="hidden" name="decision" value="changes" />
          <Textarea
            name="feedback"
            rows={3}
            required
            placeholder="What would you like changed?"
            className="bg-white"
          />
          <div className="flex gap-2">
            <SubmitButton size="sm" pendingText="Sending…">
              Send feedback
            </SubmitButton>
            <Button size="sm" variant="outline" type="button" onClick={() => setMode("choose")}>
              Back
            </Button>
          </div>
        </form>
      )}
      {state.error && <p className="mt-2 text-sm text-red-600">{state.error}</p>}
    </div>
  );
}
