import React, { useState } from 'react';
import PaymentAndLedger from './purchase/PaymentAndLedger';
import TransactionSeries from './general/TransactionSeries';

function GeneralSettings() {
    const [activeTab, setActiveTab] = useState('general');

    const tabs = [
        { id: 'general', label: 'General' },
        { id: 'validation', label: 'Validation Rules' },
        { id: 'transactionSeries', label: 'Transaction Series' },
    ];

    return (
        <>
            {/* <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      General Settings
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Configure your multi-vendor e-commerce platform settings
                </p>
            </div> */}

            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                {/* Tabs */}
                <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
                    <nav className=" flex space-x-4" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors
                ${activeTab === tab.id
                                        ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                    }
              `}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="space-y-1">
                    {activeTab === 'general' && (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            <span>General setting options</span>
                        </div>
                    )}

                    {activeTab === 'validation' && (
                        <div className="space-y-6">
                            <span>Validation setting options</span>
                        </div>
                    )}

                    
                    {activeTab === 'transactionSeries' && (
                        <div className="space-y-6">
                          <TransactionSeries/>
                        </div>
                    )}
                </div>
            </div>

        </>

    );
}

export default GeneralSettings;