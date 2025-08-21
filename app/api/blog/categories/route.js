import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch all published blog posts' categories
    const posts = await db.blogPost.findMany({
      where: { status: "published" },
      select: { category: true }
    });

    // Aggregate category counts
    const categoryCounts = {};
    posts.forEach(post => {
      const category = post.category;
      if (category) {
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      }
    });

    // Convert to array of { name, count }, sort by count descending, and take top 10
    const categories = Object.entries(categoryCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Limit to top 10 categories

    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error("Error fetching category counts:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch category counts" }, { status: 500 });
  }
}