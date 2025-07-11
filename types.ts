export enum ReconciliationStatus {
    All = 'All',
    Unreconciled = 'Unreconciled',
}

export enum TransactionType {
    CRIMSON = 'CRIMSON',
    BANK = 'BANK',
}

export enum MoneyType {
    Contribution = 'Contribution',
    OtherReceipt = 'Other Receipt',
    Disbursement = 'Disbursement',
    Chargeback = 'Chargeback',
    Debit = 'Debit',
    Winred = 'Winred',
    WinredChargeback = 'Winred Chargeback',
}

export interface CrimsonTransaction {
    id: string;
    date: string;
    moneyType: MoneyType;
    paymentType: string;
    amount: number;
    group: string;
    isReconciled: boolean;
    accountCode?: string;
    fundCode?: string; // Fund code for filtering (P2026, G2026, PAC, JFC)
    lineNumber?: string;
    batchDetails?: { id: string, amount: number, donor: string }[];
}

export interface BankTransaction {
    id: string;
    date: string;
    description: string;
    amount: number;
    isReconciled: boolean;
    isNrit?: boolean;
    accountCode?: string;
    splitDetails?: { gross: number, chargebacks: number, fees: number };
}

export type AnyTransaction = CrimsonTransaction | BankTransaction;

export interface CashOnHandData {
  accountCode: string;
  accountName: string;
  startingBalance: number;
  endingBalance: number;
  startDate: string;
  endDate: string;
  lastUpdated: string;
  source: 'previous_session' | 'manual_entry';
}

export interface MatchedPair {
  crimsonTransactionId: string;
  bankTransactionId: string[];
  confidenceScore: number;
  reasoning: string;
}

export interface ReconciliationStats {
  totalCrimsonTransactions: number;
  totalBankTransactions: number;
  reconciledCrimsonTransactions: number;
  reconciledBankTransactions: number;
  unreconciledCrimsonAmount: number;
  unreconciledBankAmount: number;
  totalCrimsonAmount: number;
  totalBankAmount: number;
  reconciliationProgress: number;
  lastReconciliationDate?: string;
  aiSuggestionsCount: number;
  nritTransactionsCount: number;
}

export interface FilterOptions {
  statusFilter: ReconciliationStatus;
  searchText: string;
  dateRange: { start: string; end: string };
  amountRange: { min: number | null; max: number | null };
  fundCode: string | string[]; // Support both single and multiple selection
  accountCode: string | string[]; // Support both single and multiple selection
  paymentType: string | string[]; // Support both single and multiple selection
  lineNumber?: string | string[]; // Support both single and multiple selection
  showAdvanced: boolean;
}

// Reconciliation History & Reporting Types
export interface ReconciliationSession {
  id: string;
  name: string; // e.g., "Q1 2024 Reconciliation", "October 2024 Monthly Rec"
  period: {
    start: string;
    end: string;
    type: 'monthly' | 'quarterly' | 'annual' | 'custom';
  };
  status: 'in_progress' | 'completed' | 'certified' | 'archived';
  createdBy: string;
  createdAt: string;
  completedAt?: string;
  certifiedAt?: string;
  certifiedBy?: string;

  // Reconciliation Results
  summary: {
    totalCrimsonTransactions: number;
    totalBankTransactions: number;
    reconciledCrimsonTransactions: number;
    reconciledBankTransactions: number;
    totalCrimsonAmount: number;
    totalBankAmount: number;
    discrepancyAmount: number;
    unresolvedDiscrepancies: number;
  };

  // Fund-specific results
  fundResults: {
    [fundCode: string]: {
      reconciledTransactions: number;
      reconciledAmount: number;
      unreconciledTransactions: number;
      unreconciledAmount: number;
      discrepancies: DiscrepancyItem[];
    };
  };

  // FEC Line Item results
  fecLineResults: {
    [lineNumber: string]: {
      reconciledTransactions: number;
      reconciledAmount: number;
      unreconciledTransactions: number;
      unreconciledAmount: number;
    };
  };

  // Actions taken during reconciliation
  actions: ReconciliationAction[];

  // Compliance notes and certifications
  complianceNotes: string;
  materialDiscrepancies: string;
  internalControlsAssessment: string;
}

export interface DiscrepancyItem {
  id: string;
  type: 'amount_mismatch' | 'missing_transaction' | 'duplicate' | 'timing_difference' | 'classification_error';
  description: string;
  amount: number;
  transactionIds: string[];
  status: 'identified' | 'investigating' | 'resolved' | 'accepted';
  resolution?: string;
  resolvedBy?: string;
  resolvedAt?: string;
}

export interface ReconciliationAction {
  id: string;
  timestamp: string;
  user: string;
  type: 'manual_match' | 'override_suggestion' | 'create_adjustment' | 'mark_resolved' | 'add_note';
  description: string;
  transactionIds: string[];
  amount?: number;
  justification?: string;
}

export interface ReconciliationReport {
  id: string;
  sessionId: string;
  type: ReportType;
  name: string;
  generatedAt: string;
  generatedBy: string;
  parameters: ReportParameters;
  data: any; // Report-specific data structure
  exportFormats: ('pdf' | 'excel' | 'csv')[];
}

export enum ReportType {
  RECONCILIATION_SUMMARY = 'reconciliation_summary',
  FUND_BY_FUND = 'fund_by_fund',
  FEC_LINE_ITEM = 'fec_line_item',
  BANK_ACCOUNT_REC = 'bank_account_rec',
  DISCREPANCY_ANALYSIS = 'discrepancy_analysis',
  COMPLIANCE_CERTIFICATION = 'compliance_certification',
  AUDIT_TRAIL = 'audit_trail',
  CASH_FLOW_BY_FUND = 'cash_flow_by_fund',
  CONTRIBUTION_ANALYSIS = 'contribution_analysis',
  VENDOR_PAYMENT_REC = 'vendor_payment_rec'
}

export interface ReportParameters {
  sessionId: string;
  dateRange?: { start: string; end: string };
  fundCodes?: string[];
  lineNumbers?: string[];
  accountCodes?: string[];
  includeResolved?: boolean;
  includeUnresolved?: boolean;
  detailLevel: 'summary' | 'detailed' | 'full';
}