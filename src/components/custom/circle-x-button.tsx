"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CircleXButtonProps {
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost";
  className?: string;
  disabled?: boolean;
}

export function CircleXButton({
  onClick,
  size = "md",
  variant = "outline",
  className,
  disabled = false,
}: CircleXButtonProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <Button
      variant={variant}
      size="icon"
      onClick={onClick}
      disabled={disabled}
      className={cn("rounded-full", sizeClasses[size], className)}
    >
      <X className={iconSizes[size]} />
      <span className="sr-only">Close</span>
    </Button>
  );
}
