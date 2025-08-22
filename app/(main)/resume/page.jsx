import { getResume } from "@/actions/resume";
import ResumeBuilder from "./_components/resume-builder";
import TemplateSelector from "./_components/template-selector";

export default async function ResumePage(props) {
  const searchParams = await props.searchParams; // 👈 fix
  const template = searchParams?.template;
  const resume = await getResume();

  if (!template) {
    return <TemplateSelector />;
  }

  return (
    <div className="container mx-auto py-6">
      <ResumeBuilder initialContent={resume?.content} selectedTemplate={template} />
    </div>
  );
}
