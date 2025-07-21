"use client";

import { useState, useCallback } from "react";
import { Heart } from "lucide-react";
import Link from "next/link";
import { ProcessedSongsData } from "../../../types/song-types";
import { useLazyLoading } from "@/hooks/useLazyLoading";
import OptimizedImage from "@/components/ui/optimized-image";

interface LazyPlaylistProps {
  initialPlaylist: ProcessedSongsData;
  currentSongId: string;
}

export default function LazyPlaylist({
  initialPlaylist,
  currentSongId,
}: LazyPlaylistProps) {
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  // Sử dụng custom hook cho lazy loading
  const loadMoreSongs = useCallback(
    async (skip: number, take: number) => {
      const response = await fetch(
        `/api/songs/playlist?excludeId=${currentSongId}&skip=${skip}&take=${take}`
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to load songs");
      }

      return {
        data: result.songs || [],
        hasMore: result.hasMore || false,
      };
    },
    [currentSongId]
  );

  const {
    data: playlist,
    loading,
    hasMore,
    loadMore,
  } = useLazyLoading({
    initialData: initialPlaylist,
    loadMoreFn: loadMoreSongs,
    take: 5,
  });

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
        <h2 className="text-lg font-bold">My Favorites</h2>
        <a
          href="#"
          className="text-xs font-medium text-[#332D56] hover:underline"
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
        {playlist.map((song) => (
          <Link key={song.songId} href={`/songs/${song.slug}`}>
            <div className="flex items-center rounded-md p-2 hover:bg-gray-500/50">
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
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium">{song.title}</h3>
                <p className="text-xs text-[#3A0519]">{song.artist}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center text-gray-400">
                  <Heart className="h-4 w-4 mr-1" />
                  <span className="text-xs text-black">
                    {formatLikes(song.hearted.length)}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}

        {loading && (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          </div>
        )}

        {!hasMore && playlist.length > 0 && (
          <div className="text-center text-gray-500 text-xs p-2">
            No more songs to load
          </div>
        )}
      </div>
    </div>
  );
}
