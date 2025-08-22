"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EntryForm } from "./entry-form";

export default function ResumeEntryForm({ formValues, setFormValues }) {
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
