"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ─── Types ───────────────────────────────────────────────
export interface EarningsDataPoint {
  month: string; // e.g. "يناير"
  earnings: number;
}

interface EarningsChartProps {
  data?: EarningsDataPoint[];
}

// ─── Mock Data (fallback) ────────────────────────────────
const DEFAULT_DATA: EarningsDataPoint[] = [
  { month: "يناير", earnings: 1200 },
  { month: "فبراير", earnings: 1850 },
  { month: "مارس", earnings: 1500 },
  { month: "أبريل", earnings: 2400 },
  { month: "مايو", earnings: 2100 },
  { month: "يونيو", earnings: 3200 },
  { month: "يوليو", earnings: 2800 },
  { month: "أغسطس", earnings: 3600 },
  { month: "سبتمبر", earnings: 3100 },
  { month: "أكتوبر", earnings: 4200 },
  { month: "نوفمبر", earnings: 3900 },
  { month: "ديسمبر", earnings: 5100 },
];

// ─── Custom Tooltip ──────────────────────────────────────
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg dark:border-slate-600 dark:bg-slate-800">
        <p className="mb-1 text-sm font-medium text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
          {payload[0].value.toLocaleString("ar-SA")} ر.س
        </p>
      </div>
    );
  }
  return null;
}

// ─── Component ───────────────────────────────────────────
export default function EarningsChart({ data }: EarningsChartProps) {
  const chartData = data && data.length > 0 ? data : DEFAULT_DATA;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            الأرباح الشهرية
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            نظرة عامة على أرباحك على مدار العام
          </p>
        </div>
        <div className="rounded-lg bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
          ر.س
        </div>
      </div>

      {/* Chart */}
      <div className="h-[300px] w-full" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e2e8f0"
              className="dark:stroke-slate-700"
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: "#64748b" }}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value: number) =>
                value.toLocaleString("ar-SA")
              }
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="earnings"
              stroke="#10b981"
              strokeWidth={3}
              dot={{
                r: 4,
                fill: "#10b981",
                stroke: "#fff",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 6,
                fill: "#10b981",
                stroke: "#fff",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
