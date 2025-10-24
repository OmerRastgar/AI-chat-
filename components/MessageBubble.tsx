import React from 'react';
import { Message } from '../types';
import { BotIcon } from './icons/BotIcon';
import { UserIcon } from './icons/UserIcon';
import { ThumbsUpIcon } from './icons/ThumbsUpIcon';
import { ThumbsDownIcon } from './icons/ThumbsDownIcon';
import MarkdownRenderer from './MarkdownRenderer';

interface MessageBubbleProps {
  message: Message;
  onFeedback: (messageId: number, feedback: 'like' | 'dislike') => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onFeedback }) => {
  const isUser = message.sender === 'user';
  
  const handleFeedbackClick = (feedback: 'like' | 'dislike') => {
    onFeedback(message.id, feedback);
  };

  return (
    <div 
        className={`flex items-end gap-3 group ${isUser ? 'justify-end' : 'justify-start'}`}
        data-sender={message.sender}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-light-accent dark:bg-dark-accent flex items-center justify-center shadow-md border border-light-border dark:border-dark-border">
          <BotIcon className="h-5 w-5" />
        </div>
      )}
      <div className={`max-w-[70%] p-3 md:p-4 rounded-xl shadow-md ${
          isUser 
          ? 'bg-primary text-white rounded-br-none' 
          : 'bg-light-accent dark:bg-dark-accent rounded-bl-none border border-light-border dark:border-dark-border'
        }`}>
        {isUser ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
        ) : (
          <MarkdownRenderer content={message.text} />
        )}
        
        {message.references && (
            <div className="mt-3 pt-3 border-t border-black/10 dark:border-white/10">
                <h4 className="text-xs font-semibold mb-1 opacity-80">References:</h4>
                <ul className="list-disc list-inside space-y-1">
                    {message.references.map((ref, index) => (
                        <li key={index} className="text-xs">
                            <a href={ref.link} className="opacity-90 hover:opacity-100 underline" target="_blank" rel="noopener noreferrer">
                                {ref.title}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        )}
        
        <div className={`flex items-end mt-2 ${isUser ? 'justify-end' : 'justify-between'}`}>
            <div className={`text-xs ${isUser ? 'text-blue-100/80' : 'text-light-text/60 dark:text-dark-text/60'}`}>
                {message.timestamp}
            </div>
            {!isUser && (
              <div className="flex items-center gap-1.5 ml-4">
                  <button onClick={() => handleFeedbackClick('like')} className={`p-1.5 rounded-full transition-colors ${message.feedback === 'like' ? 'text-primary bg-primary/10' : 'text-light-text/60 dark:text-dark-text/60 hover:text-primary hover:bg-light-accent-hover dark:hover:bg-dark-accent-hover'}`}>
                    <ThumbsUpIcon className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleFeedbackClick('dislike')} className={`p-1.5 rounded-full transition-colors ${message.feedback === 'dislike' ? 'text-red-500 bg-red-500/10' : 'text-light-text/60 dark:text-dark-text/60 hover:text-red-500 hover:bg-light-accent-hover dark:hover:bg-dark-accent-hover'}`}>
                    <ThumbsDownIcon className="h-4 w-4" />
                  </button>
              </div>
            )}
        </div>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-light-accent dark:bg-dark-accent flex items-center justify-center shadow-md border border-light-border dark:border-dark-border">
          <UserIcon className="h-5 w-5" />
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
