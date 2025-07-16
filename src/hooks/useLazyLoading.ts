import { useState, useCallback } from "react";

interface UseLazyLoadingProps {
  initialData: any[];
  loadMoreFn: (
    skip: number,
    take: number
  ) => Promise<{ data: any[]; hasMore: boolean }>;
  take?: number;
}

export function useLazyLoading({
  initialData,
  loadMoreFn,
  take = 5,
}: UseLazyLoadingProps) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const result = await loadMoreFn(data.length, take);

      if (result.data && result.data.length > 0) {
        setData((prev) => [...prev, ...result.data]);
        setHasMore(result.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setError("Failed to load more data");
      console.error("Error in lazy loading:", err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, data.length, take, loadMoreFn]);

  const reset = useCallback(() => {
    setData(initialData);
    setHasMore(true);
    setError(null);
  }, [initialData]);

  return {
    data,
    loading,
    hasMore,
    error,
    loadMore,
    reset,
  };
}
