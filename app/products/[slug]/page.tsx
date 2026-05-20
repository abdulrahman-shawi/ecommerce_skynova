import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProductBySlug, getProducts } from "@/lib/actions";
import Breadcrumb from "@/components/Breadcrumb";
import OrderForm from "@/components/OrderForm";

/**
 * Product Detail Page — Updated for INTEGRATED Schema
 * Product.id = Int, Product.name (not title), Product.affiliatePrice, Product.images[]
 */

interface ProductPageProps {
  params: { slug: string };
}

// ─── SEO Metadata ──────────────────────────
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const result = await getProductBySlug(params.slug);

  if (!result.success || !result.data) {
    return { title: "المنتج غير موجود | متجرنا" };
  }

  const product = result.data;
  const description =
    product.description?.slice(0, 160) ||
    `${product.name} - احصل عليه الآن بأفضل سعر`;

  return {
    title: `${product.name} | متجر التسويق بالعمولة`,
    description,
    openGraph: {
      title: product.name,
      description,
      images: product.images?.[0]?.url
        ? [{ url: product.images[0].url, width: 600, height: 600, alt: product.name }]
        : [],
      locale: "ar_SA",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: product.images?.[0]?.url ? [product.images[0].url] : [],
    },
    robots: { index: true, follow: true },
  };
}

// ─── Static Params ─────────────────────────
export async function generateStaticParams() {
  const result = await getProducts();
  if (!result.success || !result.data) return [];

  return result.data
    .filter((p) => p.seoSlug)
    .slice(0, 10)
    .map((product) => ({
      slug: product.seoSlug as string,
    }));
}

// ─── Schema.org JSON-LD ────────────────────
function ProductSchema({
  product,
}: {
  product: {
    name: string;
    description?: string | null;
    affiliatePrice: number;
    images?: { url: string }[];
    seoSlug: string | null;
    stock: number;
    category?: { name: string } | null;
  };
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || product.name,
    image: product.images?.[0]?.url || "https://placehold.co/600x600?text=منتج",
    category: product.category?.name || "عام",
    offers: {
      "@type": "Offer",
      price: product.affiliatePrice,
      priceCurrency: "SAR",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: `https://example.com/products/${product.seoSlug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Related Products ──────────────────────
async function getRelatedProducts(
  categoryId: number | null | undefined,
  currentSlug: string | null
) {
  if (!categoryId) return [];

  const result = await getProducts();
  if (!result.success || !result.data) return [];

  return result.data
    .filter(
      (p) => p.categoryId === categoryId && p.seoSlug !== currentSlug && p.seoSlug
    )
    .slice(0, 3);
}

// ─── Main Component ────────────────────────
export default async function ProductPage({ params }: ProductPageProps) {
  const result = await getProductBySlug(params.slug);

  if (!result.success || !result.data) {
    notFound();
  }

  const product = result.data;

  // Calculate total stock across all warehouses
  const totalStock =
    product.stocks?.reduce((sum: number, s: { quantity: number }) => sum + s.quantity, 0) ?? 0;

  const productPrice = product.affiliatePrice;
  const isInStock = totalStock > 0;
  const stockLabel = isInStock ? "متاح" : "نفذت الكمية";
  const stockColor = isInStock
    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";

  const mainImage = product.images?.[0]?.url || "https://placehold.co/600x600?text=منتج";

  const relatedProducts = await getRelatedProducts(
    product.categoryId,
    product.seoSlug
  );

  // Breadcrumb
  const breadcrumbItems = [
    { label: "الرئيسية", href: "/" },
    { label: "المنتجات", href: "/products" },
    product.category
      ? {
          label: product.category.name,
          href: `/products?category=${product.category.id}`,
        }
      : null,
    { label: product.name },
  ].filter(Boolean) as { label: string; href?: string }[];

  return (
    <>
      <ProductSchema
        product={{
          name: product.name,
          description: product.description,
          affiliatePrice: productPrice,
          images: product.images,
          seoSlug: product.seoSlug,
          stock: totalStock,
          category: product.category,
        }}
      />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Product Main */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Image */}
          <div className="relative">
            <div
              className="relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
            >
              <Image
                src={mainImage}
                alt={product.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />

              {product.category && (
                <span className="absolute right-4 top-4 rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-white">
                  {product.category.name}
                </span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-5">
            <h1 className="text-2xl font-bold leading-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
              {product.name}
            </h1>

            {/* Price + Stock */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {productPrice.toLocaleString("ar-SA")} ر.س
              </span>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${stockColor}`}>
                {stockLabel}
              </span>
              {totalStock > 0 && totalStock <= 5 && (
                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                  الكمية محدودة ({totalStock})
                </span>
              )}
            </div>

            <div className="h-px w-full bg-slate-200 dark:bg-slate-700" />

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="mb-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                  وصف المنتج
                </h3>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {product.description}
                </p>
              </div>
            )}

            {/* Meta */}
            <div className="grid grid-cols-2 gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
              <div>
                <span className="text-slate-500 dark:text-slate-400">الفئة:</span>
                <span className="mr-1 font-medium text-slate-900 dark:text-slate-100">
                  {product.category?.name || "عام"}
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">الرقم التعريفي:</span>
                <span className="mr-1 font-medium text-slate-900 dark:text-slate-100">
                  #{product.id.toString().padStart(4, "0")}
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">المخزون:</span>
                <span className="mr-1 font-medium text-slate-900 dark:text-slate-100">
                  {totalStock} قطعة
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">تاريخ الإضافة:</span>
                <span className="mr-1 font-medium text-slate-900 dark:text-slate-100">
                  {new Date(product.createdAt).toLocaleDateString("ar-SA")}
                </span>
              </div>
            </div>

            <div className="h-px w-full bg-slate-200 dark:bg-slate-700" />

            {/* Order Form */}
            {isInStock ? (
              <div>
                <h3 className="mb-4 text-base font-semibold text-slate-900 dark:text-slate-100">
                  طلب المنتج
                </h3>
                <OrderForm
                  productId={product.id}
                  productPrice={productPrice}
                  productName={product.name}
                />
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center dark:border-slate-700 dark:bg-slate-800/50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="mx-auto mb-3 text-slate-400"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                <p className="font-medium text-slate-600 dark:text-slate-400">
                  هذا المنتج غير متاح حالياً
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-500">
                  نعتذر، لقد نفذت كمية هذا المنتج. يرجى زيارتنا لاحقاً.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <div className="mb-6 h-px w-full bg-slate-200 dark:bg-slate-700" />
            <div className="mb-8 flex items-center gap-3">
              <div className="h-6 w-1 rounded-full bg-emerald-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 sm:text-2xl">
                منتجات مشابهة
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((rp) => (
                <Link
                  key={rp.id}
                  href={`/products/${rp.seoSlug}`}
                  className="group flex gap-4 rounded-xl border border-slate-200 bg-white p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={rp.images?.[0]?.url || "https://placehold.co/200x200?text=منتج"}
                      alt={rp.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="96px"
                    />
                  </div>
                  <div className="flex flex-col justify-center gap-1">
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      {rp.category?.name || "عام"}
                    </span>
                    <h4 className="text-sm font-semibold leading-snug text-slate-900 line-clamp-2 dark:text-slate-100">
                      {rp.name}
                    </h4>
                    <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                      {rp.affiliatePrice.toLocaleString("ar-SA")} ر.س
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}