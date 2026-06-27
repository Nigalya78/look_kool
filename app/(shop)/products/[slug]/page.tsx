import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProductGallery } from "@/components/shop/product-gallery";
import { AddToCartButton } from "@/components/shop/add-to-cart-button";
import { ProductReviews } from "@/components/shop/product-reviews";
import { Breadcrumbs } from "@/components/shop/breadcrumbs";
import { ProductDetailsClient } from "@/components/shop/product-details-client";
import { RecommendedProducts } from "@/components/shop/recommended-products";
import { WishlistToggleButton } from "@/components/shop/wishlist-toggle-button";
import { ProductFAQ } from "@/components/shop/product-faq";
import { fallbackProducts } from "@/lib/data/fallback-shop-data";
import { Truck, RotateCcw, ShieldCheck, Star, Heart, Share2, Package, Award } from "lucide-react";

export const revalidate = 3600;

async function getProduct(slug: string) {
  // Security: validate slug format to prevent injection
  if (!/^[a-z0-9-]+$/.test(slug)) return null;

  try {
    const product = await db.product.findUnique({
      where: { slug, isActive: true },
      include: {
        category: true,
        variantAttributes: {
          orderBy: { displayOrder: "asc" },
          include: {
            variantValues: {
              orderBy: { value: "asc" },
              select: {
                id: true,
                value: true,
                hexCode: true,
                images: true,
                variantAttributeId: true,
              },
            },
          },
        },
        productVariants: {
          where: { isActive: true },
          include: {
            values: {
              include: {
                variantValue: {
                  include: { variantAttribute: true },
                },
              },
            },
            images: {
              orderBy: { displayOrder: "asc" },
            },
          },
        },
        reviews: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            rating: true,
            comment: true,
            images: true,
            createdAt: true,
            user: { select: { name: true, image: true } },
          },
        },
        sizeChart: {
          orderBy: { size: "asc" },
        },
        _count: { select: { reviews: true } },
      },
    });

    if (!product) {
      // Try fallback data
      const fallbackProduct = fallbackProducts.find(p => p.slug === slug);
      if (fallbackProduct) {
        return {
          ...fallbackProduct,
          category: { name: fallbackProduct.category.name, slug: fallbackProduct.category.slug },
          reviews: [],
          _count: { reviews: fallbackProduct.reviewCount },
          productVariants: [],
          variantAttributes: [],
          variantMap: {},
          hasVariants: fallbackProduct.hasVariants,
          categoryId: "fallback",
        };
      }
      return null;
    }

    return {
      ...product,
      // Group variants by their attribute combinations
      variantMap: product.productVariants.reduce((acc, variant) => {
        const key = variant.values
          .map((v) => `${v.variantValue.variantAttribute.name}:${v.variantValue.value}`)
          .join("|");
        acc[key] = variant;
        return acc;
      }, {} as Record<string, typeof product.productVariants[0]>),
    };
  } catch {
    // Database error - use fallback
    const fallbackProduct = fallbackProducts.find(p => p.slug === slug);
    if (fallbackProduct) {
      return {
        ...fallbackProduct,
        category: { name: fallbackProduct.category.name, slug: fallbackProduct.category.slug },
        reviews: [],
        _count: { reviews: fallbackProduct.reviewCount },
        productVariants: [],
        variantAttributes: [],
        variantMap: {},
        hasVariants: fallbackProduct.hasVariants,
        categoryId: "fallback",
      };
    }
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  
  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: `${product.name} — LookKool`,
    description: product.description.slice(0, 160),
    openGraph: {
      images: product.images[0] ? [{ url: product.images[0] }] : undefined,
    },
  };
}

async function getRelatedProducts(categoryId: string, currentProductId: string) {
  try {
    // Exclude products from removed categories
    const excludedCategorySlugs = ["sarees", "lehengas", "western-wear", "accessories"];

    // Get related products from same category
    const sameCategoryProducts = await db.product.findMany({
      where: {
        categoryId,
        id: { not: currentProductId },
        isActive: true,
        category: { slug: { notIn: excludedCategorySlugs } },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        images: true,
        basePrice: true,
        comparePrice: true,
        memberPrice: true,
        hasVariants: true,
        material: true,
        productVariants: {
          where: { isActive: true },
          orderBy: { price: "asc" },
          take: 1,
          select: { price: true, comparePrice: true, stock: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 4,
    });

    // Get other products from different categories
    const otherCategoryProducts = await db.product.findMany({
      where: {
        categoryId: { not: categoryId },
        id: { not: currentProductId },
        isActive: true,
        category: { slug: { notIn: excludedCategorySlugs } },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        images: true,
        basePrice: true,
        comparePrice: true,
        memberPrice: true,
        hasVariants: true,
        material: true,
        productVariants: {
          where: { isActive: true },
          orderBy: { price: "asc" },
          take: 1,
          select: { price: true, comparePrice: true, stock: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 4,
    });

    // Combine and shuffle
    const combined = [...sameCategoryProducts, ...otherCategoryProducts];
    return combined.sort(() => Math.random() - 0.5);
  } catch {
    return [];
  }
}

export default async function ProductDetailPage({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ returnTo?: string }>;
}>) {
  const { slug } = await params;
  const { returnTo } = await searchParams;
  const product = await getProduct(slug);

  if (!product) {
    return notFound();
  }

  // Fetch related products for "You Might Also Like" section
  const relatedProducts = await getRelatedProducts(product.categoryId, product.id);

  // Default to first variant if product has variants
  const defaultVariant = product.hasVariants ? product.productVariants[0] : null;

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : null;

  const wishlistProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    price: product.basePrice ?? 0,
    comparePrice: product.comparePrice ?? null,
    memberPrice: product.memberPrice ?? null,
    images: product.images?.length ? product.images : ["/placeholder.jpg"],
    stock: product.stock ?? 0,
    description: product.description ?? "",
    material: product.material ?? null,
    category: { name: product.category.name, slug: product.category.slug },
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 md:px-6 xl:px-8 py-4 border-b border-gray-100">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Products", href: "/products" },
            { label: product.category.name, href: `/categories/${product.category.slug}` },
            { label: product.name },
          ]}
          backButton={returnTo ? { label: "Back to Checkout", href: returnTo } : undefined}
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 xl:px-8 py-8">
        {/* ── Product Detail ── */}
        <ProductDetailsClient
          product={{
            id: product.id,
            name: product.name,
            sku: product.sku,
            slug: product.slug,
            basePrice: product.basePrice,
            comparePrice: product.comparePrice,
            memberPrice: product.memberPrice,
            stock: product.stock,
            images: product.images,
            description: product.description,
            material: product.material,
            category: { name: product.category.name, slug: product.category.slug },
            reviewCount: product._count.reviews,
            avgRating,
          }}
          defaultVariant={null}
        />

        {/* ── Reviews & FAQ Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12 pt-8 border-t border-gray-100">
          {/* Reviews - Takes 2 columns */}
          <div className="lg:col-span-2">
            <ProductReviews
              productId={product.id}
              reviews={product.reviews}
              reviewCount={product._count.reviews}
            />
          </div>

          {/* FAQ - Takes 1 column */}
          <div className="lg:col-span-1">
            <ProductFAQ />
          </div>
        </div>

        {/* ── You Might Also Like ── */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <RecommendedProducts
            categoryId={product.categoryId}
            currentProductId={product.id}
            initialProducts={relatedProducts}
          />
        </div>
      </div>
    </main>
  );
}
