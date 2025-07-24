"use client";
import {
  ProcessedSongsData,
  SongWithPinataImage,
} from "../../../types/song-types";
import { TrendingSongs } from "@/components/custom/trending-songs";
import { PopularArtists } from "@/components/custom/popular-artists";

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
  userCreateSongInfor,
}: {
  songData: SongWithPinataImage[];
  userCreateSongInfor: {
    clerkId: string;
    name: string;
    imageUrl: string;
  }[];
}) {
  return (
    <div className="h-full text-white p-6">
      {/* Trending Songs Section */}
      <TrendingSongs songData={songData} />

      {/* Popular Artists Section */}
      <PopularArtists userCreateSongInfor={userCreateSongInfor} />
    </div>
  );
}
