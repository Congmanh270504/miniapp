"use client";

import { useState, useRef, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  ChevronLeft,
  Heart,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { IoMdShuffle } from "react-icons/io";
import { Repeat1 } from "lucide-react";
import { GrChapterNext } from "react-icons/gr";
import { GrChapterPrevious } from "react-icons/gr";
import { FaHeart } from "react-icons/fa";
import { Volume, Volume1, Volume2, VolumeX } from "lucide-react";
import { HorizontalVolumeControl } from "@/components/custom/horizontal-volume-control";
import MusicControls from "./music-controls";
import MusicProgressBar from "./music-progress-bar";
import {
  ProcessedSongData,
  SongsData,
  SongWithIncludes,
  ProcessedSongsData,
  ProcessedSongWithPinata,
} from "../../../types/song-types";

export default function MusicPlayer({
  songs,
  slug,
}: {
  songs: ProcessedSongsData;
  slug: string;
}) {
  const currentSongData = songs.find((song) => song.slug === slug);
  if (!currentSongData) {
    throw new Error("Current song not found");
  }
  const [currentSong, setCurrentSong] =
    useState<ProcessedSongWithPinata>(currentSongData);
  const hearted = currentSong.hearted.find(
    (hearted) => hearted.songId === currentSong.songId
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audio = audioRef.current;
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeatOne, setIsRepeatOne] = useState(false);
  const [isHearted, setIsHearted] = useState(hearted ? true : false);
  const [currentVolume, setCurrentVolume] = useState(50);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.load(); // Đảm bảo load lại source mới
    if (isPlaying) {
      audio.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    }
    setCurrentTime(0);
  }, [currentSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (isRepeatOne) {
        audio.currentTime = 0; // Reset to start
        audio.play().catch((error) => {
          console.error("Error playing audio:", error);
        });
      } else if (isShuffle) {
        const randomIndex = Math.floor(Math.random() * songs.length);
        setCurrentSong(songs[randomIndex]);
      } else {
        handleNextSong();
      }
    };

    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentSong, isRepeatOne, songs]);

  const handleNextSong = () => {
    const currentIndex = songs.findIndex(
      (song) => song.musicFile.url === currentSong.musicFile.url
    );
    const nextIndex = (currentIndex + 1) % songs.length;
    if (nextIndex > songs.length) return;
    setCurrentSong(songs[nextIndex]);
    setIsPlaying(true);
    setCurrentTime(0);
  };

  const handlePrevSong = () => {
    const currentIndex = songs.findIndex(
      (song) => song.musicFile.url === currentSong.musicFile.url
    );
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    if (prevIndex < 0) return;
    setCurrentSong(songs[prevIndex]);
    setIsPlaying(true);
    setCurrentTime(0);
  };
  // This function would typically connect to your audio system
  const handleVolumeChange = (volume: number) => {
    setCurrentVolume(volume);
    // In a real application, you would control your audio here
    if (audio) {
      audio.volume = volume / 100; // Assuming volume is a percentage
    }
  };
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
    };

    const setAudioTime = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.addEventListener("loadedmetadata", setAudioData);
    audio.addEventListener("timeupdate", setAudioTime);

    // Cleanup
    return () => {
      audio.removeEventListener("loadedmetadata", setAudioData);
      audio.removeEventListener("timeupdate", setAudioTime);
    };
  }, [audioRef]);

  const togglePause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    }
    setIsPlaying(!isPlaying);
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
    setIsPlaying(!isPlaying);
  };

  const handleForward10s = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = Math.min(audio.currentTime + 10, audio.duration || 0);
    audio.currentTime = newTime;
    audio.play().catch((error) => {
      console.error("Error playing audio:", error);
    });
    setIsPlaying(true);
    setCurrentTime(newTime);
  };

  const handleBackward10s = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.currentTime === 0) return; // Prevent going negative
    const newTime = Math.max(audio.currentTime - 10, 0);
    audio.currentTime = newTime;
    audio.play().catch((error) => {
      console.error("Error playing audio:", error);
    });
    setIsPlaying(true);
    setCurrentTime(newTime);
  };

  const handleProgressChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = value[0];
    audio.currentTime = newTime;
    setCurrentTime(newTime);
    audio.play().catch((error) => {
      console.error("Error playing audio:", error);
    });
    setIsPlaying(true);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="relative w-[65%] h-full rounded-lg overflow-hidden shadow-lg border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center p-4">
        <Button
          variant="ghost"
          size="icon"
          className="inline-flex items-center justify-center rounded-md px-6 font-medium transition active:scale-95 "
        >
          <ChevronLeft size={24} className="text-black dark:text-white" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="inline-flex items-center justify-center rounded-md px-6 font-medium  shadow-neutral-500/20 transition active:scale-95 "
          onClick={() => setIsHearted(!isHearted)}
        >
          <FaHeart
            size={24}
            className={isHearted ? "text-red-600" : "text-gray-400"}
          />
        </Button>
      </div>
      {/* Album Art */}
      <div className="h-full">
        <div className="h-[55vh] w-full relative justify-items-center mx-auto min-[1900px]:h-[65vh]">
          <Image
            src={currentSong.imageFile.url}
            alt={`${currentSong.title} by ${currentSong.artist}`}
            fill
            className="object-cover p-4 rounded-[2em]"
            quality={100}
          />
        </div>
        {/* Song Info */}
        <div className="text-center px-4 min-[2100px]:py-6">
          <h2 className="text-xl font-bold ">{currentSong.title}</h2>
          <p className="text-red-200 text-sm">{currentSong.artist}</p>
        </div>
      </div>{" "}
      {/* Controls */}
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
          onToggleShuffle={() => setIsShuffle(!isShuffle)}
          onToggleRepeat={() => setIsRepeatOne(!isRepeatOne)}
          onVolumeChange={handleVolumeChange}
        />

        {/* Progress Bar */}
        <MusicProgressBar
          currentTime={currentTime}
          duration={audio?.duration || 0}
          onProgressChange={handleProgressChange}
        />
      </div>
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={currentSong.musicFile.url}
        loop={isRepeatOne}
      />
    </div>
  );
}
