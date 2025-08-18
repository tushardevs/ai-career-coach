import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function POST(request, { params }) {
  try {
    const { slug } = await params;
    
    // Increment the view count for the blog post
    const updatedPost = await db.blogPost.update({
      where: { slug },
      data: {
        views: {
          increment: 1
        }
      },
      select: {
        id: true,
        title: true,
        views: true
      }
    });
    
    return NextResponse.json({
      success: true,
      data: {
        views: updatedPost.views
      }
    });
    
  } catch (error) {
    console.error('Error updating view count:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update view count' 
      },
      { status: 500 }
    );
  }
}
