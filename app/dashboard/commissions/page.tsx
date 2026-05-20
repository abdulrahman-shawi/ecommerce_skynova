"use client";

import React, { useState, useMemo } from "react";
import {
  Coins,
  Clock,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Calendar,
  Filter,
} from "lucide-react";
import CommissionCalculator from "@/components/CommissionCalculator";

// ── SEO ─────────────────────────────────────────────────────────────

export const metadata = {
  title: "عمولاتي | لوحة التحكم",
  description: "تتبع عمولاتك والأرباح المتراكمة",
};

// ── Types ───────────────────────────────────────────────────────────

interface Commission {
  id: string;
  productName: string;
  orderId: string;
  amount: number;
  status: "pending" | "paid" | "cancelled";
  date: string;
  customerName: string;
}

type DateFilter = "week" | "month" | "all";

// ── Mock Data ───────────────────────────────────────────────────────

const mockCommissions: Commission[] = [
  { id: "c1", productName: "سماعات لاسلكية فاخرة", orderId: "ORD-001", amount: 29.9, status: "paid", date: "2025-01-20", customerName: "أحمد محمد" },
  { id: "c2", productName: "ساعة ذكية رياضية", orderId: "ORD-002", amount: 49.9, status: "pending", date: "2025-01-22", customerName: "خالد العلي" },
  { id: "c3", productName: "حقيبة ظهر احترافية", orderId: "ORD-003", amount: 18.9, status: "paid", date: "2025-01-18", customerName: "سارة أحمد" },
  { id: "c4", productName: "ماوس ألعاب RGB", orderId: "ORD-004", amount: 12.9, status: "pending", date: "2025-01-25", customerName: "فهد سالم" },
  { id: "c5", productName: "كيبورد ميكانيكي", orderId: "ORD-005", amount: 34.9, status: "pending", date: "2025-01-26", customerName: "نورة عبدالله" },
  { id: "c6", productName: "سماعات لاسلكية فاخرة", orderId: "ORD-006", amount: 29.9, status: "paid", date: "2025-01-10", customerName: "محمد خالد" },
  { id: "c7", productName: "ساعة ذكية رياضية", orderId: "ORD-007", amount: 49.9, status: "paid", date: "2024-12-28", customerName: "ليلى حسن" },
  { id: "c8", productName: "ماوس ألعاب RGB", orderId: "ORD-008", amount: 12.9, status: "cancelled", date: "2024-12-20", customerName: "عمر فاروق" },
  { id: "c9", productName: "حقيبة ظهر احترافية", orderId: "ORD-009", amount: 18.9, status: "paid", date: "2025-01-15", customerName: "ريم سالم" },
  { id: "c10", productName: "سماعات لاسلكية فاخرة", orderId: "ORD-010", amount: 29.9, status: "pending", date: "2025-01-27", customerName: "ياسر محمد" },
];

// ── Helpers ─────────────────────────────────────────────────────────

const statusConfig = {
  paid: {
    label: "مدفوعة",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
  },
  pending: {
    label: "معلقة",
    icon: <Clock className="h-3.5 w-3.5" />,
    className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
  },
  cancelled: {
    label: "ملغاة",
    icon: <DollarSign className="h-3.5 w-3.5" />,
    className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
  },
};

function filterByDate(commissions: Commission[], filter: DateFilter): Commission[] {
  if (filter === "all") return commissions;

  const now = new Date();
  const cutoff = new Date();

  if (filter === "week") {
    cutoff.setDate(now.getDate() - 7);
  } else if (filter === "month") {
    cutoff.setMonth(now.getMonth() - 1);
  }

  return commissions.filter((c) => new Date(c.date) >= cutoff);
}

// ── Components ──────────────────────────────────────────────────────

function SummaryCard({
  icon,
  label,
  value,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border p-5 ${className}`}>
      <div className="mb-2 flex items-center gap-2">
        {icon}
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {label}
        </span>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────

export default function CommissionsPage() {
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");

  const filtered = useMemo(
    () => filterByDate(mockCommissions, dateFilter),
    [dateFilter]
  );

  const totalCommission = filtered
    .filter((c) => c.status !== "cancelled")
    .reduce((sum, c) => sum + c.amount, 0);
  const pendingAmount = filtered
    .filter((c) => c.status === "pending")
    .reduce((sum, c) => sum + c.amount, 0);
  const paidAmount = filtered
    .filter((c) => c.status === "paid")
    .reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900" dir="rtl">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="flex items-center gap-2.5 text-2xl font-bold text-gray-900 dark:text-white">
            <Coins className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
            عمولاتي
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            تتبع أرباحك وعمولاتك من المبيعات
          </p>
        </div>

        {/* Summary Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryCard
            icon={<TrendingUp className="h-5 w-5 text-emerald-600" />}
            label="إجمالي العمولات"
            value={`${totalCommission.toLocaleString("ar-SA")} ر.س`}
            className="border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/10"
          />
          <SummaryCard
            icon={<Clock className="h-5 w-5 text-amber-600" />}
            label="المعلقة"
            value={`${pendingAmount.toLocaleString("ar-SA")} ر.س`}
            className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/10"
          />
          <SummaryCard
            icon={<CheckCircle2 className="h-5 w-5 text-blue-600" />}
            label="المدفوعة"
            value={`${paidAmount.toLocaleString("ar-SA")} ر.س`}
            className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/10"
          />
        </div>

        {/* Main Content: Calculator + Table */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Calculator */}
          <div className="lg:col-span-1">
            <CommissionCalculator />
          </div>

          {/* Commissions Table */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
              {/* Table Header + Filter */}
              <div className="flex flex-col gap-3 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-700">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                  سجل العمولات
                </h2>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value as DateFilter)}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                  >
                    <option value="all">الكل</option>
                    <option value="week">الأسبوع الأخير</option>
                    <option value="month">الشهر الأخير</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-700/30">
                      <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">
                        المنتج
                      </th>
                      <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">
                        الطلب
                      </th>
                      <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">
                        العميل
                      </th>
                      <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">
                        المبلغ
                      </th>
                      <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">
                        الحالة
                      </th>
                      <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">
                        التاريخ
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                    {filtered.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-5 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                        >
                          لا توجد عمولات في الفترة المحددة
                        </td>
                      </tr>
                    ) : (
                      filtered.map((commission) => {
                        const status = statusConfig[commission.status];
                        return (
                          <tr
                            key={commission.id}
                            className="transition hover:bg-gray-50 dark:hover:bg-gray-700/20"
                          >
                            <td className="px-5 py-3.5 text-sm font-medium text-gray-900 dark:text-white">
                              {commission.productName}
                            </td>
                            <td className="px-5 py-3.5">
                              <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
                                {commission.orderId}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-sm text-gray-600 dark:text-gray-400">
                              {commission.customerName}
                            </td>
                            <td className="px-5 py-3.5 text-sm font-semibold text-gray-900 dark:text-white">
                              {commission.amount.toLocaleString("ar-SA")} ر.س
                            </td>
                            <td className="px-5 py-3.5">
                              <span
                                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${status.className}`}
                              >
                                {status.icon}
                                {status.label}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-xs text-gray-500 dark:text-gray-400">
                              {new Date(commission.date).toLocaleDateString("ar-SA", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="border-t border-gray-200 px-5 py-3 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  إجمالي {filtered.length} عمولة | عرض{" "}
                  {dateFilter === "week"
                    ? "الأسبوع الأخير"
                    : dateFilter === "month"
                    ? "الشهر الأخير"
                    : "جميع العمولات"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
