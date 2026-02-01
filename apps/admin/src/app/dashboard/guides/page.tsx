import { Suspense } from "react";
import { getCategories, getGuides } from "./actions";
import { GuidesClientPage } from "./client-page";
import { Loader2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function GuidesPage() {
  const [categoriesResult, guidesResult] = await Promise.all([
    getCategories(),
    getGuides(),
  ]);

  const categories = categoriesResult.success ? categoriesResult.categories : [];
  const guides = guidesResult.success ? guidesResult.guides : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Research Guides
        </h1>
        <p className="text-sm text-gray-500">
          Manage downloadable materials and their categories for researchers.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-maroon" />
          </div>
        }
      >
        <GuidesClientPage
          initialCategories={categories || []}
          initialGuides={guides || []}
        />
      </Suspense>
    </div>
  );
}
