import Loading from "@/components/ui/loading";
import {
  getCachedSongsTracks,
  getCachedSongsWithImages,
} from "@/lib/cache/songs-cache";
import { createBatchAccessLinks, transformSongData } from "@/lib/song-utils";
import React, { Suspense } from "react";
import { columns } from "./colums";
import SimpleMusicPlayer from "@/components/song-profile/simple-music-player";
import { unstable_cache } from "next/cache";
import { DataTable } from "./data-table";
import { getRandomColor } from "@/lib/hepper";

// Cache function for admin songs with pagination
const getCachedAdminSongs = unstable_cache(
  async (page: number = 1, pageSize: number = 6) => {
    const offset = (page - 1) * pageSize;
    const songs = await getCachedSongsTracks(pageSize, offset);

    if (!songs || songs.length === 0) {
      return {
        songs: [],
        musicUrls: [],
        imageUrls: [],
        hasMore: false,
        totalPages: 0,
      };
    }

    const { musicUrls, imageUrls } = await createBatchAccessLinks(songs, 7200);

    // Get total count for pagination (you might need to add this to getCachedSongsTracks)
    const totalSongs = await getCachedSongsTracks(1000, 0); // Get total count
    const totalPages = Math.ceil((totalSongs?.length || 0) / pageSize);
    const hasMore = page < totalPages;

    return {
      songs,
      musicUrls,
      imageUrls,
      hasMore,
      totalPages,
      currentPage: page,
    };
  },
  ["admin-songs-with-urls"],
  {
    revalidate: 3600,
    tags: ["admin", "songs", "urls"],
  }
);

const Page = async ({ searchParams }: { searchParams: { page?: string } }) => {
  const params = await searchParams;
  const currentPage = parseInt(params.page || "1", 10);
  const { songs, musicUrls, imageUrls, hasMore, totalPages } =
    await getCachedAdminSongs(currentPage, 6);

  if (!songs || songs.length === 0) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No songs found</h2>
          <p className="text-gray-600">
            Upload your first song to get started!
          </p>
        </div>
      </div>
    );
  }

  const songData = transformSongData(songs, musicUrls, imageUrls);
  const randomColors = getRandomColor();

  return (
    <Suspense fallback={<Loading />}>
      <div className="container relative h-full mx-auto py-10 flex flex-col gap-4 mb-4">
        <div className="flex items-center justify-between self-center">
          <h1 className="text-2xl font-bold" style={{ color: randomColors }}>
            Songs Management
          </h1>
        </div>
        <DataTable
          columns={columns}
          data={songData}
          currentPage={currentPage}
          totalPages={totalPages}
          hasMore={hasMore}
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 dark:bg-gray-900 rounded-lg ">
          <SimpleMusicPlayer songs={songData} />
        </div>
      </div>
    </Suspense>
  );
};

export default Page;
