import { NextResponse, type NextRequest } from "next/server";
import { pinata } from "@/utils/config";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const audioFile: File | null = data.get("audio") as unknown as File;

    if (!audioFile) {
      console.error("No audio file received");
      return NextResponse.json(
        { error: "No audio file received" },
        { status: 400 }
      );
    }

    const uploadAudioData = await pinata.upload.private
      .file(audioFile)
      .group("01977319-fe54-79b6-890b-3c1be0847112");

    return NextResponse.json(
      {
        audioId: uploadAudioData.id,
        audioCid: uploadAudioData.cid,
        fileName: audioFile.name,
        size: audioFile.size,
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("Error during audio file upload:", e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
