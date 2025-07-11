import React from 'react';
import { CheckCircleIcon, XMarkIcon, EyeSlashIcon, DocumentArrowDownIcon, TagIcon } from './Icons';

interface UnifiedActionBarProps {
    // Crimson selection
    crimsonSelectedCount: number;
    crimsonSelectedTotal: number;
    onCrimsonBulkReconcile: () => void;
    onCrimsonBulkExport: () => void;
    onCrimsonClearSelection: () => void;
    
    // Bank selection
    bankSelectedCount: number;
    bankSelectedTotal: number;
    onBankBulkReconcile: () => void;
    onBankBulkMarkAsNrit: () => void;
    onBankBulkExport: () => void;
    onBankClearSelection: () => void;
    
    // Manual reconciliation
    canReconcile: boolean;
    onManualReconcile: () => void;
    
    // Totals for display
    crimsonUnreconciledTotal: number;
    bankUnreconciledTotal: number;
}

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

const ActionButton: React.FC<{
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
    variant?: 'primary' | 'secondary' | 'danger';
    disabled?: boolean;
}> = ({ onClick, icon, label, variant = 'secondary', disabled = false }) => {
    const baseClasses = "flex items-center gap-1 px-2 py-1 text-xs font-medium rounded transition-colors";
    const variantClasses = {
        primary: "text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300",
        secondary: "text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 disabled:text-slate-400",
        danger: "text-white bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300"
    };
    
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variantClasses[variant]} ${disabled ? 'cursor-not-allowed' : ''}`}
        >
            {icon}
            {label}
        </button>
    );
};

export const UnifiedActionBar: React.FC<UnifiedActionBarProps> = ({
    crimsonSelectedCount,
    crimsonSelectedTotal,
    onCrimsonBulkReconcile,
    onCrimsonBulkExport,
    onCrimsonClearSelection,
    bankSelectedCount,
    bankSelectedTotal,
    onBankBulkReconcile,
    onBankBulkMarkAsNrit,
    onBankBulkExport,
    onBankClearSelection,
    canReconcile,
    onManualReconcile,
    crimsonUnreconciledTotal,
    bankUnreconciledTotal
}) => {
    const difference = crimsonSelectedTotal - bankSelectedTotal;
    const hasSelections = crimsonSelectedCount > 0 || bankSelectedCount > 0;
    
    if (!hasSelections && !canReconcile) {
        return null;
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-3 mb-3 border border-slate-200/50">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
                
                {/* Left: Selection Actions */}
                <div className="flex-1 space-y-2 lg:space-y-0 lg:flex lg:items-center lg:gap-4">
                    
                    {/* Selection Display */}
                    <div className="flex items-center gap-4">
                        {crimsonSelectedCount > 0 && (
                            <span className="text-xs font-medium text-sky-700 bg-sky-50 px-2 py-1 rounded">
                                Crimson: {crimsonSelectedCount} ({formatCurrency(crimsonSelectedTotal)})
                            </span>
                        )}

                        {bankSelectedCount > 0 && (
                            <span className="text-xs font-medium text-indigo-700 bg-indigo-50 px-2 py-1 rounded">
                                Bank: {bankSelectedCount} ({formatCurrency(bankSelectedTotal)})
                            </span>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {bankSelectedCount > 0 && (
                            <ActionButton
                                onClick={onBankBulkMarkAsNrit}
                                icon={<EyeSlashIcon className="w-3 h-3" />}
                                label="Mark NRIT"
                            />
                        )}

                        {hasSelections && (
                            <ActionButton
                                onClick={() => {
                                    onCrimsonClearSelection();
                                    onBankClearSelection();
                                }}
                                icon={<XMarkIcon className="w-3 h-3" />}
                                label="Clear All"
                            />
                        )}
                    </div>
                </div>
                
                {/* Right: Manual Reconciliation */}
                {crimsonSelectedCount > 0 && bankSelectedCount > 0 && (
                    <div className="flex items-center gap-3 lg:border-l lg:border-slate-200 lg:pl-4">
                        <div className="text-center">
                            <div className="text-xs font-medium text-slate-600">Difference</div>
                            <div className={`text-sm font-bold ${
                                canReconcile ? 'text-emerald-600' : 'text-rose-600'
                            }`}>
                                {formatCurrency(difference)}
                            </div>
                        </div>
                        <button
                            onClick={onManualReconcile}
                            disabled={!canReconcile}
                            className={`px-4 py-2 font-bold text-sm rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                canReconcile
                                    ? 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 transform hover:scale-105'
                                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                            }`}
                        >
                            {canReconcile ? '✓ Reconcile' : 'Reconcile'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
