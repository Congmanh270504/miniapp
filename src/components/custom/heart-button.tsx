import { FaHeart } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useHeartSong } from "@/hooks/useHeartSong";

interface HeartButtonProps {
  songId: string;
  initialHeartState: boolean;
  size?: number;
  className?: string;
  variant?:
    | "ghost"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "link";
  debounceDelay?: number;
}

export const HeartButton: React.FC<HeartButtonProps> = ({
  songId,
  initialHeartState,
  size = 24,
  className = "",
  variant = "ghost",
  debounceDelay = 500,
}) => {
    
  const { isHearted, isLoading, toggleHeart } = useHeartSong({
    songId,
    initialHeartState,
    debounceDelay,
  });

  return (
    <Button
      variant={variant}
      size="icon"
      className={`inline-flex items-center justify-center rounded-md px-6 font-medium shadow-neutral-500/20 transition active:scale-95 ${className}`}
      onClick={toggleHeart}
      disabled={isLoading}
      aria-label={isHearted ? "Remove from favorites" : "Add to favorites"}
    >
      <FaHeart
        size={size}
        className={`${isHearted ? "text-red-600" : "text-gray-400"} ${
          isLoading ? "opacity-50" : ""
        } transition-colors duration-200`}
      />
    </Button>
  );
};
