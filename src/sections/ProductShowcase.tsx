"use client";
import productImage from "@/assets/retroComputer.png";
import astronautImage from "@/assets/astronaut.png";
import handImage from "@/assets/hand.png";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export const ProductShowcase = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const translateY = useTransform(scrollYProgress, [1, 2], [150, -150]);
  return (
    <section
      ref={sectionRef}
      className="bg-gradient-to-b from-[#FFFFFF] to-[#630330] py-24 overflow-x-clip"
    id="About"
    >
      <div className="container">
        <div className="section-heading">
          {/* <div className="flex justify-center">
            <div className="tag">Boost your productivity</div>
          </div> */}
          <h2 className="section-title mt-5">
            Sekwati-code: Crafting Websites That Drive Results{" "}
          </h2>
          <p className="section-description mt-5">
            At Sekwaticode, we specialize in delivering tailored web solutions
            for businesses of all sizes. Whether you need a sleek landing page,
            a functional basic website or complex systems such as a booking
            platform or ecommerce website, we have got you covered. Our team
            prides itself on meticulous attention to detail, ensuring your
            website aligns perfectly with your vision and business goals. We
            believe in transparent and consistent communication, keeping you
            informed every step of the way. With commitment to delivering
            projects on time and exceeeding expectations, Sekwaticode is your
            trusted partner in building impactful online experiences.
          </p>
        </div>
        <div className="relative">
          <motion.img 
          src={productImage.src}
           alt="Product Image"
            className="mt-10"
            style={{
              translateY,
            }} />
          <motion.img
            src={astronautImage.src}
            alt="Pyramid Image"
            height={262}
            width={262}
            className="hidden md:block absolute -right-36 -top-32"
            style={{
              translateY,
            }}
          />
          <motion.img
            src={handImage.src}
            alt="Tube image"
            height={248}
            width={248}
            className="hidden md:block absolute bottom-24 -left-36"
            style={{
              translateY,
            }}
          />
        </div>
      </div>
    </section>
  );
};
