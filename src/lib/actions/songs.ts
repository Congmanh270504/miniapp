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

export async function getSongsDataPinata(imageCid: string) {
  try {
    const imageUrl = await pinata.gateways.private
      .createAccessLink({
        cid: imageCid,
        expires: 3600, // 1 hour
      })
      .optimizeImage({
        fit: "cover",
        format: "webp",
      });
    return imageUrl;
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

export async function updateSong(
  songId: string,
  data: {
    title: string;
    slug: string;
    artistName: string;
    description?: string;
    genreId: string;
  },
  imagesCid?: string
) {
  try {
    // Check if title or slug already exists for other songs
    const isExistingSong = await prisma.songs.findFirst({
      where: {
        AND: [
          { id: { not: songId } }, // Exclude current song
          {
            OR: [{ title: data.title }, { slug: data.slug }],
          },
        ],
      },
    });

    if (isExistingSong) {
      if (
        isExistingSong.title === data.title &&
        isExistingSong.slug === data.slug
      ) {
        return {
          ok: false,
          message: "Another song with this title and slug already exists",
        };
      } else if (isExistingSong.title === data.title) {
        return {
          ok: false,
          message: "Another song with this title already exists",
        };
      } else {
        return {
          ok: false,
          message: "Another song with this slug already exists",
        };
      }
    }

    let updateData: any = {
      title: data.title,
      slug: data.slug,
      artist: data.artistName,
      description: data.description,
      genreId: data.genreId,
    };

    // If new image is provided, update the image
    if (imagesCid) {
      const currentSong = await prisma.songs.findUnique({
        where: { id: songId },
        include: { Image: true },
      });

      if (!currentSong) {
        return { ok: false, message: "Song not found" };
      }

      // delete image in pinata clound
      const filesImage = await pinata.files.private
        .list()
        .cid(currentSong.Image.cid);
      console.log(filesImage);

      await pinata.files.private.delete([filesImage.files[0].id]);

      if (currentSong) {
        // Update existing image record
        await prisma.imagesSongs.update({
          where: { id: currentSong.imageId },
          data: { cid: imagesCid },
        });
      }
    }

    const updatedSong = await prisma.songs.update({
      where: { id: songId },
      data: updateData,
    });

    if (!updatedSong) {
      return { ok: false, message: "Failed to update song" };
    }

    return { ok: true, message: "Song updated successfully" };
  } catch (error) {
    console.error("Error updating song:", error);
    return { ok: false, message: "Failed to update song" };
  }
}
