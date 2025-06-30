import React from "react";
import { Skeleton } from "./skeleton";

const Loading = () => {
  return (
    <div className="w-full h-full">
      <div className="space-y-4">
        <Skeleton className="h-full bg-gray-200 rounded-md" />
      </div>
    </div>
  );
};

export default Loading;
