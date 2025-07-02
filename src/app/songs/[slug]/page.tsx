"use server";
import MusicPlayer from "@/components/song-profile/music-player";
import PlaylistComment from "@/components/song-profile/playlist-comment";
import { prisma } from "@/utils/prisma";
import { pinata } from "@/utils/config";
import Image from "next/image";
import React, { Suspense } from "react";
import {
  SongsData,
  SongWithIncludes,
  ProcessedSongData,
  ProcessedSongWithPinata,
  ProcessedSongsData,
} from "../../../../types/song-types";
import Loading from "@/components/ui/loading";
import { getSongsDataPinata } from "@/lib/actions/songs";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
interface PageProps {
  params: {
    slug: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

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
  const heartedSongs = currentSong.HeartedSongs.find(
    (hearted) => hearted.userId === user?.id
  );

  const heart = heartedSongs ? true : false;

  // Lấy 9 bài hát random khác (loại trừ bài hát hiện tại)
  const otherSongs = await prisma.songs.findMany({
    where: {
      NOT: {
        id: currentSong.id, // Sử dụng NOT thay vì not để rõ ràng hơn
      },
    },
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
    orderBy: {
      id: "desc",
    },
    take: 9,
  });

  // Kết hợp kết quả với bài hát hiện tại ở đầu
  const data: SongsData = currentSong
    ? [currentSong, ...otherSongs]
    : otherSongs;

  const songData: ProcessedSongsData = await Promise.all(
    data.map(async (song) => {
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
        slug: song.slug, // Thêm slug vào dữ liệu
        artist: song.artist,
        clerkId: song.Users.clerkId || "", // Sử dụng clerkId từ Users nếu có
        description: song.description,
        musicFile: {
          cid: song.fileCid,
          url: musicUrl,
        },
        imageFile: {
          cid: song.Image.cid,
          url: imageUrl,
        },
        genre: song.Genre.name,
        createdAt: song.createdAt,
        hearted: song.HeartedSongs,
        comments: song.Comments,
      };
    })
  );

  return (
    <Suspense fallback={<Loading />}>
      <div className="flex w-full h-full p-4 gap-2 ">
        <MusicPlayer
          slug={currentSong.slug}
          songs={songData}
          heart={heart}
          userId={user.id}
        />
        <PlaylistComment
          currentSong={currentSong.id}
          comments={currentSong.Comments}
          songs={songData}
        />
      </div>
    </Suspense>
  );
}
