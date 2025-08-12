import { NextRequest, NextResponse } from "next/server";
import { getCommentRepliesSong } from "@/lib/actions/comments";
import { prisma } from "@/utils/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const songId = searchParams.get("songId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!songId || songId === "") {
      return NextResponse.json(
        { error: "Comments data is required" },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    // Get total count for pagination info
    const totalComments = await prisma.comments.count({
      where: { songId: songId },
    });

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
      orderBy: {
        createdAt: "desc",
      },
      skip: skip,
      take: limit,
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
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalComments / limit),
        totalComments: totalComments,
        hasMore: skip + comments.length < totalComments,
      },
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}
