"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown } from "lucide-react";
import { Table } from "@tanstack/react-table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-dropdown-menu";
import GenreForm from "./form";

interface GenresDataTableFilterProps<TData> {
  table: Table<TData>;
}

export function GenresDataTableFilter<TData>({
  table,
}: GenresDataTableFilterProps<TData>) {
  const router = useRouter();
  const filterOptions = [
    { value: "description", label: "Description" },
    { value: "songsCount", label: "Songs Count" },
  ];

  const [selectedFilter, setSelectedFilter] = React.useState("description");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);

  const handleFormSuccess = () => {
    setIsCreateDialogOpen(false);
    router.refresh();
  };

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center space-x-2">
        {/* Filter Input */}
        <Input
          placeholder={`Filter by ${selectedFilter}...`}
          value={
            (table.getColumn(selectedFilter)?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn(selectedFilter)?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        {/* Filter Selection */}
        <Select value={selectedFilter} onValueChange={setSelectedFilter}>
          <SelectTrigger className="w-fit">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Create genre</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Genre</DialogTitle>
              <DialogDescription>
                Add a new music genre to organize your songs better.
              </DialogDescription>
            </DialogHeader>
            <GenreForm onSuccess={handleFormSuccess} />
          </DialogContent>
        </Dialog>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
