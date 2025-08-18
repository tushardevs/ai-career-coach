import React, { useState } from "react";
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
  Lightbulb
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
                  Latest insights from our career experts
                </p>
              </div>
            </div>
            <div className="p-8">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">Featured</Badge>
                <Badge variant="outline">Career Growth</Badge>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">
                The Future of Remote Work: What Job Seekers Need to Know
              </h3>
              <p className="text-muted-foreground mb-4">
                Explore how remote work is reshaping the job market and what skills you need to thrive 
                in this new landscape. Learn from industry experts and real-world examples.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>CareerVillage Team</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Jan 15, 2025</span>
                  </div>
                </div>
                <Button asChild>
                  <Link href="/blog/featured-remote-work">
                    Read More
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search articles..." 
              className="pl-10"
              value={search}
              onChange={handleSearchChange}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline" size="sm">
              <TrendingUp className="h-4 w-4 mr-2" />
              Trending
            </Button>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="mb-12">
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
      </div>

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
