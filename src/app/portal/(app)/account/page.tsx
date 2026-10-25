import { PasswordForm } from "@/components/portal/password-form";

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-2xl font-semibold">Account</h1>
      <PasswordForm />
    </div>
  );
}
