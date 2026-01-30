"use client";

import { useState, useEffect } from "react";
import { Card, Button } from "@ictirc/ui";
import {
  Settings as SettingsIcon,
  FileText,
  Calendar,
  Mail,
  Save,
  Plus,
  Trash2,
  Upload,
  ExternalLink,
} from "lucide-react";

type TabType = "general" | "guides" | "events" | "email";

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

const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: "general", label: "General", icon: <SettingsIcon className="w-4 h-4" /> },
  { id: "guides", label: "Research Guides", icon: <FileText className="w-4 h-4" /> },
  { id: "events", label: "Events", icon: <Calendar className="w-4 h-4" /> },
  { id: "email", label: "Email", icon: <Mail className="w-4 h-4" /> },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [guides, setGuides] = useState<ResearchGuide[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch data based on active tab
  useEffect(() => {
    if (activeTab === "guides") {
      fetchGuides();
    } else if (activeTab === "events") {
      fetchEvents();
    }
  }, [activeTab]);

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
    setLoading(true);
    try {
      const response = await fetch("/api/events");
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || []);
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Configure your research repository
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Tabs */}
        <Card className="md:w-64 p-2 h-fit">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-maroon/5 text-maroon"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </Card>

        {/* Content */}
        <div className="flex-1">
          {activeTab === "general" && <GeneralSettings />}
          {activeTab === "guides" && (
            <GuidesSettings guides={guides} loading={loading} onRefresh={fetchGuides} />
          )}
          {activeTab === "events" && (
            <EventsSettings events={events} loading={loading} onRefresh={fetchEvents} />
          )}
          {activeTab === "email" && <EmailSettings />}
        </div>
      </div>
    </div>
  );
}

function GeneralSettings() {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Repository Name
          </label>
          <input
            type="text"
            defaultValue="ISUFST CICT Research Repository"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            rows={3}
            defaultValue="The official research publication platform for the College of Information and Computing Technology at ISUFST."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon"
          />
        </div>

        <div className="pt-4">
          <Button className="gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </Card>
  );
}

function GuidesSettings({
  guides,
  loading,
  onRefresh,
}: {
  guides: ResearchGuide[];
  loading: boolean;
  onRefresh: () => void;
}) {
  const categories = ["thesis", "journal", "capstone"];

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Research Guides</h2>
          <Button size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Guide
          </Button>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Upload format guides for different research types. These will be available for download on the public site.
        </p>

        {/* Category sections */}
        {categories.map((category) => (
          <div key={category} className="mb-6 last:mb-0">
            <h3 className="text-sm font-medium text-gray-700 mb-2 capitalize">
              {category} Guides
            </h3>
            <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
              {loading ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                  Loading...
                </div>
              ) : guides.filter((g) => g.category === category).length === 0 ? (
                <div className="p-4 text-center text-gray-400 text-sm">
                  No guides uploaded for {category}
                </div>
              ) : (
                guides
                  .filter((g) => g.category === category)
                  .map((guide) => (
                    <div
                      key={guide.id}
                      className="flex items-center justify-between p-3"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-maroon" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {guide.title}
                          </p>
                          {guide.description && (
                            <p className="text-xs text-gray-500">
                              {guide.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        ))}

        {/* Upload Zone */}
        <div className="mt-4 border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-1">
            Drag and drop PDF files here, or click to browse
          </p>
          <p className="text-xs text-gray-400">PDF files only, max 10MB</p>
        </div>
      </Card>
    </div>
  );
}

function EventsSettings({
  events,
  loading,
  onRefresh,
}: {
  events: Event[];
  loading: boolean;
  onRefresh: () => void;
}) {
  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Academic Events</h2>
          <Button size="sm" className="gap-2">
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
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          event.isPublished
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {event.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span>
                        {new Date(event.startDate).toLocaleDateString()}
                        {event.endDate &&
                          ` - ${new Date(event.endDate).toLocaleDateString()}`}
                      </span>
                      {event.location && <span>{event.location}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}

function EmailSettings() {
  const [apiKey, setApiKey] = useState("");

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Email Configuration</h2>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">
              Email Not Configured
            </p>
            <p className="text-xs text-amber-700 mt-1">
              Configure Resend to enable email invitations and notifications.
              For now, invite tokens can be copied manually.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Resend API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="re_xxxxxxxxxxxx"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon font-mono text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">
            Get your API key from{" "}
            <a
              href="https://resend.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-maroon hover:underline"
            >
              resend.com
            </a>
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            From Email
          </label>
          <input
            type="email"
            placeholder="noreply@yourdomain.com"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon"
          />
        </div>

        <div className="pt-4">
          <Button disabled className="gap-2">
            <Save className="w-4 h-4" />
            Save Configuration
          </Button>
        </div>
      </div>
    </Card>
  );
}
