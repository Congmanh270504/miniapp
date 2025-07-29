"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Send,
  Music,
  User,
  Loader2,
  X,
  Heart,
  MessageCircle,
} from "lucide-react";
import useDebounce from "@/hooks/useDebounce";
import { useSearch } from "@/hooks/useSearch";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

function ActionSearchBar() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const debouncedQuery = useDebounce(query, 500);
  const { data, isFetching, error } = useSearch(debouncedQuery);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const songs = data?.songs || [];
  const users = data?.users || [];
  const allResults = [...songs, ...users];

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFocused) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < allResults.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && allResults[selectedIndex]) {
            const result = allResults[selectedIndex];
            if ("slug" in result) {
              router.push(`/songs/${result.slug}`);
            } else {
              // It's a user
              router.push(`/user/${result.clerkId}`);
            }
            handleClear();
          } else if (query.trim().length >= 1) {
            // Không có item nào được select nhưng có query -> chuyển đến search page
            router.push(`/search/${encodeURIComponent(query.trim())}`);
            handleClear();
          }
          break;
        case "Escape":
          setIsFocused(false);
          inputRef.current?.blur();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isFocused, allResults, selectedIndex, query, router]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClear = () => {
    setQuery("");
    setSelectedIndex(-1);
    setIsFocused(false);
  };

  const handleSelectResult = (result: any) => {
    if ("slug" in result) {
      // It's a song
      router.push(`/songs/${result.slug}`);
    } else {
      // It's a user
      router.push(`/user/${result.clerkId}`);
    }
    handleClear();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSelectedIndex(-1);
    setIsTyping(true);
  };

  // Reset typing state when debounced query changes
  useEffect(() => {
    setIsTyping(false);
  }, [debouncedQuery]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const showResults =
    isFocused && (query.trim().length >= 1 || allResults.length > 0);

  const container = {
    hidden: { opacity: 0, height: 0 },
    show: {
      opacity: 1,
      height: "auto",
      transition: {
        height: { duration: 0.4 },
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        height: { duration: 0.3 },
        opacity: { duration: 0.2 },
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div ref={containerRef} className="w-full max-w-xl ml-auto">
      <div className="relative flex flex-col justify-start items-center">
        <div className="w-full max-w-sm sticky top-0 z-10 pb-1 ">
          <div className="relative">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search songs, artists, users..."
              name="action-search"
              value={query}
              onChange={handleInputChange}
              onFocus={handleFocus}
              className="pl-3 pr-9 py-1.5 h-9 text-sm rounded-lg border-border/20 focus-visible:ring-offset-0"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4">
              <Search className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            </div>

            <div className="w-full max-w-sm absolute top-10 left-0 z-10 ">
              <AnimatePresence>
                {showResults && (
                  <motion.div
                    className="w-full no-scrollbar border rounded-md shadow-lg overflow-hidden dark:border-gray-800 bg-white dark:bg-black mt-1 max-h-80 overflow-y-auto relative"
                    variants={container}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                  >
                    {/* Clear button trong dropdown */}
                    {query.trim().length > 0 && (
                      <div className="absolute top-1 right-3 z-20">
                        <button
                          onClick={handleClear}
                          className="p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-red-400 hover:text-red-600 transition-all duration-200 hover:scale-105"
                          title="Clear search"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {/* Loading state - hiển thị khi đang typing hoặc đang loading */}
                    {(isFetching || (isTyping && query.trim().length >= 1)) &&
                      debouncedQuery.trim().length >= 1 && (
                        <div className="p-4 text-center pt-8">
                          <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                          <p className="text-sm text-gray-500">
                            {isTyping
                              ? `Searching for "${query}"...`
                              : `Searching for "${debouncedQuery}"...`}
                          </p>
                          {/* Skeleton loading */}
                          <div className="mt-3 space-y-2">
                            {[1, 2, 3].map((item) => (
                              <div
                                key={item}
                                className="flex items-center gap-3 px-3 py-2"
                              >
                                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                <div className="flex-1 space-y-1">
                                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
                                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Error state */}
                    {error && !isFetching && (
                      <div className="p-4 text-center text-red-500 pt-8">
                        <p className="text-sm">
                          Search failed. Please try again.
                        </p>
                      </div>
                    )}

                    {/* No results state - chỉ hiển thị khi không loading, không typing và không có lỗi */}
                    {!isFetching &&
                      !isTyping &&
                      !error &&
                      allResults.length === 0 &&
                      debouncedQuery.trim().length >= 1 && (
                        <div className="p-4 text-center pt-8">
                          <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm text-gray-500">
                            No results found for "{debouncedQuery}"
                          </p>
                        </div>
                      )}

                    {!isFetching && !error && songs.length > 0 && (
                      <div className="py-2">
                        <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">
                          Songs ({songs.length})
                        </div>
                        <div>
                          {songs.map((song, index) => (
                            <motion.div
                              key={song.id}
                              className={cn(
                                "px-3 py-2 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-zinc-900 cursor-pointer",
                                selectedIndex === index &&
                                  "bg-blue-50 dark:bg-blue-900/20"
                              )}
                              variants={item}
                              initial="hidden"
                              animate="show"
                              onClick={() => handleSelectResult(song)}
                            >
                              <div className="flex-shrink-0">
                                {song.imageUrl ? (
                                  <img
                                    src={song.imageUrl}
                                    alt={song.title}
                                    className="w-8 h-8 rounded object-cover"
                                    onError={(e) => {
                                      // Fallback khi image load failed
                                      e.currentTarget.style.display = "none";
                                    }}
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                    <Music className="w-4 h-4 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                    {song.title}
                                  </p>
                                  <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                    {song.Genre.name}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500 truncate">
                                  {song.artist}
                                </p>

                                {/* Counts */}
                                <div className="flex items-center gap-3 mt-1">
                                  <div className="flex items-center gap-1 text-xs text-gray-400">
                                    <Heart className="w-3 h-3" />
                                    <span>{song.heartedCount || 0}</span>
                                  </div>
                                  <div className="flex items-center gap-1 text-xs text-gray-400">
                                    <MessageCircle className="w-3 h-3" />
                                    <span>{song.commentsCount || 0}</span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {!isFetching && !error && users.length > 0 && (
                      <div className="py-2">
                        <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">
                          Users ({users.length})
                        </div>
                        <div>
                          {users.map((user, index) => (
                            <motion.div
                              key={user.id}
                              className={cn(
                                "px-3 py-2 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-zinc-900 cursor-pointer",
                                selectedIndex === songs.length + index &&
                                  "bg-blue-50 dark:bg-blue-900/20"
                              )}
                              variants={item}
                              initial="hidden"
                              animate="show"
                              onClick={() => handleSelectResult(user)}
                            >
                              <div className="flex-shrink-0">
                                {user.imageUrl ? (
                                  <img
                                    src={user.imageUrl}
                                    alt={
                                      user.firstName || user.username || "User"
                                    }
                                    className="w-8 h-8 rounded-full object-cover"
                                    onError={(e) => {
                                      // Fallback khi image load failed
                                      e.currentTarget.style.display = "none";
                                    }}
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                    <User className="w-4 h-4 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                  {user.firstName && user.lastName
                                    ? `${user.firstName} ${user.lastName}`
                                    : user.username || "Unknown User"}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                  {user.emailAddress || user.username}
                                </p>
                              </div>
                              <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                User
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {!isFetching && !error && allResults.length > 0 && (
                      <div className="px-3 py-2 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Use ↑↓ to navigate, Enter to select</span>
                          <span>ESC to cancel</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActionSearchBar;
