import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin sign in | Sekwaticode",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-neutral-900">Sekwaticode admin</h1>
        <p className="mt-1 text-sm text-neutral-500">Sign in to manage clients and leads.</p>
        <LoginForm />
      </div>
    </main>
  );
}
