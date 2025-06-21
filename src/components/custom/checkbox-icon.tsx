"use client";

import { Check } from "lucide-react";

interface CheckboxIconProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  size?: number;
  className?: string;
}

export default function CheckboxIconCustom({
  checked = false,
  onChange,
  size = 24,
  className = "",
}: CheckboxIconProps) {
  const handleToggle = () => {
    const newState = !checked; // Use the prop value directly
    onChange?.(newState); // Notify the parent of the change
  };

  return (
    <div
      className={`relative cursor-pointer ${className}`}
      style={{ width: size, height: size }}
      onClick={handleToggle}
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleToggle();
          e.preventDefault();
        }
      }}
    >
      {checked ? (
        <div className="flex items-center justify-center w-full h-full rounded-md bg-violet-500 text-white">
          <Check size={size * 0.6} strokeWidth={3} />
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-full rounded-md border-2 border-slate-300"></div>
      )}
    </div>
  );
}
