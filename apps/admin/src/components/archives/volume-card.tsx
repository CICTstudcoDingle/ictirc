"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ictirc/ui";
import { BookOpen, FileText } from "lucide-react";

interface VolumeCardProps {
  volume: {
    id: string;
    volumeNumber: number;
    year: number;
    description?: string | null;
    issues: Array<{
      id: string;
      issueNumber: number;
      _count?: {
        papers: number;
      };
    }>;
  };
}

export function VolumeCard({ volume }: VolumeCardProps) {
  const totalPapers = volume.issues.reduce(
    (sum, issue) => sum + (issue._count?.papers || 0),
    0
  );

  return (
    <Link href={`/dashboard/archives/volumes/${volume.id}`}>
      <Card className="hover:bg-accent cursor-pointer transition-colors h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Volume {volume.volumeNumber}
          </CardTitle>
          <CardDescription>{volume.year}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {volume.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {volume.description}
            </p>
          )}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              {volume.issues.length} issue{volume.issues.length !== 1 ? "s" : ""}
            </div>
            <div>
              {totalPapers} paper{totalPapers !== 1 ? "s" : ""}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
