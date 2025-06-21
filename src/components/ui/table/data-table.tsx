"use client";
import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  checkAll,
  clearDeleteChecked,
  setDeleteChecked,
} from "@/app/state/deleteChecked/deleteChecked";

import DataTablePagination from "./data-table-pagination";
import DataTableToolbar from "./data-table-toolbar";
import { useSelector } from "react-redux";
import { RootState } from "@/app/state/store";
import { useDispatch } from "react-redux";
import { Button } from "../button";
import { Trash2 } from "lucide-react";
import { categoryType } from "@/types/itemTypes";
import { Progress } from "@/components/ui/progress";
import { AppDispatch } from "@/app/state/store";
import { fetchInitialImages } from "@/app/state/images/images";
import DeleteDialogProduct from "@/app/admin/products/delete/delete-dialog-product";
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  type: string;
}
export function DataTable<TData, TValue>({
  columns,
  data,
  type,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [progress, setProgress] = React.useState(13);
  const [isPending, setIsPending] = React.useState(false);

  const handleProgress = () => {
    const timer1 = setTimeout(() => setProgress(66), 500);
    const timer2 = setTimeout(() => {
      setProgress(100);
    }, 1000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  };

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // console.log("deleteChecked", deleteChecked);
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  const deleteChecked = useSelector((state: RootState) => state.deleteChecked);
  const dispatch = useDispatch<AppDispatch>();
  React.useEffect(() => {
    dispatch(fetchInitialImages()); // Dispatch the thunk to fetch images once
  }, [dispatch]);
  const totalColum = table.getAllColumns().length - 3;

  return (
    <div className="w-full">
      <DataTableToolbar table={table} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {deleteChecked.length > 0 ? (
              <TableRow>
                <TableHead>
                  <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(value) => {
                      if (table.getIsAllPageRowsSelected() === false) {
                        table.toggleAllPageRowsSelected(true);
                        dispatch(
                          clearDeleteChecked() // Corrected payload
                        );
                        table.getRowModel().rows.forEach((row) => {
                          let rowOriginal = row.original as categoryType;
                          dispatch(
                            setDeleteChecked({
                              id: rowOriginal.id,
                              checked: true,
                            }) // Corrected payload
                          );
                        });
                      } else {
                        table.toggleAllPageRowsSelected(!!value);
                        dispatch(
                          clearDeleteChecked() // Corrected payload
                        );
                      }
                    }}
                  />
                </TableHead>
                <TableHead>
                  {table.getFilteredSelectedRowModel().rows.length} of{" "}
                  {table.getRowCount()} row(s) selected.
                </TableHead>

                {Array.from({ length: totalColum }, (_, index) => (
                  <TableHead key={index} className="text-transparent">
                    aaa
                  </TableHead>
                ))}

                <TableHead className="text-right">
                  {type === "product" ? (
                    <DeleteDialogProduct
                      setIsPending={setIsPending}
                      handleProgress={handleProgress}
                      table={table}
                    />
                  ) : (
                    <Button variant={"destructive"} className="ml-auto my-1">
                      Delete All C <Trash2 className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </TableHead>
              </TableRow>
            ) : (
              table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="ml-auto my-1">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableHeader>
          <TableBody>
            {isPending ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center justify-items-center "
                >
                  Deleting all file {progress}%
                  <Progress value={progress} className="w-[60%] " />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
