import { Header } from "@/sections/Header";
import { Hero } from "@/sections/Hero";
import { LogoTicker } from "@/sections/LogoTicker";
import { ProductShowcase } from "@/sections/ProductShowcase";
import { Pricing } from "@/sections/Pricing";
import { ProjectProcess } from "@/sections/ProjectProcess";
import { Testimonials } from "@/sections/Testimonials";
import { CallToAction } from "@/sections/CallToAction";
import { Footer } from "@/sections/Footer";
import Contact from "@/components/ui/contact-01";
import FAQs from "@/components/ui/faqs-component";


export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <LogoTicker />
      <ProductShowcase />
      <ProjectProcess />
      <Pricing />
      <Testimonials />
      <FAQs />
      <Contact />
      <CallToAction />
      <Footer />
    </>
  );
}
