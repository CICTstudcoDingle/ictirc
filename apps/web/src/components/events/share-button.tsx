"use client";

import { Share2 } from "lucide-react";
import { Button } from "@ictirc/ui";

interface ShareButtonProps {
  title: string;
}

export function ShareButton({ title }: ShareButtonProps) {
  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({
        title: title,
        url: window.location.href,
      });
    }
  };

  return (
    <Button variant="ghost" onClick={handleShare}>
      <Share2 className="w-4 h-4" />
      Share
    </Button>
  );
}
