import { DocsLayout } from "@/components/docs-layout";

export default function GettingStartedPage() {
  return (
    <DocsLayout>
      <article className="prose prose-gray max-w-none hover:prose-a:text-maroon prose-a:transition-colors prose-headings:text-maroon prose-strong:text-maroon">
        <h1>Getting Started with ICTIRC</h1>
        
        <p className="lead border-l-4 border-maroon/20 pl-4 italic text-gray-600">
          Welcome to the ICTIRC (International Conference on Technology, Innovation, Research, and Creativity) platform. 
          This guide will help you understand the system and get started quickly.
        </p>

        <h2>What is ICTIRC?</h2>
        <p>
          ICTIRC is a comprehensive academic paper management platform designed for research conferences. 
          It provides tools for:
        </p>
        <ul>
          <li>Paper submission and review workflows</li>
          <li>Conference archive management</li>
          <li>User and role management (RBAC)</li>
          <li>Publication tracking and DOI integration</li>
          <li>Storage management for papers and media</li>
        </ul>

        <h2>Platform Overview</h2>
        <p>
          The ICTIRC platform consists of three main applications:
        </p>

        <h3>1. Web Portal (Port 3000)</h3>
        <p>
          The public-facing website where visitors can:
        </p>
        <ul>
          <li>Browse published papers and conference archives</li>
          <li>Search for research by topic, author, or conference</li>
          <li>Download published papers</li>
          <li>Learn about upcoming conferences</li>
        </ul>

        <h3>2. Admin Portal (Port 3001)</h3>
        <p>
          The administrative dashboard for managing the platform:
        </p>
        <pre className="docs-pre">
          <code>
            # Admin Portal Capabilities
            - Paper Review & Approval
            - User Role Management
            - Analytics & Reporting
            - System Configuration
          </code>
        </pre>
        <ul>
          <li>Review and approve paper submissions</li>
          <li>Manage users and permissions</li>
          <li>Configure system settings</li>
          <li>Monitor platform analytics</li>
          <li>Access God Mode for system-wide oversight</li>
        </ul>

        <h3>3. Author Portal (Port 3002)</h3>
        <p>
          Dedicated portal for paper authors to:
        </p>
        <ul>
          <li>Submit new papers</li>
          <li>Track submission status</li>
          <li>Respond to reviewer comments</li>
          <li>Update paper metadata</li>
        </ul>

        <h2>User Roles</h2>
        <p>
          The platform uses Role-Based Access Control (RBAC) with four main roles:
        </p>

        <div className="not-prose grid gap-4 my-6">
          <div className="paper-card p-4">
            <h4 className="font-bold text-maroon mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-maroon"></span>
              AUTHOR
            </h4>
            <p className="text-sm text-gray-600">Can submit papers and track their submissions</p>
          </div>
          <div className="paper-card p-4">
            <h4 className="font-bold text-maroon mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-maroon"></span>
              REVIEWER
            </h4>
            <p className="text-sm text-gray-600">Can review assigned papers and provide feedback</p>
          </div>
          <div className="paper-card p-4">
            <h4 className="font-bold text-maroon mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-maroon"></span>
              EDITOR
            </h4>
            <p className="text-sm text-gray-600">Can manage papers, assign reviewers, and make publication decisions</p>
          </div>
          <div className="paper-card p-4">
            <h4 className="font-bold text-maroon mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-maroon"></span>
              DEAN
            </h4>
            <p className="text-sm text-gray-600">Full administrative access including user management and system settings</p>
          </div>
        </div>

        <h2>Next Steps</h2>
        <p>
          Now that you understand the basics, explore the documentation:
        </p>
        <ul>
          <li><a href="/admin">Admin Guide</a> - Learn how to manage the platform</li>
          <li><a href="/admin/dashboard">Dashboard Overview</a> - Understand key metrics and navigation</li>
          <li><a href="/admin/papers">Paper Management</a> - Manage submissions and publications</li>
          <li><a href="/admin/users">User Management</a> - Manage users and permissions</li>
          <li><a href="/admin/settings">God Mode Settings</a> - System administration tools</li>
        </ul>
      </article>
    </DocsLayout>
  );
}
