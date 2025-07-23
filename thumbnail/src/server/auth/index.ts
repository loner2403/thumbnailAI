import { getServerSession } from "next-auth/next";
import { type Session } from "next-auth"; // Import Session type
import { authConfig } from "./config";

// NextAuth v4 compatible auth function
const auth = async (): Promise<Session | null> => {
  return await getServerSession(authConfig);
};

export { auth };
