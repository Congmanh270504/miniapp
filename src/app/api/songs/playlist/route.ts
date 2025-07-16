import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import {
  createPlaylistImageLinks,
  transformPlaylistData,
} from "@/lib/song-utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const excludeId = searchParams.get("excludeId");
    const skip = parseInt(searchParams.get("skip") || "0");
    const take = parseInt(searchParams.get("take") || "5");

    if (!excludeId) {
      return NextResponse.json(
        { error: "excludeId is required" },
        { status: 400 }
      );
    }

    // Lấy songs từ database (skip những bài đã load)
    const songs = await prisma.songs.findMany({
      where: {
        NOT: {
          id: excludeId,
        },
      },
      include: {
        Image: true,
        Genre: true,
        HeartedSongs: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take,
    });

    // Tạo optimized image URLs cho các bài hát mới
    const imageUrls = await createPlaylistImageLinks(songs);

    // Transform data
    const playlistData = transformPlaylistData(songs, imageUrls);

    return NextResponse.json({
      songs: playlistData,
      hasMore: songs.length === take,
    });
  } catch (error) {
    console.error("Error loading playlist songs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
