import { pinata } from "@/utils/config";
import { ProcessedSongsData } from "../../types/song-types";

/**
 * Batch create Pinata access links for songs with error handling
 * @param songs Array of songs with fileCid and Image.cid
 * @param expires Expiration time in seconds (default: 3600 = 1 hour)
 * @returns Object with musicUrls and imageUrls arrays
 */
export async function createBatchAccessLinks(
  songs: Array<{ fileCid: string; Image?: { cid: string } | null }>,
  expires: number = 3600
) {
  const [musicUrls, imageUrls] = await Promise.allSettled([
    // Create all music URLs in parallel
    Promise.allSettled(
      songs.map(async (song) => {
        try {
          return await pinata.gateways.private.createAccessLink({
            cid: song.fileCid,
            expires,
          });
        } catch (error) {
          console.error(
            "Failed to create music URL for fileCid:",
            song.fileCid,
            error
          );
          return "";
        }
      })
    ),
    // Create all image URLs in parallel
    Promise.allSettled(
      songs.map(async (song) => {
        if (!song.Image?.cid) return "";
        try {
          return await pinata.gateways.private.createAccessLink({
            cid: song.Image.cid,
            expires,
          });
        } catch (error) {
          console.error(
            "Failed to create image URL for cid:",
            song.Image.cid,
            error
          );
          return "";
        }
      })
    ),
  ]);

  // Extract URLs with fallback
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

/**
 * Transform song data with Pinata URLs (simple version)
 * @param songs Array of songs from database
 * @param musicUrls Array of music URLs from Pinata
 * @param imageUrls Array of image URLs from Pinata
 * @returns Processed song data ready for components
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
    HeartedSongs: Array<any>;
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
    hearted: song.HeartedSongs.length,
  }));
}

/**
 * Transform song data with Pinata URLs (full version for ProcessedSongsData)
 * @param songs Array of songs from database with full relations
 * @param musicUrls Array of music URLs from Pinata
 * @param imageUrls Array of image URLs from Pinata
 * @returns ProcessedSongsData ready for components
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
    Image?: { cid: string } | null;
    Genre: { name: string };
    Users: { clerkId: string };
    HeartedSongs: Array<any>;
    Comments: Array<any>;
  }>,
  musicUrls: string[],
  imageUrls: string[]
): ProcessedSongsData {
  return songs.map((song, index) => ({
    songId: song.id,
    title: song.title,
    slug: song.slug,
    artist: song.artist,
    clerkId: song.Users.clerkId || "",
    description: song.description,
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
