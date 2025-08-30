
"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getResumeTemplates() {
  try {
    const templates = await db.resumeTemplate.findMany({
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    });
    return templates;
  } catch (error) {
    console.error("Error fetching templates:", error);
    // Return empty array if database is not available
    return [];
  }
}

export async function getTemplateById(id) {
  try {
    const template = await db.resumeTemplate.findUnique({
      where: { id }
    });
    return template;
  } catch (error) {
    console.error("Error fetching template:", error);
    throw new Error("Failed to fetch template");
  }
}

export async function createResumeTemplate(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const template = await db.resumeTemplate.create({
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        htmlContent: data.htmlContent,
        cssStyles: data.cssStyles,
        preview: data.preview,
        isPremium: data.isPremium || false,
      }
    });
    return template;
  } catch (error) {
    console.error("Error creating template:", error);
    throw new Error("Failed to create template");
  }
}

export async function seedDefaultTemplates() {
  try {
    const existingTemplates = await db.resumeTemplate.count();
    if (existingTemplates > 0) return;

    const defaultTemplates = [
      {
        name: "Classic ATS-Friendly",
        description: "Simple, clean template optimized for Applicant Tracking Systems with traditional layout",
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
                <h3>{{title}} - {{company}}</h3>
                <p class="dates">{{startDate}} - {{endDate}}</p>
                <ul>
                  {{#each responsibilities}}
                  <li>{{this}}</li>
                  {{/each}}
                </ul>
              </div>
              {{/each}}
            </section>

            <section class="education">
              <h2>Education</h2>
              {{#each education}}
              <div class="edu-item">
                <h3>{{degree}} - {{school}}</h3>
                <p class="dates">{{year}}</p>
              </div>
              {{/each}}
            </section>

            <section class="skills">
              <h2>Skills</h2>
              <p>{{skills}}</p>
            </section>
          </div>
        `,
        cssStyles: `
          .resume-container.ats-friendly {
            font-family: Arial, sans-serif;
            max-width: 8.5in;
            margin: 0 auto;
            padding: 1in 0.75in;
            background: white;
            color: #000;
            line-height: 1.4;
          }

          .header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }

          .name {
            font-size: 24px;
            font-weight: bold;
            margin: 0 0 10px 0;
          }

          .contact-info p {
            margin: 5px 0;
            font-size: 11px;
          }

          section {
            margin-bottom: 20px;
          }

          h2 {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 10px;
            text-transform: uppercase;
          }

          .job, .edu-item {
            margin-bottom: 15px;
          }

          h3 {
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 5px;
          }

          .dates {
            font-style: italic;
            font-size: 11px;
            margin-bottom: 5px;
          }

          ul {
            margin: 5px 0 0 20px;
            padding: 0;
          }

          li {
            font-size: 11px;
            margin-bottom: 3px;
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
                  <h3>{{title}}</h3>
                  <span class="company">{{company}}</span>
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
              <section class="skills">
                <h2>Core Skills</h2>
                <div class="skills-grid">
                  {{#each skillsList}}
                  <div class="skill-item">{{this}}</div>
                  {{/each}}
                </div>
              </section>

              <section class="education">
                <h2>Education</h2>
                {{#each education}}
                <div class="edu-item">
                  <h3>{{degree}}</h3>
                  <p>{{school}}, {{year}}</p>
                </div>
                {{/each}}
              </section>
            </div>
          </div>
        `,
        cssStyles: `
          .resume-container.professional-blue {
            font-family: 'Calibri', sans-serif;
            max-width: 8.5in;
            margin: 0 auto;
            background: white;
            color: #1f2937;
          }

          .header-blue {
            background: linear-gradient(135deg, #1e40af, #3b82f6);
            color: white;
            padding: 2rem;
            text-align: center;
          }

          .name {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 1rem;
          }

          .contact-info {
            display: flex;
            justify-content: center;
            gap: 2rem;
            font-size: 14px;
          }

          section {
            padding: 1.5rem 2rem;
          }

          h2 {
            color: #1e40af;
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 1rem;
            border-bottom: 2px solid #3b82f6;
            padding-bottom: 0.5rem;
          }

          .job-item {
            margin-bottom: 1.5rem;
          }

          .job-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
          }

          h3 {
            font-size: 14px;
            font-weight: bold;
            color: #1e40af;
          }

          .company {
            font-weight: 600;
            color: #374151;
          }

          .dates {
            font-style: italic;
            color: #6b7280;
          }

          .achievements {
            margin-left: 1rem;
          }

          .achievements li {
            margin-bottom: 0.3rem;
            font-size: 11px;
          }

          .two-column {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }

          .skills-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
          }

          .skill-item {
            background: #3b82f6;
            color: white;
            padding: 0.3rem 0.8rem;
            border-radius: 20px;
            font-size: 10px;
            font-weight: 500;
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
                <h2>Skills</h2>
                {{#each skillsList}}
                <div class="skill-bar">
                  <span class="skill-name">{{name}}</span>
                  <div class="bar">
                    <div class="fill" style="width: {{level}}%"></div>
                  </div>
                </div>
                {{/each}}
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
                    <ul>
                      {{#each responsibilities}}
                      <li>{{this}}</li>
                      {{/each}}
                    </ul>
                  </div>
                </div>
                {{/each}}
              </section>

              <section class="projects">
                <h2>Projects</h2>
                <div class="projects-grid">
                  {{#each projects}}
                  <div class="project-card">
                    <h3>{{name}}</h3>
                    <p>{{description}}</p>
                  </div>
                  {{/each}}
                </div>
              </section>
            </div>
          </div>
        `,
        cssStyles: `
          .resume-container.creative-green {
            font-family: 'Inter', sans-serif;
            display: flex;
            max-width: 8.5in;
            margin: 0 auto;
            background: white;
            min-height: 11in;
          }

          .sidebar {
            background: linear-gradient(180deg, #059669, #10b981);
            color: white;
            width: 35%;
            padding: 2rem 1.5rem;
          }

          .profile-section {
            text-align: center;
            margin-bottom: 2rem;
          }

          .name {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 0.5rem;
          }

          .title {
            font-size: 16px;
            opacity: 0.9;
          }

          .sidebar h2 {
            font-size: 18px;
            margin-bottom: 1rem;
            color: white;
            border-bottom: 2px solid rgba(255,255,255,0.3);
            padding-bottom: 0.5rem;
          }

          .contact-item {
            display: flex;
            align-items: center;
            margin-bottom: 0.8rem;
            font-size: 12px;
          }

          .icon {
            margin-right: 0.5rem;
          }

          .skill-bar {
            margin-bottom: 1rem;
          }

          .skill-name {
            display: block;
            font-size: 12px;
            margin-bottom: 0.3rem;
          }

          .bar {
            background: rgba(255,255,255,0.2);
            height: 8px;
            border-radius: 4px;
            overflow: hidden;
          }

          .fill {
            background: white;
            height: 100%;
            border-radius: 4px;
          }

          .main-content {
            flex: 1;
            padding: 2rem;
          }

          .main-content h2 {
            color: #059669;
            font-size: 20px;
            margin-bottom: 1rem;
            position: relative;
          }

          .main-content h2:after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 0;
            width: 50px;
            height: 3px;
            background: #10b981;
          }

          .experience-item {
            display: flex;
            margin-bottom: 1.5rem;
            position: relative;
          }

          .timeline-dot {
            width: 12px;
            height: 12px;
            background: #10b981;
            border-radius: 50%;
            margin-right: 1rem;
            margin-top: 0.3rem;
            flex-shrink: 0;
          }

          .content h3 {
            font-size: 16px;
            font-weight: bold;
            color: #059669;
            margin-bottom: 0.2rem;
          }

          .content h4 {
            font-size: 14px;
            color: #374151;
            margin-bottom: 0.2rem;
          }

          .period {
            font-size: 12px;
            color: #6b7280;
            font-style: italic;
          }

          .content ul {
            margin-top: 0.5rem;
            margin-left: 1rem;
          }

          .content li {
            font-size: 11px;
            margin-bottom: 0.3rem;
          }

          .projects-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
          }

          .project-card {
            border: 2px solid #10b981;
            border-radius: 8px;
            padding: 1rem;
          }

          .project-card h3 {
            color: #059669;
            font-size: 14px;
            margin-bottom: 0.5rem;
          }

          .project-card p {
            font-size: 11px;
            color: #6b7280;
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
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            max-width: 8.5in;
            margin: 0 auto;
            padding: 3rem 2rem;
            background: white;
            color: #1f2937;
            line-height: 1.6;
          }

          .header {
            text-align: center;
            margin-bottom: 3rem;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 2rem;
          }

          .name {
            font-size: 36px;
            font-weight: 300;
            letter-spacing: 2px;
            margin-bottom: 0.5rem;
          }

          .tagline {
            font-size: 16px;
            color: #6b7280;
            margin-bottom: 1rem;
          }

          .contact {
            font-size: 14px;
            color: #9ca3af;
          }

          section {
            margin-bottom: 3rem;
          }

          h2 {
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #374151;
            margin-bottom: 1.5rem;
            position: relative;
          }

          h2:after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 0;
            width: 30px;
            height: 1px;
            background: #374151;
          }

          .summary-text {
            font-size: 16px;
            line-height: 1.8;
            color: #4b5563;
            text-align: justify;
          }

          .job {
            margin-bottom: 2rem;
          }

          .job-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 0.3rem;
          }

          .job h3 {
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
          }

          .dates {
            font-size: 12px;
            color: #9ca3af;
            font-weight: 300;
          }

          .company {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 0.8rem;
          }

          .responsibilities {
            margin-left: 0;
            padding-left: 1.5rem;
          }

          .responsibilities li {
            font-size: 12px;
            margin-bottom: 0.4rem;
            color: #4b5563;
          }

          .edu-item {
            margin-bottom: 1rem;
          }

          .edu-item h3 {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 0.2rem;
          }

          .school {
            font-size: 12px;
            color: #6b7280;
          }

          .skills-list {
            font-size: 12px;
            line-height: 1.8;
            color: #4b5563;
          }
        `
      }
    ];

    await db.resumeTemplate.createMany({
      data: defaultTemplates
    });

    console.log("Default HTML templates seeded successfully");
  } catch (error) {
    console.error("Error seeding templates:", error);
    // Don't throw error to prevent page crashes
    return;
  }
}
