import { timingSafeEqual } from "crypto";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { checkRateLimit, recordFailedAttempt, clearFailedAttempts } from "@/lib/auth-rate-limit";

function resolveIp(req?: { headers?: Record<string, string | string[]> }): string {
  if (!req?.headers) return "unknown";
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded.split(",")[0]).trim();
    if (ip) return ip;
  }
  const realIp = req.headers["x-real-ip"];
  if (realIp) return Array.isArray(realIp) ? realIp[0] : realIp;
  return "unknown";
}

function logFailedLogin(email: string): void {
  import("@/lib/activity").then(({ logActivity }) => {
    logActivity({
      action: "login",
      targetType: "auth",
      targetName: email,
      adminEmail: "unknown",
      metadata: { success: false, timestamp: new Date().toISOString() }
    }).catch(() => {});
  }).catch(() => {});
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          logFailedLogin(credentials?.email || "no-email");
          return null;
        }

        const ip = resolveIp(req);
        const normalizedEmail = credentials.email.trim();
        const inputPassword = credentials.password;

        const adminEmail = (process.env.ADMIN_EMAIL || "").trim();
        const adminPass = (process.env.ADMIN_PASSWORD || "").trim();

        if (!adminEmail || !adminPass) {
          logFailedLogin(normalizedEmail);
          return null;
        }

        // Validate credentials before rate limit check
        const isWrongEmail = normalizedEmail !== adminEmail;

        let passwordValid = false;
        if (!isWrongEmail) {
          const passBuf = Buffer.from(inputPassword);
          const adminPassBuf = Buffer.from(adminPass);
          if (passBuf.length === adminPassBuf.length) {
            passwordValid = timingSafeEqual(passBuf, adminPassBuf);
          }
        }

        // Correct credentials always bypass rate limit
        if (!isWrongEmail && passwordValid) {
          clearFailedAttempts(normalizedEmail, ip);
          return {
            id: "1",
            name: "Admin",
            email: adminEmail,
          };
        }

        // Invalid credentials — apply rate limiting
        const { allowed } = checkRateLimit(normalizedEmail, ip);
        if (!allowed) {
          logFailedLogin(normalizedEmail);
          return null;
        }

        recordFailedAttempt(normalizedEmail, ip);
        logFailedLogin(normalizedEmail);
        return null;
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