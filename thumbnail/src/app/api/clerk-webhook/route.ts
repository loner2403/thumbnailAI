import { NextResponse } from "next/server";
import { db } from "~/server/db";

export async function POST(req: Request) {
  const payload = await req.json();

  // Only handle user.created events
  if (payload.type === "user.created") {
    const { id, email_addresses, first_name, last_name, image_url } = payload.data;

    await db.user.upsert({
      where: { id },
      update: {
        email: email_addresses[0]?.email_address,
        name: `${first_name ?? ""} ${last_name ?? ""}`.trim(),
        image: image_url,
      },
      create: {
        id,
        email: email_addresses[0]?.email_address,
        name: `${first_name ?? ""} ${last_name ?? ""}`.trim(),
        image: image_url,
        credits: 10, // default value
        password: "", // Clerk handles auth
      },
    });
  }

  return NextResponse.json({ received: true });
} 