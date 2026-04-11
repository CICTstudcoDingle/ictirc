import Link from "next/link";
import Image from "next/image";
import { Facebook, ExternalLink, GraduationCap, Mail, Phone, Globe, Store } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#5c0202] border-t border-white/10 mt-auto overflow-hidden text-white pb-24 md:pb-0">
      {/* Subtle texture overlay */}
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
                  src="/images/CICT_LOGO.png"
                  alt="CICT Logo"
                  width={48}
                  height={48}
                  className="w-10 h-10 object-contain"
                />
              </div>
              <Image
                src="/images/ISUFST_LOGO.png"
                alt="ISUFST Logo"
                width={64}
                height={64}
                className="w-12 h-12 md:w-14 md:h-14 object-contain"
              />
              <div>
                <h3 className="font-bold text-white text-lg leading-tight">CICT</h3>
                <p className="text-xs text-white/70">
                  College of Information and Communication Technology
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-100 max-w-sm mb-2">
              The College of Information and Communication Technology (CICT) at ISUFST Dingle Campus — shaping the next generation of IT professionals and innovators.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-4">
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
                href="https://irjict.isufstcict.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gold/20 hover:bg-gold/30 text-gold rounded-full text-xs font-medium transition-colors border border-gold/20"
              >
                <Store className="w-3.5 h-3.5" />
                Research Journal
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: "Home", href: "/" },
                { label: "About CICT", href: "/about" },
                { label: "Programs Offered", href: "/programs" },
                { label: "Faculty & Staff", href: "/faculty" },
                { label: "Student Enrollment", href: "/students" },
                { label: "Alumni", href: "/alumni" },
                { label: "Facilities", href: "/facilities" },
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
          <div id="contact">
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-2.5 text-sm text-gray-200 mb-4">
              <li className="flex items-start gap-2">
                <GraduationCap className="w-4 h-4 shrink-0 mt-0.5 text-gold" />
                <span>ISUFST - CICT Department<br />Dingle Campus, Iloilo</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0 text-gold" />
                <a href="mailto:cict_dingle@isufst.edu.ph" className="hover:text-white transition-colors font-mono text-xs">
                  cict_dingle@isufst.edu.ph
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 text-gold" />
                <span className="font-mono text-xs">(033) 337 – 1544</span>
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
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <p className="text-sm text-gray-300">
              © {currentYear} CICT — ISUFST Dingle Campus. All rights reserved.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Version Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 text-white rounded-full text-xs font-mono border border-white/20">
              <span className="font-semibold">v1.0.0</span>
              <span className="opacity-50">•</span>
              <span className="opacity-70">git-{process.env.NEXT_PUBLIC_GIT_COMMIT_HASH || 'dev'}</span>
            </div>

            <div className="px-3 py-1.5 bg-white/10 text-white rounded-full text-xs font-medium border border-white/10">
              Powered by CICT-ISUFST Dingle Campus
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
