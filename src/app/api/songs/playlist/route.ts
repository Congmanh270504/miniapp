import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import {
  createBatchAccessLinks,
  createPlaylistImageLinks,
  transformCurrentSongData,
  transformPlaylistData,
  transformSongDataFull,
} from "@/lib/song-utils";
import { songWithAllRelations } from "@/lib/prisma-includes";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const excludeId = searchParams.get("excludeId");
    const skip = parseInt(searchParams.get("skip") || "0");
    const take = parseInt(searchParams.get("take") || "5");

    // Tạo where condition dựa trên việc có excludeId hay không
    const whereCondition = excludeId
      ? {
          NOT: {
            id: excludeId,
          },
        }
      : {};

    // Lấy songs từ database (skip những bài đã load)
    const songs = await prisma.songs.findMany({
      where: whereCondition,
      include: songWithAllRelations,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take,
    });

    // Tạo optimized image URLs cho các bài hát mới
    const { musicUrls, imageUrls } = await createBatchAccessLinks(songs);

    // Transform data
    const playlistData = transformSongDataFull(songs, imageUrls, musicUrls);

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
