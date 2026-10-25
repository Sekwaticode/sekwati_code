import Link from "next/link";
import { notFound } from "next/navigation";
import { getClientProfile } from "@/lib/auth";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/admin/submit-button";
import { Pill } from "@/components/shared/badges";
import { ActionForm } from "@/components/shared/action-form";
import { CommentThread } from "@/components/shared/comment-thread";
import { humanize, type RequestComment, type RequestRow } from "@/lib/portal/types";
import { clientReply } from "../../actions";

export default async function PortalRequestPage({ params }: { params: { id: string } }) {
  const { supabase, profile } = await getClientProfile();
  if (!profile) return null;

  const { data } = await supabase
    .from("requests")
    .select("*, projects(id, name)")
    .eq("id", params.id)
    .maybeSingle();
  if (!data) notFound();
  const request = data as RequestRow & { projects: { id: string; name: string } | null };

  const { data: commentData } = await supabase
    .from("request_comments")
    .select("*")
    .eq("request_id", request.id)
    .order("created_at");
  const comments = (commentData ?? []) as RequestComment[];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/portal/requests" className="text-sm text-neutral-500 hover:text-neutral-900">
        ← All requests
      </Link>
      <div>
        <p className="text-sm text-neutral-500">
          {humanize(request.type)} request
          {request.projects && (
            <>
              {" · "}
              <Link href={`/portal/projects/${request.projects.id}`} className="hover:underline">
                {request.projects.name}
              </Link>
            </>
          )}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold">{request.title}</h1>
          <Pill value={request.status} />
        </div>
      </div>

      <CommentThread
        opening={{ body: request.description, created_at: request.created_at, by_staff: request.created_by_staff }}
        comments={comments}
        viewer="client"
        clientName={profile.name}
      />

      {request.status === "closed" ? (
        <p className="text-sm text-neutral-500">
          This request is closed.{" "}
          <Link href="/portal/requests/new" className="underline">
            Open a new one
          </Link>{" "}
          if you need anything else.
        </p>
      ) : (
        <ActionForm action={clientReply.bind(null, request.id)} resetOnSuccess className="space-y-3">
          <Textarea name="body" rows={4} placeholder="Add a message…" required />
          <SubmitButton pendingText="Sending…">Send</SubmitButton>
        </ActionForm>
      )}
    </div>
  );
}
