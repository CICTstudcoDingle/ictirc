"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon/50 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-maroon text-white hover:shadow-[4px_4px_0px_0px_rgba(212,175,55,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        secondary:
          "bg-transparent border-2 border-maroon text-maroon hover:bg-maroon/5",
        outline:
          "bg-transparent border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300",
        ghost: "bg-transparent text-maroon hover:bg-maroon/10",
        gold: "bg-gold text-maroon hover:bg-gold/90",
      },
      size: {
        sm: "h-9 px-4 text-sm rounded-md",
        md: "h-11 px-6 text-base rounded-md",
        lg: "h-14 px-8 text-lg rounded-md",
        icon: "h-10 w-10 rounded-md",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
