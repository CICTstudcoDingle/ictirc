import { Sidebar } from "./sidebar";
import { Header } from "./layout/header";
import { Footer } from "./layout/footer";

export function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <div className="flex flex-1 pt-16">
        <Sidebar />
        
        <main className="flex-1 lg:pl-64 flex flex-col min-h-[calc(100vh-4rem)]">
          <div className="max-w-5xl mx-auto px-6 py-10 w-full flex-1">
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
