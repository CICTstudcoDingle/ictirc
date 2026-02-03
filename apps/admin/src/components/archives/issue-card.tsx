"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ictirc/ui";
import { Calendar, FileText, BookOpen } from "lucide-react";

interface IssueCardProps {
  issue: {
    id: string;
    issueNumber: number;
    month?: string | null;
    publishedDate: Date;
    issn?: string | null;
    theme?: string | null;
    volume: {
      volumeNumber: number;
      year: number;
    };
    conference?: {
      name: string;
    } | null;
    _count?: {
      papers: number;
    };
  };
}

export function IssueCard({ issue }: IssueCardProps) {
  const paperCount = issue._count?.papers || 0;

  return (
    <Link href={`/dashboard/archives/issues/${issue.id}`}>
      <Card className="hover:bg-accent cursor-pointer transition-colors h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Issue {issue.issueNumber}
          </CardTitle>
          <CardDescription>
            Volume {issue.volume.volumeNumber} • {issue.month} {issue.volume.year}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {issue.theme && (
            <p className="text-sm font-medium line-clamp-2">{issue.theme}</p>
          )}
          {issue.issn && (
            <p className="text-xs text-muted-foreground">ISSN: {issue.issn}</p>
          )}
          {issue.conference && (
            <p className="text-xs text-muted-foreground">{issue.conference.name}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t">
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              {paperCount} paper{paperCount !== 1 ? "s" : ""}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
