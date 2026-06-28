import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const announcementSchema = z.object({
  text: z.string().min(1).max(300),
  type: z.enum(["DELIVERY", "OFFER"]),
  isActive: z.boolean().default(true),
  order: z.number().int().default(0),
});

// GET /api/admin/announcements
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const announcements = await (db as any).announcement.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });

    return NextResponse.json({ announcements });
  } catch (error) {
    console.error("[GET /api/admin/announcements]", error);
    return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 });
  }
}

// POST /api/admin/announcements
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = announcementSchema.parse(body);

    const announcement = await (db as any).announcement.create({ data });
    return NextResponse.json({ announcement }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/admin/announcements]", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues.map(i => i.message).join(", ") }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 });
  }
}
