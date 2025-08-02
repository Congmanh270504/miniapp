"use server";
import { songForList } from "@/lib/prisma-includes";
import {
  createBatchAccessLinksImages,
  transformSongDataWithUrls,
} from "@/lib/song-utils";
import { prisma } from "@/utils/prisma";
import { SignIn } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { unstable_cache } from "next/cache";
import React from "react";
import MainPage from "../all/main-page";

export const getCachedHeartedSongs = unstable_cache(
  async (clerkId: string, imageExpires: number = 3600) => {
    const userDb = await prisma.users.findUnique({
      where: { clerkId },
      include: {
        HeartedSongs: {
          include: {
            Songs: {
              include: songForList,
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 10, // Lấy 20 bài để có đủ cho next/prev
        },
      },
    });

    if (!userDb || !userDb.HeartedSongs.length) {
      return { heartedSongs: [], imageUrls: [], hasMore: false };
    }

    const songs = userDb.HeartedSongs.map((item) => item.Songs);

    // Tạo image URLs
    const { imageUrls } = await createBatchAccessLinksImages(
      songs,
      imageExpires
    );

    return {
      heartedSongs: songs,
      imageUrls,
      hasMore: userDb.HeartedSongs.length === 10,
    };
  },
  ["hearted-songs"],
  {
    revalidate: 1800, // 30 phút
    tags: ["songs", "hearted-songs"],
  }
);
const Page = async () => {
  const user = await currentUser();
  if (!user) {
    return <SignIn />;
  }
  const { heartedSongs, imageUrls, hasMore } = await getCachedHeartedSongs(user.id);

  const songData = transformSongDataWithUrls(heartedSongs, imageUrls);

  return (
    <MainPage
      initialSongData={songData}
      hasMore={hasMore}
      title="Hearted Songs"
    />
  );
};

export default Page;
