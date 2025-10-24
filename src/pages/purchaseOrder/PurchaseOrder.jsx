import React, { useEffect, Fragment, useState } from 'react';
import { BsPlus } from "react-icons/bs";
import { Card } from "@mui/material";
import useDarkmode from '@/hooks/useDarkMode';
import { GoTrash, GoCheck } from "react-icons/go";
import supplierService from '@/services/supplier/supplier.service';
import { Dialog, Transition } from "@headlessui/react";
import Icon from "@/components/ui/Icon";
import Button from '../../components/ui/Button';

const PurchaseOrderPage = ({ noFade, scrollContent }) => {
  const [isDark] = useDarkmode();
  const buyerState = "West Bengal"; // Assuming buyer's state; adjust as needed
  const [formData, setFormData] = useState({
    supplier: null,
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: '',
    },
    poNumber: '',
    poDate: new Date().toISOString().split('T')[0],
    items: [{ srNo: 1, itemName: '', mrp: 0, discount: 0, taxableAmount: 0, gstPercent: 0, cgstPercent: 0, sgstPercent: 0, igstPercent: 0, cgst: 0, sgst: 0, igst: 0, tax: 0, totalAmount: 0 }],
    notes: '',
    bankDetails: {
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      branch: '',
    },
    isInterState: false,
    roundOff: false,
    paymentMethod: '',
    paidAmount: 0,
    balance: 0,
  });
  const [suppliers, setSuppliers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [showNotesInput, setShowNotesInput] = useState(false);
  const [showBankInput, setShowBankInput] = useState(false);

  const handleInputChange = (e, section) => {
    const { name, value } = e.target;
    if (section) {
      setFormData({
        ...formData,
        [section]: { ...formData[section], [name]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const calculateTaxes = (item) => {
    const rate = item.gstPercent;
    if (formData.isInterState) {
      item.igstPercent = rate;
      item.cgstPercent = 0;
      item.sgstPercent = 0;
      item.igst = item.taxableAmount * rate / 100;
      item.cgst = 0;
      item.sgst = 0;
    } else {
      item.cgstPercent = rate / 2;
      item.sgstPercent = rate / 2;
      item.igstPercent = 0;
      item.cgst = item.taxableAmount * (rate / 2) / 100;
      item.sgst = item.cgst;
      item.igst = 0;
    }
    item.tax = item.cgst + item.sgst + item.igst;
    item.totalAmount = item.taxableAmount + item.tax;
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [name]: name === 'itemName' ? value : parseFloat(value) || 0 };

    const item = newItems[index];
    item.taxableAmount = item.mrp - item.discount;
    calculateTaxes(item);

    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    const newSrNo = formData.items.length + 1;
    setFormData({
      ...formData,
      items: [...formData.items, { srNo: newSrNo, itemName: '', mrp: 0, discount: 0, taxableAmount: 0, gstPercent: 0, cgstPercent: 0, sgstPercent: 0, igstPercent: 0, cgst: 0, sgst: 0, igst: 0, tax: 0, totalAmount: 0 }],
    });
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index).map((item, i) => ({ ...item, srNo: i + 1 }));
      setFormData({ ...formData, items: newItems });
    }
  };

  const calculateTotals = () => {
    const totalTaxable = formData.items.reduce((sum, item) => sum + item.taxableAmount, 0);
    const totalTaxes = formData.items.reduce((sum, item) => sum + item.tax, 0);
    const totalDiscount = formData.items.reduce((sum, item) => sum + item.discount, 0);
    const totalCGST = formData.items.reduce((sum, item) => sum + item.cgst, 0);
    const totalSGST = formData.items.reduce((sum, item) => sum + item.sgst, 0);
    const totalIGST = formData.items.reduce((sum, item) => sum + item.igst, 0);
    const grandTotal = totalTaxable + totalTaxes;
    const roundOffAmount = formData.roundOff ? Math.round(grandTotal) - grandTotal : 0;
    const finalTotal = grandTotal + roundOffAmount;
    return { totalTaxable, totalTaxes, totalDiscount, totalCGST, totalSGST, totalIGST, grandTotal, roundOffAmount, finalTotal };
  };

  const totals = calculateTotals();

  useEffect(() => {
    setFormData(prev => ({ ...prev, balance: totals.finalTotal - prev.paidAmount }));
  }, [totals.finalTotal, formData.paidAmount]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.supplier) {
      alert('Please select a supplier before submitting.');
      return;
    }
    console.log('Purchase Order Data:', formData);
    // Submit to API here
    alert('Purchase Order submitted successfully!');
  };

  const handleSelectSupplier = (supplier) => {
    setFormData({
      ...formData,
      supplier,
      isInterState: supplier.state !== buyerState,
      shippingAddress: {
        street: supplier.address || '',
        city: supplier.city || '',
        state: supplier.state || '',
        zip: supplier.ZipCode || '',
        country: supplier.country || '',
      },
    });
    setOpenModal(false);
  };

  useEffect(() => {
    const getParties = async () => {
      try {
        const response = await supplierService.getAllActive();
        setSuppliers(response?.data || []);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };
    getParties();
  }, []);

  const isBankFilled = Object.values(formData.bankDetails).some(value => value !== '');

  return (
    <div>
      <Card>
        <div className={`${isDark ? "bg-darkSecondary text-white" : ""} p-5`}>
          <form onSubmit={handleSubmit}>
            {/* Section 1: Supplier, PO Details, and Shipping Address */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Purchase Invoice</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Card 1: Supplier */}
                <div className={`bg-white dark:bg-transparent ${formData.supplier ? "lg:col-span-1 md:col-span-1" : "lg:col-span-2 md:col-span-2 "}   rounded-lg border border-gray-200`}>
                  <div className='bg-gray-100 dark:bg-transparent dark:border-b-[2px] dark:border-white lg:h-[20%] md:h-[30%] p-2 rounded-t-lg flex justify-between items-center'>
                    <h3 className="text-lg font-medium text-gray-700">Bill From</h3>
                    {formData.supplier && (
                      <Button
                        text=" Change Party"
                        className="text-indigo-600 border py-0 border-indigo-600 hover:bg-indigo-50"
                        onClick={() => setOpenModal(true)}
                      />
                    )}
                  </div>
                  <div className='lg:h-[80%] md:h-[88%] p-4'>
                    {formData.supplier ? (
                      <div className="text-sm">
                        <p><strong>Name:</strong> {formData.supplier.name}</p>
                        <p><strong>Contact Person:</strong> {formData.supplier.contactPerson}</p>
                        <p><strong>Email:</strong> {formData.supplier.emailContact}</p>
                        <p><strong>Contact Number:</strong> {formData.supplier.contactNumber}</p>
                        <p><strong>Address:</strong> {formData.supplier.address}, {formData.supplier.city}, {formData.supplier.state}, {formData.supplier.ZipCode}, {formData.supplier.country}</p>
                        <p><strong>GST/VAT:</strong> {formData.supplier.GstVanNumber}</p>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setOpenModal(true)}
                        className='flex items-center p-4 hover:bg-lightHoverBgBtn/20 hover:text-white border border-dashed border-lightHoverBgBtn dark:border-darkBtn rounded-md'
                      >
                        <BsPlus className='text-lightHoverBgBtn dark:text-darkBtn' />
                        <span className='text-lightHoverBgBtn dark:text-darkBtn'>
                          Add Party
                        </span>
                      </button>
                    )}
                  </div>
                </div>

                {/* card 2 */}
                {formData.supplier && (
                  <div className="bg-white dark:bg-transparent lg:col-span-1 md:col-span-1  rounded-lg border border-gray-200">
                    <div className='bg-gray-100 dark:bg-transparent dark:border-b-[2px] dark:border-white md:h-[20%] p-2 rounded-t-lg flex justify-between items-center'>
                      <h3 className="text-lg font-medium text-gray-700">Ship From</h3>
                      {formData.supplier && (
                        <Button
                          text=" Change Shipping"
                          className="text-indigo-600 border py-1 border-indigo-600 hover:bg-indigo-50"
                          onClick={() => setOpenModal(true)}
                        />
                      )}
                    </div>
                    <div className='h-[80%] p-4'>
                      {formData.supplier ? (
                        <div className="text-sm">
                          <p><strong>Name:</strong> {formData.supplier.name}</p>
                          <p><strong>Contact Person:</strong> {formData.supplier.contactPerson}</p>
                          <p><strong>Email:</strong> {formData.supplier.emailContact}</p>
                          <p><strong>Contact Number:</strong> {formData.supplier.contactNumber}</p>
                          <p><strong>Address:</strong> {formData.supplier.address}, {formData.supplier.city}, {formData.supplier.state}, {formData.supplier.ZipCode}, {formData.supplier.country}</p>
                          <p><strong>GST/VAT:</strong> {formData.supplier.GstVanNumber}</p>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setOpenModal(true)}
                          className='flex items-center p-4 hover:bg-lightHoverBgBtn/20 hover:text-white border border-dashed border-lightHoverBgBtn dark:border-darkBtn rounded-md'
                        >
                          <BsPlus className='text-lightHoverBgBtn dark:text-darkBtn' />
                          <span className='text-lightHoverBgBtn dark:text-darkBtn'>
                            Add Party
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Card 3: PO Details */}
                <div className="bg-white dark:bg-transparent lg:col-span-1 md:col-span-2 rounded-lg border border-gray-200">
                  <div className='bg-gray-100 dark:bg-transparent dark:border-b-[2px] dark:border-white md:h-[20%] h-[12%] p-2 rounded-t-lg'>
                    <h3 className="text-lg font-medium mb-2 text-gray-700">Purchase Order Details</h3>
                  </div>
                  <div className="h-[80%] p-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm">Purchase Inv No</label>
                      <input
                        type="text"
                        name="poNumber"
                        value={formData.poNumber}
                        onChange={handleInputChange}
                        className="form-control py-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm">Purchase Inv Date</label>
                      <input
                        type="date"
                        name="poDate"
                        value={formData.poDate}
                        onChange={handleInputChange}
                        className="form-control py-2"
                        required
                      />
                    </div>

                    <div className='col-span-1 md:col-span-2 border-dashed border-2 p-[3px]'>
                      <div className='flex md:flex-row flex-col gap-2 justify-between'>
                        <div className='w-full'>
                          <label className="text-sm">Due Date</label>
                          <input
                            type="date"
                            name="poDate"
                            value={formData.poDate}
                            onChange={handleInputChange}
                            className="form-control w-full py-2"
                            required
                          />
                        </div>

                        <div className='w-full'>
                          <label className="text-sm">Due Days</label>
                          <input
                            type="date"
                            name="poDate"
                            value={formData.poDate}
                            onChange={handleInputChange}
                            className="form-control w-full py-2"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Items Table */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Items</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-transparent border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200 dark:bg-transparent">
                      <th className="py-2 px-4 border border-gray-300 text-left text-sm font-medium text-gray-700 dark:text-white">SR. NO</th>
                      <th className="py-2 px-4 border border-gray-300 text-left text-sm font-medium text-gray-700 dark:text-white">Item Name</th>
                      <th className="py-2 px-4 border border-gray-300 text-left text-sm font-medium text-gray-700 dark:text-white">MRP</th>
                      <th className="py-2 px-4 border border-gray-300 text-left text-sm font-medium text-gray-700 dark:text-white">Discount</th>
                      <th className="py-2 px-4 border border-gray-300 text-left text-sm font-medium text-gray-700 dark:text-white w-[10rem]">Taxable Amount</th>
                      <th className="py-2 px-4 border border-gray-300 text-left text-sm font-medium text-gray-700 dark:text-white">GST (%)</th>
                      <th className="py-2 px-4 border border-gray-300 text-left text-sm font-medium text-gray-700 dark:text-white w-[10rem]">Tax Amount</th>
                      <th className="py-2 px-4 border border-gray-300 text-left text-sm font-medium text-gray-700 dark:text-white w-[10rem]">Total Amount</th>
                      <th className="py-2 px-4 border border-gray-300 text-left text-sm font-medium text-gray-700 dark:text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.items.map((item, index) => (
                      <tr key={index}>
                        <td className="py-2 px-4 border border-gray-300">{item.srNo}</td>
                        <td className="py-2 px-4 border border-gray-300">
                          <input
                            type="text"
                            name="itemName"
                            value={item.itemName}
                            onChange={(e) => handleItemChange(index, e)}
                            className="form-control py-2"
                            required
                          />
                        </td>
                        <td className="py-2 px-4 border border-gray-300">
                          <input
                            type="number"
                            name="mrp"
                            value={item.mrp}
                            onChange={(e) => handleItemChange(index, e)}
                            className="form-control py-2"
                            min="0"
                            step="0.01"
                            required
                          />
                        </td>
                        <td className="py-2 px-4 border border-gray-300">
                          <input
                            type="number"
                            name="discount"
                            value={item.discount}
                            onChange={(e) => handleItemChange(index, e)}
                            className="form-control py-2"
                            min="0"
                            step="0.01"
                          />
                        </td>
                        <td className="py-2 px-4 border border-gray-300 text-right">{item.taxableAmount.toFixed(2)}</td>
                        <td className="py-2 px-4 border border-gray-300 w-[10rem]">
                          <input
                            type="number"
                            name="gstPercent"
                            value={item.gstPercent}
                            onChange={(e) => handleItemChange(index, e)}
                            className="form-control py-2"
                            min="0"
                            step="0.01"
                          />
                        </td>
                        <td className="py-2 px-4 border border-gray-300 text-right w-[10rem]">{item.tax.toFixed(2)}</td>
                        <td className="py-2 px-4 border border-gray-300 text-right w-[10rem]">{item.totalAmount.toFixed(2)}</td>
                        <td className="py-2 px-4 border border-gray-300 text-center">
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="bg-gray-100 text-white px-2 py-1 rounded hover:bg-gray-200 disabled:opacity-50"
                            disabled={formData.items.length === 1}
                          >
                            <GoTrash className='text-gray-500' />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-100 dark:bg-transparent">
                      <td colSpan={3} className="py-2 px-4 border border-gray-300"></td>
                      <td className="py-2 px-4 border border-gray-300 text-left font-medium text-sm">Total Discount: {totals.totalDiscount.toFixed(2)}</td>
                      <td className="py-2 px-4 border border-gray-300 text-left font-medium text-sm">Total Taxable: {totals.totalTaxable.toFixed(2)}</td>
                      <td className="py-2 px-4 border border-gray-300"></td>
                      <td className="py-2 px-4 border border-gray-300 text-left font-medium text-sm">Total Taxes: {totals.totalTaxes.toFixed(2)}</td>
                      <td className="py-2 px-4 border border-gray-300 text-left font-bold text-sm">Grand Total: {totals.grandTotal.toFixed(2)}</td>
                      <td className="py-2 px-4 border border-gray-300"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <button
                type="button"
                onClick={addItem}
                className='mt-2 flex items-center p-2 hover:bg-lightHoverBgBtn/20 hover:text-white border border-dashed border-lightHoverBgBtn dark:border-darkBtn rounded-md'
              >
                <BsPlus className='text-lightHoverBgBtn dark:text-darkBtn' />
                <span className='text-lightHoverBgBtn dark:text-darkBtn'>
                  Add Item
                </span>
              </button>
            </section>

            <hr className="my-8 border-gray-300" />

            {/* Two-column layout with vertical divider */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
              {/* Vertical divider */}
              <div className="hidden md:block absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-px bg-gray-300"></div>

              {/* Left Side: Notes and Bank Details */}
              <div className="flex flex-col gap-6 pr-4">
                {/* Notes Section */}
                <section>
                  {showNotesInput ? (
                    <div>
                      <h2 className="text-xl font-semibold mb-4 text-gray-700">Notes</h2>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        className="form-control py-2 w-full"
                        rows="4"
                      />
                      <Button
                        text="Save"
                        className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                        onClick={() => setShowNotesInput(false)}
                      />
                    </div>
                  ) : formData.notes ? (
                    <div>
                      <h2 className="text-xl font-semibold mb-4 text-gray-700">Notes</h2>
                      <p className="text-gray-700">{formData.notes}</p>
                      <Button
                        text="Edit Notes"
                        className="mt-2 text-indigo-600 border py-1 border-indigo-600 hover:bg-indigo-50"
                        onClick={() => setShowNotesInput(true)}
                      />
                    </div>
                  ) : (
                    <Button
                      text="Add Notes"
                      className="text-indigo-600 border py-1 border-indigo-600 hover:bg-indigo-50"
                      onClick={() => setShowNotesInput(true)}
                    />
                  )}
                </section>

                {/* Bank Details Section */}
                <section>
                  {showBankInput ? (
                    <div className="bg-white dark:bg-transparent rounded-lg border border-gray-200 p-4">
                      <h2 className="text-xl font-semibold mb-4 text-gray-700">Bank Details for Payments</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="bankName"
                          placeholder="Bank Name"
                          value={formData.bankDetails.bankName}
                          onChange={(e) => handleInputChange(e, 'bankDetails')}
                          className="form-control py-2"
                        />
                        <input
                          type="text"
                          name="accountNumber"
                          placeholder="Account Number"
                          value={formData.bankDetails.accountNumber}
                          onChange={(e) => handleInputChange(e, 'bankDetails')}
                          className="form-control py-2"
                        />
                        <input
                          type="text"
                          name="ifscCode"
                          placeholder="IFSC Code"
                          value={formData.bankDetails.ifscCode}
                          onChange={(e) => handleInputChange(e, 'bankDetails')}
                          className="form-control py-2"
                        />
                        <input
                          type="text"
                          name="branch"
                          placeholder="Branch"
                          value={formData.bankDetails.branch}
                          onChange={(e) => handleInputChange(e, 'bankDetails')}
                          className="form-control py-2"
                        />
                      </div>
                      <Button
                        text="Save"
                        className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                        onClick={() => setShowBankInput(false)}
                      />
                    </div>
                  ) : isBankFilled ? (
                    <div className="bg-white dark:bg-transparent rounded-lg border border-gray-200 p-4">
                      <h2 className="text-xl font-semibold mb-4 text-gray-700">Bank Details for Payments</h2>
                      <div className="text-sm">
                        <p><strong>Bank Name:</strong> {formData.bankDetails.bankName}</p>
                        <p><strong>Account Number:</strong> {formData.bankDetails.accountNumber}</p>
                        <p><strong>IFSC Code:</strong> {formData.bankDetails.ifscCode}</p>
                        <p><strong>Branch:</strong> {formData.bankDetails.branch}</p>
                      </div>
                      <Button
                        text="Edit Bank Details"
                        className="mt-4 text-indigo-600 border py-1 border-indigo-600 hover:bg-indigo-50"
                        onClick={() => setShowBankInput(true)}
                      />
                    </div>
                  ) : (
                    <Button
                      text="Add Bank Detail"
                      className="text-indigo-600 border py-1 border-indigo-600 hover:bg-indigo-50"
                      onClick={() => setShowBankInput(true)}
                    />
                  )}
                </section>
              </div>

              {/* Right Side: Payment Description */}
              <div className="flex flex-col gap-6 pl-4">
                {/* Detailed Payment Summary */}
                <section>
                  <h2 className="text-xl font-semibold mb-4 text-gray-700">Payment Summary</h2>
                  <div className="bg-white dark:bg-transparent rounded-lg border border-gray-200 p-4">
                    <div className="flex justify-between mb-2 text-sm">
                      <span>Total Taxable Amount:</span>
                      <span>{totals.totalTaxable.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2 text-sm">
                      <span>Total CGST:</span>
                      <span>{totals.totalCGST.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2 text-sm">
                      <span>Total SGST:</span>
                      <span>{totals.totalSGST.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2 text-sm">
                      <span>Total IGST:</span>
                      <span>{totals.totalIGST.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2 text-sm">
                      <span>Total Tax Amount:</span>
                      <span>{totals.totalTaxes.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm">
                      <span>Grand Total:</span>
                      <span>{totals.grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </section>

                {/* Round Off Option */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="roundOff"
                    checked={formData.roundOff}
                    onChange={(e) => setFormData({ ...formData, roundOff: e.target.checked })}
                  />
                  <label className="text-sm text-gray-700">Round Off</label>
                  {formData.roundOff && (
                    <span className="text-sm text-gray-700">Round Off Amount: {totals.roundOffAmount.toFixed(2)}</span>
                  )}
                </div>

                {/* Payment Options */}
                <section>
                  <h2 className="text-xl font-semibold mb-4 text-gray-700">Payment Options</h2>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="text-sm">Payment Method</label>
                      <select
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleInputChange}
                        className="form-control py-2 w-full"
                      >
                        <option value="">Select Method</option>
                        <option value="Cash">Cash</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm">Paid Amount</label>
                      <input
                        type="number"
                        name="paidAmount"
                        value={formData.paidAmount}
                        onChange={handleInputChange}
                        className="form-control py-2 w-full"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Balance:</span>
                      <span>{formData.balance.toFixed(2)}</span>
                    </div>
                    <Button
                      text="Full Payment"
                      className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                      onClick={() => setFormData({ ...formData, paidAmount: totals.finalTotal, balance: 0 })}
                    />
                  </div>
                </section>
              </div>
            </div>

            <div className="text-right mt-8">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
              >
                Submit Purchase Order
              </button>
            </div>
          </form>
        </div>
      </Card>

      {/* Supplier Selection Modal */}
      <Transition appear show={openModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[99999]"
          onClose={() => setOpenModal(false)}
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
                  className={`w-full transform rounded-md text-left align-middle shadow-xl transition-all max-w-3xl ${isDark ? "bg-darkSecondary text-white" : "bg-light"}`}
                >
                  <div
                    className={`relative overflow-hidden py-4 px-5 text-lightModalHeaderColor flex justify-between bg-white border-b border-lightBorderColor dark:bg-darkInput dark:border-b dark:border-darkSecondary `}
                  >
                    <h2 className="capitalize leading-6 tracking-wider text-xl font-semibold text-lightModalHeaderColor dark:text-darkTitleColor">
                      Select Party
                    </h2>
                    <button onClick={() => setOpenModal(false)} className="text-lightmodalCrosscolor hover:text-lightmodalbtnText text-[22px]">
                      <Icon icon="heroicons-outline:x" />
                    </button>
                  </div>

                  <div className="p-4 overflow-y-auto max-h-[50vh]">
                    {suppliers.length > 0 ? (
                      suppliers.map((supplier) => (
                        <div
                          key={supplier._id}
                          className={`p-2 my-2 rounded cursor-pointer hover:bg-indigo-100 hover:text-black-500 flex justify-between items-center dark:hover:bg-gray-700 ${formData.supplier?._id === supplier._id ? 'bg-indigo-50 text-gray-500' : ''
                            }`}
                          onClick={() => handleSelectSupplier(supplier)}
                        >
                          <div>
                            <p className="font-medium">{supplier.name}</p>
                            <p className="text-sm">{supplier.contactPerson} - {supplier.emailContact}</p>
                          </div>
                          {formData.supplier?._id === supplier._id && (
                            <GoCheck className="text-green-500" />
                          )}
                        </div>
                      ))
                    ) : (
                      <p className={isDark ? 'text-gray-300' : 'text-gray-500'}>
                        No suppliers available
                      </p>
                    )}
                  </div>

                  <div className="px-4 py-3 flex justify-end space-x-3 border-t border-slate-100 dark:border-darkSecondary bg-white dark:bg-darkInput">
                    <Button
                      text="Cancel"
                      className="bg-lightmodalBgBtnHover lightmodalBgBtn text-white hover:bg-lightmodalBgBtn hover:text-lightmodalbtnText px-4 py-2 rounded"
                      onClick={() => setOpenModal(false)}
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default PurchaseOrderPage;









{/* <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="supplier-modal-title"
        aria-describedby="supplier-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: isDark ? 'rgb(31, 41, 55)' : 'white',
          border: '1px solid',
          borderColor: isDark ? 'rgb(75, 85, 99)' : 'rgb(209, 213, 219)',
          boxShadow: 24,
          borderRadius: 2,
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div
            className={`relative overflow-hidden rounded-t-lg py-4 px-5 text-lightModalHeaderColor flex justify-between bg-white border-b border-lightBorderColor dark:bg-darkInput dark:border-b dark:border-darkSecondary `}
          >
            <h2 className="capitalize leading-6 tracking-wider  text-xl font-semibold text-lightModalHeaderColor dark:text-darkTitleColor">
              Select Party
            </h2>
            <button onClick={() => setOpenModal(false)} className=" text-lightmodalCrosscolor hover:text-lightmodalbtnText text-[22px]">
              <Icon icon="heroicons-outline:x" />
            </button>
          </div>
          <Box sx={{
            p: 2,
            flex: 1,
            overflowY: 'auto',
          }}>
            {suppliers.length > 0 ? (
              suppliers.map((supplier) => (
                <div
                  key={supplier._id}
                  className={`p-2 mb-2 rounded cursor-pointer hover:bg-indigo-100 flex justify-between items-center ${formData.supplier?._id === supplier._id ? 'bg-indigo-50' : ''
                    }`}
                  onClick={() => handleSelectSupplier(supplier)}
                >
                  <div>
                    <p className="font-medium">{supplier.name}</p>
                    <p className="text-sm text-gray-500">{supplier.contactPerson} - {supplier.emailContact}</p>
                  </div>
                  {formData.supplier?._id === supplier._id && (
                    <GoCheck className="text-green-500" />
                  )}
                </div>
              ))
            ) : (
              <Typography className={isDark ? 'text-gray-300' : 'text-gray-500'}>
                No suppliers available
              </Typography>
            )}
          </Box>
          {(
            <div className="px-4 py-3 rounded-b-lg flex justify-end space-x-3 border-t border-slate-100 dark:border-darkSecondary  bg-white dark:bg-darkInput ">
              <div className="flex gap-2">
                <Button
                  text="Close"
                  // className="border bg-red-300 rounded px-5 py-2"
                  className="bg-lightmodalBgBtnHover lightmodalBgBtn text-white hover:bg-lightmodalBgBtn hover:text-lightmodalbtnText  px-4 py-2 rounded"
                  onClick={() => setOpenModal(false)}
                />
              </div>
            </div>
          )}
        </Box>
      </Modal> */}