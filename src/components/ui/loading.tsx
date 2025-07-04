import React from "react";
import { Skeleton } from "./skeleton";

const Loading = () => {
  return (
    <div className="flex flex-col space-y-3 ">
      <Skeleton className="h-full w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
};

export default Loading;
