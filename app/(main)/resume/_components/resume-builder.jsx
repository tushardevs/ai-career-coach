"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  Download,
  Edit,
  Loader2,
  Monitor,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { saveResume } from "@/actions/resume";
import { EntryForm } from "./entry-form";
import TemplateSelector from "./template-selector";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/nextjs";
import { entriesToMarkdown } from "@/app/lib/helper";
import { resumeSchema } from "@/app/lib/schema";
// Import html2pdf dynamically on client side only

export default function ResumeBuilder({ initialContent, initialTemplate }) {
  const [activeTab, setActiveTab] = useState("template");
  const [previewContent, setPreviewContent] = useState(initialContent);
  const [selectedTemplate, setSelectedTemplate] = useState(initialTemplate);
  const { user } = useUser();
  const [resumeMode, setResumeMode] = useState("preview");

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      contactInfo: {
        fullName: "",
        jobTitle: "",
        email: "",
        mobile: "",
        location: "",
        linkedin: "",
        twitter: "",
        website: ""
      },
      summary: "",
      skills: "",
      experience: [],
      education: [],
      projects: [],
    },
  });

  const {
    loading: isSaving,
    fn: saveResumeFn,
    data: saveResult,
    error: saveError,
  } = useFetch(saveResume);

  // Watch form fields for preview updates
  const formValues = watch();

  useEffect(() => {
    if (initialContent) setActiveTab("preview");
    if (initialTemplate) setSelectedTemplate(initialTemplate);
  }, [initialContent, initialTemplate]);

  // Update preview content when form values change
  useEffect(() => {
    const newContent = getCombinedContent();
    if (newContent) {
      setPreviewContent(newContent);
    }
  }, [formValues, user]); // Removed activeTab dependency


  // Handle save result
  useEffect(() => {
    if (saveResult && !isSaving) {
      toast.success("Resume saved successfully!");
    }
    if (saveError) {
      toast.error(saveError.message || "Failed to save resume");
    }
  }, [saveResult, saveError, isSaving]);

  const getContactMarkdown = () => {
    const { contactInfo } = formValues;
    const fullName = contactInfo?.fullName || user?.fullName || 'Your Name';
    const jobTitle = contactInfo?.jobTitle || 'Your Job Title';

    const parts = [];
    if (contactInfo?.email) parts.push(`📧 ${contactInfo.email}`);
    if (contactInfo?.mobile) parts.push(`📱 ${contactInfo.mobile}`);
    if (contactInfo?.location) parts.push(`📍 ${contactInfo.location}`);
    if (contactInfo?.linkedin)
      parts.push(`💼 [LinkedIn](${contactInfo.linkedin})`);
    if (contactInfo?.twitter) parts.push(`🐦 [Twitter](${contactInfo.twitter})`);
    if (contactInfo?.website) parts.push(`🌐 [Website](${contactInfo.website})`);

    return `## <div align='center'>${fullName}</div>\n\n<div align='center'>\n\n**${jobTitle}**\n\n${parts.join(' | ')}\n\n</div>`;
  };

  const getCombinedContent = () => {
    const { summary, skills, experience, education, projects } = formValues;
    return [
      getContactMarkdown(),
      summary && `## Professional Summary\n\n${summary}`,
      skills && `## Skills\n\n${skills}`,
      entriesToMarkdown(experience, "Work Experience"),
      entriesToMarkdown(education, "Education"),
      entriesToMarkdown(projects, "Projects"),
    ]
      .filter(Boolean)
      .join("\n\n");
  };

  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      // Dynamically import html2pdf only on client side
      const html2pdf = (await import("html2pdf.js/dist/html2pdf.min.js")).default;

      const element = document.getElementById("resume-pdf") || document.getElementById("resume-preview");
      const opt = {
        margin: [15, 15],
        filename: "resume.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (!selectedTemplate) {
        toast.error("Please select a template first");
        setActiveTab("template");
        return;
      }

      const formattedContent = previewContent
        .replace(/\n/g, "\n") // Normalize newlines
        .replace(/\n\s*\n/g, "\n\n") // Normalize multiple newlines to double newlines
        .trim();

      console.log(previewContent, formattedContent);
      await saveResumeFn(previewContent, selectedTemplate.id);
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setActiveTab("edit");
  };

  // Function to interpolate template data
  const interpolateTemplate = (htmlContent, formData) => {
    if (!htmlContent || !formData) return htmlContent;

    let interpolated = htmlContent;

    // Basic personal info - use form data or fallbacks
    const personalInfo = {
      fullName: formData.contactInfo?.fullName || user?.fullName || 'Your Name',
      email: formData.contactInfo?.email || 'your.email@example.com',
      phone: formData.contactInfo?.mobile || '+1 (555) 123-4567',
      location: formData.contactInfo?.location || 'Your City, State',
      linkedin: formData.contactInfo?.linkedin || 'linkedin.com/in/yourprofile',
      website: formData.contactInfo?.website || 'yourwebsite.com',
      title: formData.contactInfo?.jobTitle || 'Your Job Title'
    };

    // Replace basic template variables
    interpolated = interpolated.replace(/\{\{name\}\}/g, personalInfo.fullName);
    interpolated = interpolated.replace(/\{\{email\}\}/g, personalInfo.email);
    interpolated = interpolated.replace(/\{\{phone\}\}/g, personalInfo.phone);
    interpolated = interpolated.replace(/\{\{location\}\}/g, personalInfo.location);
    interpolated = interpolated.replace(/\{\{linkedin\}\}/g, personalInfo.linkedin);
    interpolated = interpolated.replace(/\{\{website\}\}/g, personalInfo.website);
    interpolated = interpolated.replace(/\{\{jobTitle\}\}/g, personalInfo.title);
    interpolated = interpolated.replace(/\{\{summary\}\}/g, formData.summary || 'Your professional summary goes here...');

    // Handle skills section - support both formats
    let skillsText = '';
    let skillsArray = [];

    if (formData.skills) {
      if (typeof formData.skills === 'string') {
        skillsText = formData.skills;
        skillsArray = formData.skills.split(',').map(skill => skill.trim()).filter(Boolean);
      } else if (Array.isArray(formData.skills)) {
        skillsArray = formData.skills.map(skill =>
          typeof skill === 'object' && skill.name ? skill.name : skill
        );
        skillsText = skillsArray.join(', ');
      }
    }

    interpolated = interpolated.replace(/\{\{skills\}\}/g, skillsText || 'JavaScript, React, Node.js, Python, SQL');

    // Handle skills list for templates that expect individual skill items
    if (skillsArray.length > 0) {
      const skillsListHtml = skillsArray.map(skill =>
        `<div class="skill-item">${skill}</div>`
      ).join('');
      interpolated = interpolated.replace(/\{\{#each skillsList\}\}.*?\{\{\/each\}\}/gs, skillsListHtml);
    } else {
      // Provide fallback skills
      const fallbackSkills = ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'];
      const skillsListHtml = fallbackSkills.map(skill =>
        `<div class="skill-item">${skill}</div>`
      ).join('');
      interpolated = interpolated.replace(/\{\{#each skillsList\}\}.*?\{\{\/each\}\}/gs, skillsListHtml);
    }

    // Experience section - handle different template formats
    if (formData.experience && formData.experience.length > 0) {
      const experienceHtml = formData.experience.map(exp => {
        const responsibilities = (exp.description || 'Key responsibilities and achievements').split('\n').filter(line => line.trim());
        const responsibilitiesHtml = responsibilities.map(line => {
          const cleanLine = line.trim().replace(/^[•\-\*]\s*/, '');
          return `<li>${cleanLine}</li>`;
        }).join('');

        return `
          <div class="job job-item experience-item">
            <div class="job-header">
              <h3>${exp.title || 'Job Title'}</h3>
              <span class="company">${exp.organization || 'Company Name'}</span>
              <span class="dates">${exp.startDate || 'Start Date'}${exp.endDate && !exp.current ? ' - ' + exp.endDate : exp.current ? ' - Present' : ''}</span>
            </div>
            <div class="timeline-dot"></div>
            <div class="content">
              <h3>${exp.title || 'Job Title'}</h3>
              <h4>${exp.organization || 'Company Name'}</h4>
              <span class="period">${exp.startDate || 'Start Date'}${exp.endDate && !exp.current ? ' - ' + exp.endDate : exp.current ? ' - Present' : ''}</span>
              <ul class="achievements responsibilities">
                ${responsibilitiesHtml}
              </ul>
            </div>
          </div>
        `;
      }).join('');

      interpolated = interpolated.replace(/\{\{#each experience\}\}.*?\{\{\/each\}\}/gs, experienceHtml);
    } else {
      const fallbackExperience = `
        <div class="job job-item experience-item">
          <div class="job-header">
            <h3>Software Engineer</h3>
            <span class="company">Tech Company</span>
            <span class="dates">2021 - Present</span>
          </div>
          <div class="timeline-dot"></div>
          <div class="content">
            <h3>Software Engineer</h3>
            <h4>Tech Company</h4>
            <span class="period">2021 - Present</span>
            <ul class="achievements responsibilities">
              <li>Developed and maintained web applications using modern technologies</li>
              <li>Collaborated with cross-functional teams to deliver high-quality software</li>
              <li>Implemented best practices for code quality and performance</li>
            </ul>
          </div>
        </div>
      `;
      interpolated = interpolated.replace(/\{\{#each experience\}\}.*?\{\{\/each\}\}/gs, fallbackExperience);
    }

    // Education section
    if (formData.education && formData.education.length > 0) {
      const educationHtml = formData.education.map(edu => `
        <div class="edu-item">
          <h3>${edu.title || 'Degree'}</h3>
          <p class="school">${edu.organization || 'University'}</p>
          <p class="dates">${edu.startDate || 'Year'}${edu.endDate && !edu.current ? ' - ' + edu.endDate : edu.current ? ' - Present' : ''}</p>
          ${edu.description ? `<p class="description">${edu.description}</p>` : ''}
        </div>
      `).join('');

      interpolated = interpolated.replace(/\{\{#each education\}\}.*?\{\{\/each\}\}/gs, educationHtml);
    } else {
      const fallbackEducation = `
        <div class="edu-item">
          <h3>Bachelor of Science in Computer Science</h3>
          <p class="school">University Name</p>
          <p class="dates">2020</p>
        </div>
      `;
      interpolated = interpolated.replace(/\{\{#each education\}\}.*?\{\{\/each\}\}/gs, fallbackEducation);
    }

    // Projects section - this was missing proper handling
    if (formData.projects && formData.projects.length > 0) {
      const projectsHtml = formData.projects.map(project => `
        <div class="project-card project-item">
          <h3>${project.title || 'Project Name'}</h3>
          <p class="description">${project.description || 'Project description and key achievements'}</p>
          ${project.organization ? `<p class="organization">${project.organization}</p>` : ''}
          ${project.startDate || project.endDate ? `<p class="dates">${project.startDate || ''}${project.endDate && !project.current ? ' - ' + project.endDate : project.current ? ' - Present' : ''}</p>` : ''}
        </div>
      `).join('');

      interpolated = interpolated.replace(/\{\{#each projects\}\}.*?\{\{\/each\}\}/gs, projectsHtml);
    } else {
      const fallbackProjects = `
        <div class="project-card project-item">
          <h3>E-commerce Platform</h3>
          <p class="description">Built a full-stack e-commerce platform with React and Node.js, featuring user authentication, payment processing, and inventory management.</p>
        </div>
        <div class="project-card project-item">
          <h3>Mobile App</h3>
          <p class="description">Developed a cross-platform mobile application using React Native, serving over 10,000 active users.</p>
        </div>
      `;
      interpolated = interpolated.replace(/\{\{#each projects\}\}.*?\{\{\/each\}\}/gs, fallbackProjects);
    }

    // Handle fallback replacements for missing template variables
    interpolated = interpolated.replace(/\{\{degree\}\}/g, 'Bachelor of Science in Computer Science');
    interpolated = interpolated.replace(/\{\{school\}\}/g, 'University Name');
    interpolated = interpolated.replace(/\{\{year\}\}/g, '2020');
    interpolated = interpolated.replace(/\{\{company\}\}/g, 'Company Name');
    interpolated = interpolated.replace(/\{\{title\}\}/g, 'Job Title');
    interpolated = interpolated.replace(/\{\{startDate\}\}/g, 'Start Date');
    interpolated = interpolated.replace(/\{\{endDate\}\}/g, 'End Date');

    return interpolated;
  };

  return (
    <div data-color-mode="light" className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2">
        <h1 className="font-bold gradient-title text-5xl md:text-6xl">
          Resume Builder
        </h1>
        <div className="space-x-2">
          <Button
            variant="destructive"
            onClick={handleSubmit(onSubmit)}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save
              </>
            )}
          </Button>
          <Button onClick={generatePDF} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download PDF
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="template">Template</TabsTrigger>
          <TabsTrigger value="edit" disabled={!selectedTemplate}>Form</TabsTrigger>
          <TabsTrigger value="preview" disabled={!selectedTemplate}>Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="template">
          <TemplateSelector
            selectedTemplate={selectedTemplate}
            onTemplateSelect={handleTemplateSelect}
          />
        </TabsContent>

        <TabsContent value="edit">
          {selectedTemplate && (
            <div className="mb-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Selected Template: {selectedTemplate.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab("template")}
                >
                  Change Template
                </Button>
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input
                    {...register("contactInfo.fullName")}
                    placeholder="John Doe"
                    error={errors.contactInfo?.fullName}
                  />
                  {errors.contactInfo?.fullName && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.fullName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Job Title</label>
                  <Input
                    {...register("contactInfo.jobTitle")}
                    placeholder="Software Engineer"
                    error={errors.contactInfo?.jobTitle}
                  />
                  {errors.contactInfo?.jobTitle && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.jobTitle.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    {...register("contactInfo.email")}
                    type="email"
                    placeholder="your@email.com"
                    error={errors.contactInfo?.email}
                  />
                  {errors.contactInfo?.email && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mobile Number</label>
                  <Input
                    {...register("contactInfo.mobile")}
                    type="tel"
                    placeholder="+1 234 567 8900"
                  />
                  {errors.contactInfo?.mobile && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.mobile.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    {...register("contactInfo.location")}
                    placeholder="City, State"
                    error={errors.contactInfo?.location}
                  />
                  {errors.contactInfo?.location && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.location.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Website</label>
                  <Input
                    {...register("contactInfo.website")}
                    type="url"
                    placeholder="https://yourwebsite.com"
                  />
                  {errors.contactInfo?.website && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.website.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">LinkedIn URL</label>
                  <Input
                    {...register("contactInfo.linkedin")}
                    type="url"
                    placeholder="https://linkedin.com/in/your-profile"
                  />
                  {errors.contactInfo?.linkedin && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.linkedin.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Twitter/X Profile
                  </label>
                  <Input
                    {...register("contactInfo.twitter")}
                    type="url"
                    placeholder="https://twitter.com/your-handle"
                  />
                  {errors.contactInfo?.twitter && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.twitter.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Professional Summary</h3>
              <Controller
                name="summary"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className="h-32"
                    placeholder="Write a compelling professional summary..."
                    error={errors.summary}
                  />
                )}
              />
              {errors.summary && (
                <p className="text-sm text-red-500">{errors.summary.message}</p>
              )}
            </div>

            {/* Skills */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Skills</h3>
              <Controller
                name="skills"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className="h-32"
                    placeholder="List your key skills..."
                    error={errors.skills}
                  />
                )}
              />
              {errors.skills && (
                <p className="text-sm text-red-500">{errors.skills.message}</p>
              )}
            </div>

            {/* Experience */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Work Experience</h3>
              <Controller
                name="experience"
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type="Experience"
                    entries={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.experience && (
                <p className="text-sm text-red-500">
                  {errors.experience.message}
                </p>
              )}
            </div>

            {/* Education */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Education</h3>
              <Controller
                name="education"
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type="Education"
                    entries={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.education && (
                <p className="text-sm text-red-500">
                  {errors.education.message}
                </p>
              )}
            </div>

            {/* Projects */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Projects</h3>
              <Controller
                name="projects"
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type="Project"
                    entries={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.projects && (
                <p className="text-sm text-red-500">
                  {errors.projects.message}
                </p>
              )}
            </div>
          </form>
        </TabsContent>

        <TabsContent value="preview">
          {activeTab === "preview" && (
            <Button
              variant="link"
              type="button"
              className="mb-2"
              onClick={() =>
                setResumeMode(resumeMode === "preview" ? "edit" : "preview")
              }
            >
              {resumeMode === "preview" ? (
                <>
                  <Edit className="h-4 w-4" />
                  Edit Resume
                </>
              ) : (
                <>
                  <Monitor className="h-4 w-4" />
                  Show Preview
                </>
              )}
            </Button>
          )}

          {activeTab === "preview" && resumeMode !== "preview" && (
            <div className="flex p-3 gap-2 items-center border-2 border-yellow-600 text-yellow-600 rounded mb-2">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm">
                You will lose editied markdown if you update the form data.
              </span>
            </div>
          )}
          <div className="border rounded-lg">
            <div className="p-4 border-b bg-muted/30">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Preview: {selectedTemplate?.name}</h4>
                  <p className="text-sm text-muted-foreground">{selectedTemplate?.description}</p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {selectedTemplate?.category}
                </div>
              </div>
            </div>
            {selectedTemplate?.htmlContent ? (
              <div className="relative">
                <style dangerouslySetInnerHTML={{ __html: selectedTemplate.cssStyles }} />
                <div
                  id="resume-preview"
                  className="p-4 bg-white min-h-[750px]"
                  dangerouslySetInnerHTML={{
                    __html: interpolateTemplate(selectedTemplate.htmlContent, watch())
                  }}
                />
              </div>
            ) : (
              <MDEditor
                value={previewContent}
                onChange={setPreviewContent}
                height={750}
                preview={resumeMode}
                data-color-mode="light"
              />
            )}
          </div>
          <div className="hidden">
            <div
              id="resume-pdf"
              style={{
                fontFamily: selectedTemplate?.cssStyles?.includes('font-family') ? 'inherit' : 'Arial, sans-serif',
                color: '#000000'
              }}
            >
              {selectedTemplate?.htmlContent ? (
                <div>
                  <style dangerouslySetInnerHTML={{ __html: selectedTemplate.cssStyles }} />
                  <div dangerouslySetInnerHTML={{
                    __html: interpolateTemplate(selectedTemplate.htmlContent, watch())
                  }} />
                </div>
              ) : (
                <MDEditor.Markdown
                  source={previewContent}
                  style={{
                    background: "white",
                    color: "black",
                    fontFamily: 'Arial, sans-serif'
                  }}
                />
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
