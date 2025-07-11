import React, { useState, useMemo } from 'react';
import { 
    ClockIcon, 
    CheckCircleIcon, 
    ShieldCheckIcon, 
    ArchiveBoxIcon,
    PlayIcon,
    PauseIcon,
    DocumentTextIcon,
    CalendarIcon,
    UserIcon,
    CurrencyDollarIcon,
    ExclamationTriangleIcon,
    EyeIcon,
    PencilIcon
} from './Icons';
import { ReconciliationSession } from '../types';

interface ReconciliationHistoryProps {
    sessions: ReconciliationSession[];
    onStartNewSession: () => void;
    onResumeSession: (sessionId: string) => void;
    onViewSession: (sessionId: string) => void;
    onCertifySession: (sessionId: string) => void;
    onArchiveSession: (sessionId: string) => void;
    onNavigateBack?: () => void;
}

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
});

export const ReconciliationHistory: React.FC<ReconciliationHistoryProps> = ({
    sessions,
    onStartNewSession,
    onResumeSession,
    onViewSession,
    onCertifySession,
    onArchiveSession,
    onNavigateBack
}) => {
    const [filterStatus, setFilterStatus] = useState<'all' | 'in_progress' | 'completed' | 'certified' | 'archived'>('all');
    const [sortBy, setSortBy] = useState<'date' | 'name' | 'status'>('date');

    const filteredAndSortedSessions = useMemo(() => {
        let filtered = sessions;
        
        if (filterStatus !== 'all') {
            filtered = sessions.filter(session => session.status === filterStatus);
        }

        return filtered.sort((a, b) => {
            switch (sortBy) {
                case 'date':
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'status':
                    return a.status.localeCompare(b.status);
                default:
                    return 0;
            }
        });
    }, [sessions, filterStatus, sortBy]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'in_progress':
                return <PlayIcon className="w-5 h-5 text-blue-600" />;
            case 'completed':
                return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
            case 'certified':
                return <ShieldCheckIcon className="w-5 h-5 text-emerald-600" />;
            case 'archived':
                return <ArchiveBoxIcon className="w-5 h-5 text-slate-500" />;
            default:
                return <ClockIcon className="w-5 h-5 text-slate-400" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'in_progress':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'certified':
                return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'archived':
                return 'bg-slate-100 text-slate-600 border-slate-200';
            default:
                return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    const getReconciliationProgress = (session: ReconciliationSession) => {
        const totalTransactions = session.summary.totalCrimsonTransactions + session.summary.totalBankTransactions;
        const reconciledTransactions = session.summary.reconciledCrimsonTransactions + session.summary.reconciledBankTransactions;
        return totalTransactions > 0 ? (reconciledTransactions / totalTransactions) * 100 : 0;
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
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
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                        <ClockIcon className="w-8 h-8 text-blue-600" />
                        Reconciliation History
                    </h2>
                    <p className="text-slate-600 mt-1">
                        Manage and review past reconciliation sessions
                    </p>
                </div>
                <button
                    onClick={onStartNewSession}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                >
                    <PlayIcon className="w-5 h-5" />
                    Start New Session
                </button>
            </div>

            {/* Filters and Sorting */}
            <div className="bg-slate-50 p-4 rounded-lg mb-6">
                <div className="flex flex-wrap items-center gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as any)}
                            className="p-2 border border-slate-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Sessions</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="certified">Certified</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Sort By</label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="p-2 border border-slate-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="date">Date Created</option>
                            <option value="name">Session Name</option>
                            <option value="status">Status</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Sessions List */}
            <div className="space-y-4">
                {filteredAndSortedSessions.length === 0 ? (
                    <div className="text-center py-12">
                        <ClockIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-600 mb-2">No reconciliation sessions found</h3>
                        <p className="text-slate-500 mb-4">
                            {filterStatus === 'all' 
                                ? 'Start your first reconciliation session to begin tracking your progress.'
                                : `No sessions found with status "${filterStatus}".`
                            }
                        </p>
                        <button
                            onClick={onStartNewSession}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Start New Session
                        </button>
                    </div>
                ) : (
                    filteredAndSortedSessions.map((session) => (
                        <div key={session.id} className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        {getStatusIcon(session.status)}
                                        <h3 className="text-lg font-semibold text-slate-800">{session.name}</h3>
                                        <span className={`px-2 py-1 text-xs font-medium rounded border ${getStatusColor(session.status)}`}>
                                            {session.status.replace('_', ' ').toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                                        <span className="flex items-center gap-1">
                                            <CalendarIcon className="w-4 h-4" />
                                            {formatDate(session.period.start)} - {formatDate(session.period.end)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <UserIcon className="w-4 h-4" />
                                            {session.createdBy}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <ClockIcon className="w-4 h-4" />
                                            Created {formatDate(session.createdAt)}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    {session.status === 'in_progress' && (
                                        <button
                                            onClick={() => onResumeSession(session.id)}
                                            className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                                        >
                                            Resume
                                        </button>
                                    )}
                                    {session.status === 'completed' && (
                                        <button
                                            onClick={() => onCertifySession(session.id)}
                                            className="px-3 py-1.5 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700 transition-colors"
                                        >
                                            Certify
                                        </button>
                                    )}
                                    <button
                                        onClick={() => onViewSession(session.id)}
                                        className="px-3 py-1.5 bg-slate-600 text-white rounded text-sm hover:bg-slate-700 transition-colors flex items-center gap-1"
                                    >
                                        <EyeIcon className="w-4 h-4" />
                                        View
                                    </button>
                                </div>
                            </div>

                            {/* Session Summary */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                <div className="bg-blue-50 p-3 rounded">
                                    <div className="text-xs font-medium text-blue-600 uppercase tracking-wider">Progress</div>
                                    <div className="text-lg font-bold text-blue-800">
                                        {getReconciliationProgress(session).toFixed(1)}%
                                    </div>
                                </div>
                                <div className="bg-green-50 p-3 rounded">
                                    <div className="text-xs font-medium text-green-600 uppercase tracking-wider">Total Amount</div>
                                    <div className="text-lg font-bold text-green-800">
                                        {formatCurrency(session.summary.totalCrimsonAmount + session.summary.totalBankAmount)}
                                    </div>
                                </div>
                                <div className="bg-purple-50 p-3 rounded">
                                    <div className="text-xs font-medium text-purple-600 uppercase tracking-wider">Transactions</div>
                                    <div className="text-lg font-bold text-purple-800">
                                        {session.summary.totalCrimsonTransactions + session.summary.totalBankTransactions}
                                    </div>
                                </div>
                                <div className={`p-3 rounded ${session.summary.discrepancyAmount !== 0 ? 'bg-red-50' : 'bg-emerald-50'}`}>
                                    <div className={`text-xs font-medium uppercase tracking-wider ${session.summary.discrepancyAmount !== 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                                        Discrepancy
                                    </div>
                                    <div className={`text-lg font-bold ${session.summary.discrepancyAmount !== 0 ? 'text-red-800' : 'text-emerald-800'}`}>
                                        {formatCurrency(Math.abs(session.summary.discrepancyAmount))}
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-4">
                                <div className="flex justify-between text-sm text-slate-600 mb-1">
                                    <span>Reconciliation Progress</span>
                                    <span>{getReconciliationProgress(session).toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2">
                                    <div 
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${getReconciliationProgress(session)}%` }}
                                    />
                                </div>
                            </div>

                            {/* Discrepancies Alert */}
                            {session.summary.unresolvedDiscrepancies > 0 && (
                                <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
                                    <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />
                                    <span className="text-yellow-800">
                                        {session.summary.unresolvedDiscrepancies} unresolved discrepancies require attention
                                    </span>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
