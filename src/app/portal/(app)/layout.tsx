import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getClientProfile } from "@/lib/auth";
import { signOut } from "@/app/admin/login/actions";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Client portal | Sekwaticode",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const { supabase, profile } = await getClientProfile();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  let isStaff = false;
  if (!profile) {
    const { data } = await supabase.rpc("is_staff");
    isStaff = Boolean(data);
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-3">
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <Link href="/portal" className="font-semibold">
              Sekwaticode
            </Link>
            {profile && (
              <>
                <Link href="/portal" className="text-neutral-600 hover:text-neutral-900">
                  Projects
                </Link>
                <Link href="/portal/requests" className="text-neutral-600 hover:text-neutral-900">
                  Requests
                </Link>
                <Link href="/portal/account" className="text-neutral-600 hover:text-neutral-900">
                  Account
                </Link>
              </>
            )}
          </nav>
          <div className="flex items-center gap-3 text-sm text-neutral-500">
            <span className="hidden sm:inline">{profile?.name ?? user.email}</span>
            <form action={signOut}>
              <input type="hidden" name="area" value="portal" />
              <Button variant="outline" size="sm" type="submit">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        {profile ? (
          children
        ) : (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
            {isStaff ? (
              <p>
                You&apos;re signed in as staff. The client portal is for clients.{" "}
                <Link href="/admin" className="underline">
                  Go to admin
                </Link>
                .
              </p>
            ) : (
              <p>This login isn&apos;t linked to a client account yet. Please contact Sekwaticode.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
