import React, { useState } from 'react';
import PaymentAndLedger from './purchase/PaymentAndLedger';

function PurchaseSettings() {
    const [activeTab, setActiveTab] = useState('general');

    const tabs = [
        { id: 'general', label: 'General' },
        { id: 'validation', label: 'Validation Rules' },
        { id: 'payments', label: 'Payments & Ledgers' },
    ];

    return (
        <>
            <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Purhcase Settings
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Configure your multi-vendor e-commerce platform settings
                </p>
            </div>

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
                            {/* <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Default Purchase Order Prefix
              </label>
              <input
                type="text"
                defaultValue="PO-"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Default Payment Terms (days)
              </label>
              <input
                type="number"
                defaultValue={30}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Require approval for purchase orders above
                </span>
              </label>
              <input
                type="number"
                placeholder="Amount"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div> */}
                        </div>
                    )}

                    {activeTab === 'validation' && (
                        <div className="space-y-6">

                            <span>Validation setting options</span>

                            {/* <div className="flex items-start gap-3">
              <input
                type="checkbox"
                defaultChecked
                className="mt-1 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Prevent purchase of items below minimum stock level
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Blocks submission if stock would go negative
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Require purchase order number uniqueness
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Enforce maximum order quantity per vendor per month
                </p>
              </div>
            </div> */}

                        </div>
                    )}

                    {activeTab === 'payments' && (
                        <div className="space-y-6">
                          <PaymentAndLedger/>
                        </div>
                    )}
                </div>
            </div>

        </>

    );
}

export default PurchaseSettings;