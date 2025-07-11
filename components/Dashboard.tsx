import React, { useMemo } from 'react';
import { CrimsonTransaction, BankTransaction, ReconciliationStats, MatchedPair, CashOnHandData } from '../types';
import { ChartBarIcon, ClockIcon, CheckCircleIcon, ExclamationTriangleIcon, CurrencyDollarIcon, TrendingUpIcon, ArchiveBoxIcon, SparklesIcon } from './Icons';
import { CashOnHandCard } from './CashOnHandCard';

interface DashboardProps {
    crimsonTransactions: CrimsonTransaction[];
    bankTransactions: BankTransaction[];
    aiSuggestions: MatchedPair[];
    cashOnHandData: CashOnHandData[];
    selectedAccountCode: string;
    reconciliationPeriod: { startDate: string; endDate: string };
    onUpdateCashOnHand: (accountCode: string, data: Partial<CashOnHandData>) => void;
    onUpdateReconciliationPeriod: (period: { startDate: string; endDate: string }) => void;
}

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
const formatPercentage = (value: number) => `${Math.round(value)}%`;

const StatCard: React.FC<{
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    color: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'indigo';
    trend?: { value: number; isPositive: boolean };
}> = ({ title, value, subtitle, icon, color, trend }) => {
    const colorClasses = {
        blue: 'bg-blue-50 border-blue-200 text-blue-700',
        green: 'bg-emerald-50 border-emerald-200 text-emerald-700',
        yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
        red: 'bg-rose-50 border-rose-200 text-rose-700',
        purple: 'bg-purple-50 border-purple-200 text-purple-700',
        indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
    };

    const iconColorClasses = {
        blue: 'text-blue-600',
        green: 'text-emerald-600',
        yellow: 'text-yellow-600',
        red: 'text-rose-600',
        purple: 'text-purple-600',
        indigo: 'text-indigo-600',
    };

    return (
        <div className={`p-2 rounded-lg border ${colorClasses[color]} transition-all hover:shadow-md`}>
            <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                        <div className={`p-0.5 rounded bg-white ${iconColorClasses[color]}`}>
                            {React.cloneElement(icon as React.ReactElement, { className: 'w-3.5 h-3.5' })}
                        </div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider opacity-75 truncate">{title}</h3>
                    </div>
                    <p className="text-lg font-bold mb-0.5">{value}</p>
                    {subtitle && <p className="text-xs opacity-75 truncate">{subtitle}</p>}
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-medium ${trend.isPositive ? 'text-emerald-600' : 'text-rose-600'} ml-2`}>
                        <TrendingUpIcon className={`w-3 h-3 ${trend.isPositive ? '' : 'rotate-180'}`} />
                        {Math.abs(trend.value)}%
                    </div>
                )}
            </div>
        </div>
    );
};

const ProgressBar: React.FC<{ progress: number; color?: string }> = ({ progress, color = 'bg-emerald-500' }) => (
    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
        <div
            className={`h-full ${color} transition-all duration-500 ease-out rounded-full`}
            style={{ width: `${Math.min(progress, 100)}%` }}
        />
    </div>
);

export const Dashboard: React.FC<DashboardProps> = ({
    crimsonTransactions,
    bankTransactions,
    aiSuggestions,
    cashOnHandData,
    selectedAccountCode,
    reconciliationPeriod,
    onUpdateCashOnHand,
    onUpdateReconciliationPeriod
}) => {
    const stats: ReconciliationStats = useMemo(() => {
        const reconciledCrimson = crimsonTransactions.filter(t => t.isReconciled);
        const reconciledBank = bankTransactions.filter(t => t.isReconciled);
        const unreconciledCrimson = crimsonTransactions.filter(t => !t.isReconciled);
        const unreconciledBank = bankTransactions.filter(t => !t.isReconciled);
        const nritTransactions = bankTransactions.filter(t => t.isNrit);

        const totalCrimsonAmount = crimsonTransactions.reduce((sum, t) => sum + t.amount, 0);
        const totalBankAmount = bankTransactions.reduce((sum, t) => sum + t.amount, 0);
        const unreconciledCrimsonAmount = unreconciledCrimson.reduce((sum, t) => sum + t.amount, 0);
        const unreconciledBankAmount = unreconciledBank.reduce((sum, t) => sum + t.amount, 0);

        const reconciliationProgress = crimsonTransactions.length > 0 
            ? (reconciledCrimson.length / crimsonTransactions.length) * 100 
            : 0;

        return {
            totalCrimsonTransactions: crimsonTransactions.length,
            totalBankTransactions: bankTransactions.length,
            reconciledCrimsonTransactions: reconciledCrimson.length,
            reconciledBankTransactions: reconciledBank.length,
            unreconciledCrimsonAmount,
            unreconciledBankAmount,
            totalCrimsonAmount,
            totalBankAmount,
            reconciliationProgress,
            aiSuggestionsCount: aiSuggestions.length,
            nritTransactionsCount: nritTransactions.length,
        };
    }, [crimsonTransactions, bankTransactions, aiSuggestions]);

    const discrepancy = stats.unreconciledCrimsonAmount - stats.unreconciledBankAmount;
    const hasDiscrepancy = Math.abs(discrepancy) > 0.01;

    return (
        <div className="bg-white rounded-lg shadow-lg p-3 mb-3 border border-slate-200/50">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <ChartBarIcon className="w-5 h-5 text-sky-600" />
                    Dashboard
                </h2>
                <div className="text-xs text-slate-500">
                    {new Date().toLocaleTimeString()}
                </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
                <StatCard
                    title="Reconciliation Progress"
                    value={formatPercentage(stats.reconciliationProgress)}
                    subtitle={`${stats.reconciledCrimsonTransactions} of ${stats.totalCrimsonTransactions} transactions`}
                    icon={<CheckCircleIcon className="w-6 h-6" />}
                    color="green"
                />
                
                <StatCard
                    title="Unreconciled Amount"
                    value={formatCurrency(Math.abs(discrepancy))}
                    subtitle={hasDiscrepancy ? "Discrepancy detected" : "Amounts match"}
                    icon={<ExclamationTriangleIcon className="w-6 h-6" />}
                    color={hasDiscrepancy ? "red" : "green"}
                />
                
                <StatCard
                    title="AI Suggestions"
                    value={stats.aiSuggestionsCount}
                    subtitle="Potential matches found"
                    icon={<SparklesIcon className="w-6 h-6" />}
                    color="purple"
                />
                
                <StatCard
                    title="NRIT Transactions"
                    value={stats.nritTransactionsCount}
                    subtitle="Non-reportable items"
                    icon={<ArchiveBoxIcon className="w-6 h-6" />}
                    color="indigo"
                />
            </div>

            {/* Compact Progress & Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                        <ClockIcon className="w-3.5 h-3.5" />
                        Progress
                    </h3>
                    <div className="space-y-2">
                        <div>
                            <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                                <span>Overall</span>
                                <span>{formatPercentage(stats.reconciliationProgress)}</span>
                            </div>
                            <ProgressBar progress={stats.reconciliationProgress} />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                                    <span>Crimson</span>
                                    <span>{stats.reconciledCrimsonTransactions}/{stats.totalCrimsonTransactions}</span>
                                </div>
                                <ProgressBar
                                    progress={(stats.reconciledCrimsonTransactions / stats.totalCrimsonTransactions) * 100}
                                    color="bg-sky-500"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                                    <span>Bank</span>
                                    <span>{stats.reconciledBankTransactions}/{stats.totalBankTransactions}</span>
                                </div>
                                <ProgressBar
                                    progress={(stats.reconciledBankTransactions / stats.totalBankTransactions) * 100}
                                    color="bg-indigo-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                        <CurrencyDollarIcon className="w-3.5 h-3.5" />
                        Summary
                    </h3>
                    <div className="space-y-1">
                        <div className="flex justify-between items-center p-2 bg-sky-50 rounded text-xs">
                            <span className="font-medium text-slate-600">Crimson</span>
                            <span className="font-bold text-sky-700">{formatCurrency(stats.totalCrimsonAmount)}</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-indigo-50 rounded text-xs">
                            <span className="font-medium text-slate-600">Bank</span>
                            <span className="font-bold text-indigo-700">{formatCurrency(stats.totalBankAmount)}</span>
                        </div>
                        <div className={`flex justify-between items-center p-2 rounded text-xs ${hasDiscrepancy ? 'bg-rose-50' : 'bg-emerald-50'}`}>
                            <span className="font-medium text-slate-600">Difference</span>
                            <span className={`font-bold ${hasDiscrepancy ? 'text-rose-700' : 'text-emerald-700'}`}>
                                {formatCurrency(discrepancy)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions - Only show for AI suggestions */}
            {stats.aiSuggestionsCount > 0 && (
                <div className="border-t border-slate-200 pt-3">
                    <div className="flex flex-wrap gap-2">
                        <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 border border-purple-200 rounded-lg text-xs">
                            <SparklesIcon className="w-4 h-4 text-purple-600" />
                            <span className="font-medium text-purple-800">
                                {stats.aiSuggestionsCount} AI suggestions ready
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Wrapper component to include both Dashboard and CashOnHandCard
export const DashboardWithCashOnHand: React.FC<DashboardProps> = (props) => {
    return (
        <div className="space-y-4">
            <Dashboard {...props} />
            <CashOnHandCard
                cashOnHandData={props.cashOnHandData}
                selectedAccountCode={props.selectedAccountCode}
                reconciliationPeriod={props.reconciliationPeriod}
                onUpdateCashOnHand={props.onUpdateCashOnHand}
                onUpdateReconciliationPeriod={props.onUpdateReconciliationPeriod}
            />
        </div>
    );
};
