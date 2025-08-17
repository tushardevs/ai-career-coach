"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Instagram, Linkedin, Facebook } from "lucide-react";
import { Button } from "./ui/button";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Section - Logo and Mission */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Logo and Tagline */}
            <div className="space-y-4">
              <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-2 lg:space-y-0 lg:space-x-3">
                <Image
                  src="/logo.png"
                  alt="Sensai Logo"
                  width={140}
                  height={42}
                  className="h-12 w-auto object-contain hover:scale-105 transition-transform duration-200"
                />
                <div className="text-sm text-muted-foreground">
                  by CareerVillage.org
                </div>
              </div>
              <p className="text-muted-foreground max-w-lg mx-auto lg:mx-0 text-lg leading-relaxed">
                AI-powered career development for everyone, from students to job-seekers.
              </p>
            </div>

            {/* Certifications and Memberships */}
            {/* <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-3 text-center">
                <div className="text-green-600 dark:text-green-400 text-xs font-semibold">
                  Charity Navigator
                </div>
                <div className="flex justify-center space-x-1 mt-1">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-green-500 rounded-sm"></div>
                  ))}
                </div>
                <div className="text-green-600 dark:text-green-400 text-xs mt-1">
                  THREE-STAR
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/20 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-center">
                <div className="text-gray-600 dark:text-gray-300 text-xs font-semibold">
                  Platinum Transparency 2025
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  Candid.
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-center">
                <div className="text-blue-600 dark:text-blue-400 text-xs font-semibold">
                  NCDA
                </div>
                <div className="text-blue-500 dark:text-blue-300 text-xs mt-1">
                  Organizational Member 2024-2025
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-center">
                <div className="text-blue-600 dark:text-blue-400 text-xs font-semibold">
                  EDSAFE AI Alliance
                </div>
                <div className="text-blue-500 dark:text-blue-300 text-xs mt-1">
                  MEMBER INDUSTRY COUNCIL
                </div>
              </div>
            </div> */}
          </div>

          {/* Right Section - Navigation and Social */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Coach Column */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Products</h3>
              <div className="space-y-2 text-sm">
                <Link href="/interview" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Interview
                </Link>
                <Link href="/dashboard" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Industry Insights
                </Link>
                <Link href="/resume" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Build Resume
                </Link>
                <Link href="/ai-cover-letter" className="block text-muted-foreground hover:text-foreground transition-colors">
                  AI Cover Letter
                </Link>
                {/* <Link href="/safety" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Safety
                </Link>
                <Link href="/guidelines" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Guidelines for Use
                </Link>
                <Link href="/help" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Help Center
                </Link> */}
                <Link href="/faq" className="block text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </Link>
                <Link href="/blog" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
                {/* <Link href="/press" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Press
                </Link> */}
              </div>
            </div>

            {/* CareerVillage.org Column */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Company</h3>
              <div className="space-y-2 text-sm">
                <Link href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
                <Link href="/about" className="block text-muted-foreground hover:text-foreground transition-colors">
                   About
                </Link>
                <Link href="/contact" className="block text-muted-foreground hover:text-foreground transition-colors">
                   Contact us
                 </Link>
                <Link href="https://careervillage.org/ask" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Ask a Question
                </Link>
              </div>
            </div>

            {/* Connect with us Section */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Connect with us</h3>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  size="icon"
                  asChild
                  className="w-10 h-10"
                >
                  <Link href="https://instagram.com/careervillage" target="_blank" rel="noopener noreferrer">
                    <Instagram className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  asChild
                  className="w-10 h-10"
                >
                  <Link href="https://linkedin.com/company/careervillage" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  asChild
                  className="w-10 h-10"
                >
                  <Link href="https://facebook.com/careervillage" target="_blank" rel="noopener noreferrer">
                    <Facebook className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
          © Copyright 2025. All Rights Reserved.
          SensAi is an AI career coach from CareerVillage, a registered 501(c)(3) nonprofit.
          </p>
        </div>
      </div>
    </footer>
  );
}
