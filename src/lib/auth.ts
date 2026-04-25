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
          console.log("AUTH_DEBUG: Missing credentials");
          return null;
        }

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPass = process.env.ADMIN_PASSWORD;

        console.log("AUTH_DEBUG: Checking credentials");
        console.log("AUTH_DEBUG: Input email:", credentials.email);
        console.log("AUTH_DEBUG: Expected email:", adminEmail);
        console.log("AUTH_DEBUG: Email match:", credentials.email === adminEmail);
        console.log("AUTH_DEBUG: Password match:", credentials.password === adminPass);

        if (
          credentials.email === adminEmail &&
          credentials.password === adminPass
        ) {
          console.log("AUTH_DEBUG: Login SUCCESS");
          return {
            id: "1",
            name: "Admin",
            email: adminEmail,
          };
        }

        console.log("AUTH_DEBUG: Login FAILED - credentials mismatch");
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
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