import "next-auth";
import { JWT } from "next-auth/jwt";

/**
 * NextAuth Type Extensions — Updated for INTEGRATED Schema
 * User model uses: username (not name), accountType (not role), isAffiliate
 */

declare module "next-auth" {
  interface User {
    /** username field from DB (not name) */
    name: string;
    /** accountType enum: ADMIN | MANAGER | STAFF */
    role: string;
    /** E-commerce affiliate flag */
    isAffiliate?: boolean;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      /** accountType from DB */
      role: string;
      /** E-commerce affiliate flag */
      isAffiliate: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    isAffiliate?: boolean;
  }
}
