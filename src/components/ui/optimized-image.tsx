"use client";

import { useState, useCallback } from "react";
import Image from "next/image";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallbackSrc?: string;
  quality?: number;
  onError?: () => void;
  loading?: "lazy" | "eager";
}

export default function OptimizedImage({
  src,
  alt,
  width = 300,
  height = 300,
  className = "",
  fallbackSrc = "/twice.png",
  quality = 80,
  onError,
  loading = "lazy",
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = useCallback(() => {
    if (!hasError) {
      setHasError(true);
      setImageSrc(fallbackSrc);
      onError?.();
    }
  }, [hasError, fallbackSrc, onError]);

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
      loading={loading}
      quality={quality}
      // Let Next.js handle the optimization
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}
