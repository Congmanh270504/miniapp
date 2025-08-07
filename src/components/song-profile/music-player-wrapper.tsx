"use client";

import { useState } from "react";
import MusicPlayer from "./music-player";
import PlaylistComment from "./playlist-comment";
import { ProcessedSongSlugPinata } from "../../../types/song-types";

interface UserCreateSongInfo {
  clerkId: string;
  name: string | null;
  imageUrl: string;
}

interface MusicPlayerWrapperProps {
  currentSongData: ProcessedSongSlugPinata;
  songs: ProcessedSongSlugPinata[];
  heart: boolean;
  userCreateSongInfor: UserCreateSongInfo;
}

export default function MusicPlayerWrapper({
  currentSongData,
  songs,
  heart,
  userCreateSongInfor,
}: MusicPlayerWrapperProps) {
  const [currentSongId, setCurrentSongId] = useState(currentSongData.songId);

  const handleSongChange = (songId: string) => {
    setCurrentSongId(songId);
  };

  return (
    <>
      <MusicPlayer
        currentSongData={currentSongData}
        songs={songs}
        heart={heart}
        onSongChange={handleSongChange}
      />
      <PlaylistComment
        currentSong={currentSongId}
        songs={songs}
        userCreateSongInfor={userCreateSongInfor}
      />
    </>
  );
}
