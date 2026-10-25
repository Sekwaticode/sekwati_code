export const CONTACT_KINDS = ["lead", "client"] as const;
export type ContactKind = (typeof CONTACT_KINDS)[number];

export const LEAD_STATUSES = ["new", "contacted", "qualified", "proposal", "won", "lost"] as const;
export const CLIENT_STATUSES = ["active", "inactive"] as const;
export const ALL_STATUSES = [...LEAD_STATUSES, ...CLIENT_STATUSES] as const;
export type ContactStatus = (typeof ALL_STATUSES)[number];

export const ACTIVITY_TYPES = ["note", "call", "email", "meeting", "whatsapp"] as const;
export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export const SOURCES = ["website", "whatsapp", "referral", "social media", "walk-in", "other"] as const;

export type Contact = {
  id: string;
  kind: ContactKind;
  status: ContactStatus;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  source: string | null;
  service_interest: string | null;
  estimated_value: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Activity = {
  id: string;
  contact_id: string;
  type: ActivityType;
  body: string;
  created_at: string;
};

export function statusesFor(kind: ContactKind): readonly ContactStatus[] {
  return kind === "lead" ? LEAD_STATUSES : CLIENT_STATUSES;
}

export function label(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function formatMoney(value: number | null) {
  if (value == null) return "—";
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(value);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-ZA", { dateStyle: "medium", timeStyle: "short" }).format(
    new Date(value)
  );
}
