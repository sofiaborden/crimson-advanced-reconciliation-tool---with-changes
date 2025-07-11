import React, { useMemo } from 'react';
import { AnyTransaction, CrimsonTransaction, BankTransaction, TransactionType, MatchedPair } from '../types';
import { CheckCircleIcon, ChevronDownIcon, ChevronRightIcon, LightBulbIcon, ScissorsIcon, EyeSlashIcon, ArchiveBoxIcon, ArrowUturnLeftIcon, DocumentTextIcon, ReceiptRefundIcon, MinusCircleIcon, PlusIcon, MinusIcon } from './Icons';

interface TransactionTableProps {
    transactions: AnyTransaction[];
    transactionType: TransactionType;
    selectedIds: Set<string>;
    onSelectionChange: React.Dispatch<React.SetStateAction<Set<string>>>;
    aiSuggestions: MatchedPair[];
    expandedRows: Set<string>;
    onToggleExpand: React.Dispatch<React.SetStateAction<Set<string>>>;
    onOpenSplitModal?: (transaction: BankTransaction) => void;
    onMarkAsNrit?: (transactionId: string) => void;
    onUnmarkAsNrit?: (transactionId: string) => void;
    onCreateExpenditure?: (transaction: BankTransaction) => void;
    onCreateReceipt?: (transaction: BankTransaction) => void;
}

const isCrimsonTransaction = (t: AnyTransaction): t is CrimsonTransaction => (t as CrimsonTransaction).moneyType !== undefined;
const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

const TransactionRow: React.FC<{
    transaction: AnyTransaction;
    isSelected: boolean;
    onToggleSelection: (id: string) => void;
    isCrimson: boolean;
    isExpanded: boolean;
    onToggleExpand: (id: string) => void;
    suggestionReason: string | null;
    onOpenSplitModal?: (transaction: BankTransaction) => void;
    onMarkAsNrit?: (transactionId: string) => void;
    onUnmarkAsNrit?: (transactionId: string) => void;
    onCreateExpenditure?: (transaction: BankTransaction) => void;
    onCreateReceipt?: (transaction: BankTransaction) => void;
}> = ({ transaction, isSelected, onToggleSelection, isCrimson, isExpanded, onToggleExpand, suggestionReason, onOpenSplitModal, onMarkAsNrit, onUnmarkAsNrit, onCreateExpenditure, onCreateReceipt }) => {
    
    const amountColor = transaction.amount >= 0 ? 'text-emerald-700' : 'text-rose-700';
    
    let rowStyle = 'bg-white hover:bg-slate-50/50 transition-colors duration-150';
    let statusIndicator = '';

    if (transaction.isReconciled) {
        if ((transaction as BankTransaction).isNrit) {
            rowStyle = 'bg-indigo-50/50 text-slate-600';
            statusIndicator = 'border-l-4 border-indigo-400';
        } else {
            rowStyle = 'bg-emerald-50/50 text-slate-600';
            statusIndicator = 'border-l-4 border-emerald-400';
        }
    } else if (isSelected) {
        rowStyle = 'bg-sky-100 ring-2 ring-sky-300 ring-inset';
        statusIndicator = 'border-l-4 border-sky-600';
    } else if (suggestionReason) {
        rowStyle = 'bg-purple-50/50 hover:bg-purple-100/50';
        statusIndicator = 'border-l-4 border-purple-400';
    } else {
        statusIndicator = 'border-l-4 border-transparent';
    }

    const hasDetails = (isCrimson && (transaction as CrimsonTransaction).batchDetails) || (!isCrimson && (transaction as BankTransaction).splitDetails);

    return (
        <>
            <tr className={`border-b border-slate-200 ${rowStyle} ${statusIndicator}`}>
                <td className="pl-1 sm:pl-2 py-3 text-center">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelection(transaction.id)}
                        className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 focus:ring-offset-1"
                        disabled={transaction.isReconciled}
                        aria-label={`Select transaction ${transaction.id}`}
                    />
                </td>
                <td className="px-1 py-3 text-sm text-center">
                    {hasDetails ? (
                        <button
                            onClick={() => onToggleExpand(transaction.id)}
                            className="p-1 sm:p-1.5 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1"
                            aria-label={`${isExpanded ? 'Collapse' : 'Expand'} transaction details`}
                            aria-expanded={isExpanded}
                        >
                            {isExpanded ? <ChevronDownIcon className="w-3 h-3 sm:w-4 sm:h-4" /> : <ChevronRightIcon className="w-3 h-3 sm:w-4 sm:h-4" />}
                        </button>
                    ) : <div className="w-3 h-3 sm:w-5 sm:h-5"></div>}
                </td>
                <td className="px-2 py-3 text-sm font-medium">
                    <span className="hidden sm:inline">{transaction.date}</span>
                    <span className="sm:hidden">{new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </td>
                {isCrimson && isCrimsonTransaction(transaction) && (
                    <td className="px-2 py-3 text-sm">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.moneyType.includes('Contribution') ? 'bg-emerald-100 text-emerald-800' :
                            transaction.moneyType.includes('Disbursement') ? 'bg-rose-100 text-rose-800' :
                            transaction.moneyType.includes('Chargeback') ? 'bg-orange-100 text-orange-800' :
                            'bg-slate-100 text-slate-800'
                        }`}>
                            {transaction.moneyType}
                        </span>
                    </td>
                )}
                <td className={`px-2 py-3 text-sm ${transaction.isReconciled ? 'text-slate-500' : 'text-slate-700'}`} style={{ maxWidth: '200px' }}>
                    <div className="truncate" title={!isCrimson ? (transaction as BankTransaction).description : (transaction as CrimsonTransaction).paymentType}>
                        {!isCrimson ? (transaction as BankTransaction).description : (transaction as CrimsonTransaction).paymentType}
                    </div>
                </td>
                <td className={`px-2 py-3 text-sm text-right font-mono font-semibold ${amountColor}`}>
                    <span className="hidden sm:inline">{formatCurrency(transaction.amount)}</span>
                    <span className="sm:hidden">{formatCurrency(transaction.amount).replace('$', '$').replace('.00', '')}</span>
                </td>
                <td className="px-1 sm:px-2 py-3 text-sm text-center">
                    <div className="flex justify-center items-center gap-1 sm:gap-1.5">
                         {transaction.isReconciled && (
                            (transaction as BankTransaction).isNrit ? (
                                <div className="flex items-center gap-1.5">
                                    <div className="relative group">
                                        <ArchiveBoxIcon className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                                        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                                            Non-Reportable (NRIT)
                                        </div>
                                    </div>
                                    {onUnmarkAsNrit && (
                                        <button
                                            onClick={() => onUnmarkAsNrit(transaction.id)}
                                            className="text-slate-400 hover:text-sky-600 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 rounded p-0.5"
                                            aria-label="Restore Transaction"
                                        >
                                            <ArrowUturnLeftIcon className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="relative group">
                                    <CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                                        Reconciled
                                    </div>
                                </div>
                            )
                        )}
                        {suggestionReason && !transaction.isReconciled && (
                             <div className="relative group">
                                <LightBulbIcon className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 animate-pulse" />
                                <div className="absolute top-full mt-2 w-64 right-0 p-3 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
                                    <strong>AI Suggestion:</strong> {suggestionReason}
                                </div>
                            </div>
                        )}
                         {!isCrimson && !transaction.isReconciled && (
                            <>
                                {onOpenSplitModal && (
                                    <div className="relative group">
                                        <button
                                            onClick={() => onOpenSplitModal(transaction as BankTransaction)}
                                            className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 bg-sky-50 hover:bg-sky-100 text-sky-600 hover:text-sky-700 border border-sky-200 hover:border-sky-300 rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1"
                                            aria-label="Split Transaction"
                                        >
                                            <ScissorsIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                                        </button>
                                        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                                            Split Transaction
                                        </div>
                                    </div>
                                )}
                                {onCreateReceipt && transaction.amount > 0 && (
                                    <div className="relative group">
                                        <button
                                            onClick={() => onCreateReceipt(transaction as BankTransaction)}
                                            className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 hover:text-emerald-700 border border-emerald-200 hover:border-emerald-300 rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
                                            aria-label="Create Receipt"
                                        >
                                            <PlusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                                        </button>
                                        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                                            Create Receipt
                                        </div>
                                    </div>
                                )}
                                {onCreateExpenditure && transaction.amount < 0 && (
                                    <div className="relative group">
                                        <button
                                            onClick={() => onCreateExpenditure(transaction as BankTransaction)}
                                            className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 border border-rose-200 hover:border-rose-300 rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-1"
                                            aria-label="Create Expenditure"
                                        >
                                            <MinusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                                        </button>
                                        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                                            Create Expenditure
                                        </div>
                                    </div>
                                )}
                                {onMarkAsNrit && (
                                    <div className="relative group">
                                        <button
                                            onClick={() => onMarkAsNrit(transaction.id)}
                                            className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 bg-orange-50 hover:bg-orange-100 text-orange-600 hover:text-orange-700 border border-orange-200 hover:border-orange-300 rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1"
                                            aria-label="Mark as Non-Reportable (NRIT)"
                                        >
                                            <ArchiveBoxIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                                        </button>
                                        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                                            Mark as NRIT
                                        </div>
                                    </div>
                                )}
                            </>
                         )}
                    </div>
                </td>
            </tr>
            {isExpanded && hasDetails && (
                 <tr className={`${rowStyle} border-b border-slate-200`}>
                    <td colSpan={isCrimson ? 7 : 6} className="p-0">
                        <div className="bg-slate-100 p-3 pl-16">
                            {isCrimsonTransaction(transaction) && transaction.batchDetails && (
                                <div className="text-xs text-slate-600">
                                    <h4 className="font-bold text-slate-700 mb-1">Batch Details</h4>
                                    <ul>{transaction.batchDetails.map(d => <li key={d.id} className="flex justify-between py-0.5"><span>{d.donor}</span> <span className="font-mono text-slate-800">{formatCurrency(d.amount)}</span></li>)}</ul>
                                </div>
                            )}
                            {!isCrimsonTransaction(transaction) && transaction.splitDetails && (
                                <div className="text-xs text-slate-600">
                                     <h4 className="font-bold text-slate-700 mb-1">Split Details</h4>
                                     <ul>
                                        <li className="flex justify-between py-0.5"><span>Gross Amount</span> <span className="font-mono text-slate-800">{formatCurrency(transaction.splitDetails.gross)}</span></li>
                                        <li className="flex justify-between py-0.5"><span>Chargebacks/Refunds</span> <span className="font-mono text-slate-800">{formatCurrency(transaction.splitDetails.chargebacks)}</span></li>
                                        <li className="flex justify-between py-0.5"><span>Fees</span> <span className="font-mono text-slate-800">{formatCurrency(transaction.splitDetails.fees)}</span></li>
                                     </ul>
                                </div>
                            )}
                        </div>
                    </td>
                 </tr>
            )}
        </>
    );
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, transactionType, selectedIds, onSelectionChange, aiSuggestions, expandedRows, onToggleExpand, onOpenSplitModal, onMarkAsNrit, onUnmarkAsNrit, onCreateExpenditure, onCreateReceipt }) => {
    const isCrimson = transactionType === TransactionType.CRIMSON;

    const suggestionMap = useMemo(() => {
        const map = new Map<string, string>();
        aiSuggestions.forEach(s => {
            if (isCrimson) {
                map.set(s.crimsonTransactionId, s.reasoning);
            } else {
                s.bankTransactionId.forEach(bId => map.set(bId, s.reasoning));
            }
        });
        return map;
    }, [aiSuggestions, isCrimson]);

    const handleToggleSelection = (id: string) => {
        onSelectionChange(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    };
    
    const handleToggleExpand = (id: string) => {
         onToggleExpand(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    }

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const allUnreconciledIds = transactions.filter(t => !t.isReconciled).map(t => t.id);
            onSelectionChange(new Set(allUnreconciledIds));
        } else {
            onSelectionChange(new Set());
        }
    };
    
    const unreconciledCount = transactions.filter(t => !t.isReconciled).length;
    const allSelected = unreconciledCount > 0 && selectedIds.size === unreconciledCount;

    return (
        <div className="h-full overflow-y-auto">
            <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-0" role="table" aria-label={`${isCrimson ? 'Crimson' : 'Bank'} transactions table`}>
                <thead className="bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 sticky top-0 z-10 shadow-sm">
                    <tr className="border-b-2 border-slate-300">
                        <th className="px-2 py-3 text-center w-8 sm:w-12" scope="col">
                            <input
                                type="checkbox"
                                onChange={handleSelectAll}
                                checked={allSelected}
                                disabled={unreconciledCount === 0}
                                className="h-4 w-4 rounded border-slate-400 bg-slate-100 text-sky-600 focus:ring-sky-500 focus:ring-offset-slate-100"
                                aria-label={`Select all ${unreconciledCount} unreconciled transactions`}
                            />
                        </th>
                        <th className="px-1 py-3 w-8 sm:w-12" scope="col" aria-label="Expand details"></th>
                        <th className="px-2 py-3 font-semibold text-slate-800 w-20 sm:w-28" scope="col">
                            <span className="hidden sm:inline">Date</span>
                            <span className="sm:hidden">Date</span>
                        </th>
                        {isCrimson && (
                            <th className="px-2 py-3 font-semibold text-slate-800 w-24 sm:w-32 lg:w-40" scope="col">
                                <span className="hidden sm:inline">Type</span>
                                <span className="sm:hidden">Type</span>
                            </th>
                        )}
                        <th className="px-2 py-3 font-semibold text-slate-800 min-w-0" scope="col" style={{ width: '40%' }}>
                            <span className="hidden sm:inline">{isCrimson ? 'Payment Type' : 'Description'}</span>
                            <span className="sm:hidden">{isCrimson ? 'Payment' : 'Desc'}</span>
                        </th>
                        <th className="px-2 py-3 text-right font-semibold text-slate-800 w-20 sm:w-28" scope="col">
                            Amount
                        </th>
                        <th className="px-1 py-3 text-center font-semibold text-slate-800 w-20 sm:w-28 lg:w-32" scope="col">
                            <span className="hidden lg:inline">Status & Actions</span>
                            <span className="lg:hidden">Actions</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {transactions.length === 0 ? (
                         <tr>
                            <td colSpan={isCrimson ? 7 : 6} className="text-center py-16">
                                <div className="flex flex-col items-center justify-center space-y-3">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                                        <DocumentTextIcon className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-slate-900">No transactions found</h3>
                                        <p className="text-sm text-slate-500 mt-1">
                                            {isCrimson
                                                ? "No Crimson transactions match your current filters."
                                                : "No bank transactions match your current filters."
                                            }
                                        </p>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ) : (
                         transactions.map((t, index) => (
                            <TransactionRow
                                key={t.id}
                                transaction={t}
                                isSelected={selectedIds.has(t.id)}
                                onToggleSelection={handleToggleSelection}
                                isCrimson={isCrimson}
                                isExpanded={expandedRows.has(t.id)}
                                onToggleExpand={handleToggleExpand}
                                suggestionReason={suggestionMap.get(t.id) || null}
                                onOpenSplitModal={onOpenSplitModal}
                                onMarkAsNrit={onMarkAsNrit}
                                onUnmarkAsNrit={onUnmarkAsNrit}
                                onCreateExpenditure={onCreateExpenditure}
                                onCreateReceipt={onCreateReceipt}
                            />
                        ))
                    )}
                </tbody>
            </table>
            </div>
        </div>
    );
};

export default TransactionTable;