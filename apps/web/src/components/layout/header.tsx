"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Menu, ChevronDown } from "lucide-react";
import { Button, cn } from "@ictirc/ui";
import { MobileNav } from "./mobile-nav";

export function Header() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);
  const [isResourcesDropdownOpen, setIsResourcesDropdownOpen] = useState(false);
  const orgDropdownRef = useRef<HTMLDivElement>(null);
  const resourcesDropdownRef = useRef<HTMLDivElement>(null);

  const closeOrgDropdown = () => setIsOrgDropdownOpen(false);
  const toggleOrgDropdown = () => setIsOrgDropdownOpen((prev) => !prev);

  const closeResourcesDropdown = () => setIsResourcesDropdownOpen(false);
  const toggleResourcesDropdown = () => setIsResourcesDropdownOpen((prev) => !prev);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (orgDropdownRef.current && !orgDropdownRef.current.contains(event.target as Node)) {
        closeOrgDropdown();
      }
      if (resourcesDropdownRef.current && !resourcesDropdownRef.current.contains(event.target as Node)) {
        closeResourcesDropdown();
      }
    };

    if (isOrgDropdownOpen || isResourcesDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOrgDropdownOpen, isResourcesDropdownOpen]);

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
                  src="/images/irjict-logo.png"
                  alt="IRJICT Logo"
                  width={40}
                  height={40}
                  className="w-8 h-8 md:w-10 md:h-10"
                />
                <div className="hidden sm:block">
                  <h1 className="text-base md:text-lg font-bold text-maroon tracking-tight">
                    IRJICT
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

              {/* Organization Dropdown */}
              <div
                ref={orgDropdownRef}
                className="relative"
                onMouseEnter={() => setIsOrgDropdownOpen(true)}
                onMouseLeave={closeOrgDropdown}
              >
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={isOrgDropdownOpen}
                  onClick={toggleOrgDropdown}
                  className="flex items-center gap-1 text-gray-700 hover:text-maroon transition-colors font-medium"
                >
                  Organization
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform",
                      isOrgDropdownOpen && "rotate-180"
                    )}
                  />
                </button>

                {isOrgDropdownOpen && (
                  <div className="absolute top-full left-0 pt-2 z-[100]">
                    <div
                      role="menu"
                      aria-label="Organization"
                      className="bg-white rounded-lg shadow-lg border border-gray-100 py-2 w-48"
                    >
                      <Link
                        href="/committees"
                        role="menuitem"
                        className="block px-4 py-2 text-gray-700 hover:bg-maroon/5 hover:text-maroon transition-colors"
                        onClick={closeOrgDropdown}
                      >
                        Committees
                      </Link>
                      <Link
                        href="/sponsors"
                        role="menuitem"
                        className="block px-4 py-2 text-gray-700 hover:bg-maroon/5 hover:text-maroon transition-colors"
                        onClick={closeOrgDropdown}
                      >
                        Sponsors
                      </Link>
                      <Link
                        href="/promotional-videos"
                        role="menuitem"
                        className="block px-4 py-2 text-gray-700 hover:bg-maroon/5 hover:text-maroon transition-colors"
                        onClick={closeOrgDropdown}
                      >
                        Promotional Videos
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Resources Dropdown */}
              <div
                ref={resourcesDropdownRef}
                className="relative"
                onMouseEnter={() => setIsResourcesDropdownOpen(true)}
                onMouseLeave={closeResourcesDropdown}
              >
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={isResourcesDropdownOpen}
                  onClick={toggleResourcesDropdown}
                  className="flex items-center gap-1 text-gray-700 hover:text-maroon transition-colors font-medium"
                >
                  Resources
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform",
                      isResourcesDropdownOpen && "rotate-180"
                    )}
                  />
                </button>

                {isResourcesDropdownOpen && (
                  <div className="absolute top-full left-0 pt-2 z-[100]">
                    <div
                      role="menu"
                      aria-label="Resources"
                      className="bg-white rounded-lg shadow-lg border border-gray-100 py-2 w-48"
                    >
                      <Link
                        href="/guides"
                        role="menuitem"
                        className="block px-4 py-2 text-gray-700 hover:bg-maroon/5 hover:text-maroon transition-colors"
                        onClick={closeResourcesDropdown}
                      >
                        Research Guidelines
                      </Link>
                      <Link
                        href="/faq"
                        role="menuitem"
                        className="block px-4 py-2 text-gray-700 hover:bg-maroon/5 hover:text-maroon transition-colors"
                        onClick={closeResourcesDropdown}
                      >
                        FAQ
                      </Link>
                      <Link
                        href="/conferences"
                        role="menuitem"
                        className="block px-4 py-2 text-gray-700 hover:bg-maroon/5 hover:text-maroon transition-colors"
                        onClick={closeResourcesDropdown}
                      >
                        Conferences
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/archive"
                className="text-gray-700 hover:text-maroon transition-colors font-medium"
              >
                Archive
              </Link>
              <Link
                href="/authors"
                className="text-gray-700 hover:text-maroon transition-colors font-medium"
              >
                Authors
              </Link>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/search"
                className="p-2 text-gray-500 hover:text-maroon transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </Link>
              <Link
                href="https://ictirc-author.vercel.app/login"
                className="text-gray-700 hover:text-maroon transition-colors font-medium text-sm"
              >
                Author Portal
              </Link>
              <Link href="/submit">
                <Button size="sm">Submit Research</Button>
              </Link>
            </div>

            {/* Mobile: IRJICT text centered */}
            <h1 className="sm:hidden text-maroon font-bold text-base absolute left-1/2 -translate-x-1/2 pointer-events-none">
              IRJICT
            </h1>

            {/* Mobile: Search icon on far right */}
            <Link
              href="/search"
              className="sm:hidden p-2 text-gray-500 hover:text-maroon transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </Link>
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
