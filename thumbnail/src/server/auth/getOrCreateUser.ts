import { db } from "~/server/db";
import { currentUser } from "@clerk/nextjs/server";

export async function getOrCreateUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) throw new Error("Not authenticated");

  let user = await db.user.findUnique({ where: { id: clerkUser.id } });
  user ??= await db.user.create({
    data: {
      id: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress,
      name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim(),
      image: clerkUser.imageUrl,
      credits: 10,
      password: "", // Clerk handles authentication
    },
  });
  return user;
}
