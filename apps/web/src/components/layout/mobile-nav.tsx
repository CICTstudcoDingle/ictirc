"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Home, FileText, Calendar, BookOpen, HelpCircle, Info, PlusCircle, Users, Award, Film } from "lucide-react";
import { cn } from "@ictirc/ui";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/about", label: "About", icon: Info },
  { href: "/committees", label: "Committees", icon: Users },
  { href: "/sponsors", label: "Sponsors", icon: Award },
  { href: "/promotional-videos", label: "Promotional Videos", icon: Film },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
  { href: "/guides", label: "Guides", icon: BookOpen },
  { href: "/conferences", label: "Conferences", icon: Calendar },
  { href: "/archive", label: "Archive", icon: FileText },
  { href: "/submit", label: "Submit Research", icon: PlusCircle, highlight: true },
];

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 md:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-[70] w-72 bg-white shadow-2xl md:hidden transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src="/images/irjict-logo.png"
                alt="IRJICT Logo"
                className="w-8 h-8"
              />
              <span className="font-bold text-maroon">IRJICT</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-maroon transition-colors"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200",
                    isActive
                      ? "bg-maroon text-white shadow-md shadow-maroon/20"
                      : item.highlight
                      ? "text-maroon bg-maroon/5 border border-maroon/20"
                      : "text-gray-600 hover:bg-gray-50 hover:text-maroon"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-current")} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer/Institutional */}
          <div className="p-6 border-t border-gray-100 bg-gray-50/50">
            <p className="text-xs text-gray-500 text-center uppercase tracking-widest font-semibold mb-2">
              Institutional Repository
            </p>
            <p className="text-[10px] text-gray-400 text-center leading-relaxed">
              International Research Journal on Information and Communications Technology
              © {new Date().getFullYear()} ISUFST
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
