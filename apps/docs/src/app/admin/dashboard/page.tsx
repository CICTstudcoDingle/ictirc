import { DocsLayout } from "@/components/docs-layout";

export default function DashboardGuidePage() {
  return (
    <DocsLayout>
      <article className="prose prose-blue max-w-none">
        <h1>Dashboard Overview</h1>
        
        <p className="lead">
          The admin dashboard provides a comprehensive overview of your ICTIRC platform with key metrics, 
          recent activity, and quick actions.
        </p>

        <h2>Dashboard Sections</h2>

        <h3>Quick Stats</h3>
        <p>
          The top of the dashboard displays important metrics at a glance:
        </p>
        <ul>
          <li><strong>Total Papers:</strong> All papers in the system (published + pending + archived)</li>
          <li><strong>Published Papers:</strong> Papers publicly available on the web portal</li>
          <li><strong>Active Users:</strong> Total registered users across all roles</li>
          <li><strong>Archived Papers:</strong> Papers in conference archives</li>
          <li><strong>Volumes:</strong> Number of conference volumes</li>
          <li><strong>Issues:</strong> Number of conference issues</li>
        </ul>

        <h3>Recent Submissions</h3>
        <p>
          View the most recent paper submissions requiring review:
        </p>
        <ul>
          <li>Paper title and author information</li>
          <li>Submission date and current status</li>
          <li>Quick action buttons (Review, Approve, Reject)</li>
        </ul>

        <h3>System Health</h3>
        <p>
          Monitor platform health indicators:
        </p>
        <ul>
          <li><strong>Database Status:</strong> Connection health and response time</li>
          <li><strong>Storage Usage:</strong> Current storage consumption vs. available space</li>
          <li><strong>API Status:</strong> External integrations (DOI, Google Scholar)</li>
          <li><strong>Authentication:</strong> Supabase Auth service health</li>
        </ul>

        <h3>Quick Actions</h3>
        <p>
          Shortcuts to common administrative tasks:
        </p>
        <ul>
          <li>Review pending papers</li>
          <li>Add new user</li>
          <li>Create new archive</li>
          <li>View analytics</li>
          <li>Access God Mode settings</li>
        </ul>

        <h2>Navigation</h2>
        <p>
          Use the sidebar navigation to access different sections:
        </p>
        <ul>
          <li><strong>Dashboard:</strong> Current overview page</li>
          <li><strong>Papers:</strong> Manage submissions and publications</li>
          <li><strong>Archives:</strong> Organize conference proceedings</li>
          <li><strong>Users:</strong> Manage user accounts and roles</li>
          <li><strong>Settings:</strong> Platform configuration and God Mode</li>
        </ul>

        <h2>Customization</h2>
        <p>
          Future updates will include:
        </p>
        <ul>
          <li>Customizable dashboard widgets</li>
          <li>Personalized metric views</li>
          <li>Export dashboard data</li>
          <li>Scheduled reports</li>
        </ul>
      </article>
    </DocsLayout>
  );
}
