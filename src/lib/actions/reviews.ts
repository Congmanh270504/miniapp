"use server";
import { prisma } from "@/utils/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { calculateTimeAgo } from "../hepper";

interface ReviewData {
  review: string;
  rating: number;
}

type Review = {
  id: string;
  username: string;
  avatarUrl: string;
  content: string;
  likes: number;
  time: string;
  rating?: number;
  replies?: Review[];
};

export async function getReviews() {
  try {
    const reviews = await prisma.reviews.findMany({
      include: {
        Users: true,
        ReviewsReplies: {
          include: {
            Users: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!reviews || reviews.length === 0) {
      return [];
    }
    return reviews;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
}

export async function createReview(userId: string, data: ReviewData) {
  try {
    if (!userId || !data.review || data.rating < 0) {
      return { ok: false, message: "Missing or invalid review data" };
    }
    // Check if user exists
    const currentUser = await prisma.users.findUnique({
      where: { clerkId: userId },
    });
    if (!currentUser) {
      return { ok: false, message: "User not found" };
    }
    const isExistsReview = await prisma.reviews.findFirst({
      where: {
        userId: currentUser.id,
        comment: data.review,
        rating: data.rating,
      },
    });
    if (isExistsReview) {
      return { ok: false, message: "Review already exists" };
    }
    const createData = await prisma.reviews.create({
      data: {
        userId: currentUser.id,
        comment: data.review,
        rating: data.rating,
      },
    });
    if (!createData) {
      return { ok: false, message: "Failed to create review" };
    }
    return {
      ok: true,
      data: createData,
      message: "Review created successfully",
    };
  } catch (error) {
    console.error("Error creating review:", error);
    return { ok: false, message: "Error creating review" };
  }
}
export async function getReviewsWithUserData(
  reviews: any[]
): Promise<Review[]> {
  try {
    const client = await clerkClient();

    // Get all unique user clerk IDs from reviews and replies
    const allUserIds = new Set<string>();

    reviews.forEach((review) => {
      allUserIds.add(review.Users.clerkId);
      review.ReviewsReplies?.forEach((reply: any) => {
        allUserIds.add(reply.Users.clerkId);
      });
    });

    // Get user information from Clerk
    const { data: users } = await client.users.getUserList({
      userId: Array.from(allUserIds),
    });

    // Create a map for quick user lookup
    const userMap = new Map(users.map((user) => [user.id, user]));

    // Transform reviews to Review type
    const transformedReviews: Review[] = reviews.map((review) => {
      const user = userMap.get(review.Users.clerkId);

      // Calculate time
      const time = calculateTimeAgo(review.createdAt);

      // Transform replies if they exist
      const replies: Review[] =
        review.ReviewsReplies?.map((reply: any) => {
          const replyUser = userMap.get(reply.Users.clerkId);
          return {
            id: reply.id,
            username: replyUser?.fullName || "Unknown User",
            avatarUrl: replyUser?.imageUrl || "/user.png",
            content: reply.reply,
            likes: 0, // Assuming no likes system for replies yet
            time: calculateTimeAgo(reply.createdAt),
          };
        }) || [];

      return {
        id: review.id,
        username: user?.fullName || "Unknown User",
        avatarUrl: user?.imageUrl || "/user.png",
        content: review.comment,
        likes: 0, // Assuming no likes system yet
        time,
        rating: review.rating,
        replies: replies.length > 0 ? replies : undefined,
      };
    });

    return transformedReviews;
  } catch (error) {
    console.error("Error fetching reviews data:", error);
    return [];
  }
}
