"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Eye, 
  Clock,
  BookOpen,
  TrendingUp,
  GraduationCap,
  Briefcase,
  Code,
  Lightbulb,
  Plus
} from "lucide-react";
import Link from "next/link";
import BlogList from "./_components/blog-list";
import BlogFilters from "./_components/blog-filters";

export default function BlogPage() {
  // Step 1: Centralize state
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState("latest");

  // Handlers
  const handleSearchChange = (e) => setSearch(e.target.value);
  const handleCategoryChange = (categories) => setSelectedCategories(categories);
  const handleTagChange = (tags) => setSelectedTags(tags);
  const handleSortChange = (sort) => setSortBy(sort);
  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedTags([]);
    setSortBy("latest");
  };

  const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

  const [featured, setFeatured] = useState(null);
  const [featuredLoading, setFeaturedLoading] = useState(true);

    useEffect(() => {
      async function fetchFeatured() {
        setFeaturedLoading(true);
        try {
          const res = await fetch("/api/blog/featured");
          const data = await res.json();
          if (data.success) setFeatured(data.featured);
        } finally {
          setFeaturedLoading(false);
        }
      }
      fetchFeatured();
    }, []);

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
          Career <span className="text-primary">Insights</span> & Tips
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Discover expert advice, industry trends, and actionable strategies to advance your career. 
          From resume tips to interview strategies, we've got you covered.
        </p>
      </div>

      {/* Featured Blog Post */}
      <div className="mb-16">
              <Card className="border-2 border-primary/20 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="bg-gradient-to-br from-primary/10 to-primary/20 p-8 flex items-center justify-center">
                    <div className="text-center">
                      <BookOpen className="h-16 w-16 text-primary mx-auto mb-4" />
                      <h2 className="text-2xl font-bold text-foreground mb-2">
                        Featured Article
                      </h2>
                      <p className="text-muted-foreground">
                        {featuredLoading
                          ? "Loading..."
                          : featured
                          ? "Most viewed and recent article"
                          : "No featured article found"}
                      </p>
                    </div>
                  </div>
                  <div className="p-8">
                    {featured && (
                      <>
                        <div className="flex items-center gap-2 mb-4">
                          <Badge variant="secondary">Featured</Badge>
                          {featured.category && (
                            <Badge variant="outline">{featured.category}</Badge>
                          )}
                        </div>
                        <h3 className="text-2xl font-bold text-foreground mb-3">
                          {featured.title}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          {featured.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              <span>{featured.author}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {featured.publishDate
                                  ? formatDate(featured.publishDate)
                                  : ""}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              <span>{featured.views} views</span>
                            </div>
                          </div>
                          <Button asChild>
                            <Link href={`/blog/${featured.slug}`}>
                              Read More
                            </Link>
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            </div>

      {/* Search and Filters */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white/70 dark:bg-background/70 backdrop-blur-md rounded-2xl shadow-md px-6 py-6 border border-primary/10">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              className="pl-10 bg-transparent border-primary/20 focus:border-primary"
              value={search}
              onChange={handleSearchChange}
            />
          </div>
          <div className="w-full md:w-auto flex justify-end">
            <Button
              asChild
              className="bg-gradient-to-r from-primary to-primary/80 text-black font-semibold shadow-lg hover:from-primary/90 hover:to-primary/70 px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200"
              size="lg"
            >
              <Link href="/blog/create" className="flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                <span className="text-base md:text-lg">Create Blog</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      {/* <div className="mb-12">
        <div className="flex flex-wrap gap-3 justify-center">
          <Badge variant="default" className="px-4 py-2 cursor-pointer hover:bg-primary/90">
            All Topics
          </Badge>
          <Badge variant="outline" className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground">
            <GraduationCap className="h-3 w-3 mr-1" />
            Education
          </Badge>
          <Badge variant="outline" className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground">
            <Briefcase className="h-3 w-3 mr-1" />
            Career Growth
          </Badge>
          <Badge variant="outline" className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground">
            <Code className="h-3 w-3 mr-1" />
            Technical Skills
          </Badge>
          <Badge variant="outline" className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground">
            <Lightbulb className="h-3 w-3 mr-1" />
            Interview Tips
          </Badge>
          <Badge variant="outline" className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground">
            <TrendingUp className="h-3 w-3 mr-1" />
            Industry Trends
          </Badge>
        </div>
      </div> */}

      {/* Blog Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
          <BlogFilters
            selectedCategories={selectedCategories}
            setSelectedCategories={handleCategoryChange}
            selectedTags={selectedTags}
            setSelectedTags={handleTagChange}
            sortBy={sortBy}
            setSortBy={handleSortChange}
            clearFilters={handleClearFilters}
          />
        </div>

        {/* Main Blog List */}
        <div className="lg:col-span-3">
          <BlogList
            search={search}
            selectedCategories={selectedCategories}
            selectedTags={selectedTags}
            sortBy={sortBy}
          />
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="mt-20">
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="pt-8 text-center">
            <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Stay Updated with Career Insights
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Get the latest career tips, industry trends, and exclusive content delivered to your inbox. 
              Join thousands of professionals who are already advancing their careers with our insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input 
                placeholder="Enter your email address" 
                className="flex-1"
              />
              <Button className="px-6">
                Subscribe
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              No spam, unsubscribe at any time. We respect your privacy.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
