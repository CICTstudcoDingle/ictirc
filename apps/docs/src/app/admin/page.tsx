import { DocsLayout } from "@/components/docs-layout";
import Link from "next/link";
import { BookOpen, Shield, Users, FileText, Settings } from "lucide-react";

export default function AdminGuidePage() {
  return (
    <DocsLayout>
      <article className="prose prose-gray max-w-none hover:prose-a:text-maroon prose-a:transition-colors prose-headings:text-maroon prose-strong:text-maroon">
        <h1>Admin Guide</h1>
        
        <p className="lead border-l-4 border-maroon/20 pl-4 italic text-gray-600">
          Complete guide for administrators managing the ICTIRC platform. Learn how to manage papers, 
          users, archives, and system settings.
        </p>

        <h2>Admin Portal Overview</h2>
        <p>
          The Admin Portal (accessible at <code>http://localhost:3001</code>) provides comprehensive 
          tools for managing all aspects of the ICTIRC platform.
        </p>

        <h2>Key Features</h2>
        
        <div className="not-prose grid gap-4 my-6">
          <Link href="/admin/dashboard" className="paper-card p-6 group">
            <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-maroon transition-colors flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-maroon" />
              Dashboard
            </h3>
            <p className="text-sm text-gray-600">
              View key metrics, recent submissions, platform statistics, and quick actions
            </p>
          </Link>

          <Link href="/admin/papers" className="paper-card p-6 group">
            <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-maroon transition-colors flex items-center gap-2">
              <FileText className="w-5 h-5 text-maroon" />
              Paper Management
            </h3>
            <p className="text-sm text-gray-600">
              Review submissions, assign reviewers, manage publications, and track paper workflows
            </p>
          </Link>

          <Link href="/admin/archives" className="paper-card p-6 group">
            <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-maroon transition-colors flex items-center gap-2">
              <Shield className="w-5 h-5 text-maroon" />
              Archive System
            </h3>
            <p className="text-sm text-gray-600">
              Organize conferences, volumes, and issues. Batch upload papers and manage publication history
            </p>
          </Link>

          <Link href="/admin/users" className="paper-card p-6 group">
            <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-maroon transition-colors flex items-center gap-2">
              <Users className="w-5 h-5 text-maroon" />
              User Management
            </h3>
            <p className="text-sm text-gray-600">
              Manage users, assign roles (RBAC), control permissions, and monitor user activity
            </p>
          </Link>

          <Link href="/admin/settings" className="paper-card p-6 group">
            <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-maroon transition-colors flex items-center gap-2">
              <Settings className="w-5 h-5 text-maroon" />
              God Mode Settings
            </h3>
            <p className="text-sm text-gray-600">
              Corporate-level system oversight: system health, analytics, security controls, and platform management
            </p>
          </Link>
        </div>

        <h2>Quick Start for Admins</h2>
        
        <h3>1. Access the Admin Portal</h3>
        <p>
          Navigate to <code>http://localhost:3001</code> and log in with your admin credentials. 
          You must have DEAN role for full access.
        </p>

        <h3>2. Familiarize with the Dashboard</h3>
        <p>
          The dashboard provides an overview of:
        </p>
        <ul>
          <li>Total papers (published, pending, archived)</li>
          <li>Active users and recent registrations</li>
          <li>Recent submissions requiring review</li>
          <li>System health and storage usage</li>
        </ul>

        <h3>3. Review Common Tasks</h3>
        <ul>
          <li><strong>Reviewing Papers:</strong> Navigate to Papers → Pending to review submissions</li>
          <li><strong>Managing Users:</strong> Go to Users to view, edit roles, or add new users</li>
          <li><strong>Creating Archives:</strong> Use Archives → Batch Upload for conference proceedings</li>
          <li><strong>System Monitoring:</strong> Access Settings → God Mode for platform oversight</li>
        </ul>

        <h2>Best Practices</h2>
        <ul>
          <li>Regularly review pending submissions to maintain workflow efficiency</li>
          <li>Monitor system health metrics in God Mode</li>
          <li>Keep user roles and permissions up to date</li>
          <li>Backup important data before bulk operations</li>
          <li>Review security settings and audit logs periodically</li>
        </ul>

        <h2>Need Help?</h2>
        <p>
          For detailed information on specific features, explore the admin guide sections:
        </p>
        <ul>
          <li><Link href="/admin/dashboard">Dashboard Guide</Link></li>
          <li><Link href="/admin/papers">Paper Management Guide</Link></li>
          <li><Link href="/admin/archives">Archive System Guide</Link></li>
          <li><Link href="/admin/users">User Management Guide</Link></li>
          <li><Link href="/admin/settings">God Mode Settings Guide</Link></li>
        </ul>
      </article>
    </DocsLayout>
  );
}
