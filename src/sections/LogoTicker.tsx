"use client";
import landingPageLogo from "@/assets/logo-landing_pages.png";
import businessWebLogo from "@/assets/logo-business_websites.png";
import ecommerceLogo from "@/assets/logo-e_commerce.png";
import bookingPlatformsLogo from "@/assets/logo_booking_platforms.png";
import fullStackLogo from "@/assets/logo-full_stack.png";
import whatsappLogo from "@/assets/logo_whatsapp_integration.png";
import onlinePaymentLogo from '@/assets/logo-online_payment.png'
import Image from "next/image";
import { motion } from "framer-motion";

export const LogoTicker = () => {
  return (
    <div className="py-8 md:py-12 bg-white"
    id="LogoTicker"
    >
      <div className="container">
        <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black,transparent)]">
          <motion.div
            className="flex gap-14 flex-none pr-14"
            animate={{
              translateX: "-50%",
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
              repeatType: "loop",
            }}
          >
            <Image
              src={landingPageLogo}
              alt="Landing Pages Logo"
              className="logo-ticker-image"
            />
            <Image
              src={businessWebLogo}
              alt="Business Web Logo"
              className="logo-ticker-image"
            />
            <Image
              src={ecommerceLogo}
              alt="E-Commerce Logo"
              className="logo-ticker-image"
            />
            <Image
              src={bookingPlatformsLogo}
              alt="Booking Platform Logo"
              className="logo-ticker-image"
            />
            <Image
              src={fullStackLogo}
              alt="Full Stack Logo"
              className="logo-ticker-image"
            />
            <Image
              src={whatsappLogo}
              alt="Whatsapp Logo"
              className="logo-ticker-image"
            />
             <Image
              src={onlinePaymentLogo}
              alt="Online Payment Logo"
              className="logo-ticker-image"
            />

            {/* Second set of logos for animation */}
            <Image
              src={landingPageLogo}
              alt="Landing Pages Logo"
              className="logo-ticker-image"
            />
            <Image
              src={businessWebLogo}
              alt="Business Web Logo"
              className="logo-ticker-image"
            />
            <Image
              src={ecommerceLogo}
              alt="E-Commerce Logo"
              className="logo-ticker-image"
            />
            <Image
              src={bookingPlatformsLogo}
              alt="Booking Platform Logo"
              className="logo-ticker-image"
            />
            <Image
              src={fullStackLogo}
              alt="Full Stack Logo"
              className="logo-ticker-image"
            />
            <Image
              src={whatsappLogo}
              alt="Whatsapp Logo"
              className="logo-ticker-image"
            />
              <Image
              src={onlinePaymentLogo}
              alt="Online Payment Logo"
              className="logo-ticker-image"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};
