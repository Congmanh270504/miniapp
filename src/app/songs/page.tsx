import React from "react";
import MusicLayout from "./music-layout";
import { prisma } from "@/utils/prisma";
import { pinata } from "@/utils/config";
import { ProcessedSongsData } from "../../../types/song-types";
import { unstable_cache } from "next/cache";
import { Metadata } from "next";
import { songForList } from "@/lib/prisma-includes";
import {
  createBatchAccessLinks,
  createBatchAccessLinksImages,
  transformSongDataFull,
  transformSongDataWithUrls,
} from "@/lib/song-utils";
import { getUserByIdList } from "@/lib/actions/user";

// Metadata for SEO optimization
export const metadata: Metadata = {
  title: "All Songs - Music Library",
  description:
    "Discover and play your favorite songs from our extensive music library",
  keywords: ["music", "songs", "playlist", "audio", "streaming"],
  openGraph: {
    title: "Music Library - All Songs",
    description: "Discover and play your favorite songs",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Cached function để lấy all songs với pagination (cache 10 phút)
const getCachedSongs = unstable_cache(
  async (page: number = 1, limit: number = 20) => {
    return await prisma.songs.findMany({
      include: songForList, // Sử dụng pattern ngắn gọn
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      // skip: (page - 1) * limit,
    });
  },
  ["all-songs"],
  {
    revalidate: 600, // 10 phút
    tags: ["songs", "all-songs"],
  }
);
const getCachedUserMostUpload = unstable_cache(
  async (limit: number = 10) => {
    // First, get users ordered by their song count
    const usersWithMostSongs = await prisma.users.findMany({
      select: {
        id: true,
        clerkId: true,
        _count: {
          select: {
            Songs: true,
          },
        },
      },
      where: {
        Songs: {
          some: {}, // Only users who have at least one song
        },
      },
      orderBy: {
        Songs: {
          _count: "desc",
        },
      },
      take: limit, // Get top users with most uploads
    });

    // Then get songs from these users
    const userIds = usersWithMostSongs.map((user) => user.clerkId);

    return userIds;
  },
  ["user-most-upload-songs"],
  {
    revalidate: 600, // 10 phút
    tags: ["songs", "user-most-upload"],
  }
);

const Page = async () => {
  // Sử dụng cached function để lấy songs - Ưu tiên load ít songs trước
  const data = await getCachedSongs(1, 10); // Giảm xuống 30 để load nhanh hơn

  // Performance optimization: Batch create access links
  const { imageUrls } = await createBatchAccessLinksImages(data, 60); // 1 minute

  // Transform song data với URLs đã được tạo sẵn
  const songData = transformSongDataWithUrls(data, imageUrls);

  const userUploadedSongs = await getCachedUserMostUpload();
  console.log("Users list", userUploadedSongs);

  const { users } = await getUserByIdList(userUploadedSongs);

  if (!users || users.totalCount === 0) {
    console.error("No users found for the uploaded songs");
    return <div>No users found for the uploaded songs</div>;
  }

  // Tạo mảng userCreateSongInfor từ users data
  const userCreateSongInfor = users.data.map((user: any) => ({
    clerkId: user.id,
    name: user.fullName || user.firstName + " " + user.lastName,
    imageUrl: user.imageUrl,
  }));

  return (
    <MusicLayout
      songData={songData}
      userCreateSongInfor={userCreateSongInfor}
    />
  );
};

export default Page;
