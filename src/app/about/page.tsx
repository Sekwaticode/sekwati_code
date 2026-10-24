import type { Metadata } from "next";
import { Header } from "@/sections/Header";
import { ProductShowcase } from "@/sections/ProductShowcase";
import { CallToAction } from "@/sections/CallToAction";
import FAQs from "@/components/ui/faqs-component";

import { Footer } from "@/sections/Footer";

export const metadata: Metadata = {
  title: "About | Sekwaticode",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <ProductShowcase />
      <FAQs/>
      <CallToAction />
      <Footer />
    </>
  );
}
