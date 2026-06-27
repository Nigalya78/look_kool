"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "./product-card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const PAGE_SIZE = 8;

// Filter options
const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];
const FABRIC_OPTIONS = ["Cotton", "Silk", "Georgette", "Chiffon", "Linen", "Rayon", "Polyester", "Velvet", "Satin"];
const SLEEVE_TYPE_OPTIONS = ["Sleeveless", "Short Sleeve", "3/4 Sleeve", "Long Sleeve", "Bell Sleeve", "Cold Shoulder", "Cap Sleeve"];

// Dual Range Slider Component
interface DualRangeSliderProps {
  min: number;
  max: number;
  minValue: number;
  maxValue: number;
  onChange: (min: number, max: number) => void;
  step?: number;
}

function DualRangeSlider({ min, max, minValue, maxValue, onChange, step = 100 }: DualRangeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<'min' | 'max' | null>(null);
  
  const getPercentage = (value: number) => ((value - min) / (max - min)) * 100;
  const getValue = (percentage: number) => {
    const rawValue = min + (percentage / 100) * (max - min);
    return Math.round(rawValue / step) * step;
  };
  
  const handleMove = useCallback((clientX: number) => {
    if (!trackRef.current || !dragging) return;
    
    const rect = trackRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const value = getValue(percentage);
    
    if (dragging === 'min') {
      // Min handle: ensure it doesn't exceed max - step
      const newMin = Math.min(value, maxValue - step);
      onChange(newMin, maxValue);
    } else {
      // Max handle: ensure it doesn't go below min + step
      const newMax = Math.max(value, minValue + step);
      onChange(minValue, newMax);
    }
  }, [dragging, min, max, minValue, maxValue, step, onChange]);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const handleTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);
    const handleUp = () => setDragging(null);
    
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('mouseup', handleUp);
      window.addEventListener('touchend', handleUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchend', handleUp);
    };
  }, [dragging, handleMove]);
  
  // Handle click on track to move nearest handle
  const handleTrackClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!trackRef.current) return;
    
    const rect = trackRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const percentage = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const value = getValue(percentage);
    
    const minPercentage = getPercentage(minValue);
    const maxPercentage = getPercentage(maxValue);
    
    // Determine which handle is closer to the click position
    const distToMin = Math.abs(percentage - minPercentage);
    const distToMax = Math.abs(percentage - maxPercentage);
    
    if (distToMin <= distToMax) {
      // Move min handle (but don't exceed max - step)
      const newMin = Math.min(value, maxValue - step);
      onChange(newMin, maxValue);
    } else {
      // Move max handle (but don't go below min + step)
      const newMax = Math.max(value, minValue + step);
      onChange(minValue, newMax);
    }
  }, [min, max, minValue, maxValue, step, onChange]);
  
  return (
    <div className="relative py-4">
      <div 
        ref={trackRef}
        className="relative h-2 bg-gray-200 rounded-full cursor-pointer"
        onClick={handleTrackClick}
      >
        <div 
          className="absolute h-full bg-[#5B1E7A] rounded-full"
          style={{ 
            left: `${getPercentage(minValue)}%`, 
            right: `${100 - getPercentage(maxValue)}%` 
          }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-[#5B1E7A] rounded-full cursor-grab active:cursor-grabbing shadow-md hover:scale-110 transition-transform"
          style={{ left: `calc(${getPercentage(minValue)}% - 10px)` }}
          onMouseDown={() => setDragging('min')}
          onTouchStart={() => setDragging('min')}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-[#5B1E7A] rounded-full cursor-grab active:cursor-grabbing shadow-md hover:scale-110 transition-transform"
          style={{ left: `calc(${getPercentage(maxValue)}% - 10px)` }}
          onMouseDown={() => setDragging('max')}
          onTouchStart={() => setDragging('max')}
        />
      </div>
      <div className="flex justify-between mt-2 text-sm text-gray-500">
        <span>₹{minValue.toLocaleString()}</span>
        <span>₹{maxValue.toLocaleString()}</span>
      </div>
    </div>
  );
}

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: { products: number };
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  comparePrice: number | null;
  memberPrice: number | null;
  stock: number;
  images: string[];
  material: string | null;
  hasVariants: boolean;
  category: { name: string; slug: string };
  reviewCount: number;
  variant: {
    id: string;
    price: number;
    comparePrice: number | null;
    memberPrice: number | null;
    stock: number;
    image: string | undefined;
  } | null;
}

interface ProductsClientProps {
  categories: Category[];
  products: Product[];
  isMember?: boolean;
}

export function ProductsClient({ categories, products, isMember = false }: ProductsClientProps) {
  const [page, setPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Calculate min/max prices from products for slider
  const { minProductPrice, maxProductPrice } = useMemo(() => {
    if (products.length === 0) return { minProductPrice: 0, maxProductPrice: 10000 };
    const prices = products.map(p => p.memberPrice ?? p.basePrice);
    return {
      minProductPrice: Math.floor(Math.min(...prices) / 100) * 100,
      maxProductPrice: Math.ceil(Math.max(...prices) / 100) * 100
    };
  }, [products]);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{min: number; max: number}>({ min: 0, max: 10000 });
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);
  const [selectedSleeveTypes, setSelectedSleeveTypes] = useState<string[]>([]);
  
  // Sync price range with product prices on mount
  useEffect(() => {
    setPriceRange({ min: minProductPrice, max: maxProductPrice });
  }, [minProductPrice, maxProductPrice]);

  // Apply filters
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (selectedCategory && product.category.slug !== selectedCategory) {
        return false;
      }
      
      // Price filter
      const price = product.memberPrice ?? product.basePrice;
      if (price < priceRange.min || price > priceRange.max) {
        return false;
      }
      
      // Fabric filter
      if (selectedFabrics.length > 0 && product.material) {
        const matchesFabric = selectedFabrics.some(f => 
          product.material?.toLowerCase().includes(f.toLowerCase())
        );
        if (!matchesFabric) return false;
      }
      
      return true;
    });
  }, [products, selectedCategory, priceRange, selectedFabrics]);

  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);
  const pagedProducts = filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handlePageChange = (next: number) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedSizes([]);
    setPriceRange({ min: minProductPrice, max: maxProductPrice });
    setSelectedFabrics([]);
    setSelectedSleeveTypes([]);
    setPage(1);
  };

  const hasActiveFilters = selectedCategory !== null || selectedSizes.length > 0 || 
    priceRange.min > minProductPrice || 
    priceRange.max < maxProductPrice || selectedFabrics.length > 0 || 
    selectedSleeveTypes.length > 0;

  const activeFilterCount = (selectedCategory ? 1 : 0) + selectedSizes.length + 
    (priceRange.min > minProductPrice || priceRange.max < maxProductPrice ? 1 : 0) + 
    selectedFabrics.length + selectedSleeveTypes.length;

  // Filter sidebar content
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between lg:hidden">
        <h3 className="font-semibold text-lg">Filters</h3>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="text-sm text-primary hover:underline">
            Clear All
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="font-medium text-sm mb-3">Category</h4>
        <div className="space-y-1.5">
          <button
            onClick={() => { setSelectedCategory(null); setPage(1); }}
            className={cn(
              "w-full flex items-center justify-between px-2 py-1.5 rounded text-sm transition-colors",
              selectedCategory === null
                ? "text-primary font-semibold bg-primary/5"
                : "text-muted-foreground hover:text-foreground hover:bg-gray-50"
            )}
          >
            <span>All Categories</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.slug); setPage(1); }}
              className={cn(
                "w-full flex items-center justify-between px-2 py-1.5 rounded text-sm transition-colors",
                selectedCategory === cat.slug
                  ? "text-primary font-semibold bg-primary/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-gray-50"
              )}
            >
              <span>{cat.name}</span>
              <span className="text-xs text-muted-foreground">{cat._count.products}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range with Draggable Slider */}
      <div>
        <h4 className="font-medium text-sm mb-1">Price Range</h4>
        <DualRangeSlider
          min={minProductPrice}
          max={maxProductPrice}
          minValue={priceRange.min}
          maxValue={priceRange.max}
          onChange={(min, max) => {
            setPriceRange({ min, max });
            setPage(1);
          }}
          step={100}
        />
      </div>

      {/* Size Filter */}
      <div>
        <h4 className="font-medium text-sm mb-3">Size</h4>
        <div className="flex flex-wrap gap-2">
          {SIZE_OPTIONS.map((size) => (
            <button
              key={size}
              onClick={() => {
                setSelectedSizes(prev => 
                  prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
                );
                setPage(1);
              }}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md border transition-all",
                selectedSizes.includes(size)
                  ? "bg-[#5B1E7A] text-white border-[#5B1E7A]"
                  : "bg-white text-foreground border-border hover:border-[#5B1E7A]"
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Fabric Filter */}
      <div>
        <h4 className="font-medium text-sm mb-3">Fabric</h4>
        <div className="flex flex-wrap gap-2">
          {FABRIC_OPTIONS.map((fabric) => (
            <button
              key={fabric}
              onClick={() => {
                setSelectedFabrics(prev => 
                  prev.includes(fabric) ? prev.filter(f => f !== fabric) : [...prev, fabric]
                );
                setPage(1);
              }}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md border transition-all",
                selectedFabrics.includes(fabric)
                  ? "bg-[#5B1E7A] text-white border-[#5B1E7A]"
                  : "bg-white text-foreground border-border hover:border-[#5B1E7A]"
              )}
            >
              {fabric}
            </button>
          ))}
        </div>
      </div>

      {/* Sleeve Type Filter */}
      <div>
        <h4 className="font-medium text-sm mb-3">Sleeve Type</h4>
        <div className="space-y-1.5">
          {SLEEVE_TYPE_OPTIONS.map((sleeve) => (
            <label key={sleeve} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedSleeveTypes.includes(sleeve)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedSleeveTypes(prev => [...prev, sleeve]);
                  } else {
                    setSelectedSleeveTypes(prev => prev.filter(s => s !== sleeve));
                  }
                  setPage(1);
                }}
                className="w-4 h-4 accent-[#5B1E7A] rounded"
              />
              <span className="text-sm text-muted-foreground">{sleeve}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6">

      {/* ── Desktop sidebar with all filters ───────────────────── */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24 space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Filters</p>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-xs text-primary hover:underline">
                Clear All
              </button>
            )}
          </div>
          <FilterContent />
        </div>
      </aside>

      {/* ── Main content ───────────────────────────────────────── */}
      <div className="flex-1 min-w-0">

        {/* Mobile filter button */}
        <div className="lg:hidden mb-4">
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-1 w-5 h-5 bg-[#5B1E7A] text-white text-xs rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px] overflow-y-auto">
              <SheetHeader className="pb-4">
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <FilterContent />
            </SheetContent>
          </Sheet>
        </div>

        {/* Active filter badges */}
        {hasActiveFilters && (
          <div className="mb-4 flex flex-wrap gap-2">
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#5B1E7A]/10 text-[#5B1E7A] text-xs rounded-full">
                Category: {categories.find(c => c.slug === selectedCategory)?.name}
                <button onClick={() => setSelectedCategory(null)}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {selectedSizes.map(size => (
              <span key={size} className="inline-flex items-center gap-1 px-2 py-1 bg-[#5B1E7A]/10 text-[#5B1E7A] text-xs rounded-full">
                Size: {size}
                <button onClick={() => setSelectedSizes(prev => prev.filter(s => s !== size))}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {(priceRange.min > minProductPrice || priceRange.max < maxProductPrice) && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#5B1E7A]/10 text-[#5B1E7A] text-xs rounded-full">
                ₹{priceRange.min.toLocaleString()} - ₹{priceRange.max.toLocaleString()}
                <button onClick={() => setPriceRange({ min: minProductPrice, max: maxProductPrice })}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {selectedFabrics.map(fabric => (
              <span key={fabric} className="inline-flex items-center gap-1 px-2 py-1 bg-[#5B1E7A]/10 text-[#5B1E7A] text-xs rounded-full">
                Fabric: {fabric}
                <button onClick={() => setSelectedFabrics(prev => prev.filter(f => f !== fabric))}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {selectedSleeveTypes.map(sleeve => (
              <span key={sleeve} className="inline-flex items-center gap-1 px-2 py-1 bg-[#5B1E7A]/10 text-[#5B1E7A] text-xs rounded-full">
                Sleeve: {sleeve}
                <button onClick={() => setSelectedSleeveTypes(prev => prev.filter(s => s !== sleeve))}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Result count */}
        <div className="mb-5 flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{filteredProducts.length}</span>
            {" "}product{filteredProducts.length !== 1 ? "s" : ""}
            {selectedCategory && (
              <> · <span className="text-foreground">{categories.find(c => c.slug === selectedCategory)?.name}</span></>
            )}
          </p>
          {totalPages > 1 && (
            <p className="text-xs text-muted-foreground">Page {page} of {totalPages}</p>
          )}
        </div>

        {pagedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-5 sm:gap-y-10">
              {pagedProducts.map((product) => (
                <ProductCard key={product.id} product={product} isMember={isMember} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-1">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold transition-colors",
                      p === page
                        ? "bg-primary text-white"
                        : "border border-border text-muted-foreground hover:border-primary hover:text-primary"
                    )}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-sm">No products match your filters.</p>
            <button
              onClick={clearFilters}
              className="mt-3 text-sm font-semibold text-primary hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
