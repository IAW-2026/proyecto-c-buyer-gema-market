import type { Metadata, Viewport } from "next";
import "./globals.css";

import { inter, jetbrainsMono } from "./lib/fonts";
import { SideNav } from "./components/layout/SideNav";
import { BottomNav } from "./components/layout/BottomNav";

export const metadata: Metadata = {
  title: "UniHousing — Tu mudanza simplificada",
  description: "Marketplace de muebles y deco para estudiantes de la UNS.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "UniHousing",
  },
};

export const viewport: Viewport = {
  themeColor: "#faf8f3",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full bg-cream text-ink font-sans">
        {/* Desktop sidebar */}
        <SideNav />

        {/* Page content — shifted right on desktop */}
        <main className="pb-16 lgx:pb-0 lgx:ml-60">{children}</main>

        {/* Mobile bottom navigation */}
        <BottomNav />
      </body>
    </html>
  );
}
