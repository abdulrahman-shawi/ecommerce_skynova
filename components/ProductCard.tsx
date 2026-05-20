"use client";

import Image from "next/image";

/**
 * Product Type Definition
 */
export interface Product {
  id: number;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  affiliateLink: string;
  badge?: string;
}

/**
 * ProductCard Component
 * Displays a single product with image, title, price, category badge,
 * and a CTA button linking to the affiliate URL.
 *
 * Props:
 *   product - Product object containing all product details
 */

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--card)",
      }}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Category Badge */}
        <span
          className="absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold"
          style={{
            backgroundColor: "var(--primary)",
            color: "var(--primary-foreground)",
          }}
        >
          {product.category}
        </span>

        {/* Discount Badge */}
        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
            خصم {discount}%
          </span>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/10" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Title */}
        <h3
          className="mb-2 text-base font-semibold leading-snug line-clamp-2"
          style={{ color: "var(--card-foreground)" }}
        >
          {product.title}
        </h3>

        {/* Price */}
        <div className="mb-4 flex items-center gap-2">
          <span
            className="text-lg font-bold"
            style={{ color: "var(--primary)" }}
          >
            {product.price.toLocaleString("ar-SA")} ر.س
          </span>
          {product.originalPrice && (
            <span
              className="text-sm line-through"
              style={{ color: "var(--muted-foreground)" }}
            >
              {product.originalPrice.toLocaleString("ar-SA")} ر.س
            </span>
          )}
        </div>

        {/* CTA Button */}
        <a
          href={product.affiliateLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:opacity-90 hover:shadow-lg active:scale-[0.98]"
          style={{ backgroundColor: "var(--accent)" }}
        >
          <span>شراء الآن</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="rtl-flip"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );
}
