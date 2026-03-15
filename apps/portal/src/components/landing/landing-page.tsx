"use client";

import HeroSection from "./hero-section";
import FeaturesSection from "./features-section";
import LiveCounter from "./live-counter";
import OrgChartPreview from "./org-chart-preview";
import ThroughTheYearsPreview from "./through-the-years-preview";
import RetractableWidgetPanel from "./retractable-widget-panel";
import PublicNavbar from "../layout/public-navbar";
import Link from "next/link";

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
                  <Link href="/login" className="btn-primary">
                    Enter Portal
                  </Link>
                  <Link href="/announcements" className="btn-secondary">
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
                href={process.env.NEXT_PUBLIC_IRJICT_URL || "#"}
                className="hover:text-gold-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                IRJICT ↗
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

