"use client";

import { Download, Copy, Check } from "lucide-react";
import { Button } from "@ictirc/ui";
import { useState } from "react";

interface PaperActionsProps {
  pdfUrl?: string;
  citation: string;
}

export function PaperActions({ pdfUrl, citation }: PaperActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="px-4 sm:px-8 py-4 bg-gray-50 border-b border-gray-100 flex flex-wrap gap-2 md:gap-3">
      {pdfUrl ? (
        <a href={pdfUrl} download className="inline-block">
          <Button size="sm">
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
        </a>
      ) : (
        <Button size="sm" disabled>
          <Download className="w-4 h-4" />
          PDF Coming Soon
        </Button>
      )}
      <Button variant="secondary" size="sm" onClick={handleCopy}>
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            Copy Citation
          </>
        )}
      </Button>
    </div>
  );
}
