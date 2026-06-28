import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const updateSchema = z.object({
  text: z.string().min(1).max(300).optional(),
  type: z.enum(["DELIVERY", "OFFER"]).optional(),
  isActive: z.boolean().optional(),
  order: z.number().int().optional(),
});

// PUT /api/admin/announcements/[id]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const [session, { id }] = await Promise.all([auth(), params]);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = updateSchema.parse(body);

    const announcement = await (db as any).announcement.update({
      where: { id },
      data,
    });

    return NextResponse.json({ announcement });
  } catch (error) {
    console.error("[PUT /api/admin/announcements/[id]]", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues.map(i => i.message).join(", ") }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update announcement" }, { status: 500 });
  }
}

// DELETE /api/admin/announcements/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const [session, { id }] = await Promise.all([auth(), params]);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await (db as any).announcement.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/admin/announcements/[id]]", error);
    return NextResponse.json({ error: "Failed to delete announcement" }, { status: 500 });
  }
}
