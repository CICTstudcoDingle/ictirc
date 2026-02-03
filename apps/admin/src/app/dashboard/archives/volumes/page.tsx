import Link from "next/link";
import { Button } from "@ictirc/ui";
import { Plus, BookOpen } from "lucide-react";
import { listVolumes } from "@/lib/actions/volume";
import { VolumeCard } from "@/components/archives/volume-card";

export const metadata = {
  title: "Manage Volumes",
  description: "Manage publication volumes",
};

export default async function VolumesPage() {
  const result = await listVolumes();
  const volumes = result.success ? result.data : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="h-8 w-8" />
            Volumes
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage publication volumes
          </p>
        </div>
        <Link href="/dashboard/archives/volumes/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Volume
          </Button>
        </Link>
      </div>

      {!volumes || volumes.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No volumes yet</h3>
          <p className="text-muted-foreground mt-2">
            Create your first volume to start organizing issues.
          </p>
          <Link href="/dashboard/archives/volumes/new">
            <Button className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Create Volume
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {volumes?.map((volume) => (
            <VolumeCard key={volume.id} volume={volume} />
          ))}
        </div>
      )}
    </div>
  );
}
