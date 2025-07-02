import React from "react";
import MusicLayout from "./music-layout";
import { prisma } from "@/utils/prisma";
import { pinata } from "@/utils/config";
import { ProcessedSongsData } from "../../../types/song-types";

const Page = async () => {
  const data = await prisma.songs.findMany({
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
      createdAt: "desc",
    },
  });
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
  return <MusicLayout songData={songData} />;
};

export default Page;
