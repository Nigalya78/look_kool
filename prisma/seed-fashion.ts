import { config } from "dotenv";

// Load both .env and .env.local (local takes precedence) - matches prisma.config.ts
config({ path: ".env" });
config({ path: ".env.local", override: true });

import { db } from "@/lib/db";

const fashionImages = {
  kurtis: [
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1583391733954-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1610030469629-276faf63f469?auto=format&fit=crop&w=800&q=80",
  ],
  maxiDresses: [
    "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80",
  ],
  tops: [
    "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1551163943-3f6a29e39426?auto=format&fit=crop&w=800&q=80",
  ],
  ethnicWear: [
    "https://images.unsplash.com/photo-1549488344-cbb6c34cf08b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1609245347659-30d6236adb8f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
  ],
};

async function main() {
  console.log("🌸 Seeding LookKool Fashion Boutique...");

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

  // Create fashion categories
  const categories = await Promise.all([
    db.category.create({
      data: {
        name: "Kurtis",
        slug: "kurtis",
        image: fashionImages.kurtis[0],
      },
    }),
    db.category.create({
      data: {
        name: "Maxi Dresses",
        slug: "maxi-dresses",
        image: fashionImages.maxiDresses[0],
      },
    }),
    db.category.create({
      data: {
        name: "Tops",
        slug: "tops",
        image: fashionImages.tops[0],
      },
    }),
    db.category.create({
      data: {
        name: "Ethnic Wear",
        slug: "ethnic-wear",
        image: fashionImages.ethnicWear[0],
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} fashion categories`);

  // 1. Designer Kurti with Color and Size variants
  const kurti = await db.product.create({
    data: {
      name: "Embroidered Anarkali Kurti",
      slug: "embroidered-anarkali-kurti",
      description:
        "Elegant Anarkali kurti featuring intricate hand embroidery, premium cotton fabric with a comfortable fit. Perfect for festive occasions and casual wear.",
      basePrice: 0,
      hasVariants: true,
      stock: 100,
      sku: "LK-KRT-001",
      images: fashionImages.kurtis,
      material: "Premium Cotton with Embroidery",
      roomType: "Ethnic Wear",
      categoryId: categories[0].id,
      weight: 0.5,
      length: 110,
      width: 60,
      height: 5,
    },
  });

  // Create variant attributes for kurti
  const kurtiColorAttr = await db.variantAttribute.create({
    data: {
      name: "Color",
      displayOrder: 0,
      productId: kurti.id,
    },
  });

  const kurtiSizeAttr = await db.variantAttribute.create({
    data: {
      name: "Size",
      displayOrder: 1,
      productId: kurti.id,
    },
  });

  // Create color values
  const royalBlue = await db.variantValue.create({
    data: { value: "Royal Blue", hexCode: "#1e3a8a", variantAttributeId: kurtiColorAttr.id },
  });
  const maroon = await db.variantValue.create({
    data: { value: "Maroon", hexCode: "#720e1e", variantAttributeId: kurtiColorAttr.id },
  });
  const emeraldGreen = await db.variantValue.create({
    data: { value: "Emerald Green", hexCode: "#064e3b", variantAttributeId: kurtiColorAttr.id },
  });
  const mustardYellow = await db.variantValue.create({
    data: { value: "Mustard Yellow", hexCode: "#b45309", variantAttributeId: kurtiColorAttr.id },
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
    { sku: "LK-KRT-BLU-S", price: 1299, values: [royalBlue.id, small.id], weight: 0.45, length: 108, width: 58, height: 4 },
    { sku: "LK-KRT-BLU-M", price: 1299, values: [royalBlue.id, medium.id], weight: 0.5, length: 110, width: 60, height: 5 },
    { sku: "LK-KRT-BLU-L", price: 1399, values: [royalBlue.id, large.id], weight: 0.55, length: 112, width: 62, height: 5 },
    { sku: "LK-KRT-BLU-XL", price: 1399, values: [royalBlue.id, xlarge.id], weight: 0.6, length: 114, width: 64, height: 5 },
    { sku: "LK-KRT-MRN-S", price: 1299, values: [maroon.id, small.id], weight: 0.45, length: 108, width: 58, height: 4 },
    { sku: "LK-KRT-MRN-M", price: 1299, values: [maroon.id, medium.id], weight: 0.5, length: 110, width: 60, height: 5 },
    { sku: "LK-KRT-MRN-L", price: 1399, values: [maroon.id, large.id], weight: 0.55, length: 112, width: 62, height: 5 },
    { sku: "LK-KRT-MRN-XL", price: 1399, values: [maroon.id, xlarge.id], weight: 0.6, length: 114, width: 64, height: 5 },
    { sku: "LK-KRT-EMR-S", price: 1399, values: [emeraldGreen.id, small.id], weight: 0.45, length: 108, width: 58, height: 4 },
    { sku: "LK-KRT-EMR-M", price: 1399, values: [emeraldGreen.id, medium.id], weight: 0.5, length: 110, width: 60, height: 5 },
    { sku: "LK-KRT-EMR-L", price: 1499, values: [emeraldGreen.id, large.id], weight: 0.55, length: 112, width: 62, height: 5 },
    { sku: "LK-KRT-EMR-XL", price: 1499, values: [emeraldGreen.id, xlarge.id], weight: 0.6, length: 114, width: 64, height: 5 },
    { sku: "LK-KRT-YLW-S", price: 1199, values: [mustardYellow.id, small.id], weight: 0.45, length: 108, width: 58, height: 4 },
    { sku: "LK-KRT-YLW-M", price: 1199, values: [mustardYellow.id, medium.id], weight: 0.5, length: 110, width: 60, height: 5 },
    { sku: "LK-KRT-YLW-L", price: 1299, values: [mustardYellow.id, large.id], weight: 0.55, length: 112, width: 62, height: 5 },
    { sku: "LK-KRT-YLW-XL", price: 1299, values: [mustardYellow.id, xlarge.id], weight: 0.6, length: 114, width: 64, height: 5 },
  ];

  for (const variant of kurtiVariants) {
    const pv = await db.productVariant.create({
      data: {
        sku: variant.sku,
        price: variant.price,
        comparePrice: variant.price * 1.3,
        memberPrice: variant.price * 0.85,
        stock: 20,
        weight: variant.weight,
        length: variant.length,
        width: variant.width,
        height: variant.height,
        productId: kurti.id,
        values: {
          create: variant.values.map((vid) => ({ variantValueId: vid })),
        },
      },
    });

    await db.variantImage.createMany({
      data: fashionImages.kurtis.map((url, idx) => ({
        url,
        displayOrder: idx,
        productVariantId: pv.id,
      })),
    });
  }

  console.log("✅ Created Embroidered Anarkali Kurti with 16 variants");

  // 2. Maxi Dress with Size variants
  const maxiDress = await db.product.create({
    data: {
      name: "Floral Print Maxi Dress",
      slug: "floral-print-maxi-dress",
      description:
        "Beautiful floral print maxi dress with flowing silhouette. Perfect for summer outings, beach vacations, and casual gatherings. Breathable rayon fabric.",
      basePrice: 0,
      hasVariants: true,
      stock: 60,
      sku: "LK-MAX-001",
      images: fashionImages.maxiDresses,
      material: "Rayon",
      roomType: "Western Wear",
      categoryId: categories[1].id,
      weight: 0.4,
      length: 140,
      width: 50,
      height: 5,
    },
  });

  const maxiSizeAttr = await db.variantAttribute.create({
    data: { name: "Size", displayOrder: 0, productId: maxiDress.id },
  });

  const maxiS = await db.variantValue.create({
    data: { value: "S", variantAttributeId: maxiSizeAttr.id },
  });
  const maxiM = await db.variantValue.create({
    data: { value: "M", variantAttributeId: maxiSizeAttr.id },
  });
  const maxiL = await db.variantValue.create({
    data: { value: "L", variantAttributeId: maxiSizeAttr.id },
  });
  const maxiXL = await db.variantValue.create({
    data: { value: "XL", variantAttributeId: maxiSizeAttr.id },
  });

  const maxiVariants = [
    { sku: "LK-MAX-S", price: 1899, values: [maxiS.id], weight: 0.35, length: 138, width: 48, height: 4 },
    { sku: "LK-MAX-M", price: 1899, values: [maxiM.id], weight: 0.4, length: 140, width: 50, height: 5 },
    { sku: "LK-MAX-L", price: 1999, values: [maxiL.id], weight: 0.45, length: 142, width: 52, height: 5 },
    { sku: "LK-MAX-XL", price: 1999, values: [maxiXL.id], weight: 0.5, length: 144, width: 54, height: 5 },
  ];

  for (const variant of maxiVariants) {
    const pv = await db.productVariant.create({
      data: {
        sku: variant.sku,
        price: variant.price,
        comparePrice: variant.price * 1.25,
        memberPrice: variant.price * 0.9,
        stock: 15,
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
      data: fashionImages.maxiDresses.map((url, idx) => ({
        url,
        displayOrder: idx,
        productVariantId: pv.id,
      })),
    });
  }

  console.log("✅ Created Floral Print Maxi Dress with 4 variants");

  // 3. Simple products without variants
  const simpleProducts = [
    {
      name: "Printed Cotton Top",
      slug: "printed-cotton-top",
      description: "Casual printed cotton top with round neck and short sleeves. Perfect for everyday wear.",
      basePrice: 699, comparePrice: 899, memberPrice: 599, stock: 50,
      sku: "LK-TOP-001", images: fashionImages.tops,
      material: "100% Cotton", roomType: "Western Wear", categoryId: categories[2].id,
      weight: 0.3, length: 65, width: 45, height: 3,
    },
    {
      name: "Embroidered Palazzo Set",
      slug: "embroidered-palazzo-set",
      description: "Elegant kurti and palazzo set with delicate embroidery. Comfortable yet stylish ethnic wear.",
      basePrice: 2499, comparePrice: 3199, memberPrice: 2199, stock: 25,
      sku: "LK-ETH-001", images: fashionImages.ethnicWear,
      material: "Rayon", roomType: "Ethnic Wear", categoryId: categories[3].id,
      weight: 0.6, length: 110, width: 40, height: 8,
    },
    {
      name: "Off-Shoulder Crop Top",
      slug: "off-shoulder-crop-top",
      description: "Trendy off-shoulder crop top in stretchable fabric. Perfect for parties and casual outings.",
      basePrice: 999, comparePrice: 1299, memberPrice: 849, stock: 35,
      sku: "LK-TOP-002", images: fashionImages.tops,
      material: "Polyester Spandex", roomType: "Western Wear", categoryId: categories[2].id,
      weight: 0.25, length: 40, width: 35, height: 3,
    },
    {
      name: "Straight Cut Kurti",
      slug: "straight-cut-kurti",
      description: "Simple and elegant straight cut kurti with minimal embroidery. Office wear essential.",
      basePrice: 899, comparePrice: 1199, memberPrice: 799, stock: 45,
      sku: "LK-KRT-002", images: fashionImages.kurtis,
      material: "Cotton Blend", roomType: "Ethnic Wear", categoryId: categories[0].id,
      weight: 0.4, length: 100, width: 50, height: 4,
    },
    {
      name: "Angrakha Style Kurti",
      slug: "angrakha-style-kurti",
      description: "Traditional angrakha style kurti with tie-up detail and mirror work. Festive wear special.",
      basePrice: 1699, comparePrice: 2199, memberPrice: 1499, stock: 20,
      sku: "LK-KRT-003", images: fashionImages.kurtis,
      material: "Cotton with Mirror Work", roomType: "Ethnic Wear", categoryId: categories[0].id,
      weight: 0.5, length: 105, width: 55, height: 5,
    },
  ];

  for (const product of simpleProducts) {
    await db.product.create({
      data: product,
    });
  }

  console.log(`✅ Created ${simpleProducts.length} simple fashion products`);

  // 5. Membership plans
  await db.membershipPlan.createMany({
    data: [
      {
        name: "Monthly Premium",
        description: "Full access to member pricing and perks, billed monthly.",
        price: 199,
        durationDays: 30,
        discountPercent: 10,
        isActive: true,
        isDefault: false,
      },
      {
        name: "Annual Premium",
        description: "Best value — full member benefits for a full year.",
        price: 1499,
        durationDays: 365,
        discountPercent: 20,
        isActive: true,
        isDefault: true,
      },
      {
        name: "6-Month Premium",
        description: "6 months of member pricing, free express delivery and more.",
        price: 799,
        durationDays: 180,
        discountPercent: 15,
        isActive: true,
        isDefault: false,
      },
    ],
  });

  console.log("✅ Created 3 membership plans");

  console.log("\n🎉 LookKool Fashion Boutique seeded successfully!");
  console.log(`📊 Summary:`);
  console.log(`   - ${categories.length} Fashion Categories`);
  console.log(`   - 10 Fashion Products (3 with variants, 7 simple)`);
  console.log(`   - 18 Product Variants`);
  console.log(`   - 3 Membership Plans`);
  console.log(`\n🏪 Categories: Kurtis, Maxi Dresses, Tops, Ethnic Wear`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
