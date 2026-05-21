// ============================================
// Server Actions — E-commerce Affiliate Platform
// ============================================
// Updated for INTEGRATED Schema (CRM + E-commerce)
// Product.id = Int, Order.id = Int
// ============================================

"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "./prisma";
import { Prisma } from "@prisma/client";

// ============================================
// Types
// ============================================

export interface OrderData {
  orderNumber: string;
  customerId: string;
  customerName?: string;
  customerEmail?: string;
  totalAmount: number;
  finalAmount: number;
  warehouseId?: number;
  items: {
    productId: number;
    quantity: number;
    price: number;
    discount?: number;
    affiliateLinkId?: string;
  }[];
}

// ============================================
// Product Actions
// ============================================

/**
 * جلب جميع المنتجات النشطة مع الفئة
 */
export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: true,
        stocks: { include: { warehouse: true } },
        images: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: products };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { success: false, error: "فشل في جلب المنتجات" };
  }
}

/**
 * جلب منتج واحد حسب الـ slug
 */
export async function getProductBySlug(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { seoSlug: slug, isActive: true },
      include: {
        category: true,
        images: true,
        stocks: { include: { warehouse: true } },
      },
    });

    if (!product) {
      return { success: false, error: "المنتج غير موجود" };
    }

    return { success: true, data: product };
  } catch (error) {
    console.error("Error fetching product:", error);
    return { success: false, error: "فشل في جلب المنتج" };
  }
}

/**
 * جلب منتج حسب الـ ID
 */
export async function getProductById(id: number) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true, images: true },
    });

    if (!product) {
      return { success: false, error: "المنتج غير موجود" };
    }

    return { success: true, data: product };
  } catch (error) {
    console.error("Error fetching product by id:", error);
    return { success: false, error: "فشل في جلب المنتج" };
  }
}

// ============================================
// Category Actions
// ============================================

/**
 * جلب جميع الفئات
 */
export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { products: true } },
      },
    });
    return { success: true, data: categories };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { success: false, error: "فشل في جلب الفئات" };
  }
}

// ============================================
// Affiliate Link Actions
// ============================================

function generateUniqueCode(length: number = 8): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * إنشاء رابط تسويق بالعمولة
 */
export async function createAffiliateLink(userId: string, productId: number) {
  try {
    const existingLink = await prisma.affiliateLink.findFirst({
      where: { userId, productId },
    });

    if (existingLink) {
      return {
        success: false,
        error: "لديك رابط تسويقي لهذا المنتج مسبقاً",
        data: existingLink,
      };
    }

    let uniqueCode = generateUniqueCode();
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      const existing = await prisma.affiliateLink.findUnique({
        where: { uniqueCode },
      });
      if (!existing) break;
      uniqueCode = generateUniqueCode();
      attempts++;
    }

    const link = await prisma.affiliateLink.create({
      data: {
        userId,
        productId,
        uniqueCode,
      },
      include: { product: true },
    });

    revalidatePath("/dashboard/links");
    return { success: true, data: link };
  } catch (error) {
    console.error("Error creating affiliate link:", error);
    return { success: false, error: "فشل في إنشاء رابط التسويق" };
  }
}

/**
 * جلب روابط التسويق للمستخدم
 */
export async function getAffiliateLinks(userId: string) {
  try {
    const links = await prisma.affiliateLink.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            affiliatePrice: true,
            seoSlug: true,
            isActive: true,
            images: { take: 1, select: { url: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: links };
  } catch (error) {
    console.error("Error fetching affiliate links:", error);
    return { success: false, error: "فشل في جلب روابط التسويق" };
  }
}

/**
 * تتبع النقرة على رابط تسويقي
 */
export async function trackClick(uniqueCode: string) {
  try {
    const link = await prisma.affiliateLink.update({
      where: { uniqueCode },
      data: { clicks: { increment: 1 } },
      include: { product: true },
    });

    if (!link) {
      return { success: false, error: "رابط غير صالح" };
    }

    return { success: true, data: link };
  } catch (error) {
    console.error("Error tracking click:", error);
    return { success: false, error: "فشل في تتبع النقرة" };
  }
}

/**
 * جلب رابط تسويقي بالكود الفريد
 */
export async function getAffiliateLinkByCode(uniqueCode: string) {
  try {
    const link = await prisma.affiliateLink.findUnique({
      where: { uniqueCode },
      include: {
        product: { include: { category: true, images: true } },
        user: { select: { id: true, username: true } },
      },
    });

    if (!link) {
      return { success: false, error: "رابط غير صالح" };
    }

    return { success: true, data: link };
  } catch (error) {
    console.error("Error fetching affiliate link:", error);
    return { success: false, error: "فشل في جلب الرابط" };
  }
}

// ============================================
// Commission Actions
// ============================================

/**
 * جلب عمولات المسوق
 */
export async function getCommissions(userId: string) {
  try {
    const commissions = await prisma.commission.findMany({
      where: {
        affiliateLink: { userId },
      },
      include: {
        affiliateLink: {
          include: {
            product: { select: { name: true, images: { take: 1, select: { url: true } } } },
          },
        },
        order: { select: { status: true, createdAt: true, finalAmount: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: commissions };
  } catch (error) {
    console.error("Error fetching commissions:", error);
    return { success: false, error: "فشل في جلب العمولات" };
  }
}

/**
 * إنشاء عمولة جديدة
 */
export async function createCommission(
  affiliateLinkId: string,
  orderId: number,
  amount: number
) {
  try {
    const commission = await prisma.commission.create({
      data: { affiliateLinkId, orderId, amount },
    });

    await prisma.affiliateLink.update({
      where: { id: affiliateLinkId },
      data: { conversions: { increment: 1 } },
    });

    revalidatePath("/dashboard/commissions");
    return { success: true, data: commission };
  } catch (error) {
    console.error("Error creating commission:", error);
    return { success: false, error: "فشل في إنشاء العمولة" };
  }
}

// ============================================
// Order Actions
// ============================================

/**
 * إنشاء طلب جديد مع تتبع العمولة
 * Auto-creates Customer if not exists (for e-commerce orders)
 */
export async function createOrder(data: {
  customerName: string;
  customerEmail: string;
  items: { productId: number; quantity: number; price: number; affiliateLinkId?: string }[];
}) {
  try {
    const order = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Find or create customer by email
      let customer = await tx.customer.findUnique({
        where: { name: data.customerName }, // Use name as unique lookup (fallback)
      });

      if (!customer) {
        // Create a new customer for e-commerce orders
        customer = await tx.customer.create({
          data: {
            name: data.customerName,
            phone: [],
          },
        });
      }

      // 2. Generate order number (ORD-{timestamp}-{random})
      const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      // 3. Calculate totals
      const totalAmount = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const finalAmount = totalAmount;

      // 4. Create the order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerId: customer.id,
          totalAmount,
          finalAmount,
          status: "PENDING",
          paymentMethod: "ONLINE", // Required field, default for e-commerce orders
          items: {
            create: data.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              discount: 0,
              affiliateLinkId: item.affiliateLinkId ?? null,
            })),
          },
        },
        include: { items: true },
      });

      // 5. Create commissions for affiliate-linked items
      for (const item of data.items) {
        if (item.affiliateLinkId) {
          const affiliateLink = await tx.affiliateLink.findUnique({
            where: { id: item.affiliateLinkId },
          });

          if (affiliateLink) {
            const commissionAmount =
              (item.price * item.quantity * affiliateLink.commissionRate) / 100;

            await tx.commission.create({
              data: {
                affiliateLinkId: item.affiliateLinkId,
                orderId: newOrder.id,
                amount: commissionAmount,
              },
            });

            await tx.affiliateLink.update({
              where: { id: item.affiliateLinkId },
              data: { conversions: { increment: 1 } },
            });
          }
        }
      }

      return newOrder;
    });

    revalidatePath("/dashboard");
    return { success: true, data: order };
  } catch (error) {
    console.error("Error creating order:", error);
    return { success: false, error: "فشل في إنشاء الطلب" };
  }
}

/**
 * جلب طلبات المسوق
 */
export async function getAffiliateOrders(userId: string) {
  try {
    const orderItems = await prisma.orderItem.findMany({
      where: {
        affiliateLink: { userId },
      },
      include: {
        order: true,
        product: { select: { name: true, images: { take: 1, select: { url: true } } } },
        affiliateLink: { select: { uniqueCode: true, commissionRate: true } },
      },
      // NOTE: OrderItem has no createdAt column in schema, so no orderBy
    });

    return { success: true, data: orderItems };
  } catch (error) {
    console.error("Error fetching affiliate orders:", error);
    return { success: false, error: "فشل في جلب الطلبات" };
  }
}

// ============================================
// User Actions (E-commerce)
// ============================================

/**
 * جلب المستخدمين المسوقين بالعمولة
 */
export async function getAffiliates() {
  try {
    const affiliates = await prisma.user.findMany({
      where: { isAffiliate: true },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        isAffiliate: true,
        affiliateCode: true,
        createdAt: true,
        _count: { select: { affiliateLinks: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: affiliates };
  } catch (error) {
    console.error("Error fetching affiliates:", error);
    return { success: false, error: "فشل في جلب المسوقين" };
  }
}

// ============================================
// Dashboard Stats
// ============================================

export interface DashboardStats {
  totalClicks: number;
  totalConversions: number;
  totalEarnings: number;
  pendingCommissions: number;
  paidCommissions: number;
  linksCount: number;
  conversionRate: number;
}

/**
 * جلب إحصائيات لوحة التحكم
 */
export async function getDashboardStats(userId: string) {
  try {
    const linksAggregate = await prisma.affiliateLink.aggregate({
      where: { userId },
      _sum: { clicks: true, conversions: true },
      _count: { id: true },
    });

    const commissionAggregate = await prisma.commission.aggregate({
      where: { affiliateLink: { userId } },
      _sum: { amount: true },
    });

    const pendingCommissions = await prisma.commission.aggregate({
      where: { affiliateLink: { userId }, status: "PENDING" },
      _sum: { amount: true },
      _count: { id: true },
    });

    const paidCommissions = await prisma.commission.aggregate({
      where: { affiliateLink: { userId }, status: "PAID" },
      _sum: { amount: true },
      _count: { id: true },
    });

    const totalClicks = linksAggregate._sum.clicks ?? 0;
    const totalConversions = linksAggregate._sum.conversions ?? 0;
    const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

    const stats: DashboardStats = {
      totalClicks,
      totalConversions,
      totalEarnings: commissionAggregate._sum.amount ?? 0,
      pendingCommissions: pendingCommissions._sum.amount ?? 0,
      paidCommissions: paidCommissions._sum.amount ?? 0,
      linksCount: linksAggregate._count.id,
      conversionRate: Math.round(conversionRate * 100) / 100,
    };

    return { success: true, data: stats };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return { success: false, error: "فشل في جلب الإحصائيات" };
  }
}