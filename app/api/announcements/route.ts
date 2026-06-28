import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET /api/announcements - public, returns active announcements
export async function GET() {
  try {
    const announcements = await (db as any).announcement.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      select: { id: true, text: true, type: true },
    });

    return NextResponse.json({ announcements }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("[GET /api/announcements]", error);
    return NextResponse.json({ announcements: [] });
  }
}
