"use client";
import avatar1 from "@/assets/avatar-1.png";
import avatar2 from "@/assets/avatar-2.png";
import avatar3 from "@/assets/avatar-3.png";
import avatar4 from "@/assets/avatar-4.png";
import avatar5 from "@/assets/avatar-5.png";
import avatar6 from "@/assets/avatar-6.png";
import avatar7 from "@/assets/avatar-7.png";
import avatar8 from "@/assets/avatar-8.png";
import avatar9 from "@/assets/avatar-9.png";
import avatar10 from "@/assets/avatar-10.png";
import avatar11 from "@/assets/avatar-11.png";

import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";
import React from "react";

const testimonials = [
  {
    text: "As a fashion boutique, we wanted an online store that matched our brand’s unique vibe. Sekwati-Code delivered a stylish and fully functional ecommerce platform with a user-friendly backend for us to manage inventory. Customers rave about how easy it is to shop with us now.",
    imageSrc: avatar1.src,
    name: "Marietjie van Vuuren",
    businessName: "VV Fashion",
  },
  {
    text: "We run a small online bakery and needed a website to accept orders easily. Sekwati-Code created a stunning ecommerce store for us with features like custom cake order forms and delivery scheduling. Their expertise in integrating payment gateways was a lifesaver. Highly recommend them!",
    imageSrc: avatar2.src,
    name: "Lucian Dlamini",
    businessName: "Bake My Soul",
  },
  {
    text: "Our roofing business now has an online home, thanks to Sekwati-Code. They created a user-friendly website that fits our budget and brand. The process was quick, and their team ensured we understood every step. Clients can easily reach us now, which has made a big difference!",
    imageSrc: avatar3.src,
    name: "Heindrick van Schalkwyk",
    businessName: "Elite Roofers",
  },
  {
    text: "We own a small beauty spa and needed a booking system that clients could use online. Sekwati-Code built an app that allows clients to select services, book appointments, and even pay deposits. The functionality has reduced no-shows and made managing schedules a breeze.",
    imageSrc: avatar11.src,
    name: "Kgopotso Mahlangu",
    businessName: "Pretty Chilled",
  },
  {
    text: "Sekwati-Code built an online store for our organic skincare brand, and we couldn’t be happier! The layout is sleek, and the checkout process is seamless. They also optimized the site for mobile, ensuring our customers have a great experience on any device. Sales have gone up significantly since the launch.",
    imageSrc: avatar5.src,
    name: "Nabeela Naidoo",
    businessName: "Matte Perfect",
  },
  {
    text: "We’re a family-run tiling company and knew nothing about websites. Sekwati-Code built a beautiful, functional site that perfectly highlights our past projects. They patiently guided us through the process and provided invaluable advice. We’ve already seen an increase in inquiries from new customers thanks to the site.",
    imageSrc: avatar4.src,
    name: "Bongani Ndlovu",
    businessName: "Floored Geometrics",
  },
  {
    text: "As a logistics company, we required a professional multipage website to present our services, team, and portfolio. Sekwati-Code crafted an impressive site with a modern design that represents our brand. The navigation is intuitive, and their attention to detail stood out. The team worked tirelessly to meet our deadlines. Exceptional service.",
    imageSrc: avatar7.src,
    name: "Mohammed Sheik",
    businessName: "Sheik and Sons Logistics",
  },
  {
    text: "Sekwati-Code transformed our small plumbing business's online presence. We needed a straightforward website to showcase our services, and they delivered beyond expectations. The design is clean, professional, and exactly what we envisioned. Our clients love the simplicity and ease of navigation. Working with their team was seamless, and they were always responsive to our feedback.",
    imageSrc: avatar9.src,
    name: "Sam Dawson",
    businessName: "Daws on Demand",
  },
  {
    text: "Sekwati-Code designed a simple yet effective website for our solar panel installation business. The site perfectly showcases our services and highlights our eco-friendly mission. It's clean, easy to navigate, and mobile-friendly, which has been great for customers on the go. Since launching, we've seen a noticeable increase in inquiries. The team was professional, responsive, and delivered on time.",
    imageSrc: avatar10.src,
    name: "Philile Sikhosana",
    businessName: "Connect Electrical and Projects",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const TestimonialsColumn = (props: {
  className?: string;
  testimonials: typeof testimonials;
  duration?: number;
}) => (
  <div className={props.className}>
    <motion.div
      animate={{
        translateY: "-50%",
      }}
      transition={{
        duration: props.duration || 10,
        repeat: Infinity,
        ease: "linear",
        repeatType: "loop",
      }}
      className="flex flex-col gap-6 pb-6"
    >
      {[...new Array(2)].fill(0).map((_, index) => (
        <React.Fragment key={index}>
          {props.testimonials.map(({ text, imageSrc, name, businessName }) => (
            <div key="name" className="card">
              <div>{text}</div>
              <div className="flex items-center gap-2 mt-5">
                <Image
                  src={imageSrc}
                  alt={name}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full"
                />
                <div className="flex flex-col">
                  <div className="font-medium tracking-tight leading-5">
                    {name}
                  </div>
                  <div className="leading-5 tracking-tight">{businessName}</div>
                </div>
              </div>
            </div>
          ))}
        </React.Fragment>
      ))}
    </motion.div>
  </div>
);

export const Testimonials = () => {
  return (
    <section className="bg-white" id="Testimonials">
      <div className="container">
        <div className="section-heading">
          <div className="flex justify-center">
            <div className="tag">Testimonials</div>
          </div>
          <h2 className="section-title mt-5">What our users say</h2>
          <p className="section-description mt-5">
            Hear from our happy clients! From small businesses to enterprises,
            discover how Sekwati-Code’s tailored solutions have transformed
            their online presence and boosted their success.
          </p>
        </div>
        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[738px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="hidden md:block"
            duration={19}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="hidden lg:block"
            duration={17}
          />
        </div>
      </div>
    </section>
  );
};
