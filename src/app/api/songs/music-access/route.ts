import { pinata } from "@/utils/config";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fileCid = searchParams.get("fileCid");

  if (!fileCid) {
    return NextResponse.json({ error: "Missing fileCid" }, { status: 400 });
  }

  // Create a music access link using the fileCid
  const musicAccessLink = await pinata.gateways.private.createAccessLink({
    cid: fileCid,
    expires: 60, 
  });

  return NextResponse.json({ musicAccessLink }, { status: 200 });
}
