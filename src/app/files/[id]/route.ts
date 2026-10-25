import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { UUID_RE } from "@/lib/portal/types";

// Download a project file. Database rules make sure people only get files they're allowed to see.
export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  if (!UUID_RE.test(params.id)) return new NextResponse("Not found", { status: 404 });

  const supabase = createClient();
  const { data: doc } = await supabase
    .from("documents")
    .select("file_path, file_name")
    .eq("id", params.id)
    .maybeSingle();
  if (!doc) return new NextResponse("Not found", { status: 404 });

  const { data, error } = await supabase.storage
    .from("project-files")
    .createSignedUrl(doc.file_path, 60, { download: doc.file_name });
  if (error || !data) return new NextResponse("Could not open file", { status: 500 });

  return NextResponse.redirect(data.signedUrl);
}
