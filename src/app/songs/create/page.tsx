import AudioUpload from "@/components/custom/audio-upload";
import SongLimitPage from "@/components/ui/song-limit";
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

  if (totalSongs >= 20) {
    return <SongLimitPage />;
  }

  return (
    <div className=" h-full ">
      <AudioUpload />
    </div>
  );
};

export default Page;
