import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/admin/submit-button";
import { ActionForm } from "@/components/shared/action-form";
import { AutoSubmitSelect } from "@/components/shared/auto-submit-select";
import { CommentThread } from "@/components/shared/comment-thread";
import {
  REQUEST_PRIORITIES,
  REQUEST_STATUSES,
  humanize,
  type RequestComment,
  type RequestRow,
} from "@/lib/portal/types";
import { staffReply, updateRequest } from "../actions";

export default async function AdminRequestPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data } = await supabase
    .from("requests")
    .select("*, contacts(id, name, company), projects(id, name)")
    .eq("id", params.id)
    .maybeSingle();
  if (!data) notFound();
  const request = data as RequestRow & {
    contacts: { id: string; name: string; company: string | null } | null;
    projects: { id: string; name: string } | null;
  };

  const { data: commentData } = await supabase
    .from("request_comments")
    .select("*")
    .eq("request_id", request.id)
    .order("created_at");
  const comments = (commentData ?? []) as RequestComment[];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/admin/requests" className="text-sm text-neutral-500 hover:text-neutral-900">
        ← All requests
      </Link>

      <div>
        <p className="text-sm text-neutral-500">{humanize(request.type)} request</p>
        <h1 className="text-2xl font-semibold">{request.title}</h1>
        <p className="mt-1 text-sm text-neutral-600">
          {request.contacts && (
            <Link href={`/admin/contacts/${request.contacts.id}`} className="hover:underline">
              {request.contacts.name}
            </Link>
          )}
          {request.projects && (
            <>
              {" · "}
              <Link href={`/admin/projects/${request.projects.id}`} className="hover:underline">
                {request.projects.name}
              </Link>
            </>
          )}
        </p>
      </div>

      <form action={updateRequest.bind(null, request.id)} className="flex flex-wrap items-center gap-3 text-sm">
        <span className="text-neutral-500">Status</span>
        <AutoSubmitSelect
          name="status"
          label="Status"
          defaultValue={request.status}
          className="w-[150px]"
          options={REQUEST_STATUSES.map((s) => ({ value: s, label: humanize(s) }))}
        />
        <span className="text-neutral-500">Priority</span>
        <AutoSubmitSelect
          name="priority"
          label="Priority"
          defaultValue={request.priority}
          className="w-[130px]"
          options={REQUEST_PRIORITIES.map((s) => ({ value: s, label: humanize(s) }))}
        />
      </form>

      <CommentThread
        opening={{ body: request.description, created_at: request.created_at, by_staff: request.created_by_staff }}
        comments={comments}
        viewer="staff"
        clientName={request.contacts?.name ?? "Client"}
      />

      <ActionForm action={staffReply.bind(null, request.id)} resetOnSuccess className="space-y-3">
        <Textarea name="body" rows={4} placeholder="Reply to the client…" required />
        <SubmitButton pendingText="Sending…">Send reply</SubmitButton>
      </ActionForm>
    </div>
  );
}
