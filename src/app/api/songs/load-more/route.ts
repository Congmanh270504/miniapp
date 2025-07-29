import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import {
  createBatchAccessLinks,
  createPlaylistImageLinks,
  transformCurrentSongData,
  transformPlaylistData,
  transformSongDataFull,
  transformSongDataWithUrls,
} from "@/lib/song-utils";
import { songWithAllRelations } from "@/lib/prisma-includes";
import { getCachedSongsWithImages } from "@/lib/cache/songs-cache";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get("skip") || "0");
    const take = parseInt(searchParams.get("take") || "5");

    const { songs, imageUrls, hasMore } = await getCachedSongsWithImages(
      skip,
      take,
      3600
    ); // 1 giờ cache cho images

    // Transform data
    const playlistData = transformSongDataWithUrls(songs, imageUrls);

    return NextResponse.json({
      songs: playlistData,
      hasMore: hasMore,
    });
  } catch (error) {
    console.error("Error loading playlist songs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
