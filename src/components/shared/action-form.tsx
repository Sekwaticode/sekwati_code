"use client";

import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";

type State = { error?: string };

/** A form bound to a server action that returns { error? }. Shows the error and optionally resets on success. */
export function ActionForm({
  action,
  resetOnSuccess = false,
  className,
  children,
}: {
  action: (prev: State, formData: FormData) => Promise<State>;
  resetOnSuccess?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const [state, formAction] = useFormState(action, {});
  const formRef = useRef<HTMLFormElement>(null);
  const submitted = useRef(false);

  useEffect(() => {
    if (resetOnSuccess && submitted.current && !state.error) formRef.current?.reset();
    submitted.current = false;
  }, [state, resetOnSuccess]);

  return (
    <form
      ref={formRef}
      className={className}
      action={(fd) => {
        submitted.current = true;
        formAction(fd);
      }}
    >
      {children}
      {state.error && <p className="mt-2 text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
