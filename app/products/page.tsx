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
  products: { id: number; name: string; seoSlug: string | null; price: number }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((p, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://example.com/products/${p.seoSlug ?? p.id}`,
      name: p.name,
      item: {
        "@type": "Product",
        name: p.name,
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

  // Serialize for client (affiliatePrice → price, images[0] → image, stock, Date → string)
  interface DBProduct {
    id: number;
    name: string;
    description: string | null;
    affiliatePrice: number;
    seoSlug: string | null;
    isActive: boolean;
    images?: { url: string }[];
    stocks?: { quantity: number }[];
    createdAt: Date | string;
    categoryId: number | null;
    category: { id: number; name: string; slug: string | null } | null;
  }

  const productsList = dbProducts as DBProduct[];

  const serializedProducts = productsList.map((p: DBProduct) => ({
    ...p,
    price: Number(p.affiliatePrice),
    image: p.images?.[0]?.url || "https://placehold.co/600x600?text=منتج",
    stock: p.stocks?.reduce((sum, s) => sum + s.quantity, 0) ?? 0,
    createdAt:
      typeof p.createdAt === "string"
        ? p.createdAt
        : p.createdAt.toISOString(),
    // NOTE: Product table does NOT have updatedAt column
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
          name: p.name,
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