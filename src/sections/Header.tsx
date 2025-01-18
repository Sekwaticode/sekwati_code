"use client";

import ArrowRight from "@/assets/arrow-right.svg";
import Logo from "@/assets/logo.png";
import Image from "next/image";
import MenuIcon from "@/assets/menu.svg";

export const Header = () => {
  return (
    <header className="sticky top-0 backdrop-blur-sm z-20" id="Header">
      <div className="flex justify-center items-center py-3 bg-black text-white text-sm gap-3">
        <p className="text-white/60 hidden md:block">
          Premium Web solutions Tailored To Your Business Needs{" "}
        </p>
        <div className="inline-flex gap-1 items-center">
          <a className="bg-[linear-gradient(to_right,#DD7DDF,#E1CD86,#BBCB92,#71C2EF,#3BFFFF,#DD7DDF,#E1CD86,#BBCB92,#71C2EF,#3BFFFF,#DD7DDF)] [background-size:200%] text-transparent bg-clip-text font-medium"
           onClick={(e) => {
            e.preventDefault(); 
            const target = document.querySelector("#Contact");
            if (target) {
              target.scrollIntoView({ behavior: "smooth" });
            }
          }}>
            Contact now
          </a>
          <ArrowRight className="h-4 w-4 inline-flex justify-center items-center" />
        </div>
      </div>
      <div className="py-5">
        <div className="container">
          <div className="flex items-center justify-between">
            <Image src={Logo} alt="Saas Logo" height={40} width={40} />
            <MenuIcon className="h-5 w-5 md:hidden" />
            <nav className="hidden md:flex gap-6 text-black/60 items-center">
              <a href="#Home"
               onClick={(e) => {
                e.preventDefault(); 
                const target = document.querySelector("#Home");
                if (target) {
                  target.scrollIntoView({ behavior: "smooth" });
                }
              }}
              >Home</a>
              <a href="#About"
               onClick={(e) => {
                e.preventDefault(); 
                const target = document.querySelector("#About");
                if (target) {
                  target.scrollIntoView({ behavior: "smooth" });
                }
              }}
              >About</a>
              <a href="#Pricing"
               onClick={(e) => {
                e.preventDefault(); 
                const target = document.querySelector("#Pricing");
                if (target) {
                  target.scrollIntoView({ behavior: "smooth" });
                }
              }}
              >Pricing</a>
              <a
                href="#Testimonials"
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.querySelector("#Testimonials");
                  if (target) {
                    target.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                Testimonial
              </a>
              <a
                href="#Contact"
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.querySelector("#Contact");
                  if (target) {
                    target.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="bg-black text-white px-4 py-2 rounded-lg font-medium inline-flex items-center justify-center tracking-tight"
              >
                Contact
              </a>

              <a href="#CallToAction"
               onClick={(e) => {
                e.preventDefault(); 
                const target = document.querySelector("#CallToAction");
                if (target) {
                  target.scrollIntoView({ behavior: "smooth" });
                }
              }}
              >Footer</a>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};
