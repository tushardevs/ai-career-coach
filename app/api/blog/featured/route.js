import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET() {
  try {
    // Find the most viewed published post, breaking ties by most recent
    const featured = await db.blogPost.findFirst({
      where: { status: "published" },
      orderBy: [
        { views: "desc" },
        { publishDate: "desc" }
      ]
    });

    if (!featured) {
      return NextResponse.json({ success: false, error: "No featured article found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, featured });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch featured article" }, { status: 500 });
  }
}