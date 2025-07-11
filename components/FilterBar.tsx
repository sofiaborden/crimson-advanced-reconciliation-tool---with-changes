import React from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from './Icons';
import { ReconciliationStatus, FilterOptions } from '../types';

export type { FilterOptions };
import { MultiSelect } from './MultiSelect';

interface FilterBarProps {
    statusFilter: ReconciliationStatus;
    onStatusFilterChange: (status: ReconciliationStatus) => void;
    isCrimson: boolean;
    filters: FilterOptions;
    onFiltersChange: (filters: FilterOptions) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ statusFilter, onStatusFilterChange, isCrimson, filters, onFiltersChange }) => {
    const updateFilter = (key: keyof FilterOptions, value: any) => {
        onFiltersChange({ ...filters, [key]: value });
    };

    const clearAllFilters = () => {
        onFiltersChange({
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
        onStatusFilterChange(ReconciliationStatus.Unreconciled);
    };

    const isFundCodeFiltered = Array.isArray(filters.fundCode)
        ? !filters.fundCode.includes('All') && filters.fundCode.length > 0
        : filters.fundCode !== 'All';

    const isAccountCodeFiltered = Array.isArray(filters.accountCode)
        ? !filters.accountCode.includes('All') && filters.accountCode.length > 0
        : filters.accountCode !== 'All';

    const isPaymentTypeFiltered = Array.isArray(filters.paymentType)
        ? !filters.paymentType.includes('All') && filters.paymentType.length > 0
        : filters.paymentType !== 'All';

    const isLineNumberFiltered = Array.isArray(filters.lineNumber)
        ? !filters.lineNumber.includes('All') && filters.lineNumber.length > 0
        : filters.lineNumber !== 'All';

    const hasActiveFilters = filters.searchText ||
        filters.dateRange.start ||
        filters.dateRange.end ||
        filters.amountRange.min !== null ||
        filters.amountRange.max !== null ||
        isFundCodeFiltered ||
        isAccountCodeFiltered ||
        isPaymentTypeFiltered ||
        isLineNumberFiltered;

    const activeFilterCount = [
        filters.searchText,
        filters.dateRange.start || filters.dateRange.end,
        filters.amountRange.min !== null || filters.amountRange.max !== null,
        isFundCodeFiltered,
        isAccountCodeFiltered,
        isPaymentTypeFiltered,
        isLineNumberFiltered
    ].filter(Boolean).length;

    return (
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
            {/* Compact Top Row */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
                {/* Search */}
                <div className="flex-1 min-w-[200px] relative">
                    <MagnifyingGlassIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={filters.searchText}
                        onChange={(e) => updateFilter('searchText', e.target.value)}
                        className="w-full pl-8 pr-8 py-1.5 border border-slate-300 rounded text-sm focus:ring-sky-500 focus:border-sky-500"
                    />
                    {filters.searchText && (
                        <button
                            onClick={() => updateFilter('searchText', '')}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            <XMarkIcon className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Status Toggle */}
                <div className="flex rounded border border-slate-300 overflow-hidden">
                    <button
                        onClick={() => onStatusFilterChange(ReconciliationStatus.Unreconciled)}
                        className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                            statusFilter === ReconciliationStatus.Unreconciled 
                                ? 'bg-sky-600 text-white' 
                                : 'bg-white text-slate-700 hover:bg-slate-100'
                        }`}
                    >
                        Unreconciled
                    </button>
                    <button
                        onClick={() => onStatusFilterChange(ReconciliationStatus.All)}
                        className={`px-3 py-1.5 text-xs font-medium border-l border-slate-300 transition-colors ${
                            statusFilter === ReconciliationStatus.All 
                                ? 'bg-sky-600 text-white' 
                                : 'bg-white text-slate-700 hover:bg-slate-100'
                        }`}
                    >
                        All
                    </button>
                </div>

                {/* Quick Filters */}
                <button
                    onClick={() => updateFilter('showAdvanced', !filters.showAdvanced)}
                    className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                        filters.showAdvanced 
                            ? 'bg-sky-100 text-sky-800' 
                            : 'bg-white text-slate-600 hover:bg-slate-100'
                    } border border-slate-300`}
                >
                    Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
                </button>

                {hasActiveFilters && (
                    <button
                        onClick={clearAllFilters}
                        className="px-2 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                        title="Clear all filters"
                    >
                        <XMarkIcon className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Expandable Advanced Filters */}
            {filters.showAdvanced && (
                <div className="border-t border-slate-200 pt-3 space-y-3">
                    {/* Date and Amount Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Date Range</label>
                            <div className="flex gap-1">
                                <input
                                    type="date"
                                    value={filters.dateRange.start}
                                    onChange={(e) => updateFilter('dateRange', { ...filters.dateRange, start: e.target.value })}
                                    className="flex-1 p-1.5 border border-slate-300 rounded text-xs focus:ring-sky-500 focus:border-sky-500"
                                />
                                <input
                                    type="date"
                                    value={filters.dateRange.end}
                                    onChange={(e) => updateFilter('dateRange', { ...filters.dateRange, end: e.target.value })}
                                    className="flex-1 p-1.5 border border-slate-300 rounded text-xs focus:ring-sky-500 focus:border-sky-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Amount Range</label>
                            <div className="flex gap-1">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={filters.amountRange.min || ''}
                                    onChange={(e) => updateFilter('amountRange', { ...filters.amountRange, min: e.target.value ? parseFloat(e.target.value) : null })}
                                    className="flex-1 p-1.5 border border-slate-300 rounded text-xs focus:ring-sky-500 focus:border-sky-500"
                                />
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={filters.amountRange.max || ''}
                                    onChange={(e) => updateFilter('amountRange', { ...filters.amountRange, max: e.target.value ? parseFloat(e.target.value) : null })}
                                    className="flex-1 p-1.5 border border-slate-300 rounded text-xs focus:ring-sky-500 focus:border-sky-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Category Filters Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        <MultiSelect
                            label={isCrimson ? 'Fund Code' : 'Transaction Type'}
                            options={[
                                { value: 'All', label: 'All' },
                                ...(isCrimson ? [
                                    { value: 'P2026', label: 'P2026' },
                                    { value: 'G2026', label: 'G2026' },
                                    { value: 'PAC', label: 'PAC' },
                                    { value: 'JFC', label: 'JFC' }
                                ] : [
                                    { value: 'Credit', label: 'Credit Only' },
                                    { value: 'Debit', label: 'Debit Only' }
                                ])
                            ]}
                            selectedValues={Array.isArray(filters.fundCode) ? filters.fundCode : [filters.fundCode]}
                            onChange={(values) => updateFilter('fundCode', values)}
                        />
                        <MultiSelect
                            label={isCrimson ? 'Payment Type' : 'Description Filter'}
                            options={[
                                { value: 'All', label: 'All' },
                                ...(isCrimson ? [
                                    { value: 'CH', label: 'CH - Check' },
                                    { value: 'CC', label: 'CC - Credit Card' },
                                    { value: 'JF', label: 'JF - Joint Fundraising' },
                                    { value: 'IK', label: 'IK - In-Kind' },
                                    { value: 'OT', label: 'OT - Other' },
                                    { value: 'WR', label: 'WR - WinRed' },
                                    { value: 'AN', label: 'AN - ActBlue' },
                                    { value: 'CA', label: 'CA - Cash' },
                                    { value: 'Winred', label: 'Winred - Fees' },
                                    { value: 'WR-Chargebacks', label: 'WR-Chargebacks' },
                                    { value: 'CH-Debit', label: 'CH-Debit' },
                                    { value: 'Transfer', label: 'Transfer' },
                                    { value: 'Interest', label: 'Interest' }
                                ] : [
                                    { value: 'DEPOSIT', label: 'Deposits' },
                                    { value: 'WITHDRAWAL', label: 'Withdrawals' },
                                    { value: 'TRANSFER', label: 'Transfers' },
                                    { value: 'INTEREST', label: 'Interest' },
                                    { value: 'FEE', label: 'Fees' },
                                    { value: 'WINRED', label: 'WinRed Payouts' },
                                    { value: 'CHARGEBACK', label: 'Chargebacks' }
                                ])
                            ]}
                            selectedValues={Array.isArray(filters.paymentType) ? filters.paymentType : [filters.paymentType]}
                            onChange={(values) => updateFilter('paymentType', values)}
                        />
                    </div>

                    {/* Additional Filters */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        <MultiSelect
                            label="Account Code"
                            options={[
                                { value: 'All', label: 'All' },
                                ...(isCrimson ? [
                                    { value: 'Operating P2026', label: 'Operating P2026' },
                                    { value: 'Operating G2026', label: 'Operating G2026' },
                                    { value: 'Operating PAC', label: 'Operating PAC' },
                                    { value: 'Savings 2026', label: 'Savings 2026' }
                                ] : [
                                    { value: 'Checking', label: 'Checking Account' },
                                    { value: 'Savings', label: 'Savings Account' },
                                    { value: 'Money Market', label: 'Money Market' },
                                    { value: 'Credit Card', label: 'Credit Card' }
                                ])
                            ]}
                            selectedValues={Array.isArray(filters.accountCode) ? filters.accountCode : [filters.accountCode]}
                            onChange={(values) => updateFilter('accountCode', values)}
                        />
                        {isCrimson && isFundCodeFiltered && (
                            <MultiSelect
                                label="Line Number"
                                options={[
                                    { value: 'All', label: 'All' },
                                    { value: 'SA11A', label: 'SA11A - Contributions' },
                                    { value: 'SA17', label: 'SA17 - Refunds' },
                                    { value: 'SB21B', label: 'SB21B - Operating Expenditures' },
                                    { value: 'SB23', label: 'SB23 - Contributions to Candidates' },
                                    { value: 'SB29', label: 'SB29 - JFC Transfers Out' },
                                    { value: 'SC10', label: 'SC10 - Loans Received' },
                                    { value: 'SD10', label: 'SD10 - Debts and Obligations' }
                                ]}
                                selectedValues={Array.isArray(filters.lineNumber) ? filters.lineNumber : [filters.lineNumber || 'All']}
                                onChange={(values) => updateFilter('lineNumber', values)}
                            />
                        )}
                    </div>
                </div>
            )}

            {/* Active Filters Pills */}
            {hasActiveFilters && (
                <div className="mt-3 pt-2 border-t border-slate-200">
                    <div className="flex flex-wrap gap-1 items-center">
                        <span className="text-xs text-slate-500 mr-1">Active:</span>
                        {filters.searchText && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-sky-100 text-sky-800 text-xs rounded">
                                "{filters.searchText.substring(0, 15)}{filters.searchText.length > 15 ? '...' : ''}"
                                <button onClick={() => updateFilter('searchText', '')} className="hover:text-sky-600">
                                    <XMarkIcon className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {(filters.dateRange.start || filters.dateRange.end) && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs rounded">
                                Date range
                                <button onClick={() => updateFilter('dateRange', { start: '', end: '' })} className="hover:text-emerald-600">
                                    <XMarkIcon className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {(filters.amountRange.min !== null || filters.amountRange.max !== null) && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded">
                                Amount range
                                <button onClick={() => updateFilter('amountRange', { min: null, max: null })} className="hover:text-purple-600">
                                    <XMarkIcon className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {isFundCodeFiltered && (
                            <>
                                {(Array.isArray(filters.fundCode) ? filters.fundCode : [filters.fundCode])
                                    .filter(code => code !== 'All')
                                    .map(code => (
                                        <span key={`fund-${code}`} className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-800 text-xs rounded">
                                            Fund: {code}
                                            <button
                                                onClick={() => {
                                                    const currentCodes = Array.isArray(filters.fundCode) ? filters.fundCode : [filters.fundCode];
                                                    const newCodes = currentCodes.filter(c => c !== code);
                                                    updateFilter('fundCode', newCodes.length === 0 ? ['All'] : newCodes);
                                                }}
                                                className="hover:text-orange-600"
                                            >
                                                <XMarkIcon className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))
                                }
                            </>
                        )}
                        {isPaymentTypeFiltered && (
                            <>
                                {(Array.isArray(filters.paymentType) ? filters.paymentType : [filters.paymentType])
                                    .filter(type => type !== 'All')
                                    .map(type => (
                                        <span key={`payment-${type}`} className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs rounded">
                                            Payment: {type}
                                            <button
                                                onClick={() => {
                                                    const currentTypes = Array.isArray(filters.paymentType) ? filters.paymentType : [filters.paymentType];
                                                    const newTypes = currentTypes.filter(t => t !== type);
                                                    updateFilter('paymentType', newTypes.length === 0 ? ['All'] : newTypes);
                                                }}
                                                className="hover:text-indigo-600"
                                            >
                                                <XMarkIcon className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))
                                }
                            </>
                        )}
                        {isAccountCodeFiltered && (
                            <>
                                {(Array.isArray(filters.accountCode) ? filters.accountCode : [filters.accountCode])
                                    .filter(code => code !== 'All')
                                    .map(code => (
                                        <span key={`account-${code}`} className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-100 text-rose-800 text-xs rounded">
                                            Account: {code}
                                            <button
                                                onClick={() => {
                                                    const currentCodes = Array.isArray(filters.accountCode) ? filters.accountCode : [filters.accountCode];
                                                    const newCodes = currentCodes.filter(c => c !== code);
                                                    updateFilter('accountCode', newCodes.length === 0 ? ['All'] : newCodes);
                                                }}
                                                className="hover:text-rose-600"
                                            >
                                                <XMarkIcon className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))
                                }
                            </>
                        )}
                        {isLineNumberFiltered && (
                            <>
                                {(Array.isArray(filters.lineNumber) ? filters.lineNumber : [filters.lineNumber])
                                    .filter(line => line !== 'All' && line)
                                    .map(line => (
                                        <span key={`line-${line}`} className="inline-flex items-center gap-1 px-2 py-0.5 bg-teal-100 text-teal-800 text-xs rounded">
                                            Line: {line}
                                            <button
                                                onClick={() => {
                                                    const currentLines = Array.isArray(filters.lineNumber) ? filters.lineNumber : [filters.lineNumber];
                                                    const newLines = currentLines.filter(l => l !== line);
                                                    updateFilter('lineNumber', newLines.length === 0 ? ['All'] : newLines);
                                                }}
                                                className="hover:text-teal-600"
                                            >
                                                <XMarkIcon className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))
                                }
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
