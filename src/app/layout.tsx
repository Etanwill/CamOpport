// src/app/layout.tsx
import type { Metadata } from "next";
import "@/styles/globals.css";
import { SessionProvider } from "./session-provider";
import SidebarWrapper from "@/components/layout/SidebarWrapper";

// Bump this whenever the favicon image itself changes. Appending it as a
// query string forces browsers (Chrome especially, which caches favicons
// far more aggressively than normal assets) to treat it as a new URL and
// fetch it fresh, instead of silently reusing a stale cached icon.
const ICON_VERSION = "2";

export const metadata: Metadata = {
  title: "Unbound – Opportunities in Cameroon",
  description: "Find jobs, competitions, internships and grow your career in Cameroon",
  icons: {
    icon: [
      { url: `/favicon.ico?v=${ICON_VERSION}`, sizes: "any" },
      { url: `/favicon-16x16.png?v=${ICON_VERSION}`, sizes: "16x16", type: "image/png" },
      { url: `/favicon-32x32.png?v=${ICON_VERSION}`, sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: `/apple-touch-icon.png?v=${ICON_VERSION}`, sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#f6f7fb]">
        <SessionProvider>
          <SidebarWrapper>
            {children}
          </SidebarWrapper>
        </SessionProvider>
      </body>
    </html>
  );
}