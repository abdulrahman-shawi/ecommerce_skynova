// ============================================
// Product Mapper — DB Model → UI Format
// ============================================
// Updated for INTEGRATED Schema:
// - Product.id = Int (not String)
// - Product.name (not title)
// - Product.affiliatePrice (not price)
// - Product.images[] (not image)
// - ProductStock for stock quantity
// ============================================

import { Product as DBProduct, Category, ProductImage, ProductStock } from "../generated/prisma";
import { Product as UICardProduct } from "@/components/ProductCard";

interface DBProductWithRelations extends DBProduct {
  category?: Category | null;
  images?: ProductImage[];
  stocks?: ProductStock[];
}

/**
 * Get primary image from images array
 */
function getPrimaryImage(product: DBProductWithRelations): string {
  if (product.images && product.images.length > 0) {
    return product.images[0].url;
  }
  return "/product-placeholder.jpg";
}

/**
 * Get total stock across all warehouses
 */
function getTotalStock(product: DBProductWithRelations): number {
  if (!product.stocks || product.stocks.length === 0) return 0;
  return product.stocks.reduce((sum, s) => sum + s.quantity, 0);
}

/**
 * Transform a DB product to the UI ProductCard format
 */
export function mapProductToCard(product: DBProductWithRelations): UICardProduct {
  const totalStock = getTotalStock(product);

  return {
    id: product.id,
    title: product.name,
    price: product.affiliatePrice,
    originalPrice: undefined,
    image: getPrimaryImage(product),
    category: product.category?.name || "عام",
    affiliateLink: product.seoSlug ? `/products/${product.seoSlug}` : `#`,
    badge: totalStock > 0 ? undefined : "نفذت الكمية",
  };
}

/**
 * Transform multiple DB products
 */
export function mapProductsToCards(products: DBProductWithRelations[]): UICardProduct[] {
  return products.map(mapProductToCard);
}

/**
 * Serialize product for Server → Client transfer
 */
export function serializeProduct(product: DBProductWithRelations) {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    affiliatePrice: product.affiliatePrice,
    seoSlug: product.seoSlug,
    isActive: product.isActive,
    googleLink: product.googleLink,
    categoryId: product.categoryId,
    createdAt: product.createdAt.toISOString(),
    category: product.category
      ? { id: product.category.id, name: product.category.name, slug: product.category.slug }
      : null,
    image: getPrimaryImage(product),
    stock: getTotalStock(product),
  };
}

/**
 * Serialize multiple products
 */
export function serializeProducts(products: DBProductWithRelations[]) {
  return products.map(serializeProduct);
}
