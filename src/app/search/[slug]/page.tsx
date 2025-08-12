import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import SearchResults from "./search-results";
import SplitText from "@/components/ui/react-bits/text-animations/SplitText/SplitText";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { slug } = await params;

  // Decode URL slug
  const searchQuery = decodeURIComponent(slug);

  // Validate query
  if (!searchQuery || searchQuery.trim().length === 0) {
    notFound();
  }

  // Limit query length for security
  if (searchQuery.length > 100) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 justify-items-center text-center">
        <div className="inline-block mb-2">
          <div className="relative px-3 py-1 text-sm font-medium rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-4">
            <span className="relative z-10">
              <SplitText
                text="Search results"
                className="text-6xl italic text-center text-[#670D2F] px-3 dark:text-gray-300"
                delay={100}
                duration={0.6}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="center"
              />
            </span>
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 animate-pulse shadow-lg hover:shadow-xl"></span>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Showing results for "{searchQuery}"
        </p>
      </div>

      <SearchResults query={searchQuery} />
    </div>
  );
};

export default Page;
