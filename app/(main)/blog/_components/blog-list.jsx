"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  User, 
  Eye, 
  Clock,
  ArrowRight,
  BookOpen,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

export default function BlogList({ search, selectedCategories, selectedTags, sortBy }) {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Build filters for API
  const buildFilters = () => {
    const filters = {};
    if (search) filters.search = search;
    if (selectedCategories && selectedCategories.length > 0) filters.category = selectedCategories.join(",");
    if (selectedTags && selectedTags.length > 0) filters.tag = selectedTags.join(",");
    if (sortBy) filters.sortBy = sortBy;
    return filters;
  };

  // Fetch blog posts when filters/search/sort change
  useEffect(() => {
    fetchBlogPosts(1, buildFilters());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, selectedCategories, selectedTags, sortBy]);

  const fetchBlogPosts = async (page = 1, filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...filters
      });
      const response = await fetch(`/api/blog?${params}`);
      const result = await response.json();
      if (result.success) {
        setBlogPosts(result.data.blogPosts);
        setPagination(result.data.pagination);
      } else {
        setError(result.error || 'Failed to fetch blog posts');
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setError('Failed to fetch blog posts');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-muted rounded w-full mb-2"></div>
              <div className="h-4 bg-muted rounded w-5/6 mb-2"></div>
              <div className="h-4 bg-muted rounded w-4/6"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 dark:border-red-800">
        <CardContent className="pt-6 text-center">
          <div className="text-red-600 dark:text-red-400 mb-4">
            <AlertCircle className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Error Loading Blog Posts
          </h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => fetchBlogPosts(1, buildFilters())}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (blogPosts.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-6 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No Blog Posts Found
          </h3>
          <p className="text-muted-foreground">
            No blog posts match your current filters. Try adjusting your search criteria.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {blogPosts.map((post) => (
        <Card key={post.id} className="hover:shadow-lg transition-shadow border-border hover:border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between mb-3">
              <Badge className={getCategoryColor(post.category)}>
                {post.category}
              </Badge>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Eye className="h-4 w-4" />
                <span>{post.views.toLocaleString()}</span>
              </div>
            </div>
            <CardTitle className="text-xl hover:text-primary transition-colors cursor-pointer">
              <Link href={`/blog/${post.slug}`}>
                {post.title}
              </Link>
            </CardTitle>
            <CardDescription className="text-base leading-relaxed">
              {post.excerpt}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(post.publishDate)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{post.readTime}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/blog/${post.slug}`}>
                  Read More
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Pagination */}
      <div className="flex items-center justify-between pt-8">
        <div className="text-sm text-muted-foreground">
          Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of {pagination.totalCount} articles
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchBlogPosts(pagination.currentPage - 1, buildFilters())}
            disabled={!pagination.hasPrevPage}
          >
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === pagination.currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => fetchBlogPosts(pageNum, buildFilters())}
                  className="w-8 h-8 p-0"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchBlogPosts(pagination.currentPage + 1, buildFilters())}
            disabled={!pagination.hasNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
