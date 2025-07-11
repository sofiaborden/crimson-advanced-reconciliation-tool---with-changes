import React from 'react';
import { AnyTransaction, ReconciliationStatus, TransactionType, MatchedPair, BankTransaction } from '../types';
import TransactionTable from './TransactionTable';
import { FilterBar, FilterOptions } from './FilterBar';
import { PlusIcon, UploadIcon } from './Icons';

interface ReconciliationPanelProps {
    title: string;
    transactions: AnyTransaction[];
    transactionType: TransactionType;
    statusFilter: ReconciliationStatus;
    onStatusFilterChange: (status: ReconciliationStatus) => void;
    selectedIds: Set<string>;
    onSelectionChange: React.Dispatch<React.SetStateAction<Set<string>>>;
    aiSuggestions: MatchedPair[];
    expandedRows: Set<string>;
    onToggleExpand: React.Dispatch<React.SetStateAction<Set<string>>>;
    onOpenImportModal?: () => void;
    onOpenSplitModal?: (transaction: BankTransaction) => void;
    onMarkAsNrit?: (transactionId: string) => void;
    onUnmarkAsNrit?: (transactionId: string) => void;
    onCreateExpenditure?: (transaction: BankTransaction) => void;
    onCreateReceipt?: (transaction: BankTransaction) => void;
    filters: FilterOptions;
    onFiltersChange: (filters: FilterOptions) => void;
    onCreateNewReceipt?: () => void;
    onCreateNewExpenditure?: () => void;
}

export const ReconciliationPanel: React.FC<ReconciliationPanelProps> = ({
    title,
    transactions,
    transactionType,
    statusFilter,
    onStatusFilterChange,
    selectedIds,
    onSelectionChange,
    aiSuggestions,
    expandedRows,
    onToggleExpand,
    onOpenImportModal,
    onOpenSplitModal,
    onMarkAsNrit,
    onUnmarkAsNrit,
    onCreateExpenditure,
    onCreateReceipt,
    filters,
    onFiltersChange,
    onCreateNewReceipt,
    onCreateNewExpenditure,
}) => {
    const isCrimson = transactionType === TransactionType.CRIMSON;

    return (
        <div className="bg-white rounded-lg shadow-lg p-3 flex flex-col h-full min-h-0 border border-slate-200/50 min-w-0">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-3 gap-2">
                <h2 className="text-lg font-bold text-slate-800">{title}</h2>
                <div className="flex flex-wrap items-center gap-1">
                    {isCrimson ? (
                        <>
                            <button
                                onClick={onCreateNewReceipt}
                                className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-white bg-emerald-600 rounded hover:bg-emerald-700 transition-colors whitespace-nowrap"
                            >
                                <PlusIcon className="w-3 h-3" /> Receipt
                            </button>
                            <button
                                onClick={onCreateNewExpenditure}
                                className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-white bg-rose-600 rounded hover:bg-rose-700 transition-colors whitespace-nowrap"
                            >
                                <PlusIcon className="w-3 h-3" /> Expense
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={onOpenImportModal}
                            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 transition-colors whitespace-nowrap">
                           <UploadIcon className="w-3 h-3" /> Import
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-shrink-0 mb-3">
                <FilterBar
                    statusFilter={statusFilter}
                    onStatusFilterChange={onStatusFilterChange}
                    isCrimson={isCrimson}
                    filters={filters}
                    onFiltersChange={onFiltersChange}
                />
            </div>

            <div className="flex-grow relative min-h-0 min-w-0">
                 <TransactionTable
                    transactions={transactions}
                    transactionType={transactionType}
                    selectedIds={selectedIds}
                    onSelectionChange={onSelectionChange}
                    aiSuggestions={aiSuggestions}
                    expandedRows={expandedRows}
                    onToggleExpand={onToggleExpand}
                    onOpenSplitModal={onOpenSplitModal}
                    onMarkAsNrit={onMarkAsNrit}
                    onUnmarkAsNrit={onUnmarkAsNrit}
                    onCreateExpenditure={onCreateExpenditure}
                    onCreateReceipt={onCreateReceipt}
                />
            </div>
        </div>
    );
};