import { pinata } from "@/utils/config";
import React from "react";
import { SongWithPinataImage } from "../../../types/song-types";
import { prisma } from "@/utils/prisma";
import { unstable_cache } from "next/cache";
import { songForListFast } from "@/lib/prisma-includes";
import { createBatchAccessLinksImages } from "@/lib/song-utils";
const getCachedTrendingSongs = unstable_cache(
  async (): Promise<SongWithPinataImage[]> => {
    try {
      const songs = await prisma.songs.findMany({
        include: songForListFast, // Sử dụng pattern nhanh cho home page
        orderBy: [
          { createdAt: "desc" },
          { HeartedSongs: { _count: "desc" } }, // Thêm sort theo popularity
        ],
        take: 8,
      });

      if (!songs.length) {
        return [];
      }

      // Performance optimization: Batch create access links với timeout
      const { imageUrls } = await createBatchAccessLinksImages(songs, 3600);
      console.log(imageUrls);
      return [];
    } catch (error) {
      console.error("❌ Error in getCachedTrendingSongs:", error);
      // Return empty array instead of throwing to prevent page crash
      return [];
    }
  },
  ["home-trending-songs"],
  {
    revalidate: 900, // 15 phút
    tags: ["songs", "trending", "home"],
  }
);
const Page = async () => {
  const data = await getCachedTrendingSongs();

  return <div>aaa</div>;
};

export default Page;
