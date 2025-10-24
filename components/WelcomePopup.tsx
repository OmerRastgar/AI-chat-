import React from 'react';
import { XIcon } from './icons/XIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface WelcomePopupProps {
  onClose: () => void;
}

const features = [
    { 
        title: "Expert-Tuned LLM",
        description: "Fine-tuned on a corpus of over 250,000 specialized cybersecurity documents, policies, and incident reports.",
    },
    {
        title: "RAG-Powered Source Verification",
        description: "Answers are grounded in real-time data for accurate, up-to-date responses with verifiable source links.",
    },
    {
        title: "Domain-Specific Intelligence",
        description: "Architected by seasoned cybersecurity professionals to provide industry-specific insights and guidance.",
    },
    {
        title: "Comprehensive Framework Support",
        description: "In-depth knowledge covering all major standards, including NIST, ISO 27001, SOC 2, and more.",
    }
];

const WelcomePopup: React.FC<WelcomePopupProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-lg bg-light-accent dark:bg-dark-accent rounded-2xl shadow-2xl border border-light-border dark:border-dark-border transform transition-all scale-95 opacity-0 animate-scale-in">
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-light-text dark:text-dark-text">Welcome to CyberGaar</h2>
                <button onClick={onClose} className="p-1.5 rounded-full text-light-text/60 dark:text-dark-text/60 hover:bg-light-accent-hover dark:hover:bg-dark-accent-hover">
                    <XIcon className="h-5 w-5" />
                </button>
            </div>

            <p className="text-sm text-light-text/80 dark:text-dark-text/80 mb-6">
                Your AI-powered partner for navigating the complexities of cybersecurity. Here's what makes CyberGaar unique:
            </p>

            <ul className="space-y-4">
                {features.map((feature) => (
                    <li key={feature.title} className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                            <CheckCircleIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-light-text dark:text-dark-text">{feature.title}</h4>
                            <p className="text-sm text-light-text/70 dark:text-dark-text/70">{feature.description}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
        <div className="px-6 py-4 bg-light-accent-hover/50 dark:bg-dark-accent-hover/50 rounded-b-2xl">
            <button
                onClick={onClose}
                className="w-full px-4 py-2.5 font-semibold text-white bg-primary rounded-lg shadow-md hover:bg-primary-hover transition-colors"
            >
                Get Started
            </button>
        </div>
      </div>
      <style>{`
        @keyframes scale-in {
            0% { transform: scale(0.95); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
            animation: scale-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default WelcomePopup;
