import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get query parameters
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'latest';
    const featured = searchParams.get('featured') === 'true';
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Build where clause
    const where = {
      status: 'published'
    };
    
    if (category) {
      where.category = category;
    }
    
    if (tag) {
      where.tags = {
        has: tag
      };
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (featured) {
      where.featured = true;
    }
    
    // Build orderBy clause
    let orderBy = {};
    switch (sortBy) {
      case 'latest':
        orderBy = { publishDate: 'desc' };
        break;
      case 'oldest':
        orderBy = { publishDate: 'asc' };
        break;
      case 'popular':
        orderBy = { views: 'desc' };
        break;
      case 'trending':
        // For trending, we could implement a more complex algorithm
        // For now, we'll use a combination of views and recent activity
        orderBy = [
          { views: 'desc' },
          { publishDate: 'desc' }
        ];
        break;
      default:
        orderBy = { publishDate: 'desc' };
    }
    
    // Fetch blog posts
    const [blogPosts, totalCount] = await Promise.all([
      db.blogPost.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          author: true,
          authorAvatar: true,
          publishDate: true,
          readTime: true,
          views: true,
          category: true,
          tags: true,
          featured: true,
          createdAt: true
        }
      }),
      db.blogPost.count({ where })
    ]);
    
    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    return NextResponse.json({
      success: true,
      data: {
        blogPosts,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage,
          hasPrevPage,
          limit
        }
      }
    });
    
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch blog posts' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { title, slug, excerpt, content, author, category, tags } = body;
    
    if (!title || !slug || !excerpt || !content || !author || !category) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields' 
        },
        { status: 400 }
      );
    }
    
    // Check if slug already exists
    const existingPost = await db.blogPost.findUnique({
      where: { slug }
    });
    
    if (existingPost) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Slug already exists' 
        },
        { status: 400 }
      );
    }
    
    // Create new blog post
    const blogPost = await db.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        author,
        authorAvatar: body.authorAvatar,
        category,
        tags: tags || [],
        readTime: body.readTime || '5 min read',
        featured: body.featured || false,
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
        keywords: body.keywords || []
      }
    });
    
    return NextResponse.json({
      success: true,
      data: blogPost
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create blog post' 
      },
      { status: 500 }
    );
  }
}
