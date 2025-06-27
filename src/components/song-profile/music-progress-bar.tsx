"use client";

import { Slider } from "@/components/ui/slider";

interface MusicProgressBarProps {
  currentTime: number;
  duration: number;
  onProgressChange: (value: number[]) => void;
}

export default function MusicProgressBar({
  currentTime,
  duration,
  onProgressChange,
}: MusicProgressBarProps) {
  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="space-y-2">
      <Slider
        value={[currentTime]}
        max={duration || 0}
        step={0.1}
        onValueChange={onProgressChange}
        className="cursor-pointer"
      />
      <div className="flex justify-between text-xs">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration ?? 0)}</span>
      </div>
    </div>
  );
}
