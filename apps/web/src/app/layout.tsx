import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { ToastProvider } from "@/lib/use-toast";
import { FloatingActionButton } from "@ictirc/ui";
import { WebBottomNav } from "@/components/layout/bottom-nav";
import { generateOrganizationJsonLd, generateWebsiteJsonLd } from "@ictirc/seo";
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://irjict.isufst.edu.ph"),
  title: {
    default: "IRJICT - International Research Journal on Information and Communications Technology",
    template: "%s | IRJICT",
  },
  description:
    "International Research Journal on Information and Communications Technology (IRJICT) - A scholarly publication platform for ICT research. ISSN: 2960-3773.",
  keywords: [
    "research journal",
    "IRJICT",
    "ISSN 2960-3773",
    "ICT",
    "information technology",
    "computing",
    "ISUFST",
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
      { url: "/images/irjict-logo.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [
      { url: "/images/irjict-logo.png", sizes: "180x180" },
    ],
    shortcut: "/images/irjict-logo.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "IRJICT Research Journal",
    title: "IRJICT - International Research Journal on ICT",
    description: "A scholarly publication platform for ICT research from ISUFST CICT.",
    images: [
      {
        url: "/images/irjict-logo.png",
        width: 512,
        height: 512,
        alt: "IRJICT Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "IRJICT Research Journal",
    description: "A scholarly publication platform for ICT research from ISUFST CICT.",
    images: ["/images/irjict-logo.png"],
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
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://irjict.isufst.edu.ph";

  // Organization structured data for rich results
  const organizationData = generateOrganizationJsonLd({
    name: "IRJICT - International Research Journal on Information and Communications Technology",
    alternateName: "IRJICT",
    url: baseUrl,
    logo: `${baseUrl}/images/irjict-logo.png`,
    description:
      "International Research Journal on Information and Communications Technology (IRJICT) - A scholarly publication platform by ISUFST College of Information and Computing Technology",
    email: "ictirc@isufst.edu.ph",
    telephone: "+63-33-5801815",
    address: {
      streetAddress: "ISUFST Dingle Campus",
      addressLocality: "Dingle",
      addressRegion: "Iloilo",
      addressCountry: "PH",
    },
    sameAs: [
      "https://www.facebook.com/profile.php?id=100068849010766",
      "https://www.facebook.com/profile.php?id=61587106231483",
      "https://isufst.edu.ph",
      "https://cictstore.me",
    ],
  });

  // Website structured data with search action
  const websiteData = generateWebsiteJsonLd(
    baseUrl,
    "IRJICT Research Journal",
    `${baseUrl}/search`
  );

  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
        />
      </head>
      <body className="min-h-screen bg-white font-sans">
        <ToastProvider>
          <SmoothScrollProvider>
            <Header />
            <main className="pb-nav">{children}</main>
            <Footer />

            {/* Mobile-only components */}
            <FloatingActionButton />
            <WebBottomNav />
          </SmoothScrollProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
