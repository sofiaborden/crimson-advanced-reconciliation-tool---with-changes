import React, { useState } from 'react';
import { 
    DocumentTextIcon, 
    ChartBarIcon, 
    ExclamationTriangleIcon,
    DocumentArrowDownIcon,
    EyeIcon,
    CheckCircleIcon,
    ClockIcon
} from './Icons';
import { completedReconciliationSessions } from '../constants';

interface ReportsProps {
    onViewReconciliation?: (sessionId: string) => void;
    onNavigateBack?: () => void;
}

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
});

export const Reports: React.FC<ReportsProps> = ({ onViewReconciliation, onNavigateBack }) => {
    const [activeView, setActiveView] = useState<'overview' | 'detailed' | 'discrepancies' | 'export'>('overview');
    const [selectedSession, setSelectedSession] = useState<string | null>(null);
    const [detailTab, setDetailTab] = useState<'reconciliation' | 'payment_type' | 'line_number'>('reconciliation');

    const sessions = completedReconciliationSessions;

    const reportTypes = [
        {
            id: 'overview',
            title: 'Reconciliation Summary',
            description: 'Overview of all completed reconciliation sessions',
            icon: <ChartBarIcon className="w-6 h-6" />,
            count: sessions.length
        },
        {
            id: 'detailed',
            title: 'Detailed Reconciliation',
            description: 'Drill-down into specific reconciliation with transaction details',
            icon: <DocumentTextIcon className="w-6 h-6" />,
            count: sessions.filter(s => s.status === 'certified').length
        },
        {
            id: 'discrepancies',
            title: 'Discrepancy Analysis',
            description: 'Focus on unmatched and problematic transactions',
            icon: <ExclamationTriangleIcon className="w-6 h-6" />,
            count: sessions.reduce((sum, s) => sum + s.discrepancies, 0)
        },
        {
            id: 'export',
            title: 'Compliance Export',
            description: 'FEC-ready export format for regulatory submissions',
            icon: <DocumentArrowDownIcon className="w-6 h-6" />,
            count: sessions.filter(s => s.status === 'certified').length
        }
    ];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'certified':
                return <CheckCircleIcon className="w-5 h-5 text-emerald-600" />;
            case 'completed':
                return <ClockIcon className="w-5 h-5 text-blue-600" />;
            case 'in_progress':
                return <ClockIcon className="w-5 h-5 text-amber-600" />;
            default:
                return <ClockIcon className="w-5 h-5 text-slate-400" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'certified':
                return 'bg-emerald-100 text-emerald-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            case 'in_progress':
                return 'bg-amber-100 text-amber-800';
            default:
                return 'bg-slate-100 text-slate-800';
        }
    };

    const renderOverviewReport = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                    <div className="text-2xl font-bold text-slate-800">{sessions.length}</div>
                    <div className="text-sm text-slate-600">Total Sessions</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                    <div className="text-2xl font-bold text-emerald-600">{sessions.filter(s => s.status === 'certified').length}</div>
                    <div className="text-sm text-slate-600">Certified</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                    <div className="text-2xl font-bold text-blue-600">{sessions.filter(s => s.status === 'completed').length}</div>
                    <div className="text-sm text-slate-600">Completed</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                    <div className="text-2xl font-bold text-amber-600">{sessions.reduce((sum, s) => sum + s.discrepancies, 0)}</div>
                    <div className="text-sm text-slate-600">Total Discrepancies</div>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-800">Reconciliation Sessions</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Session</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Period</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Transactions</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Discrepancies</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {sessions.map((session) => (
                                <tr key={session.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-slate-900">{session.name}</div>
                                            <div className="text-sm text-slate-500">by {session.user}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                                        {formatDate(session.startDate)} - {formatDate(session.endDate)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(session.status)}
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(session.status)}`}>
                                                {session.status.replace('_', ' ').toUpperCase()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                                        {session.reconciledTransactions}/{session.totalCrimsonTransactions + session.totalBankTransactions}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                                        {formatCurrency(session.totalCrimsonAmount)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            session.discrepancies === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                        }`}>
                                            {session.discrepancies}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => {
                                                setSelectedSession(session.id);
                                                setActiveView('detailed');
                                            }}
                                            className="text-sky-600 hover:text-sky-900 flex items-center gap-1"
                                        >
                                            <EyeIcon className="w-4 h-4" />
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderDetailedReport = () => {
        const session = sessions.find(s => s.id === selectedSession);
        if (!session) return null;

        return (
            <div className="space-y-6">
                {/* Back Button */}
                <button
                    onClick={() => {
                        setSelectedSession(null);
                        setActiveView('overview');
                    }}
                    className="flex items-center gap-2 text-sky-600 hover:text-sky-800 font-medium"
                >
                    ← Back to Overview
                </button>

                {/* Session Header */}
                <div className="bg-white p-6 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">{session.name}</h3>
                            <p className="text-slate-600">
                                {formatDate(session.startDate)} - {formatDate(session.endDate)} • by {session.user}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            {getStatusIcon(session.status)}
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(session.status)}`}>
                                {session.status.replace('_', ' ').toUpperCase()}
                            </span>
                        </div>
                    </div>

                    {/* Accounting Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <div className="text-lg font-bold text-blue-800">{formatCurrency(session.startingBankBalance || 0)}</div>
                            <div className="text-sm text-slate-600">Starting Bank Balance</div>
                        </div>
                        <div className="text-center p-3 bg-emerald-50 rounded-lg">
                            <div className="text-lg font-bold text-emerald-800">{formatCurrency(session.endingBankBalance || 0)}</div>
                            <div className="text-sm text-slate-600">Ending Bank Balance</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                            <div className="text-lg font-bold text-purple-800">{formatCurrency(session.endingCashOnHand || 0)}</div>
                            <div className="text-sm text-slate-600">Ending Cash on Hand</div>
                        </div>
                        <div className="text-center p-3 bg-amber-50 rounded-lg">
                            <div className="text-lg font-bold text-amber-800">{formatCurrency(session.itemsInTransit || 0)}</div>
                            <div className="text-sm text-slate-600">Items in Transit</div>
                        </div>
                        <div className="text-center p-3 bg-rose-50 rounded-lg">
                            <div className="text-lg font-bold text-rose-800">{session.discrepancies}</div>
                            <div className="text-sm text-slate-600">Discrepancies</div>
                        </div>
                    </div>

                    {session.notes && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-800">{session.notes}</p>
                        </div>
                    )}
                </div>

                {/* Tab Navigation */}
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <div className="border-b border-slate-200">
                        <nav className="flex">
                            <button
                                onClick={() => setDetailTab('reconciliation')}
                                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                                    detailTab === 'reconciliation'
                                        ? 'border-sky-500 text-sky-600 bg-sky-50'
                                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                }`}
                            >
                                Bank Reconciliation
                            </button>
                            <button
                                onClick={() => setDetailTab('payment_type')}
                                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                                    detailTab === 'payment_type'
                                        ? 'border-sky-500 text-sky-600 bg-sky-50'
                                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                }`}
                            >
                                By Payment Type
                            </button>
                            <button
                                onClick={() => setDetailTab('line_number')}
                                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                                    detailTab === 'line_number'
                                        ? 'border-sky-500 text-sky-600 bg-sky-50'
                                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                }`}
                            >
                                By FEC Line Number
                            </button>
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {detailTab === 'reconciliation' && renderReconciliationTab(session)}
                        {detailTab === 'payment_type' && renderPaymentTypeTab(session)}
                        {detailTab === 'line_number' && renderLineNumberTab(session)}
                    </div>
                </div>
            </div>
        );
    };

    const renderReconciliationTab = (session: any) => (
        <div className="space-y-6">
            {/* Bank Reconciliation Summary */}
            <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-slate-800 mb-3">Bank Reconciliation Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-slate-600">Starting Bank Balance:</span>
                                <span className="font-medium">{formatCurrency(session.startingBankBalance || 0)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600">Add: Cleared Deposits</span>
                                <span className="font-medium text-emerald-600">
                                    {formatCurrency(session.bankTransactions?.filter((t: any) => t.amount > 0 && t.isReconciled).reduce((sum: number, t: any) => sum + t.amount, 0) || 0)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600">Less: Cleared Checks/Payments</span>
                                <span className="font-medium text-rose-600">
                                    {formatCurrency(Math.abs(session.bankTransactions?.filter((t: any) => t.amount < 0 && t.isReconciled).reduce((sum: number, t: any) => sum + t.amount, 0) || 0))}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600">Less: Bank Fees</span>
                                <span className="font-medium text-rose-600">{formatCurrency(session.bankServiceFees || 0)}</span>
                            </div>
                            <div className="border-t pt-2 flex justify-between font-semibold">
                                <span>Ending Bank Balance:</span>
                                <span>{formatCurrency(session.endingBankBalance || 0)}</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-slate-600">Starting Cash on Hand:</span>
                                <span className="font-medium">{formatCurrency(session.startingCashOnHand || 0)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600">Add: Cleared Receipts</span>
                                <span className="font-medium text-emerald-600">
                                    {formatCurrency(session.crimsonTransactions?.filter((t: any) => t.amount > 0 && t.isReconciled).reduce((sum: number, t: any) => sum + t.amount, 0) || 0)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600">Less: Cleared Disbursements</span>
                                <span className="font-medium text-rose-600">
                                    {formatCurrency(Math.abs(session.crimsonTransactions?.filter((t: any) => t.amount < 0 && t.isReconciled).reduce((sum: number, t: any) => sum + t.amount, 0) || 0))}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600">Less: Items in Transit</span>
                                <span className="font-medium text-amber-600">{formatCurrency(session.itemsInTransit || 0)}</span>
                            </div>
                            <div className="border-t pt-2 flex justify-between font-semibold">
                                <span>Ending Cash on Hand:</span>
                                <span>{formatCurrency(session.endingCashOnHand || 0)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cleared Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Cleared Bank Transactions */}
                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                    <div className="px-4 py-3 bg-emerald-50 border-b border-slate-200">
                        <h5 className="font-semibold text-emerald-800">Cleared Bank Transactions</h5>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase">Description</th>
                                    <th className="px-3 py-2 text-right text-xs font-medium text-slate-500 uppercase">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {session.bankTransactions?.filter((t: any) => t.isReconciled).map((transaction: any) => (
                                    <tr key={transaction.id} className="hover:bg-slate-50">
                                        <td className="px-3 py-2 text-slate-900">{formatDate(transaction.date)}</td>
                                        <td className="px-3 py-2 text-slate-900">{transaction.description}</td>
                                        <td className={`px-3 py-2 text-right font-medium ${transaction.amount >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            {formatCurrency(transaction.amount)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Cleared Crimson Transactions */}
                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                    <div className="px-4 py-3 bg-blue-50 border-b border-slate-200">
                        <h5 className="font-semibold text-blue-800">Cleared Crimson Transactions</h5>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase">Contributor</th>
                                    <th className="px-3 py-2 text-right text-xs font-medium text-slate-500 uppercase">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {session.crimsonTransactions?.filter((t: any) => t.isReconciled).map((transaction: any) => (
                                    <tr key={transaction.id} className="hover:bg-slate-50">
                                        <td className="px-3 py-2 text-slate-900">{formatDate(transaction.date)}</td>
                                        <td className="px-3 py-2 text-slate-900">{transaction.contributor}</td>
                                        <td className={`px-3 py-2 text-right font-medium ${transaction.amount >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            {formatCurrency(transaction.amount)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Uncleared Transactions */}
            {(session.crimsonTransactions?.some((t: any) => !t.isReconciled) || session.bankTransactions?.some((t: any) => !t.isReconciled)) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Uncleared Bank Transactions */}
                    <div className="bg-white border border-amber-200 rounded-lg overflow-hidden">
                        <div className="px-4 py-3 bg-amber-50 border-b border-amber-200">
                            <h5 className="font-semibold text-amber-800">Uncleared Bank Transactions (Items in Transit)</h5>
                        </div>
                        <div className="max-h-48 overflow-y-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase">Description</th>
                                        <th className="px-3 py-2 text-right text-xs font-medium text-slate-500 uppercase">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {session.bankTransactions?.filter((t: any) => !t.isReconciled).map((transaction: any) => (
                                        <tr key={transaction.id} className="hover:bg-amber-50">
                                            <td className="px-3 py-2 text-slate-900">{formatDate(transaction.date)}</td>
                                            <td className="px-3 py-2 text-slate-900">{transaction.description}</td>
                                            <td className={`px-3 py-2 text-right font-medium ${transaction.amount >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                {formatCurrency(transaction.amount)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Uncleared Crimson Transactions */}
                    <div className="bg-white border border-amber-200 rounded-lg overflow-hidden">
                        <div className="px-4 py-3 bg-amber-50 border-b border-amber-200">
                            <h5 className="font-semibold text-amber-800">Uncleared Crimson Transactions</h5>
                        </div>
                        <div className="max-h-48 overflow-y-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase">Contributor</th>
                                        <th className="px-3 py-2 text-right text-xs font-medium text-slate-500 uppercase">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {session.crimsonTransactions?.filter((t: any) => !t.isReconciled).map((transaction: any) => (
                                        <tr key={transaction.id} className="hover:bg-amber-50">
                                            <td className="px-3 py-2 text-slate-900">{formatDate(transaction.date)}</td>
                                            <td className="px-3 py-2 text-slate-900">{transaction.contributor}</td>
                                            <td className={`px-3 py-2 text-right font-medium ${transaction.amount >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                {formatCurrency(transaction.amount)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    const renderPaymentTypeTab = (session: any) => {
        const paymentTypeSummary = session.crimsonTransactions?.reduce((acc: any, transaction: any) => {
            const type = transaction.paymentType;
            if (!acc[type]) {
                acc[type] = { count: 0, total: 0, reconciled: 0, reconciledAmount: 0 };
            }
            acc[type].count++;
            acc[type].total += transaction.amount;
            if (transaction.isReconciled) {
                acc[type].reconciled++;
                acc[type].reconciledAmount += transaction.amount;
            }
            return acc;
        }, {}) || {};

        return (
            <div className="space-y-6">
                {/* Payment Type Summary */}
                <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-slate-800 mb-3">Payment Type Summary</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 uppercase tracking-wider">Payment Type</th>
                                    <th className="px-4 py-3 text-center text-sm font-medium text-slate-500 uppercase tracking-wider">Total Count</th>
                                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 uppercase tracking-wider">Total Amount</th>
                                    <th className="px-4 py-3 text-center text-sm font-medium text-slate-500 uppercase tracking-wider">Reconciled</th>
                                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 uppercase tracking-wider">Reconciled Amount</th>
                                    <th className="px-4 py-3 text-center text-sm font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {Object.entries(paymentTypeSummary).map(([type, data]: [string, any]) => (
                                    <tr key={type} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 text-sm font-medium text-slate-900">
                                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                                                {type === 'CH' ? 'Check' : type === 'CC' ? 'Credit Card' : type === 'CA' ? 'Cash' : type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-center text-slate-900">{data.count}</td>
                                        <td className="px-4 py-3 text-sm text-right font-medium text-slate-900">{formatCurrency(data.total)}</td>
                                        <td className="px-4 py-3 text-sm text-center text-slate-900">{data.reconciled}/{data.count}</td>
                                        <td className="px-4 py-3 text-sm text-right font-medium text-emerald-600">{formatCurrency(data.reconciledAmount)}</td>
                                        <td className="px-4 py-3 text-center">
                                            {data.reconciled === data.count ? (
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
                                                    Complete
                                                </span>
                                            ) : (
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
                                                    Partial
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Detailed Transactions by Payment Type */}
                <div className="space-y-4">
                    {Object.entries(paymentTypeSummary).map(([type, data]: [string, any]) => (
                        <div key={type} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                            <div className="px-4 py-3 bg-blue-50 border-b border-slate-200">
                                <h5 className="font-semibold text-blue-800">
                                    {type === 'CH' ? 'Check' : type === 'CC' ? 'Credit Card' : type === 'CA' ? 'Cash' : type} Transactions
                                    <span className="ml-2 text-sm font-normal">({data.count} transactions, {formatCurrency(data.total)})</span>
                                </h5>
                            </div>
                            <div className="max-h-48 overflow-y-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase">Contributor</th>
                                            <th className="px-3 py-2 text-right text-xs font-medium text-slate-500 uppercase">Amount</th>
                                            <th className="px-3 py-2 text-center text-xs font-medium text-slate-500 uppercase">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {session.crimsonTransactions?.filter((t: any) => t.paymentType === type).map((transaction: any) => (
                                            <tr key={transaction.id} className="hover:bg-slate-50">
                                                <td className="px-3 py-2 text-slate-900">{formatDate(transaction.date)}</td>
                                                <td className="px-3 py-2 text-slate-900">{transaction.contributor}</td>
                                                <td className={`px-3 py-2 text-right font-medium ${transaction.amount >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                    {formatCurrency(transaction.amount)}
                                                </td>
                                                <td className="px-3 py-2 text-center">
                                                    {transaction.isReconciled ? (
                                                        <CheckCircleIcon className="w-4 h-4 text-emerald-600 mx-auto" />
                                                    ) : (
                                                        <ClockIcon className="w-4 h-4 text-amber-600 mx-auto" />
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderLineNumberTab = (session: any) => {
        const lineNumberSummary = session.crimsonTransactions?.reduce((acc: any, transaction: any) => {
            const lineNumber = transaction.lineNumber;
            if (!acc[lineNumber]) {
                acc[lineNumber] = { count: 0, total: 0, reconciled: 0, reconciledAmount: 0 };
            }
            acc[lineNumber].count++;
            acc[lineNumber].total += transaction.amount;
            if (transaction.isReconciled) {
                acc[lineNumber].reconciled++;
                acc[lineNumber].reconciledAmount += transaction.amount;
            }
            return acc;
        }, {}) || {};

        const getLineNumberDescription = (lineNumber: string) => {
            switch (lineNumber) {
                case 'SA11A': return 'Receipts from Individuals';
                case 'SA17': return 'Receipts from Political Committees';
                case 'SB21B': return 'Operating Expenditures';
                case 'SB23': return 'Independent Expenditures';
                case 'SB29': return 'Payroll/Reimbursements';
                default: return 'Other';
            }
        };

        return (
            <div className="space-y-6">
                {/* FEC Line Number Summary */}
                <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-slate-800 mb-3">FEC Line Number Summary</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 uppercase tracking-wider">Line Number</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 uppercase tracking-wider">Description</th>
                                    <th className="px-4 py-3 text-center text-sm font-medium text-slate-500 uppercase tracking-wider">Count</th>
                                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 uppercase tracking-wider">Total Amount</th>
                                    <th className="px-4 py-3 text-center text-sm font-medium text-slate-500 uppercase tracking-wider">Reconciled</th>
                                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 uppercase tracking-wider">Reconciled Amount</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {Object.entries(lineNumberSummary).map(([lineNumber, data]: [string, any]) => (
                                    <tr key={lineNumber} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 text-sm font-medium text-slate-900">
                                            <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">
                                                {lineNumber}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-600">{getLineNumberDescription(lineNumber)}</td>
                                        <td className="px-4 py-3 text-sm text-center text-slate-900">{data.count}</td>
                                        <td className="px-4 py-3 text-sm text-right font-medium text-slate-900">{formatCurrency(data.total)}</td>
                                        <td className="px-4 py-3 text-sm text-center text-slate-900">{data.reconciled}/{data.count}</td>
                                        <td className="px-4 py-3 text-sm text-right font-medium text-emerald-600">{formatCurrency(data.reconciledAmount)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Detailed Transactions by Line Number */}
                <div className="space-y-4">
                    {Object.entries(lineNumberSummary).map(([lineNumber, data]: [string, any]) => (
                        <div key={lineNumber} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                            <div className="px-4 py-3 bg-purple-50 border-b border-slate-200">
                                <h5 className="font-semibold text-purple-800">
                                    {lineNumber} - {getLineNumberDescription(lineNumber)}
                                    <span className="ml-2 text-sm font-normal">({data.count} transactions, {formatCurrency(data.total)})</span>
                                </h5>
                            </div>
                            <div className="max-h-48 overflow-y-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase">Contributor</th>
                                            <th className="px-3 py-2 text-center text-xs font-medium text-slate-500 uppercase">Payment</th>
                                            <th className="px-3 py-2 text-right text-xs font-medium text-slate-500 uppercase">Amount</th>
                                            <th className="px-3 py-2 text-center text-xs font-medium text-slate-500 uppercase">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {session.crimsonTransactions?.filter((t: any) => t.lineNumber === lineNumber).map((transaction: any) => (
                                            <tr key={transaction.id} className="hover:bg-slate-50">
                                                <td className="px-3 py-2 text-slate-900">{formatDate(transaction.date)}</td>
                                                <td className="px-3 py-2 text-slate-900">{transaction.contributor}</td>
                                                <td className="px-3 py-2 text-center">
                                                    <span className="px-1 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">
                                                        {transaction.paymentType}
                                                    </span>
                                                </td>
                                                <td className={`px-3 py-2 text-right font-medium ${transaction.amount >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                    {formatCurrency(transaction.amount)}
                                                </td>
                                                <td className="px-3 py-2 text-center">
                                                    {transaction.isReconciled ? (
                                                        <CheckCircleIcon className="w-4 h-4 text-emerald-600 mx-auto" />
                                                    ) : (
                                                        <ClockIcon className="w-4 h-4 text-amber-600 mx-auto" />
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        {onNavigateBack && (
                            <button
                                onClick={onNavigateBack}
                                className="flex items-center gap-2 text-sky-600 hover:text-sky-800 font-medium transition-colors"
                            >
                                ← Back to Reconciliation
                            </button>
                        )}
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Reconciliation Reports</h2>
                    <p className="text-slate-600 mt-1">View completed reconciliation sessions and generate reports</p>
                </div>
            </div>

            {/* Report Type Selector */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {reportTypes.map((report) => (
                    <button
                        key={report.id}
                        onClick={() => setActiveView(report.id as any)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                            activeView === report.id
                                ? 'border-sky-500 bg-sky-50 text-sky-700'
                                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                        }`}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 rounded-lg ${activeView === report.id ? 'bg-sky-100' : 'bg-slate-100'}`}>
                                {report.icon}
                            </div>
                            <div className="text-left">
                                <div className="font-semibold">{report.title}</div>
                                <div className="text-sm opacity-75">{report.count} items</div>
                            </div>
                        </div>
                        <p className="text-sm text-left">{report.description}</p>
                    </button>
                ))}
            </div>

            {/* Report Content */}
            <div className="bg-slate-50 rounded-lg p-6">
                {activeView === 'overview' && renderOverviewReport()}
                {activeView === 'detailed' && selectedSession && renderDetailedReport()}
                {activeView === 'detailed' && !selectedSession && (
                    <div className="text-center py-8">
                        <DocumentTextIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">Detailed Reconciliation Report</h3>
                        <p className="text-slate-600">Select a session from the overview to view detailed transaction-level reports</p>
                    </div>
                )}
                {activeView === 'discrepancies' && (
                    <div className="text-center py-8">
                        <ExclamationTriangleIcon className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">Discrepancy Analysis</h3>
                        <p className="text-slate-600">Analysis of unmatched transactions and reconciliation issues</p>
                    </div>
                )}
                {activeView === 'export' && (
                    <div className="text-center py-8">
                        <DocumentArrowDownIcon className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">Compliance Export</h3>
                        <p className="text-slate-600">Export reconciliation data in FEC-compliant formats</p>
                    </div>
                )}
            </div>
        </div>
    );
};
