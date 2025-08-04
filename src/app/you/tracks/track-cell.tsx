"use client";

import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { setPlaySong, togglePlaySong } from "@/store/playSong/state";
import Image from "next/image";
import { useRef } from "react";

interface TrackCellProps {
  track: {
    songId: string;
    title: string;
    artist: string;
    musicFile: {
      cid: string;
      url: string;
    };
    imageFile: {
      cid: string;
      url: string;
    };
    genre: string;
    createdAt: Date;
  };
}

export function TrackCell({ track }: TrackCellProps) {
  const dispatch = useDispatch<AppDispatch>();
  const playState = useSelector((state: RootState) => state.playSong);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isCurrentSong = playState.id === track.songId;
  const isPlaying = isCurrentSong && playState.isPlaying;

  const handlePlayPause = () => {
    if (isCurrentSong) {
      // If it's the current song, just toggle play/pause
      dispatch(togglePlaySong());
    } else {
      // If it's a different song, set it as current and play
      dispatch(setPlaySong({ id: track.songId, isPlaying: true }));
    }
  };
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    }
    dispatch(setPlaySong({ id: track.songId, isPlaying: true }));
  };

  return (
    <div className="flex items-center gap-3 w-full">
      <div className="relative h-12 w-12 rounded overflow-hidden bg-gray-100 group flex-shrink-0">
        <Image
          src={track.imageFile.url || "/twice.png"}
          alt={track.title}
          fill
          className="object-cover"
        />
        <Button
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full text-black transition-all duration-200 active:scale-95 hover:bg-white group-hover:opacity-100 inline-flex h-8 w-8 items-center justify-center overflow-hidden shadow-md ${
            track.songId === playState.id ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => {
            handlePlayPause();
            togglePlay();
          }}
          variant="ghost"
        >
          <div className="transition duration-700 group-hover:rotate-[360deg]">
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </div>
        </Button>
      </div>
      <div className="flex flex-col min-w-0 flex-1">
        <span className="font-medium text-gray-900 truncate">
          {track.title}
        </span>
      </div>
    </div>
  );
}
