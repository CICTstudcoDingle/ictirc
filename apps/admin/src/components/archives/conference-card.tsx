"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge } from "@ictirc/ui";
import { Calendar, MapPin, FileText } from "lucide-react";

interface ConferenceCardProps {
  conference: {
    id: string;
    name: string;
    fullName?: string | null;
    startDate: Date;
    endDate?: Date | null;
    location?: string | null;
    theme?: string | null;
    isPublished?: boolean;
    _count?: {
      issues: number;
    };
  };
}

export function ConferenceCard({ conference }: ConferenceCardProps) {
  const issueCount = conference._count?.issues || 0;
  const now = new Date();
  const startDate = new Date(conference.startDate);
  const isUpcoming = startDate >= now;

  return (
    <Link href={`/dashboard/archives/conferences/${conference.id}`}>
      <Card className="hover:bg-accent cursor-pointer transition-colors h-full">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="flex items-center gap-2 flex-1">
              <FileText className="h-5 w-5 shrink-0" />
              <span className="line-clamp-1">{conference.name}</span>
            </CardTitle>
            <Badge variant={isUpcoming ? "default" : "secondary"} className="shrink-0">
              {isUpcoming ? "Upcoming" : "Past"}
            </Badge>
          </div>
          <CardDescription>
            {new Date(conference.startDate).toLocaleDateString()}
            {conference.endDate && ` - ${new Date(conference.endDate).toLocaleDateString()}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {conference.fullName && (
            <p className="text-sm font-medium line-clamp-2">{conference.fullName}</p>
          )}
          {conference.location && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {conference.location}
            </div>
          )}
          {conference.theme && (
            <p className="text-xs text-muted-foreground line-clamp-2">{conference.theme}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {issueCount} linked issue{issueCount !== 1 ? "s" : ""}
            </div>
            {!conference.isPublished && (
              <Badge variant="outline" className="text-xs">
                Draft
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
