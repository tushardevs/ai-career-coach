
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Eye } from "lucide-react";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";
import { getResumeTemplates } from "@/actions/templates";
import TemplatePreview from "./template-preview";

export default function TemplateSelector({ selectedTemplate, onTemplateSelect }) {
  const {
    loading: templatesLoading,
    fn: fetchTemplates,
    data: templates,
    error: templatesError,
  } = useFetch(getResumeTemplates);

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    if (templatesError) {
      toast.error("Failed to load templates");
    }
  }, [templatesError]);

  const handleTemplateSelect = (template) => {
    onTemplateSelect(template);
    toast.success(`Template "${template.name}" selected`);
  };

  if (templatesLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-32 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold gradient-title">Choose Your Template</h2>
        <p className="text-muted-foreground mt-2">
          Select a professional template to get started with your resume
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates?.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedTemplate?.id === template.id
                ? "ring-2 ring-primary shadow-lg"
                : ""
            }`}
            onClick={() => handleTemplateSelect(template)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  {template.name}
                  {template.isPremium && (
                    <Crown className="h-4 w-4 text-yellow-500" />
                  )}
                  {selectedTemplate?.id === template.id && (
                    <Check className="h-4 w-4 text-green-500" />
                  )}
                </CardTitle>
                <Badge variant={template.isDefault ? "default" : "secondary"}>
                  {template.category}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {template.description}
              </p>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Template Preview */}
                <div
                  className="h-32 rounded border overflow-hidden relative"
                  style={{
                    backgroundColor: "#ffffff",
                    borderColor: template.structure?.styling?.accentColor || "#d1d5db"
                  }}
                >
                  <TemplatePreview template={template} />
                </div>
                {template.isPremium && (
                  <Badge className="absolute top-2 right-2 bg-yellow-500">
                    Premium
                  </Badge>
                )}
              </div>

              <div className="mt-3 space-y-2">
                <div className="flex flex-wrap gap-1">
                  {template.structure?.sections?.slice(0, 3).map((section) => (
                    <Badge key={section} variant="outline" className="text-xs">
                      {section.replace("-", " ")}
                    </Badge>
                  ))}
                  {template.structure?.sections?.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{template.structure.sections.length - 3} more
                    </Badge>
                  )}
                </div>

                <Button
                  variant={selectedTemplate?.id === template.id ? "default" : "outline"}
                  size="sm"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTemplateSelect(template);
                  }}
                >
                  {selectedTemplate?.id === template.id ? "Selected" : "Use Template"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
