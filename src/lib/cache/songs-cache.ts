import { unstable_cache } from "next/cache";
import { prisma } from "@/utils/prisma";
import { songForList } from "@/lib/prisma-includes";
import { createBatchAccessLinksImages } from "@/lib/song-utils";

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
  async (page: number = 1, limit: number = 20, imageExpires: number = 3600) => {
    // Lấy songs data
    const songs = await prisma.songs.findMany({
      include: songForList,
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    // Tạo image URLs
    const { imageUrls } = await createBatchAccessLinksImages(
      songs,
      imageExpires
    );

    return {
      songs,
      imageUrls,
    };
  },
  ["cached-songs-with-images"],
  {
    revalidate: 3600, // 1 giờ
    tags: ["songs", "images"],
  }
);
