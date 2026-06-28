"use client";

import { useState, useCallback } from "react";
import { Truck, RotateCcw, ShieldCheck, Star, Heart, Share2, Package, Minus, Plus, Ruler } from "lucide-react";
import { ProductGallery } from "./product-gallery";
import { AddToCartButton } from "./add-to-cart-button";
import { WishlistToggleButton } from "./wishlist-toggle-button";
import { VariantSelector } from "./variant-selector";

interface ProductVariant {
  id: string;
  sku: string;
  price: number;
  comparePrice: number | null;
  memberPrice: number | null;
  stock: number;
  isActive: boolean;
  weight?: number | null;
  length?: number | null;
  width?: number | null;
  height?: number | null;
  values: {
    variantValue: {
      id: string;
      value: string;
      hexCode: string | null;
      images: string[];
      variantAttribute: {
        id: string;
        name: string;
      };
    };
  }[];
  images: {
    id: string;
    url: string;
    displayOrder: number;
  }[];
}

interface VariantAttribute {
  id: string;
  name: string;
  displayOrder: number;
  isPrimary: boolean;
  variantValues: {
    id: string;
    value: string;
    hexCode: string | null;
    images: string[];
  }[];
}

interface ProductDetailsClientProps {
  product: {
    id: string;
    name: string;
    sku: string;
    slug: string;
    basePrice: number;
    comparePrice: number | null;
    memberPrice: number | null;
    stock: number;
    images: string[];
    description: string;
    material: string | null;
    weight?: number | null;
    length?: number | null;
    width?: number | null;
    height?: number | null;
    category?: { name: string; slug: string };
    reviewCount?: number;
    avgRating?: number | null;
  };
  attributes?: VariantAttribute[];
  variants?: ProductVariant[];
  variantMap?: Record<string, ProductVariant>;
  defaultVariant?: ProductVariant | null;
}

// Size chart data
const SIZE_CHART_DATA = [
  { size: "XS", bust: 32, waist: 26, hip: 34, length: 46 },
  { size: "S", bust: 34, waist: 28, hip: 36, length: 47 },
  { size: "M", bust: 36, waist: 30, hip: 38, length: 48 },
  { size: "L", bust: 38, waist: 32, hip: 40, length: 49 },
  { size: "XL", bust: 40, waist: 34, hip: 42, length: 50 },
  { size: "XXL", bust: 42, waist: 36, hip: 44, length: 51 },
];

export function ProductDetailsClient({
  product,
  attributes = [],
  variants = [],
  variantMap = {},
  defaultVariant = null,
}: ProductDetailsClientProps) {
  const hasVariants = attributes.length > 0 && variants.length > 0;

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(defaultVariant ?? null);
  const [quantity, setQuantity] = useState(1);
  const [showSizeChart, setShowSizeChart] = useState(false);

  const handleVariantChange = useCallback((variant: ProductVariant | null) => {
    setSelectedVariant(variant);
    setQuantity(1);
  }, []);

  // Derive display values from selected variant (or product-level fallback)
  // A variant price of 0 means it was not individually set — use the product base price
  const displayPrice = (selectedVariant && selectedVariant.price > 0) ? selectedVariant.price : product.basePrice;
  const displayComparePrice = selectedVariant?.comparePrice ?? product.comparePrice;
  const displayMemberPrice = selectedVariant?.memberPrice ?? product.memberPrice;
  const displayStock = selectedVariant?.stock ?? product.stock;
  const displaySku = selectedVariant?.sku ?? product.sku;

  // Gallery: prefer variant images (colour-level attribute value images → variant images → product images)
  const primaryAttr = attributes.find((a) => a.isPrimary);
  const primaryValImages: string[] = selectedVariant && primaryAttr
    ? primaryAttr.variantValues.find(
        (vv) => selectedVariant.values.some((sv) => sv.variantValue.id === vv.id)
      )?.images ?? []
    : [];
  const variantImages = selectedVariant?.images?.map((i) => i.url) ?? [];
  const displayImages =
    primaryValImages.length > 0
      ? primaryValImages
      : variantImages.length > 0
      ? variantImages
      : product.images;

  // Dimensions: prefer selected variant's values
  const displayWeight = selectedVariant?.weight ?? product.weight ?? null;
  const displayLength = selectedVariant?.length ?? product.length ?? null;
  const displayWidth = selectedVariant?.width ?? product.width ?? null;
  const displayHeight = selectedVariant?.height ?? product.height ?? null;
  const hasDimensions = displayWeight !== null || displayLength !== null || displayWidth !== null || displayHeight !== null;

  // Extract available sizes from the Size attribute (for the Buy Now / Add to Cart popup)
  const sizeAttr = attributes.find((a) => a.name.toLowerCase() === "size");
  const availableSizes = sizeAttr
    ? sizeAttr.variantValues.map((vv) => vv.value)
    : [];

  // Build variant label for cart (e.g. "Color: Black, Size: M")
  const variantLabel = selectedVariant
    ? selectedVariant.values
        .map((v) => `${v.variantValue.variantAttribute.name}: ${v.variantValue.value}`)
        .join(", ")
    : undefined;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      {/* Product Gallery */}
      <div className="w-full max-w-[600px] mx-auto lg:mx-0">
        <ProductGallery
          images={displayImages}
          productName={product.name}
        />
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm text-[#5B1E7A] font-medium mb-1">
              {product.category?.name ?? "Model, Size, Color"}
            </p>
            <h1 className="text-2xl md:text-3xl font-[family-name:var(--font-playfair)] font-semibold text-[#111111]">
              {product.name}
            </h1>
            {product.material && (
              <p className="text-xs text-gray-500 mt-1">{product.material}</p>
            )}
          </div>
          <WishlistToggleButton
            product={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              sku: displaySku,
              price: displayPrice,
              comparePrice: displayComparePrice,
              memberPrice: displayMemberPrice,
              images: displayImages,
              stock: displayStock,
              description: product.description,
              material: product.material,
              category: product.category ?? { name: "", slug: "" },
            }}
            className="h-10 w-10 shrink-0"
          />
        </div>

        {/* Rating */}
        {product.avgRating != null && product.reviewCount != null && product.reviewCount > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.round(product.avgRating!) ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {product.avgRating.toFixed(1)} <span className="text-gray-400">({product.reviewCount} reviews)</span>
            </span>
          </div>
        )}

        {/* Pricing */}
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-[#111111]">
            ₹{displayPrice.toLocaleString()}
          </span>
          {displayComparePrice && displayComparePrice > displayPrice && (
            <>
              <span className="text-lg text-gray-400 line-through">
                ₹{displayComparePrice.toLocaleString()}
              </span>
              <span className="px-2 py-0.5 bg-[#5B1E7A] text-white text-sm font-medium rounded">
                -{Math.round(((displayComparePrice - displayPrice) / displayComparePrice) * 100)}%
              </span>
            </>
          )}
        </div>

        {/* Member Price */}
        {displayMemberPrice && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[#5B1E7A] font-medium">Member: ₹{displayMemberPrice.toLocaleString()}</span>
            <span className="text-xs text-gray-500">(Save ₹{(displayPrice - displayMemberPrice).toLocaleString()})</span>
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>

        {/* Variant Selector */}
        {hasVariants && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#111111]">Select Options</h3>
              <button
                onClick={() => setShowSizeChart(true)}
                className="flex items-center gap-1 text-xs text-[#5B1E7A] hover:underline"
              >
                <Ruler className="h-3 w-3" />
                Size Chart
              </button>
            </div>
            <VariantSelector
              attributes={attributes}
              variants={variants}
              variantMap={variantMap}
              defaultVariant={defaultVariant ?? null}
              onVariantChange={handleVariantChange}
            />
            {!selectedVariant && (
              <p className="text-xs text-amber-600">Please select all options to continue</p>
            )}
          </div>
        )}

        {/* Quantity Selector */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-[#111111]">Quantity</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center rounded-xl border border-gray-200 bg-white shadow-sm">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="flex h-11 w-11 items-center justify-center text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-12 px-3 text-center text-sm font-bold text-[#111111]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(q + 1, displayStock))}
                disabled={quantity >= displayStock}
                className="flex h-11 w-11 items-center justify-center text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <span className="text-sm text-gray-500">{displayStock} available</span>
          </div>
        </div>

        {/* Stock & SKU */}
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-500">SKU: <span className="text-[#111111]">{displaySku}</span></span>
          <span className="w-px h-4 bg-gray-200" />
          {displayStock > 0 ? (
            <span className="flex items-center gap-1.5 text-green-600">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              In Stock ({displayStock} available)
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-red-500">
              <span className="w-2 h-2 bg-red-500 rounded-full" />
              Out of Stock
            </span>
          )}
        </div>

        {/* Add to Cart & Buy Now */}
        <div className="pt-2">
          <AddToCartButton
            product={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              sku: displaySku,
              price: displayPrice,
              memberPrice: displayMemberPrice,
              images: displayImages,
              stock: displayStock,
              description: product.description,
              variantId: selectedVariant?.id ?? null,
              variantLabel,
              availableSizes,
              hasSizeChart: availableSizes.length > 0,
            }}
            quantity={quantity}
            hasVariants={hasVariants}
            disabled={displayStock === 0 || (hasVariants && !selectedVariant)}
            outOfStock={displayStock === 0}
            directBuyNow
          />
        </div>

        {/* Secondary Actions */}
        <div className="flex items-center gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-[#5B1E7A] hover:text-[#5B1E7A] transition-colors">
            <Heart className="w-4 h-4" />
            Add to Wishlist
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-[#5B1E7A] hover:text-[#5B1E7A] transition-colors">
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>

        {/* Product Details / Specifications */}
        {hasDimensions && (
          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-[#111111] mb-3">Product Details</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {displayWeight && (
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Weight</span>
                  <span className="text-[#111111] font-medium">{displayWeight} kg</span>
                </div>
              )}
              {(displayLength && displayWidth && displayHeight) && (
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Dimensions</span>
                  <span className="text-[#111111] font-medium">{displayLength}×{displayWidth}×{displayHeight} cm</span>
                </div>
              )}
              {displayLength && !(displayWidth && displayHeight) && (
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Length</span>
                  <span className="text-[#111111] font-medium">{displayLength} cm</span>
                </div>
              )}
              {displayWidth && !(displayLength && displayHeight) && (
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Width</span>
                  <span className="text-[#111111] font-medium">{displayWidth} cm</span>
                </div>
              )}
              {displayHeight && !(displayLength && displayWidth) && (
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Height</span>
                  <span className="text-[#111111] font-medium">{displayHeight} cm</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Size Chart Modal */}
        {showSizeChart && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-[#111111]">Size Chart</h3>
                <button
                  onClick={() => setShowSizeChart(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-500 mb-4">All measurements are in inches.</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-2 font-semibold">Size</th>
                        <th className="text-center py-2 px-2 font-semibold">Bust</th>
                        <th className="text-center py-2 px-2 font-semibold">Waist</th>
                        <th className="text-center py-2 px-2 font-semibold">Hip</th>
                        <th className="text-center py-2 px-2 font-semibold">Length</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SIZE_CHART_DATA.map((row) => (
                        <tr key={row.size} className="border-b border-gray-100 last:border-0">
                          <td className="py-2 px-2 font-medium">{row.size}</td>
                          <td className="text-center py-2 px-2 text-gray-600">{row.bust}</td>
                          <td className="text-center py-2 px-2 text-gray-600">{row.waist}</td>
                          <td className="text-center py-2 px-2 text-gray-600">{row.hip}</td>
                          <td className="text-center py-2 px-2 text-gray-600">{row.length}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-sm mb-1">How to Measure</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• <strong>Bust:</strong> Measure around fullest part</li>
                    <li>• <strong>Waist:</strong> Measure around natural waistline</li>
                    <li>• <strong>Hip:</strong> Measure around fullest part of hips</li>
                    <li>• <strong>Length:</strong> Shoulder to hem</li>
                  </ul>
                </div>
              </div>
              <div className="p-4 border-t border-gray-100">
                <button
                  onClick={() => setShowSizeChart(false)}
                  className="w-full py-2.5 bg-[#5B1E7A] text-white rounded-lg font-medium hover:bg-[#4A1870] transition-colors"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Trust Features */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <Truck className="w-5 h-5 text-[#5B1E7A]" />
            <span className="text-xs font-medium text-gray-700">Fast Delivery</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <RotateCcw className="w-5 h-5 text-[#5B1E7A]" />
            <span className="text-xs font-medium text-gray-700">30-Day Returns</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <ShieldCheck className="w-5 h-5 text-[#5B1E7A]" />
            <span className="text-xs font-medium text-gray-700">Secure Payment</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <Package className="w-5 h-5 text-[#5B1E7A]" />
            <span className="text-xs font-medium text-gray-700">Fast Delivery</span>
          </div>
        </div>
      </div>
    </div>
  );
}
