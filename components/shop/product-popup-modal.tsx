"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, Ruler, ImageOff } from "lucide-react";

// Simple SVG placeholder for broken images
const PLACEHOLDER_SVG = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23f3f4f6"/><text x="200" y="200" text-anchor="middle" fill="%239ca3af" font-size="16">No Image</text></svg>';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];

export interface ProductPopupModalProduct {
  id: string;
  name: string;
  slug: string;
  sku?: string | null;
  price: number;
  memberPrice?: number | null;
  images: string[];
  stock: number;
  description?: string;
  variantId?: string | null;
  variantLabel?: string;
  availableSizes?: string[];
  hasSizeChart?: boolean;
}

interface ProductPopupModalProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly product: ProductPopupModalProduct | null;
  readonly onConfirm: (quantity: number, selectedSize: string | null) => void | Promise<void>;
  readonly confirmLabel?: string;
}

export function ProductPopupModal({
  open,
  onOpenChange,
  product,
  onConfirm,
  confirmLabel = "Add to Cart",
}: Readonly<ProductPopupModalProps>) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (open) {
      setQuantity(1);
      setSelectedSize(null);
      setShowSizeChart(false);
      setImageError(false);
    }
  }, [open, product?.id, product?.variantId]);

  // Size chart data
  const sizeChartData = [
    { size: "XS", bust: 32, waist: 26, hip: 34, length: 46 },
    { size: "S", bust: 34, waist: 28, hip: 36, length: 47 },
    { size: "M", bust: 36, waist: 30, hip: 38, length: 48 },
    { size: "L", bust: 38, waist: 32, hip: 40, length: 49 },
    { size: "XL", bust: 40, waist: 34, hip: 42, length: 50 },
    { size: "XXL", bust: 42, waist: 36, hip: 44, length: 51 },
  ];

  if (!product) {
    return null;
  }

  const image = imageError ? PLACEHOLDER_SVG : (product.images[0] || PLACEHOLDER_SVG);
  const isOutOfStock = product.stock <= 0;
  const unitPrice = product.price;
  const memberPrice = product.memberPrice ?? null;
  let stockMessage: string | null = null;
  let stockMessageTone: "destructive" | "amber" | null = null;

  if (isOutOfStock) {
    stockMessage = "This item is currently out of stock.";
    stockMessageTone = "destructive";
  } else if (product.stock <= 5) {
    stockMessage = `Only ${product.stock} left in stock.`;
    stockMessageTone = "amber";
  }

  const handleConfirm = async () => {
    onOpenChange(false);
    await onConfirm(quantity, selectedSize);
  };

  const availableSizes = product?.availableSizes ?? [];
  const showSizeSelector = availableSizes.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-full overflow-hidden border-border bg-white p-0 sm:rounded-2xl max-h-[95dvh] flex flex-col">
        <div className="grid md:grid-cols-[1fr_1.2fr] flex-1 min-h-0 overflow-y-auto">
          <div className="relative min-h-[220px] bg-muted md:min-h-0 md:h-full">
            {imageError ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <ImageOff className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <span className="text-sm text-gray-400">No image available</span>
                </div>
              </div>
            ) : (
              <Image
                src={image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 45vw"
                onError={() => setImageError(true)}
              />
            )}
          </div>

          <div className="flex flex-col gap-4 p-5 md:p-6 overflow-y-auto">
            <DialogHeader className="text-left space-y-2">
              <DialogTitle className="text-xl md:text-2xl font-black tracking-tight text-foreground">
                {product.name}
              </DialogTitle>
              <DialogDescription className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {product.description ?? "Review the product details and choose your quantity before adding it to your cart."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-black text-foreground">
                  ₹{unitPrice.toLocaleString()}
                </span>
                {memberPrice ? (
                  <span className="text-sm text-primary font-semibold">
                    Member: ₹{memberPrice.toLocaleString()}
                  </span>
                ) : null}
              </div>

              {product.variantLabel ? (
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {product.variantLabel}
                </p>
              ) : null}
            </div>

            {/* Size Selector */}
            {showSizeSelector && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-foreground">Select Size</h4>
                  {product?.hasSizeChart && (
                    <button
                      onClick={() => setShowSizeChart(true)}
                      className="flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <Ruler className="h-3 w-3" />
                      Size Chart
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "w-12 h-12 rounded-lg border-2 font-medium text-sm transition-all",
                        selectedSize === size
                          ? "border-primary bg-primary text-white"
                          : "border-border bg-white text-foreground hover:border-primary hover:text-primary"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {!selectedSize && (
                  <p className="text-xs text-amber-600">Please select a size to continue</p>
                )}
              </div>
            )}

            <div className="rounded-2xl border border-border bg-secondary/40 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">Quantity</p>
                  <p className="text-xs text-muted-foreground">Default quantity starts at 1.</p>
                </div>
                <div className="flex items-center rounded-xl border border-border bg-white shadow-sm">
                  <button
                    type="button"
                    onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                    className="flex h-11 w-11 items-center justify-center text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:text-muted-foreground"
                    disabled={isOutOfStock}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="min-w-12 px-3 text-center text-sm font-bold text-foreground">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((current) => Math.min(current + 1, product.stock || current + 1))}
                    className="flex h-11 w-11 items-center justify-center text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:text-muted-foreground"
                    disabled={isOutOfStock}
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {stockMessage ? (
                <p className={cn("mt-3 text-sm font-medium", stockMessageTone === "destructive" ? "text-destructive" : "text-amber-600")}>{stockMessage}</p>
              ) : null}
            </div>

            <div className="mt-auto flex flex-col gap-3 pt-2 sm:flex-row">
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isOutOfStock || (showSizeSelector && !selectedSize)}
                className={cn(
                  "inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold transition-all duration-200 shadow-md",
                  isOutOfStock || (showSizeSelector && !selectedSize)
                    ? "cursor-not-allowed bg-muted text-muted-foreground"
                    : "bg-primary text-white hover:bg-primary/90"
                )}
              >
                <ShoppingBag className="h-4 w-4" />
                {isOutOfStock ? "Out of Stock" : showSizeSelector && !selectedSize ? "Select a Size" : confirmLabel}
              </button>
            </div>

            {/* Size Chart Modal */}
            {showSizeChart && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                  <div className="flex items-center justify-between p-4 border-b border-border">
                    <h3 className="text-lg font-semibold">Size Chart</h3>
                    <button
                      onClick={() => setShowSizeChart(false)}
                      className="p-2 hover:bg-secondary rounded-lg transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-4">
                      All measurements are in inches.
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-2 px-2 font-semibold">Size</th>
                            <th className="text-center py-2 px-2 font-semibold">Bust</th>
                            <th className="text-center py-2 px-2 font-semibold">Waist</th>
                            <th className="text-center py-2 px-2 font-semibold">Hip</th>
                            <th className="text-center py-2 px-2 font-semibold">Length</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sizeChartData.map((row) => (
                            <tr key={row.size} className="border-b border-border/50 last:border-0">
                              <td className="py-2 px-2 font-medium">{row.size}</td>
                              <td className="text-center py-2 px-2 text-muted-foreground">{row.bust}</td>
                              <td className="text-center py-2 px-2 text-muted-foreground">{row.waist}</td>
                              <td className="text-center py-2 px-2 text-muted-foreground">{row.hip}</td>
                              <td className="text-center py-2 px-2 text-muted-foreground">{row.length}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-4 p-3 bg-secondary/50 rounded-lg">
                      <h4 className="font-medium text-sm mb-1">How to Measure</h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• <strong>Bust:</strong> Measure around fullest part</li>
                        <li>• <strong>Waist:</strong> Measure around natural waistline</li>
                        <li>• <strong>Hip:</strong> Measure around fullest part of hips</li>
                        <li>• <strong>Length:</strong> Shoulder to hem</li>
                      </ul>
                    </div>
                  </div>
                  <div className="p-4 border-t border-border">
                    <button
                      onClick={() => setShowSizeChart(false)}
                      className="w-full py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                      Got it
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}