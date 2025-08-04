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
import { SongWithUrls } from "../../../../types/collection-types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { formatDuration } from "@/lib/audio-utils";
import DeleteSongDialog from "@/app/songs/delete-song-dialog";
import { useState } from "react";
import { deletedSong } from "@/lib/actions/songs";
import { toast } from "sonner";
import { TrackCell } from "@/app/you/tracks/track-cell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Component wrapper for actions cell
function ActionsCell({ song }: { song: SongWithUrls }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleDeleteSong = async () => {
    try {
      setIsPending(true);
      const response = await deletedSong(song);
      if (response.ok) {
        // Handle successful deletion, e.g., show a success message or refresh the list
        toast.success(`Song "${song.title}" deleted successfully!`);
      } else {
        // Handle error response
        toast.error(`Failed to delete song: ${response.message}`);
      }
    } catch (error) {
      console.error("Error deleting song:", error);
    } finally {
      setIsPending(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            Actions
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href={`/songs/${song.slug}`}>View details</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={`/songs/edit/${song.slug}`}>Edit song</Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-600 focus:text-red-600"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            Delete song
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteSongDialog
        isPending={isPending}
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteSong}
        songTitle={song.title}
      />
    </>
  );
}
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
      return songData.comments;
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
                <span className="flex items-center gap-2 dark:text-white">
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
      const createdAt = row.getValue("createdAt");

      return (
        <div className="text-center">
          <span>
            {createdAt ? convertToVNDay(createdAt as Date | string) : "N/A"}
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
          <ActionsCell song={song} />
        </div>
      );
    },
    size: 80,
  },
];
