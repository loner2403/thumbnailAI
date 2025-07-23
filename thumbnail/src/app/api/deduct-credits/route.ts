// src/app/api/deduct-credits/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { generate } from "~/app/actions/generate";

export async function POST(_req: NextRequest) {
  try {
    await generate();
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
  }
}