import React, { useState, useMemo } from 'react';
import { CashOnHandData } from '../types';
import { PencilIcon, CheckIcon, XMarkIcon, CalendarIcon, BanknotesIcon } from './Icons';

interface CashOnHandCardProps {
    cashOnHandData: CashOnHandData[];
    selectedAccountCode: string;
    reconciliationPeriod: { startDate: string; endDate: string };
    onUpdateCashOnHand: (accountCode: string, data: Partial<CashOnHandData>) => void;
    onUpdateReconciliationPeriod: (period: { startDate: string; endDate: string }) => void;
}

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

export const CashOnHandCard: React.FC<CashOnHandCardProps> = ({
    cashOnHandData,
    selectedAccountCode,
    reconciliationPeriod,
    onUpdateCashOnHand,
    onUpdateReconciliationPeriod
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editingPeriod, setEditingPeriod] = useState(false);
    const [tempStartingBalance, setTempStartingBalance] = useState('');
    const [tempEndingBalance, setTempEndingBalance] = useState('');
    const [tempPeriod, setTempPeriod] = useState(reconciliationPeriod);

    // Get current account data
    const currentAccountData = useMemo(() => {
        return cashOnHandData.find(data => data.accountCode === selectedAccountCode) || {
            accountCode: selectedAccountCode,
            accountName: `Account ${selectedAccountCode}`,
            startingBalance: 0,
            endingBalance: 0,
            startDate: reconciliationPeriod.startDate,
            endDate: reconciliationPeriod.endDate,
            lastUpdated: new Date().toISOString(),
            source: 'manual_entry' as const
        };
    }, [cashOnHandData, selectedAccountCode, reconciliationPeriod]);

    // Calculate net change
    const netChange = currentAccountData.endingBalance - currentAccountData.startingBalance;

    const handleStartEdit = () => {
        setTempStartingBalance(currentAccountData.startingBalance.toString());
        setTempEndingBalance(currentAccountData.endingBalance.toString());
        setIsEditing(true);
    };

    const handleSaveEdit = () => {
        const startingBalance = parseFloat(tempStartingBalance) || 0;
        const endingBalance = parseFloat(tempEndingBalance) || 0;
        
        onUpdateCashOnHand(selectedAccountCode, {
            startingBalance,
            endingBalance,
            lastUpdated: new Date().toISOString(),
            source: 'manual_entry'
        });
        
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setTempStartingBalance('');
        setTempEndingBalance('');
    };

    const handleStartEditPeriod = () => {
        setTempPeriod(reconciliationPeriod);
        setEditingPeriod(true);
    };

    const handleSavePeriod = () => {
        onUpdateReconciliationPeriod(tempPeriod);
        setEditingPeriod(false);
    };

    const handleCancelEditPeriod = () => {
        setEditingPeriod(false);
        setTempPeriod(reconciliationPeriod);
    };

    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-lg p-4 border border-blue-200/50">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <BanknotesIcon className="w-5 h-5 text-blue-600" />
                    <div>
                        <h3 className="text-base font-bold text-slate-800">Cash on Hand</h3>
                        <p className="text-xs text-slate-600">{currentAccountData.accountName}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {!editingPeriod ? (
                        <button
                            onClick={handleStartEditPeriod}
                            className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:bg-blue-100 rounded transition-colors"
                        >
                            <CalendarIcon className="w-3 h-3" />
                            Period
                        </button>
                    ) : (
                        <div className="flex items-center gap-1">
                            <button
                                onClick={handleSavePeriod}
                                className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                            >
                                <CheckIcon className="w-3 h-3" />
                            </button>
                            <button
                                onClick={handleCancelEditPeriod}
                                className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                            >
                                <XMarkIcon className="w-3 h-3" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Reconciliation Period - Inline */}
            <div className="mb-3 flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">Period:</span>
                {!editingPeriod ? (
                    <span className="text-slate-600">
                        {new Date(reconciliationPeriod.startDate).toLocaleDateString()} - {new Date(reconciliationPeriod.endDate).toLocaleDateString()}
                    </span>
                ) : (
                    <div className="flex items-center gap-2">
                        <input
                            type="date"
                            value={tempPeriod.startDate}
                            onChange={(e) => setTempPeriod(prev => ({ ...prev, startDate: e.target.value }))}
                            className="px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <span className="text-xs text-slate-500">to</span>
                        <input
                            type="date"
                            value={tempPeriod.endDate}
                            onChange={(e) => setTempPeriod(prev => ({ ...prev, endDate: e.target.value }))}
                            className="px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                )}
            </div>

            {/* Cash Balances - Horizontal Layout */}
            <div className="bg-white/60 rounded-lg border border-blue-200/30 p-3 mb-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    {/* Starting Balance */}
                    <div className="flex items-center justify-between md:flex-col md:text-center">
                        <div className="md:mb-1">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Starting</span>
                            <span className="text-xs text-slate-400 ml-1 md:ml-0 md:block">
                                {new Date(reconciliationPeriod.startDate).toLocaleDateString()}
                            </span>
                        </div>
                        {!isEditing ? (
                            <span className="text-lg font-bold text-slate-800">
                                {formatCurrency(currentAccountData.startingBalance)}
                            </span>
                        ) : (
                            <input
                                type="number"
                                step="0.01"
                                value={tempStartingBalance}
                                onChange={(e) => setTempStartingBalance(e.target.value)}
                                className="w-24 px-2 py-1 text-sm font-bold text-center border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="0.00"
                            />
                        )}
                    </div>

                    {/* Ending Balance */}
                    <div className="flex items-center justify-between md:flex-col md:text-center">
                        <div className="md:mb-1">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ending</span>
                            <span className="text-xs text-slate-400 ml-1 md:ml-0 md:block">
                                {new Date(reconciliationPeriod.endDate).toLocaleDateString()}
                            </span>
                        </div>
                        {!isEditing ? (
                            <span className="text-lg font-bold text-slate-800">
                                {formatCurrency(currentAccountData.endingBalance)}
                            </span>
                        ) : (
                            <input
                                type="number"
                                step="0.01"
                                value={tempEndingBalance}
                                onChange={(e) => setTempEndingBalance(e.target.value)}
                                className="w-24 px-2 py-1 text-sm font-bold text-center border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="0.00"
                            />
                        )}
                    </div>

                    {/* Net Change */}
                    <div className="flex items-center justify-between md:flex-col md:text-center">
                        <div className="md:mb-1">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Net Change</span>
                            <span className="text-xs text-slate-400 ml-1 md:ml-0 md:block">
                                {currentAccountData.source === 'manual_entry' ? 'Manual' : 'Previous'}
                            </span>
                        </div>
                        <span className={`text-lg font-bold ${
                            netChange > 0 ? 'text-emerald-600' : netChange < 0 ? 'text-rose-600' : 'text-slate-600'
                        }`}>
                            {formatCurrency(netChange)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Edit Controls */}
            <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">
                    Updated: {new Date(currentAccountData.lastUpdated).toLocaleTimeString()}
                </span>
                <div className="flex items-center gap-1">
                    {!isEditing ? (
                        <button
                            onClick={handleStartEdit}
                            className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:bg-blue-100 rounded transition-colors"
                        >
                            <PencilIcon className="w-3 h-3" />
                            Edit
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={handleSaveEdit}
                                className="flex items-center gap-1 px-2 py-1 text-xs text-white bg-green-600 hover:bg-green-700 rounded transition-colors"
                            >
                                <CheckIcon className="w-3 h-3" />
                                Save
                            </button>
                            <button
                                onClick={handleCancelEdit}
                                className="flex items-center gap-1 px-2 py-1 text-xs text-white bg-red-600 hover:bg-red-700 rounded transition-colors"
                            >
                                <XMarkIcon className="w-3 h-3" />
                                Cancel
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
