"use client";

import React, { memo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  VolumeX,
} from "lucide-react";
import { IoMdShuffle } from "react-icons/io";
import { Repeat1 } from "lucide-react";
import { GrChapterNext } from "react-icons/gr";
import { GrChapterPrevious } from "react-icons/gr";
import { HorizontalVolumeControl } from "@/components/custom/horizontal-volume-control";
import { FaPlay } from "react-icons/fa";
import { Slider } from "@radix-ui/react-slider";
interface MusicControlsProps {
  playSong: boolean;
  isShuffle: boolean;
  isRepeatOne: boolean;
  currentVolume: number;
  onTogglePlay: () => void;
  onPrevSong: () => void;
  onNextSong: () => void;
  onBackward10s: () => void;
  onForward10s: () => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onVolumeChange: (volume: number) => void;
}

// Memoized control button component
const ControlButton = memo(
  ({
    onClick,
    children,
    className = "group relative inline-flex items-center justify-center overflow-hidden shadow-neutral-500/20 transition active:scale-95",
  }: {
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
  }) => (
    <Button className={className} onClick={onClick}>
      <div className="transition duration-700 group-hover:rotate-[360deg]">
        {children}
      </div>
    </Button>
  )
);

ControlButton.displayName = "ControlButton";

// Memoized play button component
const PlayButton = memo(
  ({
    isPlaying,
    onTogglePlay,
  }: {
    isPlaying: boolean;
    onTogglePlay: () => void;
  }) => (
    <Button
      className="bg-black rounded-full border-black text-white transition active:scale-95  group relative inline-flex h-12 w-12 items-center justify-center overflow-hidden dark:bg-[#73737333]"
      onClick={onTogglePlay}
    >
      <div className="ml-0.5 transition duration-700 group-hover:rotate-[360deg]">
        {isPlaying ? <Pause size={24} /> : <FaPlay />}
      </div>
    </Button>
  )
);

PlayButton.displayName = "PlayButton";

function MusicControls({
  playSong,
  isShuffle,
  isRepeatOne,
  currentVolume,
  onTogglePlay,
  onPrevSong,
  onNextSong,
  onBackward10s,
  onForward10s,
  onToggleShuffle,
  onToggleRepeat,
  onVolumeChange,
}: MusicControlsProps) {
  return (
    <div className="flex justify-between items-center mb-4 mt-1">
      {/* Left side - Shuffle button */}
      <div className="flex">
        <Button onClick={onToggleShuffle}>
          {isShuffle ? <IoMdShuffle size={20} /> : <Shuffle size={20} />}
        </Button>
        <div className="flex items-center gap-2 opacity-0">
          <button className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <VolumeX className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Center - Main controls - ✅ Đã căn giữa */}
      <div className="flex items-center justify-center space-x-4 flex-1">
        <ControlButton onClick={onPrevSong}>
          <GrChapterPrevious />
        </ControlButton>

        <ControlButton onClick={onBackward10s}>
          <SkipBack size={24} />
        </ControlButton>

        <PlayButton isPlaying={playSong} onTogglePlay={onTogglePlay} />

        <ControlButton onClick={onForward10s}>
          <SkipForward size={24} />
        </ControlButton>

        <ControlButton onClick={onNextSong}>
          <GrChapterNext />
        </ControlButton>
      </div>

      {/* Right side - Repeat and Volume */}
      <div className="relative flex gap-1">
        <Button onClick={onToggleRepeat}>
          {isRepeatOne ? <Repeat1 size={20} /> : <Repeat size={20} />}
        </Button>
        <HorizontalVolumeControl
          initialVolume={currentVolume}
          onVolumeChange={onVolumeChange}
        />
      </div>
    </div>
  );
}

// Export memoized component for better performance
export default memo(MusicControls);
