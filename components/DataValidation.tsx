import React, { useMemo } from 'react';
import { ExclamationTriangleIcon, CheckCircleIcon, XMarkIcon, InformationCircleIcon } from './Icons';
import { CrimsonTransaction, BankTransaction } from '../types';

interface ValidationIssue {
    id: string;
    type: 'error' | 'warning' | 'info';
    category: 'amount' | 'date' | 'duplicate' | 'missing' | 'format';
    message: string;
    transactionId?: string;
    suggestion?: string;
}

interface DataValidationProps {
    isOpen: boolean;
    onClose: () => void;
    crimsonTransactions: CrimsonTransaction[];
    bankTransactions: BankTransaction[];
    onFixIssue?: (issueId: string, transactionId: string) => void;
}

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

export const DataValidation: React.FC<DataValidationProps> = ({ 
    isOpen, 
    onClose, 
    crimsonTransactions, 
    bankTransactions,
    onFixIssue 
}) => {
    const validationIssues = useMemo((): ValidationIssue[] => {
        const issues: ValidationIssue[] = [];

        // Check for duplicate transactions
        const crimsonAmounts = new Map<string, CrimsonTransaction[]>();
        crimsonTransactions.forEach(t => {
            const key = `${t.date}-${t.amount}`;
            if (!crimsonAmounts.has(key)) crimsonAmounts.set(key, []);
            crimsonAmounts.get(key)!.push(t);
        });

        crimsonAmounts.forEach((transactions, key) => {
            if (transactions.length > 1) {
                issues.push({
                    id: `duplicate-crimson-${key}`,
                    type: 'warning',
                    category: 'duplicate',
                    message: `${transactions.length} Crimson transactions with same date and amount`,
                    transactionId: transactions[0].id,
                    suggestion: 'Review for potential duplicates or split transactions'
                });
            }
        });

        // Check for unusual amounts
        const allAmounts = [...crimsonTransactions, ...bankTransactions].map(t => Math.abs(t.amount));
        const avgAmount = allAmounts.reduce((sum, amt) => sum + amt, 0) / allAmounts.length;
        const maxAmount = Math.max(...allAmounts);

        [...crimsonTransactions, ...bankTransactions].forEach(t => {
            if (Math.abs(t.amount) > avgAmount * 10) {
                issues.push({
                    id: `unusual-amount-${t.id}`,
                    type: 'warning',
                    category: 'amount',
                    message: `Unusually large amount: ${formatCurrency(t.amount)}`,
                    transactionId: t.id,
                    suggestion: 'Verify this amount is correct'
                });
            }

            if (t.amount === 0) {
                issues.push({
                    id: `zero-amount-${t.id}`,
                    type: 'error',
                    category: 'amount',
                    message: 'Transaction has zero amount',
                    transactionId: t.id,
                    suggestion: 'Enter the correct transaction amount'
                });
            }
        });

        // Check for future dates
        const today = new Date().toISOString().split('T')[0];
        [...crimsonTransactions, ...bankTransactions].forEach(t => {
            if (t.date > today) {
                issues.push({
                    id: `future-date-${t.id}`,
                    type: 'warning',
                    category: 'date',
                    message: `Transaction dated in the future: ${t.date}`,
                    transactionId: t.id,
                    suggestion: 'Verify the transaction date is correct'
                });
            }
        });

        // Check for missing payment types in Crimson transactions
        crimsonTransactions.forEach(t => {
            if (!t.paymentType || t.paymentType.trim() === '') {
                issues.push({
                    id: `missing-payment-type-${t.id}`,
                    type: 'error',
                    category: 'missing',
                    message: 'Missing payment type',
                    transactionId: t.id,
                    suggestion: 'Add payment type (CH, CC, JF, etc.)'
                });
            }
        });

        // Check for missing descriptions in Bank transactions
        bankTransactions.forEach(t => {
            if (!t.description || t.description.trim() === '') {
                issues.push({
                    id: `missing-description-${t.id}`,
                    type: 'error',
                    category: 'missing',
                    message: 'Missing transaction description',
                    transactionId: t.id,
                    suggestion: 'Add a description for this bank transaction'
                });
            }
        });

        // Check reconciliation balance
        const reconciledCrimsonTotal = crimsonTransactions
            .filter(t => t.isReconciled)
            .reduce((sum, t) => sum + t.amount, 0);
        
        const reconciledBankTotal = bankTransactions
            .filter(t => t.isReconciled && !t.isNrit)
            .reduce((sum, t) => sum + t.amount, 0);

        const difference = Math.abs(reconciledCrimsonTotal - reconciledBankTotal);
        if (difference > 0.01) {
            issues.push({
                id: 'reconciliation-imbalance',
                type: 'error',
                category: 'amount',
                message: `Reconciliation imbalance: ${formatCurrency(difference)}`,
                suggestion: 'Review reconciled transactions to identify discrepancy'
            });
        }

        // Check for old unreconciled transactions
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];

        const oldUnreconciledCount = [...crimsonTransactions, ...bankTransactions]
            .filter(t => !t.isReconciled && t.date < thirtyDaysAgoStr).length;

        if (oldUnreconciledCount > 0) {
            issues.push({
                id: 'old-unreconciled',
                type: 'info',
                category: 'date',
                message: `${oldUnreconciledCount} unreconciled transactions older than 30 days`,
                suggestion: 'Consider reconciling or marking as NRIT if appropriate'
            });
        }

        return issues.sort((a, b) => {
            const typeOrder = { error: 0, warning: 1, info: 2 };
            return typeOrder[a.type] - typeOrder[b.type];
        });
    }, [crimsonTransactions, bankTransactions]);

    const getIssueIcon = (type: ValidationIssue['type']) => {
        switch (type) {
            case 'error':
                return <ExclamationTriangleIcon className="w-5 h-5 text-rose-600" />;
            case 'warning':
                return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />;
            case 'info':
                return <InformationCircleIcon className="w-5 h-5 text-blue-600" />;
        }
    };

    const getIssueColor = (type: ValidationIssue['type']) => {
        switch (type) {
            case 'error':
                return 'bg-rose-50 border-rose-200';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200';
            case 'info':
                return 'bg-blue-50 border-blue-200';
        }
    };

    const errorCount = validationIssues.filter(i => i.type === 'error').length;
    const warningCount = validationIssues.filter(i => i.type === 'warning').length;
    const infoCount = validationIssues.filter(i => i.type === 'info').length;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <ExclamationTriangleIcon className="w-8 h-8" />
                            <div>
                                <h2 className="text-2xl font-bold">Data Validation</h2>
                                <p className="text-orange-100 mt-1">Review and fix data quality issues</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-orange-100 hover:text-white transition-colors p-1"
                            aria-label="Close data validation"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Summary */}
                <div className="bg-slate-50 p-4 border-b border-slate-200">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-slate-800">{validationIssues.length}</div>
                            <div className="text-sm text-slate-600">Total Issues</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-rose-600">{errorCount}</div>
                            <div className="text-sm text-slate-600">Errors</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-600">{warningCount}</div>
                            <div className="text-sm text-slate-600">Warnings</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{infoCount}</div>
                            <div className="text-sm text-slate-600">Info</div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 max-h-96 overflow-y-auto">
                    {validationIssues.length === 0 ? (
                        <div className="text-center py-12">
                            <CheckCircleIcon className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-slate-800 mb-2">All Good!</h3>
                            <p className="text-slate-600">No data validation issues found.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {validationIssues.map((issue) => (
                                <div
                                    key={issue.id}
                                    className={`p-4 rounded-lg border-2 ${getIssueColor(issue.type)}`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 mt-0.5">
                                            {getIssueIcon(issue.type)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-semibold text-slate-800">{issue.message}</h4>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                                        issue.type === 'error' ? 'bg-rose-100 text-rose-800' :
                                                        issue.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-blue-100 text-blue-800'
                                                    }`}>
                                                        {issue.type.toUpperCase()}
                                                    </span>
                                                    <span className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded-full">
                                                        {issue.category}
                                                    </span>
                                                </div>
                                            </div>
                                            {issue.suggestion && (
                                                <p className="text-sm text-slate-600 mb-3">{issue.suggestion}</p>
                                            )}
                                            <div className="flex items-center justify-between">
                                                {issue.transactionId && (
                                                    <div className="text-xs text-slate-500">
                                                        Transaction ID: {issue.transactionId}
                                                    </div>
                                                )}
                                                {onFixIssue && issue.transactionId && (
                                                    <button
                                                        onClick={() => onFixIssue(issue.id, issue.transactionId!)}
                                                        className="text-sm font-medium text-orange-600 hover:text-orange-800 transition-colors"
                                                    >
                                                        Fix Issue
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-between items-center">
                    <div className="text-sm text-slate-600">
                        {errorCount > 0 && (
                            <span className="text-rose-600 font-medium">
                                {errorCount} critical issue{errorCount !== 1 ? 's' : ''} require attention
                            </span>
                        )}
                        {errorCount === 0 && warningCount > 0 && (
                            <span className="text-yellow-600 font-medium">
                                {warningCount} warning{warningCount !== 1 ? 's' : ''} to review
                            </span>
                        )}
                        {errorCount === 0 && warningCount === 0 && (
                            <span className="text-emerald-600 font-medium">Data validation passed</span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
