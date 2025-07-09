"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-8">
              <div className="relative">
                <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-700 select-none">
                  500
                </h1>
                <div className="absolute inset-0 flex items-center justify-center">
                  <AlertTriangle className="w-24 h-24 text-red-500 animate-pulse" />
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Something went wrong!
            </h2>

            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
              An unexpected error occurred. Please try again or contact support
              if the problem persists.
            </p>

            <div className="space-y-4">
              <Button
                onClick={reset}
                className="w-full bg-red-600 hover:bg-red-700"
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
              <div className="mt-8 p-4 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <p className="text-red-800 dark:text-red-400 text-sm font-mono">
                  {error.message}
                </p>
              </div>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
