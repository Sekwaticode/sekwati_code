"use client";

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
          <a
            href="#Contact"
            className="bg-[linear-gradient(to_right,#DD7DDF,#E1CD86,#BBCB92,#71C2EF,#3BFFFF,#DD7DDF)] 
                       [background-size:200%] text-transparent bg-clip-text font-medium"
            onClick={(e) => handleSmoothScroll(e, "#Contact")}
          >
            Contact Now
          </a>
        </div>
      </div>

      {/* Navigation */}
      <div className="py-5">
        <div className="container">
          <div className="flex items-center justify-between">
            <nav className="hidden md:flex gap-6 text-black/60 items-center" role="navigation">
              <a href="#Home" onClick={(e) => handleSmoothScroll(e, "#Home")}>Home</a>
              <a href="#About" onClick={(e) => handleSmoothScroll(e, "#About")}>About</a>
              <a href="#Pricing" onClick={(e) => handleSmoothScroll(e, "#Pricing")}>Pricing</a>
              <a href="#Testimonials" onClick={(e) => handleSmoothScroll(e, "#Testimonials")}>Testimonials</a>
              <a 
                href="#Contact"
                onClick={(e) => handleSmoothScroll(e, "#Contact")}
                className="bg-black text-white px-4 py-2 rounded-lg font-medium inline-flex items-center justify-center tracking-tight"
              >
                Contact
              </a>
              <a href="#Footer" onClick={(e) => handleSmoothScroll(e, "#Footer")}>Footer</a>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};
