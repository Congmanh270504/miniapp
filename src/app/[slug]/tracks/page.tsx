"use server";
import MainPage from "@/app/songs/all/main-page";
import { getUserById } from "@/lib/actions/user";
import {
  createBatchAccessLinksImages,
  transformSongDataWithUrls,
} from "@/lib/song-utils";
import { prisma } from "@/utils/prisma";
import React from "react";
interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { slug } = await params;
  const userSongs = await prisma.users.findUnique({
    where: { clerkId: slug },
    include: {
      Songs: {
        include: {
          Image: true,
          Comments: true,
          HeartedSongs: true,
        },
        take: 10,
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
  const totalUserSongs = await prisma.songs.count({
    where: { userId: userSongs?.id },
  });
  const hasMore = totalUserSongs > 10; // Có nhiều hơn 10 bài hát

  if (!userSongs) {
    return <div className="text-center">User not found</div>;
  }

  const { imageUrls } = await createBatchAccessLinksImages(
    userSongs.Songs,
    3600 // Cache for 1 hour
  );

  const { user } = await getUserById(userSongs.clerkId);
  if (!user || !user.fullName) {
    return <div className="text-center">User not found</div>;
  }
  const songData = transformSongDataWithUrls(userSongs.Songs, imageUrls);

  return (
    <MainPage
      initialSongData={songData}
      hasMore={hasMore}
      title={"Songs upload by " + user?.fullName}
    />
  );
};

export default Page;
