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
  ListEnd,
} from "lucide-react";
import { FaHeart } from "react-icons/fa";
import { TrackCell } from "./track-cell";
import { SongWithUrls } from "../../../../types/collection-types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { formatDuration } from "@/lib/audio-utils";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
const engagements = [
  {
    id: 1,
    name: "Hearted",
    icon: <FaHeart className="text-red-500" />,
  },
  {
    id: 2,
    name: "Commented",
    icon: <MessageCircle size={16} />,
  },
  {
    id: 3,
    name: "In playlist",
    icon: <ListEnd size={16} />,
  },
];

const handleEngagements = (songData: SongWithUrls, id: number) => {
  switch (id) {
    case 1:
      return songData.hearted;
    case 2:
      return 0;
    case 3:
      return 0;
    default:
      return null;
  }
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
  },
  {
    accessorKey: "title",
    header: () => <div className="text-left">Tracks</div>,
    cell: ({ row }) => {
      const track = row.original;
      return <TrackCell track={track} />;
    },
    size: 200,
  },
  {
    accessorKey: "artist",
    header: () => <div className="text-left">Artist</div>,
    cell: ({ row }) => {
      const track = row.original;
      return (
        <span className="text-sm text-gray-500 mr-8 dark:text-white">
          {track.artist}
        </span>
      );
    },
    size: 120,
  },
  {
    accessorKey: "genre",
    header: () => <div className="text-left ml-4">Genre</div>,
    cell: ({ row }) => {
      const track = row.original;
      return (
        <span className="text-sm text-gray-500 ml-4 dark:text-white">
          {track.genre}
        </span>
      );
    },
    size: 100,
  },
  {
    accessorKey: "duration",
    header: ({ column }) => (
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full justify-center"
        >
          Duration
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const track = row.original;
      return (
        <div className="text-center">{formatDuration(track.duration)}</div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const a = rowA.original.duration;
      const b = rowB.original.duration;
      return a - b;
    },
    size: 100,
  },
  {
    id: "engagements",
    header: () => <div className="text-center">Engagements</div>,
    cell: ({ row }) => {
      return (
        <div className="text-sm text-gray-500 flex items-center justify-center gap-4">
          {engagements.map((engagement) => (
            <Tooltip key={engagement.name}>
              <TooltipTrigger asChild>
                <span className="flex items-center gap-2">
                  {engagement.icon}{" "}
                  {handleEngagements(row.original, engagement.id)}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">{engagement.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      );
    },
    size: 180,
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="text-center">Created At</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center">
          <span>
            {row.getValue("createdAt")
              ? convertToVNDay(row.getValue("createdAt") as Date)
              : "N/A"}
          </span>
        </div>
      );
    },
    size: 120,
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    enableHiding: false,
    cell: ({ row }) => {
      const song = row.original;
      return (
        <div className="text-center">
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
              <DropdownMenuItem>
                <Link href={`/songs/${song.slug}`}>View details</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Edit song</DropdownMenuItem>
              <DropdownMenuItem>Delete song</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    size: 80,
  },
];
