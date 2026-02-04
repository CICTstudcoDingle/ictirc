import Link from "next/link";
import Image from "next/image";
import { Facebook, ExternalLink, Store, GraduationCap, Mail, Phone, Globe, Linkedin, Youtube } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#5c0202] border-t border-white/10 mt-auto overflow-hidden text-white pb-24 md:pb-0">
      {/* Subtle texture overlay using CSS patterns */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(255,255,255,0.05)_2px,rgba(255,255,255,0.05)_4px)]"
      />

      {/* Radial Spotlight & Sheen */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08)_0%,transparent_70%)]" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/20 to-black/40" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white rounded-lg p-1.5 shadow-sm">
                <Image
                  src="/images/irjict-logo.png"
                  alt="IRJICT Logo"
                  width={48}
                  height={48}
                  className="w-10 h-10"
                />
              </div>
              <Image
                src="/images/CICT_LOGO.png"
                alt="CICT Logo"
                width={48}
                height={48}
                className="w-10 h-10 md:w-11 md:h-11"
              />
              <Image
                src="/images/ISUFST_LOGO.png"
                alt="ISUFST Logo"
                width={64}
                height={64}
                className="w-12 h-12 md:w-14 md:h-14"
              />
              <div>
                <h3 className="font-bold text-white text-lg leading-tight">IRJICT</h3>
                <p className="text-xs text-white/70">
                  Intl. Research Journal on ICT
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-100 max-w-sm mb-2">
              International Research Journal on Information and Communications Technology (IRJICT) - A scholarly publication platform by ISUFST-CICT.
            </p>
            <p className="text-xs font-mono text-white/60 mb-4">
              ISSN No.: 2960-3773
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href="https://isufst.edu.ph/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-medium transition-colors"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                ISUFST Website
              </a>
              <a
                href="https://cictstore.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gold/20 hover:bg-gold/30 text-gold rounded-full text-xs font-medium transition-colors border border-gold/20"
              >
                <Store className="w-3.5 h-3.5" />
                CICT Store
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: "Browse Archive", href: "/archive" },
                { label: "Conferences", href: "/conferences" },
                { label: "Submit Paper", href: "/submit" },
                { label: "Research Guides", href: "/guides" },
                { label: "About IRJICT", href: "/about" },
                { label: "FAQ", href: "/faq" },
                { label: "Search Repository", href: "/search" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-200 hover:text-white hover:translate-x-1 inline-block transition-all"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Socials */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-2.5 text-sm text-gray-200 mb-4">
              <li className="flex items-start gap-2">
                <GraduationCap className="w-4 h-4 shrink-0 mt-0.5 text-gold" />
                <span>ISUFST - CICT Department<br />Dingle Campus, Iloilo</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0 text-gold" />
                <a href="mailto:ictirc@isufst.edu.ph" className="hover:text-white transition-colors font-mono text-xs">
                  ictirc@isufst.edu.ph
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 text-gold" />
                <span className="font-mono text-xs">+63-33-5801815</span>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-4 h-4 shrink-0 text-gold" />
                <a href="https://isufst.edu.ph" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors text-xs">
                  isufst.edu.ph
                </a>
              </li>
            </ul>

            {/* Social Media Links */}
            <h4 className="font-semibold text-white mb-2 text-sm">Follow Us</h4>
            <div className="space-y-2">
              <a
                href="https://www.facebook.com/profile.php?id=100068849010766"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-200 hover:text-white transition-colors"
              >
                <Facebook className="w-4 h-4" />
                <span>CICT Official Page</span>
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61587106231483"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-200 hover:text-white transition-colors"
              >
                <Facebook className="w-4 h-4" />
                <span>CICT Student Council</span>
              </a>
              {/* Add more social links as they become available */}
              {/* <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-200 hover:text-white transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-200 hover:text-white transition-colors"
              >
                <Youtube className="w-4 h-4" />
                <span>YouTube</span>
              </a> */}
            </div>
          </div>
        </div>

        {/* Disclaimer Section */}
        <div className="mt-12 pt-8 border-t border-white/5">
          <h5 className="font-mono text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-3">
            Disclaimer
          </h5>
          <p className="text-[11px] leading-relaxed text-white/50 font-light italic max-w-5xl">
            The information presented on this website is intended for educational and informational purposes. While we strive for accuracy, the organizers reserve the right to modify the conference program, dates, venue, or other details as required. We encourage attendees to monitor the website for updates. The organizers assume no liability for any expenses incurred due to cancellations or modifications beyond our reasonable control.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <p className="text-sm text-gray-300">
              © {currentYear} IRJICT. All rights reserved.
            </p>
            <p className="text-xs text-gray-400 font-mono">
              CC BY-ND 4.0 Licensed
            </p>
          </div>

          {/* Powered by & Built with */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Main attribution */}
            <div className="px-3 py-1.5 bg-white/10 text-white rounded-full text-xs font-medium border border-white/10">
              Powered by CICT-ISUFST Dingle Campus
            </div>
            
            {/* Secondary tech credit */}
            <a
              href="https://prism.jeffdev.studio/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1.5 px-2 py-1 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white rounded-full text-xs transition-all hover:shadow-md"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-3 h-3"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  fill="url(#prism-gradient)"
                  className="opacity-80"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="url(#prism-gradient)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="url(#prism-gradient)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient id="prism-gradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#a855f7" />
                    <stop offset="0.5" stopColor="#ec4899" />
                    <stop offset="1" stopColor="#f97316" />
                  </linearGradient>
                </defs>
              </svg>
              <span>Built with Prism Context Engine</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-50 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
