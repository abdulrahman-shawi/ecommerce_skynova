import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/**
 * Admin Dashboard Page
 * Protected route — ADMIN role only.
 * Displays stats cards, quick actions, and admin navigation links.
 *
 * Note: Route protection is handled by middleware.ts.
 * This page also server-verifies the role for safety.
 */

async function getAdminStats() {
  try {
    const [
      totalUsers,
      totalOrders,
      totalProducts,
      totalCommissions,
      pendingOrders,
      completedOrders,
      totalClicks,
      totalAffiliateLinks,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.order.count(),
      prisma.product.count(),
      prisma.commission.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.count({ where: { status: "COMPLETED" } }),
      prisma.affiliateLink.aggregate({ _sum: { clicks: true } }),
      prisma.affiliateLink.count(),
    ]);

    // Get total commissions amount
    const commissionsSum = await prisma.commission.aggregate({
      _sum: { amount: true },
    });

    return {
      totalUsers,
      totalOrders,
      totalProducts,
      totalCommissions,
      totalCommissionsAmount: Number(commissionsSum._sum.amount ?? 0),
      pendingOrders,
      completedOrders,
      totalClicks: Number(totalClicks._sum.clicks ?? 0),
      totalAffiliateLinks,
    };
  } catch {
    return null;
  }
}

export default async function AdminPage() {
  // Verify admin role server-side (belt and suspenders)
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const stats = await getAdminStats();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1
          className="text-3xl font-bold"
          style={{ color: "var(--foreground)" }}
        >
          لوحة تحكم المشرف
        </h1>
        <p className="mt-2" style={{ color: "var(--muted-foreground)" }}>
          نظرة عامة على إحصائيات المتجر والأداء
        </p>
      </div>

      {stats ? (
        <>
          {/* Stats Grid */}
          <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Users */}
            <StatCard
              title="إجمالي المستخدمين"
              value={stats.totalUsers}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              }
              color="var(--primary)"
              bgColor="var(--secondary)"
            />

            {/* Total Orders */}
            <StatCard
              title="إجمالي الطلبات"
              value={stats.totalOrders}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              }
              color="#7c3aed"
              bgColor="rgba(124,58,237,0.1)"
              subtitle={`${stats.pendingOrders} قيد الانتظار`}
            />

            {/* Total Products */}
            <StatCard
              title="إجمالي المنتجات"
              value={stats.totalProducts}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m7.5 4.27 9 5.15" />
                  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                  <path d="m3.3 7 8.7 5 8.7-5" />
                  <path d="M12 22V12" />
                </svg>
              }
              color="#059669"
              bgColor="rgba(5,150,105,0.1)"
            />

            {/* Total Commissions */}
            <StatCard
              title="إجمالي العمولات"
              value={`${stats.totalCommissionsAmount.toLocaleString("ar-SA")} ر.س`}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                  <path d="M12 18V6" />
                </svg>
              }
              color="#d97706"
              bgColor="rgba(217,119,6,0.1)"
              subtitle={`${stats.totalCommissions} عمولة`}
            />
          </div>

          {/* Additional Stats Row */}
          <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <MiniStatCard
              label="الطلبات المكتملة"
              value={stats.completedOrders}
            />
            <MiniStatCard
              label="النقرات على الروابط"
              value={stats.totalClicks.toLocaleString("ar-SA")}
            />
            <MiniStatCard
              label="روابط التسويق"
              value={stats.totalAffiliateLinks}
            />
          </div>
        </>
      ) : (
        /* Stats Error State */
        <div
          className="mb-10 rounded-xl border p-8 text-center"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--card)",
          }}
        >
          <p style={{ color: "var(--muted-foreground)" }}>
            حدث خطأ أثناء جلب الإحصائيات. يرجى المحاولة مرة أخرى.
          </p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mb-10">
        <div className="mb-4 flex items-center gap-3">
          <div
            className="h-6 w-1 rounded-full"
            style={{ backgroundColor: "var(--primary)" }}
          />
          <h2
            className="text-xl font-bold"
            style={{ color: "var(--foreground)" }}
          >
            إجراءات سريعة
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ActionButton
            label="إدارة المنتجات"
            description="إضافة، تعديل، حذف المنتجات"
            href="/admin/products"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m7.5 4.27 9 5.15" />
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                <path d="m3.3 7 8.7 5 8.7-5" />
                <path d="M12 22V12" />
              </svg>
            }
          />
          <ActionButton
            label="إدارة الطلبات"
            description="عرض وتحديث حالة الطلبات"
            href="/admin/orders"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            }
          />
          <ActionButton
            label="إدارة المستخدمين"
            description="عرض وإدارة حسابات المستخدمين"
            href="/admin/users"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            }
          />
          <ActionButton
            label="التقارير والعمولات"
            description="عرض تقارير الأداء والعمولات"
            href="/admin/reports"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 3v18h18" />
                <path d="m19 9-5 5-4-4-3 3" />
              </svg>
            }
          />
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div>
        <div className="mb-4 flex items-center gap-3">
          <div
            className="h-6 w-1 rounded-full"
            style={{ backgroundColor: "var(--primary)" }}
          />
          <h2
            className="text-xl font-bold"
            style={{ color: "var(--foreground)" }}
          >
            النشاط الأخير
          </h2>
        </div>

        <div
          className="rounded-xl border p-8 text-center"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--card)",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto mb-3"
            style={{ color: "var(--muted-foreground)" }}
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <p
            className="font-medium"
            style={{ color: "var(--muted-foreground)" }}
          >
            سيتم عرض النشاط الأخير هنا
          </p>
          <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
            قسم قيد التطوير — سيكون متاحاً قريباً
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Sub-components
// ============================================

function StatCard({
  title,
  value,
  icon,
  color,
  bgColor,
  subtitle,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  subtitle?: string;
}) {
  return (
    <div
      className="rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium" style={{ color: "var(--muted-foreground)" }}>
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold" style={{ color: "var(--foreground)" }}>
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-xs" style={{ color: "var(--muted-foreground)" }}>
              {subtitle}
            </p>
          )}
        </div>
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl"
          style={{ backgroundColor: bgColor, color }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function MiniStatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div
      className="rounded-xl border p-4 text-center"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
    >
      <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
        {value}
      </p>
      <p className="mt-1 text-xs" style={{ color: "var(--muted-foreground)" }}>
        {label}
      </p>
    </div>
  );
}

function ActionButton({
  label,
  description,
  href,
  icon,
}: {
  label: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
    >
      <div
        className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl transition-colors"
        style={{
          backgroundColor: "var(--secondary)",
          color: "var(--primary)",
        }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p
          className="text-sm font-semibold transition-colors group-hover:text-[var(--primary)]"
          style={{ color: "var(--foreground)" }}
        >
          {label}
        </p>
        <p className="mt-0.5 truncate text-xs" style={{ color: "var(--muted-foreground)" }}>
          {description}
        </p>
      </div>
    </Link>
  );
}
