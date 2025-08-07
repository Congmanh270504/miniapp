import { NextRequest, NextResponse } from "next/server";
import { getCommentRepliesSong } from "@/lib/actions/comments";
import { prisma } from "@/utils/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const songId = searchParams.get("songId");
    console.log("Fetching comments for songId:", songId);

    if (!songId || songId === "") {
      return NextResponse.json(
        { error: "Comments data is required" },
        { status: 400 }
      );
    }
    const comments = await prisma.comments.findMany({
      where: { songId: songId },
      include: {
        Users: true,
        Replies: {
          include: {
            Users: true,
          },
        },
      },
    });

    if (!comments) {
      return NextResponse.json(
        { error: "No comments found for this song" },
        { status: 404 }
      );
    }

    const transformedComments = await getCommentRepliesSong(comments);

    return NextResponse.json({
      status: 200,
      comments: transformedComments,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}
