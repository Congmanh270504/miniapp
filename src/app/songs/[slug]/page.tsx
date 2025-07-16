"use server";
import MusicPlayer from "@/components/song-profile/music-player";
import PlaylistComment from "@/components/song-profile/playlist-comment";
import { prisma } from "@/utils/prisma";
import Image from "next/image";
import React, { Suspense } from "react";
import Loading from "@/components/ui/loading";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { unstable_cache } from "next/cache";
import { songWithAllRelations } from "@/lib/prisma-includes";
import {
  createCurrentSongAccessLinks,
  createPlaylistImageLinks,
  transformCurrentSongData,
  transformPlaylistData,
} from "@/lib/song-utils";

// Helper: Standard include pattern cho songs với tất cả relations
const songIncludePattern = songWithAllRelations;

// Cached function để lấy playlist songs (cache 5 phút) - chỉ lấy 5 bài đầu
const getCachedPlaylistSongs = unstable_cache(
  async (excludeId: string) => {
    return await prisma.songs.findMany({
      where: {
        NOT: {
          id: excludeId,
        },
      },
      include: {
        Image: true,
        Genre: true,
        HeartedSongs: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5, // Chỉ lấy 5 bài đầu
    });
  },
  ["playlist-songs"],
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

  // Lấy 5 bài hát cho playlist (loại trừ bài hát hiện tại) - cached
  const playlistSongs = await getCachedPlaylistSongs(currentSong.id);

  // Tạo access links riêng biệt
  // 1. Cho bài hát hiện tại: cả nhạc và ảnh
  const currentSongLinks = await createCurrentSongAccessLinks(
    currentSong,
    3600
  );

  // 2. Cho playlist: chỉ ảnh được tối ưu hóa
  const playlistImageUrls = await createPlaylistImageLinks(playlistSongs);

  // Transform data
  const currentSongData = transformCurrentSongData(
    currentSong,
    currentSongLinks.musicUrl,
    currentSongLinks.imageUrl
  );

  const playlistData = transformPlaylistData(playlistSongs, playlistImageUrls);

  return (
    <Suspense fallback={<Loading />}>
      <div className="flex w-full h-full p-4 gap-2 ">
        <MusicPlayer
          slug={currentSong.slug}
          songs={[currentSongData, ...playlistData]}
          heart={heart}
          userId={user.id}
        />
        <PlaylistComment
          currentSong={currentSong.id}
          comments={currentSong.Comments}
          songs={[currentSongData, ...playlistData]}
        />
      </div>
    </Suspense>
  );
}
