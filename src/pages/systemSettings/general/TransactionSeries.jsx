import React, { useEffect, useState, useCallback, useRef, useMemo, Fragment } from 'react';
import transactionSeriesService from "../../../services/transactionSeries/tansactionSeries.service";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import toast from "react-hot-toast"
import { Dialog, Transition } from "@headlessui/react";
import Icon from "@/components/ui/Icon";
import useDarkmode from '@/hooks/useDarkMode';
import Button from '../../../components/ui/Button';


import CreateTransactionSeries from "./CreateTransactionSeries";
import CopyTransactionSeries from "./CopyTransactionSeries";


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

function TransactionSeries({ noFade }) {
  const [isDark] = useDarkmode();
  const [series, setSeries] = useState([]);
  const [selectedYear, setSelectedYear] = useState('2026-27');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);


  const [copyModel, setCopyModel] = useState(false);
  const [crearteModel, SetCreateModel] = useState(false);


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
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                  {filteredYears.length === 0 ? (
                    <div className="px-4 py-10 text-center text-gray-500 text-sm">
                      No matching year found
                    </div>
                  ) : (
                    filteredYears.map((year) => (
                      <div
                        key={year}
                        onClick={() => handleSelect(year)}
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      maxLength={10}
                    />
                  </td>
                  <td className="px-6 py-5">
                    <input
                      type="number"
                      value={item.nextNum || ''}
                      onChange={(e) => handleChange(item._id, 'nextNum', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      min="1"
                    />
                  </td>
                  <td className="px-6 py-5">
                    <p>{item?.prefix}{item.nextNum}</p>
                  </td>
                </tr>
              )) :

                <tr >
                  <td
                    colSpan={4}
                    className="text-center  gap-2 py-16 text-gray-500 font-medium"
                  >


                    <div className='mb-8'> No Series Found.</div>

                    <div className='flex justify-center gap-2'>

                      <button
                        className="px-8 py-3 bg-emerald-600/20 hover:bg-emerald-800/40 border border-dashed border-emerald-700 disabled:bg-emerald-400 text-black font-semibold rounded-lg transition-colors flex items-center gap-2"
                        onClick={() => setCopyModel(true)}
                      >
                        Copy Series
                      </button>

                      <button
                        className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                        onClick={() => SetCreateModel(true)}
                      >
                        Create New Series
                      </button>


                    </div>


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
          className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
        >
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>



      {/* create model */}

      <Transition appear show={crearteModel} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[999]"
          onClose={() => { }}
        >
          {(
            <Transition.Child
              as={Fragment}
              enter={noFade ? "" : "duration-300 ease-out"}
              enterFrom={noFade ? "" : "opacity-0"}
              enterTo={noFade ? "" : "opacity-100"}
              leave={noFade ? "" : "duration-200 ease-in"}
              leaveFrom={noFade ? "" : "opacity-100"}
              leaveTo={noFade ? "" : "opacity-0"}
            >
              <div className="fixed inset-0 bg-slate-900/50 backdrop-filter backdrop-blur-sm" />
            </Transition.Child>
          )}
          <div
            className="fixed inset-0 "
          >
            <div
              className={`flex min-h-full justify-center text-center p-6 items-center `}
            >
              <Transition.Child
                as={Fragment}
                enter={noFade ? "" : "duration-300  ease-out"}
                enterFrom={noFade ? "" : "opacity-0 scale-95"}
                enterTo={noFade ? "" : "opacity-100 scale-100"}
                leave={noFade ? "" : "duration-200 ease-in"}
                leaveFrom={noFade ? "" : "opacity-100 scale-100"}
                leaveTo={noFade ? "" : "opacity-0 scale-95"}
              >
                <Dialog.Panel
                  className={`w-full transform rounded-md text-left align-middle shadow-xl transition-all max-w-7xl ${isDark ? "bg-darkSecondary text-white" : "bg-light"}`}
                >
                  <div
                    className={`relative overflow-hidden py-4 px-5 text-lightModalHeaderColor flex justify-between bg-white border-b border-lightBorderColor dark:bg-darkInput dark:border-b dark:border-darkSecondary `}
                  >
                    <h2 className="capitalize leading-6 tracking-wider text-xl font-semibold text-lightModalHeaderColor dark:text-darkTitleColor">
                      Create Series
                    </h2>
                    <button onClick={() => SetCreateModel(false)} className="text-lightmodalCrosscolor hover:text-lightmodalbtnText text-[22px]">
                      <Icon icon="heroicons-outline:x" />
                    </button>
                  </div>

                  <div className="p-4 overflow-y-auto max-h-[80vh]">

                    <CreateTransactionSeries selectedYear={selectedYear} />

                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>


      {/* copy model */}

      <Transition appear show={copyModel} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[999]"
          onClose={() => { }}
        >
          {(
            <Transition.Child
              as={Fragment}
              enter={noFade ? "" : "duration-300 ease-out"}
              enterFrom={noFade ? "" : "opacity-0"}
              enterTo={noFade ? "" : "opacity-100"}
              leave={noFade ? "" : "duration-200 ease-in"}
              leaveFrom={noFade ? "" : "opacity-100"}
              leaveTo={noFade ? "" : "opacity-0"}
            >
              <div className="fixed inset-0 bg-slate-900/50 backdrop-filter backdrop-blur-sm" />
            </Transition.Child>
          )}
          <div
            className="fixed inset-0 "
          >
            <div
              className={`flex min-h-full justify-center text-center p-6 items-center `}
            >
              <Transition.Child
                as={Fragment}
                enter={noFade ? "" : "duration-300  ease-out"}
                enterFrom={noFade ? "" : "opacity-0 scale-95"}
                enterTo={noFade ? "" : "opacity-100 scale-100"}
                leave={noFade ? "" : "duration-200 ease-in"}
                leaveFrom={noFade ? "" : "opacity-100 scale-100"}
                leaveTo={noFade ? "" : "opacity-0 scale-95"}
              >
                <Dialog.Panel
                  className={`w-full transform rounded-md text-left align-middle shadow-xl transition-all max-w-7xl ${isDark ? "bg-darkSecondary text-white" : "bg-light"}`}
                >
                  <div
                    className={`relative overflow-hidden py-4 px-5 text-lightModalHeaderColor flex justify-between bg-white border-b border-lightBorderColor dark:bg-darkInput dark:border-b dark:border-darkSecondary `}
                  >
                    <h2 className="capitalize leading-6 tracking-wider text-xl font-semibold text-lightModalHeaderColor dark:text-darkTitleColor">
                      Copy Series
                    </h2>
                    <button onClick={() => setCopyModel(false)} className="text-lightmodalCrosscolor hover:text-lightmodalbtnText text-[22px]">
                      <Icon icon="heroicons-outline:x" />
                    </button>
                  </div>

                  <div className="p-4 overflow-y-auto max-h-[80vh]">

                    <CopyTransactionSeries selectedYear={selectedYear} />

                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>














    </div>
  );
}

export default TransactionSeries;



