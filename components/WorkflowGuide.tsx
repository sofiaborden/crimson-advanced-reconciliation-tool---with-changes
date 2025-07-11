import React, { useState } from 'react';
import { CheckCircleIcon, ClockIcon, ExclamationTriangleIcon, SparklesIcon, XMarkIcon, ChevronRightIcon, LightBulbIcon } from './Icons';

interface WorkflowStep {
    id: string;
    title: string;
    description: string;
    status: 'completed' | 'current' | 'upcoming';
    action?: () => void;
    actionLabel?: string;
}

interface WorkflowGuideProps {
    isVisible: boolean;
    onClose: () => void;
    onSuggestMatches: () => void;
    unreconciledCount: number;
    aiSuggestionsCount: number;
    hasDiscrepancy: boolean;
}

export const WorkflowGuide: React.FC<WorkflowGuideProps> = ({
    isVisible,
    onClose,
    onSuggestMatches,
    unreconciledCount,
    aiSuggestionsCount,
    hasDiscrepancy,
}) => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const getWorkflowSteps = (): WorkflowStep[] => {
        const steps: WorkflowStep[] = [
            {
                id: 'import',
                title: 'Import Bank Transactions',
                description: 'Upload your bank statement or connect your bank account to import transactions.',
                status: 'completed', // Assuming this is done since we have transactions
            },
            {
                id: 'review',
                title: 'Review Unreconciled Items',
                description: `You have ${unreconciledCount} unreconciled transactions that need attention.`,
                status: unreconciledCount > 0 ? 'current' : 'completed',
            },
            {
                id: 'ai-suggest',
                title: 'Get AI Suggestions',
                description: 'Let AI analyze your transactions and suggest potential matches.',
                status: aiSuggestionsCount > 0 ? 'completed' : unreconciledCount > 0 ? 'current' : 'upcoming',
                action: onSuggestMatches,
                actionLabel: 'Get AI Suggestions',
            },
            {
                id: 'review-suggestions',
                title: 'Review AI Suggestions',
                description: aiSuggestionsCount > 0 
                    ? `Review and approve ${aiSuggestionsCount} AI-suggested matches.`
                    : 'Review AI suggestions when available.',
                status: aiSuggestionsCount > 0 ? 'current' : 'upcoming',
            },
            {
                id: 'manual-match',
                title: 'Manual Matching',
                description: 'Manually match remaining transactions by selecting items from both sides.',
                status: unreconciledCount > 0 && aiSuggestionsCount === 0 ? 'current' : 'upcoming',
            },
            {
                id: 'resolve-discrepancies',
                title: 'Resolve Discrepancies',
                description: hasDiscrepancy 
                    ? 'There are amount discrepancies that need to be resolved.'
                    : 'Check for and resolve any remaining discrepancies.',
                status: hasDiscrepancy ? 'current' : unreconciledCount === 0 ? 'completed' : 'upcoming',
            },
            {
                id: 'finalize',
                title: 'Finalize Reconciliation',
                description: 'Complete the reconciliation process and generate reports.',
                status: unreconciledCount === 0 && !hasDiscrepancy ? 'current' : 'upcoming',
            },
        ];

        return steps;
    };

    const steps = getWorkflowSteps();
    const currentStep = steps[currentStepIndex];

    const getStepIcon = (status: WorkflowStep['status']) => {
        switch (status) {
            case 'completed':
                return <CheckCircleIcon className="w-5 h-5 text-emerald-600" />;
            case 'current':
                return <ClockIcon className="w-5 h-5 text-sky-600" />;
            case 'upcoming':
                return <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>;
        }
    };

    const getStepColor = (status: WorkflowStep['status']) => {
        switch (status) {
            case 'completed':
                return 'text-emerald-600 bg-emerald-50 border-emerald-200';
            case 'current':
                return 'text-sky-600 bg-sky-50 border-sky-200';
            case 'upcoming':
                return 'text-slate-500 bg-slate-50 border-slate-200';
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-sky-600 to-sky-700 text-white p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Reconciliation Workflow</h2>
                            <p className="text-sky-100 mt-1">Follow these steps to complete your reconciliation</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-sky-100 hover:text-white transition-colors p-1"
                            aria-label="Close workflow guide"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                    <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
                        <span>Progress</span>
                        <span>{steps.filter(s => s.status === 'completed').length} of {steps.length} completed</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                            className="bg-sky-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(steps.filter(s => s.status === 'completed').length / steps.length) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 max-h-96 overflow-y-auto">
                    <div className="space-y-4">
                        {steps.map((step, index) => (
                            <div
                                key={step.id}
                                className={`p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
                                    getStepColor(step.status)
                                } ${index === currentStepIndex ? 'ring-2 ring-sky-300' : ''}`}
                                onClick={() => setCurrentStepIndex(index)}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 mt-0.5">
                                        {getStepIcon(step.status)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold text-slate-800">{step.title}</h3>
                                            {step.status === 'current' && (
                                                <span className="text-xs bg-sky-100 text-sky-800 px-2 py-1 rounded-full font-medium">
                                                    Current
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-600 mt-1">{step.description}</p>
                                        
                                        {step.action && step.status === 'current' && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    step.action!();
                                                }}
                                                className="mt-3 flex items-center gap-2 px-3 py-2 bg-sky-600 text-white text-sm font-medium rounded-lg hover:bg-sky-700 transition-colors"
                                            >
                                                <SparklesIcon className="w-4 h-4" />
                                                {step.actionLabel}
                                            </button>
                                        )}
                                    </div>
                                    <ChevronRightIcon className="w-5 h-5 text-slate-400" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
                    <div className="flex items-center gap-3">
                        <LightBulbIcon className="w-5 h-5 text-yellow-600" />
                        <div className="text-sm text-slate-600">
                            <strong>Tip:</strong> Use AI suggestions to speed up the reconciliation process. 
                            The AI can automatically match transactions based on amounts, dates, and descriptions.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
