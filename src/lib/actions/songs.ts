"use server";
import { prisma } from "@/utils/prisma";
import { SongsType } from "../../../types/collection-types";
interface CreateSongData {
  title: string;
  artistName: string;
  genreId: string;
  album?: string;
  description?: string;
}
export async function createSong(
  songsCid: string,
  imagesCid: string,
  userId: string,
  data: CreateSongData
) {
  try {
    const currentUser = await prisma.users.findUnique({
      where: { clerkId: userId },
    });
    // console.log(currentUser);
    if (!currentUser) {
      return { ok: false, message: "User not found" };
    }
    // console.log(songsCid, imagesCid);

    // Tạo image trước
    const image = await prisma.imagesSongs.create({
      data: {
        cid: imagesCid,
      },
    });

    if (!image) {
      return { ok: false, message: "Failed to create song image" };
    }

    // Sau đó tạo song với imageId là ID của image vừa tạo
    const song = await prisma.songs.create({
      data: {
        title: data.title,
        artist: data.artistName,
        genreId: data.genreId,
        userId: currentUser.id,
        description: data.description,
        fileCid: songsCid,
        imageId: image.id, // Sử dụng ID của image vừa tạo
      },
    });

    if (!song) {
      return { ok: false, message: "Failed to create song" };
    }
    return { ok: true, message: "Created song successfully" };
  } catch (error) {
    console.error("Error uploading song:", error);
    throw new Error("Failed to upload song");
  }
}
