"use server";

import { revalidatePath } from "next/cache";
import { db } from "~/server/db";
import { getOrCreateUser } from "~/server/auth/getOrCreateUser";

// Simple server-side actions for thumbnail generation

/**
 * Generate action - placeholder for any server-side processing
 */
export async function generate() {
  const user = await getOrCreateUser();

  if (!user) {
    throw new Error("User not found");
  }

  if (user.credits <= 0) {
    throw new Error("Not enough credits");
  }

  await db.user.update({
    where: {
      id: user.id,
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