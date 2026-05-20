"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ─── Types ───────────────────────────────────────────────
export interface ClicksDataPoint {
  day: string; // e.g. "السبت"
  clicks: number;
}

interface ClicksChartProps {
  data?: ClicksDataPoint[];
}

// ─── Mock Data (fallback) ────────────────────────────────
const DEFAULT_DATA: ClicksDataPoint[] = [
  { day: "السبت", clicks: 45 },
  { day: "الأحد", clicks: 62 },
  { day: "الإثنين", clicks: 38 },
  { day: "الثلاثاء", clicks: 75 },
  { day: "الأربعاء", clicks: 54 },
  { day: "الخميس", clicks: 89 },
  { day: "الجمعة", clicks: 67 },
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
        <p className="text-lg font-bold text-sky-600 dark:text-sky-400">
          {payload[0].value.toLocaleString("ar-SA")} نقرة
        </p>
      </div>
    );
  }
  return null;
}

// ─── Component ───────────────────────────────────────────
export default function ClicksChart({ data }: ClicksChartProps) {
  const chartData = data && data.length > 0 ? data : DEFAULT_DATA;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            النقرات اليومية
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            آخر 7 أيام – أداء الروابط
          </p>
        </div>
        <div className="rounded-lg bg-sky-50 px-3 py-1 text-sm font-semibold text-sky-700 dark:bg-sky-900/30 dark:text-sky-400">
          نقرة
        </div>
      </div>

      {/* Chart */}
      <div className="h-[300px] w-full" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e2e8f0"
              className="dark:stroke-slate-700"
              vertical={false}
            />
            <XAxis
              dataKey="day"
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
            <Bar
              dataKey="clicks"
              fill="#0ea5e9"
              radius={[8, 8, 0, 0]}
              maxBarSize={48}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
