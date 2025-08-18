import React from "react";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  User, 
  Eye, 
  Clock,
  ArrowLeft,
  BookOpen,
  Share2,
  Heart,
  MessageCircle
} from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/prisma";
import ViewCounter from "./_components/view-counter";

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { slug } = await params;
  
  try {
    const blogPost = await db.blogPost.findUnique({
      where: { slug },
      select: {
        title: true,
        excerpt: true,
        metaTitle: true,
        metaDescription: true,
        keywords: true,
        author: true
      }
    });

    if (!blogPost) {
      return {
        title: 'Blog Post Not Found',
        description: 'The requested blog post could not be found.'
      };
    }

    return {
      title: blogPost.metaTitle || blogPost.title,
      description: blogPost.metaDescription || blogPost.excerpt,
      keywords: blogPost.keywords?.join(', '),
      authors: [blogPost.author],
      openGraph: {
        title: blogPost.title,
        description: blogPost.excerpt,
        type: 'article',
        authors: [blogPost.author]
      }
    };
  } catch (error) {
    return {
      title: 'Blog Post',
      description: 'Career insights and tips from SensAi'
    };
  }
}

// Generate static params for static generation
export async function generateStaticParams() {
  try {
    const blogPosts = await db.blogPost.findMany({
      where: { status: 'published' },
      select: { slug: true }
    });

    return blogPosts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    return [];
  }
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  
  try {
    const blogPost = await db.blogPost.findUnique({
      where: { slug },
      include: {
        comments: {
          where: { status: 'approved' },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!blogPost) {
      notFound();
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const getCategoryColor = (category) => {
      const colors = {
        'Technical Skills': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
        'Interview Tips': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
        'Industry Trends': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
        'Career Growth': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
        'Education': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
      };
      return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    };

    return (
      <>
        <ViewCounter slug={slug} />
        <div className="container mx-auto px-4 py-8 mt-16">
          {/* Back to Blog Button */}
          <div className="mb-8">
            <Button variant="outline" asChild>
              <Link href="/blog" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </Link>
            </Button>
          </div>

        {/* Blog Post Header */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <Badge className={`${getCategoryColor(blogPost.category)} mb-4`}>
              {blogPost.category}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              {blogPost.title}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {blogPost.excerpt}
            </p>
          </div>

          {/* Post Meta Information */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{blogPost.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(blogPost.publishDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{blogPost.readTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>{blogPost.views.toLocaleString()} views</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                Like
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Blog Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-none">
              <CardContent className="p-0">
                <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground prose-code:text-foreground prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
                  {/* Render markdown content here */}
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {blogPost.content}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {blogPost.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="px-3 py-1">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Comments Section */}
            <div className="mt-12">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Comments ({blogPost.comments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {blogPost.comments.length > 0 ? (
                    <div className="space-y-4">
                      {blogPost.comments.map((comment) => (
                        <div key={comment.id} className="border-b border-border pb-4 last:border-b-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-foreground">{comment.authorName}</span>
                            <span className="text-sm text-muted-foreground">
                              {formatDate(comment.createdAt)}
                            </span>
                          </div>
                          <p className="text-muted-foreground">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      No comments yet. Be the first to share your thoughts!
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Author Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">About the Author</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground">{blogPost.author}</h4>
                  <p className="text-sm text-muted-foreground">
                    Career development expert and industry professional
                  </p>
                </CardContent>
              </Card>

              {/* Related Articles */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Related Articles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Link href="/blog" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                      • More articles in {blogPost.category}
                    </Link>
                    <Link href="/blog" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                      • Latest career insights
                    </Link>
                    <Link href="/blog" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                      • Trending topics
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Newsletter Signup */}
              <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                <CardContent className="pt-6 text-center">
                  <BookOpen className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold text-foreground mb-2">Stay Updated</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get the latest career insights delivered to your inbox
                  </p>
                  <Button size="sm" className="w-full">
                    Subscribe
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      </>
    );
  } catch (error) {
    console.error('Error fetching blog post:', error);
    notFound();
  }
}
