import type { Metadata } from "next";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { HeroSection } from "@/components/shared/hero-section";
import { CollectionCategories } from "@/components/shared/collection-categories";
import { FeatureStrip } from "@/components/shared/feature-strip";
import { TestimonialsSection } from "@/components/shared/testimonials-section";
import { InstagramGallery } from "@/components/shared/instagram-gallery";
import { NewsletterSection } from "@/components/shared/newsletter-section";
import { MembershipBanner } from "@/components/shared/membership-banner";
import { FeaturedProducts } from "@/components/shared/featured-products";
import { PromotionalBanners } from "@/components/shared/promotional-banners";
import { fallbackCategories, fallbackProducts } from "@/lib/data/fallback-shop-data";

export const metadata: Metadata = { 
  title: "LookKool — Premium Women's Fashion Boutique",
  description: "Shop premium women's fashion, ethnic wear, western outfits. India's boutique destination for designer fashion.",
};

/* ─── Data Fetching ─────────────────────────────────────────────────── */

async function getTrendingProducts() {
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
                variantValue: true,
              },
            },
          },
          orderBy: { price: "asc" },
          take: 1,
        },
        _count: { select: { reviews: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    });

    if (products.length === 0) {
      return fallbackProducts.slice(0, 8).map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.basePrice,
        originalPrice: p.comparePrice ?? p.basePrice,
        discount: p.comparePrice && p.comparePrice > p.basePrice
          ? `-${Math.round(((p.comparePrice - p.basePrice) / p.comparePrice) * 100)}%`
          : null,
        rating: 4.5,
        reviews: p.reviewCount,
        img: p.images[0],
        description: p.description,
        memberPrice: p.memberPrice,
        stock: p.stock,
        category: p.category,
      }));
    }

    return products.map((p) => {
      const variant = p.hasVariants && p.productVariants[0] ? p.productVariants[0] : null;
      const price = (variant?.price && variant.price > 0) ? variant.price : p.basePrice;
      const comparePrice = (variant?.comparePrice && variant.comparePrice > 0) ? variant.comparePrice : p.comparePrice;
      const image = variant?.images[0]?.url ?? p.images[0];
      const stock = variant?.stock ?? p.stock; // Use variant stock if available

      // Generate variant label from variant attribute values if available
      const variantLabel = variant?.values
        ?.map((v: { variantValue: { value: string } }) => v.variantValue.value)
        .join(" / ");

      const discount = comparePrice && comparePrice > price 
        ? `-${Math.round(((comparePrice - price) / comparePrice) * 100)}%`
        : null;

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        price,
        originalPrice: comparePrice || price,
        discount,
        rating: 4.5, // Could be calculated from reviews
        reviews: p._count.reviews,
        variantId: variant?.id ?? null,
        sku: variant?.sku ?? p.sku,
        variantLabel,
        hasVariants: p.hasVariants,
        img: image,
        description: p.description,
        memberPrice: (variant?.memberPrice && variant.memberPrice > 0) ? variant.memberPrice : (p.memberPrice && p.memberPrice > 0 ? p.memberPrice : null),
        stock,
        category: p.category,
      };
    });
  } catch {
    return fallbackProducts.slice(0, 4).map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.basePrice,
      originalPrice: p.comparePrice ?? p.basePrice,
      discount: p.comparePrice && p.comparePrice > p.basePrice
        ? `-${Math.round(((p.comparePrice - p.basePrice) / p.comparePrice) * 100)}%`
        : null,
      rating: 4.5,
      reviews: p.reviewCount,
      img: p.images[0],
      description: p.description,
      memberPrice: p.memberPrice,
      stock: p.stock,
      category: p.category,
    }));
  }
}


/* ─── Page ──────────────────────────────────────────────────────────── */

export default async function HomePage() {
  const session = await auth();
  const [trendingProducts, dbUser] = await Promise.all([
    getTrendingProducts(),
    session?.user?.id
      ? db.user.findUnique({ where: { id: session.user.id }, select: { isMember: true } })
      : Promise.resolve(null),
  ]);
  const isMember = dbUser?.isMember ?? false;

  return (
    <main className="overflow-x-hidden">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Collection Categories */}
      <CollectionCategories />
      
      {/* Feature Strip */}
      <FeatureStrip />
      
      {/* Promotional Banners */}
      <PromotionalBanners />
      
      {/* Featured Products */}
      <FeaturedProducts products={trendingProducts} isMember={isMember} />
      
      {/* Membership CTA */}
      <MembershipBanner />
      
      {/* Testimonials */}
      <TestimonialsSection />
      
      {/* Instagram Gallery */}
      <InstagramGallery />
      
      {/* Newsletter */}
      <NewsletterSection />
    </main>
  );
}
