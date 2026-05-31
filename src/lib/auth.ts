import { timingSafeEqual } from "crypto";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const adminEmail = (process.env.ADMIN_EMAIL || "").trim();
        const adminPass = (process.env.ADMIN_PASSWORD || "").trim();
        const inputEmail = credentials.email.trim();
        const inputPassword = credentials.password;

        if (!adminEmail || !adminPass) {
          return null;
        }

        if (inputEmail !== adminEmail) {
          return null;
        }

        const passBuf = Buffer.from(inputPassword);
        const adminPassBuf = Buffer.from(adminPass);

        if (passBuf.length !== adminPassBuf.length) {
          return null;
        }

        const isMatch = timingSafeEqual(passBuf, adminPassBuf);
        if (!isMatch) {
          return null;
        }

        return {
          id: "1",
          name: "Admin",
          email: adminEmail,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};