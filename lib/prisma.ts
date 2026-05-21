// ============================================
// Prisma Client Singleton
// ============================================
// Prevents multiple Prisma Client instances in
// development (Next.js hot-reload issue)
// ============================================

import { PrismaClient } from "@prisma/client";

// Declare global type for Prisma Client
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Create or reuse existing Prisma Client instance
export const prisma: PrismaClient = global.prisma ?? new PrismaClient();

// Store the instance globally in development to prevent
// multiple instances during Next.js hot reloading
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

// Optional: Log queries in development
// const prisma = globalForPrisma.prisma ?? new PrismaClient({
//   log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
// });