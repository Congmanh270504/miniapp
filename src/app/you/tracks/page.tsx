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

export default async function Page() {
  const user = await currentUser();
  if (!user) {
    return (
      <div className="container mx-auto py-10">
        You must be logged in to view this page.
      </div>
    );
  }

  const data = await prisma.users.findFirst({
    where: {
      clerkId: user.id,
    },
    include: {
      Songs: {
        include: {
          Genre: true,
          Image: true,
          HeartedSongs: true, // Include hearted songs
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!data) {
    return <div className="container mx-auto py-10">User not found.</div>;
  }

  // Tạo biến chứa thông tin song với cid và url
  const songData = await Promise.all(
    data.Songs.map(async (song) => {
      // Tạo access link cho file nhạc
      const musicUrl = await pinata.gateways.private.createAccessLink({
        cid: song.fileCid,
        expires: 3600, // 1 hour
      });

      // Tạo access link cho ảnh (nếu có)
      let imageUrl = "";
      if (song.Image?.cid) {
        imageUrl = await pinata.gateways.private.createAccessLink({
          cid: song.Image.cid,
          expires: 3600, // 1 hour
        });
      }

      return {
        songId: song.id,
        title: song.title,
        artist: song.artist,
        musicFile: {
          cid: song.fileCid,
          url: musicUrl,
        },
        imageFile: {
          cid: song.Image?.cid || "",
          url: imageUrl,
        },
        genre: song.Genre.name,
        createdAt: song.createdAt,
        hearted: song.HeartedSongs.length , // Kiểm tra xem bài hát có được yêu thích không
      };
    })
  );
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
