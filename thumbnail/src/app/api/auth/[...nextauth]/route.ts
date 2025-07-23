// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth/next";
import { authConfig } from "~/server/auth/config";
import type { NextApiHandler } from "next";

const handler = NextAuth(authConfig) as NextApiHandler;

export const GET = handler;
export const POST = handler;