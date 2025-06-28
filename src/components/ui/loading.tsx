import React from "react";
import { Skeleton } from "./skeleton";

const Loading = () => {
  return (
    <div>
      <div className="space-y-4">
        <Skeleton className="h-[550px] bg-gray-200 rounded-md" />
      </div>
    </div>
  );
};

export default Loading;
