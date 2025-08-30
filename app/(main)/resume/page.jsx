import { getResume } from "@/actions/resume";
// import { seedDefaultTemplates } from "@/actions/templates";
import ResumeBuilder from "./_components/resume-builder";

export default async function ResumePage() {
  // Seed default templates if they don't exist
//   try {
//     await seedDefaultTemplates();
//   } catch (error) {
//     console.error("Error seeding templates:", error);
//     // Continue without seeding if database is not available
//   }

  let resume = null;
  try {
    resume = await getResume();
  } catch (error) {
    console.error("Error fetching resume:", error);
    // Continue without resume data if database is not available
  }

  return (
    <div className="container mx-auto py-6">
      <ResumeBuilder
        initialContent={resume?.content}
        initialTemplate={resume?.template}
      />
    </div>
  );
}
