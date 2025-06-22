import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Page() {
  const trendingSongs = [
    {
      id: 1,
      title: "Năm Bên Anh",
      artist: "Minh Định, Hà An Huy",
      image: "/placeholder.svg?height=200&width=200",
      explicit: false,
    },
    {
      id: 2,
      title: "TŨNG",
      artist: "EM XINH 'SAY HI', Lyly, Lâm Bảo Ngọc, Liu Grace",
      image: "/placeholder.svg?height=200&width=200",
      explicit: false,
    },
    {
      id: 3,
      title: "Billyeoon Goyangi (Do the Dance)",
      artist: "ILLIT",
      image: "/placeholder.svg?height=200&width=200",
      explicit: false,
    },
    {
      id: 4,
      title: "Gabriela",
      artist: "KATSEYE",
      image: "/placeholder.svg?height=200&width=200",
      explicit: false,
    },
    {
      id: 5,
      title: "Killin' It Girl (feat. GloRilla)",
      artist: "j-hope, GloRilla",
      image: "/placeholder.svg?height=200&width=200",
      explicit: true,
    },
    {
      id: 6,
      title: "Mr Electric Blue",
      artist: "Benson Boone",
      image: "/placeholder.svg?height=200&width=200",
      explicit: false,
    },
    {
      id: 7,
      title: "Lý Do",
      artist: "Ngô Kiến Huy, AEP SIMON",
      image: "/placeholder.svg?height=200&width=200",
      explicit: false,
    },
    {
      id: 8,
      title: "Thi Quan Ronbon",
      artist: "JUN ND",
      image: "/placeholder.svg?height=200&width=200",
      explicit: false,
    },
  ];
  return (
    <div className="w-full flex flex-col items-center justify-center gap-4 p-4 ">
      <Carousel
        opts={{
          align: "center",
        }}
        className="w-full"
      >
        <CarouselContent>
          {trendingSongs.map((song, index) => (
            <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/5">
              <div className="w-fit">
                <Card className="w-[180px]">
                  <CardContent className="flex flex-col aspect-square items-center justify-center p-6">
                    <div className="relative mb-3">
                      <img
                        src={song.image || "/placeholder.svg"}
                        alt={song.title}
                        className="w-full aspect-square object-cover rounded-md"
                      />
                      {/* Hover overlay with play and next buttons */}
                      {/* {hoveredSong === song.id && (
                        <div className="absolute inset-0 bg-black/60 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              className="h-8 w-8 rounded-full bg-white text-black hover:bg-gray-200"
                            >
                              <Play className="h-4 w-4 fill-current" />
                            </Button>
                          </div>
                        </div>
                      )} */}
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-sm leading-tight line-clamp-2">
                        {song.title}
                      </h3>
                      <div className="flex items-center gap-1">
                        {song.explicit && (
                          <span className="bg-gray-600 text-xs px-1 rounded text-gray-300">
                            E
                          </span>
                        )}
                        <p className="text-gray-400 text-xs line-clamp-2">
                          {song.artist}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
