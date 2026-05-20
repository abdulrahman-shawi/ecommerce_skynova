"use client";

import React, { useState, useTransition } from "react";
import {
  Link,
  Copy,
  Check,
  QrCode,
  X,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { createAffiliateLink } from "@/lib/actions";

// ── Types ───────────────────────────────────────────────────────────

interface Product {
  id: string;
  name: string;
  price: number;
}

interface GeneratedLink {
  id: string;
  url: string;
  uniqueCode: string;
  productName: string;
}

interface LinkGeneratorProps {
  userId: string;
  products: Product[];
  onLinkCreated?: (link: GeneratedLink) => void;
}

// ── Component ───────────────────────────────────────────────────────

export default function LinkGenerator({
  userId,
  products,
  onLinkCreated,
}: LinkGeneratorProps) {
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<GeneratedLink | null>(null);
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  // ── Handlers ──────────────────────────────────────────────────

  const handleGenerate = () => {
    if (!selectedProductId) {
      showToast("يرجى اختيار منتج أولاً");
      return;
    }

    startTransition(async () => {
      try {
        const result = await createAffiliateLink(userId, selectedProductId);

        if (result?.success && result?.link) {
          const link: GeneratedLink = {
            id: result.link.id,
            url: result.link.url || `${window.location.origin}/r/${result.link.uniqueCode}`,
            uniqueCode: result.link.uniqueCode,
            productName: selectedProduct?.name || "",
          };

          setGeneratedLink(link);
          setShowQr(true);
          showToast("تم إنشاء الرابط بنجاح!");
          onLinkCreated?.(link);
        } else {
          showToast(result?.error || "فشل إنشاء الرابط");
        }
      } catch {
        showToast("حدث خطأ أثناء إنشاء الرابط");
      }
    });
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      showToast("تم نسخ الرابط!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast("فشل النسخ");
    }
  };

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleReset = () => {
    setGeneratedLink(null);
    setShowQr(false);
    setSelectedProductId("");
  };

  // ── QR Code URL (using QRServer API) ──────────────────────────

  const qrUrl = generatedLink
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
        generatedLink.url
      )}`
    : null;

  // ── Render ────────────────────────────────────────────────────

  return (
    <div className="relative" dir="rtl">
      {/* Trigger Button */}
      <button
        onClick={() => {
          setIsOpen(true);
          handleReset();
        }}
        className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      >
        <Link className="h-4 w-4" />
        إنشاء رابط تسويقي
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Content */}
          <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-800">
            {/* Close */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute left-4 top-4 rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                إنشاء رابط تسويقي جديد
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                اختر المنتج لإنشاء رابط التسويق الخاص بك
              </p>
            </div>

            {/* Product Selector */}
            {!generatedLink && (
              <div className="space-y-4">
                <div className="relative">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    اختر المنتج
                  </label>
                  <div className="relative">
                    <select
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3 pr-10 text-sm text-gray-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">-- اختر منتجاً --</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} - {product.price.toLocaleString("ar-SA")} ر.س
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                {/* Selected product info */}
                {selectedProduct && (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-900/20">
                    <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                      {selectedProduct.name}
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400">
                      السعر: {selectedProduct.price.toLocaleString("ar-SA")} ر.س
                    </p>
                  </div>
                )}

                {/* Generate Button */}
                <button
                  onClick={handleGenerate}
                  disabled={!selectedProductId || isPending}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Link className="h-4 w-4" />
                  )}
                  {isPending ? "جاري الإنشاء..." : "إنشاء الرابط"}
                </button>
              </div>
            )}

            {/* Generated Link Result */}
            {generatedLink && (
              <div className="space-y-4">
                {/* Success Message */}
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-center dark:border-emerald-800 dark:bg-emerald-900/20">
                  <Check className="mx-auto h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  <p className="mt-1 text-sm font-medium text-emerald-800 dark:text-emerald-300">
                    تم إنشاء الرابط بنجاح!
                  </p>
                </div>

                {/* Link Display */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    رابط التسويق
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={generatedLink.url}
                      className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 direction-ltr ltr text-left dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                    <button
                      onClick={() => handleCopy(generatedLink.url)}
                      className="rounded-lg border border-gray-300 p-2.5 text-gray-600 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                      title="نسخ الرابط"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Unique Code */}
                <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2 dark:bg-gray-700/50">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    الكود التعريفي
                  </span>
                  <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                    {generatedLink.uniqueCode}
                  </span>
                </div>

                {/* QR Code */}
                {showQr && qrUrl && (
                  <div className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
                    <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                      <QrCode className="h-4 w-4" />
                      <span>رمز QR</span>
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={qrUrl}
                      alt="QR Code"
                      className="h-40 w-40 rounded-lg"
                    />
                    <a
                      href={qrUrl}
                      download={`qr-${generatedLink.uniqueCode}.png`}
                      className="text-xs text-emerald-600 hover:underline dark:text-emerald-400"
                    >
                      تحميل رمز QR
                    </a>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={handleReset}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    إنشاء رابط جديد
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    تم
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white shadow-lg animate-in fade-in slide-in-from-bottom-2 dark:bg-white dark:text-gray-900">
          {toast}
        </div>
      )}
    </div>
  );
}
