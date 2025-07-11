import React from 'react';
import { ExclamationTriangleIcon, DocumentArrowDownIcon, ClockIcon } from './Icons';

interface ReconciliationFooterProps {
    onValidate: () => void;
    onExport: () => void;
    onAudit: () => void;
    isVisible?: boolean;
    sessionStatus?: string;
    progressInfo?: {
        reconciledCount: number;
        totalCount: number;
        unreconciledAmount: number;
    };
}

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

export const ReconciliationFooter: React.FC<ReconciliationFooterProps> = ({
    onValidate,
    onExport,
    onAudit,
    isVisible = true,
    sessionStatus = 'In Progress',
    progressInfo
}) => {
    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between py-2">
                    {/* Left side - Action buttons */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onValidate}
                            className="flex items-center gap-2 px-3 py-1.5 bg-orange-600 text-white font-medium rounded-lg shadow-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200"
                        >
                            <ExclamationTriangleIcon className="w-4 h-4" />
                            Validate
                        </button>
                        <button
                            onClick={onExport}
                            className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white font-medium rounded-lg shadow-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200"
                        >
                            <DocumentArrowDownIcon className="w-4 h-4" />
                            Export
                        </button>
                        <button
                            onClick={onAudit}
                            className="flex items-center gap-2 px-3 py-1.5 bg-slate-600 text-white font-medium rounded-lg shadow-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200"
                        >
                            <ClockIcon className="w-4 h-4" />
                            Audit
                        </button>
                    </div>

                    {/* Center - Progress info */}
                    {progressInfo && (
                        <div className="hidden md:flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="text-slate-600">Progress:</span>
                                <span className="font-semibold text-slate-800">
                                    {progressInfo.reconciledCount} / {progressInfo.totalCount} reconciled
                                </span>
                            </div>
                            {progressInfo.unreconciledAmount > 0 && (
                                <div className="flex items-center gap-2">
                                    <span className="text-slate-600">Remaining:</span>
                                    <span className="font-semibold text-rose-600">
                                        {formatCurrency(progressInfo.unreconciledAmount)}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Right side - Session status */}
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2 text-sm">
                            <span className="text-slate-600">Session:</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                sessionStatus === 'In Progress' 
                                    ? 'bg-blue-100 text-blue-800'
                                    : sessionStatus === 'Complete'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-slate-100 text-slate-800'
                            }`}>
                                {sessionStatus}
                            </span>
                        </div>
                        
                        {/* Mobile progress indicator */}
                        {progressInfo && (
                            <div className="md:hidden text-xs text-slate-600">
                                {progressInfo.reconciledCount}/{progressInfo.totalCount}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
