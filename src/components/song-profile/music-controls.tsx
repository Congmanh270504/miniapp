"use client";

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

interface MusicControlsProps {
  isPlaying: boolean;
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

export default function MusicControls({
  isPlaying,
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
    <div className="flex justify-between items-center mb-4 mt-1 ">
      <div className="flex">
        {isShuffle ? (
          <Button onClick={() => onToggleShuffle()}>
            <IoMdShuffle size={20} />
          </Button>
        ) : (
          <Button onClick={() => onToggleShuffle()}>
            <Shuffle size={20} />
          </Button>
        )}
        <div className="flex items-center gap-2 opacity-0">
          <button className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <VolumeX className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button
          className="group relative inline-flex items-center justify-center overflow-hidden shadow-neutral-500/20 transition active:scale-95 "
          onClick={onPrevSong}
        >
          <div className="transition duration-700 group-hover:rotate-[360deg]">
            <GrChapterPrevious />
          </div>
        </Button>
        <Button
          className="group relative inline-flex items-center justify-center overflow-hidden shadow-neutral-500/20 transition active:scale-95 "
          onClick={onBackward10s}
        >
          <div className="transition duration-700 group-hover:rotate-[360deg]">
            <SkipBack size={24} />
          </div>
        </Button>

        <Button
          className="bg-white rounded-full outline-solid border p-3 text-red-600 shadow-neutral-500/20 transition active:scale-95  hover:bg-gray-100 group relative inline-flex h-12 w-12 items-center justify-center overflow-hidden "
          onClick={onTogglePlay}
        >
          <div className="transition duration-700 group-hover:rotate-[360deg]">
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </div>
        </Button>
        <Button
          className="group relative inline-flex items-center justify-center overflow-hidden shadow-neutral-500/20 transition active:scale-95 "
          onClick={onForward10s}
        >
          <div className="transition duration-700 group-hover:rotate-[360deg]">
            <SkipForward size={24} />
          </div>
        </Button>

        <Button
          className="group relative inline-flex items-center justify-center overflow-hidden shadow-neutral-500/20 transition active:scale-95 "
          onClick={onNextSong}
        >
          <div className="transition duration-700 group-hover:rotate-[360deg]">
            <GrChapterNext />
          </div>
        </Button>
      </div>

      <div className="flex">
        {isRepeatOne ? (
          <Button onClick={() => onToggleRepeat()}>
            <Repeat1 size={20} />
          </Button>
        ) : (
          <Button onClick={() => onToggleRepeat()}>
            <Repeat size={20} />
          </Button>
        )}
        <HorizontalVolumeControl
          initialVolume={currentVolume}
          onVolumeChange={onVolumeChange}
        />
      </div>
    </div>
  );
}
