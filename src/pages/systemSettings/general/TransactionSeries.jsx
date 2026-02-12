// import React, { useEffect, useState } from 'react'
// import tansactionSeriesService from '../../../services/transactionSeries/tansactionSeries.service';

// function TransactionSeries() {

//     const currentYear = "2026-2027";

//     const [series, setSeries] = useState([]);


//     console.log("series", series);





//     useEffect(() => {
//         getTransactionSeries()
//     },[]);


//     async function getTransactionSeries(params) {
//         try {
//             const response = await tansactionSeriesService.getSeriesList(currentYear);
//             setSeries(response?.data)
//         } catch (error) {
//             console.log("error while getting the series", error);
//         }
//     }



//   return (
//     <div>TransactionSeries</div>
//   )
// }

// export default TransactionSeries



import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import transactionSeriesService from "../../../services/transactionSeries/tansactionSeries.service";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import toast from "react-hot-toast"

// Human-readable labels for collection names
const collectionLabels = {
  purchase_order: 'Purchase Order',
  purchase_invoice: 'Purchase Invoice',
  purchase_return: 'Purchase Return',
  debit_note: 'Debit Note',
  payment_out: 'Payment Out',
  sale_quotation: 'Sale Quotation',
  sale_performa: 'Sale Proforma',
  sale_invoice: 'Sale Invoice',
  sale_return: 'Sale Return',
  credit_note: 'Credit Note',
  payment_in: 'Payment In',
  delivery_challan: 'Delivery Challan',
};

function TransactionSeries() {
  const [series, setSeries] = useState([]);
  const [selectedYear, setSelectedYear] = useState('2026-27');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Generate financial years from 2000-01 to 3000-01

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Generate years from 2000-01 to 3000-01
  const years = useMemo(() => {
    const yrs = [];
    for (let y = 2000; y <= 3000; y++) {
      yrs.push(`${y}-${String(y + 1).slice(-2)}`);
    }
    return yrs;
  }, []);

  // Filter years based on search input
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

  // Auto-focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (year) => {
    setSelectedYear(year);
    setIsOpen(false);
    setSearchTerm("");
  };












  // Fetch series for selected year
  const fetchSeries = useCallback(async (year) => {
    setLoading(true);
    setError(null);
    try {
      const response = await transactionSeriesService.getSeriesList(year);
      setSeries(response?.data || []);
    } catch (err) {
      console.error('Error fetching transaction series:', err?.response?.data?.message);
      setError(err?.response?.data?.message || 'Failed to load transaction series. Please try again.');
      setSeries([])
    } finally {
      setLoading(false);
    }
  }, []);

  // Load data when year changes
  useEffect(() => {
    fetchSeries(selectedYear);
  }, [selectedYear, fetchSeries]);

  // Handle input changes
  const handleChange = useCallback((id, field, value) => {
    setSeries((prev) =>
      prev.map((item) =>
        item._id === id
          ? {
            ...item,
            [field]: field === 'nextNum' ? Number(value) || 10001 : value,
          }
          : item
      )
    );
  }, []);

  // Save all changes
  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const response = await transactionSeriesService.update({ updates: series });
      toast.success('Transaction series saved successfully!')
    } catch (err) {
      console.error('Error saving series:', err?.response?.data?.message);
      setError(err?.response?.data?.message);
      toast.error(err?.response?.data?.message)
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="md:p-6 p-2  mx-auto">
      {/* Header */}
      <div className="flex md:flex-row flex-col gap-2 justify-between items-center mb-8">
        <h1 className="text-xl font-bold text-gray-800">Transaction Series Settings</h1>

        {/* Year Selector */}
        <div className="flex  items-center gap-3">
          <label className="font-medium text-gray-700">Financial Year:</label>
          {/* <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select> */}
          {/* Dropdown Trigger Button */}
          <div className='relative'>

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="w-48 px-4 py-2.5  border border-gray-300 rounded-lg bg-white hover:bg-gray-50 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                {/* Scrollable List - Max 400px height */}
                <div className="max-h-[18rem] overflow-y-auto py-2 custom-scroll">
                  {filteredYears.length === 0 ? (
                    <div className="px-4 py-10 text-center text-gray-500 text-sm">
                      No matching year found
                    </div>
                  ) : (
                    filteredYears.map((year) => (
                      <div
                        key={year}
                        onClick={() => handleSelect(year)}
                        className={`px-4 py-3 text-sm cursor-pointer hover:bg-blue-50 flex items-center justify-between transition-colors
                    ${year === selectedYear ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700"}
                  `}
                      >
                        <span>{year}</span>
                        {year === selectedYear && <span className="text-blue-600">✓</span>}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

          </div>



        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-auto">
        <table className="w-full ">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-gray-700">Transaction Type</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-700 w-48">Prefix</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-700 w-48">Starting Number</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-700 w-48">Preview</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-16 text-gray-500">
                  Loading series...
                </td>
              </tr>
            ) : (
              series && series?.length > 0 ? series?.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-5 font-medium text-gray-800">
                    {collectionLabels[item.collectionName] || item.collectionName}
                  </td>
                  <td className="px-6 py-5">
                    <input
                      type="text"
                      value={item.prefix || ''}
                      onChange={(e) => handleChange(item._id, 'prefix', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      maxLength={10}
                    />
                  </td>
                  <td className="px-6 py-5">
                    <input
                      type="number"
                      value={item.nextNum || ''}
                      onChange={(e) => handleChange(item._id, 'nextNum', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                    />
                  </td>
                  <td className="px-6 py-5">
                    <p>{item?.prefix}{item.nextNum}</p>
                  </td>
                </tr>
              )) :

                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-16 text-gray-500 font-medium"
                  >
                    No Series Found.
                  </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
        >
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>
    </div>
  );
}

export default TransactionSeries;



