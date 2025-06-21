"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { RowPageProps } from "@/types/rowPage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import { categoryType, productType } from "@/types/itemTypes";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa6";

interface RowPageFilterProps {
  data: productType[] | categoryType[];
  numberItems: Array<number>;
  setItem: React.Dispatch<React.SetStateAction<productType[] | categoryType[]>>;
}

const RowPageFilter = ({ data, numberItems, setItem }: RowPageFilterProps) => {
  const [setting, setSetting] = useState<RowPageProps>({
    numberItems: numberItems[0],
    page: 1,
  });

  const handleChangeNumberItems = (value: string) => {
    setSetting({ ...setting, numberItems: Number(value) });
    setItem(data.slice(0, Number(value)));
  };

  const handleChangePage = (value: number, type: string) => {
    if (type === "next") {
      setSetting({ ...setting, page: value + 1 });
      setItem(
        data.slice(
          value * setting.numberItems,
          (value + 1) * setting.numberItems
        )
      );
    } else {
      setSetting({ ...setting, page: value - 1 });
      setItem(
        data.slice(
          (value - 2) * setting.numberItems,
          (value - 1) * setting.numberItems
        )
      );
    }
  };

  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      <div className="flex items-center">
        <span className="text-sm text-gray-700">Rows per page:</span>
        <div className="ml-2 relative">
          <Select onValueChange={handleChangeNumberItems}>
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder={numberItems[0]} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {numberItems.map((row, id) => (
                  <SelectItem value={row.toString()} key={id}>
                    {row}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Link href={`/admin/categories/create`}>
          <Button className="ml-2" variant="destructive">
            Create Category
            <FaPlus className="ml-2" size={16} />
          </Button>
        </Link>
      </div>

      <div className="flex items-center">
        <nav
          className="relative z-0 inline-flex rounded-md"
          aria-label="Pagination"
        >
          <button
            className="relative shadow-xs inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 cursor-pointer hover:bg-gray-50"
            disabled={setting.page - 1 <= 0 ? true : false}
            style={setting.page - 1 <= 0 ? { backgroundColor: "#DBDBDB" } : {}}
            onClick={() => handleChangePage(setting.page, "prev")}
          >
            <span className="sr-only">Previous</span>
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <span className="text-sm text-gray-700 content-center mx-4">
            Page {setting.page}
          </span>
          <button
            className="relative shadow-xs inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 cursor-pointer hover:bg-gray-50"
            onClick={() => handleChangePage(setting.page, "next")}
            disabled={
              setting.page * setting.numberItems >= data.length ? true : false
            }
            style={
              setting.page * setting.numberItems >= data.length
                ? { backgroundColor: "#DBDBDB" }
                : {}
            }
          >
            <span className="sr-only">Next</span>
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </nav>
      </div>
    </div>
  );
};

export default RowPageFilter;
