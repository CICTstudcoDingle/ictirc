import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@ictirc/ui";
import { ConferenceForm } from "@/components/archives/conference-form";
import { getConference } from "@/lib/actions/conference";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const result = await getConference(id);

  if (!result.success) {
    return { title: "Conference Not Found" };
  }

  return {
    title: `Edit ${result.data?.name || ''}`,

    description: `Edit conference details`,
  };
}

export default async function EditConferencePage({ params }: PageProps) {
  const { id } = await params;
  const result = await getConference(id);

  if (!result.success) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/archives/conferences">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Conferences
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">
          Edit {result.data?.name}
        </h1>
        <p className="text-muted-foreground mt-1">
          Update conference details
        </p>
      </div>

      <ConferenceForm conference={result.data} />
    </div>
  );
}
