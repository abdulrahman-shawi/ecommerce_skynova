// ============================================
// Auth.js v5 (NextAuth 5) — Authentication Config
// Adapter: @auth/prisma-adapter
// Provider: Credentials (email/password)
// ============================================

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// ─── Auth Config ───────────────────────────
// NOTE: No adapter needed — we use JWT strategy + Credentials provider only.
// Adapter is only required for: (1) Database sessions, (2) OAuth account linking.
// JWT sessions are stateless and perfect for email/password auth.
export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  // JWT sessions (stateless, no DB session table needed)
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Custom pages
  pages: {
    signIn: "/login",
    error: "/login",
  },

  // ─── Providers ────────────────────────────
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "البريد الإلكتروني", type: "email" },
        password: { label: "كلمة المرور", type: "password" },
      },
      async authorize(credentials) {
        // Validate input
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) {
          return null;
        }

        // Verify password with bcrypt
        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) {
          return null;
        }

        // Return user object (saved in JWT)
        // Uses username (not name) and accountType (not role)
        return {
          id: user.id,
          email: user.email,
          name: user.username, // username is the display name
          role: user.accountType, // ADMIN | MANAGER | STAFF
          isAffiliate: user.isAffiliate, // true | false
        };
      },
    }),
  ],

  // ─── Callbacks ────────────────────────────
  callbacks: {
    // Add user data to JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isAffiliate = user.isAffiliate;
      }
      return token;
    },
    // Add token data to session (available in client)
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.isAffiliate = token.isAffiliate as boolean;
      }
      return session;
    },
  },
  // NOTE: trustHost moved to .env as AUTH_TRUST_HOST=true
  // Do NOT add trustHost here — Auth.js v5 reads it from env only
});
