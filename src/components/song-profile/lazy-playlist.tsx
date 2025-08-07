"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { Heart } from "lucide-react";
import Link from "next/link";
import {
  ProcessedSongsData,
  ProcessedSongSlugPinata,
} from "../../../types/song-types";
import { useLazyLoading } from "@/hooks/useLazyLoading";
import OptimizedImage from "@/components/ui/optimized-image";
import { FaHeart } from "react-icons/fa";

interface LazyPlaylistProps {
  initialPlaylist: ProcessedSongSlugPinata[];
  currentSongId: string;
  onCurrentSongChange?: (songId: string) => void;
}

export default function LazyPlaylist({
  initialPlaylist,
  currentSongId,
}: LazyPlaylistProps) {
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [activeSongId, setActiveSongId] = useState(currentSongId);

  // Update active song ID when it changes from parent
  useEffect(() => {
    setActiveSongId(currentSongId);
  }, [currentSongId]);

  // Sử dụng custom hook cho lazy loading
  const loadMoreSongs = useCallback(async (skip: number, take: number) => {
    const response = await fetch(
      `/api/songs/playlist?skip=${skip}&take=${take}`
    );
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to load songs");
    }

    return {
      data: result.songs || [],
      hasMore: result.hasMore || false,
    };
  }, []);

  const {
    data: playlist,
    loading,
    hasMore,
    loadMore,
  } = useLazyLoading({
    initialData: initialPlaylist.slice(0, 10), // Chỉ hiển thị 10 bài đầu tiên
    loadMoreFn: loadMoreSongs,
    take: 5,
  });

  // Merge initial playlist with dynamically loaded songs, maintaining order
  const displayPlaylist = useMemo(() => {
    // Start with initial playlist (first 10)
    const basePlaylist = initialPlaylist.slice(0, 10);

    // Add any additional loaded songs that aren't in initial playlist
    const additionalSongs = playlist.filter(
      (song) =>
        !initialPlaylist.some((initial) => initial.songId === song.songId)
    );

    return [...basePlaylist, ...additionalSongs];
  }, [initialPlaylist, playlist]);

  const formatLikes = useCallback((count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  }, []);

  const handleImageError = useCallback((songId: string) => {
    setFailedImages((prev) => new Set(prev).add(songId));
  }, []);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

      // Load more when user scrolls to 90% of the content
      if (scrollHeight - scrollTop <= clientHeight * 1.1) {
        loadMore();
      }
    },
    [loadMore]
  );

  return (
    <div className="rounded-lg text-black h-full flex flex-col ">
      <div className="flex items-center justify-between p-4 pb-2 flex-shrink-0">
        <h2 className="text-lg font-bold dark:text-white">My Favorites</h2>
        <a
          href="#"
          className="text-xs font-medium text-[#332D56] hover:underline dark:text-white"
        >
          See All
        </a>
      </div>
      <div
        className="flex-1 space-y-1 p-2 overflow-y-auto no-scrollbar"
        onScroll={handleScroll}
        style={{
          minHeight: "200px",
          maxHeight: "calc(100% - 60px)", // Trừ đi height của header
          overscrollBehavior: "contain",
        }}
      >
        {displayPlaylist.map((song) => (
          <Link key={song.songId} href={`/songs/${song.slug}`}>
            <div
              className={`flex items-center rounded-md p-2 hover:bg-gray-500/50 ${
                song.songId === activeSongId ? "bg-gray-500/50" : ""
              }`}
            >
              <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded">
                <OptimizedImage
                  src={song.imageFile?.url || ""}
                  alt={song.title}
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                  onError={() => handleImageError(song.songId)}
                  loading="lazy"
                  quality={85}
                />
              </div>
              <div className="ml-3 flex-1 overflow-hidden">
                <h3 className="text-sm font-medium dark:text-white truncate">
                  {song.title}
                </h3>
                <p className="text-xs text-[#3A0519] dark:text-white truncate">
                  {song.artist}
                </p>
              </div>
              <div className="flex items-center gap-1 text-gray-400 w-12 justify-end flex-shrink-0">
                <FaHeart className="text-red-600 w-3 h-3 mr-1" />
                <span className="text-xs text-black dark:text-white text-right">
                  {formatLikes(song.hearted.length)}
                </span>
              </div>
            </div>
          </Link>
        ))}

        {loading && (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          </div>
        )}

        {!hasMore && displayPlaylist.length > 0 && (
          <div className="text-center text-gray-500 text-xs p-2">
            No more songs to load
          </div>
        )}
      </div>
    </div>
  );
}
