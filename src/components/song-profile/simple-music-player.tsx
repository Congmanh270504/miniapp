"use client";

import { useState, useRef, useEffect } from "react";
import MusicControls from "@/components/song-profile/music-controls";
import MusicProgressBar from "@/components/song-profile/music-progress-bar";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { CircleXButton } from "../custom/circle-x-button";
import { Songs } from "@prisma/client";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { setPlaySong } from "@/store/playSong/state";

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

  const playSong = useSelector((state: RootState) => state.playSong);

  const [currentSong, setCurrentSong] = useState<SongWithUrls>(
    songs.find((song) => song.songId === playSong.id) || songs[0]
  );

  console.log(currentSong);
  console.log(playSong);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const currentSong = songs.find((song) => song.songId === playSong.id);

    if (currentSong && playSong.id) {
      // Set the audio source if it's different
      if (audio.src !== currentSong.musicFile.url) {
        audio.src = currentSong.musicFile.url;
        audio.load();
        
        // Wait for the audio to be ready before playing
        if (playSong.isPlaying) {
          const playWhenReady = () => {
            audio.play().catch((error) => {
              console.error("Error playing audio:", error);
            });
          };
          
          // If already loaded, play immediately
          if (audio.readyState >= 2) {
            playWhenReady();
          } else {
            // Wait for canplay event
            audio.addEventListener('canplay', playWhenReady, { once: true });
          }
        }
      } else {
        // Same source, just play or pause
        if (playSong.isPlaying) {
          audio.play().catch((error) => {
            console.error("Error playing audio:", error);
          });
        } else {
          audio.pause();
        }
      }
    }
  }, [playSong.id, playSong.isPlaying, songs]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    // Only load if the source has changed
    if (audio.src !== currentSong.musicFile.url) {
      audio.src = currentSong.musicFile.url;
      audio.load();
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
        handleNextSong(); // Automatically go to next song
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

    if (playSong.isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    }
    dispatch(
      setPlaySong({ id: currentSong.songId, isPlaying: !playSong.isPlaying })
    );
    // setIsPlaying(!playSong.isPlaying);
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
    
    const prevSong = songs[prevIndex];
    setCurrentSong(prevSong);
    setCurrentTime(0);
    
    // Set the play state first, then let useEffect handle the audio
    dispatch(setPlaySong({ id: prevSong.songId, isPlaying: true }));
  };

  const handleNextSong = () => {
    const currentIndex = songs.findIndex(
      (song) => song.songId === currentSong.songId
    );
    const nextIndex = (currentIndex + 1) % songs.length;
    if (nextIndex >= songs.length) return;
    
    const nextSong = songs[nextIndex];
    setCurrentSong(nextSong);
    setCurrentTime(0);
    
    // Set the play state first, then let useEffect handle the audio
    dispatch(setPlaySong({ id: nextSong.songId, isPlaying: true }));
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
        playSong={playSong.isPlaying}
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
        onEnded={handleNextSong}
      />
    </div>
  );
}
