import React, { useState } from 'react';
import { DocumentArrowDownIcon, XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon, ClockIcon } from './Icons';
import { CrimsonTransaction, BankTransaction } from '../types';

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    crimsonTransactions: CrimsonTransaction[];
    bankTransactions: BankTransaction[];
}

interface ExportOptions {
    format: 'csv' | 'excel' | 'fec' | 'pdf';
    scope: 'all' | 'reconciled' | 'unreconciled' | 'nrit';
    dateRange: { start: string; end: string };
    includeAuditTrail: boolean;
    includeSummary: boolean;
    splitByFund: boolean;
}

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, crimsonTransactions, bankTransactions }) => {
    const [exportOptions, setExportOptions] = useState<ExportOptions>({
        format: 'csv',
        scope: 'all',
        dateRange: { start: '', end: '' },
        includeAuditTrail: false,
        includeSummary: true,
        splitByFund: false
    });
    const [isExporting, setIsExporting] = useState(false);
    const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const getFilteredTransactions = () => {
        const allTransactions = [...crimsonTransactions, ...bankTransactions];
        
        return allTransactions.filter(transaction => {
            // Scope filter
            switch (exportOptions.scope) {
                case 'reconciled':
                    if (!transaction.isReconciled) return false;
                    break;
                case 'unreconciled':
                    if (transaction.isReconciled) return false;
                    break;
                case 'nrit':
                    if (!(transaction as BankTransaction).isNrit) return false;
                    break;
            }

            // Date range filter
            if (exportOptions.dateRange.start && transaction.date < exportOptions.dateRange.start) return false;
            if (exportOptions.dateRange.end && transaction.date > exportOptions.dateRange.end) return false;

            return true;
        });
    };

    const generateCSV = (transactions: (CrimsonTransaction | BankTransaction)[]) => {
        const headers = [
            'ID', 'Date', 'Type', 'Description/Payment Type', 'Amount', 
            'Reconciled', 'NRIT', 'Fund Code', 'Account Code'
        ];

        const rows = transactions.map(t => {
            const isCrimson = 'paymentType' in t;
            return [
                t.id,
                t.date,
                isCrimson ? 'Crimson' : 'Bank',
                isCrimson ? (t as CrimsonTransaction).paymentType : (t as BankTransaction).description,
                t.amount,
                t.isReconciled ? 'Yes' : 'No',
                (t as BankTransaction).isNrit ? 'Yes' : 'No',
                isCrimson ? (t as CrimsonTransaction).group : '',
                '' // Account code would come from transaction data
            ];
        });

        return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    };

    const generateFECReport = (transactions: (CrimsonTransaction | BankTransaction)[]) => {
        // Simplified FEC format - in real implementation, this would follow FEC specifications
        const fecData = {
            header: {
                formType: 'F3',
                filerCommitteeId: 'C00123456',
                reportingPeriod: {
                    start: exportOptions.dateRange.start || '2024-01-01',
                    end: exportOptions.dateRange.end || '2024-12-31'
                }
            },
            scheduleA: crimsonTransactions.filter(t => t.amount > 0 && getFilteredTransactions().includes(t)),
            scheduleB: crimsonTransactions.filter(t => t.amount < 0 && getFilteredTransactions().includes(t)),
            summary: {
                totalReceipts: crimsonTransactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0),
                totalDisbursements: Math.abs(crimsonTransactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0)),
                cashOnHand: 0 // Would be calculated from previous reports
            }
        };

        return JSON.stringify(fecData, null, 2);
    };

    const handleExport = async () => {
        setIsExporting(true);
        setExportStatus('idle');

        try {
            const filteredTransactions = getFilteredTransactions();
            let content = '';
            let filename = '';
            let mimeType = '';

            switch (exportOptions.format) {
                case 'csv':
                    content = generateCSV(filteredTransactions);
                    filename = `reconciliation_export_${new Date().toISOString().split('T')[0]}.csv`;
                    mimeType = 'text/csv';
                    break;
                case 'fec':
                    content = generateFECReport(filteredTransactions);
                    filename = `fec_report_${new Date().toISOString().split('T')[0]}.json`;
                    mimeType = 'application/json';
                    break;
                case 'excel':
                    // For Excel, we'd use a library like xlsx
                    content = generateCSV(filteredTransactions); // Fallback to CSV for now
                    filename = `reconciliation_export_${new Date().toISOString().split('T')[0]}.csv`;
                    mimeType = 'text/csv';
                    break;
                case 'pdf':
                    // For PDF, we'd use a library like jsPDF
                    content = generateCSV(filteredTransactions); // Fallback to CSV for now
                    filename = `reconciliation_export_${new Date().toISOString().split('T')[0]}.csv`;
                    mimeType = 'text/csv';
                    break;
            }

            // Create and download file
            const blob = new Blob([content], { type: mimeType });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);

            setExportStatus('success');
            setTimeout(() => {
                setExportStatus('idle');
                onClose();
            }, 2000);

        } catch (error) {
            console.error('Export failed:', error);
            setExportStatus('error');
        } finally {
            setIsExporting(false);
        }
    };

    const filteredCount = getFilteredTransactions().length;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <DocumentArrowDownIcon className="w-8 h-8" />
                            <div>
                                <h2 className="text-2xl font-bold">Export Data</h2>
                                <p className="text-emerald-100 mt-1">Export reconciliation data in various formats</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-emerald-100 hover:text-white transition-colors p-1"
                            aria-label="Close export modal"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 max-h-96 overflow-y-auto">
                    <div className="space-y-6">
                        {/* Format Selection */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-3">Export Format</label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { value: 'csv', label: 'CSV', description: 'Comma-separated values' },
                                    { value: 'excel', label: 'Excel', description: 'Microsoft Excel format' },
                                    { value: 'fec', label: 'FEC Report', description: 'Federal Election Commission format' },
                                    { value: 'pdf', label: 'PDF', description: 'Portable document format' }
                                ].map(format => (
                                    <label
                                        key={format.value}
                                        className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                                            exportOptions.format === format.value
                                                ? 'border-emerald-500 bg-emerald-50'
                                                : 'border-slate-200 hover:border-slate-300'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="format"
                                            value={format.value}
                                            checked={exportOptions.format === format.value}
                                            onChange={(e) => setExportOptions(prev => ({ ...prev, format: e.target.value as any }))}
                                            className="sr-only"
                                        />
                                        <div className="font-medium text-slate-800">{format.label}</div>
                                        <div className="text-sm text-slate-600">{format.description}</div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Scope Selection */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-3">Data Scope</label>
                            <select
                                value={exportOptions.scope}
                                onChange={(e) => setExportOptions(prev => ({ ...prev, scope: e.target.value as any }))}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                            >
                                <option value="all">All Transactions</option>
                                <option value="reconciled">Reconciled Only</option>
                                <option value="unreconciled">Unreconciled Only</option>
                                <option value="nrit">NRIT Transactions Only</option>
                            </select>
                        </div>

                        {/* Date Range */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-3">Date Range (Optional)</label>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs text-slate-600 mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        value={exportOptions.dateRange.start}
                                        onChange={(e) => setExportOptions(prev => ({
                                            ...prev,
                                            dateRange: { ...prev.dateRange, start: e.target.value }
                                        }))}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-600 mb-1">End Date</label>
                                    <input
                                        type="date"
                                        value={exportOptions.dateRange.end}
                                        onChange={(e) => setExportOptions(prev => ({
                                            ...prev,
                                            dateRange: { ...prev.dateRange, end: e.target.value }
                                        }))}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Additional Options */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-3">Additional Options</label>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={exportOptions.includeSummary}
                                        onChange={(e) => setExportOptions(prev => ({ ...prev, includeSummary: e.target.checked }))}
                                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <span className="text-sm text-slate-700">Include summary statistics</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={exportOptions.includeAuditTrail}
                                        onChange={(e) => setExportOptions(prev => ({ ...prev, includeAuditTrail: e.target.checked }))}
                                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <span className="text-sm text-slate-700">Include audit trail</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={exportOptions.splitByFund}
                                        onChange={(e) => setExportOptions(prev => ({ ...prev, splitByFund: e.target.checked }))}
                                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <span className="text-sm text-slate-700">Split by fund code</span>
                                </label>
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="bg-slate-50 p-4 rounded-lg">
                            <h4 className="font-medium text-slate-800 mb-2">Export Preview</h4>
                            <div className="text-sm text-slate-600 space-y-1">
                                <div>Format: <span className="font-medium">{exportOptions.format.toUpperCase()}</span></div>
                                <div>Transactions: <span className="font-medium">{filteredCount}</span></div>
                                <div>Scope: <span className="font-medium">{exportOptions.scope}</span></div>
                                {(exportOptions.dateRange.start || exportOptions.dateRange.end) && (
                                    <div>Date Range: <span className="font-medium">
                                        {exportOptions.dateRange.start || '...'} to {exportOptions.dateRange.end || '...'}
                                    </span></div>
                                )}
                            </div>
                        </div>

                        {/* Status Messages */}
                        {exportStatus === 'success' && (
                            <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                                <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
                                <span className="text-sm text-emerald-800">Export completed successfully!</span>
                            </div>
                        )}

                        {exportStatus === 'error' && (
                            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-lg">
                                <ExclamationTriangleIcon className="w-5 h-5 text-rose-600" />
                                <span className="text-sm text-rose-800">Export failed. Please try again.</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-between items-center">
                    <div className="text-sm text-slate-600">
                        {filteredCount} transactions will be exported
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={isExporting}
                            className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleExport}
                            disabled={isExporting || filteredCount === 0}
                            className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
                        >
                            {isExporting ? (
                                <>
                                    <ClockIcon className="w-4 h-4 animate-spin" />
                                    Exporting...
                                </>
                            ) : (
                                <>
                                    <DocumentArrowDownIcon className="w-4 h-4" />
                                    Export Data
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
