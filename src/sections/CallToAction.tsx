"use client";
import ArrowRight from "@/assets/arrow-right.svg";
import rocketImage from "@/assets/rocket.png";
import manHalfMoon from "@/assets/astronaut-on-halfmoon.png";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export const CallToAction = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const translateY = useTransform(scrollYProgress, [0, 2], [150, -150]);
  const translateX = useTransform(scrollYProgress, [0, 3], [150, -150]);

  return (
    <section
      ref={sectionRef}
      className="bg-gradient-to-b from-[#B18197] to-[#630330] py-24 overflow-x-clip"
      id="CallToAction"
    >
      <div className="container">
        <div className="section-heading relative">
          <p className="section-description mt-5">
            Connect with customers who are actively seeking your services
            through expertly crafted web solutions tailored to your business
            goals!
          </p>
          <motion.img
            src={rocketImage.src}
            alt="RocketImage"
            width={360}
            className="absolute -left-[350px] -top-[137px]"
            style={{
              translateX,
            }}
          />
          <motion.img
            src={manHalfMoon.src}
            alt="Astronaut on half-moon"
            width={360}
            className="absolute -right-[331px] -top-[19px]"
            style={{
              translateY,
            }}
          />
        </div>
        <div className="flex gap-2 mt-10 justify-center">
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
            Enquire Now!{" "}
          </a>{" "}
          <button className="btn btn-text gap-1">
            {/* <span>Learn more</span> */}
            {/* <ArrowRight className="h-5 w-5" /> */}
          </button>
        </div>
      </div>
    </section>
  );
};
