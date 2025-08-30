import React from 'react';

const TemplatePreview = ({ template }) => {
  if (!template || !template.htmlContent) {
    return (
      <div className="w-full h-full bg-gray-100 border border-gray-200 rounded flex items-center justify-center">
        <span className="text-gray-500 text-sm">No preview available</span>
      </div>
    );
  }

  // Sample data for preview
  const sampleData = {
    name: "John Doe",
    jobTitle: "Software Engineer",
    email: "john.doe@email.com",
    phone: "(555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/johndoe",
    website: "johndoe.dev",
    summary: "Experienced software engineer with 5+ years developing scalable web applications using modern technologies.",
    skills: "JavaScript, React, Node.js, Python, SQL, AWS",
    experience: [
      {
        title: "Senior Software Engineer",
        company: "Tech Corp",
        startDate: "2022",
        endDate: "Present",
        description: "Led development of microservices architecture\nMentored junior developers\nImproved system performance by 40%" // Changed to description for consistency
      },
      {
        title: "Software Engineer",
        company: "StartupXYZ",
        startDate: "2020",
        endDate: "2022",
        description: "Built responsive web applications\nCollaborated with cross-functional teams" // Changed to description for consistency
      }
    ],
    education: [
      {
        degree: "B.S. Computer Science",
        school: "University of California",
        year: "2020"
      }
    ],
    projects: [
      {
        name: "E-commerce Platform",
        description: "Full-stack web application with payment integration"
      },
      {
        name: "Mobile App",
        description: "React Native app with 10k+ downloads"
      }
    ],
    skillsList: [
      { name: "JavaScript", level: 90 },
      { name: "React", level: 85 },
      { name: "Node.js", level: 80 },
      { name: "Python", level: 75 }
    ]
  };

  // NEW: Refactored interpolation function for TemplatePreview
  const renderTemplate = (htmlContent, data) => {
    let rendered = htmlContent;

    // Replace simple placeholders
    Object.keys(data).forEach(key => {
      if (typeof data[key] === 'string') {
        rendered = rendered.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), data[key]);
      }
    });

    // Handle array sections
    rendered = rendered.replace(/\{\{#each experience\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, content) => {
        return data.experience.map(item => {
            let itemHtml = content;
            itemHtml = itemHtml.replace(/\{\{title\}\}/g, item.title || '');
            itemHtml = itemHtml.replace(/\{\{company\}\}/g, item.company || '');
            itemHtml = itemHtml.replace(/\{\{startDate\}\}/g, item.startDate || '');
            itemHtml = itemHtml.replace(/\{\{endDate\}\}/g, item.endDate || '');
            // Handle responsibilities array within experience
            const responsibilitiesHtml = (item.description || '').split('\n').map(desc => `<li>${desc.trim()}</li>`).join('');
            itemHtml = itemHtml.replace(/\{\{#each responsibilities\}\}([\s\S]*?)\{\{\/each\}\}/g, responsibilitiesHtml);
            return itemHtml;
        }).join('');
    });

    rendered = rendered.replace(/\{\{#each education\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, content) => {
        return data.education.map(item => {
            let itemHtml = content;
            itemHtml = itemHtml.replace(/\{\{degree\}\}/g, item.degree || '');
            itemHtml = itemHtml.replace(/\{\{school\}\}/g, item.school || '');
            itemHtml = itemHtml.replace(/\{\{year\}\}/g, item.year || '');
            return itemHtml;
        }).join('');
    });

    rendered = rendered.replace(/\{\{#each projects\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, content) => {
        return data.projects.map(item => {
            let itemHtml = content;
            itemHtml = itemHtml.replace(/\{\{name\}\}/g, item.name || '');
            itemHtml = itemHtml.replace(/\{\{description\}\}/g, item.description || '');
            return itemHtml;
        }).join('');
    });

    rendered = rendered.replace(/\{\{#each skillsList\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, content) => {
      return data.skillsList.map(item => {
        let itemHtml = content;
        itemHtml = itemHtml.replace(/\{\{name\}\}/g, item.name || '');
        itemHtml = itemHtml.replace(/\{\{level\}\}/g, item.level || '');
        itemHtml = itemHtml.replace(/\{\{this\}\}/g, item.name || '');
        return itemHtml;
      }).join('');
    });

    return rendered;
  };

  const renderedHtml = renderTemplate(template.htmlContent, sampleData);

  return (
    <div className="w-full h-full border border-gray-200 rounded overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: template.cssStyles }} />
      <div
        className="w-full h-full overflow-auto"
        style={{
          transform: 'scale(0.4)',
          transformOrigin: 'top left',
          width: '250%',
          height: '250%'
        }}
        dangerouslySetInnerHTML={{ __html: renderedHtml }}
      />
    </div>
  );
};

export default TemplatePreview;