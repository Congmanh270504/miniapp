"use server";
import { prisma } from "@/utils/prisma";
import Image from "next/image";
import React, { Suspense } from "react";
import Loading from "@/components/ui/loading";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { unstable_cache } from "next/cache";
import { songSlug } from "@/lib/prisma-includes";
import {
  createBatchAccessLinks,
  transformSongDataFull,
  transformSongDataSlug,
} from "@/lib/song-utils";
import { getUserById } from "@/lib/actions/user";
import MusicPlayerWrapper from "@/components/song-profile/music-player-wrapper";
import Custom404 from "@/app/not-found";

// Cached function để lấy tất cả songs cho playlist (cache 5 phút) - theo thứ tự cố định
const getCachedAllPlaylistSongs = unstable_cache(
  async (unless: string) => {
    return await prisma.songs.findMany({
      include: songSlug,
      where: {
        NOT: {
          id: unless,
        },
      },
      take: 5, // Lấy 5 bài để có đủ cho next/prev
      orderBy: {
        createdAt: "desc",
      },
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
    include: songSlug,
  });

  if (!currentSong) {
    return <Custom404 />;
  }

  const heartedSongs = currentSong.HeartedSongs.find(
    (hearted) => hearted.userId === user?.id
  );

  const heart = heartedSongs ? true : false;

  // Lấy tất cả bài hát cho playlist theo thứ tự cố định - cached
  const allPlaylistSongs = await getCachedAllPlaylistSongs(currentSong.id).then(
    (songs) => [currentSong, ...songs]
  );

  // Tạo access links cho tất cả bài hát
  const { musicUrls, imageUrls } = await createBatchAccessLinks(
    allPlaylistSongs, // Giới hạn lấy 10 bài để tránh quá tải
    3600
  );

  const playlistData = transformSongDataSlug(
    allPlaylistSongs,
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
      <div className="flex w-full h-[90vh] p-4 gap-2 max-md:flex-col ">
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
