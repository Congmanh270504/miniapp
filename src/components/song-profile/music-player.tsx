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
import ReactPlayer from "react-player";
import { FaLastfmSquare } from "react-icons/fa";
import SplitText from "../ui/react-bits/text-animations/SplitText/SplitText";
import ShinyText from "../ui/react-bits/text-animations/ShinyText/ShinyText";

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
  const [duration, setDuration] = useState(currentSongData.duration);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeatOne, setIsRepeatOne] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(50);

  // Image loading states
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Dynamic music URL loading for playlist songs
  const [musicUrls, setMusicUrls] = useState(currentSongData.musicFile.url);
  const [loadingMusicUrl, setLoadingMusicUrl] = useState(false);

  const playerRef = useRef<any>(null);

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
    // ReactPlayer handles loading automatically when src changes
    setCurrentTime(0);
  }, [currentSong.musicFile.url]);

  // Audio ended handler - memoized
  const handleEnded = useCallback(() => {
    if (isRepeatOne) {
      // ReactPlayer will handle repeat automatically with loop prop
      return;
    } else if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * songs.length);
      setCurrentSong(songs[randomIndex]);
    } else {
      handleNextSong();
    }
  }, [isRepeatOne, isShuffle, songs]);

  // ReactPlayer will call onEnded prop directly

  // Optimized handlers with useCallback
  const handleNextSong = useCallback(() => {
    setIsPlaying(false);
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
    setIsPlaying(false);
    const currentIndex = songs.findIndex(
      (song) => song.songId === currentSong.songId
    );
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    createMusicAccessLink(songs[prevIndex].musicFile.cid);
    setCurrentTime(0);
    setCurrentSong(songs[prevIndex]);
    setIsPlaying(true);
  }, [songs, currentSong.songId]);

  const handleVolumeChange = useCallback((volume: number) => {
    setCurrentVolume(volume);
    // ReactPlayer handles volume through props
  }, []);

  // ReactPlayer event handlers - memoized for better performance
  const handleTimeUpdate = useCallback(() => {
    const player = playerRef.current;

    if (!player) return;

    if (!player.duration) return;
    setCurrentTime(player.currentTime);
  }, []);

  const handlePlayerError = useCallback((error: any) => {
    console.error("Player error:", error);
  }, []);

  // Optimized control handlers
  const togglePlay = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleForward10s = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;

    const newTime = Math.min(currentTime + 10, duration || 0);
    player.currentTime = newTime;

    setCurrentTime(newTime);

    if (!isPlaying) {
      setIsPlaying(true);
    }
  }, [currentTime, duration, isPlaying]);

  const handleBackward10s = useCallback(() => {
    const player = playerRef.current;
    if (!player || currentTime === 0) return;

    const newTime = Math.max(currentTime - 10, 0);
    player.currentTime = newTime;
    setCurrentTime(newTime);

    if (!isPlaying) {
      setIsPlaying(true);
    }
  }, [currentTime, isPlaying]);

  const handleProgressChange = useCallback(
    (value: number[]) => {
      const player = playerRef.current;
      if (!player) return;

      const newTime = value[0];
      player.currentTime = newTime;
      setCurrentTime(newTime);

      if (!isPlaying) {
        setIsPlaying(true);
      }
    },
    [isPlaying]
  );

  // Thêm handler cho onDuration
  const handleDuration = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    setDuration(player.duration);
  }, []);

  // Toggle functions memoized
  const toggleShuffle = useCallback(
    () => setIsShuffle(!isShuffle),
    [isShuffle]
  );
  const toggleRepeat = useCallback(
    () => setIsRepeatOne(!isRepeatOne),
    [isRepeatOne]
  );


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
    <div className="flex flex-col w-[65%] h-full rounded-lg overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700">
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
      <div className="flex-1 flex flex-col">
        <div className="flex-1 w-full relative justify-items-center mx-auto">
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
              className={`object-cover p-4 rounded-[2em] transition-opacity duration-300 animate-fade-down animate-once animate-duration-500 animate-delay-500 animate-ease-linear animate-normal ${
                isImageLoading ? "opacity-0" : "opacity-100"
              }`}
              quality={95}
              priority={true} // High priority for faster loading
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 65vw, 50vw"
              onError={handleImageError}
              onLoadingComplete={() => setIsImageLoading(false)}
            />
          )}
        </div>

        {/* Song Info */}
        <div className="text-center flex flex-col gap-1 px-2 py-2 min-[2100px]:py-6">
          <SplitText
            text={currentSong.title}
            className="text-6xl italic text-center text-[#670D2F] px-3 "
            delay={100}
            duration={0.6}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
          />

          <p className="block bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 text-lg">
            {currentSong.artist}
          </p>
        </div>
      </div>

      {/* Controls - Memoized for better performance */}
      <div className="px-4 pb-2">
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

      {/* ReactPlayer Audio Element */}
      <div style={{ display: "none" }}>
        <ReactPlayer
          ref={playerRef}
          src={musicUrls}
          playing={isPlaying}
          loop={isRepeatOne}
          onTimeUpdate={handleTimeUpdate}
          onDurationChange={handleDuration}
          onEnded={handleEnded}
          onError={handlePlayerError}
        />
      </div>
    </div>
  );
}
