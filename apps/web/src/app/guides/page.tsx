import { prisma } from "@ictirc/database";
import { FileText, Download, BookOpen, Quote, RefreshCw } from "lucide-react";
import { Card, CardContent, Button, CircuitBackground } from "@ictirc/ui";
import { ScrollAnimation } from "@/components/ui/scroll-animation";

export const dynamic = "force-dynamic";

export default async function GuidesPage() {
  // @ts-ignore
  const guides = await prisma.researchGuide.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
    include: {
      // @ts-ignore
      guideCategory: true,
    },
  });

  return (
    <div className="pt-14 md:pt-16 min-h-screen bg-gray-50">
      {/* Header */}
      <section className="relative bg-gradient-to-br from-gray-900 via-[#4a0000] to-gray-900 py-12 md:py-20 overflow-hidden">
        <CircuitBackground variant="subtle" animated />
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <ScrollAnimation direction="up">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Research <span className="text-gold">Guides</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Download official templates and guidelines to ensure your research paper
              meets ICTIRC submission standards.
            </p>
          </ScrollAnimation>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {guides.length === 0 ? (
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
              {guides.map((guide: any, index: number) => {
                // Determine category key from slug (preferred) or name
                const categorySlug = guide.guideCategory?.slug || guide.category || "manuscript-template";
                const categoryName = guide.guideCategory?.name || guide.category || "General";
                const categoryDesc = guide.guideCategory?.description;

                // Define styles
                const categoryColors: Record<string, string> = {
                  "manuscript_template": "bg-maroon/10 text-maroon",
                  "citation_guide": "bg-blue-100 text-blue-700",
                  "submission_checklist": "bg-green-100 text-green-700",
                  "thesis_format": "bg-purple-100 text-purple-700",
                  "journal_format": "bg-amber-100 text-amber-700",
                  "capstone_format": "bg-teal-100 text-teal-700",
                };

                const categoryIcons: Record<string, any> = {
                  "manuscript_template": FileText,
                  "citation_guide": Quote,
                  "submission_checklist": RefreshCw,
                  "thesis_format": BookOpen,
                  "journal_format": FileText,
                  "capstone_format": BookOpen,
                };

                // Normalize slug to match keys (handle both hyphens and underscores just in case)
                const normalizedSlug = categorySlug.replace(/-/g, "_");

                // Fallback or match
                const colorClass = categoryColors[normalizedSlug] || "bg-gray-100 text-gray-600";
                const IconComponent = categoryIcons[normalizedSlug] || FileText;

                return (
                  <ScrollAnimation key={guide.id} direction="up" staggerIndex={index % 3} className="h-full">
                    <Card className="hover:shadow-lg transition-shadow bg-white h-full">
                      <CardContent className="p-6">
                        {/* Category Icon */}
                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-4 ${colorClass}`}>
                          <IconComponent className="w-8 h-8" />
                        </div>

                        {/* Category Badge */}
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-3 ${colorClass}`}>
                          {categoryName}
                        </span>

                        {/* Title */}
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {guide.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-gray-500 mb-6 line-clamp-3">
                          {guide.description || categoryDesc || "No description available."}
                        </p>

                        {/* Download Button */}
                        <a
                          href={guide.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-maroon px-4 py-2 text-sm font-medium text-white hover:bg-maroon/90 focus:outline-none focus:ring-2 focus:ring-maroon focus:ring-offset-2 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download PDF
                        </a>
                      </CardContent>
                    </Card>
                  </ScrollAnimation>
                );
              })}
          </div>
        )}

        {/* How To Publish Section */}
        <div className="mt-16 mb-16">
          <ScrollAnimation direction="up" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center">HOW TO PUBLISH PAPER?</h2>
          </ScrollAnimation>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-10">
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-100 md:left-1/2 md:-ml-px" />

              <div className="space-y-8">
                {[
                  "Submit your article.",
                  "Manuscript/paper checking process (Technical, Plagiarism, Content, and AI Detection)",
                  "Manuscript/paper ID assignment for the author.",
                  "Editorial review (Accepted/Minor Changes/Major Changes/Rejected)",
                  "The final decision of acceptance sent to authors.",
                  "Authors submit copyright transfer and agreement form.",
                  "Final data of article (PDF/HTML) will be prepared and published on IRJICT.com."
                ].map((step, idx) => (
                  <ScrollAnimation key={idx} direction={idx % 2 === 0 ? "right" : "left"}>
                    <div className={`relative flex items-center gap-6 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse text-right'}`}>
                      {/* Number Bubble */}
                      <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 w-8 h-8 rounded-full bg-maroon text-white flex items-center justify-center font-bold text-sm shadow-sm ring-4 ring-white z-10">
                        {idx + 1}
                      </div>

                      {/* Content Spacer for Desktop */}
                      <div className="hidden md:block w-1/2" />

                      {/* Text Content */}
                      <div className={`flex-1 pl-12 md:pl-0 ${idx % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'}`}>
                        <p className="text-gray-700 font-medium">{step}</p>
                      </div>
                    </div>
                  </ScrollAnimation>
                        ))}
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <ScrollAnimation direction="up">
          <div className="p-6 bg-maroon/5 rounded-xl border border-maroon/10">
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
                  <a href="mailto:cict_dingle@isufst.edu.ph" className="text-maroon hover:underline">
                    cict_dingle@isufst.edu.ph
                  </a>
                </p>
              </div>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </div>
  );
}
