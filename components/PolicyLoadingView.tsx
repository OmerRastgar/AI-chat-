import React, { useState, useEffect } from 'react';
import { SpinnerIcon } from './icons/SpinnerIcon';

const loadingTexts = [
    "Building your documents...",
    "Fact-checking against industry sources...",
    "Cross-referencing compliance manuals...",
    "Drafting the final policy...",
];

const PolicyLoadingView: React.FC = () => {
    const [currentText, setCurrentText] = useState(loadingTexts[0]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentText(prevText => {
                const currentIndex = loadingTexts.indexOf(prevText);
                const nextIndex = (currentIndex + 1) % loadingTexts.length;
                return loadingTexts[nextIndex];
            });
        }, 4500); // Change text every 4.5 seconds

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center text-center p-8 min-h-[500px] w-full max-w-4xl mx-auto">
            <SpinnerIcon className="w-12 h-12 text-primary mb-6" />
            <p className="text-lg font-semibold text-light-text dark:text-dark-text animate-pulse">
                {currentText}
            </p>
        </div>
    );
};

export default PolicyLoadingView;