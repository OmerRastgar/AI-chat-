import React from 'react';
import { Tab } from '../types';
import { ChatIcon } from './icons/ChatIcon';
import { PolicyIcon } from './icons/PolicyIcon';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
// TypeScript may sometimes fail to resolve image modules during type-checking in this setup.
// Use @ts-ignore on these imports so webpack's asset/resource handles bundling at build time.
// The declarations in `src/types/images.d.ts` should cover these, but ts-loader can be picky.
// @ts-ignore
import darkCollapsed from '../src/assets/images/dark-background-collapsed.svg';
// @ts-ignore
import darkCollapsedThin from '../src/assets/images/dark-background-collapsed-to-thin.svg';
// @ts-ignore
import lightCollapsed from '../src/assets/images/light-background-collapsed.svg';
// @ts-ignore
import lightCollapsedThin from '../src/assets/images/light-background-collapsed-to-thin.svg';


interface SidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  isMobile: boolean;
  theme: 'dark' | 'light';
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, isCollapsed, setIsCollapsed, activeTab, setActiveTab, isMobile, theme }) => {

  const NavButton: React.FC<{ tabName: Tab; children: React.ReactNode; icon: React.ReactNode }> = ({ tabName, children, icon }) => (
    <button 
      onClick={() => {
        setActiveTab(tabName);
        if(isMobile) setIsOpen(false);
      }}
      className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 text-sm font-semibold space-x-3 ${
        activeTab === tabName 
        ? 'bg-primary text-white shadow-md' 
        : 'text-light-text/80 dark:text-dark-text/80 hover:bg-light-accent-hover dark:hover:bg-dark-accent-hover'
      } ${isCollapsed && !isMobile ? 'justify-center' : ''}`}
    >
      {icon}
      <span className={`${isCollapsed && !isMobile ? 'hidden' : 'inline'}`}>{children}</span>
    </button>
  );

  const sidebarContent = (
    <div className="flex flex-col h-full bg-light-accent/80 dark:bg-dark-accent/80 backdrop-blur-lg border-r border-light-border dark:border-dark-border">
      <div className="relative flex items-center p-4 border-b border-light-border dark:border-dark-border h-16 flex-shrink-0">
        
        {/* LOGO AREA */}
        <div className={`flex items-center transition-all duration-300 w-full ${isCollapsed && !isMobile ? 'justify-center' : 'justify-start'}`}>
          {isCollapsed && !isMobile ? (
                <img 
                  src={theme === 'dark' ? darkCollapsedThin : lightCollapsedThin} 
                  alt="CyberGaar Icon"
                  className={`h-10 w-10 object-contain ${isMobile ? '' : ''}`}
                  style={isMobile ? { transform: 'scale(2, 2)', transformOrigin: 'center', display: 'block', margin: '0 auto' } : { transform: 'scale(2, 2)', transformOrigin: 'center', display: 'block', margin: '0 auto' }}

                />
          ) : (
             <img 
              src={theme === 'dark' ? darkCollapsed : lightCollapsed} 
              alt="CyberGaar Logo"
              className="h-10 w-auto object-contain"
              style={isMobile ? { transform: 'scale(4, 3)', transformOrigin: 'center', display: 'block', margin: '0 auto' } : { transform: 'scale(4, 3)', transformOrigin: 'center', display: 'block', margin: '0 auto' }}
            />
          )}
        </div>
        
        {/* BUTTON AREA */}
        {!isMobile && (
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-colors duration-200 text-light-text/80 dark:text-dark-text/80 hover:bg-light-accent-hover dark:hover:bg-dark-accent-hover"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeftIcon className={`h-5 w-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      <nav className="flex-1 flex flex-col p-4 space-y-2">
          <NavButton tabName="Chat" icon={<ChatIcon className="h-5 w-5 flex-shrink-0" />}>Chat</NavButton>
          <NavButton tabName="Policy Generation" icon={<PolicyIcon className="h-5 w-5 flex-shrink-0" />}>Policy Generation</NavButton>
      </nav>
    </div>
  );

  return (
    <aside className={`fixed top-0 left-0 h-full z-30 transition-all duration-300 ease-in-out
      ${isMobile ? `w-4/5 max-w-xs transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}` : (isCollapsed ? 'w-20' : 'w-56')}
    `}>
      {sidebarContent}
    </aside>
  );
};

export default Sidebar;