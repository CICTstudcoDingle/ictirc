import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { Button } from "@ictirc/ui";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 navbar-glass h-14 md:h-16 safe-area-top">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo - Always visible */}
          <Link href="/" className="flex items-center gap-2 md:gap-3">
            <Image
              src="/images/CICT_LOGO.png"
              alt="CICT Logo"
              width={40}
              height={40}
              className="w-8 h-8 md:w-10 md:h-10"
            />
            {/* Text - Hidden on mobile for minimal look */}
            <div className="hidden sm:block">
              <h1 className="text-base md:text-lg font-bold text-maroon tracking-tight">
                ICTIRC
              </h1>
              <p className="text-xs text-gray-500 -mt-0.5">
                ISUFST Dingle Campus
              </p>
            </div>
          </Link>

          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/archive"
              className="text-gray-700 hover:text-maroon transition-colors font-medium"
            >
              Archive
            </Link>
            <Link
              href="/conferences"
              className="text-gray-700 hover:text-maroon transition-colors font-medium"
            >
              Conferences
            </Link>
            <Link
              href="/submit"
              className="text-gray-700 hover:text-maroon transition-colors font-medium"
            >
              Submit Paper
            </Link>
            <Link
              href="/guides"
              className="text-gray-700 hover:text-maroon transition-colors font-medium"
            >
              Guides
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-maroon transition-colors font-medium"
            >
              About
            </Link>
          </nav>

          {/* Desktop Actions - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/search"
              className="p-2 text-gray-500 hover:text-maroon transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </Link>
            <Link href="/submit">
              <Button size="sm">Submit Research</Button>
            </Link>
          </div>

          {/* Mobile: ICTIRC text centered */}
          <h1 className="sm:hidden text-maroon font-bold text-base absolute left-1/2 -translate-x-1/2">
            ICTIRC
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
  );
}
