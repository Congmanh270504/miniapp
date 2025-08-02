import { unstable_cache } from "next/cache";
import { prisma } from "@/utils/prisma";
import { songForList, songForListFast } from "@/lib/prisma-includes";
import {
  createBatchAccessLinksImages,
  transformSongDataWithUrls,
} from "@/lib/song-utils";
import { SongWithPinataImage } from "../../../types/song-types";

// Cached function để lấy all songs với pagination
export const getCachedSongs = unstable_cache(
  async (page: number = 1, limit: number = 20) => {
    return await prisma.songs.findMany({
      include: songForList,
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: (page - 1) * limit,
    });
  },
  ["all-songs"],
  {
    revalidate: 3600, // 1 giờ
    tags: ["songs", "all-songs"],
  }
);

// Cached function để lấy user upload nhiều nhất
export const getCachedUserMostUpload = unstable_cache(
  async (limit: number = 10) => {
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
          some: {},
        },
      },
      orderBy: {
        Songs: {
          _count: "desc",
        },
      },
      take: limit,
    });

    const userIds = usersWithMostSongs.map((user) => user.clerkId);
    return userIds;
  },
  ["user-most-upload-songs"],
  {
    revalidate: 3600,
    tags: ["songs", "user-most-upload"],
  }
);

// Cached function để lấy songs với image URLs
export const getCachedSongsWithImages = unstable_cache(
  async (skip: number = 0, limit: number = 20, imageExpires: number = 3600) => {
    // Lấy songs data
    const songs = await prisma.songs.findMany({
      include: songForList,
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: skip,
    });
    if (!songs || songs.length === 0) {
      return { songs: [], imageUrls: [], hasMore: false };
    }

    // Tạo image URLs
    const { imageUrls } = await createBatchAccessLinksImages(
      songs,
      imageExpires
    );

    return {
      songs,
      imageUrls,
      hasMore: songs.length === limit, // Kiểm tra xem còn dữ liệu để load
    };
  },
  ["cached-songs-with-images"],
  {
    revalidate: 3600, // 1 giờ
    tags: ["songs", "images"],
  }
);

export const getCachedTrendingSongs = unstable_cache(
  async (): Promise<SongWithPinataImage[]> => {
    try {
      const songs = await prisma.songs.findMany({
        include: songForListFast, // Sử dụng pattern nhanh cho home page
        orderBy: [
          { createdAt: "desc" },
          { HeartedSongs: { _count: "desc" } }, // Thêm sort theo popularity
          { Comments: { _count: "desc" } }, // Thêm sort theo comments
        ],
        take: 8,
      });

      if (!songs.length) {
        return [];
      }

      const { imageUrls } = await createBatchAccessLinksImages(songs, 3600);

      // Transform song data với URLs đã được tạo sẵn
      const processedData = transformSongDataWithUrls(songs, imageUrls);

      return processedData;
    } catch (error) {
      console.error("❌ Error in getCachedTrendingSongs:", error);
      // Return empty array instead of throwing to prevent page crash
      return [];
    }
  },
  ["home-trending-songs"],
  {
    revalidate: 1800, // 30 phút
    tags: ["songs", "trending", "home"],
  }
);
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
