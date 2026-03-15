"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ExternalLink } from "lucide-react";

const publicNavLinks = [
  { href: "/announcements", label: "Announcements" },
  { href: "/events", label: "Events" },
  { href: "/org-chart", label: "Org Chart" },
  { href: "/timeline", label: "Timeline" },
];

export default function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] hidden md:block">
        <div className="rounded-full border border-white/10 bg-black/60 px-6 py-3 backdrop-blur-xl shadow-lg flex items-center gap-6">
          {/* Logo */}
          <Link
            href="/"
            className="text-lg font-display font-bold text-gradient-gold mr-4"
          >
            CICT
          </Link>

          {/* Nav Links */}
          {publicNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 px-3 py-1.5 rounded-full transition-colors"
            >
              {link.label}
            </Link>
          ))}

          {/* IRJICT Link */}
          <a
            href={process.env.NEXT_PUBLIC_IRJICT_URL || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-white/40 hover:text-gold-400 transition-colors"
          >
            IRJICT
            <ExternalLink className="w-3 h-3" />
          </a>

          {/* Login */}
          <Link
            href="/login"
            className="px-4 py-1.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-maroon-900 text-sm font-bold shadow-sm hover:shadow-gold-500/30 transition-all"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-[60] md:hidden">
        <div className="border-b border-white/10 bg-black/60 backdrop-blur-xl px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="text-lg font-display font-bold text-gradient-gold"
          >
            CICT
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-white/70 hover:text-white"
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="border-b border-white/5 bg-black/80 backdrop-blur-xl px-4 py-4 space-y-1">
            {publicNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 mt-2 px-4 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-maroon-900 text-sm font-bold"
            >
              Sign In
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}
