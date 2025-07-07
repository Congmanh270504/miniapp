"use server";
import { prisma } from "@/utils/prisma";
import { SongsType, SongWithUrls } from "../../../types/collection-types";
import { pinata } from "@/utils/config";
interface CreateSongData {
  title: string;
  slug: string;
  artistName: string;
  genreId: string;
  album?: string;
  description?: string;
}
export async function createSong(
  songsCid: string,
  imagesCid: string,
  userId: string,
  duration: number,
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
    const isExistingSong = await prisma.songs.findFirst({
      where: {
        OR: [{ title: data.title }, { slug: data.slug }],
      },
    });

    if (isExistingSong) {
      // Kiểm tra xem trùng title hay slug để thông báo cụ thể
      if (
        isExistingSong.title === data.title &&
        isExistingSong.slug === data.slug
      ) {
        return {
          ok: false,
          message: "Song with this title and slug already exists",
        };
      } else if (isExistingSong.title === data.title) {
        return {
          ok: false,
          message: "Song with this title already exists",
        };
      } else {
        return {
          ok: false,
          message: "Song with this slug already exists",
        };
      }
    }

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
        slug: data.slug,
        artist: data.artistName,
        genreId: data.genreId,
        userId: currentUser.id,
        description: data.description,
        duration: duration,
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

export async function getSongsDataPinata(fileCid: string, imageCid: string) {
  try {
    const musicUrl = await pinata.gateways.private.createAccessLink({
      cid: fileCid,
      expires: 3600, // 1 hour
    });

    const imageUrl = await pinata.gateways.private.createAccessLink({
      cid: imageCid,
      expires: 3600, // 1 hour
    });

    return {
      musicUrl,
      imageUrl,
    };
  } catch (error) {
    console.error("Error fetching song data:", error);
    return null;
  }
}
export async function deletedSong(song: SongWithUrls) {
  try {
    // Xóa song từ database (tự động xóa các bản ghi liên quan nhờ onDelete: Cascade)
    const deletedSong = await prisma.songs.delete({
      where: { id: song.songId },
    });

    if (!deletedSong) {
      return { ok: false, message: "Song not found" };
    }

    // Xóa files từ Pinata
    const filesImage = await pinata.files.private
      .list()
      .cid(song.imageFile.cid);

    if (!filesImage) {
      return { ok: false, message: "Image file not found" };
    }

    const filesMusic = await pinata.files.private
      .list()
      .cid(song.musicFile.cid);

    if (!filesMusic) {
      return { ok: false, message: "Music file not found" };
    }

    const deleteFile = await pinata.files.private.delete([
      filesImage.files[0].id,
      filesMusic.files[0].id,
    ]);

    if (!deleteFile) {
      return { ok: false, message: "Failed to delete files from Pinata" };
    }

    return { ok: true, message: `Song "${song.title}" deleted successfully!` };
  } catch (error) {
    console.error("Error deleting song:", error);
    return { ok: false, message: "Failed to delete song" };
  }
}
