import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from './Modal';
import { BankTransaction } from '../types';
import { PlusIcon, XCircleIcon } from './Icons';

interface SplitTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: BankTransaction | null;
    onConfirmSplit: (originalId: string, newTransactions: Omit<BankTransaction, 'id' | 'isReconciled'>[]) => void;
}

const SPLIT_ITEM_TYPES = ['Bank Amount', 'Gross Amount', 'Chargebacks/Refunds', 'Fees'] as const;
type SplitItemType = typeof SPLIT_ITEM_TYPES[number];

type SplitTab = 'byItem' | 'byDate';
type ItemSplit = { id: number, amount: number, itemType: SplitItemType };
type DateSplit = { id: number, amount: number, date: string };

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
const todayISO = () => new Date().toISOString().split('T')[0];

export const SplitTransactionModal: React.FC<SplitTransactionModalProps> = ({ isOpen, onClose, transaction, onConfirmSplit }) => {
    const [activeTab, setActiveTab] = useState<SplitTab>('byItem');
    const [itemSplits, setItemSplits] = useState<ItemSplit[]>([]);
    const [dateSplits, setDateSplits] = useState<DateSplit[]>([]);

    useEffect(() => {
        if (transaction) {
            // Reset state when a new transaction is passed in
            setItemSplits([{ id: 1, amount: transaction.amount, itemType: 'Bank Amount' }]);
            setDateSplits([{ id: 1, amount: transaction.amount, date: todayISO() }]);
            setActiveTab('byItem');
        }
    }, [transaction]);

    const totalItemSplitAmount = useMemo(() => itemSplits.reduce((sum, s) => sum + s.amount, 0), [itemSplits]);
    const totalDateSplitAmount = useMemo(() => dateSplits.reduce((sum, s) => sum + s.amount, 0), [dateSplits]);

    const remainingItemAmount = useMemo(() => (transaction?.amount ?? 0) - totalItemSplitAmount, [transaction, totalItemSplitAmount]);
    const remainingDateAmount = useMemo(() => (transaction?.amount ?? 0) - totalDateSplitAmount, [transaction, totalDateSplitAmount]);

    const isItemSplitValid = Math.abs(remainingItemAmount) < 0.001; // Floating point comparison
    const isDateSplitValid = Math.abs(remainingDateAmount) < 0.001;

    const handleAddItemSplit = () => {
        setItemSplits(prev => [...prev, { id: Date.now(), amount: 0, itemType: 'Gross Amount' }]);
    };
    const handleAddDateSplit = () => {
        setDateSplits(prev => [...prev, { id: Date.now(), amount: 0, date: todayISO() }]);
    };
    
    const handleRemoveItemSplit = (id: number) => {
        setItemSplits(prev => prev.filter(s => s.id !== id));
    };
    const handleRemoveDateSplit = (id: number) => {
        setDateSplits(prev => prev.filter(s => s.id !== id));
    };
    
    const handleItemSplitChange = (id: number, field: keyof Omit<ItemSplit, 'id'>, value: string | number) => {
        if (field === 'amount') {
            // Handle amount input to prevent leading zeros and parse correctly
            const numValue = value === '' ? 0 : parseFloat(value as string);
            setItemSplits(prev => prev.map(s => s.id === id ? { ...s, [field]: isNaN(numValue) ? 0 : numValue } : s));
        } else {
            setItemSplits(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
        }
    };
    const handleDateSplitChange = (id: number, field: keyof Omit<DateSplit, 'id'>, value: string | number) => {
        if (field === 'amount') {
            // Handle amount input to prevent leading zeros and parse correctly
            const numValue = value === '' ? 0 : parseFloat(value as string);
            setDateSplits(prev => prev.map(s => s.id === id ? { ...s, [field]: isNaN(numValue) ? 0 : numValue } : s));
        } else {
            setDateSplits(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
        }
    };
    
    const handleSave = () => {
        if (!transaction) return;
        
        if (activeTab === 'byItem' && isItemSplitValid) {
            const newTransactions = itemSplits.map(s => ({
                date: transaction.date,
                description: `SPLIT from: ${transaction.description} - ${s.itemType}`,
                amount: s.amount,
            }));
            onConfirmSplit(transaction.id, newTransactions);
        } else if (activeTab === 'byDate' && isDateSplitValid) {
            const newTransactions = dateSplits.map(s => ({
                date: s.date,
                description: `SPLIT from: ${transaction.description}`,
                amount: s.amount,
            }));
             onConfirmSplit(transaction.id, newTransactions);
        }
    };


    if (!transaction) return null;

    const renderHeader = () => (
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 mb-6">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Original Transaction</h3>
            <div className="flex justify-between items-center mt-2">
                <div>
                    <p className="font-semibold text-slate-800">{transaction.description}</p>
                    <p className="text-sm text-slate-500">{transaction.date}</p>
                </div>
                <p className={`text-2xl font-bold font-mono ${transaction.amount >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{formatCurrency(transaction.amount)}</p>
            </div>
        </div>
    );
    
    const renderFooter = (remainingAmount: number, isValid: boolean) => (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
            <div>
                 <span className="text-sm font-semibold text-slate-500">Remaining to Allocate:</span>
                <span className={`ml-2 text-sm font-bold font-mono ${Math.abs(remainingAmount) < 0.001 ? 'text-emerald-600' : 'text-rose-600'}`}>{formatCurrency(remainingAmount)}</span>
            </div>
             <button
                onClick={handleSave}
                disabled={!isValid}
                className="px-6 py-2 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all"
            >
                Save Split
            </button>
        </div>
    );

    return (
        <>
            <style>{`
                input[type="date"]::-webkit-calendar-picker-indicator {
                    background: transparent;
                    bottom: 0;
                    color: transparent;
                    cursor: pointer;
                    height: auto;
                    left: 0;
                    position: absolute;
                    right: 0;
                    top: 0;
                    width: auto;
                }
                input[type="date"]::-webkit-inner-spin-button,
                input[type="date"]::-webkit-outer-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
                input[type="date"] {
                    -moz-appearance: textfield;
                }
            `}</style>
            <Modal isOpen={isOpen} onClose={onClose} title="Split Transaction">
            {renderHeader()}
            <div className="border-b border-slate-200">
                <div className="flex -mb-px">
                    <button onClick={() => setActiveTab('byItem')} className={`px-4 py-2 text-sm font-semibold border-b-2 ${activeTab === 'byItem' ? 'border-sky-500 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Split by Item</button>
                    <button onClick={() => setActiveTab('byDate')} className={`px-4 py-2 text-sm font-semibold border-b-2 ${activeTab === 'byDate' ? 'border-sky-500 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Split by Date</button>
                </div>
            </div>
            
            <div className="pt-6">
                {activeTab === 'byItem' && (
                    <div className="space-y-3">
                        {itemSplits.map((split) => (
                             <div key={split.id} className="grid grid-cols-[1fr_1fr_auto] gap-3 items-center">
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    value={split.amount === 0 ? '' : split.amount}
                                    onChange={(e) => handleItemSplitChange(split.id, 'amount', e.target.value)}
                                    className="w-full p-2 border border-slate-300 rounded-md shadow-sm text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                    step="0.01"
                                    min="0"
                                />
                                <select
                                    value={split.itemType}
                                    onChange={(e) => handleItemSplitChange(split.id, 'itemType', e.target.value)}
                                    className="w-full p-2 border border-slate-300 rounded-md shadow-sm text-sm bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                >
                                  {SPLIT_ITEM_TYPES.map(type => (
                                      <option key={type} value={type}>{type}</option>
                                  ))}
                                </select>
                                 <button onClick={() => handleRemoveItemSplit(split.id)} disabled={itemSplits.length <= 1} className="text-slate-400 hover:text-rose-600 disabled:opacity-50 disabled:cursor-not-allowed">
                                    <XCircleIcon />
                                </button>
                            </div>
                        ))}
                         <button onClick={handleAddItemSplit} className="flex items-center gap-1 text-sm text-sky-600 font-semibold hover:text-sky-800 mt-2">
                            <PlusIcon className="w-4 h-4" /> Add Line
                        </button>
                        {renderFooter(remainingItemAmount, isItemSplitValid)}
                    </div>
                )}
                 {activeTab === 'byDate' && (
                     <div className="space-y-3">
                        {dateSplits.map((split) => (
                             <div key={split.id} className="grid grid-cols-[1fr_1fr_auto] gap-3 items-center">
                                 <input
                                    type="number"
                                    placeholder="0.00"
                                    value={split.amount === 0 ? '' : split.amount}
                                    onChange={(e) => handleDateSplitChange(split.id, 'amount', e.target.value)}
                                    className="w-full p-2 border border-slate-300 rounded-md shadow-sm text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                    step="0.01"
                                    min="0"
                                />
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={split.date}
                                        onChange={(e) => handleDateSplitChange(split.id, 'date', e.target.value)}
                                        className="w-full p-2 border border-slate-300 rounded-md shadow-sm text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white"
                                        style={{
                                            colorScheme: 'light',
                                            WebkitAppearance: 'none',
                                            MozAppearance: 'textfield'
                                        }}
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                </div>
                                 <button onClick={() => handleRemoveDateSplit(split.id)} disabled={dateSplits.length <= 1} className="text-slate-400 hover:text-rose-600 disabled:opacity-50 disabled:cursor-not-allowed">
                                    <XCircleIcon />
                                </button>
                            </div>
                        ))}
                         <button onClick={handleAddDateSplit} className="flex items-center gap-1 text-sm text-sky-600 font-semibold hover:text-sky-800 mt-2">
                            <PlusIcon className="w-4 h-4" /> Add Line
                        </button>
                        {renderFooter(remainingDateAmount, isDateSplitValid)}
                    </div>
                 )}
            </div>
            </Modal>
        </>
    );
};