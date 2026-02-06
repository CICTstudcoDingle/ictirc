"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Rocket, Shield, BookOpen } from "lucide-react";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 navbar-glass h-16 safe-area-top">
        <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 -ml-2 text-gray-600 hover:text-maroon transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            
            <Link href="/" className="flex items-center gap-3">
              <div className="flex items-center -space-x-2">
                <div className="relative z-30 bg-white rounded-full p-0.5 shadow-sm">
                  <Image
                    src="/images/irjict-logo.png"
                    alt="IRJICT Logo"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                  />
                </div>
                <div className="relative z-20 bg-white rounded-full p-0.5 shadow-sm">
                  <Image
                    src="/images/CICT_LOGO.png"
                    alt="CICT Logo"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                  />
                </div>
                <div className="relative z-10 bg-white rounded-full p-0.5 shadow-sm">
                  <Image
                    src="/images/ISUFST_LOGO.png"
                    alt="ISUFST Logo"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                  />
                </div>
              </div>
              
              <div className="hidden sm:block">
                <h1 className="text-sm font-bold text-maroon leading-tight tracking-tight">
                  ICTIRC DOCS
                </h1>
                <p className="text-[10px] text-gray-500 font-mono tracking-wide">
                  v2.0 • MONOREPO
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <NavLink href="/" icon={<BookOpen className="w-4 h-4" />}>
              Home
            </NavLink>
            <NavLink href="/getting-started" icon={<Rocket className="w-4 h-4" />}>
              Getting Started
            </NavLink>
            <NavLink href="/admin" icon={<Shield className="w-4 h-4" />}>
              Admin Guide
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div 
            className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl flex flex-col pt-20 px-6"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="space-y-2">
              <MobileNavLink href="/" onClick={() => setIsMobileMenuOpen(false)}>
                Home
              </MobileNavLink>
              <MobileNavLink href="/getting-started" onClick={() => setIsMobileMenuOpen(false)}>
                Getting Started
              </MobileNavLink>
              <MobileNavLink href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                Admin Guide
              </MobileNavLink>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

function NavLink({ href, children, icon }: { href: string; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-maroon hover:bg-maroon/5 rounded-md transition-all"
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block w-full py-3 text-base font-medium text-gray-700 hover:text-maroon border-b border-gray-100"
    >
      {children}
    </Link>
  );
}
