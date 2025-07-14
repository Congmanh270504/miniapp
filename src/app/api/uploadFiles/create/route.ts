import { NextResponse, type NextRequest } from "next/server";

// This route has been deprecated
// Use /api/uploadFiles/audio for audio uploads
// Use /api/uploadFiles/image for image uploads
export async function POST(request: NextRequest) {
  return NextResponse.json(
    {
      error:
        "This endpoint has been deprecated. Use /api/uploadFiles/audio or /api/uploadFiles/image instead.",
    },
    { status: 410 }
  );
}
