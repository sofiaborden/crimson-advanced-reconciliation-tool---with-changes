import React, { useState, useMemo } from 'react';
import { ClockIcon, UserCircleIcon, CheckCircleIcon, XMarkIcon, EyeIcon, FilterIcon } from './Icons';

export interface AuditEntry {
    id: string;
    timestamp: Date;
    user: string;
    action: 'reconcile' | 'unreconcile' | 'mark_nrit' | 'unmark_nrit' | 'split' | 'import' | 'ai_suggest' | 'bulk_action';
    details: string;
    transactionIds: string[];
    amount?: number;
    confidence?: number;
    metadata?: Record<string, any>;
}

interface AuditTrailProps {
    isOpen: boolean;
    onClose: () => void;
    entries: AuditEntry[];
}

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

const getActionIcon = (action: AuditEntry['action']) => {
    switch (action) {
        case 'reconcile':
            return <CheckCircleIcon className="w-5 h-5 text-emerald-600" />;
        case 'unreconcile':
            return <XMarkIcon className="w-5 h-5 text-rose-600" />;
        case 'mark_nrit':
        case 'unmark_nrit':
            return <EyeIcon className="w-5 h-5 text-indigo-600" />;
        case 'split':
            return <div className="w-5 h-5 bg-orange-600 rounded-full flex items-center justify-center text-white text-xs">S</div>;
        case 'import':
            return <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">I</div>;
        case 'ai_suggest':
            return <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs">AI</div>;
        case 'bulk_action':
            return <div className="w-5 h-5 bg-slate-600 rounded-full flex items-center justify-center text-white text-xs">B</div>;
        default:
            return <ClockIcon className="w-5 h-5 text-slate-400" />;
    }
};

const getActionColor = (action: AuditEntry['action']) => {
    switch (action) {
        case 'reconcile':
            return 'bg-emerald-50 border-emerald-200';
        case 'unreconcile':
            return 'bg-rose-50 border-rose-200';
        case 'mark_nrit':
        case 'unmark_nrit':
            return 'bg-indigo-50 border-indigo-200';
        case 'split':
            return 'bg-orange-50 border-orange-200';
        case 'import':
            return 'bg-blue-50 border-blue-200';
        case 'ai_suggest':
            return 'bg-purple-50 border-purple-200';
        case 'bulk_action':
            return 'bg-slate-50 border-slate-200';
        default:
            return 'bg-slate-50 border-slate-200';
    }
};

export const AuditTrail: React.FC<AuditTrailProps> = ({ isOpen, onClose, entries }) => {
    const [filterAction, setFilterAction] = useState<string>('all');
    const [filterUser, setFilterUser] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredEntries = useMemo(() => {
        return entries.filter(entry => {
            const matchesAction = filterAction === 'all' || entry.action === filterAction;
            const matchesUser = filterUser === 'all' || entry.user === filterUser;
            const matchesSearch = searchTerm === '' || 
                entry.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                entry.transactionIds.some(id => id.toLowerCase().includes(searchTerm.toLowerCase()));
            
            return matchesAction && matchesUser && matchesSearch;
        }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }, [entries, filterAction, filterUser, searchTerm]);

    const uniqueUsers = useMemo(() => {
        return Array.from(new Set(entries.map(entry => entry.user)));
    }, [entries]);

    const uniqueActions = useMemo(() => {
        return Array.from(new Set(entries.map(entry => entry.action)));
    }, [entries]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <ClockIcon className="w-8 h-8" />
                            <div>
                                <h2 className="text-2xl font-bold">Audit Trail</h2>
                                <p className="text-slate-200 mt-1">Complete history of reconciliation activities</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-slate-200 hover:text-white transition-colors p-1"
                            aria-label="Close audit trail"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-slate-50 p-4 border-b border-slate-200">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Search</label>
                            <input
                                type="text"
                                placeholder="Search details or transaction IDs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-sky-500 focus:border-sky-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Action</label>
                            <select
                                value={filterAction}
                                onChange={(e) => setFilterAction(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-sky-500 focus:border-sky-500"
                            >
                                <option value="all">All Actions</option>
                                {uniqueActions.map(action => (
                                    <option key={action} value={action}>
                                        {action.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">User</label>
                            <select
                                value={filterUser}
                                onChange={(e) => setFilterUser(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-sky-500 focus:border-sky-500"
                            >
                                <option value="all">All Users</option>
                                {uniqueUsers.map(user => (
                                    <option key={user} value={user}>{user}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={() => {
                                    setFilterAction('all');
                                    setFilterUser('all');
                                    setSearchTerm('');
                                }}
                                className="w-full px-3 py-2 bg-slate-600 text-white text-sm font-medium rounded-md hover:bg-slate-700 transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 max-h-96 overflow-y-auto">
                    {filteredEntries.length === 0 ? (
                        <div className="text-center py-12">
                            <ClockIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-800 mb-2">No Audit Entries</h3>
                            <p className="text-slate-600">No activities match your current filters</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredEntries.map((entry) => (
                                <div
                                    key={entry.id}
                                    className={`p-4 rounded-lg border-2 ${getActionColor(entry.action)}`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 mt-1">
                                            {getActionIcon(entry.action)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <h4 className="font-semibold text-slate-800">
                                                        {entry.action.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                    </h4>
                                                    {entry.amount && (
                                                        <span className="text-sm font-mono text-slate-600">
                                                            {formatCurrency(entry.amount)}
                                                        </span>
                                                    )}
                                                    {entry.confidence && (
                                                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                                                            {Math.round(entry.confidence * 100)}% confidence
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-sm text-slate-500">
                                                    {entry.timestamp.toLocaleString()}
                                                </div>
                                            </div>
                                            <p className="text-sm text-slate-700 mb-2">{entry.details}</p>
                                            <div className="flex items-center gap-4 text-xs text-slate-500">
                                                <div className="flex items-center gap-1">
                                                    <UserCircleIcon className="w-4 h-4" />
                                                    {entry.user}
                                                </div>
                                                {entry.transactionIds.length > 0 && (
                                                    <div>
                                                        Transactions: {entry.transactionIds.join(', ')}
                                                    </div>
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
                        Showing {filteredEntries.length} of {entries.length} entries
                    </div>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-600 text-white font-medium rounded-lg hover:bg-slate-700 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
