"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { twMerge } from "tailwind-merge";
import logo from "@/assets/logo.png";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services & Pricing" },
  { href: "/testimonials", label: "Testimonials" },
];

export const Header = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu when the route changes or Escape is pressed.
  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const linkClass = (href: string) =>
    twMerge(
      "transition-colors hover:text-white",
      pathname === href ? "text-white" : "text-white/60"
    );

  return (
    <header className="sticky top-0 z-40" id="Header">
      {/* Top Bar */}
      <div className="flex justify-center items-center py-3 bg-black text-white text-sm gap-3 border-b border-white/10">
        <p className="text-white/60 hidden md:block">
          Premium Web Solutions Tailored to Your Business Needs
        </p>
        <div className="inline-flex gap-1 items-center">
          <Link
            href="/contact"
            className="bg-[linear-gradient(to_right,#DD7DDF,#E1CD86,#BBCB92,#71C2EF,#3BFFFF,#DD7DDF)]
                       [background-size:200%] text-transparent bg-clip-text font-medium"
          >
            Contact Now
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-[#0a0a0a]/60 backdrop-blur-md backdrop-saturate-150 border-b border-white/10 py-4">
        <div className="container">
          <div className="flex items-center justify-between">
            <Link href="/" aria-label="Sekwaticode home">
              <Image src={logo} alt="Sekwaticode logo" height={40} priority />
            </Link>

            {/* Desktop links */}
            <nav className="hidden md:flex gap-6 items-center text-sm" aria-label="Main">
              {navLinks.map(({ href, label }) => (
                <Link key={href} href={href} className={linkClass(href)}>
                  {label}
                </Link>
              ))}
              <Link
                href="/contact"
                className="bg-white text-black px-4 py-2 rounded-lg font-medium tracking-tight hover:bg-white/90 transition-colors"
              >
                Contact
              </Link>
            </nav>

            {/* Mobile toggle */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg text-white hover:bg-white/10 transition-colors"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className={twMerge(
            "md:hidden grid transition-[grid-template-rows] duration-300 ease-out",
            menuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          )}
        >
          <div className="overflow-hidden">
            <div className="container flex flex-col gap-1 pt-4 pb-2 text-base">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  tabIndex={menuOpen ? 0 : -1}
                  className={twMerge(
                    linkClass(href),
                    "py-3 border-b border-white/10"
                  )}
                >
                  {label}
                </Link>
              ))}
              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                tabIndex={menuOpen ? 0 : -1}
                className="mt-4 bg-white text-black px-4 py-3 rounded-lg font-medium text-center tracking-tight hover:bg-white/90 transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};
