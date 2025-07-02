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
import { Play, SkipForward } from "lucide-react";
import { useState } from "react";
import { ProcessedSongsData } from "../../../types/song-types";
import Link from "next/link";

// Sample data for popular artists
const popularArtists = [
  {
    id: 1,
    name: "Da LAB",
    type: "Artist",
    image: "/placeholder.svg?height=160&width=160",
  },
  {
    id: 2,
    name: "buitruonglinh",
    type: "Artist",
    image: "/placeholder.svg?height=160&width=160",
  },
  {
    id: 3,
    name: "Vũ.",
    type: "Artist",
    image: "/placeholder.svg?height=160&width=160",
  },
  {
    id: 4,
    name: "tlinh",
    type: "Artist",
    image: "/placeholder.svg?height=160&width=160",
  },
  {
    id: 5,
    name: "Vũ Cát Tường",
    type: "Artist",
    image: "/placeholder.svg?height=160&width=160",
  },
  {
    id: 6,
    name: "ANH TRAI 'SAY HI'",
    type: "Artist",
    image: "/placeholder.svg?height=160&width=160",
  },
  {
    id: 7,
    name: "Kai Đinh",
    type: "Artist",
    image: "/placeholder.svg?height=160&width=160",
  },
];

export default function MusicLayout({
  songData,
}: {
  songData: ProcessedSongsData;
}) {
  const [hoveredSong, setHoveredSong] = useState<string | null>(null);

  return (
    <div className="h-full text-white p-6">
      {/* Trending Songs Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground dark:text-white">
            Trending songs
          </h1>
          <Button variant="ghost" className="text-gray-400 hover:text-gray-700">
            Show all
          </Button>
        </div>

        <div className="relative px-16">
          {" "}
          {/* Add padding for buttons */}
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
                          {/* Hover overlay with play and next buttons */}
                          {hoveredSong === song.songId && (
                            <div className="absolute inset-0  rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
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
                            {/* {song.explicit && (
                            <span className="bg-gray-600 text-xs px-1 rounded text-gray-300">
                              E
                            </span>
                          )} */}
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
            <CarouselPrevious className="absolute left-2 h-10 w-10 bg-gray-800 border-gray-700 text-white " />
            <CarouselNext className="absolute right-2 h-10 w-10 bg-gray-800 border-gray-700 text-white " />
          </Carousel>
        </div>
      </div>
      {/* Popular Artists Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-black dark:text-white">
            Popular artists
          </h2>
          <Button variant="ghost" className="text-gray-400 hover:text-gray-700">
            Show all
          </Button>
        </div>

        <div className="relative px-16">
          {" "}
          {/* Same padding as songs */}
          <Carousel
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {popularArtists.map((artist, index) => (
                <CarouselItem
                  key={index}
                  className="pl-4 basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
                >
                  <Card className="shadow-lg transition-colors cursor-pointer">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="mb-3">
                          <img
                            src={"/twice.png"}
                            alt={artist.name}
                            className="w-full aspect-square mx-auto object-cover rounded-full"
                          />
                        </div>
                        <h3 className="font-medium text-sm mb-1 line-clamp-1">
                          {artist.name}
                        </h3>
                        <p className="text-gray-400 text-xs">{artist.type}</p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-2 h-10 w-10 bg-gray-800 border-gray-700 text-white hover:bg-gray-700" />
            <CarouselNext className="absolute right-2 h-10 w-10 bg-gray-800 border-gray-700 text-white hover:bg-gray-700" />
          </Carousel>
        </div>
      </div>
    </div>
  );
}
