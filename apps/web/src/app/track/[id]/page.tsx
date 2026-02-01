import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@ictirc/database";
import { PublicTracker } from "@/components/tracker";

export const metadata: Metadata = {
  title: "Track Submission | IRJICT",
  description: "Track the status of your research manuscript.",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TrackPage({ params }: PageProps) {
  const { id } = await params;

  // @ts-ignore
  const paper = await prisma.paper.findUnique({
    where: { id },
  });

  if (!paper) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-maroon mb-2">Submission Status</h1>
            <p className="text-gray-600">Tracking ID: <span className="font-mono bg-white px-2 py-1 rounded border border-gray-200 text-gray-800">{id}</span></p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
             <div className="bg-maroon/5 border-b border-maroon/10 p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                    {paper.title}
                </h2>
                {/* @ts-ignore */}
               {paper.publicationNote && (
                    <div className="mt-4 p-4 bg-white rounded-lg border border-gold/30 shadow-sm flex gap-3">
                         <div className="shrink-0 w-1 bg-gold rounded-full" />
                         <div className="text-sm text-gray-700 italic">
                            <span className="font-bold text-yellow-700 not-italic block text-xs uppercase tracking-wider mb-1">Latest Update</span>
                            {/* @ts-ignore */}
                            {paper.publicationNote}
                         </div>
                    </div>
                )}
             </div>
             
             {/* Timeline */}
             {/* @ts-ignore */}
             <PublicTracker currentStep={paper.publicationStep || 1} />
        </div>
      </div>
    </div>
  );
}
