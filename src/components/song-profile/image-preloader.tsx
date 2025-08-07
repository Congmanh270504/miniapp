"use client";

import { useEffect } from "react";
import { ProcessedSongSlugPinata } from "../../../types/song-types";

interface ImagePreloaderProps {
  songs: ProcessedSongSlugPinata[];
  currentSongId: string;
}

export function ImagePreloader({ songs, currentSongId }: ImagePreloaderProps) {
  useEffect(() => {
    const currentIndex = songs.findIndex(
      (song) => song.songId === currentSongId
    );
    if (currentIndex === -1) return;

    // Preload 3 ảnh tiếp theo và 3 ảnh trước đó
    const indicesToPreload = [
      (currentIndex + 1) % songs.length, // Next
      (currentIndex + 2) % songs.length, // Next + 1
      (currentIndex + 3) % songs.length, // Next + 2
      (currentIndex - 1 + songs.length) % songs.length, // Previous
      (currentIndex - 2 + songs.length) % songs.length, // Previous - 1
      (currentIndex - 3 + songs.length) % songs.length, // Previous - 2
    ];

    const preloadImages = indicesToPreload
      .map((index) => {
        const song = songs[index];
        if (!song?.imageFile.url) return null;

        return new Promise((resolve, reject) => {
          const img = new window.Image();
          img.onload = resolve;
          img.onerror = reject;
          img.src = song.imageFile.url;
        });
      })
      .filter(Boolean);

    // Preload images in background
    Promise.allSettled(preloadImages).then((results) => {
      const successCount = results.filter(
        (r) => r.status === "fulfilled"
      ).length;
    });
  }, [songs, currentSongId]);

  return null; // This component doesn't render anything
}
