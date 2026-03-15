"use client";

import HeroSection from "./hero-section";
import FeaturesSection from "./features-section";
import LiveCounter from "./live-counter";
import OrgChartPreview from "./org-chart-preview";
import ThroughTheYearsPreview from "./through-the-years-preview";
import RetractableWidgetPanel from "./retractable-widget-panel";
import PublicNavbar from "../layout/public-navbar";
import Link from "next/link";
import {
  BookOpen,
  GraduationCap,
  LogIn,
  ExternalLink,
} from "lucide-react";

const IRJICT_URL = "https://irjict.isufstcict.com/";
const GRADE_PORTAL_URL = "https://gradeportal.isufstcict.com/";

interface LandingPageProps {
  isLoggedIn: boolean;
}

export function LandingPage({ isLoggedIn }: LandingPageProps) {
  return (
    <main className="bg-black min-h-screen">
      {/* Public Floating Navbar */}
      <PublicNavbar />

      {/* Retractable Widget Panel (desktop, left side) */}
      <RetractableWidgetPanel />

      {/* Cinematic Hero */}
      <HeroSection isLoggedIn={isLoggedIn} />

      {/* Live Member Count */}
      <div className="bg-page-core">
        <LiveCounter />

        {/* Features */}
        <FeaturesSection />

        {/* Quick Links — IRJICT + Grade Portal */}
        <section className="py-16 px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="grid gap-6 md:grid-cols-3">
              {/* IRJICT Card */}
              <a
                href={IRJICT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm hover:border-gold-500/30 hover:bg-white/[0.06] transition-all"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-[60px] pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500/20 ring-1 ring-gold-500/30">
                      <BookOpen className="w-6 h-6 text-gold-400" />
                    </div>
                    <ExternalLink className="w-4 h-4 text-white/20 ml-auto group-hover:text-gold-400 transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-gold-400 transition-colors">
                    IRJICT Research Journal
                  </h3>
                  <p className="mt-2 text-sm text-white/50">
                    Browse published research papers from the College of
                    Information and Computing Technology.
                  </p>
                </div>
              </a>

              {/* Grade Portal Card */}
              <a
                href={GRADE_PORTAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm hover:border-gold-500/30 hover:bg-white/[0.06] transition-all"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-maroon-500/10 rounded-full blur-[60px] pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-maroon-500/20 ring-1 ring-maroon-500/30">
                      <GraduationCap className="w-6 h-6 text-maroon-400" />
                    </div>
                    <ExternalLink className="w-4 h-4 text-white/20 ml-auto group-hover:text-gold-400 transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-gold-400 transition-colors">
                    Grade Portal
                  </h3>
                  <p className="mt-2 text-sm text-white/50">
                    Access your grades, enrollment status, and academic records
                    through the official Grade Portal.
                  </p>
                </div>
              </a>

              {/* Enter Portal Card */}
              <Link
                href="/login"
                className="group relative overflow-hidden rounded-2xl border border-gold-500/20 bg-gradient-to-br from-gold-500/10 to-maroon-900/20 p-6 backdrop-blur-sm hover:border-gold-500/40 transition-all"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/15 rounded-full blur-[60px] pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500 ring-2 ring-gold-400/50 shadow-lg shadow-gold-500/30">
                      <LogIn className="w-6 h-6 text-maroon-900" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-gold-400 transition-colors">
                    Enter Student Portal
                  </h3>
                  <p className="mt-2 text-sm text-white/50">
                    Sign in to access your dashboard, event registrations,
                    and student services.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Org Chart Preview */}
        <OrgChartPreview />

        {/* IT Through the Years */}
        <ThroughTheYearsPreview />

        {/* CTA Section */}
        <section className="py-24 px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-white/50 mb-10 max-w-lg mx-auto">
              Join the CICT community and access all your student services
              in one place.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              {isLoggedIn ? (
                <Link href="/dashboard" className="btn-primary">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-maroon-900 font-bold text-lg hover:from-gold-400 hover:to-gold-500 transition-all shadow-lg shadow-gold-500/20"
                  >
                    <LogIn className="w-5 h-5" />
                    Enter Portal
                  </Link>
                  <Link
                    href="/announcements"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 border border-white/10 transition-all backdrop-blur-sm"
                  >
                    View Announcements
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 py-12 px-4">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="text-lg font-display font-bold text-gradient-gold">
                CICT Tech Portal
              </div>
              <p className="text-white/40 text-sm mt-1">
                Iloilo State University of Fisheries Science and Technology
                — Dingle Campus
              </p>
            </div>
            <div className="flex items-center gap-6 text-sm text-white/40">
              <Link
                href="/announcements"
                className="hover:text-white transition-colors"
              >
                Announcements
              </Link>
              <Link
                href="/events"
                className="hover:text-white transition-colors"
              >
                Events
              </Link>
              <Link
                href="/org-chart"
                className="hover:text-white transition-colors"
              >
                Org Chart
              </Link>
              <a
                href={IRJICT_URL}
                className="hover:text-gold-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                IRJICT ↗
              </a>
              <a
                href={GRADE_PORTAL_URL}
                className="hover:text-gold-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Grades ↗
              </a>
            </div>
          </div>
          <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-white/5 text-center">
            <p className="metadata-text">
              © {new Date().getFullYear()} CICT Student Council. All
              rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
