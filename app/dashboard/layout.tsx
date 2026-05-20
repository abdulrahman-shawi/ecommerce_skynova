"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Link2,
  Receipt,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronLeft,
  User,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────
interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

// ─── Navigation Items ────────────────────────────────────
const NAV_ITEMS: NavItem[] = [
  {
    label: "إحصائيات",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: "روابطي",
    href: "/dashboard/links",
    icon: <Link2 className="h-5 w-5" />,
  },
  {
    label: "عمولاتي",
    href: "/dashboard/commissions",
    icon: <Receipt className="h-5 w-5" />,
  },
  {
    label: "الإعدادات",
    href: "/dashboard/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

// ─── Component ───────────────────────────────────────────
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900" dir="rtl">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ───────────────────────────────────────── */}
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-72 transform border-l border-slate-200 bg-white transition-transform duration-300 dark:border-slate-700 dark:bg-slate-800 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Logo + Close */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-6 dark:border-slate-700">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-slate-100"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <span>لوحة التحكم</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden dark:text-slate-400 dark:hover:bg-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="mt-6 px-4">
          <p className="mb-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            القائمة الرئيسية
          </p>
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" &&
                  pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700/50 dark:hover:text-slate-200"
                    }`}
                  >
                    <span
                      className={`${
                        isActive
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300"
                      }`}
                    >
                      {item.icon}
                    </span>
                    {item.label}
                    {isActive && (
                      <ChevronLeft className="mr-auto h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom: Logout */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 p-4 dark:border-slate-700">
          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20">
            <LogOut className="h-5 w-5" />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* ── Main Content ──────────────────────────────────── */}
      <div className="lg:mr-72">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/80 lg:px-8">
          {/* Right: Menu + Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden dark:text-slate-400 dark:hover:bg-slate-700"
            >
              <Menu className="h-5 w-5" />
            </button>
            <nav className="hidden text-sm text-slate-500 dark:text-slate-400 sm:block">
              <span>الرئيسية</span>
              <ChevronLeft className="mx-2 inline h-3 w-3" />
              <span className="font-medium text-slate-900 dark:text-slate-200">
                لوحة التحكم
              </span>
            </nav>
          </div>

          {/* Left: User Info */}
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-200">
                محمد العلي
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                مسوق تابع
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              <User className="h-5 w-5" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
