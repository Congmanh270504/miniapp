import React from "react";
import { Skeleton } from "./skeleton";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-full w-full p-5">
      <div className="w-full max-w-7xl space-y-6">
        {/* Header skeleton */}
        <div className="h-12 bg-gray-300 rounded-lg animate-pulse"></div>

        {/* Main content skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left side - Image skeleton */}
          <div className="space-y-4">
            <div className="h-80 bg-gray-300 rounded-lg animate-pulse"></div>
            <div className="h-6 bg-gray-300 rounded animate-pulse w-3/4"></div>
          </div>

          {/* Right side - Form skeleton */}
          <div className="space-y-4">
            <div className="h-8 bg-gray-300 rounded animate-pulse w-1/2"></div>

            {/* Form fields skeleton */}
            <div className="space-y-3">
              <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-300 rounded animate-pulse"></div>

              {/* Two fields in one row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
              </div>

              <div className="h-24 bg-gray-300 rounded animate-pulse"></div>

              {/* Buttons skeleton */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-10 bg-gray-400 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional content skeleton */}
        <div className="space-y-3">
          <div className="h-4 bg-gray-300 rounded animate-pulse w-full"></div>
          <div className="h-4 bg-gray-300 rounded animate-pulse w-5/6"></div>
          <div className="h-4 bg-gray-300 rounded animate-pulse w-4/5"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
