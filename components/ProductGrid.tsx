"use client";

import { useState, useMemo } from "react";
import ProductCard, { Product } from "./ProductCard";

/**
 * ProductGrid Component
 * Displays a responsive grid of products with category filtering.
 *
 * Props:
 *   products - Array of Product objects to display
 */

interface ProductGridProps {
  products: Product[];
}

/**
 * Sample / Mock Product Data
 * Pre-defined fallback products used when no products are passed.
 */
export const sampleProducts: Product[] = [
  {
    id: 1,
    title: "سماعات لاسلكية فاخرة بتقنية إلغاء الضجيج",
    price: 499,
    originalPrice: 799,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
    category: "إلكترونيات",
    affiliateLink: "https://example.com/product/1",
    badge: "الأكثر مبيعاً",
  },
  {
    id: 2,
    title: "ساعة ذكية متطورة مع تتبع اللياقة البدنية",
    price: 349,
    originalPrice: 599,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
    category: "إلكترونيات",
    affiliateLink: "https://example.com/product/2",
  },
  {
    id: 3,
    title: "حقيبة يد جلدية فاخرة بتصميم كلاسيكي",
    price: 289,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=600&fit=crop",
    category: "أزياء",
    affiliateLink: "https://example.com/product/3",
    badge: "جديد",
  },
  {
    id: 4,
    title: "كريم العناية بالبشرة المضاد للتجاعيد",
    price: 129,
    originalPrice: 199,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop",
    category: "جمال",
    affiliateLink: "https://example.com/product/4",
  },
  {
    id: 5,
    title: "حذاء رياضي خفيف ومريح للجري",
    price: 379,
    originalPrice: 549,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop",
    category: "أزياء",
    affiliateLink: "https://example.com/product/5",
    badge: "عرض محدود",
  },
  {
    id: 6,
    title: "غلاية ماء كهربائية ستيل بتصميم عصري",
    price: 189,
    image: "https://images.unsplash.com/photo-1544263016-1c8e2a13c7db?w=600&h=600&fit=crop",
    category: "منزل",
    affiliateLink: "https://example.com/product/6",
  },
  {
    id: 7,
    title: "نظارة شمسية بولارايزد فاخرة",
    price: 259,
    originalPrice: 459,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop",
    category: "أزياء",
    affiliateLink: "https://example.com/product/7",
  },
  {
    id: 8,
    title: "مكبر صوت بلوتوث محمول بصوت جهوري",
    price: 219,
    originalPrice: 349,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop",
    category: "إلكترونيات",
    affiliateLink: "https://example.com/product/8",
    badge: "الأكثر مبيعاً",
  },
];

/**
 * Extract unique categories from product list
 */
function getCategories(products: Product[]): string[] {
  const cats = new Set(products.map((p) => p.category));
  return ["الكل", ...Array.from(cats)];
}

export default function ProductGrid({ products }: ProductGridProps) {
  const productList = products.length > 0 ? products : sampleProducts;
  const categories = useMemo(() => getCategories(productList), [productList]);

  const [activeCategory, setActiveCategory] = useState("الكل");

  const filteredProducts = useMemo(() => {
    if (activeCategory === "الكل") return productList;
    return productList.filter((p) => p.category === activeCategory);
  }, [activeCategory, productList]);

  return (
    <section id="products" className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl" style={{ color: "var(--foreground)" }}>
            منتجاتنا المميزة
          </h2>
          <p className="mt-2 text-base" style={{ color: "var(--muted-foreground)" }}>
            اكتشف أفضل العروض والمنتجات المختارة بعناية
          </p>
        </div>

        {/* Category Filter Buttons */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="rounded-full px-5 py-2 text-sm font-medium transition-all duration-300"
              style={{
                backgroundColor:
                  activeCategory === cat
                    ? "var(--primary)"
                    : "var(--secondary)",
                color:
                  activeCategory === cat
                    ? "var(--primary-foreground)"
                    : "var(--secondary-foreground)",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-lg" style={{ color: "var(--muted-foreground)" }}>
              لا توجد منتجات في هذا التصنيف حالياً.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
