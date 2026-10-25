"use client";

import { Button } from "@/components/ui/button";

export function DeleteButton({
  action,
  name,
  message,
  label = "Delete",
}: {
  action: () => Promise<void>;
  name: string;
  message?: string;
  label?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        const text = message ?? `Delete ${name} and their whole activity log? This can't be undone.`;
        if (!confirm(text)) e.preventDefault();
      }}
    >
      <Button type="submit" variant="outline" size="sm" className="text-red-600 hover:text-red-700">
        {label}
      </Button>
    </form>
  );
}
