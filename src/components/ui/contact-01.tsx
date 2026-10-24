import ContactInfo from "@/components/ui/contact-01-utils/contact-info";
import ContactForm from "@/components/ui/contact-01-utils/contact-form";

const Contact = () => {
  return (
    // id="Contact" keeps the existing "Contact" links and buttons scrolling here
    <section className="py-24" id="Contact">
      <div className="max-w-7xl xl:px-16 lg:px-8 px-4 mx-auto">
        <div className="grid grid-cols-12 content-center justify-between gap-8 md:gap-0">
          <div className="w-full col-span-12 md:col-span-6">
            <ContactInfo />
          </div>
          <div className="hidden md:block col-span-1"></div>
          <div className="w-full col-span-12 md:col-span-5">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
