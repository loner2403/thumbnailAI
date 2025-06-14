import { getServerSession } from "next-auth/next";
import { authConfig } from "./config";

// NextAuth v4 compatible auth function
const auth = async () => {
  return await getServerSession(authConfig);
};

export { auth };
