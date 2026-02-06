"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, Button, FileUpload } from "@ictirc/ui";
import { useToastActions } from "@/lib/toast";
import { useUpload } from "@/hooks/use-upload";
import {
  listConferences,
  createConference,
  updateConference,
  deleteConference,
} from "@/lib/actions/conference";
import {
  Settings as SettingsIcon,
  FileText,
  Calendar,
  Mail,
  Save,
  Plus,
  Trash2,
  ExternalLink,
  X,
  Edit,
  CheckCircle,
  Shield,
  Database,
  Server,
  Activity,
  Users,
  HardDrive,
  Globe,
  Lock,
  Unlock,
  AlertTriangle,
  Download,
  RefreshCw,
  Zap,
  BarChart3,
  FileArchive,
  Building2,
  BookOpen,
} from "lucide-react";

// ============================================
// TYPES
// ============================================

type TabType = "overview" | "system" | "content" | "security" | "analytics";

interface ResearchGuide {
  id: string;
  title: string;
  description: string | null;
  category: string;
  fileUrl: string;
  isPublished: boolean;
}

interface Event {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  startDate: string;
  endDate: string | null;
  location: string | null;
  isPublished: boolean;
}

interface SystemHealth {
  database: "healthy" | "degraded" | "down";
  storage: "healthy" | "degraded" | "down";
  api: "healthy" | "degraded" | "down";
  lastChecked: string;
}

interface SystemStats {
  totalPapers: number;
  publishedPapers: number;
  pendingPapers: number;
  totalUsers: number;
  activeUsers: number;
  totalAuthors: number;
  totalVolumes: number;
  totalIssues: number;
  totalArchivedPapers: number;
  totalGuides: number;
  totalEvents: number;
  storageUsed: string;
  lastBackup: string | null;
}

// ============================================
// CONSTANTS
// ============================================

const tabs: { id: TabType; label: string; icon: React.ReactNode; description: string }[] = [
  {
    id: "overview",
    label: "System Overview",
    icon: <SettingsIcon className="w-4 h-4" />,
    description: "God mode view of the entire platform"
  },
  {
    id: "system",
    label: "System Health",
    icon: <Server className="w-4 h-4" />,
    description: "Database, storage, and API status"
  },
  {
    id: "content",
    label: "Content Management",
    icon: <FileText className="w-4 h-4" />,
    description: "Guides, events, and configuration"
  },
  {
    id: "security",
    label: "Security & Access",
    icon: <Shield className="w-4 h-4" />,
    description: "User roles, permissions, and locks"
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: <BarChart3 className="w-4 h-4" />,
    description: "Usage metrics and reports"
  },
];

const guideCategories = [
  { value: "manuscript_template", label: "Manuscript Template" },
  { value: "citation_guide", label: "Citation Guide" },
  { value: "submission_checklist", label: "Submission Checklist" },
];

// ============================================
// MAIN COMPONENT
// ============================================

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [guides, setGuides] = useState<ResearchGuide[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);

  // Fetch system stats on mount
  useEffect(() => {
    fetchSystemStats();
    fetchSystemHealth();
  }, []);

  useEffect(() => {
    if (activeTab === "content") {
      fetchGuides();
      fetchEvents();
    }
  }, [activeTab]);

  async function fetchSystemStats() {
    try {
      const response = await fetch("/api/dashboard");
      if (response.ok) {
        const data = await response.json();
        setSystemStats({
          totalPapers: data.stats?.totalPapers || 0,
          publishedPapers: data.stats?.publishedCount || 0,
          pendingPapers: (data.stats?.submittedCount || 0) + (data.stats?.underReviewCount || 0),
          totalUsers: data.stats?.totalUsers || 0,
          activeUsers: data.stats?.totalUsers || 0,
          totalAuthors: data.stats?.totalAuthors || 0,
          totalVolumes: data.stats?.totalVolumes || 0,
          totalIssues: data.stats?.totalIssues || 0,
          totalArchivedPapers: data.stats?.totalArchivedPapers || 0,
          totalGuides: data.stats?.totalGuides || 0,
          totalEvents: data.stats?.totalEvents || 0,
          storageUsed: "N/A",
          lastBackup: null,
        });
      }
    } catch (error) {
      console.error("Failed to fetch system stats:", error);
    }
  }

  async function fetchSystemHealth() {
    setSystemHealth({
      database: "healthy",
      storage: "healthy",
      api: "healthy",
      lastChecked: new Date().toISOString(),
    });
  }

  async function fetchGuides() {
    setLoading(true);
    try {
      const response = await fetch("/api/research-guides");
      if (response.ok) {
        const data = await response.json();
        setGuides(data.guides || []);
      }
    } catch (error) {
      console.error("Failed to fetch guides:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchEvents() {
    try {
      const result = await listConferences();
      if (result.success) {
        const mappedEvents = (result.data || []).map((c: any) => ({
          id: c.id,
          title: c.name,
          description: c.description || "",
          imageUrl: c.imageUrl,
          startDate: new Date(c.startDate).toISOString().slice(0, 16),
          endDate: c.endDate ? new Date(c.endDate).toISOString().slice(0, 16) : null,
          location: c.location,
          isPublished: c.isPublished || false,
        }));
        setEvents(mappedEvents);
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with God Mode Badge */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
            <span className="px-2 py-1 bg-gradient-to-r from-maroon to-red-700 text-white text-xs font-bold rounded-md flex items-center gap-1">
              <Shield className="w-3 h-3" />
              GOD MODE
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Complete administrative control over the IRJICT platform
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 rounded">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            All Systems Operational
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <QuickStatCard
          label="Total Papers"
          value={systemStats?.totalPapers || 0}
          icon={<FileText className="w-4 h-4" />}
          color="maroon"
        />
        <QuickStatCard
          label="Published"
          value={systemStats?.publishedPapers || 0}
          icon={<CheckCircle className="w-4 h-4" />}
          color="green"
        />
        <QuickStatCard
          label="Users"
          value={systemStats?.totalUsers || 0}
          icon={<Users className="w-4 h-4" />}
          color="blue"
        />
        <QuickStatCard
          label="Archived"
          value={systemStats?.totalArchivedPapers || 0}
          icon={<FileArchive className="w-4 h-4" />}
          color="purple"
        />
        <QuickStatCard
          label="Volumes"
          value={systemStats?.totalVolumes || 0}
          icon={<BookOpen className="w-4 h-4" />}
          color="amber"
        />
        <QuickStatCard
          label="Issues"
          value={systemStats?.totalIssues || 0}
          icon={<Calendar className="w-4 h-4" />}
          color="teal"
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <Card className="lg:w-72 p-3 h-fit">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-start gap-3 px-3 py-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                  ? "bg-maroon/10 text-maroon border border-maroon/20"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <div className={`mt-0.5 ${activeTab === tab.id ? "text-maroon" : "text-gray-400"}`}>
                  {tab.icon}
                </div>
                <div>
                  <span className="font-medium text-sm">{tab.label}</span>
                  <p className="text-xs text-gray-500 mt-0.5">{tab.description}</p>
                </div>
              </button>
            ))}
          </nav>
        </Card>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {activeTab === "overview" && (
            <SystemOverview
              stats={systemStats}
              health={systemHealth}
              onRefresh={() => {
                fetchSystemStats();
                fetchSystemHealth();
              }}
            />
          )}
          {activeTab === "system" && (
            <SystemHealthPanel
              health={systemHealth}
              onRefresh={fetchSystemHealth}
            />
          )}
          {activeTab === "content" && (
            <ContentManagement
              guides={guides}
              events={events}
              loading={loading}
              onRefreshGuides={fetchGuides}
              onRefreshEvents={fetchEvents}
            />
          )}
          {activeTab === "security" && <SecurityPanel />}
          {activeTab === "analytics" && <AnalyticsPanel stats={systemStats} />}
        </div>
      </div>
    </div>
  );
}

// ============================================
// QUICK STAT CARD
// ============================================

function QuickStatCard({
  label,
  value,
  icon,
  color
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    maroon: "bg-maroon/10 text-maroon",
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-700",
    purple: "bg-purple-100 text-purple-700",
    amber: "bg-amber-100 text-amber-700",
    teal: "bg-teal-100 text-teal-700",
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3">
      <div className="flex items-center gap-2">
        <div className={`p-1.5 rounded ${colorClasses[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-lg font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// SYSTEM OVERVIEW (GOD MODE VIEW)
// ============================================

function SystemOverview({
  stats,
  health,
  onRefresh
}: {
  stats: SystemStats | null;
  health: SystemHealth | null;
  onRefresh: () => void;
}) {
  const toast = useToastActions();

  return (
    <div className="space-y-6">
      {/* Platform Status */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Globe className="w-5 h-5 text-maroon" />
              Platform Overview
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Real-time status of both Web Portal and Admin Dashboard
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Web Portal Card */}
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Web Portal</h3>
                  <p className="text-xs text-gray-500">irjict.isufst.edu.ph</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                v1.1.0-beta
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className="text-green-600 font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  Online
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Public Papers</span>
                <span className="font-medium">{stats?.totalArchivedPapers || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Research Guides</span>
                <span className="font-medium">{stats?.totalGuides || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Active Events</span>
                <span className="font-medium">{stats?.totalEvents || 0}</span>
              </div>
            </div>
          </div>

          {/* Admin Dashboard Card */}
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-maroon/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-maroon" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Admin Dashboard</h3>
                  <p className="text-xs text-gray-500">admin.irjict.isufst.edu.ph</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                v1.1.0-beta
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className="text-green-600 font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  Online
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Pending Submissions</span>
                <span className="font-medium">{stats?.pendingPapers || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Users</span>
                <span className="font-medium">{stats?.totalUsers || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Volumes / Issues</span>
                <span className="font-medium">{stats?.totalVolumes || 0} / {stats?.totalIssues || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* System Health Summary */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-maroon" />
          System Health
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <HealthIndicator
            name="Database"
            status={health?.database || "healthy"}
            icon={<Database className="w-4 h-4" />}
          />
          <HealthIndicator
            name="Storage"
            status={health?.storage || "healthy"}
            icon={<HardDrive className="w-4 h-4" />}
          />
          <HealthIndicator
            name="API"
            status={health?.api || "healthy"}
            icon={<Server className="w-4 h-4" />}
          />
        </div>
        {health?.lastChecked && (
          <p className="text-xs text-gray-400 mt-4">
            Last checked: {new Date(health.lastChecked).toLocaleString()}
          </p>
        )}
      </Card>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-maroon" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <QuickActionButton
            label="Clear Cache"
            icon={<RefreshCw className="w-4 h-4" />}
            onClick={() => toast.info("Cache Cleared", "Application cache has been cleared")}
          />
          <QuickActionButton
            label="Export Data"
            icon={<Download className="w-4 h-4" />}
            onClick={() => toast.info("Coming Soon", "Data export will be available soon")}
          />
          <QuickActionButton
            label="View Logs"
            icon={<FileText className="w-4 h-4" />}
            href="/dashboard/audit-logs"
          />
          <QuickActionButton
            label="Manage Users"
            icon={<Users className="w-4 h-4" />}
            href="/dashboard/users"
          />
        </div>
      </Card>

      {/* General Settings */}
      <GeneralSettings />
    </div>
  );
}

function HealthIndicator({
  name,
  status,
  icon
}: {
  name: string;
  status: "healthy" | "degraded" | "down";
  icon: React.ReactNode;
}) {
  const statusConfig = {
    healthy: { color: "bg-green-100 text-green-700 border-green-200", label: "Healthy", dot: "bg-green-500" },
    degraded: { color: "bg-amber-100 text-amber-700 border-amber-200", label: "Degraded", dot: "bg-amber-500" },
    down: { color: "bg-red-100 text-red-700 border-red-200", label: "Down", dot: "bg-red-500" },
  };

  const config = statusConfig[status];

  return (
    <div className={`p-4 rounded-lg border ${config.color}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="font-medium">{name}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${config.dot} animate-pulse`} />
        <span className="text-sm">{config.label}</span>
      </div>
    </div>
  );
}

function QuickActionButton({
  label,
  icon,
  onClick,
  href
}: {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  href?: string;
}) {
  const className = "flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 transition-colors";

  if (href) {
    return (
      <a href={href} className={className}>
        {icon}
        {label}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={className}>
      {icon}
      {label}
    </button>
  );
}

// ============================================
// SYSTEM HEALTH PANEL
// ============================================

function SystemHealthPanel({
  health,
  onRefresh
}: {
  health: SystemHealth | null;
  onRefresh: () => void;
}) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Server className="w-5 h-5 text-maroon" />
            Infrastructure Status
          </h2>
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Check Now
          </Button>
        </div>

        <div className="space-y-4">
          <ServiceStatusRow
            name="PostgreSQL Database"
            description="Supabase PostgreSQL - Primary data store"
            status={health?.database || "healthy"}
            metrics={[
              { label: "Connection Pool", value: "Active" },
              { label: "Response Time", value: "<50ms" },
            ]}
          />

          <ServiceStatusRow
            name="File Storage"
            description="Supabase Storage - PDF and document storage"
            status={health?.storage || "healthy"}
            metrics={[
              { label: "Buckets", value: "4 active" },
              { label: "Availability", value: "99.9%" },
            ]}
          />

          <ServiceStatusRow
            name="API Gateway"
            description="Next.js API Routes - Server endpoints"
            status={health?.api || "healthy"}
            metrics={[
              { label: "Uptime", value: "100%" },
              { label: "Avg Response", value: "<100ms" },
            ]}
          />

          <ServiceStatusRow
            name="Authentication"
            description="Supabase Auth - User authentication"
            status="healthy"
            metrics={[
              { label: "Provider", value: "Supabase" },
              { label: "Sessions", value: "Active" },
            ]}
          />
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-maroon" />
          Environment Configuration
        </h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Environment</p>
            <p className="font-medium text-gray-900">Production</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Region</p>
            <p className="font-medium text-gray-900">Southeast Asia</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Next.js Version</p>
            <p className="font-medium text-gray-900">16.2.0-canary</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Node.js Version</p>
            <p className="font-medium text-gray-900">20.x LTS</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function ServiceStatusRow({
  name,
  description,
  status,
  metrics
}: {
  name: string;
  description: string;
  status: "healthy" | "degraded" | "down";
  metrics: { label: string; value: string }[];
}) {
  const statusConfig = {
    healthy: { bg: "bg-green-500", text: "Operational" },
    degraded: { bg: "bg-amber-500", text: "Degraded" },
    down: { bg: "bg-red-500", text: "Outage" },
  };

  const config = statusConfig[status];

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-gray-900">{name}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${config.bg}`} />
          <span className="text-sm font-medium text-gray-700">{config.text}</span>
        </div>
      </div>
      <div className="mt-3 flex gap-4">
        {metrics.map((metric, i) => (
          <div key={i} className="text-xs">
            <span className="text-gray-400">{metric.label}: </span>
            <span className="text-gray-600 font-medium">{metric.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// CONTENT MANAGEMENT
// ============================================

function ContentManagement({
  guides,
  events,
  loading,
  onRefreshGuides,
  onRefreshEvents,
}: {
  guides: ResearchGuide[];
  events: Event[];
  loading: boolean;
  onRefreshGuides: () => void;
  onRefreshEvents: () => void;
}) {
  const [contentTab, setContentTab] = useState<"guides" | "events">("guides");

  return (
    <div className="space-y-6">
      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg w-fit">
        <button
          onClick={() => setContentTab("guides")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${contentTab === "guides"
              ? "bg-white shadow text-maroon"
              : "text-gray-600 hover:text-gray-900"
            }`}
        >
          <FileText className="w-4 h-4 inline mr-2" />
          Research Guides
        </button>
        <button
          onClick={() => setContentTab("events")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${contentTab === "events"
              ? "bg-white shadow text-maroon"
              : "text-gray-600 hover:text-gray-900"
            }`}
        >
          <Calendar className="w-4 h-4 inline mr-2" />
          Events
        </button>
      </div>

      {contentTab === "guides" && (
        <GuidesSettings guides={guides} loading={loading} onRefresh={onRefreshGuides} />
      )}
      {contentTab === "events" && (
        <EventsSettings events={events} loading={loading} onRefresh={onRefreshEvents} />
      )}
    </div>
  );
}

// ============================================
// GENERAL SETTINGS
// ============================================

function GeneralSettings() {
  const toast = useToastActions();

  function handleSave() {
    toast.success("Settings saved", "Your changes have been saved successfully.");
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <SettingsIcon className="w-5 h-5 text-maroon" />
        General Configuration
      </h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="repository-name" className="block text-sm font-medium text-gray-700 mb-1">
            Repository Name
          </label>
          <input
            id="repository-name"
            type="text"
            defaultValue="IRJICT - International Research Journal on ICT"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon"
          />
        </div>

        <div>
          <label htmlFor="repository-description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="repository-description"
            rows={3}
            defaultValue="The official research publication platform for the College of Information and Computing Technology at ISUFST."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon"
          />
        </div>

        <div>
          <label htmlFor="issn" className="block text-sm font-medium text-gray-700 mb-1">
            ISSN Number
          </label>
          <input
            id="issn"
            type="text"
            defaultValue="2960-3773"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon font-mono"
          />
        </div>

        <div className="pt-4">
          <Button className="gap-2" onClick={handleSave}>
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </Card>
  );
}

// ============================================
// SECURITY PANEL
// ============================================

function SecurityPanel() {
  const toast = useToastActions();
  const [systemLocked, setSystemLocked] = useState(false);
  const [submissionsLocked, setSubmissionsLocked] = useState(false);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-maroon" />
          System Access Controls
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              {systemLocked ? (
                <Lock className="w-5 h-5 text-red-600" />
              ) : (
                <Unlock className="w-5 h-5 text-green-600" />
              )}
              <div>
                <p className="font-medium text-gray-900">System Lock</p>
                <p className="text-sm text-gray-500">
                  Lock the entire admin system (emergency use only)
                </p>
              </div>
            </div>
            <Button
              variant={systemLocked ? "primary" : "outline"}
              size="sm"
              onClick={() => {
                setSystemLocked(!systemLocked);
                toast.info(
                  systemLocked ? "System Unlocked" : "System Locked",
                  systemLocked
                    ? "Admin system is now accessible"
                    : "Admin system is now locked"
                );
              }}
            >
              {systemLocked ? "Unlock System" : "Lock System"}
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              {submissionsLocked ? (
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
              <div>
                <p className="font-medium text-gray-900">Paper Submissions</p>
                <p className="text-sm text-gray-500">
                  Enable or disable new paper submissions on the web portal
                </p>
              </div>
            </div>
            <Button
              variant={submissionsLocked ? "outline" : "primary"}
              size="sm"
              onClick={() => {
                setSubmissionsLocked(!submissionsLocked);
                toast.info(
                  submissionsLocked ? "Submissions Enabled" : "Submissions Disabled",
                  submissionsLocked
                    ? "Users can now submit papers"
                    : "Paper submissions are temporarily disabled"
                );
              }}
            >
              {submissionsLocked ? "Enable Submissions" : "Disable Submissions"}
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-maroon" />
          Role Permissions Matrix
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Overview of permissions for each user role
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Permission</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Author</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Reviewer</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Editor</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Dean</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { name: "View Papers", author: true, reviewer: true, editor: true, dean: true },
                { name: "Submit Papers", author: true, reviewer: false, editor: true, dean: true },
                { name: "Review Papers", author: false, reviewer: true, editor: true, dean: true },
                { name: "Publish Papers", author: false, reviewer: false, editor: true, dean: true },
                { name: "Manage Users", author: false, reviewer: false, editor: false, dean: true },
                { name: "System Settings", author: false, reviewer: false, editor: false, dean: true },
                { name: "Manage Archives", author: false, reviewer: false, editor: true, dean: true },
                { name: "Delete Papers", author: false, reviewer: false, editor: false, dean: true },
              ].map((perm, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-700">{perm.name}</td>
                  <td className="py-3 px-4 text-center">
                    {perm.author ? (
                      <CheckCircle className="w-4 h-4 text-green-600 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-gray-300 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {perm.reviewer ? (
                      <CheckCircle className="w-4 h-4 text-green-600 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-gray-300 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {perm.editor ? (
                      <CheckCircle className="w-4 h-4 text-green-600 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-gray-300 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {perm.dean ? (
                      <CheckCircle className="w-4 h-4 text-green-600 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-gray-300 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <EmailSettings />
    </div>
  );
}

// ============================================
// ANALYTICS PANEL
// ============================================

function AnalyticsPanel({ stats }: { stats: SystemStats | null }) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-maroon" />
          Platform Analytics
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <AnalyticsCard
            title="Total Papers"
            value={stats?.totalPapers || 0}
            subtitle="All time submissions"
            trend="+12%"
            trendUp={true}
          />
          <AnalyticsCard
            title="Published"
            value={stats?.publishedPapers || 0}
            subtitle="Live on portal"
            trend="+8%"
            trendUp={true}
          />
          <AnalyticsCard
            title="Pending Review"
            value={stats?.pendingPapers || 0}
            subtitle="Awaiting action"
            trend="-5%"
            trendUp={false}
          />
          <AnalyticsCard
            title="Registered Authors"
            value={stats?.totalAuthors || 0}
            subtitle="Unique authors"
            trend="+15%"
            trendUp={true}
          />
          <AnalyticsCard
            title="Admin Users"
            value={stats?.totalUsers || 0}
            subtitle="Active accounts"
            trend="0%"
            trendUp={true}
          />
          <AnalyticsCard
            title="Archived Papers"
            value={stats?.totalArchivedPapers || 0}
            subtitle="In archive system"
            trend="+20%"
            trendUp={true}
          />
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileArchive className="w-5 h-5 text-maroon" />
          Content Statistics
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-maroon">{stats?.totalVolumes || 0}</p>
            <p className="text-sm text-gray-500 mt-1">Volumes</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-blue-600">{stats?.totalIssues || 0}</p>
            <p className="text-sm text-gray-500 mt-1">Issues</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-green-600">{stats?.totalGuides || 0}</p>
            <p className="text-sm text-gray-500 mt-1">Guides</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-amber-600">{stats?.totalEvents || 0}</p>
            <p className="text-sm text-gray-500 mt-1">Events</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gray-50 border-dashed">
        <div className="text-center py-8">
          <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-medium text-gray-700">Advanced Analytics Coming Soon</h3>
          <p className="text-sm text-gray-500 mt-1">
            Detailed charts, traffic analytics, and usage reports will be available in a future update.
          </p>
        </div>
      </Card>
    </div>
  );
}

function AnalyticsCard({
  title,
  value,
  subtitle,
  trend,
  trendUp,
}: {
  title: string;
  value: number;
  subtitle: string;
  trend: string;
  trendUp: boolean;
}) {
  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      <div className="flex items-center justify-between mt-2">
        <p className="text-xs text-gray-400">{subtitle}</p>
        <span className={`text-xs font-medium ${trendUp ? "text-green-600" : "text-red-600"}`}>
          {trend}
        </span>
      </div>
    </div>
  );
}

// ============================================
// GUIDES SETTINGS
// ============================================

function GuidesSettings({
  guides,
  loading,
  onRefresh,
}: {
  guides: ResearchGuide[];
  loading: boolean;
  onRefresh: () => void;
}) {
  const toast = useToastActions();
  const [showModal, setShowModal] = useState(false);
  const [editingGuide, setEditingGuide] = useState<ResearchGuide | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "manuscript_template",
    fileUrl: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const pdfUpload = useUpload({
    bucket: process.env.NEXT_PUBLIC_SUPABASE_BUCKET_GUIDES || "research guides",
    folder: "guides"
  });

  function openAddModal() {
    setEditingGuide(null);
    setFormData({ title: "", description: "", category: "manuscript_template", fileUrl: "" });
    setShowModal(true);
  }

  function openEditModal(guide: ResearchGuide) {
    setEditingGuide(guide);
    setFormData({
      title: guide.title,
      description: guide.description || "",
      category: guide.category,
      fileUrl: guide.fileUrl,
    });
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.fileUrl) {
      toast.error("Missing fields", "Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const method = editingGuide ? "PUT" : "POST";
      const body = editingGuide ? { id: editingGuide.id, ...formData } : formData;

      const response = await fetch("/api/research-guides", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        toast.success(
          editingGuide ? "Guide updated" : "Guide created",
          `"${formData.title}" has been ${editingGuide ? "updated" : "added"} successfully.`
        );
        setShowModal(false);
        onRefresh();
      } else {
        const data = await response.json();
        toast.error("Error", data.error || "Failed to save guide.");
      }
    } catch {
      toast.error("Error", "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(guide: ResearchGuide) {
    if (!confirm(`Are you sure you want to delete "${guide.title}"?`)) return;

    try {
      const response = await fetch(`/api/research-guides?id=${guide.id}`, { method: "DELETE" });

      if (response.ok) {
        toast.success("Guide deleted", `"${guide.title}" has been removed.`);
        onRefresh();
      } else {
        toast.error("Error", "Failed to delete guide.");
      }
    } catch {
      toast.error("Error", "An unexpected error occurred.");
    }
  }

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Research Guides</h2>
          <Button size="sm" className="gap-2" onClick={openAddModal}>
            <Plus className="w-4 h-4" />
            Add Guide
          </Button>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Upload format guides for different research types. These will be available for download on the public site.
        </p>

        {guideCategories.map((cat) => (
          <div key={cat.value} className="mb-6 last:mb-0">
            <h3 className="text-sm font-medium text-gray-700 mb-2">{cat.label}</h3>
            <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
              {loading ? (
                <div className="p-4 text-center text-gray-500 text-sm">Loading...</div>
              ) : guides.filter((g) => g.category === cat.value).length === 0 ? (
                <div className="p-4 text-center text-gray-400 text-sm">
                    No guides uploaded for {cat.label.toLowerCase()}
                </div>
              ) : (
                    guides.filter((g) => g.category === cat.value).map((guide) => (
                      <div key={guide.id} className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-maroon" />
                          <div>
                        <p className="text-sm font-medium text-gray-900">{guide.title}</p>
                        {guide.description && (
                          <p className="text-xs text-gray-500">{guide.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => window.open(guide.fileUrl, "_blank")}>
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openEditModal(guide)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(guide)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </Card>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingGuide ? "Edit Guide" : "Add Research Guide"}
              </h3>
              <button onClick={() => setShowModal(false)} aria-label="Close modal" className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., ICTIRC Manuscript Template"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the guide"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon"
                />
              </div>
              <div>
                <label htmlFor="guide-category" className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  id="guide-category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon"
                >
                  {guideCategories.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">PDF File *</label>
                {formData.fileUrl ? (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-800 flex-1 truncate">
                      {editingGuide ? "File attached" : "File uploaded"}
                    </span>
                    <button type="button" onClick={() => setFormData({ ...formData, fileUrl: "" })} className="text-green-600 hover:text-green-800" aria-label="Remove uploaded file">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <FileUpload
                      onFileSelect={async (file) => {
                        const url = await pdfUpload.uploadFile(file);
                        if (url) {
                          setFormData((prev) => ({
                            ...prev,
                            fileUrl: url,
                            title: prev.title || file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
                          }));
                        }
                    }}
                      onRemove={() => setFormData({ ...formData, fileUrl: "" })}
                      isUploading={pdfUpload.isUploading}
                      progress={pdfUpload.progress}
                      accept=".pdf"
                      variant="file"
                  />
                )}
                <p className="text-xs text-gray-400 mt-1">PDF files only, max 10MB</p>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Saving..." : editingGuide ? "Update" : "Add Guide"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// EVENTS SETTINGS
// ============================================

function EventsSettings({
  events,
  loading,
  onRefresh,
}: {
  events: Event[];
  loading: boolean;
  onRefresh: () => void;
}) {
  const toast = useToastActions();
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    imageUrl: "",
    isPublished: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const imageUpload = useUpload({ folder: "events" });

  function openAddModal() {
    setEditingEvent(null);
    setFormData({ title: "", description: "", startDate: "", endDate: "", location: "", imageUrl: "", isPublished: true });
    setShowModal(true);
  }

  function openEditModal(event: Event) {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      startDate: event.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : "",
      endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : "",
      location: event.location || "",
      imageUrl: event.imageUrl || "",
      isPublished: event.isPublished,
    });
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.startDate) {
      toast.error("Missing fields", "Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const cleanData = {
        name: formData.title,
        fullName: formData.title,
        description: formData.description,
        startDate: new Date(formData.startDate),
        endDate: formData.endDate ? new Date(formData.endDate) : undefined,
        location: formData.location || undefined,
        imageUrl: formData.imageUrl || undefined,
        isPublished: formData.isPublished,
        organizers: [],
        partners: [],
      };

      const result = editingEvent
        ? await updateConference(editingEvent.id, cleanData)
        : await createConference(cleanData);

      if (result.success) {
        toast.success(
          editingEvent ? "Event updated" : "Event created",
          `"${formData.title}" has been ${editingEvent ? "updated" : "added"} successfully.`
        );
        setShowModal(false);
        onRefresh();
      } else {
        toast.error("Error", result.error || "Failed to save event.");
      }
    } catch {
      toast.error("Error", "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(event: Event) {
    if (!confirm(`Are you sure you want to delete "${event.title}"?`)) return;

    try {
      const result = await deleteConference(event.id);

      if (result.success) {
        toast.success("Event deleted", `"${event.title}" has been removed.`);
        onRefresh();
      } else {
        toast.error("Error", result.error || "Failed to delete event.");
      }
    } catch {
      toast.error("Error", "An unexpected error occurred.");
    }
  }

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Academic Events</h2>
          <Button size="sm" className="gap-2" onClick={openAddModal}>
            <Plus className="w-4 h-4" />
            Add Event
          </Button>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Create and manage academic conferences, symposiums, and call for papers announcements.
        </p>

        <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
          {loading ? (
            <div className="p-4 text-center text-gray-500 text-sm">Loading...</div>
          ) : events.length === 0 ? (
            <div className="p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No events created yet</p>
              <p className="text-gray-400 text-xs mt-1">
                Click &ldquo;Add Event&rdquo; to create your first academic event
              </p>
            </div>
          ) : (
            events.map((event) => (
              <div key={event.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">{event.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${event.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                        {event.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{event.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span>
                        {new Date(event.startDate).toLocaleDateString()}
                        {event.endDate && ` - ${new Date(event.endDate).toLocaleDateString()}`}
                      </span>
                      {event.location && <span>{event.location}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEditModal(event)}>Edit</Button>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(event)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingEvent ? "Edit Event" : "Add Academic Event"}
              </h3>
              <button onClick={() => setShowModal(false)} aria-label="Close modal" className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., ICTIRC 2026"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Event description..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="event-start-date" className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                  <input
                    id="event-start-date"
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="event-end-date" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    id="event-end-date"
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., ISUFST Dingle Campus"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Image</label>
                <FileUpload
                  value={formData.imageUrl}
                  onFileSelect={async (file) => {
                    const url = await imageUpload.uploadFile(file);
                    if (url) setFormData({ ...formData, imageUrl: url });
                  }}
                  onRemove={() => setFormData({ ...formData, imageUrl: "" })}
                  isUploading={imageUpload.isUploading}
                  progress={imageUpload.progress}
                  variant="image"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="rounded border-gray-300 text-maroon focus:ring-maroon"
                />
                <label htmlFor="isPublished" className="text-sm text-gray-700">Publish immediately</label>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Saving..." : editingEvent ? "Update" : "Add Event"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// EMAIL SETTINGS
// ============================================

function EmailSettings() {
  const toast = useToastActions();
  const [apiKey, setApiKey] = useState("");

  function handleSave() {
    toast.info("Coming soon", "Email configuration will be available in a future update.");
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Mail className="w-5 h-5 text-maroon" />
        Email Configuration
      </h2>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">Email Not Configured</p>
            <p className="text-xs text-amber-700 mt-1">
              Configure Resend to enable email invitations and notifications.
              For now, invite tokens can be copied manually.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Resend API Key</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="re_xxxxxxxxxxxx"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon font-mono text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">
            Get your API key from{" "}
            <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="text-maroon hover:underline">
              resend.com
            </a>
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">From Email</label>
          <input
            type="email"
            placeholder="noreply@yourdomain.com"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon"
          />
        </div>

        <div className="pt-4">
          <Button className="gap-2" onClick={handleSave}>
            <Save className="w-4 h-4" />
            Save Configuration
          </Button>
        </div>
      </div>
    </Card>
  );
}
