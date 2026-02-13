import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import transactionSeriesService from "../../../services/transactionSeries/tansactionSeries.service";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import toast from "react-hot-toast";

// Collection list with labels (ordered logically)
const collections = [
    { collectionName: 'purchase_order', label: 'Purchase Order' },
    { collectionName: 'purchase_invoice', label: 'Purchase Invoice' },
    { collectionName: 'purchase_return', label: 'Purchase Return' },
    { collectionName: 'debit_note', label: 'Debit Note' },
    { collectionName: 'payment_out', label: 'Payment Out' },
    { collectionName: 'sale_quotation', label: 'Sale Quotation' },
    { collectionName: 'sale_performa', label: 'Sale Proforma' },
    { collectionName: 'sale_invoice', label: 'Sale Invoice' },
    { collectionName: 'sale_return', label: 'Sale Return' },
    { collectionName: 'credit_note', label: 'Credit Note' },
    { collectionName: 'payment_in', label: 'Payment In' },
    { collectionName: 'delivery_challan', label: 'Delivery Challan' },
];

function CreateTransactionSeries({ selectedYear }) {
    // const [selectedYear, setSelectedYear] = useState('2026-27');
    const [seriesData, setSeriesData] = useState([]);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    // Year dropdown
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);

    // Generate financial years 2000-01 to 3000-01
    const years = useMemo(() => {
        const yrs = [];
        for (let y = 2000; y <= 3000; y++) {
            yrs.push(`${y}-${String(y + 1).slice(-2)}`);
        }
        return yrs;
    }, []);

    const filteredYears = useMemo(() => {
        if (!searchTerm) return years;
        const term = searchTerm.toLowerCase();
        return years.filter((year) => year.toLowerCase().includes(term));
    }, [years, searchTerm]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchTerm("");
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Auto-focus search input
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen]);

    // Reset form when year changes
    useEffect(() => {
        setSeriesData(
            collections.map((col) => ({
                collectionName: col.collectionName,
                prefix: '',
                nextNum: "",
            }))
        );
        setError(null);
    }, [selectedYear]);

    // const handleSelectYear = (year) => {
    //     setSelectedYear(year);
    //     setIsOpen(false);
    //     setSearchTerm(""); 
    // };

    // Handle input change
    const handleChange = useCallback((collectionName, field, value) => {
        setSeriesData((prev) =>
            prev.map((item) =>
                item.collectionName === collectionName
                    ? {
                        ...item,
                        [field]: field === 'nextNum' ? (value === '' ? '' : Number(value)) : value,
                    }
                    : item
            )
        );
    }, []);

    // Validation + Create
    const handleCreate = async () => {
        // Required field validation
        const emptyFields = seriesData.filter(
            (item) => !item.prefix?.trim() || !item.nextNum || item.nextNum < 1
        );

        if (emptyFields.length > 0) {
            setError('All Prefix and Starting Number fields are required.');
            toast.error('Please fill all required fields');
            return;
        }

        setSaving(true);
        setError(null);

        try {
            const payload = {
                financialYear: selectedYear,
                series: seriesData.map((item) => ({
                    collectionName: item.collectionName,
                    prefix: item.prefix.trim().toUpperCase(), // Standardize prefix
                    nextNum: Number(item.nextNum),
                })),
            };

            // Change this to your actual service method name if different
            await transactionSeriesService.createSeries(payload);

            toast.success(`Transaction series created successfully for ${selectedYear}!`);

            // Reset form after success
            setSeriesData(
                collections.map((col) => ({
                    collectionName: col.collectionName,
                    prefix: '',
                    nextNum: 10001,
                }))
            );
        } catch (err) {
            console.error(err);
            const msg = err?.response?.data?.message || 'Failed to create transaction series';
            setError(msg);
            toast.error(msg);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="md:p-6 p-4 max-w-7xl mx-auto">
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
                <div className='float-end py-4 px-2'>

                    <label className='mr-2' htmlFor="">Year:</label>
                    <input type="text"
                        value={selectedYear}
                        disabled
                        className="w-52 px-5 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"

                    />
                </div>
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 border-b">
                            <th className="px-8 py-5 text-left font-semibold text-gray-600">Transaction Type</th>
                            <th className="px-8 py-5 text-left font-semibold text-gray-600 w-52">Prefix</th>
                            <th className="px-8 py-5 text-left font-semibold text-gray-600 w-52">Starting Number</th>
                            <th className="px-8 py-5 text-left font-semibold text-gray-600 w-52">Preview</th>
                        </tr>
                    </thead>
                    <tbody>
                        {seriesData.map((item) => {
                            const label = collections.find((c) => c.collectionName === item.collectionName)?.label || item.collectionName;

                            return (
                                <tr key={item.collectionName} className="border-b last:border-none hover:bg-gray-50 transition-colors">
                                    <td className="px-8 py-6 font-medium text-gray-800">{label}</td>

                                    <td className="px-8 py-6">
                                        <input
                                            type="text"
                                            value={item.prefix || ''}
                                            onChange={(e) => handleChange(item.collectionName, 'prefix', e.target.value)}
                                            placeholder="e.g. PO"
                                            maxLength={10}
                                            className="w-full px-5 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                                        />
                                    </td>
                                    <td className="px-8 py-6">
                                        <input
                                            type="number"
                                            value={item.nextNum || ''}
                                            onChange={(e) => handleChange(item.collectionName, 'nextNum', e.target.value)}
                                            min="1"
                                            placeholder="eg. 10001"
                                            className="w-full px-5 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                                        />
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="font-mono bg-gray-100 px-4 py-2.5 rounded-lg text-gray-700 font-medium tracking-wider">
                                            {(item.prefix || '—')}{item.nextNum || '00000'}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Footer Actions */}
            <div className="mt-10 flex justify-end gap-4">
                <button
                    onClick={handleCreate}
                    disabled={saving}
                    className="px-12 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold rounded-lg transition-all flex items-center gap-2 shadow-sm"
                >
                    {saving ? (
                        <>
                            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                            Creating...
                        </>
                    ) : (
                        'Create Transaction Series'
                    )}
                </button>
            </div>
        </div>
    );
}

export default CreateTransactionSeries;