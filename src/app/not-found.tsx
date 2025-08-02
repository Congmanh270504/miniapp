"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, Music } from "lucide-react";
import FuzzyText from "@/components/ui/react-bits/FuzzyText/FuzzyText";
import { useTheme } from "next-themes";

export default function Custom404() {
  const { theme } = useTheme();
  return (
    <div className="min-h-screen bg-sidebar flex items-center justify-center px-4">
      <div className="w-full text-center justify-items-center">
        <div className="mb-8">
          <FuzzyText
            baseIntensity={0.5}
            hoverIntensity={0.6}
            enableHover={true}
            color={theme === "dark" ? "#fff" : "#000"}
          >
            404
          </FuzzyText>
        </div>

        <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          <FuzzyText
            baseIntensity={0.5}
            hoverIntensity={0.6}
            enableHover={true}
            color={theme === "dark" ? "#fff" : "#000"}
          >
            Not found
          </FuzzyText>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
          Oops! The page you're looking for doesn't exist. It might have been
          moved, deleted, or you entered the wrong URL.
        </p>

        <div className="space-y-4 flex justify-center gap-4">
          <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 dark:text-white"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full dark:border-white"
          >
            <Link
              href="/songs"
              className="flex items-center justify-center gap-2"
            >
              <Music className="w-4 h-4" />
              Browse Songs
            </Link>
          </Button>
        </div>

        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>
            Need help?{" "}
            <Link
              href="/contact"
              className="text-purple-600 hover:text-purple-700 underline"
            >
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
