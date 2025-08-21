import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      title,
      slug,
      excerpt,
      content,
      author,
      authorAvatar,
      publishDate,
      readTime,
      category,
      tags,
      featured,
      status,
      metaTitle,
      metaDescription,
      keywords,
      image,
    } = body;

    const formattedReadTime = readTime.trim().endsWith("min read")
        ? readTime.trim()
        : `${readTime.trim()} min read`;

    // Validate required fields
    if (
      !title ||
      !slug ||
      !excerpt ||
      !content ||
      !author ||
      !publishDate ||
      !readTime ||
      !category ||
      !status
    ) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Check for unique slug
    const exists = await db.blogPost.findUnique({ where: { slug } });
    if (exists) {
      return NextResponse.json({ success: false, error: "Slug already exists" }, { status: 400 });
    }

    const post = await db.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        author,
        authorAvatar: authorAvatar || "",
        publishDate: new Date(publishDate),
        readTime: formattedReadTime,
        views: 0,
        category,
        tags: tags ? (Array.isArray(tags) ? tags : tags.split(",").map(t => t.trim())) : [],
        featured: featured ?? false,
        status: status || "published",
        metaTitle: metaTitle || "",
        metaDescription: metaDescription || "",
        keywords: keywords ? (Array.isArray(keywords) ? keywords : keywords.split(",").map(k => k.trim())) : [],

        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, post });
  } catch (error) {
  console.log("Error creating blog post:", error);
    // Log the error for debugging
    return NextResponse.json({ success: false, error: "Failed to create blog" }, { status: 500 });
  }
}