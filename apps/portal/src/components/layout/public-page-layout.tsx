import PublicNavbar from "@/components/layout/public-navbar";

export default function PublicPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-page-core">
      <PublicNavbar />
      <main className="pt-28 pb-16">{children}</main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} CICT Student Council — ISUFST Dingle
            Campus. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
