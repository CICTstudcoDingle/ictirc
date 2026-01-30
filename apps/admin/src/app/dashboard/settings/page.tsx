"use client";

import { useState, useEffect } from "react";
import { Card, Button } from "@ictirc/ui";
import { useToastActions } from "@/lib/toast";
import { FileUpload } from "@/components/file-upload";
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

const guideCategories = [
  { value: "manuscript_template", label: "Manuscript Template" },
  { value: "citation_guide", label: "Citation Guide" },
  { value: "submission_checklist", label: "Submission Checklist" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [guides, setGuides] = useState<ResearchGuide[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Configure your research repository
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
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
  const toast = useToastActions();

  function handleSave() {
    toast.success("Settings saved", "Your changes have been saved successfully.");
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="repository-name" className="block text-sm font-medium text-gray-700 mb-1">
            Repository Name
          </label>
          <input
            id="repository-name"
            type="text"
            defaultValue="ISUFST CICT Research Repository"
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

  function openAddModal() {
    setEditingGuide(null);
    setFormData({
      title: "",
      description: "",
      category: "manuscript_template",
      fileUrl: "",
    });
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
      const body = editingGuide
        ? { id: editingGuide.id, ...formData }
        : formData;

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
    } catch (error) {
      toast.error("Error", "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(guide: ResearchGuide) {
    if (!confirm(`Are you sure you want to delete "${guide.title}"?`)) return;

    try {
      const response = await fetch(`/api/research-guides?id=${guide.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Guide deleted", `"${guide.title}" has been removed.`);
        onRefresh();
      } else {
        toast.error("Error", "Failed to delete guide.");
      }
    } catch (error) {
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

        {/* Category sections */}
        {guideCategories.map((cat) => (
          <div key={cat.value} className="mb-6 last:mb-0">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              {cat.label}
            </h3>
            <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
              {loading ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                  Loading...
                </div>
              ) : guides.filter((g) => g.category === cat.value).length === 0 ? (
                <div className="p-4 text-center text-gray-400 text-sm">
                    No guides uploaded for {cat.label.toLowerCase()}
                </div>
              ) : (
                guides
                      .filter((g) => g.category === cat.value)
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
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => window.open(guide.fileUrl, "_blank")}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditModal(guide)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(guide)}
                        >
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingGuide ? "Edit Guide" : "Add Research Guide"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                aria-label="Close modal"
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the guide"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon"
                />
              </div>
              <div>
                <label htmlFor="guide-category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  id="guide-category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon"
                >
                  {guideCategories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              {/* File Upload - Drag & Drop */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PDF File *
                </label>
                {formData.fileUrl ? (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-800 flex-1 truncate">
                      {editingGuide ? "File attached" : "File uploaded"}
                    </span>
                    {!editingGuide && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, fileUrl: "" })}
                        className="text-green-600 hover:text-green-800"
                        aria-label="Remove uploaded file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ) : (
                  <FileUpload
                    onUploadComplete={(url, fileName) => {
                      setFormData((prev) => ({
                        ...prev,
                        fileUrl: url,
                        title: prev.title || fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
                      }));
                    }}
                  />
                )}
                <p className="text-xs text-gray-400 mt-1">PDF files only, max 10MB</p>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
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

  function openAddModal() {
    setEditingEvent(null);
    setFormData({
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      location: "",
      imageUrl: "",
      isPublished: true,
    });
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
      const method = editingEvent ? "PUT" : "POST";
      const body = editingEvent
        ? { id: editingEvent.id, ...formData }
        : formData;

      const response = await fetch("/api/events", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        toast.success(
          editingEvent ? "Event updated" : "Event created",
          `"${formData.title}" has been ${editingEvent ? "updated" : "added"} successfully.`
        );
        setShowModal(false);
        onRefresh();
      } else {
        const data = await response.json();
        toast.error("Error", data.error || "Failed to save event.");
      }
    } catch (error) {
      toast.error("Error", "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(event: Event) {
    if (!confirm(`Are you sure you want to delete "${event.title}"?`)) return;

    try {
      const response = await fetch(`/api/events?id=${event.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Event deleted", `"${event.title}" has been removed.`);
        onRefresh();
      } else {
        toast.error("Error", "Failed to delete event.");
      }
    } catch (error) {
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
                    <Button variant="outline" size="sm" onClick={() => openEditModal(event)}>
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(event)}
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

      {/* Event Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingEvent ? "Edit Event" : "Add Academic Event"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                aria-label="Close modal"
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
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
                  <label htmlFor="event-start-date" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
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
                  <label htmlFor="event-end-date" className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., ISUFST Dingle Campus"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon"
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
                <label htmlFor="isPublished" className="text-sm text-gray-700">
                  Publish immediately
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
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

function EmailSettings() {
  const toast = useToastActions();
  const [apiKey, setApiKey] = useState("");

  function handleSave() {
    toast.info("Coming soon", "Email configuration will be available in a future update.");
  }

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
          <Button className="gap-2" onClick={handleSave}>
            <Save className="w-4 h-4" />
            Save Configuration
          </Button>
        </div>
      </div>
    </Card>
  );
}
