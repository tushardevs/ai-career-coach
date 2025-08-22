"use client";
import { useEffect, useState } from "react";
import Handlebars from "handlebars";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Loader2 } from "lucide-react";
import ResumeEntryForm from "./entry-form";


export default function ResumeBuilder({ initialContent, selectedTemplate }) {
  const { user } = useUser();

  const [formValues, setFormValues] = useState(initialContent || {});
  const [templateHtml, setTemplateHtml] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // ✅ Fetch template from DB
  useEffect(() => {
    async function fetchTemplate() {
      if (!selectedTemplate) return;

      const res = await fetch(`/api/templates?key=${selectedTemplate}`);
      const data = await res.json();

      if (data?.htmlCode) {
        const template = Handlebars.compile(data.htmlCode);

        const filledHtml = template({
          name: user?.fullName || "Your Name",
          email: user?.primaryEmailAddress?.emailAddress || formValues?.contactInfo?.email,
          phone: formValues?.contactInfo?.mobile,
          linkedin: formValues?.contactInfo?.linkedin,
          summary: formValues?.summary,
          experience: formValues?.experience || [],
          education: formValues?.education || [],
          projects: formValues?.projects || [],
        });

        setTemplateHtml(filledHtml);
      }
    }

    fetchTemplate();
  }, [selectedTemplate, formValues, user]);

  // ✅ PDF generator
  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const element = document.getElementById("resume-pdf");
      if (!element) throw new Error("Resume content not found");

      const html2pdf = (await import("html2pdf.js")).default;

      await html2pdf()
        .from(element)
        .set({
          margin: [15, 15],
          filename: "resume.pdf",
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .save();
    } catch (err) {
      console.error("PDF generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Tabs defaultValue="form" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="form">Form</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>

      {/* Form Tab */}
      <TabsContent value="form">
        <ResumeEntryForm formValues={formValues} setFormValues={setFormValues} />
      </TabsContent>

      {/* Preview Tab */}
      <TabsContent value="preview">
        <div className="flex justify-end mb-4">
          <Button onClick={generatePDF} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </>
            )}
          </Button>
        </div>

        <div
          id="resume-pdf"
          className="bg-white p-6"
          dangerouslySetInnerHTML={{ __html: templateHtml }}
        />
      </TabsContent>
    </Tabs>
  );
}
