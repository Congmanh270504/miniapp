"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Heart, MoreVertical, Play } from "lucide-react";
import { ProcessedSongsData } from "../../../types/song-types";
import Link from "next/link";

export default function PlayList({
  playList,
}: {
  playList: ProcessedSongsData;
}) {
  const formatLikes = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <div className="rounded-lg text-black ">
      <div className="flex items-center justify-between p-4 pb-2">
        <h2 className="text-lg font-bold">My Favorites</h2>
        <a
          href="#"
          className="text-xs font-medium text-[#332D56] hover:underline"
        >
          See All
        </a>
      </div>
      <div className="space-y-1 p-2">
        {playList.map((song) => (
          <Link key={song.songId} href={`/songs/${song.slug}`}>
            <div className="flex items-center rounded-md p-2 hover:bg-gray-500/50">
              <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded">
                <Image
                  src={song.imageFile?.url || "/placeholder.svg"}
                  alt={song.title}
                  fill
                  className="object-cover"
                />
              </div>
              {/* <button className="absolute left-5 top-1/2 -translate-y-1/2 transform rounded-full bg-black/50 p-1 opacity-0 transition-opacity group-hover:opacity-100">
              <Play className="h-3 w-3" />
            </button> */}
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
              {/* <button className="flex-shrink-0 rounded-full p-1 ">
              <MoreVertical className="h-5 w-5 text-gray-400 hover:text-black" />
            </button> */}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
