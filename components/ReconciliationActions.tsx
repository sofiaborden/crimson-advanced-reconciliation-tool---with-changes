import React from 'react';

interface ReconciliationActionsProps {
    crimsonSelectedTotal: number;
    bankSelectedTotal: number;
    crimsonUnreconciledTotal: number;
    bankUnreconciledTotal: number;
    onReconcile: () => void;
}

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

export const ReconciliationActions: React.FC<ReconciliationActionsProps> = ({
    crimsonSelectedTotal,
    bankSelectedTotal,
    crimsonUnreconciledTotal,
    bankUnreconciledTotal,
    onReconcile,
}) => {
    const difference = crimsonSelectedTotal - bankSelectedTotal;
    const canReconcile = difference === 0 && crimsonSelectedTotal !== 0;

    const getDifferenceColor = () => {
        if (canReconcile) return 'text-emerald-500';
        if (crimsonSelectedTotal !== 0 || bankSelectedTotal !== 0) return 'text-rose-500';
        return 'text-slate-500';
    }

    const Stat: React.FC<{label: string; value: string; unreconciled?: string; className?: string}> = ({label, value, unreconciled, className}) => (
        <div className={`flex flex-col text-center p-4 rounded-lg ${className}`}>
             <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
             <span className="text-2xl font-bold mt-1">{value}</span>
             {unreconciled && <span className="text-xs text-rose-600 font-medium mt-1">({unreconciled} Unreconciled)</span>}
        </div>
    );


    return (
        <div className="bg-gradient-to-r from-white to-slate-50 rounded-xl shadow-lg p-6 border border-slate-200/80">
            <div className="grid grid-cols-1 md:grid-cols-5 items-center gap-6">

                <Stat
                    label="Crimson Selected"
                    value={formatCurrency(crimsonSelectedTotal)}
                    unreconciled={formatCurrency(crimsonUnreconciledTotal)}
                    className="text-sky-700 bg-sky-50/50 border border-sky-200/50 rounded-lg"
                />

                <div className="flex justify-center items-center">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-0.5 bg-slate-300"></div>
                        <span className="text-slate-400 text-sm font-medium">vs</span>
                        <div className="w-8 h-0.5 bg-slate-300"></div>
                    </div>
                </div>

                <Stat
                    label="Bank Selected"
                    value={formatCurrency(bankSelectedTotal)}
                    unreconciled={formatCurrency(bankUnreconciledTotal)}
                    className="text-indigo-700 bg-indigo-50/50 border border-indigo-200/50 rounded-lg"
                />

                <div className={`flex flex-col text-center p-4 rounded-lg border-2 ${
                    canReconcile
                        ? 'bg-emerald-50 border-emerald-200'
                        : (crimsonSelectedTotal !== 0 || bankSelectedTotal !== 0)
                            ? 'bg-rose-50 border-rose-200'
                            : 'bg-slate-50 border-slate-200'
                }`}>
                     <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">DIFFERENCE</span>
                    <span className={`text-2xl font-bold mt-1 ${getDifferenceColor()}`}>
                        {formatCurrency(difference)}
                    </span>
                    {canReconcile && (
                        <span className="text-xs text-emerald-600 font-medium mt-1">Ready to reconcile!</span>
                    )}
                </div>

                <button
                    onClick={onReconcile}
                    disabled={!canReconcile}
                    className={`w-full px-6 py-4 font-bold text-lg rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        canReconcile
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 transform hover:scale-105'
                            : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    }`}
                    aria-label={canReconcile ? 'Reconcile selected transactions' : 'Cannot reconcile - amounts do not match'}
                >
                    {canReconcile ? '✓ Reconcile' : 'Reconcile'}
                </button>
            </div>
        </div>
    );
};