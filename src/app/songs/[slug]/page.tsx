"use client";
import MusicPlayer from "@/components/song-profile/music-player";
import PlaylistComment from "@/components/song-profile/playlist-comment";
import Image from "next/image";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";

export default function Home() {
  // //   const params = useParams();
  // //   const { slug } = params;
  return (
    <div className="flex w-full h-full p-4 gap-2 ">
      <MusicPlayer
        title="What's the Move"
        artist="Young Thug feat. Lil Uzi Vert"
        albumArt="/twice.png"
        audioSrc="/What-is-love.mp3"
      />
      <PlaylistComment />
    </div>
  );
}
