import type { Metadata } from "next";
import { Header } from "@/sections/Header";
import Contact from "@/components/ui/contact-01";
import { Footer } from "@/sections/Footer";

export const metadata: Metadata = {
  title: "Contact | Sekwaticode",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <Contact />
      <Footer />
    </>
  );
}
