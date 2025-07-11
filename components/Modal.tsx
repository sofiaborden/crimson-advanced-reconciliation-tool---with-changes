import React from 'react';
import { XCircleIcon } from './Icons';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-slate-800/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex items-center justify-between p-4 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-800">{title}</h2>
                    <button 
                        onClick={onClose}
                        className="p-1 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
                        aria-label="Close"
                    >
                        <XCircleIcon className="w-7 h-7" />
                    </button>
                </header>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};