"use client";

import { useSearch } from "@/hooks/useSearch";
import {
  Loader2,
  Music,
  User,
  Search,
  Heart,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

interface SearchResultsProps {
  query: string;
}

const SearchResults = ({ query }: SearchResultsProps) => {
  const { data, isFetching, error } = useSearch(query, true); // Enable fullResults=true for search page

  const songs = data?.songs || [];
  const users = data?.users || [];
  const totalResults = songs.length + users.length;

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p className="text-gray-600 dark:text-gray-400">
          Searching for "{query}"...
        </p>

        {/* Skeleton loading */}
        <div className="w-full max-w-4xl mt-8 space-y-6">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex items-center gap-4 p-4 border rounded-lg"
            >
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-red-500 mb-4">
          <Search className="h-12 w-12 mx-auto mb-2" />
          <p className="text-lg font-medium">Search Failed</p>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
          {error.message ||
            "Something went wrong while searching. Please try again."}
        </p>
      </div>
    );
  }

  if (totalResults === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Search className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
          No results found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
          We couldn't find anything matching "{query}". Try adjusting your
          search terms.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Songs Results */}
      {songs.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Music className="h-6 w-6" />
            Songs (<span className="text-red-600">{songs.length}</span>)
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {songs.map((song, index) => (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link
                  href={`/songs/${song.slug}`}
                  className="block p-4 border rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {/* Song Image */}
                    <div className="flex-shrink-0">
                      {song.imageUrl ? (
                        <Image
                          src={song.imageUrl}
                          alt={song.title}
                          width={64}
                          height={64}
                          className="w-16 h-16 rounded-lg object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <Music className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Song Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                        {song.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 truncate">
                        {song.artist}
                      </p>
                      {song.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1 line-clamp-2">
                          {song.description}
                        </p>
                      )}
                    </div>

                    {/* Right Column: Genre Badge and Counts */}
                    <div className="flex-shrink-0 flex flex-col items-end gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {song.Genre.name}
                      </span>

                      {/* Counts */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Heart className="w-3 h-3" />
                          <span>{song.heartedCount || 0}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <MessageCircle className="w-3 h-3" />
                          <span>{song.commentsCount || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Users Results */}
      {users.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <User className="h-6 w-6" />
            Users (<span className="text-red-600">{users.length}</span>)
          </h2>

          <div className="grid gap-4 grid-cols-2">
            {users.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link
                  href={`/${user.clerkId}/tracks`}
                  className="block p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {/* User Avatar */}
                    <div className="flex-shrink-0">
                      {user.imageUrl ? (
                        <Image
                          src={user.imageUrl}
                          alt={user.firstName || user.username || "User"}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                        {user.firstName && user.lastName
                          ? `${user.firstName} ${user.lastName}`
                          : user.username || "Unknown User"}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 truncate">
                        {user.emailAddress || user.username}
                      </p>
                    </div>

                    {/* User Badge */}
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        User
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
};

export default SearchResults;
