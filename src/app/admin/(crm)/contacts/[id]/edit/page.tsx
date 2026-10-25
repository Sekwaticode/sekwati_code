import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ContactForm } from "@/components/admin/contact-form";
import type { Contact } from "@/lib/crm/types";
import { updateContact } from "../../actions";

export default async function EditContactPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data } = await supabase.from("contacts").select("*").eq("id", params.id).maybeSingle();
  if (!data) notFound();
  const contact = data as Contact;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold">Edit {contact.name}</h1>
      <ContactForm
        action={updateContact.bind(null, contact.id)}
        contact={contact}
        cancelHref={`/admin/contacts/${contact.id}`}
      />
    </div>
  );
}
