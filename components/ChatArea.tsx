import React, { useRef, useEffect } from 'react';
import { Message, Standard } from '../types';
import MessageBubble from './MessageBubble';
import { SendIcon } from './icons/SendIcon';
import ThemeToggle from './ThemeToggle';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { BotIcon } from './icons/BotIcon';
import CustomScrollbar from './CustomScrollbar';
import { CHAT_PLACEHOLDER, AI_THINKING, FEEDBACK_MESSAGE, DISCLAIMER_MESSAGE, CHAT_HEADER_TITLE, EXPERT_BUTTON_TEXT } from '../constants';

interface InputFooterProps {
  standards: Standard[];
  activeStandard: Standard;
  setActiveStandard: (standard: Standard) => void;
  onSendMessage: (text: string) => void;
  isAiResponding: boolean;
}

const InputFooter: React.FC<InputFooterProps> = ({ standards, activeStandard, setActiveStandard, onSendMessage, isAiResponding }) => {
  const [inputText, setInputText] = React.useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputText]);


  const handleSend = () => {
    if (inputText.trim() === '' || isAiResponding) return;
    onSendMessage(inputText);
    setInputText('');
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  return (
    <footer className={`flex-shrink-0 w-full`}>
      <div className="max-w-4xl w-full mx-auto flex flex-col space-y-3 bg-light-accent/80 dark:bg-dark-accent/80 backdrop-blur-lg p-3 border border-light-border dark:border-dark-border rounded-xl shadow-xl">
          <div className={`overflow-hidden`}>
            <div className="flex items-center overflow-x-auto pb-2">
              <div className="flex space-x-2 px-1 pt-1">
                {standards.map((standard) => (
                  <button
                    key={standard}
                    onClick={() => setActiveStandard(standard)}
                    className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap transition-all duration-300 ${activeStandard === standard ? 'bg-primary text-white shadow' : 'bg-light-accent-hover dark:bg-dark-accent-hover hover:bg-light-border dark:hover:bg-dark-border'}`}
                  >
                    {standard}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex items-end space-x-2">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={CHAT_PLACEHOLDER}
                className="flex-1 bg-transparent resize-none focus:outline-none text-light-text dark:text-dark-text placeholder-gray-500 dark:placeholder-gray-400 max-h-40"
                rows={1}
              />
              <button 
                onClick={handleSend}
                className="w-9 h-9 flex items-center justify-center bg-primary rounded-full text-white hover:bg-primary-hover transition-colors duration-200 disabled:opacity-50 flex-shrink-0"
                aria-label="Send message"
                disabled={!inputText.trim() || isAiResponding}
              >
                {isAiResponding ? <SpinnerIcon className="h-5 w-5" /> : <SendIcon />}
              </button>
          </div>
      </div>
    </footer>
  );
}

interface ChatAreaProps {
  messages: Message[];
  activeStandard: Standard;
  setActiveStandard: (standard: Standard) => void;
  standards: Standard[];
  onSendMessage: (text: string) => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  onFeedback: (messageId: number, feedback: 'like' | 'dislike') => void;
  isAiResponding: boolean;
}

const ChatArea: React.FC<ChatAreaProps> = ({ messages, activeStandard, setActiveStandard, standards, onSendMessage, theme, setTheme, onFeedback, isAiResponding }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollableContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length > 0) {
      const timeoutId = setTimeout(() => scrollToBottom(), 100);
      return () => clearTimeout(timeoutId);
    }
  }, [messages]);

  const isInitialState = messages.length === 0 && !isAiResponding;

  return (
    <div className="flex-1 flex flex-col bg-transparent overflow-hidden">
      
      <header className={`flex-shrink-0 flex items-center justify-between p-4 border-b border-light-border/50 dark:border-dark-border/50 bg-light-accent/30 dark:bg-dark-accent/30 backdrop-blur-md h-16 z-10`}>
        <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">{activeStandard} {CHAT_HEADER_TITLE}</h2>
        <div className="flex items-center gap-2">
          <a
            href="https://cybergaar.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm font-semibold bg-primary text-white rounded-lg shadow-md hover:bg-primary-hover transition-colors"
          >
            {EXPERT_BUTTON_TEXT}
          </a>
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
      </header>

      <div className={`relative flex-1 flex flex-col min-h-0 group ${isInitialState ? 'justify-center' : ''}`}>
        <div ref={scrollableContainerRef} className={`overflow-y-auto no-scrollbar ${!isInitialState ? 'flex-1' : ''}`}>
          <div className="mx-auto w-full max-w-4xl p-2 sm:p-4">
              <div className="space-y-4 py-4">
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} onFeedback={onFeedback} />
                ))}
                {isAiResponding && (
                  <div className="flex items-end gap-3 justify-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-light-accent dark:bg-dark-accent flex items-center justify-center shadow-md border border-light-border dark:border-dark-border">
                      <BotIcon className="h-5 w-5" />
                    </div>
                    <div className="max-w-[70%] p-3 md:p-4 rounded-xl shadow-md bg-light-accent dark:bg-dark-accent rounded-bl-none border border-light-border dark:border-dark-border">
                      <div className="flex items-center space-x-2">
                          <SpinnerIcon className="w-4 h-4" />
                          <span className="text-sm italic text-light-text/80 dark:text-dark-text/80">{AI_THINKING}</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
          </div>
        </div>

        <div className="flex-shrink-0 p-4 pt-0">
          <InputFooter 
              standards={standards}
              activeStandard={activeStandard}
              setActiveStandard={setActiveStandard}
              onSendMessage={onSendMessage}
              isAiResponding={isAiResponding}
          />
          <p className="text-xs text-light-text/60 dark:text-dark-text/60 mt-2 px-2 sm:px-4 text-center">
            {FEEDBACK_MESSAGE}
          </p>
          <p className="text-xs text-light-text/60 dark:text-dark-text/60 mt-1 px-2 sm:px-4 text-center">
            {DISCLAIMER_MESSAGE}
          </p>
        </div>

        {!isInitialState && <CustomScrollbar scrollableContainerRef={scrollableContainerRef} messages={messages} />}
      </div>
    </div>
  );
};

export default ChatArea;