import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/utils/prisma";

export async function POST(request: NextRequest) {
  try {
    // Xác thực người dùng
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { songId, isHearted } = await request.json();

    if (!songId) {
      return NextResponse.json(
        { error: "Song ID is required" },
        { status: 400 }
      );
    }

    // Tìm user trong database
    const user = await prisma.users.findUnique({
      where: { clerkId: clerkUserId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Kiểm tra xem bài hát có tồn tại không
    const song = await prisma.songs.findUnique({
      where: { id: songId },
    });

    if (!song) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    if (isHearted) {
      // Thêm vào HeartedSongs (nếu chưa có)
      const existingHeart = await prisma.heartedSongs.findFirst({
        where: {
          userId: user.id,
          songId: songId,
        },
      });

      if (!existingHeart) {
        await prisma.heartedSongs.create({
          data: {
            userId: user.id,
            songId: songId,
          },
        });
      }
    } else {
      // Xóa khỏi HeartedSongs
      await prisma.heartedSongs.deleteMany({
        where: {
          userId: user.id,
          songId: songId,
        },
      });
    }

    return NextResponse.json({
      success: true,
      isHearted,
      message: isHearted
        ? "Song added to favorites"
        : "Song removed from favorites",
    });
  } catch (error) {
    console.error("Error in heartSongs API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const songId = searchParams.get("songId");

    if (!songId) {
      return NextResponse.json(
        { error: "Song ID is required" },
        { status: 400 }
      );
    }

    // Tìm user trong database
    const user = await prisma.users.findUnique({
      where: { clerkId: clerkUserId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Kiểm tra xem user đã heart bài hát này chưa
    const heartedSong = await prisma.heartedSongs.findFirst({
      where: {
        userId: user.id,
        songId: songId,
      },
    });

    return NextResponse.json({
      isHearted: !!heartedSong,
      songId,
    });
  } catch (error) {
    console.error("Error in GET heartSongs API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
