import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import PolicyGeneratorView from './components/PolicyGeneratorView';
import WelcomePopup from './components/WelcomePopup';
import { Message, Standard, Tab } from './types';
import { STANDARDS } from './constants';
import { MenuIcon } from './components/icons/MenuIcon';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';

const API_KEY = process.env.API_KEY;

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('Chat');
  const [activeStandard, setActiveStandard] = useState<Standard>('NIST');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);

  useEffect(() => {
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
      setIsSidebarOpen(false);
    }
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);
  
  const handleSetStandard = (standard: Standard) => {
    setActiveStandard(standard);
    setMessages([]);
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

    if (!ai) {
      const errorResponse: Message = {
          id: Date.now() + 1,
          text: "The AI service is not configured correctly. Please check the API key.",
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorResponse]);
      setIsAiResponding(false);
      return;
    }

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
  
  if (!API_KEY) {
    return (
      <div className="flex items-center justify-center h-screen bg-dark-bg text-dark-text font-sans">
        <div className="text-center p-8 bg-dark-accent rounded-lg shadow-xl border border-dark-border">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Configuration Error</h1>
          <p>The Google Gemini API key is missing.</p>
          <p className="mt-2 text-sm text-slate-400">Please create a <code className="bg-slate-700 px-1 py-0.5 rounded">.env</code> file and add your API key.</p>
          <p className="mt-1 text-xs text-slate-500">Example: <code className="bg-slate-700 px-1 py-0.5 rounded">API_KEY=your_api_key_here</code></p>
        </div>
      </div>
    );
  }

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
