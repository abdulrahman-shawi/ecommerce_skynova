"use client";

import { useState } from "react";
import { Receipt, ChevronLeft, ChevronRight } from "lucide-react";

// ─── Types ───────────────────────────────────────────────
export type CommissionStatus = "PENDING" | "PAID" | "CANCELLED";

export interface Commission {
  id: string;
  productName: string;
  amount: number;
  status: CommissionStatus;
  date: string; // ISO date string
}

interface CommissionsTableProps {
  commissions?: Commission[];
}

// ─── Mock Data (fallback) ────────────────────────────────
const DEFAULT_COMMISSIONS: Commission[] = [
  {
    id: "1",
    productName: "سماعات بلوتوث لاسلكية",
    amount: 45.0,
    status: "PAID",
    date: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    productName: "ساعة ذكية رياضية",
    amount: 78.5,
    status: "PENDING",
    date: "2024-01-14T16:45:00Z",
  },
  {
    id: "3",
    productName: "حقيبة لابتوب جلدية",
    amount: 32.0,
    status: "PAID",
    date: "2024-01-12T09:15:00Z",
  },
  {
    id: "4",
    productName: "ماوس ألعاب RGB",
    amount: 28.75,
    status: "CANCELLED",
    date: "2024-01-10T14:20:00Z",
  },
  {
    id: "5",
    productName: "كيبورد ميكانيكي",
    amount: 55.0,
    status: "PENDING",
    date: "2024-01-09T11:00:00Z",
  },
  {
    id: "6",
    productName: "شاحن لاسلكي سريع",
    amount: 19.5,
    status: "PAID",
    date: "2024-01-08T08:30:00Z",
  },
  {
    id: "7",
    productName: "كاميرا ويب HD",
    amount: 42.0,
    status: "PAID",
    date: "2024-01-07T17:10:00Z",
  },
];

// ─── Status Badge ────────────────────────────────────────
function StatusBadge({ status }: { status: CommissionStatus }) {
  const config: Record<
    CommissionStatus,
    { label: string; classes: string }
  > = {
    PENDING: {
      label: "معلقة",
      classes:
        "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
    },
    PAID: {
      label: "مدفوعة",
      classes:
        "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
    },
    CANCELLED: {
      label: "ملغاة",
      classes:
        "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
    },
  };

  const { label, classes } = config[status];

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${classes}`}
    >
      {label}
    </span>
  );
}

// ─── Format Date ─────────────────────────────────────────
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ─── Component ───────────────────────────────────────────
export default function CommissionsTable({
  commissions,
}: CommissionsTableProps) {
  const data = commissions && commissions.length > 0 ? commissions : DEFAULT_COMMISSIONS;
  const [page, setPage] = useState(1);
  const perPage = 5;
  const totalPages = Math.ceil(data.length / perPage);
  const paginated = data.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      {/* Header */}
      <div className="border-b border-slate-200 p-6 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-900/30">
            <Receipt className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              أحدث العمولات
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              آخر عمولاتك من المنتجات
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      {data.length > 0 ? (
        <>
          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-right">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 dark:border-slate-700 dark:bg-slate-700/50">
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    المنتج
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    العمولة
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    الحالة
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    التاريخ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {paginated.map((commission) => (
                  <tr
                    key={commission.id}
                    className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/30"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-200">
                      {commission.productName}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {commission.amount.toLocaleString("ar-SA")} ر.س
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={commission.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                      {formatDate(commission.date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="divide-y divide-slate-100 md:hidden dark:divide-slate-700">
            {paginated.map((commission) => (
              <div
                key={commission.id}
                className="flex items-start justify-between p-4"
              >
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-200">
                    {commission.productName}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {formatDate(commission.date)}
                  </p>
                  <StatusBadge status={commission.status} />
                </div>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {commission.amount.toLocaleString("ar-SA")} ر.س
                </p>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 dark:border-slate-700">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                <ChevronRight className="h-4 w-4" />
                السابق
              </button>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                صفحة {page} من {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                التالي
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
            <Receipt className="h-8 w-8 text-slate-400" />
          </div>
          <h4 className="mb-1 text-base font-semibold text-slate-900 dark:text-slate-200">
            لا توجد عمولات بعد
          </h4>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            ستظهر عمولاتك هنا بمجرد بدء التحويلات
          </p>
        </div>
      )}
    </div>
  );
}
