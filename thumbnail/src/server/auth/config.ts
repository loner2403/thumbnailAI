import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { type DefaultSession, type NextAuthOptions, type SessionStrategy, type User as AdapterUser, type Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { ZodError } from "zod";
import { signInSchema } from "~/schemas/auth";
import type { DefaultJWT, JWT } from "next-auth/jwt";

import { db } from "~/server/db";
import { env } from "~/env.js";
import type { User } from "@prisma/client";

/**
 * Module augmentation for `next-auth` types.
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
  }
}

/**
 * Options for NextAuth.js
 */
export const authConfig: NextAuthOptions = {
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const {email, password} = await signInSchema.parseAsync(credentials);

          const user = await db.user.findUnique({
            where: {
              email: email,
            },
          });

          if (!user?.password) {
            return null;
          }

          const validPassword = await bcrypt.compare(password, user.password);

          if(!validPassword) {
            return null;
          }
          return user;
        
        } catch(error) {
          if(error instanceof ZodError){
            return null;
          }
         throw error;
        }
      }
    })
  ],
  pages: {
    signIn: "/signin",
  },
  secret: env.AUTH_SECRET,
  adapter: PrismaAdapter(db),
  
  callbacks: {
    jwt({ token, user }: { token: JWT; user?: User | AdapterUser }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }: { session: Session; token: JWT }) {
      if (token && session?.user) {
        session.user.id = token.id;
      }
      return session;
    }
  },
};
