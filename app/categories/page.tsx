import { Metadata } from "next";
import Link from "next/link";
import { getCategories } from "@/lib/actions";

/**
 * Categories Listing Page
 * Displays a grid of category cards with product counts.
 * Server Component — fetches data directly.
 */

export const metadata: Metadata = {
  title: "الفئات | متجر التسويق بالعمولة",
  description:
    "تصفح منتجاتنا حسب الفئة. اكتشف مجموعات متنوعة من المنتجات بأفضل الأسعار.",
  openGraph: {
    title: "الفئات | متجر التسويق بالعمولة",
    description: "تصفح منتجاتنا حسب الفئة.",
    type: "website",
    locale: "ar_SA",
  },
  twitter: {
    card: "summary_large_image",
    title: "الفئات | متجر التسويق بالعمولة",
    description: "تصفح منتجاتنا حسب الفئة.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * Category icons mapping
 */
const categoryIcons: Record<string, JSX.Element> = {
  default: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
    </svg>
  ),
};

/**
 * Get icon for category based on its slug/name
 */
function getCategoryIcon(name: string): JSX.Element {
  const icons: Record<string, JSX.Element> = {
    إلكترونيات: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="18" height="12" x="3" y="4" rx="2" />
        <line x1="2" x2="22" y1="20" y2="20" />
      </svg>
    ),
    أزياء: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.38 3.4a1.6 1.6 0 0 0-2.26 0l-1.93 1.93 3.74 3.74 1.93-1.93a1.6 1.6 0 0 0 0-2.26l-1.48-1.48Z" />
        <path d="m14.5 5.5-9.08 9.08a2.41 2.41 0 0 0-.68 1.34l-.87 5.24 5.24-.87a2.41 2.41 0 0 0 1.34-.68l9.08-9.08-4.03-4.03Z" />
      </svg>
    ),
    جمال: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
        <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
        <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
      </svg>
    ),
    منزل: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    رياضة: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="m4.93 4.93 4.24 4.24" />
        <path d="m14.83 9.17 4.24-4.24" />
        <path d="m14.83 14.83 4.24 4.24" />
        <path d="m9.17 14.83-4.24 4.24" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
    كتب: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
      </svg>
    ),
    ألعاب: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="6" x2="10" y1="12" y2="12" />
        <line x1="8" x2="8" y1="10" y2="14" />
        <line x1="15" x2="15.01" y1="13" y2="13" />
        <line x1="18" x2="18.01" y1="11" y2="11" />
        <rect width="20" height="12" x="2" y="6" rx="2" />
      </svg>
    ),
    سيارات: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
        <circle cx="7" cy="17" r="2" />
        <circle cx="17" cy="17" r="2" />
      </svg>
    ),
  };

  return icons[name] || categoryIcons.default;
}

export default async function CategoriesPage() {
  const result = await getCategories();
  const categories = result.success ? (result.data ?? []) : [];

  return (
    <>
      {/* Page Header */}
      <section
        className="border-b py-10"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--card)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1
              className="text-3xl font-bold sm:text-4xl"
              style={{ color: "var(--foreground)" }}
            >
              الفئات
            </h1>
            <p
              className="mt-3 text-base"
              style={{ color: "var(--muted-foreground)" }}
            >
              تصفح منتجاتنا حسب الفئة واكتشف ما يناسبك
            </p>
            <div
              className="mx-auto mt-4 h-1 w-20 rounded-full"
              style={{ backgroundColor: "var(--primary)" }}
            />
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {categories.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categories.map((category) => {
                const productCount = (category as unknown as { _count?: { products?: number } })._count?.products ?? 0;
                return (
                  <Link
                    key={category.id}
                    href={`/products?category=${category.slug}`}
                    className="group flex flex-col items-center gap-4 rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    style={{
                      borderColor: "var(--border)",
                      backgroundColor: "var(--card)",
                    }}
                  >
                    {/* Icon */}
                    <div
                      className="flex h-20 w-20 items-center justify-center rounded-full transition-colors duration-300 group-hover:scale-110"
                      style={{
                        backgroundColor: "var(--secondary)",
                        color: "var(--primary)",
                      }}
                    >
                      {getCategoryIcon(category.name)}
                    </div>

                    {/* Name */}
                    <h3
                      className="text-lg font-bold transition-colors"
                      style={{ color: "var(--foreground)" }}
                    >
                      {category.name}
                    </h3>

                    {/* Product Count */}
                    <span
                      className="rounded-full px-3 py-1 text-xs font-medium"
                      style={{
                        backgroundColor: "var(--secondary)",
                        color: "var(--muted-foreground)",
                      }}
                    >
                      {productCount} منتج{productCount !== 1 ? "ات" : ""}
                    </span>

                    {/* Arrow */}
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
                      className="mt-2 transition-transform group-hover:-translate-x-1 rtl-flip"
                      style={{ color: "var(--primary)" }}
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </Link>
                );
              })}
            </div>
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
                <rect width="7" height="7" x="3" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="3" rx="1" />
                <rect width="7" height="7" x="3" y="14" rx="1" />
                <rect width="7" height="7" x="14" y="14" rx="1" />
              </svg>
              <p
                className="text-lg font-medium"
                style={{ color: "var(--muted-foreground)" }}
              >
                لا توجد فئات متاحة حالياً
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
