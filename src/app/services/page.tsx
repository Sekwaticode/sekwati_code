import type { Metadata } from "next";
import { Header } from "@/sections/Header";
import { LogoTicker } from "@/sections/LogoTicker";
import { Pricing } from "@/sections/Pricing";
import { ProjectProcess } from "@/sections/ProjectProcess";
import { CallToAction } from "@/sections/CallToAction";
import FAQs from "@/components/ui/faqs-component";
import { Footer } from "@/sections/Footer";

export const metadata: Metadata = {
  title: "Services & Pricing | Sekwaticode",
};

export default function ServicesPage() {
  return (
    <>
      <Header />
      <LogoTicker />
      <ProjectProcess />
      <Pricing />
      <FAQs />
      <CallToAction />
      <Footer />
    </>
  );
}
