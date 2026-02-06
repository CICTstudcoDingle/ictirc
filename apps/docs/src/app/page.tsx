import Link from "next/link";
import { BookOpen, Shield, Users, FileText, Settings, Rocket } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200 p-12 text-center shadow-sm">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <BookOpen className="w-64 h-64 text-maroon" />
        </div>
        
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-maroon/5 text-maroon border border-maroon/10 text-xs font-semibold uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-maroon animate-pulse" />
            Official Documentation v2.0
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-6">
            ICTIRC <span className="text-maroon">Architecture</span> & <span className="text-gold">Workflow</span>
          </h1>
          
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            The definitive technical guide for the International Conference on Technology, Innovation, Research, and Creativity platform.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/getting-started"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white transition-all bg-maroon rounded-md shadow-[4px_4px_0px_0px_rgba(212,175,55,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(212,175,55,1)] active:translate-y-[0px] active:shadow-[2px_2px_0px_0px_rgba(212,175,55,1)]"
            >
              <Rocket className="w-4 h-4 mr-2" />
              Get Started
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-maroon bg-white border-2 border-maroon/20 rounded-md hover:bg-maroon/5 transition-all"
            >
              <Shield className="w-4 h-4 mr-2" />
              Admin Guide
            </Link>
          </div>
        </div>
      </section>

      {/* Topics Grid */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <div className="w-1 h-8 bg-maroon rounded-full" />
          Documentation Modules
        </h2>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card 
            href="/getting-started"
            icon={<Rocket className="w-6 h-6 text-maroon" />}
            title="Getting Started"
            description="Platform architecture overview, user roles, and core workflows for new users."
          />
          
          <Card 
            href="/admin"
            icon={<Shield className="w-6 h-6 text-maroon" />}
            title="Admin Guide"
            description="Comprehensive guide for system administrators, editors, and the Dean."
          />
          
          <Card 
            href="/admin/dashboard"
            icon={<BookOpen className="w-6 h-6 text-maroon" />}
            title="Dashboard Overview"
            description="Understanding analytics, KPIs, and the central command center."
          />
          
          <Card 
            href="/admin/papers"
            icon={<FileText className="w-6 h-6 text-maroon" />}
            title="Paper Management"
            description="Submission workflows, peer review process, and publication pipelines."
          />
          
          <Card 
            href="/admin/users"
            icon={<Users className="w-6 h-6 text-maroon" />}
            title="User Management"
            description="Role-Based Access Control (RBAC), permissions, and user administration."
          />
          
          <Card 
            href="/admin/settings"
            icon={<Settings className="w-6 h-6 text-maroon" />}
            title="God Mode"
            description="System-wide configuration, security protocols, and audit logs."
          />
        </div>
      </section>
    </div>
  );
}

function Card({ href, icon, title, description }: { href: string; icon: React.ReactNode; title: string; description: string }) {
  return (
    <Link href={href} className="group">
      <div className="h-full paper-card p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
          {icon}
        </div>
        
        <div className="mb-4 p-3 bg-maroon/5 w-fit rounded-lg group-hover:bg-maroon/10 transition-colors">
          {icon}
        </div>
        
        <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-maroon transition-colors">
          {title}
        </h3>
        
        <p className="text-sm text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
    </Link>
  );
}
