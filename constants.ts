import { CrimsonTransaction, BankTransaction, MoneyType } from './types';

export const initialCrimsonTransactions: CrimsonTransaction[] = [
    // WinRed Contributions - P2026 Fund
    { id: 'C1', date: '4/1/21', moneyType: MoneyType.Contribution, paymentType: 'WR', amount: 250, group: 'WR-Batch-001', isReconciled: false, accountCode: 'Operating P2026', fundCode: 'P2026', lineNumber: 'SA11A' },
    { id: 'C2', date: '4/1/21', moneyType: MoneyType.Contribution, paymentType: 'WR', amount: 200, group: 'WR-Batch-001', isReconciled: false, accountCode: 'Operating P2026', fundCode: 'P2026', lineNumber: 'SA11A' },
    { id: 'C3', date: '4/2/21', moneyType: MoneyType.Contribution, paymentType: 'WR', amount: 400, group: 'WR-Batch-002', isReconciled: false, accountCode: 'Operating P2026', fundCode: 'P2026', lineNumber: 'SA11A' },
    { id: 'C4', date: '4/5/21', moneyType: MoneyType.Contribution, paymentType: 'WR', amount: 25, group: 'WR-Batch-003', isReconciled: false, accountCode: 'Operating P2026', fundCode: 'P2026', lineNumber: 'SA11A' },
    { id: 'C5', date: '4/6/21', moneyType: MoneyType.Contribution, paymentType: 'WR', amount: 100, group: 'WR-Batch-004', isReconciled: false, accountCode: 'Operating P2026', fundCode: 'P2026', lineNumber: 'SA11A' },

    // WinRed Chargebacks and Fees - P2026 Fund
    { id: 'C6', date: '4/7/21', moneyType: MoneyType.WinredChargeback, paymentType: 'WR-Chargebacks', amount: -100, group: 'WR-Payout-001', isReconciled: true, accountCode: 'Operating P2026', fundCode: 'P2026', lineNumber: 'SA11A' },
    { id: 'C7', date: '4/7/21', moneyType: MoneyType.Disbursement, paymentType: 'Winred', amount: -141.45, group: 'WR-Payout-001', isReconciled: true, accountCode: 'Operating P2026', fundCode: 'P2026', lineNumber: 'SB21B' },

    // Check Contributions - P2026 Fund
    { id: 'C8', date: '4/1/21', moneyType: MoneyType.Contribution, paymentType: 'CH', amount: 225, group: '225 X', isReconciled: false, accountCode: 'Operating P2026', fundCode: 'P2026', lineNumber: 'SA11A', batchDetails: [
        { id: 'D1', amount: 200, donor: 'Donor A' },
        { id: 'D2', amount: 25, donor: 'Donor B' },
    ] },
    { id: 'C9', date: '4/1/21', moneyType: MoneyType.Contribution, paymentType: 'CA', amount: 81, group: '', isReconciled: false, accountCode: 'Operating P2026', fundCode: 'P2026', lineNumber: 'SA11A' },

    // General Fund Transactions - G2026 Fund
    { id: 'C10', date: '4/2/21', moneyType: MoneyType.OtherReceipt, paymentType: 'CH', amount: 1515, group: '', isReconciled: false, accountCode: 'Operating G2026', fundCode: 'G2026', lineNumber: 'SA11A' },
    { id: 'C11', date: '4/5/21', moneyType: MoneyType.OtherReceipt, paymentType: 'CH', amount: 1680, group: '', isReconciled: false, accountCode: 'Operating G2026', fundCode: 'G2026', lineNumber: 'SA11A' },
    { id: 'C12', date: '4/6/21', moneyType: MoneyType.OtherReceipt, paymentType: 'CH', amount: 1865, group: '', isReconciled: false, accountCode: 'Operating G2026', fundCode: 'G2026', lineNumber: 'SA11A' },

    // PAC Transactions - PAC Fund
    { id: 'C14', date: '4/3/21', moneyType: MoneyType.Contribution, paymentType: 'CH', amount: 500, group: 'PAC-001', isReconciled: false, accountCode: 'Operating PAC', fundCode: 'PAC', lineNumber: 'SA11A' },
    { id: 'C15', date: '4/4/21', moneyType: MoneyType.Contribution, paymentType: 'WR', amount: 750, group: 'PAC-002', isReconciled: false, accountCode: 'Operating PAC', fundCode: 'PAC', lineNumber: 'SA11A' },

    // JFC Transactions - JFC Fund
    { id: 'C18', date: '4/3/21', moneyType: MoneyType.Contribution, paymentType: 'CH', amount: 1000, group: 'JFC-001', isReconciled: false, accountCode: 'Operating P2026', fundCode: 'JFC', lineNumber: 'SA11A' },
    { id: 'C19', date: '4/4/21', moneyType: MoneyType.Contribution, paymentType: 'WR', amount: 2500, group: 'JFC-002', isReconciled: false, accountCode: 'Operating G2026', fundCode: 'JFC', lineNumber: 'SA11A' },

    // Savings Account - P2026 Fund
    { id: 'C16', date: '4/8/21', moneyType: MoneyType.OtherReceipt, paymentType: 'Transfer', amount: 5000, group: 'SAV-001', isReconciled: false, accountCode: 'Savings 2026', fundCode: 'P2026', lineNumber: 'SA11A' },
    { id: 'C17', date: '4/9/21', moneyType: MoneyType.OtherReceipt, paymentType: 'Interest', amount: 25.50, group: 'SAV-002', isReconciled: false, accountCode: 'Savings 2026', fundCode: 'P2026', lineNumber: 'SA11A' },

    // Debit Transaction - P2026 Fund
    { id: 'C13', date: '4/7/21', moneyType: MoneyType.Debit, paymentType: 'CH-Debit', amount: -25, group: '', isReconciled: false, accountCode: 'Operating P2026', fundCode: 'P2026', lineNumber: 'SB21B' },
];

export const initialBankTransactions: BankTransaction[] = [
    // Checking Account Deposits
    { id: 'B1', date: '4/1/21', description: 'DDA IMAGE CASH LETTER DEPOSIT', amount: 200, isReconciled: false, accountCode: 'Checking' },
    { id: 'B2', date: '4/1/21', description: 'DDA IMAGE CASH LETTER DEPOSIT', amount: 25, isReconciled: false, accountCode: 'Checking' },
    { id: 'B3', date: '4/1/21', description: 'DDA REGULAR DEPOSIT', amount: 81, isReconciled: false, accountCode: 'Checking' },
    { id: 'B8', date: '4/7/21', description: 'DDA IMAGE CASH LETTER DEPOSIT', amount: 175, isReconciled: false, accountCode: 'Checking' },
    { id: 'B9', date: '4/7/21', description: 'DOROTHY HANEY CHGBK NSF 1029', amount: -25, isReconciled: false, accountCode: 'Checking' },

    // Savings Account Activity
    { id: 'B4', date: '4/2/21', description: 'DDA IMAGE CASH LETTER DEPOSIT', amount: 1515, isReconciled: false, accountCode: 'Savings' },
    { id: 'B5', date: '4/5/21', description: 'DDA IMAGE CASH LETTER DEPOSIT', amount: 1680, isReconciled: false, accountCode: 'Savings' },
    { id: 'B6', date: '4/6/21', description: 'DDA IMAGE CASH LETTER DEPOSIT', amount: 1865, isReconciled: false, accountCode: 'Savings' },
    { id: 'B10', date: '4/7/21', description: 'TRANSFER FROM SAVINGS TO CHECKING', amount: -50000, isReconciled: false, accountCode: 'Savings' },
    { id: 'B11', date: '4/8/21', description: 'INTEREST PAYMENT', amount: 25.50, isReconciled: false, accountCode: 'Savings' },

    // Money Market Account
    { id: 'B12', date: '4/3/21', description: 'MONEY MARKET DEPOSIT', amount: 10000, isReconciled: false, accountCode: 'Money Market' },
    { id: 'B13', date: '4/4/21', description: 'MONEY MARKET INTEREST', amount: 45.75, isReconciled: false, accountCode: 'Money Market' },
    { id: 'B14', date: '4/9/21', description: 'MONEY MARKET WITHDRAWAL', amount: -2500, isReconciled: false, accountCode: 'Money Market' },

    // Credit Card Activity
    { id: 'B15', date: '4/2/21', description: 'CREDIT CARD PAYMENT', amount: -1200, isReconciled: false, accountCode: 'Credit Card' },
    { id: 'B16', date: '4/5/21', description: 'CREDIT CARD CHARGE - OFFICE SUPPLIES', amount: -350, isReconciled: false, accountCode: 'Credit Card' },
    { id: 'B17', date: '4/8/21', description: 'CREDIT CARD CHARGE - TRAVEL', amount: -875, isReconciled: false, accountCode: 'Credit Card' },

    // WinRed payout - Checking Account
    { id: 'B7', date: '4/7/21', description: 'WINRED PAYOUT', amount: 733.55, isReconciled: true, accountCode: 'Checking',
      splitDetails: {
        gross: 975,           // Total WR contributions (250+200+400+25+100)
        chargebacks: -100,    // WR chargebacks
        fees: -141.45        // WinRed processing fees (as per your example)
      }
    },
];

// Dummy data for completed reconciliation sessions
export const completedReconciliationSessions = [
    {
        id: 'session-1',
        name: 'Q4 2023 Final Reconciliation',
        startDate: '2023-12-28',
        endDate: '2023-12-31',
        status: 'certified' as const,
        user: 'Sarah Johnson',
        completedAt: '2024-01-05T10:30:00Z',
        certifiedAt: '2024-01-05T14:15:00Z',
        totalCrimsonTransactions: 45,
        totalBankTransactions: 38,
        reconciledTransactions: 42,
        discrepancies: 1,
        totalCrimsonAmount: 125750.00,
        totalBankAmount: 125750.00,
        unreconciledCrimsonAmount: 2500.00,
        unreconciledBankAmount: 0.00,
        // Accounting Balances
        startingBankBalance: 45250.00,
        endingBankBalance: 55100.00,
        startingCashOnHand: 45250.00,
        endingCashOnHand: 52600.00, // Difference due to outstanding check
        itemsInTransit: 2500.00, // Outstanding check amount
        bankServiceFees: 25.00,
        notes: 'Year-end reconciliation completed. One outstanding check for $2,500 to be carried forward.',
        crimsonTransactions: [
            {
                id: 'c-q4-1',
                date: '2023-12-29',
                contributor: 'Johnson Family Trust',
                amount: 5000.00,
                fundCode: 'Primary',
                paymentType: 'CH',
                lineNumber: 'SA11A',
                isReconciled: true,
                matchedBankId: 'b-q4-1'
            },
            {
                id: 'c-q4-2',
                date: '2023-12-30',
                contributor: 'Tech Workers PAC',
                amount: 2500.00,
                fundCode: 'Primary',
                paymentType: 'CH',
                lineNumber: 'SA11A',
                isReconciled: true,
                matchedBankId: 'b-q4-2'
            },
            {
                id: 'c-q4-3',
                date: '2023-12-31',
                contributor: 'Annual Gala Proceeds',
                amount: 15000.00,
                fundCode: 'Primary',
                paymentType: 'CH',
                lineNumber: 'SA11A',
                isReconciled: true,
                matchedBankId: 'b-q4-3'
            },
            {
                id: 'c-q4-4',
                date: '2023-12-28',
                contributor: 'Media Consulting LLC',
                amount: -8500.00,
                fundCode: 'Primary',
                paymentType: 'CH',
                lineNumber: 'SB21B',
                isReconciled: false,
                matchedBankId: null
            },
            {
                id: 'c-q4-5',
                date: '2023-12-30',
                contributor: 'Small Donor Batch #12',
                amount: 850.00,
                fundCode: 'Primary',
                paymentType: 'CC',
                lineNumber: 'SA11A',
                isReconciled: true,
                matchedBankId: 'b-q4-4'
            },
            {
                id: 'c-q4-6',
                date: '2023-12-31',
                contributor: 'Office Rent Payment',
                amount: -2000.00,
                fundCode: 'Primary',
                paymentType: 'CH',
                lineNumber: 'SB21B',
                isReconciled: true,
                matchedBankId: 'b-q4-5'
            }
        ],
        bankTransactions: [
            {
                id: 'b-q4-1',
                date: '2023-12-29',
                description: 'DEPOSIT - JOHNSON FAMILY TRUST',
                amount: 5000.00,
                isReconciled: true,
                isNrit: false,
                accountCode: 'Operating',
                matchedCrimsonId: 'c-q4-1'
            },
            {
                id: 'b-q4-2',
                date: '2023-12-30',
                description: 'CHECK DEPOSIT - TECH WORKERS PAC',
                amount: 2500.00,
                isReconciled: true,
                isNrit: false,
                accountCode: 'Operating',
                matchedCrimsonId: 'c-q4-2'
            },
            {
                id: 'b-q4-3',
                date: '2023-12-31',
                description: 'WIRE TRANSFER - GALA PROCEEDS',
                amount: 15000.00,
                isReconciled: true,
                isNrit: false,
                accountCode: 'Operating',
                matchedCrimsonId: 'c-q4-3'
            },
            {
                id: 'b-q4-4',
                date: '2023-12-30',
                description: 'CREDIT CARD BATCH DEPOSIT',
                amount: 850.00,
                isReconciled: true,
                isNrit: false,
                accountCode: 'Operating',
                matchedCrimsonId: 'c-q4-5'
            },
            {
                id: 'b-q4-5',
                date: '2023-12-31',
                description: 'CHECK 1003 - OFFICE RENT',
                amount: -2000.00,
                isReconciled: true,
                isNrit: false,
                accountCode: 'Operating',
                matchedCrimsonId: 'c-q4-6'
            },
            {
                id: 'b-q4-6',
                date: '2023-12-29',
                description: 'BANK SERVICE FEE',
                amount: -25.00,
                isReconciled: false,
                isNrit: true,
                accountCode: 'Operating',
                matchedCrimsonId: null
            }
        ]
    },
    {
        id: 'session-2',
        name: 'January 2024 Monthly Reconciliation',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        status: 'certified' as const,
        user: 'Mike Chen',
        completedAt: '2024-02-02T09:15:00Z',
        certifiedAt: '2024-02-02T11:30:00Z',
        totalCrimsonTransactions: 67,
        totalBankTransactions: 52,
        reconciledTransactions: 64,
        discrepancies: 0,
        totalCrimsonAmount: 89250.00,
        totalBankAmount: 89250.00,
        unreconciledCrimsonAmount: 0.00,
        unreconciledBankAmount: 0.00,
        // Accounting Balances
        startingBankBalance: 52600.00, // Ending balance from previous period
        endingBankBalance: 62100.00,
        startingCashOnHand: 52600.00,
        endingCashOnHand: 62100.00, // Perfect match - no items in transit
        itemsInTransit: 0.00,
        bankServiceFees: 0.00,
        notes: 'Clean reconciliation with no discrepancies. All transactions matched successfully.',
        crimsonTransactions: [
            {
                id: 'c-jan-1',
                date: '2024-01-15',
                contributor: 'Small Donor Batch #1',
                amount: 1250.00,
                fundCode: 'Primary',
                paymentType: 'CC',
                lineNumber: 'SA11A',
                isReconciled: true,
                matchedBankId: 'b-jan-1'
            },
            {
                id: 'c-jan-2',
                date: '2024-01-20',
                contributor: 'Corporate Sponsor ABC',
                amount: 5000.00,
                fundCode: 'Primary',
                paymentType: 'CH',
                lineNumber: 'SA11A',
                isReconciled: true,
                matchedBankId: 'b-jan-2'
            },
            {
                id: 'c-jan-3',
                date: '2024-01-25',
                contributor: 'Event Ticket Sales',
                amount: 3500.00,
                fundCode: 'Primary',
                paymentType: 'CH',
                lineNumber: 'SA11A',
                isReconciled: true,
                matchedBankId: 'b-jan-3'
            },
            {
                id: 'c-jan-4',
                date: '2024-01-10',
                contributor: 'Individual Donor - Smith',
                amount: 2800.00,
                fundCode: 'Primary',
                paymentType: 'CH',
                lineNumber: 'SA11A',
                isReconciled: true,
                matchedBankId: 'b-jan-4'
            },
            {
                id: 'c-jan-5',
                date: '2024-01-28',
                contributor: 'Campaign Materials',
                amount: -1200.00,
                fundCode: 'Primary',
                paymentType: 'CH',
                lineNumber: 'SB21B',
                isReconciled: true,
                matchedBankId: 'b-jan-5'
            },
            {
                id: 'c-jan-6',
                date: '2024-01-31',
                contributor: 'Monthly Sustainer Batch',
                amount: 950.00,
                fundCode: 'Primary',
                paymentType: 'CC',
                lineNumber: 'SA11A',
                isReconciled: true,
                matchedBankId: 'b-jan-6'
            }
        ],
        bankTransactions: [
            {
                id: 'b-jan-1',
                date: '2024-01-15',
                description: 'CREDIT CARD BATCH DEPOSIT',
                amount: 1250.00,
                isReconciled: true,
                isNrit: false,
                accountCode: 'Operating',
                matchedCrimsonId: 'c-jan-1'
            },
            {
                id: 'b-jan-2',
                date: '2024-01-20',
                description: 'CHECK DEPOSIT - ABC CORP',
                amount: 5000.00,
                isReconciled: true,
                isNrit: false,
                accountCode: 'Operating',
                matchedCrimsonId: 'c-jan-2'
            },
            {
                id: 'b-jan-3',
                date: '2024-01-25',
                description: 'WIRE TRANSFER - EVENT PROCEEDS',
                amount: 3500.00,
                isReconciled: true,
                isNrit: false,
                accountCode: 'Operating',
                matchedCrimsonId: 'c-jan-3'
            },
            {
                id: 'b-jan-4',
                date: '2024-01-10',
                description: 'CHECK DEPOSIT - SMITH DONATION',
                amount: 2800.00,
                isReconciled: true,
                isNrit: false,
                accountCode: 'Operating',
                matchedCrimsonId: 'c-jan-4'
            },
            {
                id: 'b-jan-5',
                date: '2024-01-28',
                description: 'CHECK 1004 - CAMPAIGN MATERIALS',
                amount: -1200.00,
                isReconciled: true,
                isNrit: false,
                accountCode: 'Operating',
                matchedCrimsonId: 'c-jan-5'
            },
            {
                id: 'b-jan-6',
                date: '2024-01-31',
                description: 'RECURRING DONOR PROCESSOR',
                amount: 950.00,
                isReconciled: true,
                isNrit: false,
                accountCode: 'Operating',
                matchedCrimsonId: 'c-jan-6'
            }
        ]
    },
    {
        id: 'session-3',
        name: 'February 2024 Monthly Reconciliation',
        startDate: '2024-02-01',
        endDate: '2024-02-29',
        status: 'completed' as const,
        user: 'Sarah Johnson',
        completedAt: '2024-03-01T16:45:00Z',
        totalCrimsonTransactions: 89,
        totalBankTransactions: 76,
        reconciledTransactions: 85,
        discrepancies: 2,
        totalCrimsonAmount: 156780.50,
        totalBankAmount: 154280.50,
        unreconciledCrimsonAmount: 2500.00,
        unreconciledBankAmount: 0.00,
        notes: 'Two small discrepancies identified - pending vendor payment confirmations.',
        crimsonTransactions: [
            {
                id: 'c-feb-1',
                date: '2024-02-05',
                contributor: 'Major Donor Smith',
                amount: 10000.00,
                fundCode: 'Primary',
                paymentType: 'CH',
                lineNumber: 'SA11A',
                isReconciled: true,
                matchedBankId: 'b-feb-1'
            },
            {
                id: 'c-feb-2',
                date: '2024-02-14',
                contributor: 'Valentine\'s Day Fundraiser',
                amount: 7500.00,
                fundCode: 'Primary',
                paymentType: 'CC',
                lineNumber: 'SA11A',
                isReconciled: true,
                matchedBankId: 'b-feb-2'
            },
            {
                id: 'c-feb-3',
                date: '2024-02-20',
                contributor: 'Digital Marketing Agency',
                amount: -4500.00,
                fundCode: 'Primary',
                paymentType: 'CH',
                lineNumber: 'SB21B',
                isReconciled: false,
                matchedBankId: null
            }
        ],
        bankTransactions: [
            {
                id: 'b-feb-1',
                date: '2024-02-05',
                description: 'LARGE DONOR CHECK DEPOSIT',
                amount: 10000.00,
                isReconciled: true,
                isNrit: false,
                accountCode: 'Operating',
                matchedCrimsonId: 'c-feb-1'
            },
            {
                id: 'b-feb-2',
                date: '2024-02-14',
                description: 'CREDIT CARD PROCESSOR DEPOSIT',
                amount: 7500.00,
                isReconciled: true,
                isNrit: false,
                accountCode: 'Operating',
                matchedCrimsonId: 'c-feb-2'
            }
        ]
    },
    {
        id: 'session-4',
        name: 'March 2024 Monthly Reconciliation',
        startDate: '2024-03-01',
        endDate: '2024-03-31',
        status: 'completed' as const,
        user: 'Alex Rivera',
        completedAt: '2024-04-03T11:20:00Z',
        totalCrimsonTransactions: 112,
        totalBankTransactions: 98,
        reconciledTransactions: 108,
        discrepancies: 1,
        totalCrimsonAmount: 203450.75,
        totalBankAmount: 203450.75,
        unreconciledCrimsonAmount: 1200.00,
        unreconciledBankAmount: 0.00,
        notes: 'Spring fundraising surge. One pending reimbursement check.',
        crimsonTransactions: [
            {
                id: 'c-mar-1',
                date: '2024-03-10',
                contributor: 'Spring Gala Proceeds',
                amount: 25000.00,
                fundCode: 'Primary',
                paymentType: 'CH',
                lineNumber: 'SA11A',
                isReconciled: true,
                matchedBankId: 'b-mar-1'
            },
            {
                id: 'c-mar-2',
                date: '2024-03-15',
                contributor: 'Online Donation Drive',
                amount: 8750.00,
                fundCode: 'Primary',
                paymentType: 'CC',
                lineNumber: 'SA11A',
                isReconciled: true,
                matchedBankId: 'b-mar-2'
            },
            {
                id: 'c-mar-3',
                date: '2024-03-22',
                contributor: 'Staff Reimbursement',
                amount: -1200.00,
                fundCode: 'Primary',
                paymentType: 'CH',
                lineNumber: 'SB29',
                isReconciled: false,
                matchedBankId: null
            }
        ],
        bankTransactions: [
            {
                id: 'b-mar-1',
                date: '2024-03-10',
                description: 'GALA EVENT DEPOSIT BATCH',
                amount: 25000.00,
                isReconciled: true,
                isNrit: false,
                accountCode: 'Operating',
                matchedCrimsonId: 'c-mar-1'
            },
            {
                id: 'b-mar-2',
                date: '2024-03-15',
                description: 'ONLINE DONATION PROCESSOR',
                amount: 8750.00,
                isReconciled: true,
                isNrit: false,
                accountCode: 'Operating',
                matchedCrimsonId: 'c-mar-2'
            }
        ]
    },
    {
        id: 'session-5',
        name: 'April 2024 Monthly Reconciliation',
        startDate: '2024-04-01',
        endDate: '2024-04-30',
        status: 'in_progress' as const,
        user: 'Sarah Johnson',
        completedAt: null,
        totalCrimsonTransactions: 95,
        totalBankTransactions: 87,
        reconciledTransactions: 78,
        discrepancies: 3,
        totalCrimsonAmount: 178920.25,
        totalBankAmount: 175420.25,
        unreconciledCrimsonAmount: 15600.00,
        unreconciledBankAmount: 3500.00,
        notes: 'Currently in progress. Several large transactions pending review.',
        crimsonTransactions: [
            {
                id: 'c-apr-1',
                date: '2024-04-08',
                contributor: 'Corporate Partnership',
                amount: 15000.00,
                fundCode: 'Primary',
                paymentType: 'CH',
                lineNumber: 'SA11A',
                isReconciled: true,
                matchedBankId: 'b-apr-1'
            },
            {
                id: 'c-apr-2',
                date: '2024-04-12',
                contributor: 'Monthly Sustainer Batch',
                amount: 4250.00,
                fundCode: 'Primary',
                paymentType: 'CC',
                lineNumber: 'SA11A',
                isReconciled: true,
                matchedBankId: 'b-apr-2'
            },
            {
                id: 'c-apr-3',
                date: '2024-04-18',
                contributor: 'Large Individual Donor',
                amount: 12500.00,
                fundCode: 'Primary',
                paymentType: 'CH',
                lineNumber: 'SA11A',
                isReconciled: false,
                matchedBankId: null
            },
            {
                id: 'c-apr-4',
                date: '2024-04-25',
                contributor: 'Consulting Services',
                amount: -7500.00,
                fundCode: 'Primary',
                paymentType: 'CH',
                lineNumber: 'SB21B',
                isReconciled: false,
                matchedBankId: null
            }
        ],
        bankTransactions: [
            {
                id: 'b-apr-1',
                date: '2024-04-08',
                description: 'CORPORATE PARTNERSHIP WIRE',
                amount: 15000.00,
                isReconciled: true,
                isNrit: false,
                accountCode: 'Operating',
                matchedCrimsonId: 'c-apr-1'
            },
            {
                id: 'b-apr-2',
                date: '2024-04-12',
                description: 'RECURRING DONOR BATCH',
                amount: 4250.00,
                isReconciled: true,
                isNrit: false,
                accountCode: 'Operating',
                matchedCrimsonId: 'c-apr-2'
            },
            {
                id: 'b-apr-3',
                date: '2024-04-20',
                description: 'UNIDENTIFIED LARGE DEPOSIT',
                amount: 12000.00,
                isReconciled: false,
                isNrit: false,
                accountCode: 'Operating',
                matchedCrimsonId: null
            }
        ]
    }
];