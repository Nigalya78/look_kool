import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from .env.local BEFORE anything else
config({ path: resolve(process.cwd(), ".env.local") });

// Now import db after env is loaded
import { db } from "@/lib/db";

const dressImages = {
  kurtis: [
    "https://images.pexels.com/photos/1093946/pexels-photo-1093946.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/2065195/pexels-photo-2065195.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/3622614/pexels-photo-3622614.jpeg?auto=compress&cs=tinysrgb&w=800",
  ],
  maxiDresses: [
    "https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/2917597/pexels-photo-2917597.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1078958/pexels-photo-1078958.jpeg?auto=compress&cs=tinysrgb&w=800",
  ],
  tops: [
    "https://images.pexels.com/photos/1040424/pexels-photo-1040424.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/2043590/pexels-photo-2043590.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1533166/pexels-photo-1533166.jpeg?auto=compress&cs=tinysrgb&w=800",
  ],
  ethnicWear: [
    "https://images.pexels.com/photos/2689343/pexels-photo-2689343.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/3261141/pexels-photo-3261141.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/2373874/pexels-photo-2373874.jpeg?auto=compress&cs=tinysrgb&w=800",
  ],
};

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data (order matters for FK constraints)
  await db.orderItem.deleteMany();
  await db.order.deleteMany();
  await db.cartItem.deleteMany();
  await db.review.deleteMany();
  await db.productVariantValue.deleteMany();
  await db.variantImage.deleteMany();
  await db.productVariant.deleteMany();
  await db.variantValue.deleteMany();
  await db.variantAttribute.deleteMany();
  await db.product.deleteMany();
  await db.category.deleteMany();
  await db.membershipPlan.deleteMany();

  // Create categories - Women Fashion
  const categories = await Promise.all([
    db.category.create({
      data: {
        name: "Kurtis",
        slug: "kurtis",
        image: dressImages.kurtis[0],
      },
    }),
    db.category.create({
      data: {
        name: "Maxi Dresses",
        slug: "maxi-dresses",
        image: dressImages.maxiDresses[0],
      },
    }),
    db.category.create({
      data: {
        name: "Tops",
        slug: "tops",
        image: dressImages.tops[0],
      },
    }),
    db.category.create({
      data: {
        name: "Ethnic Wear",
        slug: "ethnic-wear",
        image: dressImages.ethnicWear[0],
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // Create products with variants

  // 1. Embroidered Anarkali Kurti with Color and Size variants
  const anarkaliKurti = await db.product.create({
    data: {
      name: "Embroidered Anarkali Kurti",
      slug: "embroidered-anarkali-kurti",
      description:
        "Elegant Anarkali kurti featuring intricate hand embroidery, premium cotton fabric with a comfortable flared fit. Perfect for festive occasions and everyday wear.",
      basePrice: 0,
      hasVariants: true,
      stock: 50,
      sku: "KRT-ANK-001",
      images: dressImages.kurtis,
      material: "Premium Cotton with Embroidery",
      categoryId: categories[0].id,
      weight: 0.4,
      length: 48,
      width: 20,
      height: 5,
    },
  });

  // Create variant attributes for kurti
  const kurtiColorAttr = await db.variantAttribute.create({
    data: {
      name: "Color",
      displayOrder: 0,
      productId: anarkaliKurti.id,
    },
  });

  const kurtiSizeAttr = await db.variantAttribute.create({
    data: {
      name: "Size",
      displayOrder: 1,
      productId: anarkaliKurti.id,
    },
  });

  // Create color values
  const maroon = await db.variantValue.create({
    data: { value: "Royal Maroon", hexCode: "#800000", variantAttributeId: kurtiColorAttr.id },
  });
  const navyBlue = await db.variantValue.create({
    data: { value: "Navy Blue", hexCode: "#1e3a5f", variantAttributeId: kurtiColorAttr.id },
  });
  const emerald = await db.variantValue.create({
    data: { value: "Emerald Green", hexCode: "#2d5a3d", variantAttributeId: kurtiColorAttr.id },
  });
  const peach = await db.variantValue.create({
    data: { value: "Soft Peach", hexCode: "#ffdab9", variantAttributeId: kurtiColorAttr.id },
  });

  // Create size values
  const small = await db.variantValue.create({
    data: { value: "S (36)", variantAttributeId: kurtiSizeAttr.id },
  });
  const medium = await db.variantValue.create({
    data: { value: "M (38)", variantAttributeId: kurtiSizeAttr.id },
  });
  const large = await db.variantValue.create({
    data: { value: "L (40)", variantAttributeId: kurtiSizeAttr.id },
  });
  const xlarge = await db.variantValue.create({
    data: { value: "XL (42)", variantAttributeId: kurtiSizeAttr.id },
  });

  // Create product variants with specific prices
  const kurtiVariants = [
    { sku: "KRT-ANK-MRN-S", price: 1299, values: [maroon.id, small.id], weight: 0.38, length: 46, width: 18, height: 4 },
    { sku: "KRT-ANK-MRN-M", price: 1299, values: [maroon.id, medium.id], weight: 0.4, length: 48, width: 20, height: 5 },
    { sku: "KRT-ANK-MRN-L", price: 1399, values: [maroon.id, large.id], weight: 0.42, length: 50, width: 22, height: 5 },
    { sku: "KRT-ANK-MRN-XL", price: 1399, values: [maroon.id, xlarge.id], weight: 0.45, length: 52, width: 24, height: 5 },
    { sku: "KRT-ANK-NVY-S", price: 1299, values: [navyBlue.id, small.id], weight: 0.38, length: 46, width: 18, height: 4 },
    { sku: "KRT-ANK-NVY-M", price: 1299, values: [navyBlue.id, medium.id], weight: 0.4, length: 48, width: 20, height: 5 },
    { sku: "KRT-ANK-NVY-L", price: 1399, values: [navyBlue.id, large.id], weight: 0.42, length: 50, width: 22, height: 5 },
    { sku: "KRT-ANK-NVY-XL", price: 1399, values: [navyBlue.id, xlarge.id], weight: 0.45, length: 52, width: 24, height: 5 },
    { sku: "KRT-ANK-EMR-S", price: 1399, values: [emerald.id, small.id], weight: 0.38, length: 46, width: 18, height: 4 },
    { sku: "KRT-ANK-EMR-M", price: 1399, values: [emerald.id, medium.id], weight: 0.4, length: 48, width: 20, height: 5 },
    { sku: "KRT-ANK-EMR-L", price: 1499, values: [emerald.id, large.id], weight: 0.42, length: 50, width: 22, height: 5 },
    { sku: "KRT-ANK-EMR-XL", price: 1499, values: [emerald.id, xlarge.id], weight: 0.45, length: 52, width: 24, height: 5 },
    { sku: "KRT-ANK-PCH-S", price: 1299, values: [peach.id, small.id], weight: 0.38, length: 46, width: 18, height: 4 },
    { sku: "KRT-ANK-PCH-M", price: 1299, values: [peach.id, medium.id], weight: 0.4, length: 48, width: 20, height: 5 },
    { sku: "KRT-ANK-PCH-L", price: 1399, values: [peach.id, large.id], weight: 0.42, length: 50, width: 22, height: 5 },
    { sku: "KRT-ANK-PCH-XL", price: 1399, values: [peach.id, xlarge.id], weight: 0.45, length: 52, width: 24, height: 5 },
  ];

  for (const variant of kurtiVariants) {
    const pv = await db.productVariant.create({
      data: {
        sku: variant.sku,
        price: variant.price,
        comparePrice: variant.price * 1.2,
        memberPrice: variant.price * 0.85,
        stock: 15,
        weight: variant.weight,
        length: variant.length,
        width: variant.width,
        height: variant.height,
        productId: anarkaliKurti.id,
        values: {
          create: variant.values.map((vid) => ({ variantValueId: vid })),
        },
      },
    });

    await db.variantImage.createMany({
      data: dressImages.kurtis.map((url, idx) => ({
        url,
        displayOrder: idx,
        productVariantId: pv.id,
      })),
    });
  }

  console.log("✅ Created Embroidered Anarkali Kurti with 16 variants");

  // 2. Floral Print Maxi Dress with Size variants
  const maxiDress = await db.product.create({
    data: {
      name: "Floral Print Maxi Dress",
      slug: "floral-print-maxi-dress",
      description:
        "Beautiful floral print maxi dress with flowing silhouette and comfortable fit. Perfect for summer outings, beach vacations, and casual gatherings.",
      basePrice: 0,
      hasVariants: true,
      stock: 40,
      sku: "DRS-MAX-001",
      images: dressImages.maxiDresses,
      material: "Rayon",
      categoryId: categories[1].id,
      weight: 0.35,
      length: 55,
      width: 18,
      height: 4,
    },
  });

  const maxiSizeAttr = await db.variantAttribute.create({
    data: { name: "Size", displayOrder: 0, productId: maxiDress.id },
  });

  const maxiXS = await db.variantValue.create({
    data: { value: "XS (34)", variantAttributeId: maxiSizeAttr.id },
  });
  const maxiS = await db.variantValue.create({
    data: { value: "S (36)", variantAttributeId: maxiSizeAttr.id },
  });
  const maxiM = await db.variantValue.create({
    data: { value: "M (38)", variantAttributeId: maxiSizeAttr.id },
  });
  const maxiL = await db.variantValue.create({
    data: { value: "L (40)", variantAttributeId: maxiSizeAttr.id },
  });
  const maxiXL = await db.variantValue.create({
    data: { value: "XL (42)", variantAttributeId: maxiSizeAttr.id },
  });

  const maxiVariants = [
    { sku: "DRS-MAX-XS", price: 1699, values: [maxiXS.id], weight: 0.32, length: 53, width: 16, height: 3 },
    { sku: "DRS-MAX-S", price: 1699, values: [maxiS.id], weight: 0.33, length: 54, width: 17, height: 4 },
    { sku: "DRS-MAX-M", price: 1799, values: [maxiM.id], weight: 0.35, length: 55, width: 18, height: 4 },
    { sku: "DRS-MAX-L", price: 1799, values: [maxiL.id], weight: 0.37, length: 56, width: 19, height: 4 },
    { sku: "DRS-MAX-XL", price: 1899, values: [maxiXL.id], weight: 0.39, length: 57, width: 20, height: 4 },
  ];

  for (const variant of maxiVariants) {
    const pv = await db.productVariant.create({
      data: {
        sku: variant.sku,
        price: variant.price,
        comparePrice: variant.price * 1.2,
        memberPrice: variant.price * 0.85,
        stock: 12,
        weight: variant.weight,
        length: variant.length,
        width: variant.width,
        height: variant.height,
        productId: maxiDress.id,
        values: {
          create: variant.values.map((vid) => ({ variantValueId: vid })),
        },
      },
    });

    await db.variantImage.createMany({
      data: dressImages.maxiDresses.map((url, idx) => ({
        url,
        displayOrder: idx,
        productVariantId: pv.id,
      })),
    });
  }

  console.log("✅ Created Floral Print Maxi Dress with 5 variants");

  // 3. Simple products without variants - Women Fashion
  const simpleProducts = [
    // Kurtis (Category 0)
    {
      name: "Straight Cut Kurti",
      slug: "straight-cut-kurti",
      description: "Simple and elegant straight cut kurti with minimal embroidery. Office wear essential.",
      basePrice: 899, comparePrice: 1199, memberPrice: 799, stock: 35,
      sku: "KRT-SCT-001", images: dressImages.kurtis,
      material: "Cotton Blend", categoryId: categories[0].id,
      weight: 0.35, length: 46, width: 18, height: 4,
    },
    {
      name: "A-Line Cotton Kurti",
      slug: "a-line-cotton-kurti",
      description: "Comfortable A-line kurti in pure cotton with block print design. Perfect for daily wear.",
      basePrice: 799, comparePrice: 999, memberPrice: 699, stock: 45,
      sku: "KRT-ALN-001", images: dressImages.kurtis,
      material: "100% Cotton", categoryId: categories[0].id,
      weight: 0.32, length: 44, width: 18, height: 4,
    },
    {
      name: "Printed Rayon Kurti",
      slug: "printed-rayon-kurti",
      description: "Stylish printed rayon kurti with 3/4 sleeves. Soft and flowy fabric for all-day comfort.",
      basePrice: 699, comparePrice: 899, memberPrice: 599, stock: 40,
      sku: "KRT-PRN-001", images: dressImages.kurtis,
      material: "Rayon", categoryId: categories[0].id,
      weight: 0.28, length: 42, width: 17, height: 3,
    },
    {
      name: "Long Designer Kurti",
      slug: "long-designer-kurti",
      description: "Elegant long designer kurti with intricate embroidery. Perfect for festive occasions.",
      basePrice: 1499, comparePrice: 1899, memberPrice: 1299, stock: 25,
      sku: "KRT-LNG-001", images: dressImages.kurtis,
      material: "Cotton Silk", categoryId: categories[0].id,
      weight: 0.45, length: 50, width: 20, height: 5,
    },

    // Maxi Dresses (Category 1)
    {
      name: "Boho Floral Maxi Dress",
      slug: "boho-floral-maxi-dress",
      description: "Flowy bohemian style floral maxi dress with elastic waist. Perfect for summer vacations.",
      basePrice: 1699, comparePrice: 2199, memberPrice: 1499, stock: 30,
      sku: "MXD-BHM-001", images: dressImages.maxiDresses,
      material: "Viscose", categoryId: categories[1].id,
      weight: 0.35, length: 55, width: 20, height: 4,
    },
    {
      name: "Evening Gown Maxi",
      slug: "evening-gown-maxi",
      description: "Elegant evening maxi dress with sweetheart neckline. Perfect for parties and dinners.",
      basePrice: 2499, comparePrice: 3199, memberPrice: 2199, stock: 20,
      sku: "MXD-EVG-001", images: dressImages.maxiDresses,
      material: "Polyester Blend", categoryId: categories[1].id,
      weight: 0.5, length: 60, width: 18, height: 5,
    },
    {
      name: "Beach Maxi Dress",
      slug: "beach-maxi-dress",
      description: "Lightweight beach maxi dress with tropical print. Perfect for beach holidays.",
      basePrice: 1299, comparePrice: 1699, memberPrice: 1099, stock: 35,
      sku: "MXD-BCH-001", images: dressImages.maxiDresses,
      material: "Chiffon", categoryId: categories[1].id,
      weight: 0.25, length: 52, width: 18, height: 3,
    },

    // Tops (Category 2)
    {
      name: "Printed Cotton Top",
      slug: "printed-cotton-top",
      description: "Casual printed cotton top with round neck and short sleeves. Perfect for everyday wear.",
      basePrice: 699, comparePrice: 899, memberPrice: 599, stock: 40,
      sku: "TOP-PCT-001", images: dressImages.tops,
      material: "100% Cotton", categoryId: categories[2].id,
      weight: 0.25, length: 25, width: 18, height: 3,
    },
    {
      name: "Crop Top",
      slug: "stylish-crop-top",
      description: "Trendy crop top with ribbed fabric. Pair with high-waist jeans or skirts.",
      basePrice: 599, comparePrice: 799, memberPrice: 499, stock: 50,
      sku: "TOP-CRP-001", images: dressImages.tops,
      material: "Ribbed Cotton", categoryId: categories[2].id,
      weight: 0.18, length: 18, width: 16, height: 2,
    },
    {
      name: "Off Shoulder Top",
      slug: "off-shoulder-top",
      description: "Stylish off-shoulder top with smocked bodice. Perfect for parties and date nights.",
      basePrice: 899, comparePrice: 1199, memberPrice: 799, stock: 30,
      sku: "TOP-OFS-001", images: dressImages.tops,
      material: "Polyester", categoryId: categories[2].id,
      weight: 0.22, length: 22, width: 16, height: 3,
    },
    {
      name: "Peplum Top",
      slug: "peplum-top",
      description: "Elegant peplum top with V-neckline. Flattering fit for all body types.",
      basePrice: 999, comparePrice: 1299, memberPrice: 899, stock: 28,
      sku: "TOP-PPL-001", images: dressImages.tops,
      material: "Crepe", categoryId: categories[2].id,
      weight: 0.28, length: 24, width: 17, height: 3,
    },

    // Ethnic Wear (Category 3)
    {
      name: "Embroidered Palazzo Set",
      slug: "embroidered-palazzo-set",
      description: "Elegant kurti and palazzo set with delicate embroidery. Comfortable yet stylish ethnic wear.",
      basePrice: 2499, comparePrice: 3199, memberPrice: 2199, stock: 20,
      sku: "ETH-PAL-001", images: dressImages.ethnicWear,
      material: "Rayon", categoryId: categories[3].id,
      weight: 0.5, length: 48, width: 20, height: 5,
    },
    {
      name: "Sharara Suit Set",
      slug: "sharara-suit-set",
      description: "Beautiful sharara suit set with mirror work. Perfect for festivals and celebrations.",
      basePrice: 3299, comparePrice: 4299, memberPrice: 2899, stock: 15,
      sku: "ETH-SHR-001", images: dressImages.ethnicWear,
      material: "Georgette", categoryId: categories[3].id,
      weight: 0.7, length: 50, width: 22, height: 6,
    },
    {
      name: "Anarkali Suit",
      slug: "anarkali-suit",
      description: "Classic Anarkali suit with heavy embroidery. Royal look for special occasions.",
      basePrice: 4299, comparePrice: 5499, memberPrice: 3799, stock: 12,
      sku: "ETH-ANR-001", images: dressImages.ethnicWear,
      material: "Silk Blend", categoryId: categories[3].id,
      weight: 0.9, length: 55, width: 25, height: 8,
    },

  ];

  for (const product of simpleProducts) {
    await db.product.create({
      data: product,
    });
  }

  console.log(`✅ Created ${simpleProducts.length} simple products`);

  // 4. Membership plans
  await db.membershipPlan.createMany({
    data: [
      {
        name: "Monthly Premium",
        description: "Full access to member pricing and perks, billed monthly.",
        price: 9.99,
        durationDays: 30,
        discountPercent: 10,
        isActive: true,
        isDefault: false,
      },
      {
        name: "Annual Premium",
        description: "Best value — full member benefits for a full year.",
        price: 89.99,
        durationDays: 365,
        discountPercent: 20,
        isActive: true,
        isDefault: true,
      },
      {
        name: "6-Month Premium",
        description: "6 months of member pricing, free express delivery and more.",
        price: 49.99,
        durationDays: 180,
        discountPercent: 15,
        isActive: true,
        isDefault: false,
      },
    ],
  });

  console.log("✅ Created 3 membership plans");

  console.log("\n🎉 Database seeded successfully!");
  console.log(`📊 Summary:`);
  console.log(`   - ${categories.length} Categories`);
  console.log(`   - 5 Products (2 with variants, 3 simple)`);
  console.log(`   - 15 Product Variants`);
  console.log(`   - 3 Membership Plans`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
