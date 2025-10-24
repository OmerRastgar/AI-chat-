import React from 'react';
import PolicyGenerator from './PolicyGenerator';
import ThemeToggle from './ThemeToggle';

interface PolicyGeneratorViewProps {
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
}

const PolicyGeneratorView: React.FC<PolicyGeneratorViewProps> = ({ theme, setTheme }) => {
  return (
    <div className="relative flex-1 flex flex-col bg-transparent overflow-hidden">
      <header className={`flex-shrink-0 flex items-center justify-between p-4 border-b border-light-border/50 dark:border-dark-border/50 bg-light-accent/30 dark:bg-dark-accent/30 backdrop-blur-md h-16 z-10`}>
        <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">Policy Generator</h2>
        <div className="flex items-center gap-2">
          <a
            href="https://cybergaar.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm font-semibold bg-primary text-white rounded-lg shadow-md hover:bg-primary-hover transition-colors"
          >
            Talk to an Expert
          </a>
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <PolicyGenerator />
        </div>
      </div>
    </div>
  );
};

export default PolicyGeneratorView;
