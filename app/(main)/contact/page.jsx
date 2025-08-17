import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageSquare,
  Send,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
          Get in <span className="text-primary">Touch</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Have questions about SensAi? Need support with your career development journey? 
          We're here to help. Reach out to us and we'll get back to you as soon as possible.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div>
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">Send us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll respond within 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" placeholder="John" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" placeholder="Doe" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input id="email" type="email" placeholder="john.doe@example.com" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Inquiry</SelectItem>
                    <SelectItem value="technical">Technical Support</SelectItem>
                    <SelectItem value="billing">Billing Question</SelectItem>
                    <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                    <SelectItem value="feedback">Feedback & Suggestions</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea 
                  id="message" 
                  placeholder="Tell us how we can help you..." 
                  rows={6}
                  required 
                />
              </div>

              <Button className="w-full" size="lg">
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <div className="space-y-8">
          {/* Direct Contact Methods */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Contact Information</h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Email</h3>
                  <p className="text-muted-foreground">support@sensai.com</p>
                  <p className="text-sm text-muted-foreground">We typically respond within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Live Chat</h3>
                  <p className="text-muted-foreground">Available during business hours</p>
                  <p className="text-sm text-muted-foreground">Look for the chat widget in the bottom right</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Address</h3>
                  <p className="text-muted-foreground">CareerVillage.org</p>
                  <p className="text-sm text-muted-foreground">San Francisco, CA</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Business Hours</h3>
                  <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 6:00 PM PST</p>
                  <p className="text-sm text-muted-foreground">Weekend: Limited support available</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl">Frequently Asked Questions</CardTitle>
              <CardDescription>
                Quick answers to common questions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">How do I get started with SensAi?</h4>
                <p className="text-sm text-muted-foreground">
                  Simply sign up for an account and complete the onboarding process to get personalized career insights.
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Is SensAi free to use?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes! SensAi is completely free thanks to CareerVillage's nonprofit mission.
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">How accurate are the AI insights?</h4>
                <p className="text-sm text-muted-foreground">
                  Our AI is trained on real-time market data and industry trends to provide accurate, up-to-date information.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Support Status */}
          <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <div>
                  <h3 className="font-semibold text-green-800 dark:text-green-200">
                    Support Status: Normal
                  </h3>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    All systems operational • Response time: Under 24 hours
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Contact Options */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-foreground text-center mb-12">
          Other Ways to Connect
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Community Forum</h3>
              <p className="text-muted-foreground mb-4">
                Join our community to connect with other career seekers and professionals
              </p>
              <Button variant="outline" size="sm">
                Join Community
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Newsletter</h3>
              <p className="text-muted-foreground mb-4">
                Stay updated with the latest career insights and platform updates
              </p>
              <Button variant="outline" size="sm">
                Subscribe
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Report Issues</h3>
              <p className="text-muted-foreground mb-4">
                Found a bug or have a technical issue? Let us know immediately
              </p>
              <Button variant="outline" size="sm">
                Report Issue
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
