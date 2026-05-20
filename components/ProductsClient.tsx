"use client";

import { useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard";

/**
 * Serialized product type (after converting Decimal → number)
 * Inline definition to avoid importing server-only Prisma in client code.
 */
interface SerializedProduct {
  id: string;
  title: string;
  description: string | null;
  price: number;
  image: string | null;
  stock: number;
  seoSlug: string;
  isActive: boolean;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

interface ProductsClientProps {
  products: SerializedProduct[];
  categories: { id: string; name: string; slug: string }[];
}

type SortOption = "newest" | "price-asc" | "price-desc";

/**
 * ProductsClient Component
 * Handles client-side filtering, search, sorting, and pagination.
 */
export default function ProductsClient({
  products,
  categories,
}: ProductsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [visibleCount, setVisibleCount] = useState(12);

  const allCategoryOption = { id: "all", name: "الكل", slug: "all" };
  const categoryOptions = [allCategoryOption, ...categories];

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (activeCategory !== "all") {
      result = result.filter((p) => p.category?.id === activeCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.name.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
    }

    return result;
  }, [products, activeCategory, searchQuery, sortBy]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  return (
    <div className="flex flex-col gap-8">
      {/* Search + Sort + Count Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 sm:max-w-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute right-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--muted-foreground)" }}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(12);
            }}
            placeholder="ابحث عن منتج..."
            className="w-full rounded-xl border py-2.5 pr-10 pl-4 text-sm outline-none transition-colors focus:ring-2"
            style={{
              borderColor: "var(--input)",
              backgroundColor: "var(--background)",
              color: "var(--foreground)",
            }}
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Product Count */}
          <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            {filteredProducts.length} منتج
          </span>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="rounded-xl border px-3 py-2.5 text-sm outline-none"
            style={{
              borderColor: "var(--input)",
              backgroundColor: "var(--background)",
              color: "var(--foreground)",
            }}
          >
            <option value="newest">الأحدث</option>
            <option value="price-asc">الأقل سعراً</option>
            <option value="price-desc">الأعلى سعراً</option>
          </select>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categoryOptions.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id);
              setVisibleCount(12);
            }}
            className="rounded-full px-5 py-2 text-sm font-medium transition-all duration-300"
            style={{
              backgroundColor:
                activeCategory === cat.id
                  ? "var(--primary)"
                  : "var(--secondary)",
              color:
                activeCategory === cat.id
                  ? "var(--primary-foreground)"
                  : "var(--secondary-foreground)",
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {visibleProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  id: parseInt(product.id.slice(0, 8), 16) || 0,
                  title: product.title,
                  price: product.price,
                  image: product.image || "https://placehold.co/600x600?text=منتج",
                  category: product.category?.name || "عام",
                  affiliateLink: `/products/${product.seoSlug}`,
                  badge:
                    product.stock <= 0
                      ? "نفذت الكمية"
                      : product.stock <= 5
                        ? "الكمية محدودة"
                        : undefined,
                }}
              />
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="flex justify-center">
              <button
                onClick={() => setVisibleCount((c) => c + 12)}
                className="rounded-xl px-8 py-3 text-sm font-semibold transition-all duration-300 hover:opacity-90 hover:shadow-lg active:scale-[0.98]"
                style={{
                  backgroundColor: "var(--primary)",
                  color: "var(--primary-foreground)",
                }}
              >
                تحميل المزيد ({filteredProducts.length - visibleCount} متبقي)
              </button>
            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center gap-4 py-20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: "var(--muted-foreground)" }}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <p
            className="text-lg font-medium"
            style={{ color: "var(--muted-foreground)" }}
          >
            لا توجد منتجات مطابقة لبحثك
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("all");
            }}
            className="text-sm font-medium transition-colors hover:underline"
            style={{ color: "var(--primary)" }}
          >
            عرض جميع المنتجات
          </button>
        </div>
      )}
    </div>
  );
}
