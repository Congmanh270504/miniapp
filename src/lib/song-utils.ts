import { pinata } from "@/utils/config";
import {
  ProcessedSongsData,
  ProcessedSongSlugPinata,
  SongWithPinataImage,
} from "../../types/song-types";

/**
 * Create access link for current song (both music and image)
 */
export async function createCurrentSongAccessLinks(
  song: { fileCid: string; Image?: { cid: string } | null },
  expires: number = 3600
) {
  const [musicResult, imageResult] = await Promise.allSettled([
    pinata.gateways.private.createAccessLink({
      cid: song.fileCid,
      expires,
    }),
    song.Image?.cid
      ? pinata.gateways.private
          .createAccessLink({
            cid: song.Image.cid,
            expires,
          })
          .optimizeImage({
            format: "webp",
          })
      : Promise.resolve(""),
  ]);

  return {
    musicUrl: musicResult.status === "fulfilled" ? musicResult.value : "",
    imageUrl: imageResult.status === "fulfilled" ? imageResult.value : "",
  };
}

/**
 * Create optimized image access links for playlist (images only)
 */
export async function createPlaylistImageLinks(
  songs: Array<{ Image?: { cid: string } | null }>,
  expires: number = 3600
) {
  const imageResults = await Promise.allSettled(
    songs.map(async (song) => {
      if (!song.Image?.cid) return "";
      try {
        const accessLink = await pinata.gateways.private
          .createAccessLink({
            cid: song.Image.cid,
            expires,
          })
          .optimizeImage({
            width: 300,
            height: 300,
            format: "webp",
            fit: "cover",
          });
        // Return plain access link without optimization parameters
        return accessLink;
      } catch (error) {
        console.error("Failed to create optimized image URL:", error);
        return "";
      }
    })
  );

  return imageResults.map((result) =>
    result.status === "fulfilled" ? result.value : ""
  );
}

/**
 * Batch create Pinata access links for songs with error handling
 */

export async function createBatchAccessLinks(
  songs: Array<{ fileCid: string; Image?: { cid: string } | null }>,
  expires: number = 3600
) {
  const [musicUrls, imageUrls] = await Promise.allSettled([
    Promise.allSettled(
      songs.map(async (song) => {
        try {
          return await pinata.gateways.private.createAccessLink({
            cid: song.fileCid,
            expires,
          });
        } catch (error) {
          console.error("Failed to create music URL:", error);
          return "";
        }
      })
    ),
    Promise.allSettled(
      songs.map(async (song) => {
        if (!song.Image?.cid) return "";
        try {
          return await pinata.gateways.private
            .createAccessLink({
              cid: song.Image.cid,
              expires,
            })
            .optimizeImage({
              format: "webp",
            });
        } catch (error) {
          console.error("Failed to create image URL:", error);
          return "";
        }
      })
    ),
  ]);

  const musicUrlsResolved =
    musicUrls.status === "fulfilled"
      ? (musicUrls.value as PromiseSettledResult<string>[]).map((result) =>
          result.status === "fulfilled" ? result.value : ""
        )
      : songs.map(() => "");

  const imageUrlsResolved =
    imageUrls.status === "fulfilled"
      ? (imageUrls.value as PromiseSettledResult<string>[]).map((result) =>
          result.status === "fulfilled" ? result.value : ""
        )
      : songs.map(() => "");

  return {
    musicUrls: musicUrlsResolved,
    imageUrls: imageUrlsResolved,
  };
}

export async function createBatchAccessLinksImages(
  songs: Array<{ Image: { cid: string } }>,
  expires: number = 3600
) {
  const [imageUrls] = await Promise.allSettled([
    Promise.allSettled(
      songs.map(async (song) => {
        if (!song.Image?.cid) return "";
        try {
          return await pinata.gateways.private
            .createAccessLink({
              cid: song.Image.cid,
              expires: expires,
            })
            .optimizeImage({
              width: 300,
              height: 300,
              format: "webp",
              fit: "cover",
            });
        } catch (error) {
          console.error("Failed to create image URL:", error);
          return "";
        }
      })
    ),
  ]);

  const imageUrlsResolved =
    imageUrls.status === "fulfilled"
      ? (imageUrls.value as PromiseSettledResult<string>[]).map((result) =>
          result.status === "fulfilled" ? result.value : ""
        )
      : songs.map(() => "");

  return {
    imageUrls: imageUrlsResolved,
  };
}

/**
 * Transform current song data with access links
 */
export function transformCurrentSongData(
  song: {
    id: string;
    title: string;
    slug: string;
    artist: string;
    description: string;
    duration: number;
    fileCid: string;
    createdAt: Date;
    Image?: { cid: string } | null;
    Genre: { name: string };
    Users: { clerkId: string };
    HeartedSongs: Array<any>;
    Comments: Array<any>;
  },
  musicUrl: string,
  imageUrl: string
) {
  return {
    songId: song.id,
    title: song.title,
    slug: song.slug,
    artist: song.artist,
    clerkId: song.Users.clerkId || "",
    description: song.description,
    duration: song.duration,
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
    hearted: song.HeartedSongs,
    comments: song.Comments,
  };
}

/**
 * Transform playlist songs data
 */
export function transformPlaylistData(
  songs: Array<{
    id: string;
    title: string;
    slug: string;
    artist: string;
    duration?: number;
    fileCid: string;
    createdAt: Date;
    Image?: { cid: string } | null;
    Genre: { name: string };
    HeartedSongs: Array<any>;
  }>,
  imageUrls: string[]
) {
  return songs.map((song, index) => ({
    songId: song.id,
    title: song.title,
    slug: song.slug,
    artist: song.artist,
    clerkId: "",
    description: "",
    duration: song.duration || 0,
    musicFile: {
      cid: song.fileCid,
      url: "",
    },
    imageFile: {
      cid: song.Image?.cid || "",
      url: imageUrls[index] || "",
    },
    genre: song.Genre.name,
    createdAt: song.createdAt,
    hearted: song.HeartedSongs,
    comments: [],
  }));
}

/**
 * Transform song data with Pinata URLs (simple version)
 */
export function transformSongData(
  songs: Array<{
    id: string;
    title: string;
    slug: string;
    artist: string;
    duration?: number;
    fileCid: string;
    createdAt: Date;
    Image?: { cid: string } | null;
    Genre: { name: string };
    _count: {
      HeartedSongs: number;
      Comments: number;
    };
  }>,
  musicUrls: string[],
  imageUrls: string[]
) {
  return songs.map((song, index) => ({
    songId: song.id,
    title: song.title,
    slug: song.slug,
    artist: song.artist,
    duration: song.duration || 0,
    musicFile: {
      cid: song.fileCid,
      url: musicUrls[index] || "",
    },
    imageFile: {
      cid: song.Image?.cid || "",
      url: imageUrls[index] || "",
    },
    genre: song.Genre.name,
    createdAt: song.createdAt,
    hearted: song._count.HeartedSongs,
    comments: song._count.Comments,
  }));
}

/**
 * Transform song data with Pinata URLs (for ProcessedSongsData)
 */
export function transformSongDataWithUrls(
  songs: Array<{
    id: string;
    title: string;
    slug: string;
    artist: string;
    description: string;
    fileCid: string;
    createdAt: Date;
    Image?: { cid: string } | null;
    Genre?: { name: string };
    Users?: { clerkId: string };
    HeartedSongs?: Array<any>;
    Comments?: Array<any>;
  }>,
  imageUrls: string[]
): SongWithPinataImage[] {
  return songs.map((song, index) => ({
    songId: song.id,
    title: song.title,
    slug: song.slug,
    fileCid: song.fileCid,
    artist: song.artist,
    clerkId: song.Users?.clerkId || "",
    description: song.description,
    imageFile: {
      cid: song.Image?.cid || "",
      url: imageUrls[index] || "",
    },
    genre: song.Genre?.name || "",
    createdAt: song.createdAt,
    hearted: song.HeartedSongs || [],
    comments: song.Comments || [],
  }));
}

/**
 * Transform song data with Pinata URLs (full version for ProcessedSongsData)
 */
export function transformSongDataFull(
  songs: Array<{
    id: string;
    title: string;
    slug: string;
    artist: string;
    description: string;
    fileCid: string;
    createdAt: Date;
    duration: number;
    Image?: { cid: string } | null;
    Genre: { name: string };
    Users: { clerkId: string };
    HeartedSongs: Array<any>;
    Comments: Array<any>;
  }>,
  imageUrls: string[],
  musicUrls: string[]
): ProcessedSongsData {
  return songs.map((song, index) => ({
    songId: song.id,
    title: song.title,
    slug: song.slug,
    artist: song.artist,
    clerkId: song.Users.clerkId || "",
    description: song.description,
    duration: song.duration,
    musicFile: {
      cid: song.fileCid,
      url: musicUrls[index] || "",
    },
    imageFile: {
      cid: song.Image?.cid || "",
      url: imageUrls[index] || "",
    },
    genre: song.Genre.name,
    createdAt: song.createdAt,
    hearted: song.HeartedSongs,
    comments: song.Comments,
  }));
}

export function transformSongDataSlug(
  songs: Array<{
    id: string;
    title: string;
    slug: string;
    artist: string;
    description: string;
    fileCid: string;
    createdAt: Date;
    duration: number;
    Image?: { cid: string } | null;
    Genre: { name: string };
    Users: { clerkId: string };
    HeartedSongs: Array<any>;
  }>,
  imageUrls: string[],
  musicUrls: string[]
): ProcessedSongSlugPinata[] {
  return songs.map((song, index) => ({
    songId: song.id,
    title: song.title,
    slug: song.slug,
    artist: song.artist,
    clerkId: song.Users.clerkId || "",
    description: song.description,
    duration: song.duration,
    musicFile: {
      cid: song.fileCid,
      url: musicUrls[index] || "",
    },
    imageFile: {
      cid: song.Image?.cid || "",
      url: imageUrls[index] || "",
    },
    genre: song.Genre.name,
    createdAt: song.createdAt,
    hearted: song.HeartedSongs,
  }));
}
