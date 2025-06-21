"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

interface BookmarkIconProps {
  className?: string;
  size?: number;
  initialActive?: boolean;
  onChange?: (active: boolean) => void;
}

export default function BookmarkIcon({
  className = "",
  size = 24,
  initialActive = false,
  onChange,
}: BookmarkIconProps) {
  const [active, setActive] = useState(initialActive);

  const handleClick = () => {
    const newState = !active;
    setActive(newState);
    onChange?.(newState);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="inline-flex items-center justify-center rounded-md px-1 font-medium  shadow-neutral-500/20 transition active:scale-95 ml-auto focus:outline-none"
      onClick={handleClick}
      aria-label={active ? "Remove bookmark" : "Add bookmark"}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`transition-colors duration-200 ${
          active ? "text-yellow-400" : "text-black hover:text-yellow-300"
        } ${className}`}
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
      </svg>
    </Button>
  );
}
