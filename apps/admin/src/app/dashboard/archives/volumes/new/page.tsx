import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@ictirc/ui";
import { VolumeForm } from "@/components/archives/volume-form";

export const metadata = {
  title: "Create Volume",
  description: "Create a new publication volume",
};

export default function NewVolumePage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/archives/volumes">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Volumes
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Create New Volume</h1>
        <p className="text-muted-foreground mt-1">
          Add a new publication volume to the archive
        </p>
      </div>

      <VolumeForm />
    </div>
  );
}
