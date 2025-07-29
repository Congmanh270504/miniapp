"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useCallback, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Play, Music, MessageCircle, Heart } from "lucide-react";
import { SongWithPinataImage } from "../../../types/song-types";

export const HoverEffect = ({
  songData,
  className,
}: {
  songData: SongWithPinataImage[];
  className?: string;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleImageError = (itemId: string) => {
    setImageErrors((prev) => new Set(prev).add(itemId));
  };
  const formatLikes = useCallback((count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  }, []);
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2  lg:grid-cols-5  py-10 animate-fade-down animate-once animate-ease-in",
        className
      )}
    >
      {songData.map((item, idx) => (
        <Link
          href={`/songs/${item.slug}`}
          key={item.slug}
          className="relative group  block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block  rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card>
            <div className="relative mb-3 group">
              {imageErrors.has(item.songId) ? (
                <div className="w-full aspect-square bg-gray-700 rounded-md flex items-center justify-center">
                  <Music className="h-8 w-8 text-gray-400" />
                </div>
              ) : (
                <div className="relative w-full aspect-square">
                  <Image
                    src={item.imageFile.url}
                    alt={item.title}
                    fill
                    quality={100}
                    className="object-cover rounded-md"
                    onError={() => handleImageError(item.songId)}
                  />
                </div>
              )}
              {hoveredIndex === idx && (
                <div className="absolute inset-0 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="lg"
                    className="h-12 w-12 rounded-full bg-white text-black hover:bg-gray-200"
                  >
                    <Play className="h-6 w-6 fill-current" />
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <CardTitle className="font-medium text-sm leading-tight line-clamp-2 mt-0">
                {item.title}
              </CardTitle>
              <div className="flex justify-between items-center">
                {item.artist && (
                  <div className="flex items-center gap-1">
                    <p className="text-[#B9375D] text-xs line-clamp-2">
                      {item.artist}
                    </p>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span className="text-xs">
                      {formatLikes(item.hearted.length)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-xs">
                      {formatLikes(item.comments.length)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "h-full shadow-lg transition-colors cursor-pointer group rounded-2xl w-full p-4 overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 group-hover:border-gray-300 dark:group-hover:border-gray-700 relative z-20",
        className
      )}
    >
      <div className="relative z-50">{children}</div>
    </div>
  );
};
export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4
      className={cn(
        "text-gray-900 dark:text-zinc-100 font-bold tracking-wide mt-4",
        className
      )}
    >
      {children}
    </h4>
  );
};
export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "mt-2 text-gray-600 dark:text-zinc-400 tracking-wide leading-relaxed text-sm line-clamp-3",
        className
      )}
    >
      {children}
    </p>
  );
};
