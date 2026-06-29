import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { ProductsClient } from "@/components/shop/products-client";
import { fallbackCategories, fallbackProducts } from "@/lib/data/fallback-shop-data";

export const metadata: Metadata = {
  title: "All Products — LookKool",
  description: "Browse our designer women's fashion collection. Kurtis, sarees, lehengas, western wear and more.",
};

export const revalidate = 3600;

async function getProducts() {
  try {
    const products = await db.product.findMany({
      where: { isActive: true },
      include: {
        category: { select: { name: true, slug: true } },
        productVariants: {
          where: { isActive: true },
          include: {
            images: { take: 1, orderBy: { displayOrder: "asc" } },
            values: {
              include: {
                variantValue: {
                  include: { variantAttribute: { select: { name: true } } },
                },
              },
            },
          },
          orderBy: { price: "asc" },
          take: 1,
        },
        _count: { select: { reviews: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    if (products.length === 0) {
      return fallbackProducts;
    }

    return products.map((p) => {
      // Collect all size values across all active variants
      const sizes = Array.from(new Set(
        p.productVariants.flatMap((v) =>
          v.values
            .filter((vv) => vv.variantValue.variantAttribute.name.toLowerCase() === "size")
            .map((vv) => vv.variantValue.value)
        )
      ));

      const variant = p.hasVariants && p.productVariants[0] ? p.productVariants[0] : null;
      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        basePrice: p.basePrice,
        comparePrice: p.comparePrice,
        memberPrice: p.memberPrice,
        stock: p.stock,
        images: p.images,
        material: p.material,
        fitType: p.fitType,
        sizes,
        hasVariants: p.hasVariants,
        category: p.category,
        reviewCount: p._count.reviews,
        variant: variant ? {
          id: variant.id,
          price: variant.price,
          comparePrice: variant.comparePrice,
          memberPrice: variant.memberPrice,
          stock: variant.stock,
          image: variant.images[0]?.url,
        } : null,
      };
    });
  } catch {
    return fallbackProducts;
  }
}

async function getCategories() {
  try {
    const categories = await db.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    });

    return categories.length > 0 ? categories : fallbackCategories;
  } catch {
    return fallbackCategories;
  }
}

export default async function ProductsPage() {
  const session = await auth();
  const [products, categories, dbUser] = await Promise.all([
    getProducts(),
    getCategories(),
    session?.user?.id
      ? db.user.findUnique({ where: { id: session.user.id }, select: { isMember: true } })
      : Promise.resolve(null),
  ]);
  const isMember = dbUser?.isMember ?? false;

  return (
    <main className="min-h-screen bg-background">

      {/* ── Page header ───────────────────────────────────────── */}
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-4 md:px-6 xl:px-8 py-6 md:py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="shrink-0">
              <Image
                src="/lookkool_logo.png"
                alt="LookKool"
                width={430}
                height={131}
                className="h-10 md:h-12 w-auto object-contain"
              />
            </Link>
            <div className="h-8 w-px bg-border hidden sm:block" />
            <div>
              <h1 className="text-2xl font-[family-name:var(--font-playfair)] font-semibold text-[#111111]">All Products</h1>
              <nav className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                <span>/</span>
                <span className="text-foreground">Products</span>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Products with Client-side Filtering */}
      <div className="container mx-auto px-4 md:px-6 xl:px-8 py-6 md:py-8">
        <ProductsClient categories={categories} products={products} isMember={isMember} />
      </div>
    </main>
  );
}
