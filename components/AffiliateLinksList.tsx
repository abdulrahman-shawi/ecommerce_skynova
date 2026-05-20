"use client";

import { useState, useCallback } from "react";
import {
  Link2,
  Copy,
  Check,
  Share2,
  ExternalLink,
  MousePointerClick,
  ShoppingCart,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────
export interface AffiliateLink {
  id: string;
  productName: string;
  code: string;
  url: string;
  clicks: number;
  conversions: number;
}

interface AffiliateLinksListProps {
  links?: AffiliateLink[];
}

// ─── Mock Data (fallback) ────────────────────────────────
const DEFAULT_LINKS: AffiliateLink[] = [
  {
    id: "1",
    productName: "سماعات بلوتوث لاسلكية",
    code: "AFF-BT-2024",
    url: "https://store.example.com/p/bt-headphones?ref=AFF-BT-2024",
    clicks: 342,
    conversions: 28,
  },
  {
    id: "2",
    productName: "ساعة ذكية رياضية",
    code: "AFF-SW-2024",
    url: "https://store.example.com/p/smart-watch?ref=AFF-SW-2024",
    clicks: 256,
    conversions: 19,
  },
  {
    id: "3",
    productName: "حقيبة لابتوب جلدية",
    code: "AFF-LB-2024",
    url: "https://store.example.com/p/laptop-bag?ref=AFF-LB-2024",
    clicks: 189,
    conversions: 14,
  },
  {
    id: "4",
    productName: "ماوس ألعاب RGB",
    code: "AFF-GM-2024",
    url: "https://store.example.com/p/gaming-mouse?ref=AFF-GM-2024",
    clicks: 421,
    conversions: 35,
  },
  {
    id: "5",
    productName: "كيبورد ميكانيكي",
    code: "AFF-KB-2024",
    url: "https://store.example.com/p/mechanical-kb?ref=AFF-KB-2024",
    clicks: 298,
    conversions: 22,
  },
];

// ─── Copy Button ─────────────────────────────────────────
function CopyButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [url]);

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
        copied
          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
      }`}
      title="نسخ الرابط"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          تم النسخ
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          نسخ
        </>
      )}
    </button>
  );
}

// ─── Share Buttons ───────────────────────────────────────
function ShareButtons({ url, productName }: { url: string; productName: string }) {
  const text = encodeURIComponent(`تفقد هذا المنتج الرائع: ${productName}`);
  const encodedUrl = encodeURIComponent(url);

  const shareLinks = [
    {
      name: "تويتر",
      href: `https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`,
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      color:
        "hover:bg-slate-800 hover:text-white dark:hover:bg-white dark:hover:text-slate-900",
    },
    {
      name: "واتساب",
      href: `https://wa.me/?text=${text}%20${encodedUrl}`,
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
      color:
        "hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-500",
    },
    {
      name: "تيليجرام",
      href: `https://t.me/share/url?url=${encodedUrl}&text=${text}`,
      icon: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      ),
      color:
        "hover:bg-sky-500 hover:text-white dark:hover:bg-sky-400",
    },
  ];

  return (
    <div className="flex items-center gap-1">
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-all ${link.color} dark:text-slate-400`}
          title={link.name}
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
}

// ─── Component ───────────────────────────────────────────
export default function AffiliateLinksList({
  links,
}: AffiliateLinksListProps) {
  const data = links && links.length > 0 ? links : DEFAULT_LINKS;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      {/* Header */}
      <div className="border-b border-slate-200 p-6 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-900/30">
            <Link2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              روابطي التسويقية
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              روابط المنتجات الخاصة بك ومؤشرات الأداء
            </p>
          </div>
        </div>
      </div>

      {/* Links List */}
      <div className="divide-y divide-slate-100 dark:divide-slate-700">
        {data.map((link) => (
          <div
            key={link.id}
            className="group p-6 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/30"
          >
            {/* Top row: Product name + stats */}
            <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700">
                  <ExternalLink className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200">
                    {link.productName}
                  </h4>
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    {link.code}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <MousePointerClick className="h-4 w-4 text-sky-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {link.clicks.toLocaleString("ar-SA")}
                  </span>
                  <span className="text-xs text-slate-400">نقرة</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShoppingCart className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {link.conversions.toLocaleString("ar-SA")}
                  </span>
                  <span className="text-xs text-slate-400">تحويل</span>
                </div>
              </div>
            </div>

            {/* URL + Actions */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <code className="block truncate rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:bg-slate-700/50 dark:text-slate-400">
                  {link.url}
                </code>
              </div>
              <div className="flex items-center gap-2">
                <CopyButton url={link.url} />
                <ShareButtons
                  url={link.url}
                  productName={link.productName}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
