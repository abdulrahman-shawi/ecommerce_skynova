import { Metadata } from "next";
import { getProducts, getCategories } from "@/lib/actions";
import ProductsClient from "@/components/ProductsClient";

/**
 * Products Listing Page
 * Server Component — fetches products and categories, passes to client
 * component for interactive filtering, search, sort, and pagination.
 */

export const metadata: Metadata = {
  title: "جميع المنتجات | متجر التسويق بالعمولة",
  description:
    "تصفح جميع منتجاتنا المختارة بعناية. اكتشف أفضل العروض والمنتجات من مختلف الفئات بأسعار ممتازة.",
  openGraph: {
    title: "جميع المنتجات | متجر التسويق بالعمولة",
    description:
      "تصفح جميع منتجاتنا المختارة بعناية. اكتشف أفضل العروض والمنتجات من مختلف الفئات.",
    type: "website",
    locale: "ar_SA",
  },
  twitter: {
    card: "summary_large_image",
    title: "جميع المنتجات | متجر التسويق بالعمولة",
    description: "تصفح جميع منتجاتنا المختارة بعناية.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * Schema.org JSON-LD for ItemList
 */
function ItemListSchema({
  products,
}: {
  products: { id: string; title: string; seoSlug: string; price: number }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((p, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://example.com/products/${p.seoSlug}`,
      name: p.title,
      item: {
        "@type": "Product",
        name: p.title,
        offers: {
          "@type": "Offer",
          price: p.price,
          priceCurrency: "SAR",
        },
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function ProductsPage() {
  // Fetch products and categories in parallel
  const [productsResult, categoriesResult] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const dbProducts = productsResult.success ? productsResult.data ?? [] : [];
  const dbCategories = categoriesResult.success
    ? categoriesResult.data ?? []
    : [];

  // Serialize for client (Decimal → number, Date → string)
  const serializedProducts = dbProducts.map((p) => ({
    ...p,
    price: Number(p.price),
    createdAt: p.createdAt.toISOString?.()
      ? p.createdAt.toISOString()
      : String(p.createdAt),
    updatedAt: p.updatedAt.toISOString?.()
      ? p.updatedAt.toISOString()
      : String(p.updatedAt),
    category: p.category
      ? {
          id: p.category.id,
          name: p.category.name,
          slug: p.category.slug,
        }
      : null,
  }));

  const serializedCategories = dbCategories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
  }));

  return (
    <>
      {/* Schema.org JSON-LD */}
      <ItemListSchema
        products={serializedProducts.map((p) => ({
          id: p.id,
          title: p.title,
          seoSlug: p.seoSlug,
          price: p.price,
        }))}
      />

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
              جميع المنتجات
            </h1>
            <p
              className="mt-3 text-base"
              style={{ color: "var(--muted-foreground)" }}
            >
              اكتشف أفضل المنتجات المختارة بعناية من مختلف الفئات
            </p>
            <div
              className="mx-auto mt-4 h-1 w-20 rounded-full"
              style={{ backgroundColor: "var(--primary)" }}
            />
          </div>
        </div>
      </section>

      {/* Products Content */}
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ProductsClient
            products={serializedProducts}
            categories={serializedCategories}
          />
        </div>
      </section>
    </>
  );
}
