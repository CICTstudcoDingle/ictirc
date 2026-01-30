"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-mono uppercase tracking-wide",
  {
    variants: {
      variant: {
        default: "bg-gray-100 text-gray-700",
        maroon: "bg-maroon/10 text-maroon",
        gold: "bg-gold/20 text-amber-800",
        success: "bg-green-100 text-green-700",
        warning: "bg-amber-100 text-amber-700",
        error: "bg-red-100 text-red-700",
      },
      status: {
        submitted: "bg-blue-100 text-blue-700",
        under_review: "bg-maroon/10 text-maroon",
        accepted: "bg-gold/20 text-amber-800",
        published: "bg-green-100 text-green-700",
        rejected: "bg-red-100 text-red-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, status, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant, status, className }))}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
