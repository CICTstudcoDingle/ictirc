import PortalNavbar from "@/components/layout/portal-navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-page-core min-h-screen">
      <PortalNavbar />
      <main className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
