"use client";

import { useState, useEffect } from "react";
import { FileText, Download, BookOpen, ListChecks, Quote, RefreshCw } from "lucide-react";
import { Card, CardContent, Button, CircuitBackground } from "@ictirc/ui";

interface ResearchGuide {
  id: string;
  title: string;
  description: string | null;
  category: string;
  fileUrl: string;
}

const categoryIcons: Record<string, React.ReactNode> = {
  manuscript_template: <FileText className="w-8 h-8" />,
  citation_guide: <Quote className="w-8 h-8" />,
  submission_checklist: <ListChecks className="w-8 h-8" />,
  // Fallback for other categories
  thesis: <BookOpen className="w-8 h-8" />,
  journal: <FileText className="w-8 h-8" />,
  capstone: <BookOpen className="w-8 h-8" />,
};

const categoryLabels: Record<string, string> = {
  manuscript_template: "Manuscript Template",
  citation_guide: "Citation Guide",
  submission_checklist: "Submission Checklist",
  thesis: "Thesis Format",
  journal: "Journal Format",
  capstone: "Capstone Format",
};

const categoryColors: Record<string, string> = {
  manuscript_template: "bg-maroon/10 text-maroon",
  citation_guide: "bg-blue-100 text-blue-700",
  submission_checklist: "bg-green-100 text-green-700",
  thesis: "bg-purple-100 text-purple-700",
  journal: "bg-amber-100 text-amber-700",
  capstone: "bg-teal-100 text-teal-700",
};

export default function GuidesPage() {
  const [guides, setGuides] = useState<ResearchGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGuides();
  }, []);

  async function fetchGuides() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/guides");
      if (!response.ok) {
        throw new Error("Failed to fetch guides");
      }
      const data = await response.json();
      setGuides(data.guides || []);
    } catch (err) {
      console.error("Guides fetch error:", err);
      setError("Failed to load research guides");
    } finally {
      setLoading(false);
    }
  }

  function handleDownload(guide: ResearchGuide) {
    // Open the PDF URL in a new tab for download
    window.open(guide.fileUrl, "_blank");
  }

  return (
    <div className="pt-14 md:pt-16 min-h-screen bg-gray-50">
      {/* Header */}
      <section className="relative bg-gradient-to-br from-gray-900 via-[#4a0000] to-gray-900 py-12 md:py-20 overflow-hidden">
        <CircuitBackground variant="subtle" animated />
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Research <span className="text-gold">Guides</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Download official templates and guidelines to ensure your research paper 
            meets ICTIRC submission standards.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={fetchGuides}
              aria-label="Retry loading guides"
              className="p-2 hover:bg-red-100 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="w-16 h-16 bg-gray-200 rounded-xl mb-4"></div>
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : guides.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No Guides Available Yet
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Research guides and templates will be available here once uploaded 
              by the administrators. Please check back later.
            </p>
          </div>
        ) : (
          /* Card Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide) => (
              <Card key={guide.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  {/* Category Icon */}
                  <div
                    className={`w-16 h-16 rounded-xl flex items-center justify-center mb-4 ${
                      categoryColors[guide.category] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {categoryIcons[guide.category] || <FileText className="w-8 h-8" />}
                  </div>

                  {/* Category Badge */}
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-3 ${
                      categoryColors[guide.category] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {categoryLabels[guide.category] || guide.category}
                  </span>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {guide.title}
                  </h3>

                  {/* Description */}
                  {guide.description && (
                    <p className="text-sm text-gray-500 mb-6 line-clamp-3">
                      {guide.description}
                    </p>
                  )}

                  {/* Download Button */}
                  <Button
                    onClick={() => handleDownload(guide)}
                    className="w-full gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-16 p-6 bg-maroon/5 rounded-xl border border-maroon/10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="w-12 h-12 bg-maroon/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-6 h-6 text-maroon" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                Need Help With Your Submission?
              </h3>
              <p className="text-sm text-gray-600">
                If you have questions about formatting or the submission process, 
                please contact the CICT Research Office at{" "}
                <a href="mailto:cict@isufst.edu.ph" className="text-maroon hover:underline">
                  cict@isufst.edu.ph
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
