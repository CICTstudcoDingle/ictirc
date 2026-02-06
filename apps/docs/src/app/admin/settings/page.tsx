import { DocsLayout } from "@/components/docs-layout";

export default function SettingsGuidePage() {
  return (
    <DocsLayout>
      <article className="prose prose-blue max-w-none">
        <h1>God Mode Settings</h1>
        
        <p className="lead">
          God Mode provides corporate-level system oversight with comprehensive tools for monitoring, 
          managing, and controlling all aspects of the ICTIRC platform.
        </p>

        <div className="not-prose bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-6">
          <p className="text-sm text-yellow-800 font-medium">
            ⚠️ <strong>Access Restricted:</strong> God Mode is only accessible to users with DEAN role. 
            Exercise caution when making system-wide changes.
          </p>
        </div>

        <h2>Overview Tab</h2>
        <p>
          The Overview tab provides a comprehensive system summary:
        </p>
        
        <h3>Dual-App Monitoring</h3>
        <ul>
          <li><strong>Web Portal Status:</strong> Public website health and metrics</li>
          <li><strong>Admin Portal Status:</strong> Administrative dashboard status</li>
          <li>Real-time uptime monitoring</li>
          <li>Last deployment information</li>
          <li>Environment indicators (production/development)</li>
        </ul>

        <h3>Quick Statistics</h3>
        <ul>
          <li>Total Papers (all statuses)</li>
          <li>Published Papers</li>
          <li>Active Users</li>
          <li>Archived Papers</li>
          <li>Conference Volumes</li>
          <li>Conference Issues</li>
        </ul>

        <h2>System Health Tab</h2>
        <p>
          Monitor critical system components:
        </p>

        <h3>Database Health</h3>
        <ul>
          <li>PostgreSQL connection status</li>
          <li>Query response time</li>
          <li>Active connections</li>
          <li>Database size and growth</li>
        </ul>

        <h3>Storage Health</h3>
        <ul>
          <li>Supabase Storage status</li>
          <li>Current usage vs. quota</li>
          <li>Storage buckets overview</li>
          <li>Upload/download activity</li>
        </ul>

        <h3>API Health</h3>
        <ul>
          <li>External API status (DOI, Google Scholar)</li>
          <li>Response times</li>
          <li>Rate limit monitoring</li>
          <li>Error rates</li>
        </ul>

        <h3>Authentication Health</h3>
        <ul>
          <li>Supabase Auth service status</li>
          <li>Active sessions</li>
          <li>Recent login activity</li>
          <li>Failed authentication attempts</li>
        </ul>

        <h2>Content Management Tab</h2>
        <p>
          Manage platform content and configuration:
        </p>

        <h3>Guides Management</h3>
        <ul>
          <li>Create and edit help guides</li>
          <li>Manage FAQ content</li>
          <li>Update submission guidelines</li>
          <li>Configure review workflows</li>
        </ul>

        <h3>Event Management</h3>
        <ul>
          <li>Create conference events</li>
          <li>Manage deadlines and dates</li>
          <li>Configure event types</li>
          <li>Track event history</li>
        </ul>

        <h2>Security Tab</h2>
        <p>
          System-wide security controls:
        </p>

        <h3>System Lock</h3>
        <ul>
          <li><strong>Emergency Shutdown:</strong> Lock entire system for maintenance</li>
          <li>Display maintenance message to users</li>
          <li>Preserve admin access during lockdown</li>
          <li>Schedule maintenance windows</li>
        </ul>

        <div className="not-prose bg-red-50 border border-red-200 rounded-lg p-4 my-6">
          <p className="text-sm text-red-800 font-medium">
            ⚠️ <strong>Warning:</strong> System Lock will make the entire platform inaccessible to regular users. 
            Use only for critical maintenance or security incidents.
          </p>
        </div>

        <h3>Submissions Lock</h3>
        <ul>
          <li>Temporarily disable new submissions</li>
          <li>Useful during review periods or conference deadlines</li>
          <li>Existing submissions remain accessible</li>
          <li>Display custom message to authors</li>
        </ul>

        <h3>Activity Monitoring</h3>
        <ul>
          <li>View audit logs</li>
          <li>Track administrative actions</li>
          <li>Monitor suspicious activity</li>
          <li>Export security reports</li>
        </ul>

        <h2>Analytics Tab</h2>
        <p>
          Comprehensive platform analytics:
        </p>

        <h3>Usage Analytics</h3>
        <ul>
          <li>Daily active users</li>
          <li>Page views and engagement</li>
          <li>Paper downloads and views</li>
          <li>Search query trends</li>
        </ul>

        <h3>Performance Metrics</h3>
        <ul>
          <li>Average page load times</li>
          <li>API response times</li>
          <li>Database query performance</li>
          <li>Error rates and types</li>
        </ul>

        <h3>Growth Metrics</h3>
        <ul>
          <li>User growth over time</li>
          <li>Paper submission trends</li>
          <li>Publication velocity</li>
          <li>Archive growth</li>
        </ul>

        <h3>Visual Analytics</h3>
        <ul>
          <li>Interactive charts and graphs</li>
          <li>Customizable date ranges</li>
          <li>Export data to CSV/Excel</li>
          <li>Compare time periods</li>
        </ul>

        <h2>Best Practices</h2>

        <h3>Regular Monitoring</h3>
        <ul>
          <li>Check System Health tab daily</li>
          <li>Review Analytics weekly for trends</li>
          <li>Monitor audit logs for suspicious activity</li>
          <li>Keep track of storage usage</li>
        </ul>

        <h3>Security</h3>
        <ul>
          <li>Only use System Lock when absolutely necessary</li>
          <li>Document all system-wide changes</li>
          <li>Notify team before using emergency controls</li>
          <li>Review security logs regularly</li>
        </ul>

        <h3>Performance</h3>
        <ul>
          <li>Monitor database growth and optimize queries</li>
          <li>Review API usage to avoid rate limits</li>
          <li>Clean up old data periodically</li>
          <li>Optimize storage by archiving old files</li>
        </ul>

        <h2>Troubleshooting</h2>

        <h3>Database Issues</h3>
        <p>If database health shows errors:</p>
        <ul>
          <li>Check Supabase dashboard for outages</li>
          <li>Review recent migrations for issues</li>
          <li>Check connection pooling settings</li>
          <li>Contact support if problems persist</li>
        </ul>

        <h3>Storage Issues</h3>
        <p>If storage quota is exceeded:</p>
        <ul>
          <li>Review largest files and archives</li>
          <li>Consider archiving old conference data</li>
          <li>Upgrade storage plan if needed</li>
          <li>Implement automatic cleanup policies</li>
        </ul>

        <h3>API Failures</h3>
        <p>If external APIs are failing:</p>
        <ul>
          <li>Check API status pages (DOI, Google Scholar)</li>
          <li>Review rate limit settings</li>
          <li>Implement fallback mechanisms</li>
          <li>Cache responses when possible</li>
        </ul>
      </article>
    </DocsLayout>
  );
}
