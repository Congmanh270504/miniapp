import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { revalidateTag } from "next/cache";

export async function DELETE(req: NextRequest) {
  // Kiểm tra xem có id trong query params không
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing genre id" }, { status: 400 });
  }
  try {
    // Check if genre has songs before deleting
    const existingGenre = await prisma.genres.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            Songs: true,
          },
        },
      },
    });

    if (!existingGenre) {
      return NextResponse.json({ error: "Genre not found" }, { status: 404 });
    }

    // Check if genre has songs
    if (existingGenre._count.Songs > 0) {
      return NextResponse.json(
        { error: "Cannot delete genre with associated songs" },
        { status: 400 }
      );
    }

    const genre = await prisma.genres.delete({
      where: {
        id: id,
      },
    });

    // Revalidate cache after successful deletion
    revalidateTag("admin-genres-with-count");
    revalidateTag("admin");
    revalidateTag("genres");

    return NextResponse.json(genre, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete genre" },
      { status: 500 }
    );
  }
}
