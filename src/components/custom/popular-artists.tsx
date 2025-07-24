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
import { Play, User } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import SplitText from "../ui/react-bits/text-animations/SplitText/SplitText";
import Image from "next/image";

interface Artist {
  clerkId: string;
  name: string;
  imageUrl: string;
}
interface PopularArtistsProps {
  userCreateSongInfor: Artist[];
}

export const PopularArtists: React.FC<PopularArtistsProps> = ({
  userCreateSongInfor,
}) => {
  const [hoveredArtist, setHoveredArtist] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleImageError = (artistId: string) => {
    setImageErrors((prev) => new Set(prev).add(artistId));
  };

  if (!userCreateSongInfor) {
    return (
      <div className="mb-12 rounded text-center py-8">
        <div className="text-gray-400">
          <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No popular artists available</p>
          <p className="text-sm mt-2">Check back later for new artists!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12 rounded">
      <div className="relative flex items-center justify-center mb-6">
        <div className="inline-block mb-2">
          <div className="relative px-3 py-1 text-sm font-medium rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-4">
            <span className="relative z-10">
              <SplitText
                text="Popular user upload"
                className="text-6xl italic text-center text-[#670D2F] px-3"
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
            {userCreateSongInfor.map((artist, index) => (
              <CarouselItem
                key={index}
                className="pl-4 basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
              >
                <Link href={`/artists/${artist.clerkId}`}>
                  <Card
                    className="h-full shadow-lg transition-colors cursor-pointer group"
                    onMouseEnter={() => setHoveredArtist(artist.clerkId)}
                    onMouseLeave={() => setHoveredArtist(null)}
                  >
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="relative mb-3">
                          {imageErrors.has(artist.clerkId) ? (
                            // Fallback cho khi image không load được
                            <div className="w-full aspect-square bg-gray-700 rounded-full flex items-center justify-center mx-auto">
                              <User className="h-8 w-8 text-gray-400" />
                            </div>
                          ) : (
                            <Image
                              src={artist.imageUrl || "/twice.png"}
                              alt={artist.name}
                              width={200}
                              height={200}
                              quality={100}
                              className="w-full aspect-square mx-auto object-cover rounded-full"
                              onError={() => handleImageError(artist.clerkId)}
                              priority={index < 4} // Priority loading cho 4 ảnh đầu
                            />
                          )}
                          {/* Hover overlay with play button */}
                          {hoveredArtist === artist.clerkId && (
                            <div className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
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
                          <h3 className="font-medium text-sm mb-1 line-clamp-1">
                            {artist.name}
                          </h3>
                          {/* <p className="text-gray-400 text-xs">{artist.type}</p> */}
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
