"use client";

import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import { useRouter, useSearchParams } from "next/navigation";

interface GenresDataTablePaginationProps<TData> {
  table: Table<TData>;
  currentPage?: number;
  totalPages?: number;
  hasMore?: boolean;
}

export function GenresDataTablePagination<TData>({
  table,
}: GenresDataTablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-between space-x-2 py-4">
      <div className="text-muted-foreground flex-1 text-sm">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>

      <div className="flex items-center space-x-2">
        {/* Page Info */}
        <span className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>

        {/* Navigation Buttons */}
        <div className="space-x-2 flex">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
