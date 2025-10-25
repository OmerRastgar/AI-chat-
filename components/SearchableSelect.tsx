import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { XIcon } from './icons/XIcon';

interface SearchableSelectProps {
    id: string;
    options: string[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({ id, options, value, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // When a value is selected externally or internally, update the search term to match
        setSearchTerm(value);
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                // Revert to the valid value if the input text is not a valid option
                if (!options.includes(searchTerm)) {
                    setSearchTerm(value);
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [value, searchTerm, options]);

    const handleSelectOption = (option: string) => {
        onChange(option);
        setSearchTerm(option);
        setIsOpen(false);
        inputRef.current?.focus();
    };

    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        if (!isOpen) {
            setIsOpen(true);
        }
    };
    
    const clearSelection = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange('');
        setSearchTerm('');
        setIsOpen(true);
        inputRef.current?.focus();
    }

    return (
        <div ref={wrapperRef} className="relative w-full" role="combobox" aria-haspopup="listbox" aria-expanded={isOpen}>
            <div className="relative">
                <input
                    ref={inputRef}
                    id={id}
                    type="text"
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder || 'Select an option'}
                    className="w-full p-2 pr-16 border border-light-border dark:border-dark-border bg-light-accent dark:bg-dark-accent rounded-lg focus:ring-primary focus:border-primary"
                    aria-autocomplete="list"
                    aria-controls={`${id}-listbox`}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                    {value && (
                        <button type="button" onClick={clearSelection} className="p-1 text-light-text/60 dark:text-dark-text/60 hover:text-light-text dark:hover:text-dark-text rounded-full" aria-label="Clear selection">
                            <XIcon className="h-4 w-4" />
                        </button>
                    )}
                    <button type="button" onClick={() => setIsOpen(!isOpen)} className="p-1 text-light-text/60 dark:text-dark-text/60 rounded-full" aria-label="Toggle dropdown">
                        <ChevronDownIcon className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </div>

            {isOpen && (
                <ul 
                    id={`${id}-listbox`}
                    role="listbox"
                    className="absolute z-10 w-full mt-1 bg-light-accent dark:bg-dark-accent border border-light-border dark:border-dark-border rounded-md shadow-lg max-h-60 overflow-auto"
                >
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map(option => (
                            <li
                                key={option}
                                onClick={() => handleSelectOption(option)}
                                className="px-4 py-2 cursor-pointer hover:bg-light-accent-hover dark:hover:bg-dark-accent-hover"
                                role="option"
                                aria-selected={option === value}
                            >
                                {option}
                            </li>
                        ))
                    ) : (
                        <li className="px-4 py-2 text-light-text/60 dark:text-dark-text/60">No results found</li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default SearchableSelect;
