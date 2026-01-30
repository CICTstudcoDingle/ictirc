import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { BottomNav, FloatingActionButton } from "@ictirc/ui";
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
    default: "ICTIRC - Information and Communication Technology International Research Conference",
    template: "%s | ICTIRC",
  },
  description:
    "Iloilo State University of Fisheries Science and Technology - College of Information and Communications Technology International Research Conference - A scholarly publication platform for ICT research.",
  keywords: [
    "research",
    "ICT",
    "information technology",
    "computing",
    "ISUFST",
    "conference",
    "academic papers",
  ],
  authors: [{ name: "ISUFST - CICT" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "ICTIRC",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-white font-sans">
        <SmoothScrollProvider>
          <Header />
          <main className="pb-nav">{children}</main>
          <Footer />

          {/* Mobile-only components */}
          <FloatingActionButton />
          <BottomNav />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
