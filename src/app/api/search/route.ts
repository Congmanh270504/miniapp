import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { pinata } from "@/utils/config";
import { clerkClient } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";
import { rateLimit } from "@/lib/rate-limit";
import { z } from "zod";
import { songForSearch } from "@/lib/prisma-includes";

// Validation schema
const searchSchema = z.object({
  q: z.string().min(1).max(100),
  limit: z.number().min(1).max(20).optional().default(10),
});

// Rate limiting per user
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500, // Max 500 unique users per minute
});

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

    const validatedInput = searchSchema.parse({
      q: rawQuery,
      limit: rawLimit ? parseInt(rawLimit) : undefined,
    });

    // 4. Sanitize input
    const sanitizedQuery = validatedInput.q.trim();

    console.log(
      "Search API called with query:",
      sanitizedQuery,
      "by user:",
      userId
    );

    const client = await clerkClient();

    console.log("Starting search for:", sanitizedQuery);

    // Search for songs với security (Users model chỉ có clerkId, thông tin user lấy từ Clerk)
    const songs = await prisma.songs.findMany({
      where: {
        OR: [
          { title: { contains: sanitizedQuery, mode: "insensitive" } },
          { artist: { contains: sanitizedQuery, mode: "insensitive" } },
          { description: { contains: sanitizedQuery, mode: "insensitive" } },
        ],
      },
      include: songForSearch, // Sử dụng pattern ngắn gọn
      take: Math.min(validatedInput.limit, 6), // Sử dụng validated limit, max 6
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log("Found songs:", songs.length);

    // Get song images from Pinata - simplified approach
    const songsWithImages = await Promise.all(
      songs.map(async (song) => {
        try {
          // Sử dụng pattern từ getSongsDataPinata
          const imageUrl = await pinata.gateways.private.createAccessLink({
            cid: song.Image.cid,
            expires: 3600, // 1 hour
          });
          return {
            ...song,
            imageUrl,
          };
        } catch (error) {
          console.error(
            "Error fetching song image for",
            song.title,
            ":",
            error
          );
          return {
            ...song,
            imageUrl: null,
          };
        }
      })
    );
    if (!songsWithImages || songsWithImages.length === 0) {
      console.log("No songs found with images for query:", sanitizedQuery);
    }

    console.log("Songs with images:", songsWithImages.length);

    // Get user data from Clerk với security
    const { data } = await client.users.getUserList({
      query: sanitizedQuery,
      limit: Math.min(validatedInput.limit, 10), // Giới hạn số lượng
    });

    let filteredUsers: any[] = [];

    if (data && data.length > 0) {
      // Filter users based on search query
      filteredUsers = data.filter((user) => {
        const searchableText = [
          user.firstName,
          user.lastName,
          user.username,
          user.emailAddresses[0]?.emailAddress,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(sanitizedQuery.toLowerCase());
      });
    }

    console.log("Filtered users:", filteredUsers.length);

    const result = {
      songs: songsWithImages,
      users: filteredUsers.slice(0, Math.min(validatedInput.limit, 4)), // Sử dụng validated limit
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
