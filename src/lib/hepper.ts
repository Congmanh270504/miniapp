export function toSlug(str: string) {
  return str
    .normalize("NFD") // tách dấu
    .replace(/[\u0300-\u036f]/g, "") // xóa dấu
    .toLowerCase()
    .replace(/\s+/g, "-") // thay dấu cách bằng -
    .replace(/[^a-z0-9\-]/g, "") // chỉ giữ a-z, 0-9, -
    .replace(/\-+/g, "-") // bỏ trùng dấu -
    .replace(/^\-+|\-+$/g, ""); // bỏ - ở đầu/cuối
}
export function getRandomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}
export function convertToVNDay(date: Date | string): string {
  // Handle both Date objects and ISO string dates
  const dateObj = typeof date === "string" ? new Date(date) : date;

  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    return "Invalid Date";
  }

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  return dateObj.toLocaleDateString("vi-VN", options).replace(/\//g, "/");
}
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

/**
 * Format date to Vietnamese format with error handling
 * @param date Date object, ISO string, or timestamp
 * @returns Formatted date string or fallback
 */
export function formatVNDate(
  date: Date | string | number | null | undefined
): string {
  if (!date) return "N/A";

  try {
    const dateObj =
      typeof date === "string" || typeof date === "number"
        ? new Date(date)
        : date;

    if (isNaN(dateObj.getTime())) {
      return "Invalid Date";
    }

    return dateObj.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Error";
  }
}

/**
 * Format date to Vietnamese datetime format
 * @param date Date object, ISO string, or timestamp
 * @returns Formatted datetime string
 */
export function formatVNDateTime(
  date: Date | string | number | null | undefined
): string {
  if (!date) return "N/A";

  try {
    const dateObj =
      typeof date === "string" || typeof date === "number"
        ? new Date(date)
        : date;

    if (isNaN(dateObj.getTime())) {
      return "Invalid Date";
    }

    return dateObj.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("Error formatting datetime:", error);
    return "Error";
  }
}

/**
 * Get relative time (e.g., "2 hours ago", "3 days ago")
 * @param date Date object, ISO string, or timestamp
 * @returns Relative time string
 */
export function getRelativeTime(
  date: Date | string | number | null | undefined
): string {
  if (!date) return "N/A";

  try {
    const dateObj =
      typeof date === "string" || typeof date === "number"
        ? new Date(date)
        : date;

    if (isNaN(dateObj.getTime())) {
      return "Invalid Date";
    }

    const now = new Date();
    const diffInMs = now.getTime() - dateObj.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return "Vừa xong";
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    if (diffInDays < 7) return `${diffInDays} ngày trước`;

    // For older dates, return formatted date
    return formatVNDate(dateObj);
  } catch (error) {
    console.error("Error getting relative time:", error);
    return "Error";
  }
}

export function calculateTimeAgo(date: Date | string): string {
  const now = new Date();
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) {
    return "just now";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else {
    return `${diffInDays}d ago`;
  }
}
