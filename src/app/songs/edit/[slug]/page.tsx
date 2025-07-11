"use server";
import { prisma } from "@/utils/prisma";
import Image from "next/image";
import React from "react";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { slug } = await params;
  const currentSong = await prisma.songs.findFirst({
    where: { slug: slug },
    include: {
      Image: true,
      Genre: true,
      HeartedSongs: true,
      Users: true, // Include user information
      Comments: {
        include: {
          Replies: {
            include: {
              Users: true,
            },
          },
          Users: true,
        },
      },
    },
  });
  if (!currentSong) {
    return (
      <div className="flex w-full h-full p-4 gap-2 ">
        <div className="flex flex-col items-center justify-center w-full h-full">
          <Image
            src="/images/404.png"
            alt="Not Found"
            width={500}
            height={500}
          />
          <h1 className="text-2xl font-bold">Song Not Found</h1>
        </div>
      </div>
    );
  }
  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome to the Songs Page</h1>
      <p className="mt-4">This is where you can find all the songs.</p>
      {/* Add more content or components as needed */}
    </div>
  );
};

export default Page;
