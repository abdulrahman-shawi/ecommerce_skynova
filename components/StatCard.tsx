"use client";

import type { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

// ─── Types ───────────────────────────────────────────────
export interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: number; // percentage change
  suffix?: string; // e.g. "SAR", "%"
}

// ─── Component ───────────────────────────────────────────
export default function StatCard({
  title,
  value,
  icon,
  change,
  suffix,
}: StatCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800">
      {/* Top row: icon + change badge */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:group-hover:bg-emerald-900/50">
          {icon}
        </div>

        {change !== undefined && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-medium ${
              isPositive
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                : isNegative
                  ? "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  : "bg-slate-50 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
            }`}
          >
            {isPositive && <TrendingUp className="h-3.5 w-3.5" />}
            {isNegative && <TrendingDown className="h-3.5 w-3.5" />}
            {change > 0 ? "+" : ""}
            {change}%
          </span>
        )}
      </div>

      {/* Value */}
      <div className="mb-1 flex items-baseline gap-1">
        <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {value}
        </span>
        {suffix && (
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {suffix}
          </span>
        )}
      </div>

      {/* Title */}
      <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
    </div>
  );
}
