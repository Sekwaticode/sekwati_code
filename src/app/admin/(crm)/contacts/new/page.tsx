import { ContactForm } from "@/components/admin/contact-form";
import { createContact } from "../actions";

export default function NewContactPage({ searchParams }: { searchParams: { kind?: string } }) {
  const defaultKind = searchParams.kind === "client" ? "client" : "lead";
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold">Add contact</h1>
      <ContactForm action={createContact} defaultKind={defaultKind} cancelHref="/admin/contacts" />
    </div>
  );
}
