"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, ChevronDown } from "lucide-react";
import { cn } from "@ictirc/ui";
import { MobileNav } from "./mobile-nav";

export function Header() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isAcademicsDropdownOpen, setIsAcademicsDropdownOpen] = useState(false);
  const academicsDropdownRef = useRef<HTMLDivElement>(null);

  const closeAcademicsDropdown = () => setIsAcademicsDropdownOpen(false);
  const toggleAcademicsDropdown = () => setIsAcademicsDropdownOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (academicsDropdownRef.current && !academicsDropdownRef.current.contains(event.target as Node)) {
        closeAcademicsDropdown();
      }
    };

    if (isAcademicsDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAcademicsDropdownOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 navbar-glass h-14 md:h-16 safe-area-top">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-4">
              {/* Hamburger Menu - Mobile only */}
              <button
                onClick={() => setIsMobileNavOpen(true)}
                className="md:hidden p-2 -ml-2 text-gray-600 hover:text-maroon transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 md:gap-3">
                <Image
                  src="/images/CICT_LOGO.png"
                  alt="CICT Logo"
                  width={40}
                  height={40}
                  className="w-8 h-8 md:w-10 md:h-10 object-contain"
                />
                <Image
                  src="/images/ISUFST_LOGO.png"
                  alt="ISUFST Logo"
                  width={44}
                  height={44}
                  className="w-9 h-9 md:w-11 md:h-11 object-contain"
                />
                <div className="hidden sm:block">
                  <h1 className="text-base md:text-lg font-bold text-maroon tracking-tight leading-tight">
                    CICT
                  </h1>
                  <p className="text-xs text-gray-500 -mt-0.5">
                    ISUFST Dingle Campus
                  </p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="/"
                className="text-gray-700 hover:text-maroon transition-colors font-medium"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-maroon transition-colors font-medium"
              >
                About
              </Link>

              {/* Academics Dropdown */}
              <div
                ref={academicsDropdownRef}
                className="relative"
                onMouseEnter={() => setIsAcademicsDropdownOpen(true)}
                onMouseLeave={closeAcademicsDropdown}
              >
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={isAcademicsDropdownOpen}
                  onClick={toggleAcademicsDropdown}
                  className="flex items-center gap-1 text-gray-700 hover:text-maroon transition-colors font-medium"
                >
                  Academics
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform",
                      isAcademicsDropdownOpen && "rotate-180"
                    )}
                  />
                </button>

                {isAcademicsDropdownOpen && (
                  <div className="absolute top-full left-0 pt-2 z-[100]">
                    <div
                      role="menu"
                      aria-label="Academics"
                      className="bg-white rounded-lg shadow-lg border border-gray-100 py-2 w-48"
                    >
                      <Link
                        href="/programs"
                        role="menuitem"
                        className="block px-4 py-2 text-gray-700 hover:bg-maroon/5 hover:text-maroon transition-colors"
                        onClick={closeAcademicsDropdown}
                      >
                        Programs
                      </Link>
                      <Link
                        href="/faculty"
                        role="menuitem"
                        className="block px-4 py-2 text-gray-700 hover:bg-maroon/5 hover:text-maroon transition-colors"
                        onClick={closeAcademicsDropdown}
                      >
                        Faculty & Staff
                      </Link>
                      <Link
                        href="/facilities"
                        role="menuitem"
                        className="block px-4 py-2 text-gray-700 hover:bg-maroon/5 hover:text-maroon transition-colors"
                        onClick={closeAcademicsDropdown}
                      >
                        Facilities
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/students"
                className="text-gray-700 hover:text-maroon transition-colors font-medium"
              >
                Students
              </Link>
              <Link
                href="/alumni"
                className="text-gray-700 hover:text-maroon transition-colors font-medium"
              >
                Alumni
              </Link>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href="https://irjict.isufstcict.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-maroon transition-colors font-medium text-sm"
              >
                Research Journal
              </a>
            </div>

            {/* Mobile: CICT text centered */}
            <h1 className="sm:hidden text-maroon font-bold text-base absolute left-1/2 -translate-x-1/2 pointer-events-none">
              CICT
            </h1>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />
    </>
  );
}
