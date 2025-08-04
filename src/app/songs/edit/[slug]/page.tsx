"use server";
import Iridescence from "@/components/ui/react-bits/backgrounds/Iridescence/Iridescence";
import { prisma } from "@/utils/prisma";
import Image from "next/image";
import React from "react";
import EditSongForm from "./edit-song-form";

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
      Users: true, // Include user information
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
    <Iridescence
      color={[1, 1, 1]}
      mouseReact={false}
      amplitude={0.1}
      speed={1.0}
      children={
        <div className="absolute top-1/5 inset-0 h-fit p-6">
          <EditSongForm song={currentSong} />
        </div>
      }
    />
  );
};

export default Page;
