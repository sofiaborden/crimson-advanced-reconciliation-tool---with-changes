import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, XMarkIcon, CheckIcon } from './Icons';

interface MultiSelectProps {
    label: string;
    options: { value: string; label: string }[];
    selectedValues: string[];
    onChange: (values: string[]) => void;
    placeholder?: string;
    className?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
    label,
    options,
    selectedValues,
    onChange,
    placeholder = "Select options...",
    className = ""
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggleOption = (value: string) => {
        if (value === 'All') {
            onChange(['All']);
            return;
        }

        let newValues: string[];
        if (selectedValues.includes('All')) {
            // If "All" was selected, replace with the new selection
            newValues = [value];
        } else if (selectedValues.includes(value)) {
            // Remove the value
            newValues = selectedValues.filter(v => v !== value);
            // If no values left, select "All"
            if (newValues.length === 0) {
                newValues = ['All'];
            }
        } else {
            // Add the value
            newValues = [...selectedValues, value];
        }
        
        onChange(newValues);
    };

    const handleRemoveValue = (value: string) => {
        if (value === 'All') {
            return; // Can't remove "All" directly
        }
        
        const newValues = selectedValues.filter(v => v !== value);
        if (newValues.length === 0) {
            onChange(['All']);
        } else {
            onChange(newValues);
        }
    };

    const displayText = () => {
        if (selectedValues.includes('All') || selectedValues.length === 0) {
            return 'All';
        }
        if (selectedValues.length === 1) {
            return selectedValues[0];
        }
        return `${selectedValues.length} selected`;
    };

    const isSelected = (value: string) => {
        if (value === 'All') {
            return selectedValues.includes('All') || selectedValues.length === 0;
        }
        return selectedValues.includes(value);
    };

    return (
        <div className={`relative ${className}`}>
            <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
            
            <div ref={dropdownRef} className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full p-1.5 border border-slate-300 rounded text-xs focus:ring-sky-500 focus:border-sky-500 bg-white text-left flex items-center justify-between"
                >
                    <span className="truncate">{displayText()}</span>
                    <ChevronDownIcon className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                    <div className="absolute z-[99999] w-full mt-1 bg-white border border-slate-300 rounded-md shadow-xl max-h-48 overflow-y-auto" style={{ position: 'absolute', top: '100%', left: 0, right: 0 }}>
                        {options.map((option) => (
                            <div
                                key={option.value}
                                onClick={() => handleToggleOption(option.value)}
                                className="flex items-center justify-between px-3 py-2 text-xs hover:bg-slate-50 cursor-pointer"
                            >
                                <span className="flex-1">{option.label}</span>
                                {isSelected(option.value) && (
                                    <CheckIcon className="w-3 h-3 text-sky-600" />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Selected values display */}
            {!selectedValues.includes('All') && selectedValues.length > 1 && (
                <div className="mt-1 flex flex-wrap gap-1">
                    {selectedValues.map((value) => (
                        <span
                            key={value}
                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-sky-100 text-sky-800 text-xs rounded"
                        >
                            {value}
                            <button
                                onClick={() => handleRemoveValue(value)}
                                className="hover:text-sky-600"
                            >
                                <XMarkIcon className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};
