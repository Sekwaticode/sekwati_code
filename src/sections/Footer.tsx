"use client";

import Image from "next/image";
import logo from "@/assets/logo.png";
import SocialX from "@/assets/social-x.svg";
import SocialInsta from "@/assets/social-insta.svg";
import SocialLinkedIn from "@/assets/social-linkedin.svg";
import SocialPin from "@/assets/social-pin.svg";
import SocialYoutube from "@/assets/social-youtube.svg";

export const Footer = () => {
  return (
    <footer
      className="bg-black text-[#BCBCBC] text-sm py-10 text-center"
      id="Footer"
    >
      <div className="container">
        <div className="inline-flex relative before:content-[''] before:top-2 before:bottom-0 before:w-full before:blur before:bg-[linear-gradient(to_right,#F87BFF,#FB92CF,#FFDD9B,#C2F0B1,#2FD8FE)] before:absolute">
          <Image src={logo} height={40} alt=" logo" className="relative" />
        </div>
        <nav className="flex flex-col md:flex-row md:justify-center gap-6 mt-6">
          <a
            href="#Home"
            onClick={(e) => {
              e.preventDefault();
              const target = document.querySelector("#Home");
              if (target) {
                target.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            Home
          </a>
          <a
            href="#About"
            onClick={(e) => {
              e.preventDefault();
              const target = document.querySelector("#About");
              if (target) {
                target.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            About
          </a>
          <a
            href="#Pricing"
            onClick={(e) => {
              e.preventDefault();
              const target = document.querySelector("#Pricing");
              if (target) {
                target.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            Pricing
          </a>
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
            Testimonials
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
          >
            Contact
          </a>
        </nav>
        <div className="flex justify-center gap-6 mt-6">
          <SocialX />
          <SocialInsta />
          <SocialLinkedIn />
          <SocialPin />
          <SocialYoutube />
        </div>
        <p className="mt-6">
          &copy; 2025 SekwatiCode, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
