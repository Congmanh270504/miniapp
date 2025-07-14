import { NextResponse, type NextRequest } from "next/server";
import { pinata } from "@/utils/config";

export async function DELETE(request: NextRequest) {
  try {
    const { id }: { id: string } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "ID  is required" }, { status: 400 });
    }

    // Use ID if provided, otherwise fallback to CID for backward compatibility
    await pinata.files.private.delete([id]);

    return NextResponse.json(
      {
        message: "File deleted successfully",
        deletedId: id,
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("Error during file deletion:", e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
