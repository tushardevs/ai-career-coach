"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  FileText,
  PlusCircle,
  Sparkles
} from "lucide-react";

export default function CreateBlogPage() {
  const { user } = useUser();

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    tags: "",
    featured: false,
    status: "published",
    metaTitle: "",
    metaDescription: "",
    keywords: "",
    image: "",
    readTime: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Auto-generate slug from title
  useEffect(() => {
    if (!form.slugTouched) {
      const slug = form.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      setForm((prev) => ({ ...prev, slug }));
    }
  }, [form.title]);

  const validate = () => {
    const errs = {};
    if (!form.title) errs.title = "Title is required";
    if (!form.slug) errs.slug = "Slug is required";
    if (!form.excerpt) errs.excerpt = "Excerpt is required";
    if (!form.content) errs.content = "Content is required";
    if (!form.category) errs.category = "Category is required";
    if (!form.readTime) errs.readTime = "Read time is required";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "slug") {
      setForm((prev) => ({ ...prev, slugTouched: true }));
    }
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    setSuccess(false);
    try {
      const res = await fetch("/api/blog/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          author: user?.fullName || "Unknown",
          authorAvatar: user?.imageUrl || "",
          publishDate: new Date().toISOString(),
          tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
          keywords: form.keywords.split(",").map((k) => k.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setForm({
          title: "",
          slug: "",
          excerpt: "",
          content: "",
          category: "",
          tags: "",
          featured: false,
          status: "published",
          metaTitle: "",
          metaDescription: "",
          keywords: "",
          image: "",
          readTime: "",
          slugTouched: false,
        });
      } else {
        setErrors({ submit: data.error || "Failed to create blog" });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 mt-16 max-w-3xl">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-bold flex items-center gap-2">
          <FileText className="h-8 w-8 text-primary" />
          <span>
            Create <span className="text-primary">Blog</span>
          </span>
        </h1>
        <Button asChild variant="outline">
          <Link href="/blog" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      {/* Main Form Card */}
      <Card className="border border-primary/20 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-t-lg">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            New Blog Post
          </CardTitle>
          <CardDescription>
            Share your knowledge and insights with the community.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title & Slug */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  name="title"
                  placeholder="Title"
                  value={form.title}
                  onChange={handleChange}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>
              <div>
                <Input
                  name="slug"
                  placeholder="Slug"
                  value={form.slug}
                  onChange={handleChange}
                />
                {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
              </div>
            </div>

            {/* Category & Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  name="category"
                  placeholder="Category"
                  value={form.category}
                  onChange={handleChange}
                />
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
              </div>
              <div>
                <Input
                  name="tags"
                  placeholder="Tags (comma separated)"
                  value={form.tags}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <Textarea
                name="excerpt"
                placeholder="Short summary/excerpt"
                value={form.excerpt}
                onChange={handleChange}
              />
              {errors.excerpt && <p className="text-red-500 text-sm mt-1">{errors.excerpt}</p>}
            </div>

            {/* Content */}
            <div>
              <Textarea
                name="content"
                placeholder="Main blog content..."
                rows={8}
                value={form.content}
                onChange={handleChange}
              />
              {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
            </div>

            {/* SEO Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="metaTitle"
                placeholder="Meta Title (SEO)"
                value={form.metaTitle}
                onChange={handleChange}
              />
              <Input
                name="keywords"
                placeholder="Keywords (comma separated)"
                value={form.keywords}
                onChange={handleChange}
              />
            </div>
            <Textarea
              name="metaDescription"
              placeholder="Meta Description (SEO)"
              value={form.metaDescription}
              onChange={handleChange}
            />

            {/* Image & Read Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="image"
                placeholder="Image URL (optional)"
                value={form.image}
                onChange={handleChange}
              />
              <div>
                <Input
                  name="readTime"
                  placeholder="Read Time (e.g. 5 min)"
                  value={form.readTime}
                  onChange={handleChange}
                />
                {errors.readTime && <p className="text-red-500 text-sm mt-1">{errors.readTime}</p>}
              </div>
            </div>

            {/* Featured & Status */}
            <div className="flex items-center justify-between gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="featured"
                  checked={form.featured}
                  onChange={handleChange}
                />
                Featured
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="border rounded px-3 py-2"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            {/* Feedback */}
            {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}
            {success && <p className="text-green-600 text-sm">✅ Blog created successfully!</p>}

            {/* Submit */}
            <Button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2"
            >
              <PlusCircle className="h-5 w-5" />
              {submitting ? "Publishing..." : "Publish Blog"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
