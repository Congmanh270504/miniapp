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

interface MusicPlayerProps {
  title: string;
  artist: string;
  albumArt: string;
  audioSrc: string;
}
interface songType {
  id: string;
  title: string;
  url: string;
  artist: string;
  album: string;
  genre: string;
  releaseDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export default function MusicPlayer({ albumArt }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audio = audioRef.current;
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeatOne, setIsRepeatOne] = useState(false);
  const [isHearted, setIsHearted] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(50);
  const songs: songType[] = [
    {
      id: "1",
      title: "TT",
      artist: "Twice",
      album: "Album 1",
      genre: "Genre 1",
      releaseDate: new Date(2020, 2, 1), // year, month (0-indexed), day
      createdAt: new Date(),
      updatedAt: new Date(),
      url: "/TT.mp3",
    },
    {
      id: "2",
      title: "What is love",
      artist: "Twice",
      album: "Album 2",
      genre: "Genre 2",
      releaseDate: new Date(2021, 5, 15),
      createdAt: new Date(),
      updatedAt: new Date(),
      url: "/What-is-love.mp3",
    },
    {
      id: "3",
      title: "I Can't Stop Me",
      artist: "Twice",
      album: "Album 3",
      genre: "Genre 3",
      releaseDate: new Date(2022, 8, 20),
      createdAt: new Date(),
      updatedAt: new Date(),
      url: "/ICantStopMe.mp3",
    },
  ];
  const [currentSong, setCurrentSong] = useState<songType>(songs[0]);
  useEffect(() => {
    console.log("Next song:", currentSong);
  }, [currentSong]);

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
    // const handleEnded = () => {
    //   handleNextSong();
    // };

    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentSong, isRepeatOne, songs]);
  const handleNextSong = () => {
    const currentIndex = songs.findIndex(
      (song) => song.url === currentSong.url
    );
    const nextIndex = (currentIndex + 1) % songs.length;
    if (nextIndex > songs.length) return;
    setCurrentSong(songs[nextIndex]);
    setIsPlaying(true);
    setCurrentTime(0);
  };
  const handlePrevSong = () => {
    const currentIndex = songs.findIndex(
      (song) => song.url === currentSong.url
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
      <div className="mt-2">
        <div className="h-[55vh] w-full relative justify-items-center mx-auto min-[1900px]:h-[65vh]">
          <Image
            src={albumArt}
            alt={`${currentSong.title} by ${currentSong.artist}`}
            fill
            className="object-cover p-4 rounded-[2em]"
            quality={100}
          />
        </div>

        {/* Song Info */}
        <div className="text-center px-4 py-6">
          <h2 className="text-xl font-bold ">{currentSong.title}</h2>
          <p className="text-red-200 text-sm">{currentSong.artist}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="px-6 pb-6 absolute bottom-0 left-0 right-0 rounded-b-lg">
        <div className="flex justify-between items-center mb-4">
          <div className="flex">
            {isShuffle ? (
              <Button onClick={() => setIsShuffle(false)}>
                <IoMdShuffle size={20} />
              </Button>
            ) : (
              <Button onClick={() => setIsShuffle(true)}>
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
              onClick={handlePrevSong}
            >
              <div className="transition duration-700 group-hover:rotate-[360deg]">
                <GrChapterPrevious />
              </div>
            </Button>
            <Button
              className="group relative inline-flex items-center justify-center overflow-hidden shadow-neutral-500/20 transition active:scale-95 "
              onClick={handleBackward10s}
            >
              <div className="transition duration-700 group-hover:rotate-[360deg]">
                <SkipBack size={24} />
              </div>
            </Button>

            <Button
              className="bg-white rounded-full outline-solid border p-3 text-red-600 shadow-neutral-500/20 transition active:scale-95  hover:bg-gray-100 group relative inline-flex h-12 w-12 items-center justify-center overflow-hidden "
              onClick={togglePlay}
            >
              <div className="transition duration-700 group-hover:rotate-[360deg]">
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </div>
            </Button>
            <Button
              className="group relative inline-flex items-center justify-center overflow-hidden shadow-neutral-500/20 transition active:scale-95 "
              onClick={handleForward10s}
            >
              <div className="transition duration-700 group-hover:rotate-[360deg]">
                <SkipForward size={24} />
              </div>
            </Button>

            <Button
              className="group relative inline-flex items-center justify-center overflow-hidden shadow-neutral-500/20 transition active:scale-95 "
              onClick={handleNextSong}
            >
              <div className="transition duration-700 group-hover:rotate-[360deg]">
                <GrChapterNext />
              </div>
            </Button>
          </div>

          <div className="flex">
            {isRepeatOne ? (
              <Button onClick={() => setIsRepeatOne(false)}>
                <Repeat1 size={20} />
              </Button>
            ) : (
              <Button onClick={() => setIsRepeatOne(true)}>
                <Repeat size={20} />
              </Button>
            )}
            <HorizontalVolumeControl
              initialVolume={currentVolume}
              onVolumeChange={handleVolumeChange}
            />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Slider
            value={[currentTime]}
            max={audio?.duration} // Đảm bảo max là duration thực tế
            step={0.1}
            onValueChange={handleProgressChange}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs ">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(audio?.duration ?? 0)}</span>
          </div>
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={currentSong.url} loop={isRepeatOne} />
    </div>
  );
}
