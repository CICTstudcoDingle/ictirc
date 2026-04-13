"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, GraduationCap, WalletCards, ReceiptText, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/enrollments", label: "Enrollments", icon: GraduationCap },
  { href: "/dashboard/cashier", label: "Cashier", icon: WalletCards },
  { href: "/dashboard/receipts", label: "Receipts", icon: ReceiptText },
];

export function Sidebar() {
  const pathname = usePathname();

  const supabase = createClient();

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-64 border-r border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-4 py-4">
        <p className="text-xs uppercase tracking-widest text-gold font-semibold">CICT</p>
        <h1 className="text-lg font-bold text-maroon">Admin Console</h1>
        <p className="text-xs text-gray-500">Enrollment and cashier</p>
      </div>

      <nav className="space-y-1 p-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active ? "bg-maroon/10 text-maroon" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 w-full border-t border-gray-200 p-2">
        <button
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
          onClick={signOut}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
