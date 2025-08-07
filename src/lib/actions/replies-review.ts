"use server";
import { prisma } from "@/utils/prisma";

export async function createRepliesReview(
  reviewId: string,
  userId: string,
  reply: string
) {
  try {
    if (!reviewId || !userId || !reply) {
      return { ok: false, message: "Missing required fields" };
    }

    const currentUser = await prisma.users.findUnique({
      where: { clerkId: userId },
    });
    if (!currentUser) {
      return { ok: false, message: "User not found" };
    }

    const isExistsReply = await prisma.reviewsReplies.findFirst({
      where: {
        reviewId,
        userId: currentUser.id,
        reply,
      },
    });
    if (isExistsReply) {
      return { ok: false, message: "Reply already exists" };
    }
    const repliesReview = await prisma.reviewsReplies.create({
      data: {
        reviewId,
        userId: currentUser.id,
        reply,
      },
    });
    if (!repliesReview) {
      return { ok: false, message: "Failed to create reply" };
    }
    return {
      ok: true,
      data: repliesReview,
      message: "Reply created successfully",
    };
  } catch (error) {
    console.error("Error creating reply:", error);
    return { ok: false, message: "Error creating reply" };
  }
}
