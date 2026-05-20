"use client";

import React, { useState, useMemo } from "react";
import { Calculator, Share2, Copy, Check, TrendingUp, Wallet, Hash } from "lucide-react";

// ── Types ───────────────────────────────────────────────────────────

interface CommissionResult {
  totalRevenue: number;
  commissionAmount: number;
  perSaleCommission: number;
  totalProfit: number;
}

// ── Component ───────────────────────────────────────────────────────

export default function CommissionCalculator() {
  const [productPrice, setProductPrice] = useState<string>("150");
  const [commissionRate, setCommissionRate] = useState<string>("10");
  const [expectedSales, setExpectedSales] = useState<string>("20");
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  // ── Calculations ──────────────────────────────────────────────

  const result: CommissionResult | null = useMemo(() => {
    const price = parseFloat(productPrice);
    const rate = parseFloat(commissionRate);
    const sales = parseFloat(expectedSales);

    if (isNaN(price) || isNaN(rate) || isNaN(sales) || price <= 0 || rate < 0 || sales < 0) {
      return null;
    }

    const perSaleCommission = price * (rate / 100);
    const totalRevenue = price * sales;
    const commissionAmount = perSaleCommission * sales;
    const totalProfit = commissionAmount;

    return {
      totalRevenue,
      commissionAmount,
      perSaleCommission,
      totalProfit,
    };
  }, [productPrice, commissionRate, expectedSales]);

  // ── Handlers ──────────────────────────────────────────────────

  const handleCopyResult = async () => {
    if (!result) return;
    const text = `حاسبة العمولة:
سعر المنتج: ${parseFloat(productPrice).toLocaleString("ar-SA")} ر.س
نسبة العمولة: ${commissionRate}%
المبيعات المتوقعة: ${expectedSales}
العمولة لكل عملية بيع: ${result.perSaleCommission.toLocaleString("ar-SA")} ر.س
إجمالي الربح المتوقع: ${result.totalProfit.toLocaleString("ar-SA")} ر.س`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleShare = async () => {
    if (!result) return;
    const shareText = `أرباحي المتوقعة كمسوق بالعمولة: ${result.totalProfit.toLocaleString("ar-SA")} ر.س شهرياً!`;

    if (navigator.share) {
      try {
        await navigator.share({ title: "حاسبة العمولة", text: shareText });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch {
        // cancelled
      }
    } else {
      await handleCopyResult();
    }
  };

  // ── Input Helper ──────────────────────────────────────────────

  const NumberInput = ({
    label,
    icon,
    value,
    onChange,
    suffix,
    min = "0",
    step = "1",
  }: {
    label: string;
    icon: React.ReactNode;
    value: string;
    onChange: (v: string) => void;
    suffix?: string;
    min?: string;
    step?: string;
  }) => (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
        {icon}
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          min={min}
          step={step}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
        {suffix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );

  // ── Render ────────────────────────────────────────────────────

  return (
    <div
      className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
      dir="rtl"
    >
      {/* Header */}
      <div className="mb-6 flex items-center gap-2.5">
        <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
          <Calculator className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            حاسبة العمولة
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            احسب أرباحك المتوقعة كمسوق بالعمولة
          </p>
        </div>
      </div>

      {/* Inputs Grid */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <NumberInput
          label="سعر المنتج"
          icon={<Wallet className="h-4 w-4 text-emerald-500" />}
          value={productPrice}
          onChange={setProductPrice}
          suffix="ر.س"
        />
        <NumberInput
          label="نسبة العمولة"
          icon={<TrendingUp className="h-4 w-4 text-emerald-500" />}
          value={commissionRate}
          onChange={setCommissionRate}
          suffix="%"
          step="0.1"
        />
        <NumberInput
          label="المبيعات المتوقعة"
          icon={<Hash className="h-4 w-4 text-emerald-500" />}
          value={expectedSales}
          onChange={setExpectedSales}
          suffix="/شهر"
        />
      </div>

      {/* Result Card */}
      <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-5 text-white shadow-lg">
        {result ? (
          <div className="space-y-4">
            {/* Main Result */}
            <div className="text-center">
              <p className="mb-1 text-sm font-medium text-emerald-100">
                إجمالي الربح المتوقع
              </p>
              <p className="text-3xl font-bold">
                {result.totalProfit.toLocaleString("ar-SA")}{" "}
                <span className="text-lg font-normal text-emerald-100">ر.س</span>
              </p>
              <p className="mt-1 text-xs text-emerald-100">
                شهرياً
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-emerald-400/30" />

            {/* Breakdown */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-xs text-emerald-100">لكل عملية بيع</p>
                <p className="text-lg font-bold">
                  {result.perSaleCommission.toLocaleString("ar-SA", {
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className="text-[10px] text-emerald-200">ر.س</p>
              </div>
              <div>
                <p className="text-xs text-emerald-100">إجمالي المبيعات</p>
                <p className="text-lg font-bold">
                  {result.totalRevenue.toLocaleString("ar-SA")}
                </p>
                <p className="text-[10px] text-emerald-200">ر.س</p>
              </div>
              <div>
                <p className="text-xs text-emerald-100">نسبة العمولة</p>
                <p className="text-lg font-bold">{commissionRate}%</p>
                <p className="text-[10px] text-emerald-200">
                  من سعر المنتج
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-4 text-center">
            <p className="text-sm text-emerald-100">
              أدخل قيم صحيحة لحساب العمولة
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={handleCopyResult}
          disabled={!result}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          {copied ? (
            <Check className="h-4 w-4 text-emerald-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          {copied ? "تم النسخ" : "نسخ النتيجة"}
        </button>
        <button
          onClick={handleShare}
          disabled={!result}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          {shared ? (
            <Check className="h-4 w-4" />
          ) : (
            <Share2 className="h-4 w-4" />
          )}
          {shared ? "تم" : "مشاركة"}
        </button>
      </div>
    </div>
  );
}
