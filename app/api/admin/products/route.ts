import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import slugify from "slugify";

// Validation schemas
const variantValueSchema = z.object({
  id: z.string(), // temp ID from frontend
  value: z.string(),
  hexCode: z.string().optional().nullable(),
  images: z.array(z.string()).optional(),
});

const variantAttributeSchema = z.object({
  id: z.string(), // temp ID from frontend
  name: z.string(),
  displayOrder: z.number().default(0),
  isPrimary: z.boolean().default(false),
  values: z.array(variantValueSchema),
});

const productVariantSchema = z.object({
  sku: z.string().min(1),
  price: z.number().nonnegative(),
  comparePrice: z.number().optional().nullable(),
  memberPrice: z.number().optional().nullable(),
  stock: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  valueIds: z.array(z.string()), // Array of variant value IDs
  images: z.array(z.string()).optional(),
  weight: z.number().optional().nullable(),
  length: z.number().optional().nullable(),
  width: z.number().optional().nullable(),
  height: z.number().optional().nullable(),
});

// Security constants
const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
const MAX_IMAGES_COUNT = 10;
const MAX_NAME_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 5000;
const MAX_SKU_LENGTH = 50;

// Custom validation for image size (handles both base64 and URLs)
const validateImageSize = (imageString: string): boolean => {
  // If it's a URL (starts with http), skip size validation
  // (images are already uploaded to R2 and size-checked during upload)
  if (imageString.startsWith('http://') || imageString.startsWith('https://')) {
    return true;
  }
  
  // Handle base64 images (legacy support)
  if (imageString.startsWith('data:image/')) {
    const base64 = imageString.replace(/^data:image\/\w+;base64,/, '');
    const sizeInBytes = (base64.length * 3) / 4;
    return sizeInBytes <= MAX_IMAGE_SIZE_BYTES;
  }
  
  // Unknown format, reject
  return false;
};

const createProductSchema = z.object({
  name: z.string().min(1).max(MAX_NAME_LENGTH),
  description: z.string().max(MAX_DESCRIPTION_LENGTH).optional().nullable(),
  basePrice: z.number().nonnegative(),
  comparePrice: z.number().optional().nullable(),
  memberPrice: z.number().optional().nullable(),
  stock: z.number().int().min(0).default(0),
  sku: z.string().min(1).max(MAX_SKU_LENGTH),
  categoryId: z.string(),
  material: z.string().optional().nullable(),
  roomType: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  hasVariants: z.boolean().default(false),
  images: z.array(z.string())
    .max(MAX_IMAGES_COUNT, `Maximum ${MAX_IMAGES_COUNT} images allowed`)
    .refine(
      (images) => images.every(img => validateImageSize(img)),
      `Each image must be under ${MAX_IMAGE_SIZE_MB}MB or a valid URL`
    )
    .default([]),
  weight: z.number().optional().nullable(),
  length: z.number().optional().nullable(),
  width: z.number().optional().nullable(),
  height: z.number().optional().nullable(),
  // For products with variants
  variantAttributes: z.array(variantAttributeSchema).optional(),
  productVariants: z.array(productVariantSchema).optional(),
});

// GET /api/admin/products - List all products with pagination
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const status = searchParams.get("status") || "";

  const skip = (page - 1) * limit;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.categoryId = category;
    }

    if (status === "active") {
      where.isActive = true;
    } else if (status === "inactive") {
      where.isActive = false;
    }

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          category: { select: { name: true, slug: true } },
          productVariants: {
            select: {
              stock: true,
            },
          },
          _count: {
            select: {
              productVariants: true,
            },
          },
        },
      }),
      db.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[GET /api/admin/products]", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST /api/admin/products - Create a new product
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = createProductSchema.parse(body);

    // Generate unique slug
    const baseSlug = slugify(data.name, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;
    while (await db.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    // 1. Create the base product first (we need its ID)
    const product = await db.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description || "",
        basePrice: data.basePrice,
        comparePrice: data.comparePrice,
        memberPrice: data.memberPrice,
        stock: data.stock,
        sku: data.sku,
        categoryId: data.categoryId,
        material: data.material,
        roomType: data.roomType,
        isActive: data.isActive,
        hasVariants: data.hasVariants,
        images: data.images,
        weight: data.weight,
        length: data.length,
        width: data.width,
        height: data.height,
      },
    });

    // 2. Create variant attributes + values in parallel (no transaction needed)
    if (data.hasVariants && data.variantAttributes && data.variantAttributes.length > 0) {
      // Pre-generate DB IDs so we can wire everything up without sequential round-trips
      const valueTempIdToDbId = new Map<string, string>();

      // Create all attributes in parallel
      const attrDbIds = await Promise.all(
        data.variantAttributes.map((attr) =>
          db.variantAttribute.create({
            data: {
              name: attr.name,
              displayOrder: attr.displayOrder,
              isPrimary: attr.isPrimary ?? false,
              productId: product.id,
            },
            select: { id: true },
          })
        )
      );

      // Create all values in parallel (one batch per attribute)
      await Promise.all(
        data.variantAttributes.map(async (attr, attrIdx) => {
          const attrDbId = attrDbIds[attrIdx].id;
          await Promise.all(
            attr.values.map(async (val) => {
              const created = await db.variantValue.create({
                data: {
                  value: val.value,
                  hexCode: val.hexCode,
                  images: val.images ?? [],
                  variantAttributeId: attrDbId,
                },
                select: { id: true },
              });
              valueTempIdToDbId.set(val.id, created.id);
            })
          );
        })
      );

      // 3. Create all product variants in parallel
      if (data.productVariants && data.productVariants.length > 0) {
        await Promise.all(
          data.productVariants.map(async (variant) => {
            const newVariant = await db.productVariant.create({
              data: {
                productId: product.id,
                sku: variant.sku,
                price: variant.price,
                comparePrice: variant.comparePrice,
                memberPrice: variant.memberPrice,
                stock: variant.stock,
                isActive: variant.isActive,
                weight: variant.weight,
                length: variant.length,
                width: variant.width,
                height: variant.height,
              },
              select: { id: true },
            });

            // Create images + value-links in parallel
            await Promise.all([
              variant.images && variant.images.length > 0
                ? db.variantImage.createMany({
                    data: variant.images.map((url, index) => ({
                      url,
                      displayOrder: index,
                      productVariantId: newVariant.id,
                    })),
                  })
                : Promise.resolve(),
              db.productVariantValue.createMany({
                data: variant.valueIds
                  .map((tmpId) => valueTempIdToDbId.get(tmpId))
                  .filter((dbId): dbId is string => !!dbId)
                  .map((dbId) => ({
                    productVariantId: newVariant.id,
                    variantValueId: dbId,
                  })),
              }),
            ]);
          })
        );
      }
    }

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/admin/products] Error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
