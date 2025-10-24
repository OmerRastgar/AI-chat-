import React from 'react';

const applyInlineFormatting = (text: string): React.ReactNode => {
    // Split by bold and italic markers, keeping the delimiters
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return (
        <>
            {parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={i}>{part.slice(2, -2)}</strong>;
                }
                if (part.startsWith('*') && part.endsWith('*')) {
                    return <em key={i}>{part.slice(1, -1)}</em>;
                }
                return part;
            })}
        </>
    );
};

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Normalize line endings and split by double newlines for paragraphs
  const blocks = content.replace(/\r\n/g, '\n').split('\n\n');

  const renderBlock = (block: string, index: number) => {
    const lines = block.split('\n');

    // Check for headings (from most specific to least to avoid incorrect matching)
    if (block.startsWith('#### ')) {
        return <h4 key={index} className="text-base font-semibold mt-3 mb-1">{applyInlineFormatting(block.substring(5))}</h4>;
    }
    if (block.startsWith('### ')) {
        return <h3 key={index} className="text-lg font-semibold mt-4 mb-2">{applyInlineFormatting(block.substring(4))}</h3>;
    }
    if (block.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-bold mt-6 mb-3 border-b border-light-border dark:border-dark-border pb-2">{applyInlineFormatting(block.substring(3))}</h2>;
    }
    if (block.startsWith('# ')) {
        return <h1 key={index} className="text-2xl font-bold mt-8 mb-4 border-b-2 border-light-border dark:border-dark-border pb-2">{applyInlineFormatting(block.substring(2))}</h1>;
    }
    
    // Check for table
    const trimmedLines = block.trim().split('\n');
    const isTable =
      trimmedLines.length >= 2 &&
      trimmedLines[0].includes('|') &&
      trimmedLines[1].includes('|') &&
      /^[|:-\s]+$/.test(trimmedLines[1]);

    if (isTable) {
      const headers = trimmedLines[0].replace(/^\||\|$/g, '').split('|').map(h => h.trim());
      const rows = trimmedLines.slice(2).map(line => line.replace(/^\||\|$/g, '').split('|').map(cell => cell.trim()));

      return (
        <div key={index} className="overflow-x-auto my-4 rounded-lg border border-light-border dark:border-dark-border">
          <table className="min-w-full divide-y divide-light-border dark:divide-dark-border">
            <thead className="bg-light-accent/50 dark:bg-dark-accent/50">
              <tr>
                {headers.map((header, i) => (
                  <th key={i} scope="col" className="px-4 py-2 text-left text-sm font-semibold text-light-text dark:text-dark-text">
                    {applyInlineFormatting(header)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-light-border dark:divide-dark-border bg-light-accent dark:bg-dark-accent">
              {rows.map((row, i) => (
                <tr key={i} className="hover:bg-light-accent-hover dark:hover:bg-dark-accent-hover">
                  {row.map((cell, j) => (
                    <td key={j} className="px-4 py-2 text-sm text-light-text/90 dark:text-dark-text/90">
                      {applyInlineFormatting(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    
    // Check for unordered list
    const isList = lines.length > 0 && lines.every(line => line.trim().startsWith('- ') || line.trim().startsWith('* '));
    if (isList) {
        return (
            <ul key={index} className="list-disc list-outside pl-5 space-y-1 my-2">
                {lines.map((item, itemIndex) => (
                    <li key={itemIndex}>{applyInlineFormatting(item.trim().substring(2))}</li>
                ))}
            </ul>
        );
    }

    // Default to paragraph, joining lines with spaces.
    return (
      <p key={index} className="my-1">
        {applyInlineFormatting(lines.join(' '))}
      </p>
    );
  };

  return <div className="text-sm leading-relaxed space-y-2 break-words">{blocks.filter(b => b.trim()).map(renderBlock)}</div>;
};

export default MarkdownRenderer;