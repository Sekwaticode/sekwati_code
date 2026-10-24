import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { twMerge } from "tailwind-merge";

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sekwaticode | Web Development for Businesses",
  description:
    "Web Solution Service for landing pages, websites, e-commerce sites and application development",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="relative">
      <body className={twMerge(dmSans.className, "antialiased bg-white")}>
        {/* Site-wide grid background, fixed behind every page */}
        <div className="fixed inset-0 -z-10">
          <div className="relative h-full w-full bg-white">
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
          </div>
        </div>
        {children}
      </body>
      <Script src="https://cdn.jotfor.ms/agent/embedjs/01a0820926e8700085d1b03fd067189948c2/embed.js" />
    </html>
  );
}
