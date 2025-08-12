"use client";

import React, { use, useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenuCheckboxes } from "./filter";
import { SongWithPinataImage } from "../../../../types/song-types";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import SplitText from "@/components/ui/react-bits/text-animations/SplitText/SplitText";

interface MainPageProps {
  initialSongData: SongWithPinataImage[];
  hasMore: boolean;
  title?: string; // Optional prop for additional text
}

export default function MainPage({
  initialSongData,
  hasMore,
  title,
}: MainPageProps) {
  const [filteredData, setFilteredData] =
    useState<SongWithPinataImage[]>(initialSongData);
  const [isPending, setIsPending] = useState(false);
  const [isOutOfSongs, setIsOutOfSongs] = useState(hasMore);

  const handleFilterChange = (newFilteredData: SongWithPinataImage[]) => {
    setFilteredData(newFilteredData);
  };

  const handleLoadMore = useCallback(async () => {
    setIsPending(true);
    try {
      const request = await fetch(
        `/api/songs/load-more?skip=${filteredData.length}&take=5`
      );
      const data = await request.json();
      if (!request.ok) {
        throw new Error(data.error || "Failed to load more songs");
      }

      if (!data.hasMore) {
        setIsOutOfSongs(false);
      }

      setFilteredData((prev) => [...prev, ...data.songs]);
    } catch {
      console.error("Failed to load more songs");
      // Optionally handle error state here
    } finally {
      setIsPending(false);
    }
  }, [filteredData]);

  return (
    <div className="w-full mx-auto px-8 mb-4 py-2">
      <div className="flex justify-between items-center my-5 ">
        {/* Left side - empty for balance */}
        <div className="w-48"></div>

        {/* Center - Title */}
        <div className="flex-1 flex justify-center">
          <div className="inline-block">
            <div className="relative px-3 py-1 text-sm font-medium rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <span className="relative z-10">
                <SplitText
                  text={title ? title : "All songs"}
                  className="text-6xl italic text-center text-[#670D2F] px-3 dark:text-gray-300"
                  delay={100}
                  duration={0.6}
                  ease="power3.out"
                  splitType="chars"
                  from={{ opacity: 0, y: 40 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  rootMargin="-100px"
                  textAlign="center"
                />
              </span>
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 animate-pulse shadow-lg hover:shadow-xl"></span>
            </div>
          </div>
        </div>

        {/* Right side - Filter */}
        <div className="w-48 flex justify-end">
          <DropdownMenuCheckboxes
            onFilterChange={handleFilterChange}
            originalData={filteredData}
          />
        </div>
      </div>
      <HoverEffect songData={filteredData} />
      <div className="flex justify-center mb-4">
        {isPending ? (
          <span className="loading loading-spinner loading-xl"></span>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className={isOutOfSongs ? " cursor-pointer" : "hidden"}
            onClick={handleLoadMore}
          >
            Load more
          </Button>
        )}
      </div>
    </div>
  );
}
