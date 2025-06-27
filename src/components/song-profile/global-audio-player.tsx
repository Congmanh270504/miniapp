"use client";

import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface GlobalAudioPlayerProps {
  songs: Array<{
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
  }>;
}

export default function GlobalAudioPlayer({ songs }: GlobalAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playState = useSelector((state: RootState) => state.playSong);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const currentSong = songs.find(song => song.songId === playState.id);
    
    if (currentSong && playState.id) {
      // Set the audio source if it's different
      if (audio.src !== currentSong.musicFile.url) {
        audio.src = currentSong.musicFile.url;
        audio.load();
      }

      // Play or pause based on state
      if (playState.isPlaying) {
        audio.play().catch((error) => {
          console.error("Error playing audio:", error);
        });
      } else {
        audio.pause();
      }
    }
  }, [playState.id, playState.isPlaying, songs]);

  return (
    <audio
      ref={audioRef}
      onEnded={() => {
        // Handle song end - could dispatch next song or stop
        console.log("Song ended");
      }}
      onTimeUpdate={() => {
        // Could dispatch current time updates if needed
      }}
    />
  );
}
