import React, { useState } from 'react';
import { BankTransaction, CrimsonTransaction, MoneyType } from '../types';
import { XMarkIcon, CalendarIcon, DocumentTextIcon } from './Icons';

interface CreateReceiptModalProps {
    isOpen: boolean;
    onClose: () => void;
    bankTransaction?: BankTransaction;
    onCreateReceipt: (receipt: CrimsonTransaction) => void;
}

export const CreateReceiptModal: React.FC<CreateReceiptModalProps> = ({
    isOpen,
    onClose,
    bankTransaction,
    onCreateReceipt
}) => {
    const [formData, setFormData] = useState({
        receiptDate: bankTransaction?.date || new Date().toISOString().split('T')[0],
        amount: bankTransaction?.amount || 0,
        fund: 'P2026',
        account: 'Operating P2026',
        paymentMethod: 'CH',
        lineNumber: 'SA11A',
        description: '',
        memoText: '',
        transactionCategory: 'Contribution',
        electionCode: 'P2026',
        year: '2026',
        memoIndicator: false
    });

    const [contributorInfo, setContributorInfo] = useState({
        name: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        occupation: '',
        employer: ''
    });

    if (!isOpen) return null;

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleContributorChange = (field: string, value: string) => {
        setContributorInfo(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        const newReceipt: CrimsonTransaction = {
            id: `C${Date.now()}`,
            date: formData.receiptDate,
            moneyType: MoneyType.OtherReceipt,
            paymentType: formData.paymentMethod,
            amount: formData.amount,
            group: `REC-${bankTransaction?.id || Date.now()}`,
            isReconciled: false,
            accountCode: formData.account,
            fundCode: formData.fund,
            lineNumber: formData.lineNumber,
            description: formData.description || contributorInfo.name || 'Receipt',
            contributor: contributorInfo.name,
            memoText: formData.memoText
        };

        onCreateReceipt(newReceipt);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-emerald-100">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-800">Create Receipt</h2>
                        <p className="text-sm text-slate-600 mt-1">
                            {bankTransaction ? `From Bank Transaction: ${bankTransaction.description}` : 'New Receipt Entry'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column - Receipt Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-slate-800 border-b border-slate-200 pb-2">
                                Receipt Information
                            </h3>
                            
                            {/* Receipt Date */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Receipt Date
                                </label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={formData.receiptDate}
                                        onChange={(e) => handleInputChange('receiptDate', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                    <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Amount */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Amount
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.amount}
                                        onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                                        className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                </div>
                            </div>

                            {/* Fund */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Fund
                                </label>
                                <select
                                    value={formData.fund}
                                    onChange={(e) => handleInputChange('fund', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                >
                                    <option value="P2026">P2026 - Primary 2026</option>
                                    <option value="G2026">G2026 - General 2026</option>
                                    <option value="PAC">PAC - Political Action Committee</option>
                                    <option value="SAVINGS">SAVINGS - Savings Account</option>
                                </select>
                            </div>

                            {/* Account */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Account
                                </label>
                                <select
                                    value={formData.account}
                                    onChange={(e) => handleInputChange('account', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                >
                                    <option value="Operating P2026">Operating P2026</option>
                                    <option value="Operating G2026">Operating G2026</option>
                                    <option value="Operating PAC">Operating PAC</option>
                                    <option value="Savings 2026">Savings 2026</option>
                                </select>
                            </div>

                            {/* Payment Method */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Payment Method
                                </label>
                                <select
                                    value={formData.paymentMethod}
                                    onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                >
                                    <option value="CH">Check</option>
                                    <option value="CC">Credit Card</option>
                                    <option value="ACH">ACH Transfer</option>
                                    <option value="WIRE">Wire Transfer</option>
                                    <option value="CASH">Cash</option>
                                    <option value="ONLINE">Online</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>

                            {/* Line Number */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Line Number
                                </label>
                                <select
                                    value={formData.lineNumber}
                                    onChange={(e) => handleInputChange('lineNumber', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                >
                                    <option value="SA11A">SA11A - Contributions from Individuals</option>
                                    <option value="SA11B">SA11B - Contributions from Political Committees</option>
                                    <option value="SA11C">SA11C - Contributions from Other Political Committees</option>
                                    <option value="SA12">SA12 - Transfers from Affiliated Committees</option>
                                    <option value="SA13">SA13 - Loans Received</option>
                                    <option value="SA14">SA14 - Loan Repayments Received</option>
                                    <option value="SA15">SA15 - Interest, Dividends, and Other Investment Income</option>
                                    <option value="SA16">SA16 - Refunds of Expenditures</option>
                                    <option value="SA17">SA17 - Other Receipts</option>
                                </select>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Description
                                </label>
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    placeholder="Purpose of receipt"
                                />
                            </div>

                            {/* Memo Text */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Memo Text
                                </label>
                                <textarea
                                    value={formData.memoText}
                                    onChange={(e) => handleInputChange('memoText', e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    placeholder="Additional notes or memo"
                                />
                            </div>

                            {/* Election Code */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Election Code
                                </label>
                                <select
                                    value={formData.electionCode}
                                    onChange={(e) => handleInputChange('electionCode', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                >
                                    <option value="P2026">P2026 - Primary 2026</option>
                                    <option value="G2026">G2026 - General 2026</option>
                                    <option value="S2026">S2026 - Special 2026</option>
                                    <option value="R2026">R2026 - Runoff 2026</option>
                                </select>
                            </div>

                            {/* Memo Indicator */}
                            <div>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.memoIndicator}
                                        onChange={(e) => handleInputChange('memoIndicator', e.target.checked)}
                                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <span className="ml-2 text-sm text-slate-700">Memo Indicator</span>
                                </label>
                            </div>
                        </div>

                        {/* Right Column - Contributor Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-slate-800 border-b border-slate-200 pb-2">
                                Contributor Information
                            </h3>

                            {/* Contributor Name */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Contributor Name
                                </label>
                                <input
                                    type="text"
                                    value={contributorInfo.name}
                                    onChange={(e) => handleContributorChange('name', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    placeholder="Full name or organization"
                                />
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    value={contributorInfo.address}
                                    onChange={(e) => handleContributorChange('address', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    placeholder="Street address"
                                />
                            </div>

                            {/* City */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    City
                                </label>
                                <input
                                    type="text"
                                    value={contributorInfo.city}
                                    onChange={(e) => handleContributorChange('city', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    placeholder="City"
                                />
                            </div>

                            {/* State & ZIP */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        State
                                    </label>
                                    <input
                                        type="text"
                                        value={contributorInfo.state}
                                        onChange={(e) => handleContributorChange('state', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        placeholder="State"
                                        maxLength={2}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        ZIP Code
                                    </label>
                                    <input
                                        type="text"
                                        value={contributorInfo.zip}
                                        onChange={(e) => handleContributorChange('zip', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        placeholder="ZIP"
                                    />
                                </div>
                            </div>

                            {/* Occupation */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Occupation
                                </label>
                                <input
                                    type="text"
                                    value={contributorInfo.occupation}
                                    onChange={(e) => handleContributorChange('occupation', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    placeholder="Occupation"
                                />
                            </div>

                            {/* Employer */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Employer
                                </label>
                                <input
                                    type="text"
                                    value={contributorInfo.employer}
                                    onChange={(e) => handleContributorChange('employer', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    placeholder="Employer"
                                />
                            </div>

                            {/* File Upload Area */}
                            <div className="border-2 border-dashed border-emerald-300 rounded-lg p-6 text-center">
                                <DocumentTextIcon className="h-12 w-12 text-emerald-400 mx-auto mb-2" />
                                <p className="text-sm text-slate-600 mb-2">Attach supporting documents</p>
                                <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                                    Browse Files
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
                        <div className="text-sm text-slate-600">
                            {bankTransaction && (
                                <span>Bank Transaction: ${bankTransaction.amount.toFixed(2)}</span>
                            )}
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors font-medium"
                            >
                                Create Receipt
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
