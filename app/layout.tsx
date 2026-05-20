import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/**
 * Root Layout Component
 * Sets up the application with:
 * - Cairo font from Google Fonts
 * - RTL direction + Arabic language
 * - ThemeProvider for dark/light mode
 * - Navbar and Footer wrappers
 * - SEO metadata and OpenGraph tags
 */

// Load Cairo font with Arabic subset
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

/**
 * SEO Metadata
 * Includes title, description, OpenGraph, and Twitter card data.
 */
export const metadata: Metadata = {
  title: "متجرنا | أفضل منتجات التسويق بالعمولة",
  description:
    "اكتشف أفضل المنتجات بأقل الأسعار. متجر التسويق بالعمولة الخاص بك يقدم لك منتجات مختارة بعناية من مختلف الفئات.",
  keywords: [
    "تسويق بالعمولة",
    "منتجات",
    "تسوق",
    "عروض",
    "خصومات",
    "affiliate",
    "marketing",
  ],
  openGraph: {
    title: "متجرنا | أفضل منتجات التسويق بالعمولة",
    description:
      "اكتشف أفضل المنتجات بأقل الأسعار. منتجات مختارة بعناية من مختلف الفئات.",
    url: "https://example.com",
    siteName: "متجرنا",
    locale: "ar_SA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "متجرنا | أفضل منتجات التسويق بالعمولة",
    description:
      "اكتشف أفضل المنتجات بأقل الأسعار. منتجات مختارة بعناية من مختلف الفئات.",
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL("https://example.com"),
};

/**
 * RootLayout wraps all pages with theme, font, and global structure.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={cairo.variable}
    >
      <body className={`${cairo.className} min-h-screen antialiased transition-colors`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {/* Navbar */}
          <Navbar />

          {/* Main Content */}
          <main className="flex-1">{children}</main>

          {/* Footer */}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
