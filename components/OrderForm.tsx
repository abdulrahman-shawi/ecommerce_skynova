"use client";

import { useState, useTransition } from "react";
import { createOrder } from "@/lib/actions";

/**
 * OrderForm Component — Updated for INTEGRATED Schema
 * Product.id = Int (number), createOrder auto-creates Customer
 */

interface OrderFormProps {
  productId: number;
  productPrice: number;
  productName: string;
}

export default function OrderForm({
  productId,
  productPrice,
  productName,
}: OrderFormProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [isPending, startTransition] = useTransition();

  const total = productPrice * quantity;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (!customerName.trim() || !customerEmail.trim()) {
      setMessage({ type: "error", text: "يرجى ملء جميع الحقول المطلوبة" });
      return;
    }

    startTransition(async () => {
      const result = await createOrder({
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        items: [
          {
            productId,
            quantity,
            price: productPrice,
          },
        ],
      });

      if (result.success) {
        setMessage({
          type: "success",
          text: `تم إرسال طلبك بنجاح! رقم الطلب: #${result.data?.id?.toString().padStart(4, "0") ?? ""}`,
        });
        setCustomerName("");
        setCustomerEmail("");
        setQuantity(1);
      } else {
        setMessage({
          type: "error",
          text: result.error || "حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.",
        });
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Customer Name */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="customerName"
          className="text-sm font-medium"
          style={{ color: "var(--foreground)" }}
        >
          الاسم الكامل <span className="text-red-500">*</span>
        </label>
        <input
          id="customerName"
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="أدخل اسمك الكامل"
          required
          className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:ring-2"
          style={{
            borderColor: "var(--input)",
            backgroundColor: "var(--background)",
            color: "var(--foreground)",
          }}
        />
      </div>

      {/* Customer Email */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="customerEmail"
          className="text-sm font-medium"
          style={{ color: "var(--foreground)" }}
        >
          البريد الإلكتروني <span className="text-red-500">*</span>
        </label>
        <input
          id="customerEmail"
          type="email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:ring-2"
          style={{
            borderColor: "var(--input)",
            backgroundColor: "var(--background)",
            color: "var(--foreground)",
          }}
        />
      </div>

      {/* Quantity Selector */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="quantity"
          className="text-sm font-medium"
          style={{ color: "var(--foreground)" }}
        >
          الكمية
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-10 w-10 items-center justify-center rounded-lg border text-lg font-bold transition-colors hover:bg-[var(--muted)]"
            style={{ borderColor: "var(--input)" }}
          >
            -
          </button>
          <span
            className="min-w-[2rem] text-center text-lg font-semibold"
            style={{ color: "var(--foreground)" }}
          >
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border text-lg font-bold transition-colors hover:bg-[var(--muted)]"
            style={{ borderColor: "var(--input)" }}
          >
            +
          </button>
        </div>
      </div>

      {/* Total */}
      <div
        className="flex items-center justify-between rounded-xl border p-4"
        style={{
          borderColor: "var(--input)",
          backgroundColor: "var(--card)",
        }}
      >
        <span className="text-sm font-medium" style={{ color: "var(--muted-foreground)" }}>
          الإجمالي:
        </span>
        <span className="text-xl font-bold" style={{ color: "var(--primary)" }}>
          {total.toLocaleString("ar-SA")} ر.س
        </span>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`rounded-xl px-4 py-3 text-sm font-medium ${
            message.type === "success"
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:opacity-90 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        style={{ backgroundColor: "var(--accent)" }}
      >
        {isPending ? (
          <>
            <svg
              className="h-5 w-5 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            جاري إرسال الطلب...
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            إتمام الطلب — {productName}
          </>
        )}
      </button>
    </form>
  );
}
