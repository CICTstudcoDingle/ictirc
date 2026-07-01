import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@ictirc/ui";
import { prisma } from "@ictirc/database";
import { ReleaseForm } from "@/components/changelog/release-form";

interface EditReleasePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditReleasePage({
  params,
}: EditReleasePageProps) {
  const { id } = await params;

  const release = await prisma.release.findUnique({
    where: { id },
  });

  if (!release) {
    notFound();
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/dashboard/changelog">
          <Button type="button" variant="outline" className="mb-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Changelog
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mb-2">Edit Release</h1>
        <p className="text-gray-600">
          Update release details and changelog entries
        </p>
      </div>

      <ReleaseForm release={release} />
    </div>
  );
}
