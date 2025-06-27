"use client";

import { useEffect, useState } from "react";
import { getAudioDuration, formatDuration } from "@/lib/audio-utils";

interface AudioDurationProps {
  url: string;
  cid?: string; // Optional CID for caching
}

// Simple in-memory cache for duration
const durationCache = new Map<string, number>();

export function AudioDuration({ url, cid }: AudioDurationProps) {
  const [duration, setDuration] = useState<string>("--:--");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!url) {
      setDuration("0:00");
      setLoading(false);
      return;
    }

    // Use CID as cache key if available, otherwise use URL
    const cacheKey = cid || url;
    
    // Check cache first
    const cachedDuration = durationCache.get(cacheKey);
    if (cachedDuration !== undefined) {
      setDuration(formatDuration(cachedDuration));
      setLoading(false);
      return;
    }

    // Load duration
    setLoading(true);
    getAudioDuration(url)
      .then((seconds) => {
        // Cache the result
        durationCache.set(cacheKey, seconds);
        setDuration(formatDuration(seconds));
      })
      .catch(() => {
        setDuration("Error");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [url, cid]);

  if (loading) {
    return <span className="text-gray-400">Loading...</span>;
  }

  return <span>{duration}</span>;
}
