import { NextRequest, NextResponse } from "next/server";
import { getCommentRepliesSong } from "@/lib/actions/comments";

export async function POST(request: NextRequest) {
  try {
    const { comments } = await request.json();

    if (!comments || !Array.isArray(comments)) {
      return NextResponse.json(
        { error: "Comments data is required" },
        { status: 400 }
      );
    }

    const transformedComments = await getCommentRepliesSong(comments);

    return NextResponse.json({
      success: true,
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
