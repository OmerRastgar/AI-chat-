import React, { useState, useRef, useEffect } from 'react';
import { XIcon } from './icons/XIcon';

interface ChipInputProps {
  id: string;
  label: React.ReactNode;
  chips: string[];
  setChips: (chips: string[]) => void;
  suggestions: string[];
  placeholder?: string;
}

const ChipInput: React.FC<ChipInputProps> = ({ id, label, chips, setChips, suggestions, placeholder }) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (e.target.value) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const addChip = (chip: string) => {
    if (chip && !chips.includes(chip)) {
      setChips([...chips, chip]);
    }
    setInputValue('');
    setShowSuggestions(false);
    wrapperRef.current?.querySelector('input')?.focus();
  };

  const removeChip = (chipToRemove: string) => {
    setChips(chips.filter(chip => chip !== chipToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && inputValue.trim()) {
      e.preventDefault();
      addChip(inputValue.trim());
    } else if (e.key === 'Backspace' && !inputValue && chips.length > 0) {
      removeChip(chips[chips.length - 1]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredSuggestions = suggestions.filter(
    suggestion =>
      suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
      !chips.includes(suggestion)
  );

  return (
    <div ref={wrapperRef}>
      <label htmlFor={id} className="block text-sm font-medium text-light-text dark:text-dark-text mb-1">
        {label}
      </label>
      <div className="relative flex flex-wrap items-center gap-2 p-2 border border-light-border dark:border-dark-border bg-light-accent/50 dark:bg-dark-accent/50 rounded-lg">
        {chips.map(chip => (
          <div key={chip} className="flex items-center gap-1.5 bg-primary/20 text-primary dark:bg-primary/30 dark:text-blue-300 px-2 py-1 rounded-md text-sm">
            <span>{chip}</span>
            <button onClick={() => removeChip(chip)} className="text-primary dark:text-blue-300 hover:text-red-500 dark:hover:text-red-400">
              <XIcon className="h-3 w-3" />
            </button>
          </div>
        ))}
        <input
          id={id}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => inputValue && setShowSuggestions(true)}
          placeholder={placeholder || 'Type and press Enter...'}
          className="flex-grow bg-transparent focus:outline-none p-1 min-w-[120px]"
        />
         {showSuggestions && filteredSuggestions.length > 0 && (
            <ul className="absolute z-10 w-full mt-1 bg-light-accent dark:bg-dark-accent border border-light-border dark:border-dark-border rounded-md shadow-lg max-h-48 overflow-auto top-full left-0">
            {filteredSuggestions.map(suggestion => (
                <li
                key={suggestion}
                onClick={() => addChip(suggestion)}
                className="px-4 py-2 cursor-pointer hover:bg-light-accent-hover dark:hover:bg-dark-accent-hover"
                >
                {suggestion}
                </li>
            ))}
            </ul>
        )}
      </div>
    </div>
  );
};

export default ChipInput;
