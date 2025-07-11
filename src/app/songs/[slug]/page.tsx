"use server";
import MusicPlayer from "@/components/song-profile/music-player";
import PlaylistComment from "@/components/song-profile/playlist-comment";
import { prisma } from "@/utils/prisma";
import { pinata } from "@/utils/config";
import Image from "next/image";
import React, { Suspense } from "react";
import { SongsData, ProcessedSongsData } from "../../../../types/song-types";
import Loading from "@/components/ui/loading";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { unstable_cache } from "next/cache";
import { songWithAllRelations } from "@/lib/prisma-includes";
import {
  createBatchAccessLinks,
  transformSongDataFull,
} from "@/lib/song-utils";

// Helper: Standard include pattern cho songs với tất cả relations
const songIncludePattern = songWithAllRelations;

// Cached function để lấy other songs (cache 5 phút)
const getCachedOtherSongs = unstable_cache(
  async (excludeId: string) => {
    return await prisma.songs.findMany({
      where: {
        NOT: {
          id: excludeId,
        },
      },
      include: songIncludePattern,
      orderBy: {
        createdAt: "desc",
      },
      take: 9,
    });
  },
  ["other-songs"],
  {
    revalidate: 300, // 5 phút
    tags: ["songs"],
  }
);

interface PageProps {
  params: {
    slug: string;
  };
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

  // Lấy 9 bài hát random khác (loại trừ bài hát hiện tại) - cached
  const otherSongs = await getCachedOtherSongs(currentSong.id);

  // Kết hợp kết quả với bài hát hiện tại ở đầu
  const data = currentSong ? [currentSong, ...otherSongs] : otherSongs;

  // Performance optimization: Batch create access links
  const { musicUrls, imageUrls } = await createBatchAccessLinks(data, 3600); // 1 hour

  // Transform song data với URLs đã được tạo sẵn
  const songData = transformSongDataFull(data, musicUrls, imageUrls);

  return (
    <Suspense fallback={<Loading />}>
      <div className="flex w-full h-full p-4 gap-2 ">
        <MusicPlayer
          slug={currentSong.slug}
          songs={songData}
          heart={heart}
          userId={user.id}
        />
        <PlaylistComment
          currentSong={currentSong.id}
          comments={currentSong.Comments}
          songs={songData}
        />
      </div>
    </Suspense>
  );
}
