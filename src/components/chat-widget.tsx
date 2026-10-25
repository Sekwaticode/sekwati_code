"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

// Jotform chat agent for the public site. Not loaded on /admin.
export function ChatWidget() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <Script src="https://cdn.jotfor.ms/agent/embedjs/01a0820926e8700085d1b03fd067189948c2/embed.js" />;
}
