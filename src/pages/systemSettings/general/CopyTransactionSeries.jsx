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

function CopyTransactionSeries({ creationYear }) {

    console.log("abc", creationYear);

    const [selectedYear, setSelectedYear] = useState(null);
    const [seriesData, setSeriesData] = useState([]);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const [uniqueYears, setUniqueYears] = useState([]);
    console.log("uniqueYears", uniqueYears);
    const [seriesOption, setSeriesOption] = useState('continue');

    // Year dropdown
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);

    useEffect(() => {
        getUniqueYears();
    }, []);

    async function getUniqueYears(params) {
        try {
            const response = await transactionSeriesService.getUniqueYears();
            setUniqueYears(response?.data)
        } catch (error) {
            console.log("error", error);
        }
    }


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
                nextNum: 10001,
            }))
        );
        setError(null);
    }, [selectedYear]);

    const handleSelectYear = (year) => {
        setSelectedYear(year);
        setIsOpen(false);
        setSearchTerm("");
    };


    const fetchSeries = useCallback(async (year) => {
        // setLoading(true);
        setError(null);
        try {
            const response = await transactionSeriesService.getSeriesList(year);
            setSeriesData(response?.data || []);
        } catch (err) {
            console.error('Error fetching transaction series:', err?.response?.data?.message);
            setError(err?.response?.data?.message || 'Failed to load transaction series. Please try again.');
            setSeriesData([])
        } finally {
            // setLoading(false);
        }
    }, []);

    // Load data when year changes
    useEffect(() => {
        if (selectedYear) {
            fetchSeries(selectedYear);
        }
    }, [selectedYear, fetchSeries]);

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
                financialYear: creationYear,
                series: seriesData.map((item) => ({
                    collectionName: item.collectionName,
                    prefix: item.prefix.trim().toUpperCase(), // Standardize prefix
                    nextNum: Number(item.nextNum),
                })),
            };

            // Change this to your actual service method name if different
            await transactionSeriesService.createSeries(payload);

            toast.success(`Transaction series created successfully for ${creationYear}!`);

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

            {
                !selectedYear ?

                    <div className="flex flex-col items-center gap-3">

                        <h3 className='text-xl'>Copy series from</h3>


                        <label className="font-medium text-gray-700">Financial Year:</label>
                        {/* Dropdown Trigger Button */}
                        <div className='relative'>

                            <button
                                type="button"
                                onClick={() => setIsOpen(!isOpen)}
                                className="w-48 px-4 py-2.5  border border-gray-300 rounded-lg bg-white hover:bg-gray-50 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                            >
                                <span className="font-medium text-gray-900">{selectedYear}</span>
                                <span className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
                                    <MdOutlineKeyboardArrowDown />
                                </span>
                            </button>

                            {/* Custom Dropdown Menu */}
                            {isOpen && (
                                <div className="absolute top-full left-0 mt-2  bg-white border border-gray-300 rounded-xl shadow-2xl overflow-hidden z-50">
                                    {/* Search Box */}
                                    <div className="p-3 border-b border-gray-200">
                                        <input
                                            ref={searchInputRef}
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            placeholder="Search year..."
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                        />
                                    </div>

                                    {/* Scrollable List - Max 400px height */}
                                    <div className="max-h-[18rem] overflow-y-auto py-2 custom-scroll">
                                        {uniqueYears.length === 0 ? (
                                            <div className="px-4 py-10 text-center text-gray-500 text-sm">
                                                No matching year found
                                            </div>
                                        ) : (
                                            uniqueYears.map((year) => (
                                                <div
                                                    key={year}
                                                    onClick={() => handleSelectYear(year)}
                                                    className={`px-4 py-3 text-sm cursor-pointer hover:bg-emerald-50 flex items-center justify-between transition-colors
                    ${year === selectedYear ? "bg-emerald-50 text-emerald-700 font-medium" : "text-gray-700"}
                  `}
                                                >
                                                    <span>{year}</span>
                                                    {year === selectedYear && <span className="text-emerald-600">✓</span>}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}

                        </div>



                    </div>
                    :

                    <>
                        {/* Table */}
                        <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">

                            <div className='flex items-center justify-between'>

                                <div className='px-8'>

                                    <button
                                        onClick={() => setSelectedYear(null)}
                                        className=" px-12 py-3  bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold rounded-lg transition-all flex items-center gap-2 shadow-sm"
                                    >Reselect</button>

                                </div>



                                <div className='float-end py-4 px-8 flex md:flex-row flex-col gap-2'>

                                    <div>

                                        <label className='mr-2' htmlFor="">Copied from:</label>
                                        <input type="text"
                                            value={selectedYear}
                                            disabled
                                            className="w-52 px-5 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                                        />
                                    </div>

                                      <div>

                                        <label className='mr-2' htmlFor="">Creating for:</label>
                                        <input type="text"
                                            value={creationYear}
                                            disabled
                                            className="w-52 px-5 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                                        />
                                    </div>


                                </div>

                            </div>

                            <div className="px-8 space-y-3">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        id="continue"
                                        name="seriesOption"
                                        value="continue"
                                        checked={seriesOption === 'continue'}
                                        onChange={(e) => setSeriesOption(e.target.value)}
                                        className="w-4 h-4 accent-blue-600 cursor-pointer"
                                    />
                                    <label htmlFor="continue" className="cursor-pointer">
                                        Continue Series from last serial number
                                    </label>
                                </div>

                                <div className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        id="break"
                                        name="seriesOption"
                                        value="break"
                                        checked={seriesOption === 'break'}
                                        onChange={(e) => setSeriesOption(e.target.value)}
                                        className="w-4 h-4 accent-blue-600 cursor-pointer"
                                    />
                                    <label htmlFor="break" className="cursor-pointer">
                                        Break and custom reset
                                    </label>
                                </div>

                                {/* <div className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        id="break"
                                        name="seriesOption"
                                        value="break"
                                        checked={seriesOption === 'break'}
                                        onChange={(e) => setSeriesOption(e.target.value)}
                                        className="w-4 h-4 accent-blue-600 cursor-pointer"
                                    />
                                    <label htmlFor="break" className="cursor-pointer">
                                        Break and start
                                    </label>
                                </div> */}
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
                                                        disabled={seriesOption === 'continue'}
                                                        className="w-full px-5 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                                                    />
                                                </td>

                                                <td className="px-8 py-6">
                                                    <input
                                                        type="number"
                                                        value={item.nextNum || ''}
                                                        onChange={(e) => handleChange(item.collectionName, 'nextNum', e.target.value)}
                                                        min="1"
                                                        placeholder="10001"
                                                        disabled={seriesOption === 'continue'}
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


                    </>


            }


        </div>
    );
}

export default CopyTransactionSeries;