import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { ReconciliationPanel } from './components/ReconciliationPanel';
import { CrimsonTransaction, BankTransaction, ReconciliationStatus, TransactionType, MatchedPair, AnyTransaction, ReconciliationSession, ReportType, ReportParameters, CashOnHandData } from './types';
import { FilterOptions } from './components/FilterBar';
import { initialCrimsonTransactions, initialBankTransactions } from './constants';
import { reconcileWithAI } from './services/geminiService';
import { Header } from './components/Header';
import { ReconciliationActions } from './components/ReconciliationActions';
import { DashboardWithCashOnHand } from './components/Dashboard';
import { UnifiedActionBar } from './components/UnifiedActionBar';
import { WorkflowGuide } from './components/WorkflowGuide';
import { RulesEngine, ReconciliationRule } from './components/RulesEngine';
import { AuditTrail, AuditEntry } from './components/AuditTrail';
import { ExportModal } from './components/ExportModal';
import { DataValidation } from './components/DataValidation';
import { ReconciliationFooter } from './components/ReconciliationFooter';
import { LoadingIcon, SparklesIcon, CheckCircleIcon, XCircleIcon, LightBulbIcon, AcademicCapIcon, CogIcon, ClockIcon, DocumentArrowDownIcon, ExclamationTriangleIcon, DocumentTextIcon } from './components/Icons';
import { ImportModal } from './components/ImportModal';
import { SplitTransactionModal } from './components/SplitTransactionModal';
import { CreateExpenditureModal } from './components/CreateExpenditureModal';
import { CreateReceiptModal } from './components/CreateReceiptModal';
import { Reports } from './components/Reports';
import { ReconciliationHistory } from './components/ReconciliationHistory';

const App: React.FC = () => {
    const [crimsonTransactions, setCrimsonTransactions] = useState<CrimsonTransaction[]>(initialCrimsonTransactions);
    const [bankTransactions, setBankTransactions] = useState<BankTransaction[]>(initialBankTransactions);

    const [crimsonStatusFilter, setCrimsonStatusFilter] = useState<ReconciliationStatus>(ReconciliationStatus.Unreconciled);
    const [bankStatusFilter, setBankStatusFilter] = useState<ReconciliationStatus>(ReconciliationStatus.Unreconciled);

    const [selectedCrimsonIds, setSelectedCrimsonIds] = useState<Set<string>>(new Set());
    const [selectedBankIds, setSelectedBankIds] = useState<Set<string>>(new Set());
    
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const [aiSuggestions, setAiSuggestions] = useState<MatchedPair[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const [aiMessage, setAiMessage] = useState<string | null>(null);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [transactionToSplit, setTransactionToSplit] = useState<BankTransaction | null>(null);
    const [expenditureModalTransaction, setExpenditureModalTransaction] = useState<BankTransaction | null>(null);
    const [receiptModalTransaction, setReceiptModalTransaction] = useState<BankTransaction | null>(null);
    const [isCreatingNewExpenditure, setIsCreatingNewExpenditure] = useState(false);
    const [isCreatingNewReceipt, setIsCreatingNewReceipt] = useState(false);
    const [showWorkflowGuide, setShowWorkflowGuide] = useState(false);
    const [showRulesEngine, setShowRulesEngine] = useState(false);
    const [showAuditTrail, setShowAuditTrail] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [showDataValidation, setShowDataValidation] = useState(false);
    const [activeView, setActiveView] = useState<'reconciliation' | 'reports' | 'history'>('reconciliation');

    // Cash on Hand state with localStorage persistence
    const [cashOnHandData, setCashOnHandData] = useState<CashOnHandData[]>(() => {
        const saved = localStorage.getItem('cashOnHandData');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.warn('Failed to parse saved cash on hand data');
            }
        }
        // Default data
        return [
            {
                accountCode: 'P2026',
                accountName: 'Primary Campaign Account',
                startingBalance: 45750.00,
                endingBalance: 47250.00, // Sample ending balance
                startDate: '2024-04-01',
                endDate: '2024-04-07',
                lastUpdated: new Date().toISOString(),
                source: 'previous_session'
            },
            {
                accountCode: 'G2026',
                accountName: 'General Fund Account',
                startingBalance: 12500.00,
                endingBalance: 14000.00, // Sample ending balance
                startDate: '2024-04-01',
                endDate: '2024-04-07',
                lastUpdated: new Date().toISOString(),
                source: 'previous_session'
            }
        ];
    });
    const [reconciliationPeriod, setReconciliationPeriod] = useState({
        startDate: '2024-04-01',
        endDate: '2024-04-07'
    });

    // Reconciliation Sessions and Reports
    const [reconciliationSessions, setReconciliationSessions] = useState<ReconciliationSession[]>([
        // Sample session for demonstration
        {
            id: 'session-q1-2024',
            name: 'Q1 2024 Reconciliation',
            period: { start: '2024-01-01', end: '2024-03-31', type: 'quarterly' },
            status: 'completed',
            createdBy: 'John Smith',
            createdAt: '2024-04-01T10:00:00Z',
            completedAt: '2024-04-02T15:30:00Z',
            summary: {
                totalCrimsonTransactions: 245,
                totalBankTransactions: 189,
                reconciledCrimsonTransactions: 240,
                reconciledBankTransactions: 185,
                totalCrimsonAmount: 125000,
                totalBankAmount: 124500,
                discrepancyAmount: 500,
                unresolvedDiscrepancies: 2
            },
            fundResults: {
                'P2026': { reconciledTransactions: 120, reconciledAmount: 75000, unreconciledTransactions: 2, unreconciledAmount: 300, discrepancies: [] },
                'G2026': { reconciledTransactions: 80, reconciledAmount: 35000, unreconciledTransactions: 1, unreconciledAmount: 150, discrepancies: [] },
                'PAC': { reconciledTransactions: 40, reconciledAmount: 15000, unreconciledTransactions: 2, unreconciledAmount: 50, discrepancies: [] }
            },
            fecLineResults: {
                'SA11A': { reconciledTransactions: 180, reconciledAmount: 95000, unreconciledTransactions: 3, unreconciledAmount: 400 },
                'SB21B': { reconciledTransactions: 60, reconciledAmount: 30000, unreconciledTransactions: 2, unreconciledAmount: 100 }
            },
            actions: [],
            complianceNotes: '',
            materialDiscrepancies: '',
            internalControlsAssessment: ''
        }
    ]);

    // Rules and audit state
    const [reconciliationRules, setReconciliationRules] = useState<ReconciliationRule[]>([]);
    const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([
        {
            id: 'audit-1',
            timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
            user: 'Sarah Johnson',
            action: 'ai_suggest',
            details: 'AI suggested 3 potential matches with high confidence',
            transactionIds: ['C1', 'B1', 'B2'],
            confidence: 0.92
        },
        {
            id: 'audit-2',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            user: 'Sarah Johnson',
            action: 'reconcile',
            details: 'Manually reconciled WinRed payout transaction',
            transactionIds: ['C7', 'C8', 'C9', 'B11'],
            amount: 833.55
        },
        {
            id: 'audit-3',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
            user: 'Mike Chen',
            action: 'import',
            details: 'Imported 15 bank transactions from CSV file',
            transactionIds: ['B12', 'B13', 'B14', 'B15', 'B16'],
            metadata: { fileName: 'bank_statement_april.csv', recordCount: 15 }
        }
    ]);

    // Filter states
    const [crimsonFilters, setCrimsonFilters] = useState<FilterOptions>({
        statusFilter: ReconciliationStatus.Unreconciled,
        searchText: '',
        dateRange: { start: '', end: '' },
        amountRange: { min: null, max: null },
        fundCode: ['All'],
        accountCode: ['All'],
        paymentType: ['All'],
        lineNumber: ['All'],
        showAdvanced: false,
    });

    const [bankFilters, setBankFilters] = useState<FilterOptions>({
        statusFilter: ReconciliationStatus.Unreconciled,
        searchText: '',
        dateRange: { start: '', end: '' },
        amountRange: { min: null, max: null },
        fundCode: ['All'],
        accountCode: ['All'],
        paymentType: ['All'],
        lineNumber: ['All'],
        showAdvanced: false,
    });

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Only handle keyboard shortcuts when no modal is open and not typing in an input
            if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
                return;
            }

            // Check for modals
            if (isImportModalOpen || transactionToSplit || expenditureModalTransaction || receiptModalTransaction || isCreatingNewExpenditure || isCreatingNewReceipt) {
                return;
            }

            // Alt + R for Reconciliation
            if (event.altKey && event.key.toLowerCase() === 'r') {
                event.preventDefault();
                setActiveView('reconciliation');
            }
            // Alt + P for Reports
            else if (event.altKey && event.key.toLowerCase() === 'p') {
                event.preventDefault();
                setActiveView('reports');
            }
            // Alt + H for History
            else if (event.altKey && event.key.toLowerCase() === 'h') {
                event.preventDefault();
                setActiveView('history');
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isImportModalOpen, transactionToSplit, expenditureModalTransaction, receiptModalTransaction, isCreatingNewExpenditure, isCreatingNewReceipt]);

    // Enhanced filtering logic
    const applyFilters = useCallback((transactions: AnyTransaction[], filters: FilterOptions, isCrimson: boolean) => {
        return transactions.filter(transaction => {
            // Status filter
            if (filters.statusFilter === ReconciliationStatus.Unreconciled && transaction.isReconciled) {
                // Show reconciled transactions only if they have AI suggestions
                const hasAISuggestion = isCrimson
                    ? aiSuggestions.some(s => s.crimsonTransactionId === transaction.id)
                    : aiSuggestions.some(s => s.bankTransactionId.includes(transaction.id));
                if (!hasAISuggestion) return false;
            }

            // Search text filter
            if (filters.searchText) {
                const searchLower = filters.searchText.toLowerCase();
                const description = isCrimson
                    ? (transaction as CrimsonTransaction).paymentType
                    : (transaction as BankTransaction).description;
                const amount = transaction.amount.toString();
                const date = transaction.date;

                if (!description.toLowerCase().includes(searchLower) &&
                    !amount.includes(searchLower) &&
                    !date.includes(searchLower)) {
                    return false;
                }
            }

            // Date range filter
            if (filters.dateRange.start || filters.dateRange.end) {
                const transactionDate = new Date(transaction.date);
                if (filters.dateRange.start && transactionDate < new Date(filters.dateRange.start)) return false;
                if (filters.dateRange.end && transactionDate > new Date(filters.dateRange.end)) return false;
            }

            // Amount range filter
            if (filters.amountRange.min !== null && transaction.amount < filters.amountRange.min) return false;
            if (filters.amountRange.max !== null && transaction.amount > filters.amountRange.max) return false;

            // Fund code / transaction type filter
            const fundCodeFilter = Array.isArray(filters.fundCode) ? filters.fundCode : [filters.fundCode];
            if (!fundCodeFilter.includes('All')) {
                if (isCrimson) {
                    // For Crimson, filter by fund code from transaction data
                    const transactionFundCode = (transaction as CrimsonTransaction).fundCode;
                    if (transactionFundCode && !fundCodeFilter.includes(transactionFundCode)) return false;
                } else {
                    // For Bank, filter by credit/debit
                    if (fundCodeFilter.includes('Credit') && transaction.amount < 0) return false;
                    if (fundCodeFilter.includes('Debit') && transaction.amount >= 0) return false;
                }
            }

            // Payment type / description filter
            const paymentTypeFilter = Array.isArray(filters.paymentType) ? filters.paymentType : [filters.paymentType];
            if (!paymentTypeFilter.includes('All')) {
                if (isCrimson) {
                    const paymentType = (transaction as CrimsonTransaction).paymentType;
                    if (!paymentTypeFilter.some(filterType => paymentType.includes(filterType))) return false;
                } else {
                    const description = (transaction as BankTransaction).description.toLowerCase();
                    if (!paymentTypeFilter.some(filterType => description.includes(filterType.toLowerCase()))) return false;
                }
            }

            // Account code filter
            const accountCodeFilter = Array.isArray(filters.accountCode) ? filters.accountCode : [filters.accountCode];
            if (!accountCodeFilter.includes('All')) {
                if (isCrimson) {
                    const accountCode = (transaction as CrimsonTransaction).accountCode;
                    if (accountCode && !accountCodeFilter.includes(accountCode)) return false;
                } else {
                    const accountCode = (transaction as BankTransaction).accountCode;
                    if (accountCode && !accountCodeFilter.includes(accountCode)) return false;
                }
            }

            // Line number filter (Crimson only)
            if (isCrimson) {
                const lineNumberFilter = Array.isArray(filters.lineNumber) ? filters.lineNumber : [filters.lineNumber];
                if (!lineNumberFilter.includes('All')) {
                    const lineNumber = (transaction as CrimsonTransaction).lineNumber;
                    if (lineNumber && !lineNumberFilter.includes(lineNumber)) return false;
                }
            }

            return true;
        });
    }, [aiSuggestions]);

    const filteredCrimsonTransactions = useMemo(() => {
        return applyFilters(crimsonTransactions, crimsonFilters, true);
    }, [crimsonTransactions, crimsonFilters, applyFilters]);

    const filteredBankTransactions = useMemo(() => {
        return applyFilters(bankTransactions, bankFilters, false);
    }, [bankTransactions, bankFilters, applyFilters]);

    const handleSuggestReconciliation = useCallback(async () => {
        setIsLoading(true);
        setAiMessage("AI is analyzing transactions...");
        setAiSuggestions([]);

        const unreconciledCrimson = crimsonTransactions.filter(t => !t.isReconciled);
        const unreconciledBank = bankTransactions.filter(t => !t.isReconciled);

        try {
            const matches = await reconcileWithAI(unreconciledCrimson, unreconciledBank);
            if (matches && matches.length > 0) {
                setAiSuggestions(matches);
                setAiMessage(`AI has found ${matches.length} potential match(es) for your review.`);
            } else {
                setAiMessage("AI could not find any clear matches.");
                setTimeout(() => setAiMessage(null), 5000);
            }
        } catch (error) {
            console.error("AI Reconciliation Error:", error);
            setAiMessage("An error occurred during AI analysis.");
            setTimeout(() => setAiMessage(null), 5000);
        } finally {
            setIsLoading(false);
        }
    }, [crimsonTransactions, bankTransactions]);

    // Audit logging function
    const addAuditEntry = useCallback((entry: Omit<AuditEntry, 'id' | 'timestamp' | 'user'>) => {
        const newEntry: AuditEntry = {
            ...entry,
            id: `audit-${Date.now()}`,
            timestamp: new Date(),
            user: 'Sarah Johnson' // In real app, get from auth context
        };
        setAuditEntries(prev => [newEntry, ...prev]);
    }, []);

    const updateReconciliationStatus = (idsToReconcile: { crimson: string[], bank: string[] }) => {
        const reconcile = (transactions: AnyTransaction[], ids: Set<string>) =>
            transactions.map(t => ids.has(t.id) ? { ...t, isReconciled: true } : t);

        setCrimsonTransactions(prev => reconcile(prev, new Set(idsToReconcile.crimson)) as CrimsonTransaction[]);
        setBankTransactions(prev => reconcile(prev, new Set(idsToReconcile.bank)) as BankTransaction[]);

        // Log reconciliation action
        const totalAmount = [...idsToReconcile.crimson, ...idsToReconcile.bank]
            .map(id => {
                const crimsonTx = crimsonTransactions.find(t => t.id === id);
                const bankTx = bankTransactions.find(t => t.id === id);
                return crimsonTx?.amount || bankTx?.amount || 0;
            })
            .reduce((sum, amount) => sum + Math.abs(amount), 0);

        addAuditEntry({
            action: 'reconcile',
            details: `Reconciled ${idsToReconcile.crimson.length + idsToReconcile.bank.length} transactions`,
            transactionIds: [...idsToReconcile.crimson, ...idsToReconcile.bank],
            amount: totalAmount
        });
    };

    const handleAcceptSuggestions = () => {
        const idsToReconcile = aiSuggestions.reduce((acc, suggestion) => {
            acc.crimson.push(suggestion.crimsonTransactionId);
            acc.bank.push(...suggestion.bankTransactionId);
            return acc;
        }, { crimson: [] as string[], bank: [] as string[] });
        
        updateReconciliationStatus(idsToReconcile);
        setAiMessage(`Accepted ${aiSuggestions.length} AI suggestion(s).`);
        setAiSuggestions([]);
        setTimeout(() => setAiMessage(null), 5000);
    };

    const handleDeclineSuggestions = () => {
        setAiSuggestions([]);
        setAiMessage("AI suggestions cleared.");
        setTimeout(() => setAiMessage(null), 5000);
    };

    const handleManualReconcile = () => {
        updateReconciliationStatus({ crimson: Array.from(selectedCrimsonIds), bank: Array.from(selectedBankIds) });
        setSelectedCrimsonIds(new Set());
        setSelectedBankIds(new Set());
    };
    
    const handleImportTransactions = (newTransactions: BankTransaction[]) => {
        setBankTransactions(prev => [...newTransactions, ...prev]);
        setIsImportModalOpen(false);
        // Automatically trigger AI analysis after import
        setTimeout(handleSuggestReconciliation, 100);
    };
    
     const handleConfirmSplit = (originalId: string, splits: Omit<BankTransaction, 'id' | 'isReconciled'>[]) => {
        setBankTransactions(prev => {
            const newTransactions = [...prev];
            const index = newTransactions.findIndex(t => t.id === originalId);
            if (index === -1) return prev; // Should not happen

            const newSplitTransactions: BankTransaction[] = splits.map((split, i) => ({
                ...split,
                id: `${originalId}-split-${i}`,
                isReconciled: false,
            }));

            newTransactions.splice(index, 1, ...newSplitTransactions);
            return newTransactions;
        });
        setTransactionToSplit(null);
    };

    const handleMarkAsNrit = (transactionId: string) => {
        setBankTransactions(prev => 
            prev.map(t => 
                t.id === transactionId 
                    ? { ...t, isReconciled: true, isNrit: true } 
                    : t
            )
        );
    };

    const handleUnmarkAsNrit = (transactionId: string) => {
        setBankTransactions(prev =>
            prev.map(t =>
                t.id === transactionId
                    ? { ...t, isReconciled: false, isNrit: false }
                    : t
            )
        );
    };

    const handleCreateExpenditure = (bankTransaction: BankTransaction) => {
        setExpenditureModalTransaction(bankTransaction);
    };

    const handleCreateReceipt = (bankTransaction: BankTransaction) => {
        setReceiptModalTransaction(bankTransaction);
    };

    const handleConfirmCreateExpenditure = (expenditure: CrimsonTransaction) => {
        setCrimsonTransactions(prev => [...prev, expenditure]);

        // Optionally mark the bank transaction as reconciled
        if (expenditureModalTransaction) {
            setBankTransactions(prev =>
                prev.map(t =>
                    t.id === expenditureModalTransaction.id
                        ? { ...t, isReconciled: true }
                        : t
                )
            );
        }
        setExpenditureModalTransaction(null);
        setIsCreatingNewExpenditure(false);
    };

    const handleConfirmCreateReceipt = (receipt: CrimsonTransaction) => {
        setCrimsonTransactions(prev => [...prev, receipt]);

        // Optionally mark the bank transaction as reconciled
        if (receiptModalTransaction) {
            setBankTransactions(prev =>
                prev.map(t =>
                    t.id === receiptModalTransaction.id
                        ? { ...t, isReconciled: true }
                        : t
                )
            );
        }
        setReceiptModalTransaction(null);
        setIsCreatingNewReceipt(false);
    };

    // Bulk operation handlers
    const handleBulkReconcile = useCallback((selectedIds: { crimson: string[], bank: string[] }) => {
        updateReconciliationStatus(selectedIds);
        setSelectedCrimsonIds(new Set());
        setSelectedBankIds(new Set());
    }, []);

    const handleBulkMarkAsNrit = useCallback((selectedBankIds: string[]) => {
        setBankTransactions(prev =>
            prev.map(t =>
                selectedBankIds.includes(t.id)
                    ? { ...t, isReconciled: true, isNrit: true }
                    : t
            )
        );
        setSelectedBankIds(new Set());
    }, []);

    const handleBulkExport = useCallback((selectedIds: string[], isCrimson: boolean) => {
        const transactions = isCrimson ? crimsonTransactions : bankTransactions;
        const selectedTransactions = transactions.filter(t => selectedIds.includes(t.id));

        // Create CSV content
        const headers = isCrimson
            ? ['ID', 'Date', 'Money Type', 'Payment Type', 'Amount', 'Group', 'Reconciled']
            : ['ID', 'Date', 'Description', 'Amount', 'Reconciled', 'NRIT'];

        const csvContent = [
            headers.join(','),
            ...selectedTransactions.map(t => {
                if (isCrimson) {
                    const ct = t as CrimsonTransaction;
                    return [ct.id, ct.date, ct.moneyType, ct.paymentType, ct.amount, ct.group, ct.isReconciled].join(',');
                } else {
                    const bt = t as BankTransaction;
                    return [bt.id, bt.date, `"${bt.description}"`, bt.amount, bt.isReconciled, bt.isNrit || false].join(',');
                }
            })
        ].join('\n');

        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${isCrimson ? 'crimson' : 'bank'}_transactions_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    }, [crimsonTransactions, bankTransactions]);


    const selectedCrimsonTotal = useMemo(() => crimsonTransactions.filter(t => selectedCrimsonIds.has(t.id)).reduce((sum, t) => sum + t.amount, 0), [crimsonTransactions, selectedCrimsonIds]);
    const selectedBankTotal = useMemo(() => bankTransactions.filter(t => selectedBankIds.has(t.id)).reduce((sum, t) => sum + t.amount, 0), [bankTransactions, selectedBankIds]);
    
    const unreconciledCrimsonTotal = useMemo(() => crimsonTransactions.filter(t => !t.isReconciled).reduce((sum, t) => sum + t.amount, 0), [crimsonTransactions]);
    const unreconciledBankTotal = useMemo(() => bankTransactions.filter(t => !t.isReconciled).reduce((sum, t) => sum + t.amount, 0), [bankTransactions]);

    // Reconciliation Session Handlers
    const handleStartNewSession = () => {
        const newSession: ReconciliationSession = {
            id: `session-${Date.now()}`,
            name: `${new Date().toLocaleDateString()} Reconciliation`,
            period: {
                start: new Date().toISOString().split('T')[0],
                end: new Date().toISOString().split('T')[0],
                type: 'custom'
            },
            status: 'in_progress',
            createdBy: 'Current User',
            createdAt: new Date().toISOString(),
            summary: {
                totalCrimsonTransactions: crimsonTransactions.length,
                totalBankTransactions: bankTransactions.length,
                reconciledCrimsonTransactions: crimsonTransactions.filter(t => t.isReconciled).length,
                reconciledBankTransactions: bankTransactions.filter(t => t.isReconciled).length,
                totalCrimsonAmount: crimsonTransactions.reduce((sum, t) => sum + t.amount, 0),
                totalBankAmount: bankTransactions.reduce((sum, t) => sum + t.amount, 0),
                discrepancyAmount: 0,
                unresolvedDiscrepancies: 0
            },
            fundResults: {},
            fecLineResults: {},
            actions: [],
            complianceNotes: '',
            materialDiscrepancies: '',
            internalControlsAssessment: ''
        };
        setReconciliationSessions(prev => [newSession, ...prev]);
    };

    const handleResumeSession = (sessionId: string) => {
        console.log('Resuming session:', sessionId);
        // Implementation to load session state
    };

    const handleViewSession = (sessionId: string) => {
        console.log('Viewing session:', sessionId);
        // Implementation to view session details
    };

    const handleCertifySession = (sessionId: string) => {
        setReconciliationSessions(prev =>
            prev.map(session =>
                session.id === sessionId
                    ? { ...session, status: 'certified' as const, certifiedAt: new Date().toISOString(), certifiedBy: 'Current User' }
                    : session
            )
        );
    };

    const handleArchiveSession = (sessionId: string) => {
        setReconciliationSessions(prev =>
            prev.map(session =>
                session.id === sessionId
                    ? { ...session, status: 'archived' as const }
                    : session
            )
        );
    };

    // Report Handlers
    const handleGenerateReport = (type: ReportType, parameters: ReportParameters) => {
        console.log('Generating report:', type, 'with parameters:', parameters);
        // Implementation to generate and display report
        alert(`Generating ${type} report for session ${parameters.sessionId}`);
    };

    const handleExportReport = (reportId: string, format: 'pdf' | 'excel' | 'csv') => {
        console.log('Exporting report:', reportId, 'as:', format);
        // Implementation to export report
        alert(`Exporting report ${reportId} as ${format.toUpperCase()}`);
    };

    // Cash on Hand handlers
    const handleUpdateCashOnHand = useCallback((accountCode: string, data: Partial<CashOnHandData>) => {
        setCashOnHandData(prev => {
            const existingIndex = prev.findIndex(item => item.accountCode === accountCode);
            let updated: CashOnHandData[];

            if (existingIndex >= 0) {
                // Update existing entry
                updated = [...prev];
                updated[existingIndex] = { ...updated[existingIndex], ...data };
            } else {
                // Add new entry
                const newEntry: CashOnHandData = {
                    accountCode,
                    accountName: `Account ${accountCode}`,
                    startingBalance: 0,
                    endingBalance: 0,
                    startDate: reconciliationPeriod.startDate,
                    endDate: reconciliationPeriod.endDate,
                    lastUpdated: new Date().toISOString(),
                    source: 'manual_entry',
                    ...data
                };
                updated = [...prev, newEntry];
            }

            // Save to localStorage
            localStorage.setItem('cashOnHandData', JSON.stringify(updated));
            return updated;
        });
    }, [reconciliationPeriod]);

    const handleUpdateReconciliationPeriod = useCallback((period: { startDate: string; endDate: string }) => {
        setReconciliationPeriod(period);
        // Update all cash on hand entries with new period
        setCashOnHandData(prev =>
            prev.map(item => ({
                ...item,
                startDate: period.startDate,
                endDate: period.endDate,
                lastUpdated: new Date().toISOString()
            }))
        );
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
            <Header
                activeView={activeView}
                onNavigate={setActiveView}
            />
            <main className={`p-3 sm:p-4 lg:p-6 flex-grow flex flex-col min-h-0 ${activeView === 'reconciliation' ? 'pb-24' : ''}`}>
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 gap-3">
                    <h1 className="text-2xl font-bold text-slate-800">Reconciliation Tool</h1>
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            onClick={() => setShowRulesEngine(true)}
                            className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
                        >
                            <CogIcon className="w-4 h-4" />
                            Rules
                        </button>
                        <button
                            onClick={() => setShowWorkflowGuide(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200"
                        >
                            <AcademicCapIcon className="w-5 h-5" />
                            Workflow Guide
                        </button>
                        <button
                            onClick={() => setActiveView('reports')}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                        >
                            <DocumentTextIcon className="w-4 h-4" />
                            Reports
                        </button>
                        <button
                            onClick={() => setActiveView('history')}
                            className="flex items-center gap-2 px-3 py-2 bg-teal-600 text-white font-medium rounded-lg shadow-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200"
                        >
                            <ClockIcon className="w-4 h-4" />
                            History
                        </button>
                         <button
                            onClick={handleSuggestReconciliation}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:bg-sky-300 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {isLoading ? <LoadingIcon /> : <SparklesIcon />}
                            {isLoading ? 'Analyzing...' : 'Suggest Matches'}
                        </button>
                    </div>
                </div>

                {/* Conditional View Rendering */}
                {activeView === 'reconciliation' && (
                    <>
                        <DashboardWithCashOnHand
                            crimsonTransactions={crimsonTransactions}
                            bankTransactions={bankTransactions}
                            aiSuggestions={aiSuggestions}
                            cashOnHandData={cashOnHandData}
                            selectedAccountCode={
                                Array.isArray(crimsonFilters.accountCode)
                                    ? (crimsonFilters.accountCode.includes('All') || crimsonFilters.accountCode.length === 0 ? 'P2026' : crimsonFilters.accountCode[0])
                                    : (crimsonFilters.accountCode === 'All' ? 'P2026' : crimsonFilters.accountCode)
                            }
                            reconciliationPeriod={reconciliationPeriod}
                            onUpdateCashOnHand={handleUpdateCashOnHand}
                            onUpdateReconciliationPeriod={handleUpdateReconciliationPeriod}
                        />

                        {aiMessage && (
                             <div className="flex items-center justify-center gap-4 mb-4 p-3 rounded-lg bg-sky-100 text-sky-800 border border-sky-200 shadow-sm">
                                <LightBulbIcon className="w-6 h-6 text-sky-600" />
                                <span className="text-sm font-medium">{aiMessage}</span>
                                 {aiSuggestions.length > 0 && (
                                    <div className="flex items-center gap-2 ml-auto">
                                        <button onClick={handleAcceptSuggestions} className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 text-white rounded-md text-sm font-semibold hover:bg-emerald-700 transition-colors">
                                            <CheckCircleIcon className="w-4 h-4" /> Accept
                                        </button>
                                        <button onClick={handleDeclineSuggestions} className="flex items-center gap-1.5 px-3 py-1 bg-rose-600 text-white rounded-md text-sm font-semibold hover:bg-rose-700 transition-colors">
                                            <XCircleIcon className="w-4 h-4" /> Decline
                                        </button>
                                    </div>
                                 )}
                             </div>
                        )}
                    </>
                )}

                {activeView === 'reports' && (
                    <Reports
                        onNavigateBack={() => setActiveView('reconciliation')}
                    />
                )}

                {activeView === 'history' && (
                    <ReconciliationHistory
                        sessions={reconciliationSessions}
                        onStartNewSession={handleStartNewSession}
                        onResumeSession={handleResumeSession}
                        onViewSession={handleViewSession}
                        onCertifySession={handleCertifySession}
                        onArchiveSession={handleArchiveSession}
                        onNavigateBack={() => setActiveView('reconciliation')}
                    />
                )}

                {/* Reconciliation View Content */}
                {activeView === 'reconciliation' && (
                    <>
                        {/* Unified Action Bar */}
                        <UnifiedActionBar
                            crimsonSelectedCount={selectedCrimsonIds.size}
                            crimsonSelectedTotal={selectedCrimsonTotal}
                            onCrimsonBulkReconcile={() => {}} // Removed - use main reconcile button
                            onCrimsonBulkExport={() => {}} // Removed - use footer export
                            onCrimsonClearSelection={() => setSelectedCrimsonIds(new Set())}

                            bankSelectedCount={selectedBankIds.size}
                            bankSelectedTotal={selectedBankTotal}
                            onBankBulkReconcile={() => {}} // Removed - use main reconcile button
                            onBankBulkMarkAsNrit={() => handleBulkMarkAsNrit(Array.from(selectedBankIds))}
                            onBankBulkExport={() => {}} // Removed - use footer export
                            onBankClearSelection={() => setSelectedBankIds(new Set())}

                            canReconcile={selectedCrimsonTotal - selectedBankTotal === 0 && selectedCrimsonTotal !== 0}
                            onManualReconcile={handleManualReconcile}

                            crimsonUnreconciledTotal={unreconciledCrimsonTotal}
                            bankUnreconciledTotal={unreconciledBankTotal}
                        />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4 mb-6 flex-grow min-h-0">
                    <ReconciliationPanel
                        title="Crimson Activity"
                        transactions={filteredCrimsonTransactions}
                        transactionType={TransactionType.CRIMSON}
                        statusFilter={crimsonStatusFilter}
                        onStatusFilterChange={(status) => {
                            setCrimsonStatusFilter(status);
                            setCrimsonFilters(prev => ({ ...prev, statusFilter: status }));
                        }}
                        selectedIds={selectedCrimsonIds}
                        onSelectionChange={setSelectedCrimsonIds}
                        aiSuggestions={aiSuggestions}
                        expandedRows={expandedRows}
                        onToggleExpand={setExpandedRows}
                        onCreateExpenditure={undefined}
                        onCreateReceipt={undefined}
                        filters={crimsonFilters}
                        onFiltersChange={setCrimsonFilters}
                        onCreateNewReceipt={() => setIsCreatingNewReceipt(true)}
                        onCreateNewExpenditure={() => setIsCreatingNewExpenditure(true)}
                    />
                    <ReconciliationPanel
                        title="Bank Activity"
                        transactions={filteredBankTransactions}
                        transactionType={TransactionType.BANK}
                        statusFilter={bankStatusFilter}
                        onStatusFilterChange={(status) => {
                            setBankStatusFilter(status);
                            setBankFilters(prev => ({ ...prev, statusFilter: status }));
                        }}
                        selectedIds={selectedBankIds}
                        onSelectionChange={setSelectedBankIds}
                        aiSuggestions={aiSuggestions}
                        expandedRows={expandedRows}
                        onToggleExpand={setExpandedRows}
                        onOpenImportModal={() => setIsImportModalOpen(true)}
                        onOpenSplitModal={setTransactionToSplit}
                        onMarkAsNrit={handleMarkAsNrit}
                        onUnmarkAsNrit={handleUnmarkAsNrit}
                        onCreateExpenditure={handleCreateExpenditure}
                        onCreateReceipt={handleCreateReceipt}
                        filters={bankFilters}
                        onFiltersChange={setBankFilters}
                    />
                </div>
                </>
            )}
        </main>
            <ImportModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onImport={handleImportTransactions}
            />
             <SplitTransactionModal
                isOpen={!!transactionToSplit}
                onClose={() => setTransactionToSplit(null)}
                transaction={transactionToSplit}
                onConfirmSplit={handleConfirmSplit}
            />

            <CreateExpenditureModal
                isOpen={!!expenditureModalTransaction}
                onClose={() => setExpenditureModalTransaction(null)}
                bankTransaction={expenditureModalTransaction || undefined}
                onCreateExpenditure={handleConfirmCreateExpenditure}
            />

            <CreateReceiptModal
                isOpen={!!receiptModalTransaction || isCreatingNewReceipt}
                onClose={() => {
                    setReceiptModalTransaction(null);
                    setIsCreatingNewReceipt(false);
                }}
                bankTransaction={receiptModalTransaction || undefined}
                onCreateReceipt={handleConfirmCreateReceipt}
            />

            <CreateExpenditureModal
                isOpen={isCreatingNewExpenditure}
                onClose={() => setIsCreatingNewExpenditure(false)}
                bankTransaction={undefined}
                onCreateExpenditure={handleConfirmCreateExpenditure}
            />

            <WorkflowGuide
                isVisible={showWorkflowGuide}
                onClose={() => setShowWorkflowGuide(false)}
                onSuggestMatches={handleSuggestReconciliation}
                unreconciledCount={unreconciledCrimsonTotal !== 0 ? crimsonTransactions.filter(t => !t.isReconciled).length : 0}
                aiSuggestionsCount={aiSuggestions.length}
                hasDiscrepancy={Math.abs(unreconciledCrimsonTotal - unreconciledBankTotal) > 0.01}
            />

            <RulesEngine
                isOpen={showRulesEngine}
                onClose={() => setShowRulesEngine(false)}
                rules={reconciliationRules}
                onSaveRules={(rules) => {
                    setReconciliationRules(rules);
                    addAuditEntry({
                        action: 'bulk_action',
                        details: `Updated reconciliation rules: ${rules.filter(r => r.isActive).length} active rules`,
                        transactionIds: []
                    });
                }}
            />

            <AuditTrail
                isOpen={showAuditTrail}
                onClose={() => setShowAuditTrail(false)}
                entries={auditEntries}
            />

            <ExportModal
                isOpen={showExportModal}
                onClose={() => setShowExportModal(false)}
                crimsonTransactions={crimsonTransactions}
                bankTransactions={bankTransactions}
            />

            <DataValidation
                isOpen={showDataValidation}
                onClose={() => setShowDataValidation(false)}
                crimsonTransactions={crimsonTransactions}
                bankTransactions={bankTransactions}
                onFixIssue={(issueId, transactionId) => {
                    // In a real app, this would navigate to the transaction or open an edit modal
                    console.log('Fix issue:', issueId, 'for transaction:', transactionId);
                    addAuditEntry({
                        action: 'bulk_action',
                        details: `Attempted to fix validation issue: ${issueId}`,
                        transactionIds: [transactionId]
                    });
                }}
            />

            {/* Reconciliation Footer - only show during reconciliation view */}
            <ReconciliationFooter
                isVisible={activeView === 'reconciliation'}
                onValidate={() => setShowDataValidation(true)}
                onExport={() => setShowExportModal(true)}
                onAudit={() => setShowAuditTrail(true)}
                sessionStatus="In Progress"
                progressInfo={{
                    reconciledCount: crimsonTransactions.filter(t => t.isReconciled).length + bankTransactions.filter(t => t.isReconciled).length,
                    totalCount: crimsonTransactions.length + bankTransactions.length,
                    unreconciledAmount: Math.abs(unreconciledCrimsonTotal - unreconciledBankTotal)
                }}
            />
        </div>
    );
};

export default App;