export default function ModernTemplate({ formValues, user }) {
  const { contactInfo, summary, skills, experience, education, projects } = formValues;

  return (
    <div className="font-sans text-gray-800 grid grid-cols-3 gap-6">
      {/* Sidebar */}
      <aside className="col-span-1 bg-gray-100 p-4 rounded">
        <h1 className="text-2xl font-extrabold text-blue-700">{user?.fullName}</h1>
        <p className="mt-2 text-sm">{contactInfo.email}</p>
        <p className="text-sm">{contactInfo.mobile}</p>
        <p className="text-sm">{contactInfo.linkedin}</p>

        {skills && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-blue-700">Skills</h2>
            <ul className="list-disc list-inside mt-2 text-sm">
              {skills.split(",").map((s, i) => <li key={i}>{s.trim()}</li>)}
            </ul>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="col-span-2 space-y-6">
        {summary && (
          <section>
            <h2 className="text-xl font-semibold text-blue-700">Profile</h2>
            <p className="mt-2">{summary}</p>
          </section>
        )}

        {experience?.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-blue-700">Experience</h2>
            {experience.map((e, i) => (
              <div key={i} className="mt-2">
                <h3 className="font-bold">{e.title}</h3>
                <p className="text-sm">{e.organization} | {e.startDate} - {e.endDate || "Present"}</p>
                <p>{e.description}</p>
              </div>
            ))}
          </section>
        )}

        {projects?.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-blue-700">Projects</h2>
            {projects.map((p, i) => (
              <div key={i} className="mt-2">
                <h3 className="font-bold">{p.title}</h3>
                <p>{p.description}</p>
              </div>
            ))}
          </section>
        )}

        {education?.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-blue-700">Education</h2>
            {education.map((ed, i) => (
              <div key={i} className="mt-2">
                <h3 className="font-bold">{ed.title}</h3>
                <p className="text-sm">{ed.organization}</p>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
