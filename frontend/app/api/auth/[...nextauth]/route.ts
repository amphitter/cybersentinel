import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import User from "@/lib/models/User";

// ——— Type Augmentation ———
import type { JWT } from "next-auth/jwt";
import type { DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: { id: string } & DefaultSession["user"];
  }
  interface User extends DefaultUser {
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
}

// ——— Build your NextAuth options ———
const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        if (!creds) return null;

        await mongoose.connect(process.env.MONGODB_URI!);
        const identifier = creds.email.toLowerCase();
        const user = await User.findOne({
          $or: [{ email: identifier }, { username: identifier }],
        });
        if (!user || !user.password) return null;

        const valid = await bcrypt.compare(creds.password, user.password);
        if (!valid) return null;

        return {
          id: user._id.toString(),
          name: user.username,
          email: user.email,
          image: user.image || null,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" || account?.provider === "github") {
        const db = (await clientPromise).db();
        const existing = await db.collection("users").findOne({ email: user.email });
        const key = account.provider === "google" ? "googleId" : "githubId";

        if (existing) {
          if (!existing[key]) {
            await db.collection("users").updateOne(
              { email: user.email },
              { $set: { [key]: account.providerAccountId } }
            );
          }
        } else {
          await db.collection("users").insertOne({
            email: user.email,
            username:
              user.name?.toLowerCase().replace(/\s+/g, "_") || `user_${Date.now()}`,
            image: user.image || "",
            createdAt: new Date(),
            linkVisits: { today: 0, thisWeek: 0, thisMonth: 0 },
            linkHistory: [],
            quizHighScore: 0,
            [key]: account.providerAccountId,
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-up",
    error: "/sign-up?error=OAuthAccountNotLinked",
  },
};

// ——— Create the handler but don’t export it directly ———
const handler = NextAuth(authOptions);

// ——— Only export GET and POST ———
export { handler as GET, handler as POST };
