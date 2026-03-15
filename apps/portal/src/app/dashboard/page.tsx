import { createClient } from "@/lib/supabase/server";
import { prisma } from "@ictirc/database";
import { redirect } from "next/navigation";
import {
  Calendar,
  Megaphone,
  Users,
  GraduationCap,
  CreditCard,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Dashboard",
};

export default async function StudentDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch profile
  let profile = null;
  try {
    profile = await prisma.portalProfile.findUnique({
      where: { id: user.id },
    });
  } catch {
    // Profile might not exist yet
  }

  // Stats
  let upcomingEvents = 0;
  let announcements = 0;
  try {
    [upcomingEvents, announcements] = await Promise.all([
      prisma.portalEvent.count({
        where: { status: "UPCOMING", isActive: true },
      }),
      prisma.portalAnnouncement.count({
        where: { status: "PUBLISHED" },
      }),
    ]);
  } catch {
    // Tables might not exist yet
  }

  const quickLinks = [
    {
      href: "/announcements",
      label: "Announcements",
      count: announcements,
      icon: Megaphone,
      color: "bg-gold/10 text-gold-400",
    },
    {
      href: "/events",
      label: "Upcoming Events",
      count: upcomingEvents,
      icon: Calendar,
      color: "bg-blue-500/10 text-blue-400",
    },
    {
      href: "/org-chart",
      label: "Org Chart",
      count: null,
      icon: Users,
      color: "bg-emerald-500/10 text-emerald-400",
    },
    {
      href: "/profile",
      label: "My Profile",
      count: null,
      icon: GraduationCap,
      color: "bg-purple-500/10 text-purple-400",
    },
  ];

  return (
    <div>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-white">
          Welcome back
          {profile?.name ? `, ${profile.name.split(" ")[0]}` : ""}
          <span className="text-gradient-gold">.</span>
        </h1>
        <p className="text-white/50 mt-1">
          {profile?.course
            ? `${profile.course} — Year ${profile.yearLevel || "?"}`
            : "Your CICT Student Portal dashboard."}
        </p>
      </div>

      {/* Quick Links Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="glass-card-elevated p-5 group hover:scale-[1.02] transition-transform"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${link.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                {link.count !== null && (
                  <span className="text-2xl font-display font-bold text-white">
                    {link.count}
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                {link.label}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Announcements */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">
              Recent Announcements
            </h2>
            <Link
              href="/announcements"
              className="text-xs text-gold-400 hover:text-gold-300"
            >
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-white/40">
              Announcements will appear here once published.
            </p>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">
              Upcoming Events
            </h2>
            <Link
              href="/events"
              className="text-xs text-gold-400 hover:text-gold-300"
            >
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-white/40">
              Events will appear here as they are scheduled.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
