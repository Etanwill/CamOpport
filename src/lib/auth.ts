// src/lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { verifyPassword, getUserByEmail, createUser } from "@/lib/db/queries";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email:    { label: "Email",    type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await verifyPassword(credentials.email, credentials.password);
        if (!user) return null;
        return {
          id:           user.id,
          name:         user.name,
          email:        user.email,
          role:         user.role,
          roleSelected: user.roleSelected,
          city:         user.city ?? "",
          xp:           user.xp,
          companyName:  user.companyName ?? "",
          companyLogo:  user.companyLogo ?? "",
        };
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId:     process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    // Runs for every sign-in attempt, including Google. We use it to
    // silently create a CamOpport account the first time someone signs in
    // with Google — no separate "register" step needed. The account starts
    // with roleSelected=false so the app can route them to the "choose your
    // role" screen right after.
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user.email) return false;
        const existing = await getUserByEmail(user.email);
        if (!existing) {
          await createUser({
            name:         user.name || user.email.split("@")[0],
            email:        user.email,
            avatar:       user.image ?? undefined,
            role:         "job_seeker", // placeholder until they choose on /auth/choose-role
            roleSelected: false,
          });
        }
      }
      return true;
    },
    // Populates the JWT. For credentials sign-in, `user` already carries our
    // DB fields (see authorize() above). For Google sign-in, NextAuth only
    // gives us the provider profile (name/email/image), so we look the
    // freshly created/existing row up by email ourselves. `trigger === "update"`
    // lets the client force a refresh (used right after role selection).
    async jwt({ token, user, account, trigger }) {
      if (user && account?.provider === "credentials") {
        token.id           = user.id;
        token.role         = (user as any).role;
        token.roleSelected = (user as any).roleSelected;
        token.city         = (user as any).city;
        token.xp           = (user as any).xp;
        token.companyName  = (user as any).companyName;
        token.companyLogo  = (user as any).companyLogo;
      } else if ((user && account?.provider === "google") || trigger === "update" || !token.id) {
        const email = (user?.email as string | undefined) ?? (token.email as string | undefined);
        if (email) {
          const dbUser = await getUserByEmail(email);
          if (dbUser) {
            token.id           = dbUser.id;
            token.role         = dbUser.role;
            token.roleSelected = dbUser.roleSelected;
            token.city         = dbUser.city ?? "";
            token.xp           = dbUser.xp;
            token.companyName  = dbUser.companyName ?? "";
            token.companyLogo  = dbUser.companyLogo ?? "";
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id           = token.id as string;
        session.user.role         = token.role as string;
        session.user.roleSelected = token.roleSelected as boolean;
        session.user.city         = token.city as string;
        session.user.xp           = token.xp as number;
        session.user.companyName  = token.companyName as string;
        session.user.companyLogo  = token.companyLogo as string;
      }
      return session;
    },
  },
  pages: { signIn: "/auth/login" },
  session: { strategy: "jwt" },
};