"use server";

import bcrypt from "bcryptjs";
import { signIn, auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AuthError } from "next-auth";

/**
 * Auth Actions — Updated for INTEGRATED Schema
 * User model: username (not name), accountType (not role), isAffiliate
 */

export async function getSession() {
  return await auth();
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "يرجى إدخال البريد الإلكتروني وكلمة المرور" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" };
        default:
          return { error: "حدث خطأ أثناء تسجيل الدخول" };
      }
    }
    throw error;
  }
}

export async function register(formData: FormData) {
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const wantAffiliate = formData.get("wantAffiliate") === "true";

  if (!username || !email || !password) {
    return { error: "جميع الحقول مطلوبة" };
  }

  if (password.length < 6) {
    return { error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "البريد الإلكتروني مسجل مسبقاً" };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user with STAFF accountType and isAffiliate flag
  await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      accountType: "STAFF", // Default for e-commerce users
      isAffiliate: wantAffiliate, // true if user wants to be affiliate
    },
  });

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "تم إنشاء الحساب ولكن حدث خطأ أثناء تسجيل الدخول" };
    }
    throw error;
  }
}

export async function logout() {
  await signOut({ redirectTo: "/" });
}
