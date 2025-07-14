"use server";

import { revalidatePath } from "next/cache";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

// Simple server-side actions for thumbnail generation

/**
 * Generate action - placeholder for any server-side processing
 */
export async function generate() {
  const serverSession = await auth();

  if (!serverSession || !serverSession.user) {
    throw new Error("User not authenticated");
  }

  const user = await db.user.findUnique({
    where: {
      id: serverSession.user.id,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.credits <= 0) {
    throw new Error("Not enough credits");
  }

  await db.user.update({
    where: {
      id: serverSession.user.id,
    },
    data: {
      credits: {
        decrement: 1,
      },
    },
  });
}

/**
 * Refresh action - placeholder for any server-side refresh operation
 */
export async function refresh() {
  revalidatePath("/dashboard");
} 