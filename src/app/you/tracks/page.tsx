import { Songs, Users, Prisma } from "@prisma/client";
import { DataTable } from "./data-table";
import { columns } from "./colums";
import { prisma } from "@/utils/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { pinata } from "@/utils/config";
import SimpleMusicPlayer from "@/components/song-profile/simple-music-player";
import GlobalAudioPlayer from "@/components/song-profile/global-audio-player";
import { Suspense } from "react";
import Loading from "@/components/ui/loading";
import { unstable_cache } from "next/cache";
import { songForListFast } from "@/lib/prisma-includes";
import { Metadata } from "next";
import { createBatchAccessLinks, transformSongData } from "@/lib/song-utils";

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

// Cached function để lấy user songs (cache 5 phút)
const getCachedUserSongs = unstable_cache(
  async (clerkId: string) => {
    return await prisma.users.findFirst({
      where: {
        clerkId: clerkId,
      },
      select: {
        id: true,
        clerkId: true,
        Songs: {
          include: songForListFast, // Sử dụng pattern nhanh (không có Comments)
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
  },
  ["user-songs"],
  {
    revalidate: 300, // 5 phút
    tags: ["songs", "user-songs"],
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

  // Sử dụng cached function
  const data = await getCachedUserSongs(user.id);

  if (!data || !data.Songs.length) {
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

  // Performance optimization: Batch create access links
  const { musicUrls, imageUrls } = await createBatchAccessLinks(
    data.Songs,
    60
  ); // 2 hours

  // Transform song data với URLs đã được tạo sẵn
  const songData = transformSongData(data.Songs, musicUrls, imageUrls);
  return (
    <Suspense fallback={<Loading />}>
      <div className="container mx-auto py-10 flex flex-col gap-4 ">
        <DataTable columns={columns} data={songData} />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
          <SimpleMusicPlayer songs={songData} />
        </div>
      </div>
    </Suspense>
  );
}
