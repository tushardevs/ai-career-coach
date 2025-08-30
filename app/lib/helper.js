// Helper function to convert entries to markdown
export function entriesToMarkdown(entries, type) {
  if (!entries || !Array.isArray(entries) || entries.length === 0) {
    return "";
  }

  const validEntries = entries.filter(entry => entry && typeof entry === 'object');
  if (validEntries.length === 0) return "";

  return (
    `## ${type}\n\n` +
    validEntries
      .map((entry) => {
        // Handle different field name variations
        const title = entry.title || entry.name || entry.degree || 'Untitled';
        const organization = entry.organization || entry.company || entry.school || entry.institution || 'Organization';
        const startDate = entry.startDate || entry.from || '';
        const endDate = entry.current ? 'Present' : (entry.endDate || entry.to || entry.year || '');
        const description = entry.description || entry.responsibilities || entry.summary || '';

        // Format date range
        let dateRange = '';
        if (startDate || endDate) {
          if (startDate && endDate) {
            dateRange = `${startDate} - ${endDate}`;
          } else if (startDate) {
            dateRange = startDate;
          } else if (endDate) {
            dateRange = endDate;
          }
        }

        // Format the entry
        let entryText = `### ${title}`;
        if (organization && organization !== 'Organization') {
          entryText += ` @ ${organization}`;
        }

        if (dateRange) {
          entryText += `\n*${dateRange}*`;
        }

        if (description) {
          // Handle multiline descriptions and convert to proper markdown
          const formattedDescription = description
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(line => line.startsWith('•') || line.startsWith('-') ? line : `• ${line}`)
            .join('\n');

          entryText += `\n\n${formattedDescription}`;
        }

        return entryText;
      })
      .join("\n\n")
  );
}
