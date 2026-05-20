"use client";

import React, { useState } from "react";
import {
  Share2,
  Link as LinkIcon,
  Check,
  Twitter,
  Facebook,
  MessageCircle,
  Send,
} from "lucide-react";

// ── Types ───────────────────────────────────────────────────────────

interface ShareButtonsProps {
  url: string;
  title?: string;
  description?: string;
  compact?: boolean;
}

// ── Platform Configurations ─────────────────────────────────────────

interface SharePlatform {
  name: string;
  icon: React.ReactNode;
  color: string;
  hoverColor: string;
  buildUrl: (url: string, title: string, description: string) => string;
}

const platforms: SharePlatform[] = [
  {
    name: "واتساب",
    icon: <MessageCircle className="h-4 w-4" />,
    color: "bg-green-500",
    hoverColor: "hover:bg-green-600",
    buildUrl: (url, title) =>
      `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`,
  },
  {
    name: "تلغرام",
    icon: <Send className="h-4 w-4" />,
    color: "bg-sky-500",
    hoverColor: "hover:bg-sky-600",
    buildUrl: (url, title) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    name: "تويتر",
    icon: <Twitter className="h-4 w-4" />,
    color: "bg-gray-900",
    hoverColor: "hover:bg-gray-800",
    buildUrl: (url, title) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    name: "فيسبوك",
    icon: <Facebook className="h-4 w-4" />,
    color: "bg-blue-600",
    hoverColor: "hover:bg-blue-700",
    buildUrl: (url) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
];

// ── Component ───────────────────────────────────────────────────────

export default function ShareButtons({
  url,
  title = "",
  description = "",
  compact = false,
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // ── Handlers ──────────────────────────────────────────────────

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = (platform: SharePlatform) => {
    const shareUrl = platform.buildUrl(url, title, description);
    window.open(shareUrl, "_blank", "width=600,height=400,noopener,noreferrer");
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: description, url });
      } catch {
        // User cancelled
      }
    } else {
      setShowMenu((prev) => !prev);
    }
  };

  // ── Render ────────────────────────────────────────────────────

  if (compact) {
    return (
      <div className="relative" dir="rtl">
        <div className="flex items-center gap-1.5">
          {/* Copy Link */}
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <LinkIcon className="h-3.5 w-3.5" />
            )}
            {copied ? "تم النسخ" : "نسخ"}
          </button>

          {/* Share Toggle */}
          <button
            onClick={handleNativeShare}
            className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <Share2 className="h-3.5 w-3.5" />
            مشاركة
          </button>
        </div>

        {/* Dropdown Menu */}
        {showMenu && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
            <div className="absolute left-0 top-full z-20 mt-1.5 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
              {platforms.map((platform) => (
                <button
                  key={platform.name}
                  onClick={() => {
                    handleShare(platform);
                    setShowMenu(false);
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <span className={`rounded-md p-1 text-white ${platform.color}`}>
                    {platform.icon}
                  </span>
                  {platform.name}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  // Full Mode
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800" dir="rtl">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <Share2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          مشاركة الرابط
        </h3>
      </div>

      {/* URL Display + Copy */}
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          readOnly
          value={url}
          className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 direction-ltr ltr text-left dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          {copied ? (
            <Check className="h-4 w-4 text-emerald-500" />
          ) : (
            <LinkIcon className="h-4 w-4" />
          )}
          {copied ? "تم" : "نسخ"}
        </button>
      </div>

      {/* Social Buttons */}
      <div className="flex flex-wrap gap-2">
        {platforms.map((platform) => (
          <button
            key={platform.name}
            onClick={() => handleShare(platform)}
            className={`inline-flex items-center gap-1.5 rounded-lg ${platform.color} px-3.5 py-2 text-sm font-medium text-white shadow-sm transition ${platform.hoverColor} focus:outline-none focus:ring-2 focus:ring-offset-1`}
            title={`مشاركة على ${platform.name}`}
          >
            {platform.icon}
            {platform.name}
          </button>
        ))}

        {/* Native Share */}
        {typeof navigator !== "undefined" && navigator.share && (
          <button
            onClick={handleNativeShare}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <Share2 className="h-4 w-4" />
            المزيد
          </button>
        )}
      </div>
    </div>
  );
}
