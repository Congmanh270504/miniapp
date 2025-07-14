import { useRef, useCallback } from "react";

interface UseFormTimeoutOptions {
  timeoutDuration?: number; // in milliseconds
  onTimeout?: () => void;
}

export const useFormTimeout = ({
  timeoutDuration = 20 * 60 * 1000, // 20 minutes default
  onTimeout,
}: UseFormTimeoutOptions = {}) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startTimeout = useCallback(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      onTimeout?.();
    }, timeoutDuration);
  }, [timeoutDuration, onTimeout]);

  const clearFormTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const resetTimeout = useCallback(() => {
    clearFormTimeout();
    startTimeout();
  }, [clearFormTimeout, startTimeout]);

  return {
    startTimeout,
    clearTimeout: clearFormTimeout,
    resetTimeout,
  };
};
