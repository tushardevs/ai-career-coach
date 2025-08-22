"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { entrySchema } from "@/app/lib/schema";
import { Sparkles, PlusCircle, X, Loader2 } from "lucide-react";
import { improveWithAI } from "@/actions/resume";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";

// ✅ Format YYYY-MM into "MMM yyyy"
const formatDisplayDate = (dateString) => {
  if (!dateString) return "";
  const date = parse(dateString, "yyyy-MM", new Date());
  return format(date, "MMM yyyy");
};

// ✅ Section Form (Experience, Education, Projects)
export function EntryForm({ type, entries = [], onChange }) {
  const safeEntries = Array.isArray(entries) ? entries : [];
  const [isAdding, setIsAdding] = useState(false);

  const {
    register,
    handleSubmit: handleValidation,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      title: "",
      organization: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
    },
  });

  const current = watch("current");

  // ✅ Add new entry
  const handleAdd = handleValidation((data) => {
    const formattedEntry = {
      ...data,
      startDate: formatDisplayDate(data.startDate),
      endDate: data.current ? "Present" : formatDisplayDate(data.endDate),
    };

    onChange([...safeEntries, formattedEntry]);
    reset();
    setIsAdding(false);
  });

  // ✅ Delete entry
  const handleDelete = (index) => {
    const newEntries = safeEntries.filter((_, i) => i !== index);
    onChange(newEntries);
  };

  // ✅ AI improvement
  const {
    loading: isImproving,
    fn: improveWithAIFn,
    data: improvedContent,
    error: improveError,
  } = useFetch(improveWithAI);

  useEffect(() => {
    if (improvedContent && !isImproving) {
      setValue("description", improvedContent);
      toast.success("Description improved successfully!");
    }
    if (improveError) {
      toast.error(improveError.message || "Failed to improve description");
    }
  }, [improvedContent, improveError, isImproving, setValue]);

  const handleImproveDescription = async () => {
    const description = watch("description");
    if (!description) {
      toast.error("Please enter a description first");
      return;
    }

    await improveWithAIFn({
      current: description,
      type: type.toLowerCase(),
    });
  };

  return (
    <div className="space-y-4">
      {/* Existing entries */}
      {safeEntries.map((item, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              {item.title} @ {item.organization}
            </CardTitle>
            <Button
              variant="outline"
              size="icon"
              type="button"
              onClick={() => handleDelete(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {item.startDate} – {item.endDate}
            </p>
            <p className="mt-2 text-sm whitespace-pre-wrap">
              {item.description}
            </p>
          </CardContent>
        </Card>
      ))}

      {/* Add new entry */}
      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Add {type}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Title/Position" {...register("title")} />
              <Input
                placeholder="Organization/Company"
                {...register("organization")}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input type="month" {...register("startDate")} />
              <Input type="month" {...register("endDate")} disabled={current} />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="current"
                {...register("current")}
                onChange={(e) => {
                  setValue("current", e.target.checked);
                  if (e.target.checked) setValue("endDate", "");
                }}
              />
              <label htmlFor="current">Current {type}</label>
            </div>

            <Textarea
              placeholder={`Description of your ${type.toLowerCase()}`}
              className="h-32"
              {...register("description")}
            />

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleImproveDescription}
              disabled={isImproving || !watch("description")}
            >
              {isImproving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Improving...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Improve with AI
                </>
              )}
            </Button>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setIsAdding(false);
              }}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleAdd}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Add button */}
      {!isAdding && (
        <Button
          className="w-full"
          variant="outline"
          onClick={() => setIsAdding(true)}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add {type}
        </Button>
      )}
    </div>
  );
}

// ✅ Wrapper form for all resume sections
export function ResumeEntryForm({ formValues, setFormValues }) {
  const updateField = (field, value) => {
    setFormValues({ ...formValues, [field]: value });
  };

  return (
    <div className="space-y-8">
      {/* Contact Info */}
      <section>
        <h2 className="text-lg font-semibold mb-2">Contact Info</h2>
        <Input
          placeholder="Email"
          value={formValues.contactInfo?.email || ""}
          onChange={(e) =>
            updateField("contactInfo", {
              ...formValues.contactInfo,
              email: e.target.value,
            })
          }
          className="mb-2"
        />
        <Input
          placeholder="Mobile"
          value={formValues.contactInfo?.mobile || ""}
          onChange={(e) =>
            updateField("contactInfo", {
              ...formValues.contactInfo,
              mobile: e.target.value,
            })
          }
          className="mb-2"
        />
        <Input
          placeholder="LinkedIn"
          value={formValues.contactInfo?.linkedin || ""}
          onChange={(e) =>
            updateField("contactInfo", {
              ...formValues.contactInfo,
              linkedin: e.target.value,
            })
          }
        />
      </section>

      {/* Summary */}
      <section>
        <h2 className="text-lg font-semibold mb-2">Summary</h2>
        <Textarea
          placeholder="Write a short professional summary"
          value={formValues.summary || ""}
          onChange={(e) => updateField("summary", e.target.value)}
        />
      </section>

      {/* Experience */}
      <section>
        <h2 className="text-lg font-semibold mb-2">Experience</h2>
        <EntryForm
          type="Experience"
          entries={formValues.experience || []}
          onChange={(val) => updateField("experience", val)}
        />
      </section>

      {/* Education */}
      <section>
        <h2 className="text-lg font-semibold mb-2">Education</h2>
        <EntryForm
          type="Education"
          entries={formValues.education || []}
          onChange={(val) => updateField("education", val)}
        />
      </section>

      {/* Projects */}
      <section>
        <h2 className="text-lg font-semibold mb-2">Projects</h2>
        <EntryForm
          type="Project"
          entries={formValues.projects || []}
          onChange={(val) => updateField("projects", val)}
        />
      </section>
    </div>
  );
}

export default ResumeEntryForm;
