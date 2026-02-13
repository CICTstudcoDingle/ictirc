"use client";

import { useState, useTransition } from "react";
import { Save, Eye, EyeOff, Plus, ChevronDown, ChevronRight } from "lucide-react";
import { upsertHomeSection, toggleHomeSectionPublished } from "@/app/actions/home-content";

interface HomeSection {
  id: string;
  section: string;
  title: string | null;
  subtitle: string | null;
  content: unknown;
  imageUrl: string | null;
  isPublished: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

interface DefaultSection {
  section: string;
  label: string;
  description: string;
}

interface Props {
  sections: HomeSection[];
  defaultSections: DefaultSection[];
}

export function HomeContentEditor({ sections, defaultSections }: Props) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<Record<string, string>>({});

  // Merge existing data with default section definitions
  const mergedSections = defaultSections.map((def) => {
    const existing = sections.find((s) => s.section === def.section);
    return {
      ...def,
      data: existing || null,
      title: existing?.title || "",
      subtitle: existing?.subtitle || "",
      imageUrl: existing?.imageUrl || "",
      isPublished: existing?.isPublished ?? true,
      content: (existing?.content as Record<string, unknown>) || {},
    };
  });

  const handleSave = (section: string, data: {
    title: string;
    subtitle: string;
    imageUrl: string;
    content: Record<string, unknown>;
  }) => {
    startTransition(async () => {
      try {
        await upsertHomeSection({
          section,
          title: data.title || undefined,
          subtitle: data.subtitle || undefined,
          imageUrl: data.imageUrl || undefined,
          content: data.content,
        });
        setSaveStatus((prev) => ({ ...prev, [section]: "saved" }));
        setTimeout(() => setSaveStatus((prev) => ({ ...prev, [section]: "" })), 2000);
      } catch {
        setSaveStatus((prev) => ({ ...prev, [section]: "error" }));
      }
    });
  };

  const handleTogglePublished = (section: string) => {
    startTransition(async () => {
      await toggleHomeSectionPublished(section);
    });
  };

  return (
    <div className="space-y-4">
      {mergedSections.map((section) => (
        <div
          key={section.section}
          className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-colors ${
            section.isPublished ? "border-gray-200" : "border-orange-200 bg-orange-50/30"
          } ${isPending ? "opacity-60" : ""}`}
        >
          {/* Section Header */}
          <div
            className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() =>
              setExpandedSection(expandedSection === section.section ? null : section.section)
            }
          >
            {expandedSection === section.section ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{section.label}</h3>
              <p className="text-xs text-gray-500">{section.description}</p>
            </div>
            <div className="flex items-center gap-2">
              {section.data ? (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                  Configured
                </span>
              ) : (
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                  Not Set
                </span>
              )}
              {saveStatus[section.section] === "saved" && (
                <span className="text-xs text-green-600 font-medium">✓ Saved</span>
              )}
            </div>
          </div>

          {/* Expanded Editor */}
          {expandedSection === section.section && (
            <SectionForm
              section={section}
              onSave={handleSave}
              onTogglePublished={handleTogglePublished}
              isPending={isPending}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function SectionForm({
  section,
  onSave,
  onTogglePublished,
  isPending,
}: {
  section: {
    section: string;
    label: string;
    title: string;
    subtitle: string;
    imageUrl: string;
    isPublished: boolean;
    content: Record<string, unknown>;
  };
  onSave: (section: string, data: {
    title: string;
    subtitle: string;
    imageUrl: string;
    content: Record<string, unknown>;
  }) => void;
  onTogglePublished: (section: string) => void;
  isPending: boolean;
}) {
  const [title, setTitle] = useState(section.title);
  const [subtitle, setSubtitle] = useState(section.subtitle);
  const [imageUrl, setImageUrl] = useState(section.imageUrl);
  const [contentJson, setContentJson] = useState(
    JSON.stringify(section.content, null, 2)
  );

  return (
    <div className="px-6 pb-6 border-t border-gray-100 space-y-4 pt-4">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Section title"
          className="w-full bg-gray-50 border-b-2 border-gray-300 rounded-t-md px-4 py-2.5 text-sm focus:border-maroon focus:outline-none transition-colors"
        />
      </div>

      {/* Subtitle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
        <textarea
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          placeholder="Section subtitle or description"
          rows={3}
          className="w-full bg-gray-50 border-b-2 border-gray-300 rounded-t-md px-4 py-2.5 text-sm focus:border-maroon focus:outline-none transition-colors resize-none"
        />
      </div>

      {/* Image URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full bg-gray-50 border-b-2 border-gray-300 rounded-t-md px-4 py-2.5 text-sm font-mono focus:border-maroon focus:outline-none transition-colors"
        />
      </div>

      {/* Extra Content (JSON) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Additional Content <span className="text-gray-400 text-xs">(JSON format)</span>
        </label>
        <textarea
          value={contentJson}
          onChange={(e) => setContentJson(e.target.value)}
          placeholder='{ "key": "value" }'
          rows={4}
          className="w-full bg-gray-50 border-b-2 border-gray-300 rounded-t-md px-4 py-2.5 text-sm font-mono focus:border-maroon focus:outline-none transition-colors resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => onTogglePublished(section.section)}
          disabled={isPending}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {section.isPublished ? (
            <>
              <EyeOff className="w-4 h-4" />
              Unpublish
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              Publish
            </>
          )}
        </button>

        <button
          onClick={() => {
            let parsedContent: Record<string, unknown> = {};
            try {
              parsedContent = contentJson ? JSON.parse(contentJson) : {};
            } catch {
              // Keep empty if JSON is invalid
            }
            onSave(section.section, {
              title,
              subtitle,
              imageUrl,
              content: parsedContent,
            });
          }}
          disabled={isPending}
          className="inline-flex items-center gap-2 bg-maroon text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-maroon/90 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>
    </div>
  );
}
