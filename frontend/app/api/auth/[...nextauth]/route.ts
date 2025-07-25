import NextAuth, { DefaultSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb"
import bcrypt from "bcrypt"
import mongoose from "mongoose"
import User from "@/lib/models/User"

declare module "next-auth" {
  interface Session {
    user: { id?: string } & DefaultSession["user"]
  }
}

const getAuthHandler = async () => {
  const client = await clientPromise;

  return NextAuth({
    adapter: MongoDBAdapter(client as any),
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

          const identifier = creds.email?.toLowerCase();
          const user = await User.findOne({
            $or: [{ email: identifier }, { username: identifier }],
          });

          if (user && user.password && await bcrypt.compare(creds.password, user.password)) {
            return user;
          }
          return null;
        },
      }),
    ],
    callbacks: {
      async signIn({ user, account }) {
        if (account?.provider === "google" || account?.provider === "github") {
          const db = client.db()
          const existing = await db.collection("users").findOne({ email: user.email })
          const key = account.provider === "google" ? "googleId" : "githubId"

          if (existing) {
            if (!existing[key]) {
              await db.collection("users").updateOne(
                { email: user.email },
                { $set: { [key]: account.providerAccountId } }
              )
            }
          } else {
            await db.collection("users").insertOne({
              email: user.email,
              username: user.name?.toLowerCase().replace(/\s+/g, "_") || `user_${Date.now()}`,
              image: user.image || "",
              createdAt: new Date(),
              linkVisits: { today: 0, thisWeek: 0, thisMonth: 0 },
              linkHistory: [],
              quizHighScore: 0,
              [key]: account.providerAccountId,
            })
          }
        }
        return true
      },
      async jwt({ token, user }) {
        if (user) token.id = user.id
        return token
      },
      async session({ session, token }) {
        if (token.id && session.user) session.user.id = token.id as string
        return session
      },
    },
    pages: {
      signIn: "/sign-up",
      error: "/sign-up?error=OAuthAccountNotLinked",
    },
  });
};

// Export the handler properly for App Router:
const handlerPromise = getAuthHandler();

export const GET = async (req: Request) => {
  const handler = await handlerPromise;
  return handler.GET!(req);
};

export const POST = async (req: Request) => {
  const handler = await handlerPromise;
  return handler.POST!(req);
};
