import { Mail, Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { LogoTicker } from "@/sections/LogoTicker";

const contactDetails = [
  {
    icon: Phone,
    label: "Call or WhatsApp",
    value: "069 673 1098",
    href: "tel:+27696731098",
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@sekwaticode.com",
    href: "mailto:info@sekwaticode.com",
  },
];

const ContactInfo = () => {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-3xl md:text-[54px] md:leading-[60px] font-bold tracking-tighter bg-gradient-to-b from-black to-[#630330] text-transparent bg-clip-text">
          Contact us Now
        </h2>
        <p className="text-[22px] leading-[30px] tracking-tight text-[#010D3E] mt-5">
          Let us know what you’re looking for, and our expert team will bring
          your vision to life. Don’t wait—reach out today and let’s create a
          solution that elevates your brand and drives results!
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {contactDetails.map(({ icon: Icon, label, value, href }) => (
          <a key={label} href={href} className="flex items-center gap-4 group">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-black text-white">
              <Icon className="h-5 w-5" />
            </span>
            <span className="flex flex-col">
              <span className="text-sm text-[#010D3E]/60">{label}</span>
              <span className="text-lg font-medium tracking-tight group-hover:underline">
                {value}
              </span>
            </span>
          </a>
        ))}
      </div>

      <Separator />

      <div>
        <p className="text-sm text-[#010D3E]/60">What we build</p>
        {/* Reuses the existing ticker; strip its container padding to fit the column */}
        <div className="mt-2 rounded-lg overflow-hidden [&_.container]:px-0">
          <LogoTicker />
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
