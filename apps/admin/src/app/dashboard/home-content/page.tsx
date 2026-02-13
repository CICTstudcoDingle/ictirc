import { getHomeContent } from "@/app/actions/home-content";
import { HomeContentEditor } from "./home-content-editor";

const DEFAULT_SECTIONS = [
  { section: "hero", label: "Hero Section", description: "Main banner title, subtitle, and background image" },
  { section: "sponsors", label: "Sponsors & Organizers", description: "Institutional sponsors and organizer details" },
  { section: "cta", label: "Call to Action", description: "Bottom section with call-to-action messaging" },
  { section: "announcement", label: "Announcement Banner", description: "Optional site-wide announcement" },
];

export default async function HomeContentPage() {
  const sections = await getHomeContent();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Home Page Content</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage dynamic content displayed on the public home page
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-700">
          <strong>Note:</strong> Statistics (paper count, author count, etc.) are computed automatically and cannot be edited here.
          Only editable content sections are shown below.
        </p>
      </div>

      {/* Section Editors */}
      <HomeContentEditor 
        sections={sections} 
        defaultSections={DEFAULT_SECTIONS} 
      />
    </div>
  );
}
