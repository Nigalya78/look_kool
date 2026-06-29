"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Check, Zap, ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { WishlistToggleButton } from "./wishlist-toggle-button";
import {
  ProductPopupModal,
  type ProductPopupModalProduct,
} from "./product-popup-modal";

// Simple SVG placeholder for broken images
const PLACEHOLDER_SVG = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23f3f4f6"/><text x="200" y="200" text-anchor="middle" fill="%239ca3af" font-size="16">No Image</text></svg>';

interface ProductCardProps {
  readonly product: {
    readonly id: string;
    readonly name: string;
    readonly slug: string;
    readonly sku?: string | null;
    readonly description: string;
    readonly basePrice: number;
    readonly comparePrice: number | null;
    readonly memberPrice: number | null;
    readonly stock: number;
    readonly images: string[];
    readonly material: string | null;
    readonly hasVariants: boolean;
    readonly category: { name: string; slug: string };
    readonly reviewCount: number;
    readonly variant: {
      readonly id: string;
      readonly sku?: string | null;
      readonly price: number;
      readonly comparePrice: number | null;
      readonly memberPrice: number | null;
      readonly stock: number;
      readonly image: string | undefined;
    } | null;
  };
  readonly isMember?: boolean;
}

export function ProductCard(props: Readonly<ProductCardProps>) {
  const { product, isMember = false } = props;
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [imageError, setImageError] = useState(false);
  const router = useRouter();
  useEffect(() => { setMounted(true); }, []);
  // Use variant price if set (> 0), otherwise fall back to product base price
  const displayPrice =
    (product.variant?.price && product.variant.price > 0)
      ? product.variant.price
      : product.basePrice;
  const displayComparePrice =
    (product.variant?.comparePrice && product.variant.comparePrice > 0)
      ? product.variant.comparePrice
      : product.comparePrice;
  const displayMemberPrice =
    (product.variant?.memberPrice && product.variant.memberPrice > 0)
      ? product.variant.memberPrice
      : (product.memberPrice && product.memberPrice > 0 ? product.memberPrice : null);
  const displayStock = product.variant?.stock ?? product.stock;
  const displayImage = product.variant?.image ?? product.images[0] ?? "/placeholder.jpg";
  const hasDiscount = displayComparePrice && displayComparePrice > displayPrice;
  let reviewLabel = "reviews";
  if (product.reviewCount === 1) {
    reviewLabel = "review";
  }

  let discountPercent = 0;
  if (hasDiscount) {
    discountPercent = Math.round(((displayComparePrice - displayPrice) / displayComparePrice) * 100);
  }
  const cartVariantId = product.variant?.id ?? null;
  const isInCartRaw = useCartStore((state) => state.isInCart(product.id, cartVariantId));
  const isInCart = mounted && isInCartRaw;
  const addItem = useCartStore((state) => state.addItem);
  let addToCartButtonClassName = "bg-primary text-white shadow-md hover:bg-primary/90";
  let addToCartIcon: React.ReactNode = <ShoppingCart className="h-4 w-4" />;
  let addToCartLabel = "Add to Cart";

  if (displayStock === 0) {
    addToCartButtonClassName = "cursor-not-allowed bg-muted text-muted-foreground";
    addToCartIcon = null;
    addToCartLabel = "Out of Stock";
  } else if (isInCart) {
    addToCartButtonClassName = "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100";
    addToCartIcon = <Check className="h-4 w-4" />;
    addToCartLabel = "Added";
  }

  const popupProduct: ProductPopupModalProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: displayPrice,
    memberPrice: displayMemberPrice,
    images: [displayImage],
    stock: displayStock,
    description: product.description,
    variantId: cartVariantId,
  };

  const wishlistProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.variant?.sku ?? product.sku,
    price: displayPrice,
    comparePrice: displayComparePrice,
    memberPrice: displayMemberPrice,
    images: [displayImage],
    stock: displayStock,
    description: product.description,
    material: product.material,
    category: product.category,
    variantId: cartVariantId,
    variantLabel: product.variant ? "Selected option" : undefined,
  };

  const handleConfirm = (quantity: number, selectedSize: string | null) => {
    let variantLabel: string | undefined;
    if (selectedSize) {
      variantLabel = `Size: ${selectedSize}`;
    } else if (product.variant) {
      variantLabel = "Selected option";
    }

    addItem(
      {
        ...popupProduct,
        variantLabel,
      },
      quantity
    );
  };

  const handleBuyNow = () => {
    if (displayStock === 0) {
      return;
    }

    let variantLabel: string | undefined;
    if (product.variant) {
      variantLabel = "Selected option";
    }

    addItem(
      {
        ...popupProduct,
        variantLabel,
      },
      1
    );
    router.push("/checkout");
  };

  return (
    <>
      <div className="group flex flex-col">

        {/* Image */}
        <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
          <Link href={`/products/${product.slug}`} className="absolute inset-0 block">
            {imageError ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <ImageOff className="h-8 w-8 text-gray-300 mx-auto mb-1" />
                  <span className="text-xs text-gray-400">No image</span>
                </div>
              </div>
            ) : (
              <Image
                src={displayImage || PLACEHOLDER_SVG}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
                onError={() => setImageError(true)}
              />
            )}
          </Link>

          <WishlistToggleButton
            product={wishlistProduct}
            className="absolute top-2 right-2 z-10 h-7 w-7"
          />

          {displayStock === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
              <span className="px-2.5 py-1 bg-white/90 text-foreground text-xs font-semibold rounded-full">
                Out of Stock
              </span>
            </div>
          )}

          {/* Add to Cart — desktop hover only */}
          <div className="hidden sm:block absolute bottom-2 inset-x-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
            <button
              type="button"
              onClick={() => setIsPopupOpen(true)}
              disabled={displayStock === 0}
              className={cn(
                "w-full py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-md",
                displayStock === 0
                  ? "bg-white/80 text-muted-foreground cursor-not-allowed"
                  : isInCart
                  ? "bg-emerald-600 text-white"
                  : "bg-white text-black hover:bg-[#5B1E7A] hover:text-white"
              )}
            >
              {isInCart ? <Check className="h-3.5 w-3.5" /> : <ShoppingCart className="h-3.5 w-3.5" />}
              {isInCart ? "Added to Cart" : "Add to Cart"}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="mt-2.5 flex flex-col gap-0.5">
          <Link
            href={`/categories/${product.category.slug}`}
            className="text-[10px] sm:text-xs text-muted-foreground hover:text-primary transition-colors uppercase tracking-wide"
          >
            {product.category.name}
          </Link>

          <Link href={`/products/${product.slug}`}>
            <h3 className="text-xs sm:text-sm font-medium text-foreground line-clamp-2 hover:text-primary transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>

          {product.material && (
            <p className="text-[10px] sm:text-xs text-muted-foreground">{product.material}</p>
          )}

          <div className="mt-1 flex items-baseline gap-2 flex-wrap">
            <span className="text-sm sm:text-base font-bold text-foreground">
              ₹{displayPrice.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-[10px] sm:text-xs text-muted-foreground line-through">
                ₹{displayComparePrice.toLocaleString()}
              </span>
            )}
            {hasDiscount && (
              <span className="text-[10px] sm:text-xs font-bold text-destructive">
                -{discountPercent}%
              </span>
            )}
          </div>

          {displayMemberPrice && (
            <p className="text-[10px] sm:text-xs text-primary font-semibold">
              Member: ₹{displayMemberPrice.toLocaleString()}
            </p>
          )}

          {displayStock > 0 && displayStock <= 5 && (
            <p className="text-[10px] text-amber-600 font-medium">Only {displayStock} left!</p>
          )}

          {/* Add to Cart — mobile only */}
          <button
            type="button"
            onClick={() => setIsPopupOpen(true)}
            disabled={displayStock === 0}
            className={cn(
              "sm:hidden mt-2 w-full py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors",
              displayStock === 0
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : isInCart
                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                : "bg-primary text-white hover:bg-primary/90"
            )}
          >
            {isInCart ? <Check className="h-3.5 w-3.5" /> : <ShoppingCart className="h-3.5 w-3.5" />}
            {addToCartLabel}
          </button>
        </div>
      </div>

      <ProductPopupModal
        open={isPopupOpen}
        onOpenChange={setIsPopupOpen}
        product={popupProduct}
        onConfirm={handleConfirm}
      />
    </>
  );
}
