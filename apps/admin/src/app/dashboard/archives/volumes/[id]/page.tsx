import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@ictirc/ui";
import { VolumeForm } from "@/components/archives/volume-form";
import { DeleteVolumeButton } from "@/components/archives/delete-volume-button";
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
    title: `Edit Volume ${result.data?.volumeNumber || ""}`,
    description: `Edit volume details`,
  };
}

export default async function EditVolumePage({ params }: PageProps) {
  const { id } = await params;
  const result = await getVolume(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const volume = result.data;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/archives/volumes">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Volumes
          </Button>
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              Edit Volume {volume.volumeNumber}
            </h1>
            <p className="text-muted-foreground mt-1">Update volume details</p>
          </div>
          <DeleteVolumeButton
            volumeId={volume.id}
            volumeNumber={volume.volumeNumber}
            year={volume.year}
            variant="button"
            onDeleted={() => {}}
          />
        </div>
      </div>

      <VolumeForm volume={volume} />
    </div>
  );
}
