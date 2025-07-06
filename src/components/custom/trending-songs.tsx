"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useState } from "react";
import { ProcessedSongsData } from "../../../types/song-types";
import Link from "next/link";
import SplitText from "../ui/react-bits/text-animations/SplitText/SplitText";

interface TrendingSongsProps {
  songData: ProcessedSongsData;
}

export const TrendingSongs: React.FC<TrendingSongsProps> = ({ songData }) => {
  const [hoveredSong, setHoveredSong] = useState<string | null>(null);

  return (
    <div className="mb-12">
      <div className="relative flex items-center justify-center mb-6">
        <h1 className="text-2xl font-bold text-foreground dark:text-white">
          <SplitText
            text="Trending songs"
            className="text-6xl font-semibold text-center text-black"
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
        </h1>
        <Button
          variant="ghost"
          className="absolute right-0 text-gray-400 text-sm hover:text-gray-700"
        >
          Show all
        </Button>
      </div>

      <div className="relative px-16">
        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {songData.map((song, index) => (
              <CarouselItem
                key={index}
                className="pl-4 basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
              >
                <Link href={`/songs/${song.slug}`}>
                  <Card
                    className="h-full shadow-lg transition-colors cursor-pointer group"
                    onMouseEnter={() => setHoveredSong(song.songId)}
                    onMouseLeave={() => setHoveredSong(null)}
                  >
                    <CardContent className="p-4">
                      <div className="relative mb-3">
                        <img
                          src={song.imageFile.url}
                          alt={song.title}
                          className="w-full aspect-square object-cover rounded-md"
                        />
                        {/* Hover overlay with play button */}
                        {hoveredSong === song.songId && (
                          <div className="absolute inset-0 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                className="h-8 w-8 rounded-full bg-white text-black hover:bg-gray-200"
                              >
                                <Play className="h-4 w-4 fill-current" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-medium text-sm leading-tight line-clamp-2">
                          {song.title}
                        </h3>
                        <div className="flex items-center gap-1">
                          <p className="text-gray-400 text-xs line-clamp-2">
                            {song.artist}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-2 h-10 w-10 bg-gray-800 border-gray-700 text-white" />
          <CarouselNext className="absolute right-2 h-10 w-10 bg-gray-800 border-gray-700 text-white" />
        </Carousel>
      </div>
    </div>
  );
};
