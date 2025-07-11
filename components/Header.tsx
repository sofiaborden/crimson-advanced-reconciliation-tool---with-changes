import React, { useState } from 'react';
import { CogIcon, UploadIcon, MagnifyingGlassIcon, BellIcon, UserCircleIcon, ChevronDownIcon, HomeIcon, DocumentTextIcon, ChartBarIcon, ClockIcon } from './Icons';

interface HeaderProps {
    currentUser?: {
        name: string;
        role: string;
        organization: string;
    };
    activeView?: 'reconciliation' | 'reports' | 'history';
    onNavigate?: (view: 'reconciliation' | 'reports' | 'history') => void;
}

export const Header: React.FC<HeaderProps> = ({
    currentUser = {
        name: 'Sarah Johnson',
        role: 'Compliance Manager',
        organization: 'Campaign 2026'
    },
    activeView = 'reconciliation',
    onNavigate
}) => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    return (
        <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-lg border-b border-slate-700">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo and Branding */}
                    <div className="flex items-center space-x-8">
                        <div className="flex items-center">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">C</span>
                                </div>
                                <div>
                                    <span className="font-extrabold text-xl text-white">CRIMSON</span>
                                    <span className="text-red-300 ml-2 font-medium text-lg">Treasury</span>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="hidden md:flex items-center space-x-6" role="navigation" aria-label="Main navigation">
                            <button
                                onClick={() => onNavigate?.('reconciliation')}
                                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    activeView === 'reconciliation'
                                        ? 'text-white bg-slate-700'
                                        : 'text-slate-300 hover:text-white hover:bg-slate-700'
                                }`}
                                aria-current={activeView === 'reconciliation' ? 'page' : undefined}
                                title="Reconciliation (Alt+R)"
                            >
                                <ChartBarIcon className="w-4 h-4" />
                                <span>Reconciliation</span>
                                <span className="text-xs opacity-75 ml-1">Alt+R</span>
                            </button>
                            <button
                                onClick={() => onNavigate?.('reports')}
                                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    activeView === 'reports'
                                        ? 'text-white bg-slate-700'
                                        : 'text-slate-300 hover:text-white hover:bg-slate-700'
                                }`}
                                aria-current={activeView === 'reports' ? 'page' : undefined}
                                title="Reports (Alt+P)"
                            >
                                <DocumentTextIcon className="w-4 h-4" />
                                <span>Reports</span>
                                <span className="text-xs opacity-75 ml-1">Alt+P</span>
                            </button>
                            <button
                                onClick={() => onNavigate?.('history')}
                                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    activeView === 'history'
                                        ? 'text-white bg-slate-700'
                                        : 'text-slate-300 hover:text-white hover:bg-slate-700'
                                }`}
                                aria-current={activeView === 'history' ? 'page' : undefined}
                                title="History (Alt+H)"
                            >
                                <ClockIcon className="w-4 h-4" />
                                <span>History</span>
                                <span className="text-xs opacity-75 ml-1">Alt+H</span>
                            </button>
                        </nav>
                    </div>

                    {/* Right side actions */}
                    <div className="flex items-center space-x-4">
                        {/* Search */}
                        <button
                            className="p-2 rounded-full text-slate-300 hover:bg-slate-700 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                            aria-label="Search"
                        >
                            <MagnifyingGlassIcon className="h-5 w-5" />
                        </button>

                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="p-2 rounded-full text-slate-300 hover:bg-slate-700 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-800 relative"
                                aria-label="Notifications"
                                aria-expanded={showNotifications}
                            >
                                <BellIcon className="h-5 w-5" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>

                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 z-50">
                                    <div className="p-4 border-b border-slate-200">
                                        <h3 className="text-sm font-semibold text-slate-800">Notifications</h3>
                                    </div>
                                    <div className="p-4 space-y-3">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                                            <div>
                                                <p className="text-sm text-slate-800">3 new AI suggestions available</p>
                                                <p className="text-xs text-slate-500">2 minutes ago</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                                            <div>
                                                <p className="text-sm text-slate-800">Reconciliation discrepancy detected</p>
                                                <p className="text-xs text-slate-500">15 minutes ago</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Settings */}
                        <button
                            className="p-2 rounded-full text-slate-300 hover:bg-slate-700 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                            aria-label="Settings"
                        >
                            <CogIcon className="h-5 w-5"/>
                        </button>

                        {/* User Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center space-x-3 text-slate-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-800 rounded-md p-2"
                                aria-expanded={showUserMenu}
                                aria-haspopup="true"
                            >
                                <div className="hidden md:block text-right">
                                    <p className="text-sm font-medium text-white">{currentUser.name}</p>
                                    <p className="text-xs text-slate-400">{currentUser.role}</p>
                                </div>
                                <UserCircleIcon className="h-8 w-8" />
                                <ChevronDownIcon className="h-4 w-4" />
                            </button>

                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 z-50">
                                    <div className="p-4 border-b border-slate-200">
                                        <p className="text-sm font-medium text-slate-800">{currentUser.name}</p>
                                        <p className="text-xs text-slate-500">{currentUser.role}</p>
                                        <p className="text-xs text-slate-500">{currentUser.organization}</p>
                                    </div>
                                    <div className="py-2">
                                        <a href="#" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Profile Settings</a>
                                        <a href="#" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Preferences</a>
                                        <a href="#" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Help & Support</a>
                                        <hr className="my-2" />
                                        <a href="#" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Sign Out</a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};