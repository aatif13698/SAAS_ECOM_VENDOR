import React, { useState } from 'react';

const PurchaseOrderPage = () => {
  const [formData, setFormData] = useState({
    supplier: '',
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: '',
    },
    poNumber: '',
    poDate: new Date().toISOString().split('T')[0],
    items: [{ srNo: 1, itemName: '', mrp: 0, discount: 0, taxableAmount: 0, taxPercent: 0, tax: 0, totalAmount: 0 }],
    notes: '',
    bankDetails: {
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      branch: '',
    },
  });

  const [suppliers] = useState([
    { id: '1', name: 'Supplier A' },
    { id: '2', name: 'Supplier B' },
    // Add more suppliers or fetch from API
  ]);

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

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [name]: name === 'itemName' ? value : parseFloat(value) || 0 };

    // Calculate taxableAmount, tax, and totalAmount
    const item = newItems[index];
    item.taxableAmount = item.mrp - item.discount;
    item.tax = item.taxableAmount * (item.taxPercent / 100);
    item.totalAmount = item.taxableAmount + item.tax;

    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    const newSrNo = formData.items.length + 1;
    setFormData({
      ...formData,
      items: [...formData.items, { srNo: newSrNo, itemName: '', mrp: 0, discount: 0, taxableAmount: 0, taxPercent: 0, tax: 0, totalAmount: 0 }],
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
    const grandTotal = formData.items.reduce((sum, item) => sum + item.totalAmount, 0);
    return { totalTaxable, totalTaxes, totalDiscount, grandTotal };
  };

  const totals = calculateTotals();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Purchase Order Data:', formData);
    // Submit to API here
    alert('Purchase Order submitted successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800">Purchase Order</h1>
        
        <form onSubmit={handleSubmit}>
          {/* Section 1: Supplier, PO Details, and Shipping Address (Three Cards) */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Order Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: Supplier */}
              <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
                <h3 className="text-lg font-medium mb-2 text-gray-700">Supplier</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Select Supplier</label>
                  <select
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Card 2: Purchase Order Details */}
              <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
                <h3 className="text-lg font-medium mb-2 text-gray-700">Purchase Order Details</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Purchase Order Number</label>
                    <input
                      type="text"
                      name="poNumber"
                      value={formData.poNumber}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Purchase Order Date</label>
                    <input
                      type="date"
                      name="poDate"
                      value={formData.poDate}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Card 3: Shipping Address */}
              <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
                <h3 className="text-lg font-medium mb-2 text-gray-700">Shipping Address</h3>
                <div className="grid grid-cols-1 gap-4">
                  <input
                    type="text"
                    name="street"
                    placeholder="Street"
                    value={formData.shippingAddress.street}
                    onChange={(e) => handleInputChange(e, 'shippingAddress')}
                    className="block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.shippingAddress.city}
                    onChange={(e) => handleInputChange(e, 'shippingAddress')}
                    className="block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.shippingAddress.state}
                    onChange={(e) => handleInputChange(e, 'shippingAddress')}
                    className="block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                  <input
                    type="text"
                    name="zip"
                    placeholder="ZIP Code"
                    value={formData.shippingAddress.zip}
                    onChange={(e) => handleInputChange(e, 'shippingAddress')}
                    className="block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                  <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={formData.shippingAddress.country}
                    onChange={(e) => handleInputChange(e, 'shippingAddress')}
                    className="block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Items Table */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Items</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="py-2 px-4 border border-gray-300 text-left text-sm font-medium text-gray-700">SR. NO</th>
                    <th className="py-2 px-4 border border-gray-300 text-left text-sm font-medium text-gray-700">Item Name</th>
                    <th className="py-2 px-4 border border-gray-300 text-left text-sm font-medium text-gray-700">MRP</th>
                    <th className="py-2 px-4 border border-gray-300 text-left text-sm font-medium text-gray-700">Discount</th>
                    <th className="py-2 px-4 border border-gray-300 text-left text-sm font-medium text-gray-700">Taxable Amount</th>
                    <th className="py-2 px-4 border border-gray-300 text-left text-sm font-medium text-gray-700">Tax Percent (%)</th>
                    <th className="py-2 px-4 border border-gray-300 text-left text-sm font-medium text-gray-700">Tax Amount</th>
                    <th className="py-2 px-4 border border-gray-300 text-left text-sm font-medium text-gray-700">Total Amount</th>
                    <th className="py-2 px-4 border border-gray-300 text-left text-sm font-medium text-gray-700">Actions</th>
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
                          className="w-full rounded-md border border-gray-300 p-1 focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                      </td>
                      <td className="py-2 px-4 border border-gray-300">
                        <input
                          type="number"
                          name="mrp"
                          value={item.mrp}
                          onChange={(e) => handleItemChange(index, e)}
                          className="w-full rounded-md border border-gray-300 p-1 focus:ring-indigo-500 focus:border-indigo-500"
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
                          className="w-full rounded-md border border-gray-300 p-1 focus:ring-indigo-500 focus:border-indigo-500"
                          min="0"
                          step="0.01"
                        />
                      </td>
                      <td className="py-2 px-4 border border-gray-300 text-right">{item.taxableAmount.toFixed(2)}</td>
                      <td className="py-2 px-4 border border-gray-300">
                        <input
                          type="number"
                          name="taxPercent"
                          value={item.taxPercent}
                          onChange={(e) => handleItemChange(index, e)}
                          className="w-full rounded-md border border-gray-300 p-1 focus:ring-indigo-500 focus:border-indigo-500"
                          min="0"
                          step="0.01"
                        />
                      </td>
                      <td className="py-2 px-4 border border-gray-300 text-right">{item.tax.toFixed(2)}</td>
                      <td className="py-2 px-4 border border-gray-300 text-right">{item.totalAmount.toFixed(2)}</td>
                      <td className="py-2 px-4 border border-gray-300">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                          disabled={formData.items.length === 1}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-100">
                    <td colSpan={3} className="py-2 px-4 border border-gray-300"></td>
                    <td className="py-2 px-4 border border-gray-300 text-right font-medium">Total Discount: {totals.totalDiscount.toFixed(2)}</td>
                    <td className="py-2 px-4 border border-gray-300 text-right font-medium">Total Taxable: {totals.totalTaxable.toFixed(2)}</td>
                    <td className="py-2 px-4 border border-gray-300"></td>
                    <td className="py-2 px-4 border border-gray-300 text-right font-medium">Total Taxes: {totals.totalTaxes.toFixed(2)}</td>
                    <td className="py-2 px-4 border border-gray-300 text-right font-bold">Grand Total: {totals.grandTotal.toFixed(2)}</td>
                    <td className="py-2 px-4 border border-gray-300"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <button
              type="button"
              onClick={addItem}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Item
            </button>
          </section>

          {/* Section 3: Notes */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Notes</h2>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              rows="4"
            />
          </section>

          {/* Section 4: Bank Details */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Bank Details for Payments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="bankName"
                placeholder="Bank Name"
                value={formData.bankDetails.bankName}
                onChange={(e) => handleInputChange(e, 'bankDetails')}
                className="block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <input
                type="text"
                name="accountNumber"
                placeholder="Account Number"
                value={formData.bankDetails.accountNumber}
                onChange={(e) => handleInputChange(e, 'bankDetails')}
                className="block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <input
                type="text"
                name="ifscCode"
                placeholder="IFSC Code"
                value={formData.bankDetails.ifscCode}
                onChange={(e) => handleInputChange(e, 'bankDetails')}
                className="block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <input
                type="text"
                name="branch"
                placeholder="Branch"
                value={formData.bankDetails.branch}
                onChange={(e) => handleInputChange(e, 'bankDetails')}
                className="block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </section>

          <div className="text-center">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
            >
              Submit Purchase Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchaseOrderPage;