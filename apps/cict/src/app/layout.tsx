import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { CICTBottomNav } from "@/components/layout/bottom-nav";
import { ChatbotWidget } from "@/components/ui/chatbot";
import { EnrollmentPopupModal } from "@/components/home/enrollment-popup-modal";
import { generateOrganizationJsonLd, generateWebsiteJsonLd } from "@ictirc/seo";
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://isufstcict.com"),
  title: {
    default: "CICT — College of Information and Communication Technology | ISUFST",
    template: "%s | CICT — ISUFST",
  },
  description:
    "Official website of the College of Information and Communication Technology (CICT) at Iloilo State University of Fisheries Science and Technology — Dingle Campus. Explore our programs, faculty, student enrollment, and alumni.",
  keywords: [
    "CICT",
    "ISUFST",
    "College of Information and Communication Technology",
    "Iloilo State University",
    "BSIT",
    "BSCS",
    "ACT",
    "Information Technology",
    "Computer Science",
    "Dingle Campus",
    "Philippines",
    "higher education",
    "IT education",
  ],
  authors: [{ name: "ISUFST - CICT", url: "https://isufst.edu.ph" }],
  creator: "ISUFST College of Information and Communication Technology",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "CICT — ISUFST Dingle Campus",
    title: "CICT — College of Information and Communication Technology",
    description:
      "Official website of the College of Information and Communication Technology at ISUFST Dingle Campus.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "CICT — College of Information and Communication Technology | ISUFST",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CICT — ISUFST Dingle Campus",
    description:
      "Official website of the College of Information and Communication Technology at ISUFST Dingle Campus.",
    images: ["/opengraph-image"],
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
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://isufstcict.com";

  const organizationData = generateOrganizationJsonLd({
    name: "ISUFST — College of Information and Communication Technology",
    alternateName: "CICT",
    url: baseUrl,
    logo: `${baseUrl}/images/CICT_LOGO.png`,
    description:
      "The College of Information and Communication Technology (CICT) at Iloilo State University of Fisheries Science and Technology — Dingle Campus. Offering BSIT, BSCS, and ACT programs.",
    email: ["cict_dingle@isufst.edu.ph"],
    telephone: "+63-33-3371544",
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
      "https://irjict.isufstcict.com",
    ],
  });

  const websiteData = generateWebsiteJsonLd(
    baseUrl,
    "CICT — ISUFST",
    `${baseUrl}/`
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
        <SmoothScrollProvider>
          <Header />
          <main className="pb-nav">{children}</main>
          <Footer />

          {/* Mobile-only components */}
          <CICTBottomNav />

          {/* Global overlays */}
          <EnrollmentPopupModal />
          <ChatbotWidget />
        </SmoothScrollProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
