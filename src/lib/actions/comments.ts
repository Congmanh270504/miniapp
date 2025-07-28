"use server";
import { clerkClient } from "@clerk/nextjs/server";
import { SongWithIncludes } from "../../../types/song-types";

type Comment = {
  id: string;
  username: string;
  avatarUrl: string;
  content: string;
  likes: number;
  time: string;
  replies?: Comment[];
};

export async function getCommentRepliesSong(
  comments: SongWithIncludes["Comments"]
): Promise<Comment[]> {
  try {
    const client = await clerkClient();

    const userInforComments = comments.map((comment) => comment.Users.clerkId);

    // Get user information from Clerk
    const { data: users } = await client.users.getUserList({
      userId: userInforComments,
    });

    // Create a map for quick user lookup
    const userMap = new Map(users.map((user) => [user.id, user]));

    // Transform comments to Comment type
    const transformedComments: Comment[] = comments.map((comment) => {
      const user = userMap.get(comment.Users.clerkId);

      // Calculate time (simple implementation)
      const time = calculateTimeAgo(comment.createdAt);

      // Transform replies if they exist
      const replies: Comment[] =
        comment.Replies?.map((reply) => {
          const replyUser = userMap.get(reply.Users.clerkId);
          return {
            id: reply.id,
            username: replyUser?.fullName || "Unknown User",
            avatarUrl: replyUser?.imageUrl || "",
            content: reply.reply,
            likes: 0, // Assuming no likes system for replies yet
            time: calculateTimeAgo(reply.createdAt),
          };
        }) || [];

      return {
        id: comment.id,
        username: user?.fullName || "Unknown User",
        avatarUrl: user?.imageUrl || "",
        content: comment.comment,
        likes: 0, // Assuming no likes system yet
        time,
        replies: replies.length > 0 ? replies : undefined,
      };
    });

    return transformedComments;
  } catch (error) {
    console.error("Error fetching comments data:", error);
    return [];
  }
}

// Helper function to calculate time ago
function calculateTimeAgo(date: Date | string): string {
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
