import NextAuth from "next-auth/next";
import { authConfig } from "~/server/auth/config";

export const GET = NextAuth(authConfig);
export const POST = NextAuth(authConfig);
