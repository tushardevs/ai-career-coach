export default function MinimalTemplate({ formValues, user }) {
  const { contactInfo, summary, skills, experience, education, projects } = formValues;

  return (
    <div className="font-light text-gray-900">
      <h1 className="text-2xl font-bold">{user?.fullName}</h1>
      <p className="text-sm">{contactInfo.email} | {contactInfo.mobile}</p>

      {summary && <p className="mt-4">{summary}</p>}

      {skills && (
        <p className="mt-4"><b>Skills:</b> {skills}</p>
      )}

      {experience?.length > 0 && (
        <section className="mt-4">
          <h2 className="font-semibold">Experience</h2>
          {experience.map((e, i) => (
            <div key={i}>
              <p><b>{e.title}</b> - {e.organization}</p>
              <p className="text-xs">{e.startDate} - {e.endDate || "Present"}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
