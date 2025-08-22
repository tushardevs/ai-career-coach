import { Globe, Mail, Phone, User } from "lucide-react";

function Section({ title, children }) {
  return (
    <section className="mb-6">
      <h2 className="uppercase font-semibold border-b border-gray-400 pb-1 tracking-wide text-gray-800">
        {title}
      </h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}

export default function ClassicTemplate({ formValues, user }) {
  const { contactInfo, summary, skills, experience, education, projects, publications } = formValues;

  return (
    <div className="font-serif text-gray-900 text-sm leading-relaxed max-w-3xl mx-auto">
      {/* Header */}
      <header className="text-center mb-6">
        <h1 className="text-2xl font-bold tracking-wide">{user?.fullName || "Your Name"}</h1>
        <div className="flex justify-center gap-4 mt-2 text-xs text-gray-700 flex-wrap">
          {contactInfo?.username && (
            <span className="flex items-center gap-1">
              <User size={12} /> {contactInfo.username}
            </span>
          )}
          {contactInfo?.website && (
            <span className="flex items-center gap-1">
              <Globe size={12} /> {contactInfo.website}
            </span>
          )}
          {contactInfo?.email && (
            <span className="flex items-center gap-1">
              <Mail size={12} /> {contactInfo.email}
            </span>
          )}
          {contactInfo?.mobile && (
            <span className="flex items-center gap-1">
              <Phone size={12} /> {contactInfo.mobile}
            </span>
          )}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <Section title="Summary">
          <p>{summary}</p>
        </Section>
      )}

      {/* Work Experience */}
      {experience?.length > 0 && (
        <Section title="Work Experience">
          {experience.map((e, i) => (
            <div key={i} className="flex justify-between mb-2">
              <div>
                <p className="font-semibold">{e.title}</p>
                <p className="text-gray-700">{e.description}</p>
              </div>
              <span className="text-gray-600 text-sm whitespace-nowrap">
                {e.startDate} – {e.endDate || "Present"}
              </span>
            </div>
          ))}
        </Section>
      )}

      {/* Projects */}
      {projects?.length > 0 && (
        <Section title="Projects">
          {projects.map((p, i) => (
            <div key={i} className="flex justify-between mb-2">
              <p className="font-semibold">{p.title}</p>
              {p.link && (
                <a
                  href={p.link}
                  className="text-blue-600 underline text-sm"
                  target="_blank"
                  rel="noreferrer"
                >
                  Link
                </a>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* Education */}
      {education?.length > 0 && (
        <Section title="Education">
          {education.map((ed, i) => (
            <div key={i} className="flex justify-between mb-2">
              <div>
                <p className="font-semibold">{ed.title}</p>
                <p className="italic">{ed.organization}</p>
              </div>
              <span className="text-gray-600 text-sm">
                {ed.gpa ? `GPA: ${ed.gpa}` : `${ed.startDate} – ${ed.endDate}`}
              </span>
            </div>
          ))}
        </Section>
      )}

      {/* Publications */}
      {publications?.length > 0 && (
        <Section title="Publications">
          {publications.map((pub, i) => (
            <p key={i} className="text-sm mb-2">
              {pub}
            </p>
          ))}
        </Section>
      )}

      {/* Skills */}
      {skills && (
        <Section title="Skills">
          <div className="grid grid-cols-2 gap-2">
            {skills.split(",").map((s, i) => (
              <span key={i}>{s.trim()}</span>
            ))}
          </div>
        </Section>
      )}

      {/* Footer */}
      <footer className="text-xs text-gray-500 text-center mt-8">
        Last updated: {new Date().toLocaleDateString()}
      </footer>
    </div>
  );
}
