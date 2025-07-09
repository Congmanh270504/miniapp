"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Route error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-red-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <AlertCircle className="w-24 h-24 text-yellow-500 mx-auto animate-bounce" />
        </div>

        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Oops! Something went wrong
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
          We encountered an error while loading this page. Please try again.
        </p>

        <div className="space-y-4">
          <Button
            onClick={reset}
            className="w-full bg-yellow-600 hover:bg-yellow-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>

          <Button asChild variant="outline" className="w-full">
            <a href="/" className="flex items-center justify-center gap-2">
              <Home className="w-4 h-4" />
              Go Home
            </a>
          </Button>
        </div>

        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 p-4 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-yellow-800 dark:text-yellow-400 text-sm font-mono">
              {error.message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
