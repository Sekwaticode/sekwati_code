"use client";

import { selectClass } from "@/components/admin/styles";

/** A select inside a form that submits the form as soon as the value changes. */
export function AutoSubmitSelect({
  name,
  defaultValue,
  options,
  className = "",
  label,
}: {
  name: string;
  defaultValue: string;
  options: { value: string; label: string }[];
  className?: string;
  label: string;
}) {
  return (
    <select
      name={name}
      defaultValue={defaultValue}
      aria-label={label}
      className={`${selectClass} h-9 ${className}`}
      onChange={(e) => e.currentTarget.form?.requestSubmit()}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
