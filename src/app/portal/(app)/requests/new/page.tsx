import Link from "next/link";
import { getClientProfile } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/admin/submit-button";
import { selectClass } from "@/components/admin/styles";
import { ActionForm } from "@/components/shared/action-form";
import { createRequest } from "../../actions";

export default async function NewRequestPage({ searchParams }: { searchParams: { project?: string } }) {
  const { supabase, profile } = await getClientProfile();
  if (!profile) return null;

  const { data: projects } = await supabase.from("projects").select("id, name").order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">New request</h1>
      <ActionForm action={createRequest} className="space-y-5 rounded-xl border border-neutral-200 bg-white p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="type">What do you need?</Label>
            <select id="type" name="type" className={selectClass} defaultValue="revision">
              <option value="revision">A change to my site (revision)</option>
              <option value="support">Help or a problem (support)</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="project_id">Project</Label>
            <select
              id="project_id"
              name="project_id"
              className={selectClass}
              defaultValue={projects?.some((p) => p.id === searchParams.project) ? searchParams.project : ""}
            >
              <option value="">General / not sure</option>
              {(projects ?? []).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="title">Short title</Label>
          <Input id="title" name="title" required maxLength={200} placeholder="e.g. Update prices on the Services page" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="description">Details</Label>
          <Textarea
            id="description"
            name="description"
            rows={6}
            required
            placeholder="Which page, what should change, and anything else that helps. You can upload files on the project page."
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="urgent" className="h-4 w-4" />
          This is urgent (e.g. the site is down or something is broken)
        </label>
        <div className="flex gap-3">
          <SubmitButton pendingText="Sending…">Send request</SubmitButton>
          <Button variant="outline" asChild>
            <Link href="/portal/requests">Cancel</Link>
          </Button>
        </div>
      </ActionForm>
    </div>
  );
}
