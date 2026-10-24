import type { Metadata } from "next";
import { Header } from "@/sections/Header";
import { Testimonials } from "@/sections/Testimonials";
import { CallToAction } from "@/sections/CallToAction";
import { Footer } from "@/sections/Footer";

export const metadata: Metadata = {
  title: "Testimonials | Sekwaticode",
};

export default function TestimonialsPage() {
  return (
    <>
      <Header />
      <Testimonials />
      <CallToAction />
      <Footer />
    </>
  );
}
