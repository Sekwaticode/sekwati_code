"use client";

import Link from "next/link";

export const Header = () => {
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 backdrop-blur-sm z-20" id="Header">
      {/* Top Bar */}
      <div className="flex justify-center items-center py-3 bg-black text-white text-sm gap-3">
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
      <div className="py-5">
        <div className="container">
          <div className="flex items-center justify-between">
            <nav className="hidden md:flex gap-6 text-black/60 items-center" role="navigation">
              <Link href="/">Home</Link>
              <Link href="/about">About</Link>
              <Link href="/services">Services &amp; Pricing</Link>
              <Link href="/testimonials">Testimonials</Link>
              <Link
                href="/contact"
                className="bg-black text-white px-4 py-2 rounded-lg font-medium inline-flex items-center justify-center tracking-tight"
              >
                Contact
              </Link>
              <a href="#Footer" onClick={(e) => handleSmoothScroll(e, "#Footer")}>Footer</a>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};
