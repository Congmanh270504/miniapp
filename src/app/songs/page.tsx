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
  transformSongDataFull,
} from "@/lib/song-utils";

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
      skip: (page - 1) * limit,
    });
  },
  ["all-songs"],
  {
    revalidate: 600, // 10 phút
    tags: ["songs", "all-songs"],
  }
);

const Page = async () => {
  // Sử dụng cached function để lấy songs - Ưu tiên load ít songs trước
  const data = await getCachedSongs(1, 30); // Giảm xuống 30 để load nhanh hơn

  // Performance optimization: Batch create access links
  const { musicUrls, imageUrls } = await createBatchAccessLinks(data, 3600); // 1 hour

  // Transform song data với URLs đã được tạo sẵn
  const songData = transformSongDataFull(data, musicUrls, imageUrls);

  return <MusicLayout songData={songData} />;
};

export default Page;
