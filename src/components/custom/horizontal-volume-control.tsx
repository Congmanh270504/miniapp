"use client";

import { useState, useRef, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Volume, Volume1, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

interface HorizontalVolumeControlProps {
  initialVolume?: number;
  onVolumeChange?: (volume: number) => void;
  className?: string;
}

export function HorizontalVolumeControl({
  initialVolume = 50,
  onVolumeChange,
  className = "",
}: HorizontalVolumeControlProps) {
  const [volume, setVolume] = useState(initialVolume);
  const [isMuted, setIsMuted] = useState(false);
  const [isControlVisible, setIsControlVisible] = useState(false);
  const controlRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Call the onVolumeChange callback when volume changes
    if (onVolumeChange) {
      onVolumeChange(isMuted ? 0 : volume);
    }
  }, [volume, isMuted, onVolumeChange]);

  useEffect(() => {
    // Handle clicks outside the volume control to hide it
    const handleClickOutside = (event: MouseEvent) => {
      if (
        controlRef.current &&
        !controlRef.current.contains(event.target as Node)
      ) {
        setIsControlVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleVolumeChange = (newValue: number[]) => {
    const newVolume = newValue[0];
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
    } else {
      setIsMuted(true);
    }
  };

  const toggleControlVisibility = () => {
    setIsControlVisible(!isControlVisible);
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) {
      return <VolumeX className="h-5 w-5" />;
    } else if (volume < 33) {
      return <Volume className="h-5 w-5" />;
    } else if (volume < 66) {
      return <Volume1 className="h-5 w-5" />;
    } else {
      return <Volume2 className="h-5 w-5" />;
    }
  };

  return (
    <div ref={controlRef}>
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            toggleControlVisibility();
          }}
          className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {getVolumeIcon()}
        </button>
      </div>

      {isControlVisible && (
        <div className="absolute top-3 right-[7.5em] w-1/4 mb-2 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-800 z-10">
          <div className="flex justify-between items-center gap-2 ">
            <Slider
              value={[isMuted ? 0 : volume]}
              min={0}
              max={100}
              step={1}
              onValueChange={handleVolumeChange}
              orientation="horizontal"
              className="h-full"
              aria-label="Volume Control"
            />
            <span className="text-xs text-muted-foreground mt-1 font-bold">
              {isMuted ? "Muted" : `${volume}%`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
