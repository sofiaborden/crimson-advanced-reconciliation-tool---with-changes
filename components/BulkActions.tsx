import React, { useState } from 'react';
import { CheckCircleIcon, XMarkIcon, EyeSlashIcon, ArchiveBoxIcon, ScissorsIcon, TrashIcon, DocumentArrowDownIcon, TagIcon } from './Icons';

interface BulkActionsProps {
    selectedCount: number;
    isCrimson: boolean;
    onBulkReconcile: () => void;
    onBulkMarkAsNrit?: () => void;
    onBulkDelete?: () => void;
    onBulkExport?: () => void;
    onBulkTag?: (tag: string) => void;
    onClearSelection: () => void;
}

const ActionButton: React.FC<{
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
    variant?: 'primary' | 'secondary' | 'danger';
    disabled?: boolean;
}> = ({ onClick, icon, label, variant = 'secondary', disabled = false }) => {
    const baseClasses = "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    const variantClasses = {
        primary: "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500",
        secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-500",
        danger: "bg-rose-100 text-rose-700 hover:bg-rose-200 focus:ring-rose-500"
    };

    const disabledClasses = "bg-slate-100 text-slate-400 cursor-not-allowed";

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${disabled ? disabledClasses : variantClasses[variant]}`}
        >
            {icon}
            {label}
        </button>
    );
};

export const BulkActions: React.FC<BulkActionsProps> = ({
    selectedCount,
    isCrimson,
    onBulkReconcile,
    onBulkMarkAsNrit,
    onBulkDelete,
    onBulkExport,
    onBulkTag,
    onClearSelection,
}) => {
    const [showTagMenu, setShowTagMenu] = useState(false);
    const [customTag, setCustomTag] = useState('');

    const predefinedTags = [
        'Review Required',
        'Pending Approval',
        'Disputed',
        'Follow Up',
        'Priority'
    ];

    const handleTagSelect = (tag: string) => {
        if (onBulkTag) {
            onBulkTag(tag);
        }
        setShowTagMenu(false);
        setCustomTag('');
    };

    const handleCustomTag = () => {
        if (customTag.trim() && onBulkTag) {
            onBulkTag(customTag.trim());
            setCustomTag('');
            setShowTagMenu(false);
        }
    };

    if (selectedCount === 0) {
        return null;
    }

    return (
        <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-4 mb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
                            {selectedCount} transaction{selectedCount !== 1 ? 's' : ''} selected
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <ActionButton
                            onClick={onBulkReconcile}
                            icon={<CheckCircleIcon className="w-4 h-4" />}
                            label="Reconcile All"
                            variant="primary"
                        />

                        {!isCrimson && onBulkMarkAsNrit && (
                            <ActionButton
                                onClick={onBulkMarkAsNrit}
                                icon={<EyeSlashIcon className="w-4 h-4" />}
                                label="Mark as NRIT"
                            />
                        )}

                        {onBulkExport && (
                            <ActionButton
                                onClick={onBulkExport}
                                icon={<DocumentArrowDownIcon className="w-4 h-4" />}
                                label="Export"
                            />
                        )}

                        {onBulkTag && (
                            <div className="relative">
                                <ActionButton
                                    onClick={() => setShowTagMenu(!showTagMenu)}
                                    icon={<TagIcon className="w-4 h-4" />}
                                    label="Tag"
                                />

                                {showTagMenu && (
                                    <div className="absolute top-full mt-2 left-0 w-64 bg-white rounded-lg shadow-xl border border-slate-200 z-50">
                                        <div className="p-3 border-b border-slate-200">
                                            <h4 className="text-sm font-semibold text-slate-800">Add Tag</h4>
                                        </div>
                                        <div className="p-3 space-y-2">
                                            {predefinedTags.map(tag => (
                                                <button
                                                    key={tag}
                                                    onClick={() => handleTagSelect(tag)}
                                                    className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                                                >
                                                    {tag}
                                                </button>
                                            ))}
                                            <div className="pt-2 border-t border-slate-200">
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Custom tag..."
                                                        value={customTag}
                                                        onChange={(e) => setCustomTag(e.target.value)}
                                                        onKeyPress={(e) => e.key === 'Enter' && handleCustomTag()}
                                                        className="flex-1 px-2 py-1 text-sm border border-slate-300 rounded focus:ring-sky-500 focus:border-sky-500"
                                                    />
                                                    <button
                                                        onClick={handleCustomTag}
                                                        disabled={!customTag.trim()}
                                                        className="px-2 py-1 text-sm bg-sky-600 text-white rounded hover:bg-sky-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
                                                    >
                                                        Add
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {onBulkDelete && (
                            <ActionButton
                                onClick={onBulkDelete}
                                icon={<TrashIcon className="w-4 h-4" />}
                                label="Delete"
                                variant="danger"
                            />
                        )}
                    </div>
                </div>

                <button
                    onClick={onClearSelection}
                    className="flex items-center gap-1 px-2 py-1 text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors whitespace-nowrap"
                >
                    <XMarkIcon className="w-4 h-4" />
                    Clear
                </button>
            </div>
        </div>
    );
};
