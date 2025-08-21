"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  Filter,
  TrendingUp,
  Clock,
  Eye,
  Calendar,
  Star
} from "lucide-react";

export default function BlogFilters({
  selectedCategories,
  setSelectedCategories,
  selectedTags,
  setSelectedTags,
  sortBy,
  setSortBy,
  clearFilters
}) {
    {/*
  const categories = [
    { name: 'Technical Skills', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' },
    { name: 'Interview Tips', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' },
    { name: 'Industry Trends', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300' },
    { name: 'Career Growth', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300' },
    { name: 'Education', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' }
  ];
  */}

  const sortOptions = [
    { value: 'latest', label: 'Latest First', icon: Calendar },
    { value: 'popular', label: 'Most Popular', icon: TrendingUp },
    { value: 'trending', label: 'Trending', icon: TrendingUp },
    { value: 'oldest', label: 'Oldest First', icon: Clock }
  ];

  // Fetch tags dynamically
  const [popularTags, setPopularTags] = useState([]);
  const [tagsLoading, setTagsLoading] = useState(true);
  const [tagsError, setTagsError] = useState(null);

  useEffect(() => {
    async function fetchTags() {
      setTagsLoading(true);
      setTagsError(null);
      try {
        const res = await fetch("/api/blog/tags");
        const data = await res.json();
        if (data.success) {
          setPopularTags(data.tags);
        } else {
          setTagsError(data.error || "Failed to fetch tags");
        }
      } catch (err) {
        setTagsError("Failed to fetch tags");
      } finally {
        setTagsLoading(false);
      }
    }
    fetchTags();
  }, []);

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);

  useEffect(() => {
    async function fetchCategories() {
      setCategoriesLoading(true);
      setCategoriesError(null);
      try {
        const res = await fetch("/api/blog/categories");
        const data = await res.json();
        if (data.success) {
          setCategories(data.categories); // categories: [{ name, color, count }]
        } else {
          setCategoriesError(data.error || "Failed to fetch categories");
        }
      } catch (err) {
        setCategoriesError("Failed to fetch categories");
      } finally {
        setCategoriesLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const handleCategoryToggle = (categoryName) => {
    setSelectedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(cat => cat !== categoryName)
        : [...prev, categoryName]
    );
  };

  const handleTagToggle = (tagName) => {
    setSelectedTags(prev =>
      prev.includes(tagName)
        ? prev.filter(tag => tag !== tagName)
        : [...prev, tagName]
    );
  };

  return (
    <div className="space-y-6">
      {/* Sort Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Sort By
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {sortOptions.map((option) => {
            const Icon = option.icon;
            return (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={option.value}
                  checked={sortBy === option.value}
                  onCheckedChange={() => setSortBy(option.value)}
                />
                <Label htmlFor={option.value} className="flex items-center gap-2 cursor-pointer">
                  <Icon className="h-4 w-4" />
                  {option.label}
                </Label>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Categories</CardTitle>
          <CardDescription>Filter by article topics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {categoriesLoading ? (
            <div className="text-muted-foreground text-sm">Loading categories...</div>
          ) : categoriesError ? (
            <div className="text-red-500 text-sm">{categoriesError}</div>
          ) : (
            categories.map((category) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={category.name}
                    checked={selectedCategories.includes(category.name)}
                    onCheckedChange={() => handleCategoryToggle(category.name)}
                  />
                  <Label htmlFor={category.name} className="cursor-pointer">
                    {category.name}
                    <span className="ml-1 text-xs opacity-75">({category.count})</span>
                  </Label>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Popular Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Popular Tags</CardTitle>
          <CardDescription>Browse by specific topics</CardDescription>
        </CardHeader>
        <CardContent>
          {tagsLoading ? (
            <div className="text-muted-foreground text-sm">Loading tags...</div>
          ) : tagsError ? (
            <div className="text-red-500 text-sm">{tagsError}</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <Badge
                  key={tag.name}
                  variant={selectedTags.includes(tag.name) ? "default" : "outline"}
                  className={`cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors ${
                    selectedTags.includes(tag.name) ? 'bg-primary text-primary-foreground' : ''
                  }`}
                  onClick={() => handleTagToggle(tag.name)}
                >
                  {tag.name}
                  <span className="ml-1 text-xs opacity-75">({tag.count})</span>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reading Time Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Reading Time</CardTitle>
          <CardDescription>Choose article length</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: 'Quick Read (1-5 min)', value: 'quick' },
            { label: 'Medium (6-15 min)', value: 'medium' },
            { label: 'Long Read (15+ min)', value: 'long' }
          ].map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox id={option.value} />
              <Label htmlFor={option.value} className="cursor-pointer">
                {option.label}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Clear Filters */}
      {(selectedCategories.length > 0 || selectedTags.length > 0) && (
        <Button 
          variant="outline" 
          onClick={clearFilters}
          className="w-full"
        >
          Clear All Filters
        </Button>
      )}

      {/* Active Filters Display */}
      {(selectedCategories.length > 0 || selectedTags.length > 0) && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-sm">Active Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {selectedCategories.map((category) => (
                <div key={category} className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {category}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCategoryToggle(category)}
                    className="h-6 w-6 p-0"
                  >
                    ×
                  </Button>
                </div>
              ))}
              {selectedTags.map((tag) => (
                <div key={tag} className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTagToggle(tag)}
                    className="h-6 w-6 p-0"
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
