import { prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { reply, commentId, userId } = await request.json();

    if (!reply || !commentId || !userId) {
      return NextResponse.json(
        { error: "Reply data is required" },
        { status: 400 }
      );
    }

    const user = await prisma.users.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Save reply to database
    const newReply = await prisma.commentsReplies.create({
      data: {
        reply,
        commentId,
        userId: user.id,
      },
    });

    if (!newReply) {
      return NextResponse.json(
        { error: "Failed to create reply" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: 200,
      reply: newReply,
    });
  } catch (error) {
    console.error("Error creating reply:", error);
    return NextResponse.json(
      { error: "Failed to create reply" },
      { status: 500 }
    );
  }
}
