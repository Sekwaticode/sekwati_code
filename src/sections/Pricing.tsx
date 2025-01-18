"use client";
import CheckIcon from "@/assets/check.svg";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";

const pricingTiers = [
  {
    title: "Simple Landing Page",
    monthlyPrice: 2000,
    buttonText: "Enquire Now!",
    premium: false,
    inverse: false,
    features: [
      "Home",
      "About",
      "Products/Services",
      "Testimonials",
      "Whatsapp Button",
      "Google Frame",
      "Domain with Business Emails",
      "Basic SEO",
    ],
  },
  {
    title: "Enterprise Website",
    monthlyPrice: 3200,
    buttonText: "Enquire Now!",
    premium: false,
    inverse: true,
    features: [
      "Home",
      "About",
      "Products/Services",
      "Testimonials",
      "Whatsapp Button",
      "Google Frame",
      "Domain with Business Emails",
      "Basic SEO",
      "Multi-page design",
      "Business Card",
      "Email Signature",
      "Letterhead",
      "Invoice Design",
    ],
  },
  {
    title: "E-Commerce Site",
    monthlyPrice: 5500,
    buttonText: "Enquire Now!",
    premium: false,
    inverse: false,
    features: [
      "Home",
      "About",
      "Products/Services",
      "Testimonials",
      "Filter and Search Features",
      "Shopping Cart",
      "Order Tracking",
      "Whatsapp Button",
      "Google Frame",
      "Domain with Business Emails",
      "Basic SEO",
      "Multi-page design",
      "Admin Panel with Secured Login",
      "Content Management System",
      "Business Card",
      "Email Signature",
      "Letterhead",
      "Invoice Design",
    ],
  },
  {
    title: "Booking Website",
    monthlyPrice: 12000,
    buttonText: "Enquire Now!",
    premium: true,
    inverse: true,
    features: [
      "Home",
      "About",
      "Products/Services",
      "Testimonials",
      "Filter and Search Features",
      "Whatsapp Button",
      "Google Frame",
      "Domain with Business Emails",
      "Basic SEO",
      "Multi-page design",
      "Admin Panel with Secured Login",
      "Content Management System",
      "Business Card",
      "Email Signature",
      "Letterhead",
      "Invoice Design",
      "Appointment Booking Calender",
      "Email notifications for both clients and providers",
      "Optional Mobile App (+R10,000)",
    ],
  },
];

export const Pricing = () => {
  return (
    <section className="py-24 bg-white"
    id="Pricing"
    >
      <div className="container">
        <div className="section-heading">
          <h2 className="section-title">
            Transparent Pricing, Exceptional Value
          </h2>
          <p className="section-description mt-5">
            Our pricing is designed to suit businesses of all sizes, offering
            flexible options without compromising on quality. Whether you are
            starting with a simple landing page or require a feature-rich
            solution, we ensure you get exceptional value tailored to your
            needs. At Sekwati-Code, transparency is key—no hidden fees, just
            straightforward, competitive rates.
          </p>
        </div>
        <div className="flex flex-col gap-6 items-center mt-10 lg:flex-row lg:items-end lg:justify-center">
          {pricingTiers.map(
            ({
              title,
              monthlyPrice,
              buttonText,
              premium,
              inverse,
              features,
            }) => (
              <div
              key={title}
                className={twMerge(
                  "card",
                  inverse === true && "border-black bg-black text-white"
                )}
              >
                <div className="flex justify-between">
                  <h3
                    className={twMerge(
                      "text-lg font-bold text-black/50",
                      inverse === true && "text-white/60"
                    )}
                  >
                    {title}
                  </h3>
                  {premium === true && (
                    <div className="inline-flex text-sm px-4 py-1.5 rounded-xl border border-white/20">
                      <motion.span
                        animate={{
                          backgroundPositionX: "100%",
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                          repeatType: "loop",
                        }}
                        className="bg-[linear-gradient(to_right,#DD7DDF,#E1CD86,#BBCB92,#71C2EF,#3BFFFF,#DD7DDF,#E1CD86,#BBCB92,#71C2EF,#3BFFFF,#DD7DDF)] [background-size:200%] text-transparent bg-clip-text font-medium"
                      >
                        premium
                      </motion.span>
                    </div>
                  )}
                </div>
                <div className="flex items-baseline gap-1 mt-[30px]">
                  <span className="text-4xl font-bold tracking-tighter leading-none">
                    R{monthlyPrice.toLocaleString("en-US")}
                  </span>
                  {/* <span className="tracking-tight font-bold text-black/50">
                    /month
                  </span> */}
                </div>
                <a
                  className={twMerge(
                    "btn btn-primary w-full mt-[30px]",
                    inverse === true && "bg-white text-black"
                  )}
                  href="#Contact"
                  onClick={(e) => {
                    e.preventDefault();
                    const target = document.querySelector("#Contact");
                    if (target) {
                      target.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                
                >
                  {buttonText}
                </a>
                <ul className="flex flex-col gap-5 mt-8">
                  {features.map((feature) => (
                    <li key={feature} className="text-sm flex items-center gap-4">
                      <CheckIcon className="h-6 w-6" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};
