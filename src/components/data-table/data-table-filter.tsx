"use client";

import * as React from "react";
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

interface DataTableFilterProps<TData> {
  table: Table<TData>;
}

export function DataTableFilter<TData>({ table }: DataTableFilterProps<TData>) {
  const filterOptions = [
    { value: "title", label: "Title" },
    { value: "artist", label: "Artist" },
    { value: "genre", label: "Genre" },
  ];

  const [selectedFilter, setSelectedFilter] = React.useState("title");

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
          <SelectTrigger className="w-[120px]">
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

      {/* Columns Visibility Dropdown */}
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
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
