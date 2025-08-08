import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { pinata } from "@/utils/config";
import { clerkClient } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";
import { rateLimit } from "@/lib/rate-limit";
import { z } from "zod";
import { songForSearch } from "@/lib/prisma-includes";
import { createBatchAccessLinksImages } from "@/lib/song-utils";
import { unstable_cache } from "next/cache";

// Validation schema
const searchSchema = z.object({
  q: z.string().min(1).max(100),
  limit: z.number().min(1).max(20).optional().default(10),
  fullResults: z.boolean().optional().default(false), // New parameter for full results
});

// Rate limiting per user
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500, // Max 500 unique users per minute
});

// Cached search function for songs
const getCachedSearchSongs = (query: string, limit?: number) => {
  const cacheKey = `search-songs-${query}-${limit || "unlimited"}`;

  return unstable_cache(
    async () => {
      const songs = await prisma.songs.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { slug: { contains: query, mode: "insensitive" } },
            { artist: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
        include: songForSearch,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      });

      if (!songs || songs.length === 0) {
        return { songs: [], imageUrls: [] };
      }

      // Use batch processing for images
      const { imageUrls } = await createBatchAccessLinksImages(songs, 3600);

      return {
        songs: songs.map((song, index) => ({
          ...song,
          imageUrl: imageUrls[index] || null,
          commentsCount: song._count?.Comments || 0,
          heartedCount: song._count?.HeartedSongs || 0,
        })),
        imageUrls,
      };
    },
    [cacheKey],
    {
      revalidate: 3600, // 1 hour cache for search results
      tags: ["search", "songs", cacheKey],
    }
  )();
};

// Cached search function for users
const getCachedSearchUsers = (query: string, limit: number) => {
  const cacheKey = `search-users-${query}-${limit}`;

  return unstable_cache(
    async () => {
      const client = await clerkClient();

      const { data } = await client.users.getUserList({
        query: query,
        limit: limit,
      });

      if (!data || data.length === 0) {
        return [];
      }

      // Filter users based on search query
      const filteredUsers = data.filter((user) => {
        const searchableText = [
          user.firstName,
          user.lastName,
          user.username,
          user.emailAddresses[0]?.emailAddress,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(query.toLowerCase());
      });

      return filteredUsers;
    },
    [cacheKey],
    {
      revalidate: 180, // 3 minutes cache for users (shorter because user data changes more frequently)
      tags: ["search", "users", cacheKey],
    }
  )();
};

export async function GET(request: NextRequest) {
  try {
    // 1. Authentication check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Rate limiting
    try {
      await limiter.check(15, userId); // 15 requests per minute per user (cao hơn vì search real-time)
    } catch {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    // 3. Input validation
    const { searchParams } = new URL(request.url);
    const rawQuery = searchParams.get("q");
    const rawLimit = searchParams.get("limit");
    const rawFullResults = searchParams.get("fullResults");

    const validatedInput = searchSchema.parse({
      q: rawQuery,
      limit: rawLimit ? parseInt(rawLimit) : undefined,
      fullResults: rawFullResults === "true",
    });

    // 4. Sanitize input
    const sanitizedQuery = validatedInput.q.trim();

    // Use cached search function for better performance
    const { songs: songsWithImages } = await getCachedSearchSongs(
      sanitizedQuery,
      validatedInput.fullResults ? undefined : Math.min(validatedInput.limit, 6)
    );

    // Use cached search function for users
    const filteredUsers = await getCachedSearchUsers(
      sanitizedQuery,
      validatedInput.fullResults ? 100 : Math.min(validatedInput.limit, 10)
    );

    const result = {
      songs: songsWithImages,
      users: validatedInput.fullResults
        ? filteredUsers
        : filteredUsers.slice(0, Math.min(validatedInput.limit, 4)), // Conditional user limit
    };

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
