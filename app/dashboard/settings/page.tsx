"use client";

import React, { useState } from "react";
import {
  Settings,
  User,
  Lock,
  CreditCard,
  Bell,
  Save,
  Eye,
  EyeOff,
  Shield,
  Mail,
  Building2,
} from "lucide-react";

// ── SEO ─────────────────────────────────────────────────────────────

export const metadata = {
  title: "الإعدادات | لوحة التحكم",
  description: "إدارة إعدادات حسابك وطريقة الدفع",
};

// ── Types ───────────────────────────────────────────────────────────

interface NotificationPref {
  emailOnSale: boolean;
  emailOnPayout: boolean;
  emailWeeklyReport: boolean;
  emailMarketing: boolean;
}

// ── Section Wrapper ─────────────────────────────────────────────────

function Section({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-5 flex items-start gap-3">
        <span className="rounded-lg bg-emerald-50 p-2 dark:bg-emerald-900/20">
          {icon}
        </span>
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}

// ── Toggle Switch ───────────────────────────────────────────────────

function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
        enabled
          ? "bg-emerald-600"
          : "bg-gray-300 dark:bg-gray-600"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

// ── Input Field ─────────────────────────────────────────────────────

function InputField({
  label,
  icon,
  type = "text",
  value,
  onChange,
  placeholder,
  readOnly = false,
}: {
  label: string;
  icon: React.ReactNode;
  type?: string;
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
        {icon}
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white ${
          readOnly
            ? "cursor-not-allowed bg-gray-100 dark:bg-gray-600/50"
            : ""
        }`}
      />
    </div>
  );
}

// ── Password Field ──────────────────────────────────────────────────

function PasswordField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
        <Lock className="h-4 w-4 text-gray-400" />
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pl-10 text-sm text-gray-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────

export default function SettingsPage() {
  // ── State ─────────────────────────────────────────────────────

  const [profile] = useState({
    name: "محمد أحمد",
    email: "mohammed@example.com",
    role: "مسوق بالعمولة",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [payout, setPayout] = useState({
    method: "bank",
    bankName: "البنك الأهلي السعودي",
    accountNumber: "SA03 8000 0000 6080 1016 7519",
    accountHolder: "محمد أحمد",
    paypalEmail: "",
  });

  const [notifications, setNotifications] = useState<NotificationPref>({
    emailOnSale: true,
    emailOnPayout: true,
    emailWeeklyReport: true,
    emailMarketing: false,
  });

  const [saved, setSaved] = useState(false);

  // ── Handlers ──────────────────────────────────────────────────

  const toggleNotification = (key: keyof NotificationPref) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      showToast("كلمة المرور الجديدة غير متطابقة!");
      return;
    }
    if (passwords.new.length < 6) {
      showToast("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }
    showToast("تم تحديث كلمة المرور بنجاح!");
    setPasswords({ current: "", new: "", confirm: "" });
  };

  const handlePayoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("تم حفظ معلومات الدفع بنجاح!");
  };

  const showToast = (message: string) => {
    setSaved(true);
    // In real app, use a toast library
    setTimeout(() => setSaved(false), 3000);
  };

  // ── Render ────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900" dir="rtl">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="flex items-center gap-2.5 text-2xl font-bold text-gray-900 dark:text-white">
            <Settings className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
            الإعدادات
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            إدارة إعدادات حسابك وطريقة الدفع والإشعارات
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Info */}
          <Section
            icon={<User className="h-5 w-5 text-emerald-600" />}
            title="معلومات الحساب"
            description="عرض بيانات حسابك الأساسية"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InputField
                label="الاسم"
                icon={<User className="h-4 w-4 text-gray-400" />}
                value={profile.name}
                readOnly
              />
              <InputField
                label="البريد الإلكتروني"
                icon={<Mail className="h-4 w-4 text-gray-400" />}
                value={profile.email}
                readOnly
              />
              <div className="sm:col-span-2">
                <InputField
                  label="الدور"
                  icon={<Shield className="h-4 w-4 text-gray-400" />}
                  value={profile.role}
                  readOnly
                />
              </div>
            </div>
          </Section>

          {/* Change Password */}
          <Section
            icon={<Lock className="h-5 w-5 text-emerald-600" />}
            title="تغيير كلمة المرور"
            description="قم بتحديث كلمة المرور الخاصة بك"
          >
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <PasswordField
                label="كلمة المرور الحالية"
                value={passwords.current}
                onChange={(v) => setPasswords((p) => ({ ...p, current: v }))}
                placeholder="••••••••"
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <PasswordField
                  label="كلمة المرور الجديدة"
                  value={passwords.new}
                  onChange={(v) => setPasswords((p) => ({ ...p, new: v }))}
                  placeholder="••••••••"
                />
                <PasswordField
                  label="تأكيد كلمة المرور"
                  value={passwords.confirm}
                  onChange={(v) => setPasswords((p) => ({ ...p, confirm: v }))}
                  placeholder="••••••••"
                />
              </div>
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <Save className="h-4 w-4" />
                  حفظ كلمة المرور
                </button>
              </div>
            </form>
          </Section>

          {/* Payout Info */}
          <Section
            icon={<CreditCard className="h-5 w-5 text-emerald-600" />}
            title="معلومات الدفع"
            description="إعدادات استلام عمولاتك"
          >
            <form onSubmit={handlePayoutSubmit} className="space-y-4">
              {/* Payment Method Tabs */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPayout((p) => ({ ...p, method: "bank" }))}
                  className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                    payout.method === "bank"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  <Building2 className="h-4 w-4" />
                  تحويل بنكي
                </button>
                <button
                  type="button"
                  onClick={() => setPayout((p) => ({ ...p, method: "paypal" }))}
                  className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                    payout.method === "paypal"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                  PayPal
                </button>
              </div>

              {/* Bank Fields */}
              {payout.method === "bank" && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <InputField
                    label="اسم البنك"
                    icon={<Building2 className="h-4 w-4 text-gray-400" />}
                    value={payout.bankName}
                    onChange={(v) => setPayout((p) => ({ ...p, bankName: v }))}
                    placeholder="اسم البنك"
                  />
                  <InputField
                    label="رقم الحساب / IBAN"
                    icon={<CreditCard className="h-4 w-4 text-gray-400" />}
                    value={payout.accountNumber}
                    onChange={(v) =>
                      setPayout((p) => ({ ...p, accountNumber: v }))
                    }
                    placeholder="SA00 0000 0000 0000 0000 0000"
                  />
                  <div className="sm:col-span-2">
                    <InputField
                      label="اسم صاحب الحساب"
                      icon={<User className="h-4 w-4 text-gray-400" />}
                      value={payout.accountHolder}
                      onChange={(v) =>
                        setPayout((p) => ({ ...p, accountHolder: v }))
                      }
                      placeholder="الاسم كما يظهر في البنك"
                    />
                  </div>
                </div>
              )}

              {/* PayPal Fields */}
              {payout.method === "paypal" && (
                <div>
                  <InputField
                    label="بريد PayPal"
                    icon={<Mail className="h-4 w-4 text-gray-400" />}
                    type="email"
                    value={payout.paypalEmail}
                    onChange={(v) =>
                      setPayout((p) => ({ ...p, paypalEmail: v }))
                    }
                    placeholder="your@email.com"
                  />
                </div>
              )}

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <Save className="h-4 w-4" />
                  حفظ معلومات الدفع
                </button>
              </div>
            </form>
          </Section>

          {/* Notification Preferences */}
          <Section
            icon={<Bell className="h-5 w-5 text-emerald-600" />}
            title="تفضيلات الإشعارات"
            description="تحكم في الإشعارات التي تريد تلقيها"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-gray-100 p-3.5 dark:border-gray-700">
                <div className="mr-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    إشعار عند كل عملية بيع
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    إرسال بريد إلكتروني فوراً عند تحقق عملية بيع
                  </p>
                </div>
                <Toggle
                  enabled={notifications.emailOnSale}
                  onChange={() => toggleNotification("emailOnSale")}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-gray-100 p-3.5 dark:border-gray-700">
                <div className="mr-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    إشعار عند الدفع
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    إرسال بريد عند تحويل العمولة لحسابك
                  </p>
                </div>
                <Toggle
                  enabled={notifications.emailOnPayout}
                  onChange={() => toggleNotification("emailOnPayout")}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-gray-100 p-3.5 dark:border-gray-700">
                <div className="mr-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    التقرير الأسبوعي
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    ملخص أسبوعي بأدائك والعمولات المكتسبة
                  </p>
                </div>
                <Toggle
                  enabled={notifications.emailWeeklyReport}
                  onChange={() => toggleNotification("emailWeeklyReport")}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-gray-100 p-3.5 dark:border-gray-700">
                <div className="mr-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    عروض وتحديثات تسويقية
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    نصائح وعروض حصرية للمسوقين
                  </p>
                </div>
                <Toggle
                  enabled={notifications.emailMarketing}
                  onChange={() => toggleNotification("emailMarketing")}
                />
              </div>
            </div>
          </Section>
        </div>

        {/* Save Confirmation (Toast) */}
        {saved && (
          <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white shadow-lg dark:bg-white dark:text-gray-900">
            تم الحفظ بنجاح!
          </div>
        )}
      </div>
    </div>
  );
}
