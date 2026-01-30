import Link from "next/link";
import { FileText, Calendar, Users } from "lucide-react";
import { Badge } from "@ictirc/ui";

interface PaperCardProps {
  id: string;
  title: string;
  abstract: string;
  authors: { name: string }[];
  category: string;
  publishedAt?: Date;
  doi?: string;
  status: "SUBMITTED" | "UNDER_REVIEW" | "ACCEPTED" | "PUBLISHED" | "REJECTED";
}

const statusMap = {
  SUBMITTED: "submitted",
  UNDER_REVIEW: "under_review",
  ACCEPTED: "accepted",
  PUBLISHED: "published",
  REJECTED: "rejected",
} as const;

export function PaperCard({
  id,
  title,
  abstract,
  authors,
  category,
  publishedAt,
  doi,
  status,
}: PaperCardProps) {
  const formattedDate = publishedAt
    ? publishedAt.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      })
    : null;

  return (
    <Link href={`/archive/${id}`} className="block group">
      <article className="paper-card p-6 h-full hover:shadow-md transition-shadow">
        {/* Category & Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-medium text-maroon uppercase tracking-wide">
            {category}
          </span>
          <Badge status={statusMap[status]}>
            {status.replace("_", " ")}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 group-hover:text-maroon transition-colors line-clamp-2 mb-2">
          {title}
        </h3>

        {/* Abstract */}
        <p className="text-sm text-gray-600 line-clamp-3 mb-4">{abstract}</p>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
          {/* Authors */}
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span className="truncate max-w-[150px]">
              {authors.map((a) => a.name).join(", ")}
            </span>
          </div>

          {/* Date */}
          {formattedDate && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formattedDate}</span>
            </div>
          )}

          {/* DOI */}
          {doi && (
            <div className="flex items-center gap-1 font-mono">
              <FileText className="w-3.5 h-3.5" />
              <span className="truncate max-w-[120px]">{doi}</span>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
