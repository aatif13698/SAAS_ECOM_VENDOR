import useDarkmode from '@/hooks/useDarkMode';
import React, { useState, useEffect } from 'react';

function CreateVoucher() {

    const [isDark] = useDarkmode();

    // Demo data for voucher groups and ledgers
    const voucherGroups = [
        { id: '1', name: 'Receipt' },
        { id: '2', name: 'Payment' },
        { id: '3', name: 'Contra' },
        { id: '4', name: 'Journal' },
    ];

    const ledgers = [
        { id: '1', name: 'Cash' },
        { id: '2', name: 'Bank' },
        { id: '3', name: 'Sales' },
        { id: '4', name: 'Purchases' },
        { id: '5', name: 'Accounts Receivable' },
    ];

    // State management
    const [formData, setFormData] = useState({
        voucherGroup: '',
        entries: [
            { ledger: '', credit: '', debit: '', type: 'credit' }, // First row: Credit
            { ledger: '', credit: '', debit: '', type: 'debit' },  // Second row: Debit
        ],
        narration: '',
    });

    const [totals, setTotals] = useState({ debit: 0, credit: 0 });

    // Update totals when entries change
    useEffect(() => {
        const debitTotal = formData.entries.reduce((sum, entry) => {
            return entry.type === 'debit' ? sum + (parseFloat(entry.debit) || 0) : sum;
        }, 0);
        const creditTotal = formData.entries.reduce((sum, entry) => {
            return entry.type === 'credit' ? sum + (parseFloat(entry.credit) || 0) : sum;
        }, 0);
        setTotals({ debit: debitTotal, credit: creditTotal });
    }, [formData.entries]);

    // Handle input changes
    const handleInputChange = (field, value, index = null) => {
        if (index !== null) {
            setFormData(prev => ({
                ...prev,
                entries: prev.entries.map((entry, i) =>
                    i === index ? { ...entry, [field]: value } : entry
                ),
            }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.voucherGroup) {
            alert('Please select a voucher group.');
            return;
        }
        if (formData.entries.some(entry => !entry.ledger)) {
            alert('Please select a ledger for all entries.');
            return;
        }
        if (totals.debit !== totals.credit || totals.debit === 0) {
            alert('Debit and Credit totals must balance and be non-zero.');
            return;
        }
        // API call placeholder (replace with actual API call)
        console.log('Submitting voucher:', {
            ...formData,
            clientId: 'demoClientId', // Replace with actual clientId
            level: 'vendor', // Replace with actual level
        });
        // Reset form after submission
        setFormData({
            voucherGroup: '',
            entries: [
                { ledger: '', credit: '', debit: '', type: 'credit' },
                { ledger: '', credit: '', debit: '', type: 'debit' },
            ],
            narration: '',
        });
    };

    return (
        <div>

            <div className={`${isDark ? "bg-darkSecondary text-white" : "bg-white text-black-900"} p-5 shadow-lg`}>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 ">
                    Voucher Entry
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Voucher Group Dropdown */}
                    <div>
                        <label
                            htmlFor="voucherGroup"
                            className="form-label"
                        >
                            Voucher Group
                        </label>
                        <select
                            id="voucherGroup"
                            value={formData.voucherGroup}
                            onChange={(e) => handleInputChange('voucherGroup', e.target.value)}
                            className="form-control py-2  appearance-none relative flex-1"
                            aria-required="true"
                        >
                            <option value="">Select Voucher Group</option>
                            {voucherGroups.map(group => (
                                <option key={group.id} value={group.id}>
                                    {group.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Voucher Entries Table */}
                    <div>
                        <div className="grid grid-cols-4 gap-4 font-medium text-gray-700 border-b border-gray-200 pb-2 mb-4">
                            <div className='form-label'>Type</div>
                            <div className='form-label'>Particulars</div>
                            <div className="text-right form-label">Debit</div>
                            <div className="text-right form-label">Credit</div>
                        </div>
                        {formData.entries.map((entry, index) => (
                            <div key={index} className="grid grid-cols-4 gap-4 mb-4 items-center">
                                {/* Type Column */}
                                <input
                                    type="text"
                                    value={entry.type.charAt(0).toUpperCase() + entry.type.slice(1)} // Capitalize 'credit'/'debit'
                                    disabled
                                    className="form-control py-2  appearance-none relative flex-1"
                                    aria-label={`Entry type: ${entry.type}`}
                                />

                                {/* Particulars (Ledger) */}
                                <select
                                    value={entry.ledger}
                                    onChange={(e) => handleInputChange('ledger', e.target.value, index)}
                                    className="form-control py-2  appearance-none relative flex-1" aria-label={`Ledger for ${entry.type} entry`}
                                    aria-required="true"
                                >
                                    <option value="">Select Ledger</option>
                                    {ledgers.map(ledger => (
                                        <option key={ledger.id} value={ledger.id}>
                                            {ledger.name}
                                        </option>
                                    ))}
                                </select>

                                {/* Debit Input */}
                                <input
                                    type="number"
                                    value={entry.debit}
                                    onChange={(e) => handleInputChange('debit', e.target.value, index)}
                                    disabled={entry.type === 'credit'}
                                    className={`p-2 border form-control border-gray-300 rounded-md text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${entry.type === 'credit' ? 'bg-gray-100 cursor-not-allowed' : ''
                                        }`}
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    aria-label="Debit amount"
                                />

                                {/* Credit Input */}
                                <input
                                    type="number"
                                    value={entry.credit}
                                    onChange={(e) => handleInputChange('credit', e.target.value, index)}
                                    disabled={entry.type === 'debit'}
                                    className={`p-2 border form-control border-gray-300 rounded-md text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${entry.type === 'debit' ? 'bg-gray-100 cursor-not-allowed' : ''
                                        }`}
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    aria-label="Credit amount"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Totals Section */}
                    <div className="grid grid-cols-4 gap-4 font-medium text-gray-700 border-t border-gray-200 pt-2">
                        <div></div>
                        <div className='form-label'>Total</div>
                        <div className="text-right form-label">
                            {totals.debit.toFixed(2)}
                        </div>
                        <div className="text-right form-label">
                            {totals.credit.toFixed(2)}
                        </div>
                    </div>

                    {/* Narration */}
                    <div>
                        <label
                            htmlFor="narration"
                            className="block form-label text-sm font-medium text-gray-700 mb-1"
                        >
                            Narration
                        </label>
                        <textarea
                            id="narration"
                            value={formData.narration}
                            onChange={(e) => handleInputChange('narration', e.target.value)}
                            className="w-full form-control p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows="4"
                            placeholder="Enter narration..."
                            aria-label="Narration"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className={`bg-lightBtn dark:bg-darkBtn p-3 rounded-md text-white  text-center btn btn inline-flex justify-center`}
                        >
                            Save Voucher
                        </button>
                    </div>
                </form>
            </div>
        </div>



    );
}

export default CreateVoucher;