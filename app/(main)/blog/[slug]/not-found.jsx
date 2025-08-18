import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search, BookOpen } from "lucide-react";
import Link from "next/link";

export default function BlogPostNotFound() {
  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="max-w-2xl mx-auto text-center">
        {/* Back to Blog Button */}
        <div className="mb-8 text-left">
          <Button variant="outline" asChild>
            <Link href="/blog" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </div>

        {/* 404 Content */}
        <Card className="border-dashed">
          <CardContent className="pt-12 pb-12">
            <div className="text-6xl mb-4">📝</div>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Blog Post Not Found
            </h1>
            <p className="text-muted-foreground mb-8 text-lg">
              The blog post you're looking for doesn't exist or may have been moved.
            </p>
            
            <div className="space-y-4">
              <Button asChild size="lg">
                <Link href="/blog" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Browse All Articles
                </Link>
              </Button>
              
              <div className="text-sm text-muted-foreground">
                Or try searching for what you're looking for
              </div>
              
              <Button variant="outline" asChild>
                <Link href="/blog" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Search Articles
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
