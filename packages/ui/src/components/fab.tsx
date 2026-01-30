"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "../lib/utils";

interface FloatingActionButtonProps {
  href?: string;
  onClick?: () => void;
  className?: string;
  label?: string;
}

export function FloatingActionButton({
  href = "/submit",
  onClick,
  className,
  label = "Submit Paper",
}: FloatingActionButtonProps) {
  const buttonClasses = cn(
    "fixed bottom-20 right-4 z-50 md:hidden",
    "w-14 h-14 rounded-full",
    "bg-maroon text-white shadow-lg",
    "flex items-center justify-center",
    "transition-all duration-200",
    "hover:shadow-[4px_4px_0px_0px_rgba(212,175,55,1)]",
    "hover:scale-105 active:scale-95",
    "safe-area-right",
    className
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={buttonClasses}
        aria-label={label}
      >
        <Plus className="w-7 h-7" strokeWidth={2.5} />
      </button>
    );
  }

  return (
    <Link href={href} className={buttonClasses} aria-label={label}>
      <Plus className="w-7 h-7" strokeWidth={2.5} />
    </Link>
  );
}
