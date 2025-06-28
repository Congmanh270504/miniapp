"use client";
import MusicPlayer from "@/components/song-profile/music-player";
import PlaylistComment from "@/components/song-profile/playlist-comment";
import { prisma } from "@/utils/prisma";
import Image from "next/image";
import React, { useEffect } from "react";

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const data = await prisma.songs.findUnique({
    where: {
      id: slug,
    },
    include: {
      Image: true,
      HeartedSongs: true, // Include hearted songs
      Comments: {
        include: {
          Replies: {
            include: {
              Users: true,
            },
          },
          Users: true,
        },
      },
    },
  });
  console.log(data);

  return (
    <div className="flex w-full h-full p-4 gap-2 ">
      <MusicPlayer data={data} />
      {/* <PlaylistComment />  */}
    </div>
  );
}
