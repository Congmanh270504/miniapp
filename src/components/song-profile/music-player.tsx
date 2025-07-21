"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { ChevronLeft, Music } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import MusicControls from "./music-controls";
import MusicProgressBar from "./music-progress-bar";
import { ImagePreloader } from "./image-preloader";
import {
  ProcessedSongsData,
  ProcessedSongWithPinata,
} from "../../../types/song-types";
import { HeartButton } from "@/components/custom/heart-button";

export default function MusicPlayer({
  songs,
  heart,
  currentSongData,
}: {
  songs: ProcessedSongsData;
  heart: boolean;
  currentSongData: ProcessedSongWithPinata;
}) {
  const [currentSong, setCurrentSong] =
    useState<ProcessedSongWithPinata>(currentSongData);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeatOne, setIsRepeatOne] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(50);

  // Image loading states
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Dynamic music URL loading for playlist songs
  const [musicUrls, setMusicUrls] = useState(currentSongData.musicFile.url);
  const [loadingMusicUrl, setLoadingMusicUrl] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audio = audioRef.current;

  // Preload next/previous images
  const preloadImages = useCallback(() => {
    const currentIndex = songs.findIndex(
      (song) => song.songId === currentSong.songId
    );
    const nextIndex = (currentIndex + 1) % songs.length;
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;

    // Preload next and previous images
    [nextIndex, prevIndex].forEach((index) => {
      if (songs[index]?.imageFile.url) {
        const img = new window.Image();
        img.src = songs[index].imageFile.url;
      }
    });
  }, [songs, currentSong.songId]);

  // Reset image loading state when song changes
  useEffect(() => {
    setIsImageLoading(true);
    setImageError(false);
    preloadImages();
  }, [currentSong.songId, preloadImages]);

  // Audio effects - optimized with useCallback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.load(); // Đảm bảo load lại source mới
    setCurrentTime(0);

    if (isPlaying) {
      audio.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    }
  }, [currentSong.musicFile.url, isPlaying]);

  // Audio ended handler - memoized
  const handleEnded = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isRepeatOne) {
      audio.currentTime = 0;
      audio.play().catch(console.error);
    } else if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * songs.length);
      setCurrentSong(songs[randomIndex]);
    } else {
      handleNextSong();
    }
  }, [isRepeatOne, isShuffle, songs]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, [handleEnded]);

  // Optimized handlers with useCallback
  const handleNextSong = useCallback(() => {
    const currentIndex = songs.findIndex(
      (song) => song.songId === currentSong.songId
    );
    const nextIndex = (currentIndex + 1) % songs.length;
    createMusicAccessLink(songs[nextIndex].musicFile.cid);
    setCurrentTime(0);
    setCurrentSong(songs[nextIndex]);
    setIsPlaying(true);
  }, [songs, currentSong.songId]);

  const handlePrevSong = useCallback(() => {
    const currentIndex = songs.findIndex(
      (song) => song.songId === currentSong.songId
    );
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    createMusicAccessLink(songs[prevIndex].musicFile.cid);
    setCurrentTime(0);
    setCurrentSong(songs[prevIndex]);
    setIsPlaying(true);
  }, [songs, currentSong.songId]);

  const handleVolumeChange = useCallback(
    (volume: number) => {
      setCurrentVolume(volume);
      if (audio) {
        audio.volume = volume / 100;
      }
    },
    [audio]
  );
  // Audio metadata and time tracking
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => setDuration(audio.duration);
    const setAudioTime = () => setCurrentTime(audio.currentTime);

    audio.addEventListener("loadedmetadata", setAudioData);
    audio.addEventListener("timeupdate", setAudioTime);

    return () => {
      audio.removeEventListener("loadedmetadata", setAudioData);
      audio.removeEventListener("timeupdate", setAudioTime);
    };
  }, []);

  // Optimized control handlers
  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleForward10s = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = Math.min(audio.currentTime + 10, audio.duration || 0);
    audio.currentTime = newTime;
    setCurrentTime(newTime);

    if (!isPlaying) {
      audio.play().catch(console.error);
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const handleBackward10s = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || audio.currentTime === 0) return;

    const newTime = Math.max(audio.currentTime - 10, 0);
    audio.currentTime = newTime;
    setCurrentTime(newTime);

    if (!isPlaying) {
      audio.play().catch(console.error);
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const handleProgressChange = useCallback(
    (value: number[]) => {
      const audio = audioRef.current;
      if (!audio) return;

      const newTime = value[0];
      audio.currentTime = newTime;
      setCurrentTime(newTime);

      if (!isPlaying) {
        audio.play().catch(console.error);
        setIsPlaying(true);
      }
    },
    [isPlaying]
  );

  // Toggle functions memoized
  const toggleShuffle = useCallback(
    () => setIsShuffle(!isShuffle),
    [isShuffle]
  );
  const toggleRepeat = useCallback(
    () => setIsRepeatOne(!isRepeatOne),
    [isRepeatOne]
  );

  // Image loading handlers
  const handleImageLoad = useCallback(() => {
    setIsImageLoading(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setIsImageLoading(false);
  }, []);

  // Function to create music access link on demand
  const createMusicAccessLink = useCallback(
    async (fileCid: string) => {
      if (loadingMusicUrl) return "";
      setLoadingMusicUrl(true);
      try {
        const response = await fetch(
          `/api/songs/music-access?fileCid=${encodeURIComponent(fileCid)}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.status === 200) {
          const { musicAccessLink } = await response.json();
          setMusicUrls(musicAccessLink);
        }
      } catch (error) {
        console.error("Failed to create music access link:", error);
      } finally {
        setLoadingMusicUrl(false);
      }
    },
    [musicUrls, loadingMusicUrl]
  );

  return (
    <div className="relative w-[65%] h-full rounded-lg overflow-hidden shadow-lg border border-gray-100">
      {/* Image Preloader - Background component */}
      <ImagePreloader songs={songs} currentSongId={currentSong.songId} />

      {/* Header */}
      <div className="flex justify-between items-center p-4">
        <Button
          variant="ghost"
          size="icon"
          className="inline-flex items-center justify-center rounded-md px-6 font-medium transition active:scale-95 "
        >
          <ChevronLeft size={24} className="text-black dark:text-white" />
        </Button>
        <HeartButton
          songId={currentSong.songId}
          initialHeartState={heart}
          size={24}
          debounceDelay={500}
        />
      </div>
      {/* Album Art - Optimized with loading states */}
      <div className="h-full">
        <div className="h-[55vh] w-full relative justify-items-center mx-auto min-[1900px]:h-[65vh]">
          {/* Loading skeleton */}
          {isImageLoading && (
            <div className="absolute inset-0 m-4 rounded-[2em] flex items-center justify-center ">
              <span className="loading loading-spinner loading-xl"></span>
            </div>
          )}

          {/* Error fallback */}
          {imageError ? (
            <div className="absolute inset-0 m-4 bg-gray-700 rounded-[2em] flex items-center justify-center">
              <Music className="h-12 w-12 text-gray-400" />
            </div>
          ) : (
            <Image
              src={currentSong.imageFile.url}
              alt={`${currentSong.title} by ${currentSong.artist}`}
              fill
              className={`object-cover p-4 rounded-[2em] transition-opacity duration-300 ${
                isImageLoading ? "opacity-0" : "opacity-100"
              }`}
              quality={95}
              priority={true} // High priority for faster loading
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 65vw, 50vw"
              onLoad={handleImageLoad}
              onError={handleImageError}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Cp5r6"
            />
          )}
        </div>

        {/* Song Info */}
        <div className="text-center px-4 min-[2100px]:py-6">
          <h2 className="text-xl font-bold">{currentSong.title}</h2>
          <p className="text-red-200 text-sm">{currentSong.artist}</p>
        </div>
      </div>
      {/* Controls - Memoized for better performance */}
      <div className="px-6 pb-2 absolute bottom-0 left-0 right-0 rounded-b-lg">
        <MusicControls
          playSong={isPlaying}
          isShuffle={isShuffle}
          isRepeatOne={isRepeatOne}
          currentVolume={currentVolume}
          onTogglePlay={togglePlay}
          onPrevSong={handlePrevSong}
          onNextSong={handleNextSong}
          onBackward10s={handleBackward10s}
          onForward10s={handleForward10s}
          onToggleShuffle={toggleShuffle}
          onToggleRepeat={toggleRepeat}
          onVolumeChange={handleVolumeChange}
        />

        {/* Progress Bar */}
        <MusicProgressBar
          currentTime={currentTime}
          duration={duration}
          onProgressChange={handleProgressChange}
        />
      </div>
      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={musicUrls} loop={isRepeatOne} />
    </div>
  );
}
