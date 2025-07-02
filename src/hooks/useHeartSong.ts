import { useState, useRef, useCallback, useEffect } from 'react';
import { updateHeartSong } from '@/lib/heartSongs';

interface UseHeartSongProps {
  songId: string;
  initialHeartState: boolean;
  debounceDelay?: number;
}

interface UseHeartSongReturn {
  isHearted: boolean;
  isLoading: boolean;
  toggleHeart: () => void;
}

export const useHeartSong = ({
  songId,
  initialHeartState,
  debounceDelay = 500
}: UseHeartSongProps): UseHeartSongReturn => {
  const [isHearted, setIsHearted] = useState(initialHeartState);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedHeartAction = useCallback(
    async (newHeartState: boolean) => {
      setIsLoading(true);
      try {
        const result = await updateHeartSong(songId, newHeartState);
        console.log(result.message);
        
      } catch (error) {
        console.error("Error updating heart songs status:", error);
        // Revert state nếu có lỗi
        setIsHearted(!newHeartState);
        // Có thể emit một event hoặc callback để thông báo lỗi
      } finally {
        setIsLoading(false);
      }
    },
    [songId]
  );

  const toggleHeart = useCallback(() => {
    const newHeartState = !isHearted;
    
    // Cập nhật UI ngay lập tức
    setIsHearted(newHeartState);

    // Clear timeout cũ nếu có
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce API call
    timeoutRef.current = setTimeout(() => {
      debouncedHeartAction(newHeartState);
    }, debounceDelay);
  }, [isHearted, debouncedHeartAction, debounceDelay]);

  // Cleanup timeout khi component unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Sync với prop khi songId thay đổi
  useEffect(() => {
    setIsHearted(initialHeartState);
  }, [initialHeartState, songId]);

  return {
    isHearted,
    isLoading,
    toggleHeart
  };
};
