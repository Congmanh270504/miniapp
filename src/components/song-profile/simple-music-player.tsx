"use client";

import { useState, useRef, useEffect } from "react";
import MusicControls from "@/components/song-profile/music-controls";
import MusicProgressBar from "@/components/song-profile/music-progress-bar";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { CircleXButton } from "../custom/circle-x-button";
import { Songs } from "@prisma/client";

type SongWithUrls = {
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
export default function SimpleMusicPlayer({
  songs,
}: {
  songs: SongWithUrls[];
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audio = audioRef.current;
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeatOne, setIsRepeatOne] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(50);
  const [currentSong, setCurrentSong] = useState<SongWithUrls>(songs[0]);

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

    const setAudioData = () => {
      setDuration(audio.duration);
    };

    const setAudioTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      if (isRepeatOne) {
        audio.currentTime = 0;
        audio.play().catch((error) => {
          console.error("Error playing audio:", error);
        });
      } else {
        setIsPlaying(false);
        setCurrentTime(0);
      }
    };

    audio.addEventListener("loadedmetadata", setAudioData);
    audio.addEventListener("timeupdate", setAudioTime);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", setAudioData);
      audio.removeEventListener("timeupdate", setAudioTime);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [isRepeatOne]);

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
    setCurrentTime(newTime);
  };

  const handleBackward10s = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = Math.max(audio.currentTime - 10, 0);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleProgressChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = value[0];
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (volume: number) => {
    setCurrentVolume(volume);
    if (audio) {
      audio.volume = volume / 100;
    }
  };

  // Dummy functions for prev/next since this is a single song player
  const handlePrevSong = () => {
    const currentIndex = songs.findIndex(
      (song) => song.songId === currentSong.songId
    );
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    if (prevIndex < 0) return;
    setCurrentSong(songs[prevIndex]);
    setIsPlaying(true);
    setCurrentTime(0);
  };

  const handleNextSong = () => {
    const currentIndex = songs.findIndex(
      (song) => song.songId === currentSong.songId
    );
    const nextIndex = (currentIndex + 1) % songs.length;
    if (nextIndex > songs.length) return;
    setCurrentSong(songs[nextIndex]);
    setCurrentTime(0);
    setIsPlaying(true);
  };
  const [isHidden, setIsHidden] = useState(false);
  return isHidden ? (
    <div>
      <Button onClick={() => setIsHidden(false)}>Show Player</Button>
    </div>
  ) : (
    <div
      className={
        "bg-white dark:bg-gray-900 rounded-lg p-4 shadow-lg border relative animate-fade-down animate-once"
      }
    >
      {/* Song Info */}
      {/* <div className="mb-4">
        <h3 className="font-semibold text-lg">{currentSong.title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{currentSong.artist}</p>
      </div> */}

      <CircleXButton
        size="sm"
        variant="ghost"
        onClick={() => {
          setIsHidden(true);
          togglePlay();
        }} // Uncomment to hide player
        // onClick={() => removeNotification(notification.id)}
        className="absolute top-0 right-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100"
      />
      {/* Controls */}
      <MusicControls
        isPlaying={isPlaying}
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
        duration={duration}
        onProgressChange={handleProgressChange}
      />

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={currentSong.musicFile.url}
        loop={isRepeatOne}
      />
    </div>
  );
}
