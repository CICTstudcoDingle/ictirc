import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
    default: "Author Portal | ICTIRC",
    template: "%s | ICTIRC Author Portal",
  },
  description: "Manage and track your research submissions to ICTIRC",
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-muted font-sans">
        {children}
        <Toaster 
          position="top-right" 
          toastOptions={{
            style: {
              background: "#800000",
              color: "#fff",
              border: "none",
            },
          }}
        />
        <SpeedInsights />
      </body>
    </html>
  );
}
