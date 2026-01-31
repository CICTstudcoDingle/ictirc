"use client";

import { useState, useEffect } from "react";
import { Card, Button } from "@ictirc/ui";
import { useToastActions } from "@/lib/toast";
import {
  Calendar,
  Plus,
  Trash2,
  X,
  Edit,
} from "lucide-react";
import { ImageUpload } from "@/components/upload/image-upload";

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

export default function EventsPage() {
  const toast = useToastActions();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    fetchEvents();
  }, []);

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
        fetchEvents();
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
        fetchEvents();
      } else {
        toast.error("Error", "Failed to delete event.");
      }
    } catch (error) {
      toast.error("Error", "An unexpected error occurred.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage academic conferences and events
          </p>
        </div>
        <Button className="gap-2" onClick={openAddModal}>
          <Plus className="w-4 h-4" />
          Add Event
        </Button>
      </div>

      <Card className="p-6">
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
                      <Edit className="w-4 h-4" />
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
                  Event Image
                </label>
                <ImageUpload
                  value={formData.imageUrl}
                  onUpload={(url) => setFormData({ ...formData, imageUrl: url })}
                  onRemove={() => setFormData({ ...formData, imageUrl: "" })}
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
