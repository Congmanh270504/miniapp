import React from "react";
import { transformSongDataWithUrls } from "@/lib/song-utils";
import { getUserByIdList } from "@/lib/actions/user";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getCachedSongsWithImages,
  getCachedUserMostUpload,
} from "@/lib/cache/songs-cache";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const Page = async () => {
  //   Sử dụng cached function để lấy cả songs và images
  const { songs: data, imageUrls } = await getCachedSongsWithImages(
    1,
    20,
    3600
  ); // 1 giờ cache cho images
  const filter = ["aaaa", "bbbb", "ddddddd"];
  // Transform song data với URLs đã được cache
  const songData = transformSongDataWithUrls(data, imageUrls);

  return (
    <div className="w-full mx-auto px-8">
      <div className="flex justify-self-end align-center mt-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {filter.map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column}
                  className="capitalize"
                  // checked={column.getIsVisible()}
                  // onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column}
                </DropdownMenuCheckboxItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <HoverEffect songData={songData} />
      <div className="flex justify-self-end items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          // onClick={() => table.previousPage()}
          // disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <div className="text-muted-foreground flex-1 text-sm">1</div>
        <Button
          variant="outline"
          size="sm"
          // onClick={() => table.nextPage()}
          // disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Page;
