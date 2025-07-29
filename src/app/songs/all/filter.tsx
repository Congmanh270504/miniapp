"use client";

import * as React from "react";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter } from "lucide-react";
import { SongWithPinataImage } from "../../../../types/song-types";

type Checked = DropdownMenuCheckboxItemProps["checked"];

export interface FilterOptions {
  mostLiked: boolean;
  mostCommented: boolean;
  recentlyAdded: boolean;
  alphabetical: boolean;
}

interface DropdownMenuCheckboxesProps {
  onFilterChange: (filteredData: SongWithPinataImage[]) => void;
  originalData: SongWithPinataImage[];
}

export function DropdownMenuCheckboxes({
  onFilterChange,
  originalData,
}: DropdownMenuCheckboxesProps) {
  const [filters, setFilters] = React.useState<FilterOptions>({
    mostLiked: false,
    mostCommented: false,
    recentlyAdded: false,
    alphabetical: false,
  });

  // Function to apply filters
  const applyFilters = React.useCallback(
    (newFilters: FilterOptions) => {
      let filteredData = [...originalData];

      // If no filters are selected, return original data
      if (!Object.values(newFilters).some(Boolean)) {
        onFilterChange(filteredData);
        return;
      }

      // Apply filters
      if (newFilters.mostLiked) {
        filteredData = filteredData.sort(
          (a, b) => b.hearted.length - a.hearted.length
        );
      }

      if (newFilters.mostCommented) {
        filteredData = filteredData.sort(
          (a, b) => b.comments.length - a.comments.length
        );
      }

      if (newFilters.recentlyAdded) {
        filteredData = filteredData.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }

      if (newFilters.alphabetical) {
        filteredData = filteredData.sort((a, b) =>
          a.title.localeCompare(b.title)
        );
      }

      onFilterChange(filteredData);
    },
    [originalData, onFilterChange]
  );

  // Update filters and apply them
  const updateFilter = (key: keyof FilterOptions, value: Checked) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  return (
    <div className="flex justify-end items-center mt-4 ">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter Songs
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Sort & Filter</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={filters.mostLiked}
            onCheckedChange={(checked) => updateFilter("mostLiked", checked)}
          >
            Most Liked
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filters.mostCommented}
            onCheckedChange={(checked) =>
              updateFilter("mostCommented", checked)
            }
          >
            Most Commented
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filters.recentlyAdded}
            onCheckedChange={(checked) =>
              updateFilter("recentlyAdded", checked)
            }
          >
            Recently Added
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filters.alphabetical}
            onCheckedChange={(checked) => updateFilter("alphabetical", checked)}
          >
            Alphabetical (A-Z)
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
