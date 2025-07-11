import React, { useState } from 'react';
import { BankTransaction, CrimsonTransaction, MoneyType } from '../types';
import { XMarkIcon, CalendarIcon, DocumentTextIcon, PlusIcon, TrashIcon } from './Icons';

interface CreateExpenditureModalProps {
    isOpen: boolean;
    onClose: () => void;
    bankTransaction?: BankTransaction;
    onCreateExpenditure: (expenditure: CrimsonTransaction) => void;
}

interface ExpenditureLineItem {
    id: string;
    description: string;
    amount: number;
    accountCode: string;
    lineNumber: string;
}

export const CreateExpenditureModal: React.FC<CreateExpenditureModalProps> = ({
    isOpen,
    onClose,
    bankTransaction,
    onCreateExpenditure
}) => {
    const [formData, setFormData] = useState({
        disbursementDate: bankTransaction?.date || new Date().toISOString().split('T')[0],
        amount: Math.abs(bankTransaction?.amount || 0),
        fund: 'P2026',
        account: 'Operating P2026',
        checkNo: '',
        paymentMethod: 'CH',
        lineNumber: 'SB21B',
        fecDescription: '',
        memoText: '',
        transactionCategory: 'Operating Expenditure',
        transactionCode: 'EXP',
        electionCode: 'P2026',
        year: '2026',
        otherElection: '',
        adjustmentType: '',
        adjustmentDate: '',
        memoIndicator: false,
        invoiceAttached: false
    });

    const [lineItems, setLineItems] = useState<ExpenditureLineItem[]>([
        {
            id: '1',
            description: 'Undefined',
            amount: Math.abs(bankTransaction?.amount || 0),
            accountCode: 'Operating P2026',
            lineNumber: 'SB21B'
        }
    ]);

    const [vendorInfo, setVendorInfo] = useState({
        name: '',
        address: '',
        city: '',
        state: '',
        zip: ''
    });

    if (!isOpen) return null;

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleVendorChange = (field: string, value: string) => {
        setVendorInfo(prev => ({ ...prev, [field]: value }));
    };

    const addLineItem = () => {
        const newItem: ExpenditureLineItem = {
            id: Date.now().toString(),
            description: '',
            amount: 0,
            accountCode: 'Operating P2026',
            lineNumber: 'SB21B'
        };
        setLineItems(prev => [...prev, newItem]);
    };

    const removeLineItem = (id: string) => {
        if (lineItems.length > 1) {
            setLineItems(prev => prev.filter(item => item.id !== id));
        }
    };

    const updateLineItem = (id: string, field: string, value: any) => {
        setLineItems(prev => prev.map(item => 
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const totalAmount = lineItems.reduce((sum, item) => sum + item.amount, 0);

    const handleSubmit = () => {
        const newExpenditure: CrimsonTransaction = {
            id: `C${Date.now()}`,
            date: formData.disbursementDate,
            moneyType: MoneyType.Disbursement,
            paymentType: formData.paymentMethod,
            amount: totalAmount,
            group: `EXP-${bankTransaction?.id || Date.now()}`,
            isReconciled: false,
            accountCode: formData.account,
            fundCode: formData.fund,
            lineNumber: formData.lineNumber,
            description: formData.fecDescription || vendorInfo.name || 'Expenditure',
            checkNumber: formData.checkNo,
            vendor: vendorInfo.name,
            memoText: formData.memoText
        };

        onCreateExpenditure(newExpenditure);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-800">Create Expenditure</h2>
                        <p className="text-sm text-slate-600 mt-1">
                            {bankTransaction ? `From Bank Transaction: ${bankTransaction.description}` : 'New Expenditure Entry'}
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
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Basic Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-slate-800 border-b border-slate-200 pb-2">
                                Basic Information
                            </h3>
                            
                            {/* Disbursement Date */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Disbursement Date
                                </label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={formData.disbursementDate}
                                        onChange={(e) => handleInputChange('disbursementDate', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                        className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="Operating P2026">Operating P2026</option>
                                    <option value="Operating G2026">Operating G2026</option>
                                    <option value="Operating PAC">Operating PAC</option>
                                    <option value="Savings 2026">Savings 2026</option>
                                </select>
                            </div>

                            {/* Check Number */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Check No.
                                </label>
                                <input
                                    type="text"
                                    value={formData.checkNo}
                                    onChange={(e) => handleInputChange('checkNo', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Check number"
                                />
                            </div>

                            {/* Payment Method */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Payment Method
                                </label>
                                <select
                                    value={formData.paymentMethod}
                                    onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="CH">Check</option>
                                    <option value="CC">Credit Card</option>
                                    <option value="ACH">ACH Transfer</option>
                                    <option value="WIRE">Wire Transfer</option>
                                    <option value="CASH">Cash</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>
                        </div>

                        {/* Middle Column - FEC Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-slate-800 border-b border-slate-200 pb-2">
                                FEC Information
                            </h3>

                            {/* Line Number */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Line Number
                                </label>
                                <select
                                    value={formData.lineNumber}
                                    onChange={(e) => handleInputChange('lineNumber', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="SB21B">SB21B - Operating Expenditures</option>
                                    <option value="SB23">SB23 - Other Disbursements</option>
                                    <option value="SB24">SB24 - Independent Expenditures</option>
                                    <option value="SB25">SB25 - Coordinated Expenditures</option>
                                    <option value="SB26">SB26 - Loan Repayments</option>
                                    <option value="SB27">SB27 - Loan Forgiveness</option>
                                    <option value="SB28A">SB28A - Refunds to Individuals</option>
                                    <option value="SB28B">SB28B - Refunds to Political Committees</option>
                                    <option value="SB28C">SB28C - Refunds to Other Political Committees</option>
                                    <option value="SB29">SB29 - Other Disbursements</option>
                                </select>
                            </div>

                            {/* FEC Description */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    FEC Description
                                </label>
                                <input
                                    type="text"
                                    value={formData.fecDescription}
                                    onChange={(e) => handleInputChange('fecDescription', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Purpose of expenditure"
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
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Additional notes or memo"
                                />
                            </div>

                            {/* Transaction Category */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Transaction Category
                                </label>
                                <select
                                    value={formData.transactionCategory}
                                    onChange={(e) => handleInputChange('transactionCategory', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="Operating Expenditure">Operating Expenditure</option>
                                    <option value="Administrative">Administrative</option>
                                    <option value="Fundraising">Fundraising</option>
                                    <option value="Media">Media</option>
                                    <option value="Travel">Travel</option>
                                    <option value="Consulting">Consulting</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            {/* Election Code */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Election Code
                                </label>
                                <select
                                    value={formData.electionCode}
                                    onChange={(e) => handleInputChange('electionCode', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="P2026">P2026 - Primary 2026</option>
                                    <option value="G2026">G2026 - General 2026</option>
                                    <option value="S2026">S2026 - Special 2026</option>
                                    <option value="R2026">R2026 - Runoff 2026</option>
                                </select>
                            </div>

                            {/* Year */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Year
                                </label>
                                <select
                                    value={formData.year}
                                    onChange={(e) => handleInputChange('year', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="2024">2024</option>
                                    <option value="2025">2025</option>
                                    <option value="2026">2026</option>
                                    <option value="2027">2027</option>
                                    <option value="2028">2028</option>
                                </select>
                            </div>
                        </div>

                        {/* Right Column - Vendor Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-slate-800 border-b border-slate-200 pb-2">
                                Vendor Information
                            </h3>

                            {/* Vendor Name */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Vendor Name
                                </label>
                                <input
                                    type="text"
                                    value={vendorInfo.name}
                                    onChange={(e) => handleVendorChange('name', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Vendor or payee name"
                                />
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    value={vendorInfo.address}
                                    onChange={(e) => handleVendorChange('address', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                    value={vendorInfo.city}
                                    onChange={(e) => handleVendorChange('city', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                        value={vendorInfo.state}
                                        onChange={(e) => handleVendorChange('state', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                        value={vendorInfo.zip}
                                        onChange={(e) => handleVendorChange('zip', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="ZIP"
                                    />
                                </div>
                            </div>

                            {/* File Upload Area */}
                            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                                <DocumentTextIcon className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                                <p className="text-sm text-slate-600 mb-2">Choose a file or drag it here</p>
                                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                    Browse Files
                                </button>
                            </div>

                            {/* Checkboxes */}
                            <div className="space-y-2">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.memoIndicator}
                                        onChange={(e) => handleInputChange('memoIndicator', e.target.checked)}
                                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-sm text-slate-700">Memo Indicator</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.invoiceAttached}
                                        onChange={(e) => handleInputChange('invoiceAttached', e.target.checked)}
                                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-sm text-slate-700">Invoice Attached</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* General Ledger Section */}
                    <div className="mt-8">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-slate-800">General Ledger</h3>
                            <button
                                onClick={addLineItem}
                                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                            >
                                <PlusIcon className="h-4 w-4 mr-1" />
                                Add Line Item
                            </button>
                        </div>

                        <div className="bg-slate-50 rounded-lg overflow-hidden">
                            <div className="grid grid-cols-12 gap-4 p-3 bg-slate-800 text-white text-sm font-medium">
                                <div className="col-span-4">Description</div>
                                <div className="col-span-2">Account Code</div>
                                <div className="col-span-2">Line Number</div>
                                <div className="col-span-2">Amount</div>
                                <div className="col-span-2">Actions</div>
                            </div>

                            {lineItems.map((item, index) => (
                                <div key={item.id} className="grid grid-cols-12 gap-4 p-3 border-b border-slate-200 last:border-b-0">
                                    <div className="col-span-4">
                                        <input
                                            type="text"
                                            value={item.description}
                                            onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                                            className="w-full px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            placeholder="Description"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <select
                                            value={item.accountCode}
                                            onChange={(e) => updateLineItem(item.id, 'accountCode', e.target.value)}
                                            className="w-full px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        >
                                            <option value="Operating P2026">Operating P2026</option>
                                            <option value="Operating G2026">Operating G2026</option>
                                            <option value="Operating PAC">Operating PAC</option>
                                            <option value="Savings 2026">Savings 2026</option>
                                        </select>
                                    </div>
                                    <div className="col-span-2">
                                        <select
                                            value={item.lineNumber}
                                            onChange={(e) => updateLineItem(item.id, 'lineNumber', e.target.value)}
                                            className="w-full px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        >
                                            <option value="SB21B">SB21B</option>
                                            <option value="SB23">SB23</option>
                                            <option value="SB24">SB24</option>
                                            <option value="SB25">SB25</option>
                                            <option value="SB26">SB26</option>
                                            <option value="SB27">SB27</option>
                                            <option value="SB28A">SB28A</option>
                                            <option value="SB28B">SB28B</option>
                                            <option value="SB28C">SB28C</option>
                                            <option value="SB29">SB29</option>
                                        </select>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="relative">
                                            <span className="absolute left-2 top-1 text-slate-500 text-sm">$</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={item.amount}
                                                onChange={(e) => updateLineItem(item.id, 'amount', parseFloat(e.target.value) || 0)}
                                                className="w-full pl-6 pr-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-2 flex items-center">
                                        {lineItems.length > 1 && (
                                            <button
                                                onClick={() => removeLineItem(item.id)}
                                                className="text-red-600 hover:text-red-700 transition-colors"
                                            >
                                                <TrashIcon className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Total Row */}
                            <div className="grid grid-cols-12 gap-4 p-3 bg-slate-100 font-medium">
                                <div className="col-span-8 text-right">Total:</div>
                                <div className="col-span-2">
                                    <span className="text-lg font-semibold">${totalAmount.toFixed(2)}</span>
                                </div>
                                <div className="col-span-2"></div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
                        <div className="text-sm text-slate-600">
                            {bankTransaction && (
                                <span>Bank Transaction: ${Math.abs(bankTransaction.amount).toFixed(2)}</span>
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
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                            >
                                Create Expenditure
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
