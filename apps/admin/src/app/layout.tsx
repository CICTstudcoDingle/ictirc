import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: {
    default: "ICTIRC Admin",
    template: "%s | ICTIRC Admin",
  },
  description: "Administration dashboard for ICTIRC Research Repository",
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: [
      { url: "/images/CICT_LOGO.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [
      { url: "/images/CICT_LOGO.png", sizes: "180x180" },
    ],
    shortcut: "/images/CICT_LOGO.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-gray-50 font-sans">{children}</body>
    </html>
  );
}
