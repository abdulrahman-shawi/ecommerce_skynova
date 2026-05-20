import { redirect } from "next/navigation";
import { Metadata } from "next";

// Server actions imports — uncomment when available
// import { getDashboardStats, getAffiliateLinks, getCommissions } from "@/lib/actions";
// import { getSession } from "@/lib/auth-actions";

// ─── Components ──────────────────────────────────────────
import StatCard from "@/components/StatCard";
import EarningsChart from "@/components/EarningsChart";
import ClicksChart from "@/components/ClicksChart";
import CommissionsTable from "@/components/CommissionsTable";
import AffiliateLinksList from "@/components/AffiliateLinksList";

// ─── Icons ───────────────────────────────────────────────
import {
  MousePointerClick,
  ShoppingCart,
  Wallet,
  TrendingUp,
  Zap,
} from "lucide-react";

// ─── SEO Metadata ────────────────────────────────────────
export const metadata: Metadata = {
  title: "لوحة التحكم | التسويق بالعمولة",
  description: "لوحة تحكم المسوق التابع – إحصائيات، أرباح، وروابطك التسويقية",
};

// ─── Types ───────────────────────────────────────────────
interface DashboardStats {
  totalClicks: number;
  totalConversions: number;
  totalEarnings: number;
  conversionRate: number;
}

// ─── Mock Stats (replace with Server Action) ─────────────
const MOCK_STATS: DashboardStats = {
  totalClicks: 1543,
  totalConversions: 128,
  totalEarnings: 8750,
  conversionRate: 8.3,
};

// ─── Page Component ──────────────────────────────────────
export default async function DashboardPage() {
  // ═══════════════════════════════════════════════════════
  // Route Protection — uncomment when auth is wired up
  // ═══════════════════════════════════════════════════════
  // const session = await getSession();
  // if (!session) redirect("/login");
  // const user = session.user;
  // if (user.role !== "AFFILIATE" && user.role !== "ADMIN") {
  //   redirect("/");
  // }
  // const stats = await getDashboardStats(user.id);
  // const links = await getAffiliateLinks(user.id);
  // const commissions = await getCommissions(user.id);

  // Use mock stats for demo
  const stats = MOCK_STATS;

  return (
    <div className="space-y-8">
      {/* ── Page Header ─────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            نظرة عامة
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            ملخص أدائك كمسوق تابع — آخر تحديث: اليوم
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 dark:bg-emerald-900/20">
          <Zap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
            أداء ممتاز
          </span>
        </div>
      </div>

      {/* ── Stats Cards ─────────────────────────────────── */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="إجمالي النقرات"
          value={stats.totalClicks.toLocaleString("ar-SA")}
          icon={<MousePointerClick className="h-6 w-6" />}
          change={12.5}
        />
        <StatCard
          title="إجمالي التحويلات"
          value={stats.totalConversions.toLocaleString("ar-SA")}
          icon={<ShoppingCart className="h-6 w-6" />}
          change={8.2}
        />
        <StatCard
          title="إجمالي الأرباح"
          value={stats.totalEarnings.toLocaleString("ar-SA")}
          icon={<Wallet className="h-6 w-6" />}
          change={15.3}
          suffix="ر.س"
        />
        <StatCard
          title="معدل التحويل"
          value={stats.conversionRate}
          icon={<TrendingUp className="h-6 w-6" />}
          change={2.1}
          suffix="%"
        />
      </section>

      {/* ── Charts Row ──────────────────────────────────── */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <EarningsChart />
        <ClicksChart />
      </section>

      {/* ── Commissions Table ───────────────────────────── */}
      <section>
        <CommissionsTable />
      </section>

      {/* ── Affiliate Links ─────────────────────────────── */}
      <section>
        <AffiliateLinksList />
      </section>

      {/* ── Quick Links Section ─────────────────────────── */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">
          روابط سريعة
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "تصفح المنتجات", href: "/products", icon: "🛍️" },
            { label: "الطلبات", href: "/dashboard/orders", icon: "📦" },
            { label: "التقارير", href: "/dashboard/reports", icon: "📊" },
            { label: "المساعدة", href: "/help", icon: "❓" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50/50 dark:border-slate-600 dark:hover:border-emerald-700 dark:hover:bg-emerald-900/20"
            >
              <span className="text-xl">{link.icon}</span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {link.label}
              </span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
