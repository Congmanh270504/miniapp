import Loading from "@/components/ui/loading";
import { prisma } from "@/utils/prisma";
import React, { Suspense } from "react";
import { columns } from "./colums";
import { unstable_cache } from "next/cache";
import { getRandomColor } from "@/lib/hepper";
import { DataTable } from "@/components/data-table/data-table";

// Cache function for admin genres with pagination
const getCachedAdminGenres = unstable_cache(
  async () => {
    // Get genres with songs count
    const genres = await prisma.genres.findMany({
      include: {
        _count: {
          select: {
            Songs: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Get total count for pagination

    return genres;
  },
  ["admin-genres-with-count"],
  {
    revalidate: 3600, // 1 hour cache
    tags: ["admin", "genres", "count"],
  }
);

const Page = async () => {
  const genres = await getCachedAdminGenres();

  if (!genres || genres.length === 0) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No genres found</h2>
          <p className="text-gray-600">
            Create your first genre to get started!
          </p>
        </div>
      </div>
    );
  }

  // Transform data for table
  const genreData = genres.map((genre) => ({
    id: genre.id,
    name: genre.name,
    description: genre.description,
    songsCount: genre._count.Songs,
    createdAt: genre.createdAt,
  }));
  const randomColors = getRandomColor();
  return (
    <Suspense fallback={<Loading />}>
      <div className="container mx-auto py-10 flex flex-col gap-4">
        <div className="flex items-center justify-between self-center">
          <h1 className="text-2xl font-bold" style={{ color: randomColors }}>
            Genres Management
          </h1>
        </div>

        <DataTable columns={columns} data={genreData} dataPage="genres" />
      </div>
    </Suspense>
  );
};

export default Page;
