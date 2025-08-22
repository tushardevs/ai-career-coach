export default function CreativeTemplate({ formValues, user }) {
  const { contactInfo, summary, skills, experience, education, projects } = formValues;

  return (
    <div className="font-sans text-gray-900">
      {/* Header */}
      <header className="border-b-2 border-gray-800 pb-4 mb-6">
        <h1 className="text-4xl font-extrabold text-indigo-700">{user?.fullName}</h1>
        <p className="text-sm text-gray-600 mt-2">
          {contactInfo.email} | {contactInfo.mobile} | {contactInfo.linkedin}
        </p>
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-6">
          <h2 className="text-xl font-bold text-indigo-600 uppercase">Profile</h2>
          <p className="mt-2 text-gray-700">{summary}</p>
        </section>
      )}

      {/* Skills */}
      {skills && (
        <section className="mb-6">
          <h2 className="text-xl font-bold text-indigo-600 uppercase">Skills</h2>
          <ul className="flex flex-wrap gap-2 mt-2">
            {skills.split(",").map((skill, i) => (
              <li
                key={i}
                className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm"
              >
                {skill.trim()}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Timeline Section */}
      <div className="space-y-8">
        {/* Experience */}
        {experience?.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-indigo-600 uppercase">Experience</h2>
            <div className="mt-4 border-l-2 border-indigo-500 pl-6">
              {experience.map((e, i) => (
                <div key={i} className="mb-6 relative">
                  <span className="absolute -left-3 top-1 w-5 h-5 bg-indigo-500 rounded-full"></span>
                  <p className="text-sm text-gray-500">
                    {e.startDate} – {e.endDate || "Present"}
                  </p>
                  <h3 className="font-bold text-lg">{e.title}</h3>
                  <p className="italic text-gray-600">{e.organization}</p>
                  <p className="mt-1">{e.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects?.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-indigo-600 uppercase">Projects</h2>
            <div className="mt-4 border-l-2 border-indigo-500 pl-6">
              {projects.map((p, i) => (
                <div key={i} className="mb-6 relative">
                  <span className="absolute -left-3 top-1 w-5 h-5 bg-indigo-500 rounded-full"></span>
                  <h3 className="font-bold text-lg">{p.title}</h3>
                  <p className="mt-1">{p.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education?.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-indigo-600 uppercase">Education</h2>
            <div className="mt-4 border-l-2 border-indigo-500 pl-6">
              {education.map((ed, i) => (
                <div key={i} className="mb-6 relative">
                  <span className="absolute -left-3 top-1 w-5 h-5 bg-indigo-500 rounded-full"></span>
                  <p className="text-sm text-gray-500">
                    {ed.startDate} – {ed.endDate}
                  </p>
                  <h3 className="font-bold text-lg">{ed.title}</h3>
                  <p className="italic text-gray-600">{ed.organization}</p>
                  <p className="mt-1">{ed.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
