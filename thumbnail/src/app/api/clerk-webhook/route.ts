// src/app/api/clerk-webhook/route.ts
import { NextResponse } from "next/server";
import { db } from "~/server/db";

// Define a type for the expected payload structure
interface ClerkWebhookEvent {
  type: 'user.created' | 'user.updated' | 'user.deleted';
  data: {
    id: string;
    email_addresses: { email_address: string }[];
    first_name: string | null;
    last_name: string | null;
    image_url: string;
  };
}

export async function POST(req: Request) {
  const payload = await req.json() as ClerkWebhookEvent;

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
