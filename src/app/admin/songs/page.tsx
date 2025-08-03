import { DataTable } from "@/components/data-table/data-table";
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
import { getUserByIdList } from "@/lib/actions/user";

// Cache function for admin songs with images
const getCachedAdminSongs = unstable_cache(
  async () => {
    const songs = await getCachedSongsTracks(12, 0); // Get more songs for admin
    if (!songs || songs.length === 0) {
      return { songs: [], musicUrls: [], imageUrls: [] };
    }

    const { musicUrls, imageUrls } = await createBatchAccessLinks(songs, 7200); // 2 hours cache
    return { songs, musicUrls, imageUrls };
  },
  ["admin-songs-with-urls"],
  {
    revalidate: 3600, // 1 hour cache
    tags: ["admin", "songs", "urls"],
  }
);

const Page = async () => {
  const { songs, musicUrls, imageUrls } = await getCachedAdminSongs();

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

  return (
    <Suspense fallback={<Loading />}>
      <div className="container relative h-full mx-auto py-10 flex flex-col gap-4 mb-4">
        <DataTable columns={columns} data={songData} />
        <div className="absolute bottom-0 left-0 right-0 p-4 dark:bg-gray-900 rounded-lg ">
          <SimpleMusicPlayer songs={songData} />
        </div>
      </div>
    </Suspense>
  );
};

export default Page;
