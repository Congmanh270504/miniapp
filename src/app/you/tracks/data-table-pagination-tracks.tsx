"use client";

import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import { useRouter, useSearchParams } from "next/navigation";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  currentPage?: number;
  totalPages?: number;
  hasMore?: boolean;
}

export function DataTablePaginationTracks<TData>({
  table,
  currentPage = 1,
  totalPages = 1,
  hasMore = false,
}: DataTablePaginationProps<TData>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/you/tracks?${params.toString()}`);
  };

  const canGoPrevious = currentPage > 1;
  const canGoNext = hasMore && currentPage < totalPages;

  return (
    <div className="flex items-center justify-between space-x-2 py-4">
      <div className="text-muted-foreground flex-1 text-sm">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>

      <div className="flex items-center space-x-2">
        {/* Page Info */}
        <span className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </span>

        {/* Navigation Buttons */}
        <div className="space-x-2 flex">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={!canGoPrevious}
          >
            Previous
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={!canGoNext}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
