import { NextResponse, type NextRequest } from "next/server";
import { pinata } from "@/utils/config";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const songs: File | null = data.get("songs") as unknown as File;
    const images: File | null = data.get("images") as unknown as File;

    if (!songs && !images) {
      console.error("No file received");
      return NextResponse.json({ error: "No file received" }, { status: 400 });
    }

    const uploadSongsData = await pinata.upload.private
      .file(songs)
      .group("01977319-fe54-79b6-890b-3c1be0847112");

    const uploadImageData = await pinata.upload.private
      .file(images)
      .group("0197731a-2dbe-7a3b-818a-df9bd5e77d02");

    return NextResponse.json({ songsCid: uploadSongsData.cid, imagesCid: uploadImageData.cid }, { status: 200 });
  } catch (e) {
    console.error("Error during file upload:", e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
