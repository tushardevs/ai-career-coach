"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function seedDefaultTemplates() {
  try {
    await seedResumeTemplates();
  } catch (error) {
    console.error("Error seeding default templates:", error);
    throw error;
  }
}

export async function getResumeTemplates() {
  try {
    const templates = await db.resumeTemplate.findMany({
      orderBy: { isDefault: "desc" },
    });
    return templates;
  } catch (error) {
    console.error("Error fetching resume templates:", error);
    throw new Error("Failed to fetch resume templates");
  }
}

export async function seedResumeTemplates() {
  const templates = [
    {
      name: "Classic ATS-Friendly",
      description: "Clean, professional template optimized for Applicant Tracking Systems",
      category: "ATS-Friendly",
      isDefault: true,
      htmlContent: `
        <div class="resume-container ats-friendly">
          <header class="header">
            <h1 class="name">{{name}}</h1>
            <div class="contact-info">
              <p>{{email}} | {{phone}} | {{location}}</p>
              <p>{{linkedin}} | {{website}}</p>
            </div>
          </header>

          <section class="summary">
            <h2>Professional Summary</h2>
            <p>{{summary}}</p>
          </section>

          <section class="experience">
            <h2>Professional Experience</h2>
            {{#each experience}}
            <div class="job">
              <div class="job-header">
                <h3>{{title}}</h3>
                <span class="company">{{company}}</span>
                <span class="dates">{{startDate}} - {{endDate}}</span>
              </div>
              <ul class="responsibilities">
                {{#each responsibilities}}
                <li>{{this}}</li>
                {{/each}}
              </ul>
            </div>
            {{/each}}
          </section>

          <section class="projects">
            <h2>Key Projects</h2>
            {{#each projects}}
            <div class="project-card">
              <h3>{{name}}</h3>
              <p class="description">{{description}}</p>
            </div>
            {{/each}}
          </section>

          <section class="education">
            <h2>Education</h2>
            {{#each education}}
            <div class="edu-item">
              <h3>{{degree}}</h3>
              <p class="school">{{school}}, {{year}}</p>
            </div>
            {{/each}}
          </section>

          <section class="skills">
            <h2>Technical Skills</h2>
            <p class="skills-text">{{skills}}</p>
          </section>
        </div>
      `,
      cssStyles: `
        .resume-container.ats-friendly {
          font-family: 'Calibri', 'Arial', sans-serif;
          max-width: 8.5in;
          margin: 0 auto;
          padding: 0.75in;
          background: white;
          color: #000;
          line-height: 1.5;
          font-size: 11pt;
        }

        .header {
          text-align: center;
          border-bottom: 2px solid #2c3e50;
          padding-bottom: 15px;
          margin-bottom: 25px;
        }

        .name {
          font-size: 24pt;
          font-weight: bold;
          margin: 0 0 10px 0;
          color: #2c3e50;
        }

        .contact-info p {
          margin: 5px 0;
          font-size: 10pt;
          color: #555;
        }

        section {
          margin-bottom: 25px;
        }

        h2 {
          font-size: 14pt;
          font-weight: bold;
          margin-bottom: 12px;
          text-transform: uppercase;
          color: #2c3e50;
          border-bottom: 1px solid #bdc3c7;
          padding-bottom: 5px;
        }

        .job, .edu-item, .project-card {
          margin-bottom: 18px;
          page-break-inside: avoid;
        }

        .job-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          flex-wrap: wrap;
        }

        h3 {
          font-size: 12pt;
          font-weight: bold;
          margin: 0;
          color: #2c3e50;
        }

        .company {
          font-weight: 600;
          color: #7f8c8d;
          font-size: 11pt;
        }

        .dates {
          font-style: italic;
          font-size: 10pt;
          color: #7f8c8d;
          white-space: nowrap;
        }

        .responsibilities, ul {
          margin: 8px 0 0 20px;
          padding: 0;
        }

        li {
          font-size: 10pt;
          margin-bottom: 4px;
          line-height: 1.4;
        }

        .project-card {
          border-left: 3px solid #3498db;
          padding-left: 15px;
          margin-bottom: 15px;
        }

        .project-card h3 {
          color: #3498db;
          margin-bottom: 5px;
        }

        .description {
          font-size: 10pt;
          line-height: 1.4;
          margin: 0;
        }

        .school {
          font-size: 10pt;
          color: #7f8c8d;
          margin: 3px 0;
        }

        .skills-text {
          font-size: 10pt;
          line-height: 1.6;
          margin: 0;
        }

        @media print {
          .resume-container.ats-friendly {
            padding: 0.5in;
            font-size: 10pt;
          }
          .name {
            font-size: 20pt;
          }
        }
      `
    },
    {
      name: "Modern Professional Blue",
      description: "Contemporary design with blue accents and clean typography for corporate environments",
      category: "Professional",
      isDefault: true,
      htmlContent: `
        <div class="resume-container professional-blue">
          <header class="header-blue">
            <h1 class="name">{{name}}</h1>
            <p class="job-title">{{jobTitle}}</p>
            <div class="contact-info">
              <span>{{email}}</span>
              <span>{{phone}}</span>
              <span>{{location}}</span>
            </div>
          </header>

          <section class="summary">
            <h2>Professional Summary</h2>
            <p>{{summary}}</p>
          </section>

          <section class="experience">
            <h2>Professional Experience</h2>
            {{#each experience}}
            <div class="job-item">
              <div class="job-header">
                <div class="job-title-group">
                  <h3>{{title}}</h3>
                  <span class="company">{{company}}</span>
                </div>
                <span class="dates">{{startDate}} - {{endDate}}</span>
              </div>
              <ul class="achievements">
                {{#each responsibilities}}
                <li>{{this}}</li>
                {{/each}}
              </ul>
            </div>
            {{/each}}
          </section>

          <div class="two-column">
            <section class="projects">
              <h2>Key Projects</h2>
              {{#each projects}}
              <div class="project-card">
                <h3>{{name}}</h3>
                <p class="description">{{description}}</p>
              </div>
              {{/each}}
            </section>

            <section class="skills">
              <h2>Core Skills</h2>
              <div class="skills-grid">
                {{#each skillsList}}
                <div class="skill-item">{{this}}</div>
                {{/each}}
              </div>
            </section>
          </div>

          <section class="education">
            <h2>Education</h2>
            {{#each education}}
            <div class="edu-item">
              <h3>{{degree}}</h3>
              <p class="school">{{school}}, {{year}}</p>
            </div>
            {{/each}}
          </section>
        </div>
      `,
      cssStyles: `
        .resume-container.professional-blue {
          font-family: 'Segoe UI', 'Calibri', sans-serif;
          max-width: 8.5in;
          margin: 0 auto;
          background: white;
          color: #1f2937;
          line-height: 1.6;
        }

        .header-blue {
          background: linear-gradient(135deg, #1e40af, #3b82f6);
          color: white;
          padding: 2.5rem 2rem;
          text-align: center;
          margin-bottom: 0;
        }

        .name {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          letter-spacing: 1px;
        }

        .job-title {
          font-size: 1.2rem;
          margin-bottom: 1rem;
          opacity: 0.95;
          font-weight: 300;
        }

        .contact-info {
          display: flex;
          justify-content: center;
          gap: 2rem;
          font-size: 0.9rem;
          flex-wrap: wrap;
        }

        section {
          padding: 1.5rem 2rem;
        }

        h2 {
          color: #1e40af;
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 1.2rem;
          border-bottom: 3px solid #3b82f6;
          padding-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .job-item {
          margin-bottom: 2rem;
          border-left: 4px solid #e5e7eb;
          padding-left: 1.5rem;
          position: relative;
        }

        .job-item::before {
          content: '';
          position: absolute;
          left: -8px;
          top: 0;
          width: 12px;
          height: 12px;
          background: #3b82f6;
          border-radius: 50%;
        }

        .job-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.8rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .job-title-group {
          flex: 1;
        }

        h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1e40af;
          margin: 0 0 0.3rem 0;
        }

        .company {
          font-weight: 500;
          color: #374151;
          font-size: 1rem;
        }

        .dates {
          font-style: italic;
          color: #6b7280;
          font-size: 0.9rem;
          white-space: nowrap;
        }

        .achievements {
          margin: 0;
          padding-left: 1.2rem;
        }

        .achievements li {
          margin-bottom: 0.4rem;
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .two-column {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          background: #f8fafc;
        }

        .project-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 1.2rem;
          margin-bottom: 1rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .project-card h3 {
          color: #1e40af;
          margin-bottom: 0.5rem;
          font-size: 1rem;
        }

        .description {
          font-size: 0.9rem;
          color: #4b5563;
          line-height: 1.5;
          margin: 0;
        }

        .skills-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
        }

        .skill-item {
          background: linear-gradient(135deg, #3b82f6, #1e40af);
          color: white;
          padding: 0.4rem 1rem;
          border-radius: 25px;
          font-size: 0.85rem;
          font-weight: 500;
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
        }

        .edu-item {
          margin-bottom: 1rem;
        }

        .edu-item h3 {
          margin-bottom: 0.3rem;
        }

        .school {
          font-size: 0.9rem;
          color: #6b7280;
          margin: 0;
        }

        @media print {
          .header-blue {
            background: #1e40af !important;
            color: white !important;
          }
          .two-column {
            grid-template-columns: 1fr;
          }
        }
      `
    },
    {
      name: "Creative Portfolio Green",
      description: "Vibrant design with green color scheme and creative layout for design professionals",
      category: "Creative",
      htmlContent: `
        <div class="resume-container creative-green">
          <div class="sidebar">
            <div class="profile-section">
              <h1 class="name">{{name}}</h1>
              <p class="title">{{jobTitle}}</p>
            </div>

            <section class="contact">
              <h2>Contact</h2>
              <div class="contact-item">
                <span class="icon">📧</span>
                <span>{{email}}</span>
              </div>
              <div class="contact-item">
                <span class="icon">📱</span>
                <span>{{phone}}</span>
              </div>
              <div class="contact-item">
                <span class="icon">📍</span>
                <span>{{location}}</span>
              </div>
            </section>

            <section class="skills">
              <h2>Core Skills</h2>
              <div class="skills-list">
                {{#each skillsList}}
                <div class="skill-tag">{{this}}</div>
                {{/each}}
              </div>
            </section>
          </div>

          <div class="main-content">
            <section class="summary">
              <h2>About Me</h2>
              <p>{{summary}}</p>
            </section>

            <section class="experience">
              <h2>Experience</h2>
              {{#each experience}}
              <div class="experience-item">
                <div class="timeline-dot"></div>
                <div class="content">
                  <h3>{{title}}</h3>
                  <h4>{{company}}</h4>
                  <span class="period">{{startDate}} - {{endDate}}</span>
                  <ul class="responsibilities">
                    {{#each responsibilities}}
                    <li>{{this}}</li>
                    {{/each}}
                  </ul>
                </div>
              </div>
              {{/each}}
            </section>

            <section class="projects">
              <h2>Featured Projects</h2>
              <div class="projects-grid">
                {{#each projects}}
                <div class="project-card">
                  <h3>{{name}}</h3>
                  <p class="description">{{description}}</p>
                </div>
                {{/each}}
              </div>
            </section>

            <section class="education">
              <h2>Education</h2>
              {{#each education}}
              <div class="edu-item">
                <h3>{{degree}}</h3>
                <p class="school">{{school}}, {{year}}</p>
              </div>
              {{/each}}
            </section>
          </div>
        </div>
      `,
      cssStyles: `
        .resume-container.creative-green {
          font-family: 'Inter', 'Segoe UI', sans-serif;
          display: flex;
          max-width: 8.5in;
          margin: 0 auto;
          background: white;
          min-height: 11in;
          box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }

        .sidebar {
          background: linear-gradient(180deg, #047857, #059669, #10b981);
          color: white;
          width: 35%;
          padding: 2rem 1.5rem;
          position: relative;
        }

        .sidebar::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.1);
          pointer-events: none;
        }

        .profile-section {
          text-align: center;
          margin-bottom: 2.5rem;
          position: relative;
          z-index: 2;
        }

        .name {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .title {
          font-size: 1.1rem;
          opacity: 0.95;
          font-weight: 300;
          letter-spacing: 0.5px;
        }

        .sidebar h2 {
          font-size: 1.2rem;
          margin-bottom: 1.2rem;
          color: white;
          border-bottom: 2px solid rgba(255,255,255,0.4);
          padding-bottom: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
        }

        .contact-item {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
          font-size: 0.9rem;
          padding: 0.3rem 0;
        }

        .icon {
          margin-right: 0.8rem;
          font-size: 1.1rem;
        }

        .skills-list {
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
        }

        .skill-tag {
          background: rgba(255,255,255,0.2);
          padding: 0.5rem 0.8rem;
          border-radius: 20px;
          font-size: 0.85rem;
          text-align: center;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.3);
        }

        .main-content {
          flex: 1;
          padding: 2.5rem 2rem;
          background: #fafafa;
        }

        .main-content h2 {
          color: #047857;
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          position: relative;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .main-content h2:after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 60px;
          height: 4px;
          background: linear-gradient(90deg, #10b981, #34d399);
          border-radius: 2px;
        }

        .summary p {
          font-size: 1rem;
          line-height: 1.7;
          color: #374151;
          margin-bottom: 1.5rem;
        }

        .experience-item {
          display: flex;
          margin-bottom: 2rem;
          position: relative;
        }

        .timeline-dot {
          width: 16px;
          height: 16px;
          background: linear-gradient(135deg, #10b981, #34d399);
          border-radius: 50%;
          margin-right: 1.5rem;
          margin-top: 0.3rem;
          flex-shrink: 0;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2);
        }

        .content h3 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #047857;
          margin-bottom: 0.3rem;
        }

        .content h4 {
          font-size: 1rem;
          color: #6b7280;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .period {
          font-size: 0.85rem;
          color: #9ca3af;
          font-style: italic;
          background: #e5e7eb;
          padding: 0.2rem 0.6rem;
          border-radius: 12px;
          display: inline-block;
        }

        .content ul {
          margin-top: 0.8rem;
          margin-left: 0;
          padding-left: 1.2rem;
        }

        .content li {
          font-size: 0.9rem;
          margin-bottom: 0.4rem;
          line-height: 1.5;
          color: #4b5563;
        }

        .projects-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-top: 1rem;
        }

        .project-card {
          background: white;
          border: 2px solid #10b981;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px rgba(16, 185, 129, 0.1);
          transition: transform 0.2s ease;
        }

        .project-card:hover {
          transform: translateY(-2px);
        }

        .project-card h3 {
          color: #047857;
          font-size: 1.1rem;
          margin-bottom: 0.8rem;
          font-weight: 600;
        }

        .project-card .description {
          font-size: 0.9rem;
          color: #6b7280;
          line-height: 1.5;
          margin: 0;
        }

        .edu-item {
          background: white;
          padding: 1.2rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          border-left: 4px solid #10b981;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .edu-item h3 {
          color: #047857;
          margin-bottom: 0.5rem;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .school {
          font-size: 0.9rem;
          color: #6b7280;
          margin: 0;
        }

        @media print {
          .resume-container.creative-green {
            box-shadow: none;
          }
          .sidebar {
            background: #047857 !important;
          }
        }
      `
    },
    {
      name: "Minimalist Black & White",
      description: "Ultra-clean minimalist design focusing on typography and white space",
      category: "Minimalist",
      htmlContent: `
        <div class="resume-container minimalist">
          <header class="header">
            <h1 class="name">{{name}}</h1>
            <div class="tagline">{{jobTitle}}</div>
            <div class="contact">
              {{email}} • {{phone}} • {{location}}
            </div>
          </header>

          <section class="summary">
            <p class="summary-text">{{summary}}</p>
          </section>

          <section class="experience">
            <h2>Experience</h2>
            {{#each experience}}
            <div class="job">
              <div class="job-header">
                <h3>{{title}}</h3>
                <span class="dates">{{startDate}} — {{endDate}}</span>
              </div>
              <div class="company">{{company}}</div>
              <ul class="responsibilities">
                {{#each responsibilities}}
                <li>{{this}}</li>
                {{/each}}
              </ul>
            </div>
            {{/each}}
          </section>

          <section class="projects">
            <h2>Projects</h2>
            {{#each projects}}
            <div class="project-item">
              <h3>{{name}}</h3>
              <p class="description">{{description}}</p>
            </div>
            {{/each}}
          </section>

          <section class="education">
            <h2>Education</h2>
            {{#each education}}
            <div class="edu-item">
              <h3>{{degree}}</h3>
              <div class="school">{{school}}, {{year}}</div>
            </div>
            {{/each}}
          </section>

          <section class="skills">
            <h2>Skills</h2>
            <div class="skills-list">{{skills}}</div>
          </section>
        </div>
      `,
      cssStyles: `
        .resume-container.minimalist {
          font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
          max-width: 8.5in;
          margin: 0 auto;
          padding: 3rem 2.5rem;
          background: white;
          color: #1f2937;
          line-height: 1.7;
        }

        .header {
          text-align: center;
          margin-bottom: 4rem;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 2.5rem;
        }

        .name {
          font-size: 3rem;
          font-weight: 200;
          letter-spacing: 3px;
          margin-bottom: 0.8rem;
          color: #111827;
        }

        .tagline {
          font-size: 1.3rem;
          color: #6b7280;
          margin-bottom: 1.5rem;
          font-weight: 300;
          letter-spacing: 1px;
        }

        .contact {
          font-size: 1rem;
          color: #9ca3af;
          letter-spacing: 0.5px;
        }

        section {
          margin-bottom: 3.5rem;
        }

        h2 {
          font-size: 1rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #374151;
          margin-bottom: 2rem;
          position: relative;
          padding-left: 0;
        }

        h2:after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 40px;
          height: 1px;
          background: #374151;
        }

        .summary-text {
          font-size: 1.1rem;
          line-height: 1.9;
          color: #4b5563;
          text-align: justify;
          margin: 0;
          font-weight: 300;
        }

        .job {
          margin-bottom: 2.5rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid #f3f4f6;
        }

        .job:last-child {
          border-bottom: none;
        }

        .job-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 0.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .job h3 {
          font-size: 1.3rem;
          font-weight: 500;
          color: #1f2937;
          margin: 0;
          letter-spacing: 0.5px;
        }

        .dates {
          font-size: 0.9rem;
          color: #9ca3af;
          font-weight: 300;
          white-space: nowrap;
        }

        .company {
          font-size: 1rem;
          color: #6b7280;
          margin-bottom: 1rem;
          font-style: italic;
          font-weight: 300;
        }

        .responsibilities {
          margin-left: 0;
          padding-left: 1.5rem;
          list-style: none;
        }

        .responsibilities li {
          font-size: 0.95rem;
          margin-bottom: 0.6rem;
          color: #4b5563;
          line-height: 1.6;
          position: relative;
          font-weight: 300;
        }

        .responsibilities li:before {
          content: '—';
          position: absolute;
          left: -1.5rem;
          color: #9ca3af;
        }

        .project-item {
          margin-bottom: 2rem;
          padding-left: 1.5rem;
          border-left: 2px solid #f3f4f6;
        }

        .project-item h3 {
          font-size: 1.1rem;
          font-weight: 500;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .project-item .description {
          font-size: 0.95rem;
          color: #6b7280;
          line-height: 1.6;
          margin: 0;
          font-weight: 300;
        }

        .edu-item {
          margin-bottom: 1.5rem;
        }

        .edu-item h3 {
          font-size: 1.1rem;
          font-weight: 500;
          margin-bottom: 0.3rem;
          color: #1f2937;
        }

        .school {
          font-size: 0.95rem;
          color: #6b7280;
          font-weight: 300;
        }

        .skills-list {
          font-size: 1rem;
          line-height: 1.9;
          color: #4b5563;
          font-weight: 300;
        }

        @media print {
          .resume-container.minimalist {
            padding: 1.5rem;
          }
          .name {
            font-size: 2.5rem;
          }
        }
      `
    }
  ];

  try {
    for (const template of templates) {
      await db.resumeTemplate.upsert({
        where: { name: template.name },
        update: template,
        create: template,
      });
    }
    console.log("Resume templates seeded successfully");
  } catch (error) {
    console.error("Error seeding resume templates:", error);
    throw new Error("Failed to seed resume templates");
  }
}
