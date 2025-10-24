import React, { useState } from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import { CopyIcon } from './icons/CopyIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';

interface PolicyResultViewProps {
  policyText: string;
  onBack: () => void;
  onDownload: () => void;
}

const PolicyResultView: React.FC<PolicyResultViewProps> = ({ policyText, onBack, onDownload }) => {
  const [copySuccess, setCopySuccess] = useState('');

  const handleCopy = () => {
    navigator.clipboard.writeText(policyText).then(() => {
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-light-accent-hover dark:hover:bg-dark-accent-hover transition-colors">
          <ChevronLeftIcon className="w-5 h-5" />
          <span>Generate New Policy</span>
        </button>
        <div className="flex items-center gap-2">
            <button onClick={handleCopy} className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-md hover:bg-light-accent-hover dark:hover:bg-dark-accent-hover transition-colors">
                <CopyIcon className="w-4 h-4" />
                <span>{copySuccess || 'Copy'}</span>
            </button>
            <button onClick={onDownload} className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-md hover:bg-light-accent-hover dark:hover:bg-dark-accent-hover transition-colors">
                <DownloadIcon className="w-4 h-4" />
                <span>Download as .doc</span>
            </button>
        </div>
      </div>

      <div className="prose prose-sm dark:prose-invert max-w-none p-6 bg-light-accent/50 dark:bg-dark-accent/50 border border-light-border dark:border-dark-border rounded-xl">
          <MarkdownRenderer content={policyText} />
      </div>
    </div>
  );
};

export default PolicyResultView;