import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Target, 
  Award, 
  Heart, 
  Globe, 
  Lightbulb,
  TrendingUp,
  Shield,
  BookOpen,
  Zap
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
          About <span className="text-primary">SensAi</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          We're revolutionizing career development by making AI-powered guidance accessible to everyone, 
          from students taking their first steps to professionals navigating career transitions.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Target className="h-6 w-6 text-primary" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              To democratize career development by providing personalized, AI-powered guidance that helps 
              individuals at every stage of their professional journey make informed decisions and achieve 
              their career goals.
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Lightbulb className="h-6 w-6 text-primary" />
              Our Vision
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              A world where everyone has access to professional career guidance, regardless of their 
              background, location, or financial means, empowering them to build fulfilling and 
              successful careers.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* What We Do */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-foreground text-center mb-12">
          What We Do
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-primary" />
                AI-Powered Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Leverage cutting-edge AI to provide real-time industry insights, salary data, and market trends.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-primary" />
                Resume Building
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Create professional, ATS-optimized resumes that stand out to recruiters and hiring managers.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                Interview Preparation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Practice with AI-generated questions and receive personalized feedback to ace your interviews.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-primary" />
                Career Guidance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Get personalized career path recommendations based on your skills, interests, and goals.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                Cover Letter AI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Generate compelling, customized cover letters that highlight your unique qualifications.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-primary" />
                Industry Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Stay updated with real-time market data, growth trends, and in-demand skills across industries.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Our Values */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-foreground text-center mb-12">
          Our Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Empathy</h3>
            <p className="text-sm text-muted-foreground">
              We understand the challenges of career development and design solutions with real people in mind.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Excellence</h3>
            <p className="text-sm text-muted-foreground">
              We strive for the highest quality in everything we do, from AI algorithms to user experience.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Accessibility</h3>
            <p className="text-sm text-muted-foreground">
              We believe career guidance should be available to everyone, regardless of background or location.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Innovation</h3>
            <p className="text-sm text-muted-foreground">
              We continuously push boundaries to create cutting-edge solutions for career development.
            </p>
          </div>
        </div>
      </div>

      {/* About CareerVillage */}
      <Card className="mb-16 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            About CareerVillage.org
          </CardTitle>
          <CardDescription className="text-center text-base">
            SensAi is proudly developed by CareerVillage, a registered 501(c)(3) nonprofit organization
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            CareerVillage.org is a nonprofit organization dedicated to democratizing career advice. 
            We believe that everyone deserves access to professional guidance, regardless of their 
            background or financial means. Through our AI-powered platform SensAi, we're making 
            this vision a reality.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="secondary" className="px-4 py-2">
              <Shield className="h-4 w-4 mr-2" />
              501(c)(3) Nonprofit
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Award className="h-4 w-4 mr-2" />
              Charity Navigator Rated
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Users className="h-4 w-4 mr-2" />
              NCDA Member
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Ready to Transform Your Career?
        </h2>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of professionals who are already using SensAi to advance their careers 
          and achieve their professional goals.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="px-8">
            <Link href="/dashboard">
              Get Started
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="px-8">
            <Link href="/faq">
              Learn More
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
