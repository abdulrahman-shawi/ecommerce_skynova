// ============================================
// Prisma Client Singleton
// ============================================
// Prevents multiple Prisma Client instances in
// development (Next.js hot-reload issue)
// ============================================

import { PrismaClient } from "@prisma/client";

// Global variable to hold Prisma Client across hot reloads
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create or reuse existing Prisma Client instance
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// Store the instance globally in development to prevent
// multiple instances during Next.js hot reloading
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Optional: Log queries in development
// const prisma = globalForPrisma.prisma ?? new PrismaClient({
//   log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
// });