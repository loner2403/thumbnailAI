import { NextRequest, NextResponse } from "next/server";
import { generate } from "~/app/actions/generate";

export async function POST(req: NextRequest) {
  try {
    await generate();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Unknown error" }, { status: 400 });
  }
} 