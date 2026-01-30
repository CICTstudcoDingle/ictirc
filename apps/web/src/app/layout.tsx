import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { ToastProvider } from "@/lib/use-toast";
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://ictirc.isufst.edu.ph"),
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
    "peer review",
    "scholarly articles",
    "CICT",
  ],
  authors: [{ name: "ISUFST - CICT", url: "https://isufst.edu.ph" }],
  creator: "ISUFST College of Information and Computing Technology",
  publisher: "ISUFST CICT",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/images/CICT_LOGO.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [
      { url: "/images/CICT_LOGO.png", sizes: "180x180" },
    ],
    shortcut: "/images/CICT_LOGO.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "ICTIRC Research Repository",
    title: "ICTIRC - ICT International Research Conference",
    description: "A scholarly publication platform for ICT research from ISUFST CICT.",
    images: [
      {
        url: "/images/CICT_LOGO.png",
        width: 512,
        height: 512,
        alt: "ICTIRC Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "ICTIRC Research Repository",
    description: "A scholarly publication platform for ICT research from ISUFST CICT.",
    images: ["/images/CICT_LOGO.png"],
  },
  alternates: {
    canonical: "/",
  },
  category: "education",
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
        <ToastProvider>
          <SmoothScrollProvider>
            <Header />
            <main className="pb-nav">{children}</main>
            <Footer />

            {/* Mobile-only components */}
            <FloatingActionButton />
            <BottomNav />
          </SmoothScrollProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
