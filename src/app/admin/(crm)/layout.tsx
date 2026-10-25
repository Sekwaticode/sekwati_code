import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "../login/actions";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Admin | Sekwaticode",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function CrmLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: isStaff } = await supabase.rpc("is_staff");
  if (!isStaff) {
    const { data: isClient } = await supabase.rpc("is_client");
    if (isClient) redirect("/portal");
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3">
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <Link href="/admin" className="font-semibold">
              Sekwaticode admin
            </Link>
            {[
              ["/admin/contacts", "Contacts"],
              ["/admin/projects", "Projects"],
              ["/admin/requests", "Requests"],
              ["/admin/contracts", "Contracts"],
            ].map(([href, text]) => (
              <Link key={href} href={href} className="text-neutral-600 hover:text-neutral-900">
                {text}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3 text-sm text-neutral-500">
            <span className="hidden sm:inline">{user.email}</span>
            <form action={signOut}>
              <Button variant="outline" size="sm" type="submit">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        {isStaff ? (
          children
        ) : (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
            <p className="font-medium">This account isn&apos;t set up as staff yet.</p>
            <p className="mt-1">
              Add your user ID to the <code>staff</code> table in Supabase (see README, &quot;Admin
              setup&quot;), then refresh.
            </p>
            <p className="mt-2 font-mono text-xs">User ID: {user.id}</p>
          </div>
        )}
      </main>
    </div>
  );
}
