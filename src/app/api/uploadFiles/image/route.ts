import { NextResponse, type NextRequest } from "next/server";
import { pinata } from "@/utils/config";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const imageFile: File | null = data.get("image") as unknown as File;

    if (!imageFile) {
      console.error("No image file received");
      return NextResponse.json(
        { error: "No image file received" },
        { status: 400 }
      );
    }

    const uploadImageData = await pinata.upload.private
      .file(imageFile)
      .group("0197731a-2dbe-7a3b-818a-df9bd5e77d02");

    return NextResponse.json(
      {
        imageId: uploadImageData.id,
        imageCid: uploadImageData.cid,
        fileName: imageFile.name,
        size: imageFile.size,
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("Error during image file upload:", e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
