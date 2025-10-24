import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import PolicyGeneratorView from './components/PolicyGeneratorView';
import WelcomePopup from './components/WelcomePopup'; // Import the new component
import { Message, Standard, Tab } from './types';
import { STANDARDS } from './constants';
import { MenuIcon } from './components/icons/MenuIcon';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('Chat');
  const [activeStandard, setActiveStandard] = useState<Standard>('NIST');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [showWelcomePopup, setShowWelcomePopup] = useState(false); // State for the popup

  useEffect(() => {
    // Check local storage to see if the user has visited before
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcomePopup');
    if (!hasSeenWelcome) {
      setShowWelcomePopup(true);
    }

    const root = window.document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
  }, [theme]);

  const handleResize = useCallback(() => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    if (mobile) {
      setIsSidebarOpen(false); // Close sidebar on switch to mobile
    }
  }, []);

  useEffect(() => {
    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);
  
  const handleSetStandard = (standard: Standard) => {
    setActiveStandard(standard);
    setMessages([]); // Clear messages when standard changes
  };

  const handleSendMessage = useCallback(async (text: string) => {
    if (text.trim() === '' || isAiResponding) return;

    const newMessage: Message = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, newMessage]);
    setIsAiResponding(true);

    try {
      const prompt = `
        As a cybersecurity expert specializing in the ${activeStandard} framework, answer the following user query:
        "${text}"
        Provide a clear, concise, and accurate answer based on ${activeStandard} guidelines. Use the provided search tool to find relevant, up-to-date information and official documentation.
        Do NOT list your sources or references in your response text. The source links will be displayed separately in the user interface.
        If applicable, you can refer to specific controls or sections from the ${activeStandard} framework within your answer.
        If the query is outside the scope of ${activeStandard}, clarify that and offer a response based on general cybersecurity best practices.
      `;
      
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          tools: [{googleSearch: {}}],
        },
      });
      
      const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
      const references = groundingMetadata?.groundingChunks
        ?.map((chunk: any) => ({
          title: chunk.web?.title || 'Source',
          link: chunk.web?.uri || '#',
        }))
        .filter((ref: {link: string}) => ref.link !== '#');

      const aiResponse: Message = {
          id: Date.now() + 1,
          text: response.text,
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          references: (references && references.length > 0) ? references : undefined,
      };
      
      setMessages(prev => [...prev, aiResponse]);

    } catch (error) {
        console.error("Error fetching AI response:", error);
        const errorResponse: Message = {
            id: Date.now() + 1,
            text: "I'm sorry, but I encountered an issue while trying to generate a response. Please check your connection and API key, then try again.",
            sender: 'ai',
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, errorResponse]);
    } finally {
        setIsAiResponding(false);
    }

  }, [activeStandard, isAiResponding]);

  const handleFeedback = (messageId: number, feedback: 'like' | 'dislike') => {
    setMessages(prevMessages =>
      prevMessages.map(msg =>
        msg.id === messageId
          ? { ...msg, feedback: msg.feedback === feedback ? null : feedback }
          : msg
      )
    );
  };

  const handleCloseWelcomePopup = () => {
    setShowWelcomePopup(false);
    localStorage.setItem('hasSeenWelcomePopup', 'true');
  };
  
  return (
    <div className="relative h-screen w-full font-sans text-light-text dark:text-dark-text overflow-hidden bg-gradient-to-br from-light-bg via-slate-200 to-light-bg dark:from-dark-bg dark:via-slate-950 dark:to-dark-bg animate-subtle-gradient bg-[length:200%_200%]">
      {showWelcomePopup && <WelcomePopup onClose={handleCloseWelcomePopup} />}
      <Sidebar 
        isMobile={isMobile}
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
      />
      <div 
        className={`absolute inset-0 transition-transform duration-300 ease-in-out md:left-auto ${isMobile ? (isSidebarOpen ? 'translate-x-[80%]' : 'translate-x-0') : (isSidebarCollapsed ? 'md:w-[calc(100%-5rem)]' : 'md:w-[calc(100%-14rem)]')}`}
      >
        <main className={`h-full w-full flex flex-col`}>
            <header className="md:hidden flex items-center justify-between p-4 bg-light-accent/80 dark:bg-dark-accent/80 backdrop-blur-md shadow-md z-20 h-16 flex-shrink-0 border-b border-light-border dark:border-dark-border">
              <button onClick={() => setIsSidebarOpen(true)} className="mr-4">
                <MenuIcon />
              </button>
              <h1 className="text-xl font-bold">CyberGaar</h1>
               <div className="w-8 h-8"/>
            </header>
            {activeTab === 'Chat' ? (
              <ChatArea 
                  messages={messages} 
                  activeStandard={activeStandard} 
                  setActiveStandard={handleSetStandard}
                  standards={STANDARDS}
                  onSendMessage={handleSendMessage}
                  theme={theme}
                  setTheme={setTheme}
                  onFeedback={handleFeedback}
                  isAiResponding={isAiResponding}
              />
            ) : (
              <PolicyGeneratorView theme={theme} setTheme={setTheme} />
            )}
        </main>
      </div>
    </div>
  );
};

export default App;