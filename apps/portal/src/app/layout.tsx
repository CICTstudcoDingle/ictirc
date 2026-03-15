import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Oswald } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CICT Tech Portal",
    template: "%s | CICT Tech Portal",
  },
  description:
    "The official portal of the CICT Student Council — Iloilo State University of Fisheries Science and Technology, Dingle Campus.",
  keywords: [
    "CICT",
    "ISUFST",
    "Student Council",
    "Tech Portal",
    "Dingle Campus",
    "Information and Communications Technology",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${oswald.variable}`}
    >
      <body className="bg-black text-white antialiased">{children}</body>
    </html>
  );
}
