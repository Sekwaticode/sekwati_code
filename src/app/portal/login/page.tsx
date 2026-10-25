import type { Metadata } from "next";
import { LoginForm } from "@/app/admin/login/login-form";

export const metadata: Metadata = {
  title: "Client portal | Sekwaticode",
  robots: { index: false, follow: false },
};

export default function PortalLoginPage() {
  return (
    <main className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-neutral-900">Client portal</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Sign in to follow your project, share files and send requests.
        </p>
        <LoginForm next="/portal" />
        <p className="mt-6 text-xs text-neutral-500">
          Don&apos;t have a login or forgot your password? Message us and we&apos;ll set you up.
        </p>
      </div>
    </main>
  );
}
