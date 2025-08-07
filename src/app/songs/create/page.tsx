import AudioUpload from "@/components/custom/audio-upload";
import Iridescence from "@/components/ui/react-bits/backgrounds/Iridescence/Iridescence";
import { prisma } from "@/utils/prisma";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";

const Page = async () => {
  const user = await currentUser();
  const userData = await prisma.users.findUnique({
    where: {
      clerkId: user?.id,
    },
  });

  const totalSongs = await prisma.songs.count({
    where: {
      userId: userData?.id,
    },
  });

  console.log(totalSongs);
  if (totalSongs >= 20) {
    return (
      <div className="flex w-full h-full p-4 gap-2 ">
        <div className="flex flex-col items-center justify-center w-full h-full">
          <h1 className="text-2xl font-bold">
            You have reached the limit of 20 songs.
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className=" h-full ">
      <AudioUpload />
    </div>
  );
};

export default Page;
