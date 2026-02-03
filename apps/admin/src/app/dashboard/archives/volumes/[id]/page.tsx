import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@ictirc/ui";
import { VolumeForm } from "@/components/archives/volume-form";
import { getVolume } from "@/lib/actions/volume";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const result = await getVolume(id);

  if (!result.success) {
    return { title: "Volume Not Found" };
  }

  return {
    title: `Edit Volume ${result.data?.volumeNumber || ''}`,
    description: `Edit volume details`,
  };
}

export default async function EditVolumePage({ params }: PageProps) {
  const { id } = await params;
  const result = await getVolume(id);

  if (!result.success) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/archives/volumes">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Volumes
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">
          Edit Volume {result.data?.volumeNumber}
        </h1>
        <p className="text-muted-foreground mt-1">
          Update volume details
        </p>
      </div>

      <VolumeForm volume={result.data} />
    </div>
  );
}
