import React, { useState, useCallback } from 'react';
import { Modal } from './Modal';
import { BankTransaction } from '../types';
import { FileTextIcon, LinkIcon, QuickbooksIcon, PlaidIcon, ArrowRightIcon, UploadIcon, CheckCircleIcon } from './Icons';

interface ImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (transactions: BankTransaction[]) => void;
}

type ImportTab = 'manual' | 'bank' | 'quickbooks';

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-t-lg border-b-2 transition-all ${
            active
                ? 'border-sky-600 text-sky-600 bg-sky-50'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100'
        }`}
    >
        {children}
    </button>
);

const MOCK_CSV_HEADERS = ['Date', 'Transaction Detail', 'Debit Amount', 'Credit Amount', 'Balance'];
const REQUIRED_FIELDS = [
    { key: 'date', label: 'Transaction Date' },
    { key: 'description', label: 'Description' },
    { key: 'amount', label: 'Amount' },
];

export const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImport }) => {
    const [activeTab, setActiveTab] = useState<ImportTab>('manual');
    const [file, setFile] = useState<File | null>(null);
    const [isParsing, setIsParsing] = useState(false);
    const [fieldMap, setFieldMap] = useState<{ [key: string]: string }>({});
    const [saveMapping, setSaveMapping] = useState(true);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
            // Mock parsing and auto-matching
            setIsParsing(true);
            setTimeout(() => {
                setFieldMap({
                    date: 'Date',
                    description: 'Transaction Detail',
                    amount: 'Credit Amount' // Default to credit
                });
                setIsParsing(false);
            }, 1000);
        }
    };
    
    const handleFieldMapChange = (appField: string, csvHeader: string) => {
        setFieldMap(prev => ({...prev, [appField]: csvHeader}));
    };

    const isMappingComplete = REQUIRED_FIELDS.every(field => fieldMap[field.key]);

    const handleImportClick = () => {
        // This is a mock import. In a real app, you'd parse the file here.
        const newTransactions: BankTransaction[] = [
            { id: `B${Date.now()}`, date: '4/10/21', description: 'IMPORTED - PAYPAL *JOHN SMITH', amount: 50.00, isReconciled: false },
            { id: `B${Date.now()+1}`, date: '4/10/21', description: 'IMPORTED - SQUARE *COFFEE SHOP', amount: -12.50, isReconciled: false },
            { id: `B${Date.now()+2}`, date: '4/11/21', description: 'IMPORTED - STRIPE PAYOUT', amount: 1250.75, isReconciled: false },
        ];
        onImport(newTransactions);
        // Reset state for next time
        setFile(null);
        setFieldMap({});
    };

    const renderManualImport = () => (
        <div>
            {!file ? (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadIcon className="w-10 h-10 mb-3 text-slate-400" />
                        <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-slate-500">CSV or Excel file</p>
                    </div>
                    <input type="file" className="hidden" onChange={handleFileChange} accept=".csv,.xlsx" />
                </label>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center p-3 border rounded-lg bg-green-50 border-green-200">
                        <CheckCircleIcon className="w-6 h-6 text-green-600 mr-3" />
                        <p className="text-sm font-medium text-green-800">{file.name} uploaded successfully.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-700 mb-2">Map Fields</h4>
                        <p className="text-sm text-slate-500 mb-4">Match your file's columns to the required application fields.</p>
                        <div className="space-y-4 p-4 border rounded-lg bg-slate-50">
                            {REQUIRED_FIELDS.map(field => (
                                <div key={field.key} className="grid grid-cols-3 items-center gap-4">
                                    <label className="font-medium text-sm text-slate-600 text-right">{field.label}</label>
                                    <ArrowRightIcon className="w-5 h-5 text-slate-400 justify-self-center"/>
                                    <select 
                                        value={fieldMap[field.key] || ''} 
                                        onChange={(e) => handleFieldMapChange(field.key, e.target.value)}
                                        className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-sm"
                                    >
                                        <option value="" disabled>Select a column...</option>
                                        {MOCK_CSV_HEADERS.map(header => <option key={header} value={header}>{header}</option>)}
                                    </select>
                                </div>
                            ))}
                        </div>
                    </div>
                     <div className="flex items-center justify-between">
                         <label className="flex items-center text-sm text-slate-600">
                             <input type="checkbox" checked={saveMapping} onChange={e => setSaveMapping(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 mr-2"/>
                             Save this mapping template
                         </label>
                         <button 
                            onClick={handleImportClick}
                            disabled={!isMappingComplete}
                            className="px-6 py-2 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all"
                        >
                            Import Transactions
                         </button>
                    </div>
                </div>
            )}
        </div>
    );

    const renderIntegration = (name: string, icon: React.ReactNode) => (
         <div className="text-center py-8">
            <div className="flex items-center justify-center gap-4">
                 {icon}
                 <span className="text-2xl font-bold text-slate-700">{name}</span>
            </div>
            <p className="mt-4 text-slate-500">Connect your {name} account to automatically sync transactions.</p>
             <button className="mt-6 flex items-center justify-center gap-2 w-full max-w-xs mx-auto px-4 py-3 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-all">
                Connect to {name} <LinkIcon className="w-5 h-5"/>
            </button>
         </div>
    );
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Import Bank Activity">
            <div className="border-b border-slate-200">
                <div className="flex -mb-px">
                    <TabButton active={activeTab === 'manual'} onClick={() => setActiveTab('manual')}>
                        <FileTextIcon className="w-5 h-5"/> Manual Upload
                    </TabButton>
                    <TabButton active={activeTab === 'bank'} onClick={() => setActiveTab('bank')}>
                        <PlaidIcon className="w-5 h-5"/> Direct Bank Link
                    </TabButton>
                    <TabButton active={activeTab === 'quickbooks'} onClick={() => setActiveTab('quickbooks')}>
                        <QuickbooksIcon className="w-5 h-5"/> QuickBooks Link
                    </TabButton>
                </div>
            </div>
            <div className="pt-6">
                {activeTab === 'manual' && renderManualImport()}
                {activeTab === 'bank' && renderIntegration('Plaid', <PlaidIcon />)}
                {activeTab === 'quickbooks' && renderIntegration('QuickBooks', <QuickbooksIcon />)}
            </div>
        </Modal>
    );
};