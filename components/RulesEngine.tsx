import React, { useState } from 'react';
import { CogIcon, PlusIcon, XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon } from './Icons';

export interface ReconciliationRule {
    id: string;
    name: string;
    description: string;
    conditions: RuleCondition[];
    actions: RuleAction[];
    isActive: boolean;
    priority: number;
    matchCount: number;
}

export interface RuleCondition {
    field: 'amount' | 'date' | 'description' | 'paymentType';
    operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan' | 'between' | 'withinDays';
    value: string | number;
    value2?: string | number; // For 'between' operator
}

export interface RuleAction {
    type: 'autoMatch' | 'markAsNrit' | 'addTag' | 'requireApproval';
    value?: string;
}

interface RulesEngineProps {
    isOpen: boolean;
    onClose: () => void;
    rules: ReconciliationRule[];
    onSaveRules: (rules: ReconciliationRule[]) => void;
}

const defaultRules: ReconciliationRule[] = [
    {
        id: 'exact-amount-date',
        name: 'Exact Amount & Date Match',
        description: 'Auto-match transactions with identical amounts on the same date',
        conditions: [
            { field: 'amount', operator: 'equals', value: 0 },
            { field: 'date', operator: 'equals', value: '' }
        ],
        actions: [{ type: 'autoMatch' }],
        isActive: true,
        priority: 1,
        matchCount: 0
    },
    {
        id: 'winred-payout',
        name: 'WinRed Payout Processing',
        description: 'Handle WinRed payouts with fees and chargebacks',
        conditions: [
            { field: 'description', operator: 'contains', value: 'WINRED PAYOUT' }
        ],
        actions: [{ type: 'requireApproval' }],
        isActive: true,
        priority: 2,
        matchCount: 0
    },
    {
        id: 'small-amounts-nrit',
        name: 'Small Amount NRIT',
        description: 'Mark transactions under $5 as non-reportable',
        conditions: [
            { field: 'amount', operator: 'lessThan', value: 5 }
        ],
        actions: [{ type: 'markAsNrit' }],
        isActive: false,
        priority: 3,
        matchCount: 0
    }
];

export const RulesEngine: React.FC<RulesEngineProps> = ({ isOpen, onClose, rules = defaultRules, onSaveRules }) => {
    const [localRules, setLocalRules] = useState<ReconciliationRule[]>(rules);
    const [editingRule, setEditingRule] = useState<ReconciliationRule | null>(null);
    const [showNewRuleForm, setShowNewRuleForm] = useState(false);

    const handleSave = () => {
        onSaveRules(localRules);
        onClose();
    };

    const handleToggleRule = (ruleId: string) => {
        setLocalRules(prev => prev.map(rule => 
            rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
        ));
    };

    const handleDeleteRule = (ruleId: string) => {
        setLocalRules(prev => prev.filter(rule => rule.id !== ruleId));
    };

    const createNewRule = (): ReconciliationRule => ({
        id: `rule-${Date.now()}`,
        name: 'New Rule',
        description: 'Description of the new rule',
        conditions: [{ field: 'amount', operator: 'equals', value: 0 }],
        actions: [{ type: 'autoMatch' }],
        isActive: true,
        priority: localRules.length + 1,
        matchCount: 0
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <CogIcon className="w-8 h-8" />
                            <div>
                                <h2 className="text-2xl font-bold">Reconciliation Rules Engine</h2>
                                <p className="text-indigo-100 mt-1">Configure automated matching and processing rules</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-indigo-100 hover:text-white transition-colors p-1"
                            aria-label="Close rules engine"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 max-h-96 overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800">Active Rules</h3>
                            <p className="text-sm text-slate-600">Rules are processed in priority order</p>
                        </div>
                        <button
                            onClick={() => {
                                setEditingRule(createNewRule());
                                setShowNewRuleForm(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            <PlusIcon className="w-4 h-4" />
                            Add Rule
                        </button>
                    </div>

                    <div className="space-y-4">
                        {localRules.map((rule) => (
                            <div
                                key={rule.id}
                                className={`p-4 rounded-lg border-2 transition-all ${
                                    rule.isActive 
                                        ? 'border-emerald-200 bg-emerald-50' 
                                        : 'border-slate-200 bg-slate-50'
                                }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="flex items-center gap-2">
                                                {rule.isActive ? (
                                                    <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
                                                ) : (
                                                    <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>
                                                )}
                                                <h4 className="font-semibold text-slate-800">{rule.name}</h4>
                                            </div>
                                            <span className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded-full">
                                                Priority {rule.priority}
                                            </span>
                                            {rule.matchCount > 0 && (
                                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                    {rule.matchCount} matches
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-600 mb-3">{rule.description}</p>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                            <div>
                                                <span className="font-medium text-slate-700">Conditions:</span>
                                                <ul className="mt-1 space-y-1">
                                                    {rule.conditions.map((condition, index) => (
                                                        <li key={index} className="text-slate-600">
                                                            • {condition.field} {condition.operator} {condition.value}
                                                            {condition.value2 && ` and ${condition.value2}`}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <span className="font-medium text-slate-700">Actions:</span>
                                                <ul className="mt-1 space-y-1">
                                                    {rule.actions.map((action, index) => (
                                                        <li key={index} className="text-slate-600">
                                                            • {action.type} {action.value && `(${action.value})`}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 ml-4">
                                        <button
                                            onClick={() => handleToggleRule(rule.id)}
                                            className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                                                rule.isActive
                                                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                        >
                                            {rule.isActive ? 'Active' : 'Inactive'}
                                        </button>
                                        <button
                                            onClick={() => setEditingRule(rule)}
                                            className="px-3 py-1 text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteRule(rule.id)}
                                            className="px-3 py-1 text-sm font-medium text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {localRules.length === 0 && (
                        <div className="text-center py-12">
                            <ExclamationTriangleIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-800 mb-2">No Rules Configured</h3>
                            <p className="text-slate-600 mb-4">Create your first reconciliation rule to automate matching</p>
                            <button
                                onClick={() => {
                                    setEditingRule(createNewRule());
                                    setShowNewRuleForm(true);
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors mx-auto"
                            >
                                <PlusIcon className="w-4 h-4" />
                                Create First Rule
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-between items-center">
                    <div className="text-sm text-slate-600">
                        {localRules.filter(r => r.isActive).length} of {localRules.length} rules active
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Save Rules
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
