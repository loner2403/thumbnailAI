import { db } from "~/server/db";
import { currentUser } from "@clerk/nextjs/server";

export async function getOrCreateUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) throw new Error("Not authenticated");

  // First try to find user by Clerk ID
  let user = await db.user.findUnique({ where: { id: clerkUser.id } });
  
  if (!user) {
    // If not found by ID, try to find by email
    const email = clerkUser.emailAddresses[0]?.emailAddress;
    if (email) {
      user = await db.user.findUnique({ where: { email } });
      
      if (user) {
        // User exists with email but different ID, update the ID
        user = await db.user.update({
          where: { email },
          data: {
            id: clerkUser.id,
            name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim(),
            image: clerkUser.imageUrl,
          },
        });
      } else {
        // Create new user
        try {
          user = await db.user.create({
            data: {
              id: clerkUser.id,
              email,
              name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim(),
              image: clerkUser.imageUrl,
              credits: 10,
              password: "", // Clerk handles authentication
            },
          });
        } catch (error: any) {
          // Handle race condition - user might have been created by another request
          if (error.code === 'P2002') {
            user = await db.user.findUnique({ where: { email } });
            if (!user) {
              throw error; // Re-throw if still not found
            }
          } else {
            throw error;
          }
        }
      }
    } else {
      throw new Error("No email address found for user");
    }
  }
  
  return user;
}
