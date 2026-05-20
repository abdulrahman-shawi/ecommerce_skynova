import ProductGrid from "@/components/ProductGrid";
import { getProducts } from "@/lib/actions";
import { mapProductsToCards } from "@/lib/product-mapper";

/**
 * Home Page (Landing Page) — Products from DATABASE
 * Fetches products from DB via Server Component + displays in ProductGrid
 */

export const metadata = {
  title: "متجرنا | الصفحة الرئيسية",
  description:
    "اكتشف أفضل منتجات التسويق بالعمولة. تسوق ذكي، وفر أكثر، اكسب مع كل عملية شراء.",
  openGraph: {
    title: "متجرنا | الصفحة الرئيسية",
    description:
      "اكتشف أفضل منتجات التسويق بالعمولة. تسوق ذكي، وفر أكثر، اكسب مع كل عملية شراء.",
    url: "https://example.com",
  },
};

const steps = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
      </svg>
    ),
    title: "تصفح المنتجات",
    description: "استعرض مجموعتنا المختارة من أفضل المنتجات بعناية فائقة من مختلف الفئات.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m16 11 2 2 4-4" /><path d="M21 12V9a2 2 0 0 0-2-2h-2.5" /><path d="M14.5 7 12 3 9.5 7" /><path d="M12 3v7.5" /><path d="m9.5 7 1.5 3" /><path d="m14.5 7-1.5 3" /><path d="M4.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" /><path d="M4.5 16V7h2.5" /><path d="M2 16h5" />
      </svg>
    ),
    title: "اختر منتجك",
    description: "قارن بين المنتجات واختر ما يناسبك من أفضل الماركات العالمية بأفضل الأسعار.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
      </svg>
    ),
    title: "اشترِ واكسب",
    description: "اضغط على زر الشراء وانتقل مباشرة إلى المتجر الأصلي لإتمام عملية الشراء بسهولة.",
  },
];

const stats = [
  { value: "+500", label: "منتج متاح" },
  { value: "+10K", label: "عميل سعيد" },
  { value: "+50", label: "علامة تجارية" },
  { value: "%99", label: "رضا العملاء" },
];

function SchemaOrg() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://example.com/#organization",
        name: "متجرنا",
        url: "https://example.com",
        logo: { "@type": "ImageObject", url: "https://example.com/logo.png" },
        sameAs: [
          "https://twitter.com/example",
          "https://instagram.com/example",
          "https://facebook.com/example",
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://example.com/#website",
        url: "https://example.com",
        name: "متجرنا - أفضل منتجات التسويق بالعمولة",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: "https://example.com/search?q={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}

// ═══════════════════════════════════════════
// MAIN PAGE — Server Component fetches from DB
// ═══════════════════════════════════════════
export default async function HomePage() {
  // ─── Fetch products from DATABASE ───
  const result = await getProducts();
  const dbProducts = result.success && result.data ? result.data : [];

  // ─── Transform DB products → UI format ───
  const uiProducts = mapProductsToCards(dbProducts);

  // ─── Fallback message if no products ───
  const hasProducts = uiProducts.length > 0;

  return (
    <>
      <SchemaOrg />

      {/* HERO */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-amber-500/15 blur-3xl" />
        </div>

        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl lg:text-6xl">
            تسوق بذكاء، <span className="text-emerald-600 dark:text-emerald-400">وفر أكثر</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400 sm:text-xl">
            اكتشف أفضل المنتجات من مختلف الفئات بأفضل الأسعار. نوفر لك تجربة تسوق سهلة وممتعة.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#products"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:bg-emerald-700 hover:shadow-xl active:scale-[0.98]"
            >
              <span>تصفح المنتجات</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rtl-flip">
                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
              </svg>
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-200 px-8 py-4 text-base font-semibold text-slate-900 transition-all hover:bg-slate-50 active:scale-[0.98] dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              <span>كيف يعمل؟</span>
            </a>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-slate-200 bg-white px-4 py-12 dark:border-slate-700 dark:bg-slate-800 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 sm:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS — FROM DATABASE */}
      {hasProducts ? (
        <ProductGrid products={uiProducts} />
      ) : (
        <section id="products" className="py-16 text-center">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto mb-4 text-slate-300 dark:text-slate-600">
              <path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
            </svg>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">لا توجد منتجات حالياً</h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              سيتم إضافة المنتجات قريباً. تفضل بزيارتنا لاحقاً!
            </p>
          </div>
        </section>
      )}

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-white px-4 py-16 dark:bg-slate-800 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">
              كيف يعمل التسويق بالعمولة؟
            </h2>
            <p className="mt-3 text-base text-slate-500 dark:text-slate-400">
              ثلاث خطوات بسيطة للبدء في التسوق والربح
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="group relative flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900"
              >
                <span className="absolute -top-3 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                  {index + 1}
                </span>
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-white transition-colors group-hover:bg-emerald-700">
                  {step.icon}
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-slate-100">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="bg-slate-50 px-4 py-16 dark:bg-slate-900 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-3xl bg-emerald-600 px-6 py-14 text-center sm:px-12">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/10" />

            <h2 className="relative text-2xl font-bold text-white sm:text-3xl">
              هل تريد الانضمام كمسوق بالعمولة؟
            </h2>
            <p className="relative mx-auto mt-4 max-w-lg text-base text-white/80">
              سجل الآن وابدأ في كسب العمولة من كل عملية شراء تتم عبر رابطك الخاص.
            </p>
            <div className="relative mt-8">
              <a
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-emerald-600 transition-all hover:bg-gray-100 active:scale-[0.98]"
              >
                <span>ابدأ الآن</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rtl-flip">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}