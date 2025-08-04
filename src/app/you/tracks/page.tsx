import { columns } from "./colums";
import { prisma } from "@/utils/prisma";
import { currentUser } from "@clerk/nextjs/server";
import SimpleMusicPlayer from "@/components/song-profile/simple-music-player";
import { Suspense } from "react";
import Loading from "@/components/ui/loading";
import { unstable_cache } from "next/cache";
import { songForListFast, songsForTracks } from "@/lib/prisma-includes";
import { Metadata } from "next";
import { createBatchAccessLinks, transformSongData } from "@/lib/song-utils";
import { DataTable } from "@/components/data-table/data-table";

// Metadata for SEO optimization
export const metadata: Metadata = {
  title: "Your Tracks - Music Library",
  description: "Manage and play your uploaded music tracks",
  keywords: ["my music", "tracks", "uploads", "personal library"],
  robots: {
    index: false, // Private page
    follow: false,
  },
};

// Cached function để lấy user songs với URLs (comprehensive cache)
const getCachedUserSongsWithUrls = unstable_cache(
  async (clerkId: string) => {
    const userData = await prisma.users.findFirst({
      where: {
        clerkId: clerkId,
      },
      select: {
        id: true,
        clerkId: true,
        Songs: {
          include: songsForTracks,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!userData || !userData.Songs.length) {
      return { userData: null, musicUrls: [], imageUrls: [] };
    }

    // Batch create access links và cache chung
    const { musicUrls, imageUrls } = await createBatchAccessLinks(
      userData.Songs,
      7200 // 2 hours cache for URLs
    );

    return { userData, musicUrls, imageUrls };
  },
  ["user-songs-with-urls"],
  {
    revalidate: 3600, // 1 hour cache
    tags: ["songs", "user-songs", "urls"],
  }
);

export default async function Page() {
  const user = await currentUser();
  if (!user) {
    return (
      <div className="container mx-auto py-10">
        You must be logged in to view this page.
      </div>
    );
  }

  // Sử dụng comprehensive cached function
  const { userData, musicUrls, imageUrls } = await getCachedUserSongsWithUrls(
    user.id
  );

  if (!userData || !userData.Songs.length) {
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

  // Transform song data với pre-cached URLs
  const songData = transformSongData(userData.Songs, musicUrls, imageUrls);
  return (
    <Suspense fallback={<Loading />}>
      <div className="container mx-auto py-10 flex flex-col gap-4 ">
        <DataTable columns={columns} data={songData} dataPage="tracks"/>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 rounded-lg ">
          <SimpleMusicPlayer songs={songData} />
        </div>
      </div>
    </Suspense>
  );
}
