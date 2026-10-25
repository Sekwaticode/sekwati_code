export const PROJECT_STATUSES = ["planning", "in_progress", "review", "completed", "on_hold"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const MILESTONE_STATUSES = [
  "pending",
  "in_progress",
  "awaiting_approval",
  "approved",
  "changes_requested",
] as const;
export type MilestoneStatus = (typeof MILESTONE_STATUSES)[number];

export const DOCUMENT_CATEGORIES = ["content", "brand", "design", "contract", "other"] as const;
export type DocumentCategory = (typeof DOCUMENT_CATEGORIES)[number];

export const REQUEST_TYPES = ["revision", "support"] as const;
export type RequestType = (typeof REQUEST_TYPES)[number];

export const REQUEST_STATUSES = ["open", "in_progress", "resolved", "closed"] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const REQUEST_PRIORITIES = ["low", "normal", "high", "urgent"] as const;
export type RequestPriority = (typeof REQUEST_PRIORITIES)[number];

export const CONTRACT_STATUSES = ["draft", "sent", "accepted"] as const;
export type ContractStatus = (typeof CONTRACT_STATUSES)[number];

export const DEFAULT_MILESTONES = [
  { title: "Discovery & content", description: "Agree on goals, pages and gather your text, images and logo." },
  { title: "Design", description: "Layout and look of the site for your approval." },
  { title: "Development", description: "Building the site and connecting forms, payments and integrations." },
  { title: "Review & revisions", description: "You review the full site and we make agreed changes." },
  { title: "Launch", description: "Domain, hosting and go-live." },
];

export type Project = {
  id: string;
  contact_id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  start_date: string | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
};

export type Milestone = {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  position: number;
  due_date: string | null;
  status: MilestoneStatus;
  client_feedback: string | null;
  responded_at: string | null;
  created_at: string;
};

export type DocumentRow = {
  id: string;
  project_id: string;
  file_path: string;
  file_name: string;
  size_bytes: number | null;
  mime_type: string | null;
  category: DocumentCategory;
  uploaded_by_staff: boolean;
  created_at: string;
};

export type RequestRow = {
  id: string;
  contact_id: string;
  project_id: string | null;
  type: RequestType;
  title: string;
  description: string;
  status: RequestStatus;
  priority: RequestPriority;
  created_by_staff: boolean;
  created_at: string;
  updated_at: string;
};

export type RequestComment = {
  id: string;
  request_id: string;
  body: string;
  author_is_staff: boolean;
  created_at: string;
};

export type Contract = {
  id: string;
  contact_id: string;
  project_id: string | null;
  title: string;
  body: string;
  status: ContractStatus;
  sent_at: string | null;
  accepted_at: string | null;
  signer_name: string | null;
  signer_ip: string | null;
  signer_user_agent: string | null;
  body_sha256: string | null;
  created_at: string;
  updated_at: string;
};

export function humanize(value: string) {
  const s = value.replace(/_/g, " ");
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function formatDay(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-ZA", { dateStyle: "medium" }).format(new Date(value));
}

export function formatBytes(bytes: number | null) {
  if (bytes == null) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function milestoneProgress(milestones: Pick<Milestone, "status">[]) {
  if (milestones.length === 0) return 0;
  const done = milestones.filter((m) => m.status === "approved").length;
  return Math.round((done / milestones.length) * 100);
}

export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
