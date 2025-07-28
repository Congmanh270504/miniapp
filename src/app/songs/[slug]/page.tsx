"use server";
import { prisma } from "@/utils/prisma";
import Image from "next/image";
import React, { Suspense } from "react";
import Loading from "@/components/ui/loading";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { unstable_cache } from "next/cache";
import { songWithAllRelations } from "@/lib/prisma-includes";
import {
  createBatchAccessLinks,
  transformSongDataFull,
} from "@/lib/song-utils";
import { getUserById } from "@/lib/actions/user";
import MusicPlayerWrapper from "@/components/song-profile/music-player-wrapper";

// Cached function để lấy tất cả songs cho playlist (cache 5 phút) - theo thứ tự cố định
const getCachedAllPlaylistSongs = unstable_cache(
  async () => {
    return await prisma.songs.findMany({
      include: songWithAllRelations,
      orderBy: {
        createdAt: "desc",
      },
      take: 20, // Lấy 20 bài để có đủ cho next/prev
    });
  },
  ["all-playlist-songs"],
  {
    revalidate: 300, // 5 phút
    tags: ["songs"],
  }
);

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const currentSong = await prisma.songs.findFirst({
    where: { slug: slug },
    include: songWithAllRelations,
  });

  if (!currentSong) {
    return (
      <div className="flex w-full h-full p-4 gap-2 ">
        <div className="flex flex-col items-center justify-center w-full h-full">
          <Image
            src="/images/404.png"
            alt="Not Found"
            width={500}
            height={500}
          />
          <h1 className="text-2xl font-bold">Song Not Found</h1>
        </div>
      </div>
    );
  }

  const heartedSongs = currentSong.HeartedSongs.find(
    (hearted) => hearted.userId === user?.id
  );

  const heart = heartedSongs ? true : false;

  // Lấy tất cả bài hát cho playlist theo thứ tự cố định - cached
  const allPlaylistSongs = await getCachedAllPlaylistSongs();

  // Tạo access links cho tất cả bài hát
  const { musicUrls, imageUrls } = await createBatchAccessLinks(
    allPlaylistSongs.slice(0, 10), // Giới hạn lấy 10 bài để tránh quá tải
    3600
  );

  const playlistData = transformSongDataFull(
    allPlaylistSongs.slice(0, 10),
    imageUrls,
    musicUrls
  );

  // Tìm current song trong playlist data
  const currentSongInPlaylist = playlistData.find(
    (song) => song.songId === currentSong.id
  );

  if (!currentSongInPlaylist) {
    return (
      <div className="flex w-full h-full p-4 gap-2 ">
        <div className="flex flex-col items-center justify-center w-full h-full">
          <h1 className="text-2xl font-bold">
            Current song not found in playlist
          </h1>
        </div>
      </div>
    );
  }

  // Get user information cho current song
  const userClerk = await getUserById(currentSong.Users.clerkId);
  if (!userClerk || !userClerk.user) {
    return (
      <div className="flex w-full h-full p-4 gap-2 ">
        <div className="flex flex-col items-center justify-center w-full h-full">
          <h1 className="text-2xl font-bold">User Not Found</h1>
        </div>
      </div>
    );
  }

  const userCreateSongInfor = {
    clerkId: userClerk.user.id,
    name: userClerk.user.fullName,
    imageUrl: userClerk.user.imageUrl,
  };

  return (
    <Suspense fallback={<Loading />}>
      <div className="flex w-full h-full p-4 gap-2 ">
        <MusicPlayerWrapper
          currentSongData={currentSongInPlaylist}
          songs={playlistData}
          heart={heart}
          userCreateSongInfor={userCreateSongInfor}
        />
      </div>
    </Suspense>
  );
}
