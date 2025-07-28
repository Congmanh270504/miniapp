import { prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest) {
  try {
    const { comment, songId, userId } = await request.json();

    console.log(comment, songId, userId);
    if (!comment || !songId || !userId) {
      return NextResponse.json(
        { error: "Comments data is required" },
        { status: 400 }
      );
    }

    const user = await prisma.users.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // luu comment vao database
    const newComment = await prisma.comments.create({
      data: {
        comment: comment, // Assuming you want to save the first comment
        songId: songId,
        userId: user.id,
      },
    });
    if (!newComment) {
      return NextResponse.json(
        { error: "Failed to create comment" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: 200,
      comments: newComment,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}
