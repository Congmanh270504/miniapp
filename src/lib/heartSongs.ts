/**
 * Utility functions để quản lý Heart Songs API calls
 */

export interface HeartSongResponse {
  success: boolean;
  isHearted: boolean;
  message: string;
}

export interface GetHeartStatusResponse {
  isHearted: boolean;
  songId: string;
}

/**
 * Cập nhật trạng thái heart của một bài hát
 */
export const updateHeartSong = async (
  songId: string,
  isHearted: boolean
): Promise<HeartSongResponse> => {
  const response = await fetch("/api/heartSongs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      songId,
      isHearted,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update heart songs status");
  }

  return response.json();
};

/**
 * Lấy trạng thái heart của một bài hát
 */
export const getHeartStatus = async (
  songId: string
): Promise<GetHeartStatusResponse> => {
  const response = await fetch(`/api/heartSongs?songId=${songId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to get heart songs status");
  }

  return response.json();
};

/**
 * Lấy danh sách tất cả bài hát đã heart (có thể mở rộng trong tương lai)
 */
export const getAllHeartedSongs = async (): Promise<any[]> => {
  // TODO: Implement API endpoint để lấy tất cả bài hát đã heart
  // Có thể tạo endpoint GET /api/heartSongs/all
  throw new Error("Not implemented yet");
};
