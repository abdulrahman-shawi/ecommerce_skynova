import React from "react";
import { Metadata } from "next";
import {
  Link2,
  MousePointerClick,
  ShoppingCart,
  TrendingUp,
  Copy,
  Check,
  ExternalLink,
  BarChart3,
  QrCode,
} from "lucide-react";
import LinkGenerator from "@/components/LinkGenerator";
import { getAffiliateLinks } from "@/lib/actions";
import { auth } from "@/auth";

// ── SEO Metadata ────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "روابطي التسويقية | لوحة التحكم",
  description: "إدارة وإنشاء روابطك التسويقية ومراقبة أدائها",
};

// ── Types ───────────────────────────────────────────────────────────

interface AffiliateLink {
  id: string;
  productId: string;
  productName: string;
  uniqueCode: string;
  url: string;
  clicks: number;
  conversions: number;
  commission: number;
  createdAt: string;
}

// ── Mock Products (in real app, fetched from DB) ────────────────────

const mockProducts = [
  { id: "p1", name: "سماعات لاسلكية فاخرة", price: 299 },
  { id: "p2", name: "ساعة ذكية رياضية", price: 499 },
  { id: "p3", name: "حقيبة ظهر احترافية", price: 189 },
  { id: "p4", name: "ماوس ألعاب RGB", price: 129 },
  { id: "p5", name: "كيبورد ميكانيكي", price: 349 },
];

// ── Mock Data (fallback if DB is empty) ─────────────────────────────

const mockLinks: AffiliateLink[] = [
  {
    id: "1",
    productId: "p1",
    productName: "سماعات لاسلكية فاخرة",
    uniqueCode: "ABC123",
    url: "https://example.com/r/ABC123",
    clicks: 154,
    conversions: 12,
    commission: 358.8,
    createdAt: "2024-12-15",
  },
  {
    id: "2",
    productId: "p2",
    productName: "ساعة ذكية رياضية",
    uniqueCode: "DEF456",
    url: "https://example.com/r/DEF456",
    clicks: 89,
    conversions: 7,
    commission: 349.3,
    createdAt: "2024-12-20",
  },
  {
    id: "3",
    productId: "p3",
    productName: "حقيبة ظهر احترافية",
    uniqueCode: "GHI789",
    url: "https://example.com/r/GHI789",
    clicks: 45,
    conversions: 3,
    commission: 56.7,
    createdAt: "2025-01-05",
  },
];

// ── Copy Button (Client Component) ──────────────────────────────────

function CopyButton({ text }: { text: string }) {
  "use client";
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback silently
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:bg-gray-50 hover:text-emerald-600 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-emerald-400"
      title="نسخ الرابط"
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}

// ── Stat Card ───────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
        <span className={`rounded-lg p-1.5 ${color}`}>{icon}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}

// ── QR Code Display ─────────────────────────────────────────────────

function QrDisplay({ url, code }: { url: string; code: string }) {
  "use client";
  const [show, setShow] = React.useState(false);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}`;

  return (
    <div>
      <button
        onClick={() => setShow(!show)}
        className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:bg-gray-50 hover:text-emerald-600 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-emerald-400"
        title="رمز QR"
      >
        <QrCode className="h-4 w-4" />
      </button>
      {show && (
        <div className="absolute left-0 top-12 z-10 rounded-lg border border-gray-200 bg-white p-3 shadow-xl dark:border-gray-600 dark:bg-gray-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrUrl} alt="QR" className="h-32 w-32" />
          <a
            href={qrUrl}
            download={`qr-${code}.png`}
            className="mt-2 block text-center text-xs text-emerald-600 hover:underline dark:text-emerald-400"
          >
            تحميل
          </a>
        </div>
      )}
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────

export default async function LinksPage() {
  const session = await auth();
  const userId = session?.user?.id || "";

  // Attempt to fetch real links; fallback to mock
  let links: AffiliateLink[] = [];
  try {
    const result = await getAffiliateLinks(userId);
    if (result?.links && result.links.length > 0) {
      links = result.links.map((l: AffiliateLink) => ({
        ...l,
        productName: mockProducts.find((p) => p.id === l.productId)?.name || l.productId,
        url: l.url || `https://example.com/r/${l.uniqueCode}`,
      }));
    } else {
      links = mockLinks;
    }
  } catch {
    links = mockLinks;
  }

  // Summary stats
  const totalClicks = links.reduce((sum, l) => sum + l.clicks, 0);
  const totalConversions = links.reduce((sum, l) => sum + l.conversions, 0);
  const totalCommission = links.reduce((sum, l) => sum + l.commission, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900" dir="rtl">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2.5 text-2xl font-bold text-gray-900 dark:text-white">
              <Link2 className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
              روابطي التسويقية
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              إدارة روابطك ومراقبة أدائها
            </p>
          </div>
          <LinkGenerator userId={userId} products={mockProducts} />
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            icon={<MousePointerClick className="h-5 w-5 text-blue-600" />}
            label="إجمالي النقرات"
            value={totalClicks.toLocaleString("ar-SA")}
            color="bg-blue-50 dark:bg-blue-900/20"
          />
          <StatCard
            icon={<ShoppingCart className="h-5 w-5 text-emerald-600" />}
            label="إجمالي التحويلات"
            value={totalConversions.toLocaleString("ar-SA")}
            color="bg-emerald-50 dark:bg-emerald-900/20"
          />
          <StatCard
            icon={<TrendingUp className="h-5 w-5 text-amber-600" />}
            label="إجمالي العمولات"
            value={`${totalCommission.toLocaleString("ar-SA")} ر.س`}
            color="bg-amber-50 dark:bg-amber-900/20"
          />
        </div>

        {/* Links List */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          {/* Table Header */}
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-gray-400" />
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                قائمة الروابط
              </h2>
              <span className="mr-2 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                {links.length}
              </span>
            </div>
          </div>

          {/* Links */}
          {links.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Link2 className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                لا توجد روابط تسويقية بعد. قم بإنشاء رابط جديد!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {links.map((link) => (
                <div
                  key={link.id}
                  className="group px-6 py-4 transition hover:bg-gray-50 dark:hover:bg-gray-700/30"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {/* Product Info */}
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                        {link.productName}
                      </h3>
                      <div className="mt-1 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                        <span className="font-mono rounded bg-gray-100 px-1.5 py-0.5 dark:bg-gray-700">
                          {link.uniqueCode}
                        </span>
                        <span>{new Date(link.createdAt).toLocaleDateString("ar-SA")}</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-center">
                      <div>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {link.clicks}
                        </p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">
                          نقرات
                        </p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                          {link.conversions}
                        </p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">
                          تحويلات
                        </p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                          {link.commission.toLocaleString("ar-SA")}
                        </p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">
                          ر.س
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="relative flex items-center gap-1.5">
                      <CopyButton text={link.url} />
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:bg-gray-50 hover:text-emerald-600 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-emerald-400"
                        title="فتح الرابط"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                      <QrDisplay url={link.url} code={link.uniqueCode} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
