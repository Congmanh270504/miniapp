"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { convertToVNDay } from "@/lib/hepper";
import { Songs, Genres, Prisma } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import {
  Search,
  Heart,
  MessageCircle,
  Repeat2,
  Play,
  MoreHorizontal,
  ArrowUpDown,
  Pause,
} from "lucide-react";
import Image from "next/image";
import { AudioDuration } from "@/components/custom/audio-duration";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { setPlaySong, togglePlaySong } from "@/store/playSong/state";
import { TrackCell } from "./track-cell";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
type SongWithUrls = {
  songId: string;
  title: string;
  artist: string;
  musicFile: {
    cid: string;
    url: string;
  };
  imageFile: {
    cid: string;
    url: string;
  };
  genre: string;
  createdAt: Date;
};

export const columns: ColumnDef<SongWithUrls>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },  {
    accessorKey: "title",
    header: "TRACKS",
    cell: ({ row }) => {
      const track = row.original;
      return <TrackCell track={track} />;
    },
  },
  {
    accessorKey: "artist",
    header: "Artist",
    cell: ({ row }) => {
      const track = row.original;
      return <span className="text-sm text-gray-500">{track.artist}</span>;
    },
  },
  {
    accessorKey: "genre",
    header: "Genre",
    cell: ({ row }) => {
      const track = row.original;
      return <span className="text-sm text-gray-500">{track.genre}</span>;
    },
  },

  {
    accessorKey: "musicFile",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="w-full justify-center"
      >
        Duration
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const track = row.original;
      return (
        <div className="text-center">
          <AudioDuration url={track.musicFile.url} cid={track.musicFile.cid} />
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: () => <div>Created At</div>,
    cell: ({ row }) => {
      //   const createdAt = row.getValue("createdAt");
      return (
        <span>
          {row.getValue("createdAt")
            ? convertToVNDay(row.getValue("createdAt") as Date)
            : "N/A"}
        </span>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const song = row.original;
      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(song.songId)}
              >
                Copy song ID
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(song.musicFile.url)
                }
              >
                Copy music URL
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuItem>Edit song</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
