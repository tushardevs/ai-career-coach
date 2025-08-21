import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch all published blog posts' tags
    const posts = await db.blogPost.findMany({
      where: { status: "published" },
      select: { tags: true }
    });

    // Aggregate tag counts
    const tagCounts = {};
    posts.forEach(post => {
      (post.tags || []).forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    // Convert to array of { name, count }, sort by count descending, and take top 10
    const tags = Object.entries(tagCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Limit to top 10 tags

    return NextResponse.json({ success: true, tags });
  } catch (error) {
    console.error("Error fetching tag counts:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch tag counts" }, { status: 500 });
  }
}