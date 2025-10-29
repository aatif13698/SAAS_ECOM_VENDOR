// import React, { useEffect, Fragment, useState } from 'react';
// import { BsPlus } from "react-icons/bs";
// import { Card } from "@mui/material";
// import useDarkmode from '@/hooks/useDarkMode';
// import { GoTrash, GoCheck } from "react-icons/go";
// import supplierService from '@/services/supplier/supplier.service';
// import { Dialog, Transition } from "@headlessui/react";
// import Icon from "@/components/ui/Icon";
// import Button from '../../components/ui/Button';
// import AddAddressModel from './AddAddressModel';
// import ProductListModel from './ProductListModel';

// const PurchaseOrderPage = ({ noFade, scrollContent }) => {
//   const [isDark] = useDarkmode();
//   const buyerState = "West Bengal"; // Assuming buyer's state; adjust as needed
//   const [addresses, setAddresses] = useState([]);
//   const [currentSupplierId, setCurrentSupplierId] = useState("")


//   const [formData, setFormData] = useState({
//     supplier: null,
//     shippingAddress: {
//       fullName: "",
//       phone: "",
//       alternamtivePhone: "",
//       country: "",
//       state: "",
//       city: "",
//       ZipCode: "",
//       address: "",
//       roadName: "",
//       nearbyLandmark: "",
//       houseNumber: "",
//       _id: ""
//     },
//     poNumber: '',
//     poDate: new Date().toISOString().split('T')[0],
//     items: [{ srNo: 1, itemName: '', mrp: 0, discount: 0, taxableAmount: 0, gstPercent: 0, cgstPercent: 0, sgstPercent: 0, igstPercent: 0, cgst: 0, sgst: 0, igst: 0, tax: 0, totalAmount: 0 }],
//     notes: '',
//     bankDetails: {
//       bankName: '',
//       accountNumber: '',
//       ifscCode: '',
//       branch: '',
//     },
//     isInterState: false,
//     roundOff: false,
//     paymentMethod: '',
//     paidAmount: 0,
//     balance: 0,
//   });
//   console.log("formData", formData);



//   const [suppliers, setSuppliers] = useState([]);
//   const [openModal, setOpenModal] = useState(false);
//   const [openModal2, setOpenModal2] = useState(false);
//   const [openModal3, setOpenModal3] = useState(false);
//   const [openModal4, setOpenModal4] = useState(false);
//   const [showNotesInput, setShowNotesInput] = useState(false);
//   const [showBankInput, setShowBankInput] = useState(false);



//   const handleInputChange = (e, section) => {
//     const { name, value } = e.target;
//     if (section) {
//       setFormData({
//         ...formData,
//         [section]: { ...formData[section], [name]: value },
//       });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const calculateTaxes = (item) => {
//     const rate = item.gstPercent;
//     if (formData.isInterState) {
//       item.igstPercent = rate;
//       item.cgstPercent = 0;
//       item.sgstPercent = 0;
//       item.igst = item.taxableAmount * rate / 100;
//       item.cgst = 0;
//       item.sgst = 0;
//     } else {
//       item.cgstPercent = rate / 2;
//       item.sgstPercent = rate / 2;
//       item.igstPercent = 0;
//       item.cgst = item.taxableAmount * (rate / 2) / 100;
//       item.sgst = item.cgst;
//       item.igst = 0;
//     }
//     item.tax = item.cgst + item.sgst + item.igst;
//     item.totalAmount = item.taxableAmount + item.tax;
//   };

//   const handleItemChange = (index, e) => {
//     const { name, value } = e.target;
//     const newItems = [...formData.items];
//     newItems[index] = { ...newItems[index], [name]: name === 'itemName' ? value : parseFloat(value) || 0 };

//     const item = newItems[index];
//     item.taxableAmount = item.mrp - item.discount;
//     calculateTaxes(item);

//     setFormData({ ...formData, items: newItems });
//   };

//   const addItem = () => {
//     const newSrNo = formData.items.length + 1;
//     setFormData({
//       ...formData,
//       items: [...formData.items, { srNo: newSrNo, itemName: '', mrp: 0, discount: 0, taxableAmount: 0, gstPercent: 0, cgstPercent: 0, sgstPercent: 0, igstPercent: 0, cgst: 0, sgst: 0, igst: 0, tax: 0, totalAmount: 0 }],
//     });
//   };

//   const removeItem = (index) => {
//     if (formData.items.length > 1) {
//       const newItems = formData.items.filter((_, i) => i !== index).map((item, i) => ({ ...item, srNo: i + 1 }));
//       setFormData({ ...formData, items: newItems });
//     }
//   };

//   const calculateTotals = () => {
//     const totalTaxable = formData.items.reduce((sum, item) => sum + item.taxableAmount, 0);
//     const totalTaxes = formData.items.reduce((sum, item) => sum + item.tax, 0);
//     const totalDiscount = formData.items.reduce((sum, item) => sum + item.discount, 0);
//     const totalCGST = formData.items.reduce((sum, item) => sum + item.cgst, 0);
//     const totalSGST = formData.items.reduce((sum, item) => sum + item.sgst, 0);
//     const totalIGST = formData.items.reduce((sum, item) => sum + item.igst, 0);
//     const grandTotal = totalTaxable + totalTaxes;
//     const roundOffAmount = formData.roundOff ? Math.round(grandTotal) - grandTotal : 0;
//     const finalTotal = grandTotal + roundOffAmount;
//     return { totalTaxable, totalTaxes, totalDiscount, totalCGST, totalSGST, totalIGST, grandTotal, roundOffAmount, finalTotal };
//   };

//   const totals = calculateTotals();

//   useEffect(() => {
//     setFormData(prev => ({ ...prev, balance: totals.finalTotal - prev.paidAmount }));
//   }, [totals.finalTotal, formData.paidAmount]);


//   useEffect(() => {
//     if (formData?.supplier) {
//       getShippingAddress(formData?.supplier?._id);
//       setCurrentSupplierId(formData?.supplier?._id)
//     }
//   }, [formData?.supplier]);

//   async function getShippingAddress(id, type) {
//     try {
//       const response = await supplierService.getSupplierAddress(id);
//       setAddresses(response?.data?.addresses?.reverse());
//       if (response?.data?.addresses?.length > 0) {
//         setFormData((prev) => {
//           return {
//             ...prev,
//             shippingAddress: response?.data?.addresses[0]
//           }
//         })
//       } else {
//         setFormData((prev) => {
//           return {
//             ...prev,
//             shippingAddress: null,
//           }
//         })

//       }
//       if (type == "new Address") {
//         setOpenModal2(true)
//       }
//     } catch (error) {
//       console.log("error while getttinf shipping address", error);
//     }
//   }

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!formData.supplier) {
//       alert('Please select a supplier before submitting.');
//       return;
//     }
//     console.log('Purchase Order Data:', formData);
//     // Submit to API here
//     alert('Purchase Order submitted successfully!');
//   };

//   const handleSelectSupplier = (supplier) => {
//     setFormData({
//       ...formData,
//       supplier,
//       isInterState: supplier.state !== buyerState,
//     });
//     setOpenModal(false);
//   };

//   const handleSelectShippingAddress = (address) => {
//     setFormData({
//       ...formData,
//       shippingAddress: address
//     });
//     setOpenModal2(false);
//   };


//   useEffect(() => {
//     const getParties = async () => {
//       try {
//         const response = await supplierService.getAllActive();
//         setSuppliers(response?.data || []);
//       } catch (error) {
//         console.error("Error fetching suppliers:", error);
//       }
//     };
//     getParties();
//   }, []);

//   const isBankFilled = Object.values(formData.bankDetails).some(value => value !== '');

//   return (
//     <div>
//       <Card>
//         <div className={`${isDark ? "bg-darkSecondary text-white" : ""} p-5`}>
//           <form onSubmit={handleSubmit}>
//             {/* Section 1: Supplier, PO Details, and Shipping Address */}
//             <section className="mb-8">
//               <h2 className="text-xl font-semibold mb-4 text-gray-700">Purchase Invoice</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {/* Card 1: Supplier */}
//                 <div className={`bg-white dark:bg-transparent ${formData.supplier ? "lg:col-span-1 md:col-span-1" : "lg:col-span-2 md:col-span-2 "}   rounded-lg border border-gray-200`}>
//                   <div className='bg-gray-100 dark:bg-transparent dark:border-b-[2px] dark:border-white lg:h-[20%] md:h-[30%] p-2 rounded-t-lg flex justify-between items-center'>
//                     <h3 className="text-lg font-medium text-gray-700">Bill From</h3>
//                     {formData.supplier && (
//                       <Button
//                         text=" Change Party"
//                         className=" text-lightModalHeaderColor dark:text-darkBtn  border py-1 border-lightModalHeaderColor dark:border-darkBtn hover:bg-lightModalHeaderColor/20"
//                         onClick={() => setOpenModal(true)}
//                       />
//                     )}
//                   </div>
//                   <div className='lg:h-[80%] md:h-[88%] p-4'>
//                     {formData.supplier ? (
//                       <div className="text-sm">
//                         <p><strong>Name:</strong> {formData.supplier.name}</p>
//                         <p><strong>Contact Person:</strong> {formData.supplier.contactPerson}</p>
//                         <p><strong>Email:</strong> {formData.supplier.emailContact}</p>
//                         <p><strong>Contact Number:</strong> {formData.supplier.contactNumber}</p>
//                         <p><strong>Address:</strong> {formData.supplier.address}, {formData.supplier.city}, {formData.supplier.state}, {formData.supplier.ZipCode}, {formData.supplier.country}</p>
//                         <p><strong>GST/VAT:</strong> {formData.supplier.GstVanNumber}</p>
//                       </div>
//                     ) : (
//                       <button
//                         type="button"
//                         onClick={() => setOpenModal(true)}
//                         className='flex items-center p-4 hover:bg-lightHoverBgBtn/20 hover:text-white border border-dashed border-lightHoverBgBtn dark:border-darkBtn rounded-md'
//                       >
//                         <BsPlus className='text-lightHoverBgBtn dark:text-darkBtn' />
//                         <span className='text-lightHoverBgBtn dark:text-darkBtn'>
//                           Add Party
//                         </span>
//                       </button>
//                     )}
//                   </div>
//                 </div>

//                 {/* card 2 */}
//                 {formData.supplier && (
//                   <div className="bg-white dark:bg-transparent lg:col-span-1 md:col-span-1  rounded-lg border border-gray-200">
//                     <div className='bg-gray-100 dark:bg-transparent dark:border-b-[2px] dark:border-white md:h-[20%] p-2 rounded-t-lg flex justify-between items-center'>
//                       <h3 className="text-lg font-medium text-gray-700">Ship From</h3>
//                       {addresses && addresses?.length > 0 ? (
//                         <Button
//                           text=" Change Shipping"
//                           className=" text-lightModalHeaderColor dark:text-darkBtn  border py-1 border-lightModalHeaderColor dark:border-darkBtn hover:bg-lightModalHeaderColor/20"
//                           onClick={() => setOpenModal2(true)}
//                         />
//                       ) : ""}
//                     </div>
//                     <div className='h-[80%] p-4'>
//                       {formData.shippingAddress ? (
//                         <div className="text-sm">
//                           <p><strong>Name:</strong> {formData?.shippingAddress?.fullName}</p>
//                           <p><strong>Contact Number:</strong> {formData.shippingAddress.phone}</p>
//                           <p><strong>Address:</strong> {formData.shippingAddress.address}, {formData.shippingAddress.city}, {formData.shippingAddress.state}, {formData.shippingAddress.ZipCode}, {formData.shippingAddress.country}</p>
//                           <p><strong>Landmark:</strong> {formData.shippingAddress.nearbyLandmark}</p>
//                         </div>
//                       ) : (
//                         <button
//                           type="button"
//                           onClick={() => setOpenModal3(true)}
//                           className='flex items-center p-4 hover:bg-lightHoverBgBtn/20 hover:text-white border border-dashed border-lightHoverBgBtn dark:border-darkBtn rounded-md'
//                         >
//                           <BsPlus className='text-lightHoverBgBtn dark:text-darkBtn' />
//                           <span className='text-lightHoverBgBtn dark:text-darkBtn'>
//                             Add Address
//                           </span>
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 )}


//                 {/* Card 3: PO Details */}
//                 <div className="bg-white dark:bg-transparent lg:col-span-1 md:col-span-2 rounded-lg border border-gray-200">
//                   <div className='bg-gray-100 dark:bg-transparent dark:border-b-[2px] dark:border-white md:h-[20%] h-[12%] p-2 rounded-t-lg'>
//                     <h3 className="text-lg font-medium mb-2 text-gray-700">Purchase Order Details</h3>
//                   </div>
//                   <div className="h-[80%] p-2 grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="text-sm">Purchase Inv No</label>
//                       <input
//                         type="text"
//                         name="poNumber"
//                         value={formData.poNumber}
//                         onChange={handleInputChange}
//                         className="form-control py-2"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label className="text-sm">Purchase Inv Date</label>
//                       <input
//                         type="date"
//                         name="poDate"
//                         value={formData.poDate}
//                         onChange={handleInputChange}
//                         className="form-control py-2"
//                         required
//                       />
//                     </div>

//                     <div className='col-span-1 md:col-span-2 border-dashed border-2 p-[3px]'>
//                       <div className='flex md:flex-row flex-col gap-2 justify-between'>
//                         <div className='w-full'>
//                           <label className="text-sm">Due Date</label>
//                           <input
//                             type="date"
//                             name="poDate"
//                             value={formData.poDate}
//                             onChange={handleInputChange}
//                             className="form-control w-full py-2"
//                             required
//                           />
//                         </div>

//                         <div className='w-full'>
//                           <label className="text-sm">Due Days</label>
//                           <input
//                             type="date"
//                             name="poDate"
//                             value={formData.poDate}
//                             onChange={handleInputChange}
//                             className="form-control w-full py-2"
//                             required
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </section>

//             {/* Section 2: Items Table */}
//             <section className="mb-8">
//               <h2 className="text-xl font-semibold mb-4 text-gray-700">Items</h2>
//               <div className="overflow-x-auto">
//                 <table className="min-w-full bg-white dark:bg-transparent border border-gray-300">
//                   <thead>
//                     <tr className="bg-gray-200 dark:bg-gray-800">
//                       <th className="py-2 px-4 border border-gray-300 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">SR. NO</th>
//                       <th className="py-2 px-4 border border-gray-300 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Item Name</th>
//                       <th className="py-2 px-4 border border-gray-300 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Qty</th>
//                       <th className="py-2 px-4 border border-gray-300 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">MRP</th>
//                       <th className="py-2 px-4 border border-gray-300 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Discount</th>
//                       <th className="py-2 px-4 border border-gray-300 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Taxable Amt</th>
//                       <th className="py-2 px-4 border border-gray-300 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">GST (%)</th>
//                       <th className="py-2 px-4 border border-gray-300 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Tax Amt</th>
//                       <th className="py-2 px-4 border border-gray-300 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Total Amt</th>
//                       <th className="py-2 px-4 border border-gray-300 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200">
//                     {formData.items.map((item, index) => (
//                       <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
//                         <td className="py-2 px-4 border border-gray-300 text-sm">{item.srNo}</td>
//                         <td className="py-2 px-4 border border-gray-300">
//                           <button
//                             type="button"
//                             onClick={() => setOpenModal4(true)}
//                             className='flex w-full items-center p-2 text-left hover:bg-lightHoverBgBtn/20 hover:text-white border border-dashed border-lightHoverBgBtn dark:border-darkBtn rounded-md text-sm'
//                           >
//                             <BsPlus className='text-lightHoverBgBtn dark:text-darkBtn' />
//                             <span className='ml-1 text-lightHoverBgBtn dark:text-darkBtn'>
//                               {item.itemName || 'Select Item'}
//                             </span>
//                           </button>
//                         </td>
//                         <td className="py-2 px-4 border border-gray-300">
//                           <input
//                             type="number"
//                             name="quantity"
//                             value={item.quantity}
//                             onChange={(e) => handleItemChange(index, e)}
//                             className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
//                             min="1"
//                             step="1"
//                             required
//                           />
//                         </td>
//                         <td className="py-2 px-4 border border-gray-300">
//                           <input
//                             type="number"
//                             name="mrp"
//                             value={item.mrp}
//                             onChange={(e) => handleItemChange(index, e)}
//                             className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
//                             min="0"
//                             step="0.01"
//                             required
//                           />
//                         </td>
//                         <td className="py-2 px-4 border border-gray-300">
//                           <input
//                             type="number"
//                             name="discount"
//                             value={item.discount}
//                             onChange={(e) => handleItemChange(index, e)}
//                             className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
//                             min="0"
//                             step="0.01"
//                           />
//                         </td>
//                         <td className="py-2 px-4 border border-gray-300 text-right text-sm font-medium">
//                           {item.taxableAmount.toFixed(2)}
//                         </td>
//                         <td className="py-2 px-4 border border-gray-300">
//                           <input
//                             type="number"
//                             name="gstPercent"
//                             value={item.gstPercent}
//                             onChange={(e) => handleItemChange(index, e)}
//                             className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
//                             min="0"
//                             step="0.01"
//                           />
//                         </td>
//                         <td className="py-2 px-4 border border-gray-300 text-right text-sm font-medium">
//                           {item.tax.toFixed(2)}
//                         </td>
//                         <td className="py-2 px-4 border border-gray-300 text-right text-sm font-medium">
//                           {item.totalAmount.toFixed(2)}
//                         </td>
//                         <td className="py-2 px-4 border border-gray-300 text-center">
//                           <button
//                             type="button"
//                             onClick={() => removeItem(index)}
//                             className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
//                             disabled={formData.items.length === 1}
//                           >
//                             <GoTrash className="w-5 h-5" />
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                   <tfoot>
//                     <tr className="bg-gray-100 dark:bg-gray-800 font-medium">
//                       <td colSpan={5} className="py-2 px-4 border border-gray-300 text-left text-sm">Total Discount: {totals.totalDiscount.toFixed(2)}</td>
//                       <td className="py-2 px-4 border border-gray-300 text-left text-sm">Total Taxable: {totals.totalTaxable.toFixed(2)}</td>
//                       <td colSpan={2} className="py-2 px-4 border border-gray-300 text-left text-sm">Total Taxes: {totals.totalTaxes.toFixed(2)}</td>
//                       <td className="py-2 px-4 border border-gray-300 text-left text-sm font-bold">Grand Total: {totals.grandTotal.toFixed(2)}</td>
//                       <td className="py-2 px-4 border border-gray-300"></td>
//                     </tr>
//                   </tfoot>
//                 </table>
//               </div>
//               <button
//                 type="button"
//                 onClick={addItem}
//                 className='mt-3 flex items-center px-3 py-2 text-sm hover:bg-lightHoverBgBtn/20 hover:text-white border border-dashed border-lightHoverBgBtn dark:border-darkBtn rounded-md'
//               >
//                 <BsPlus className='text-lightHoverBgBtn dark:text-darkBtn' />
//                 <span className='ml-1 text-lightHoverBgBtn dark:text-darkBtn'>Add Item</span>
//               </button>
//             </section>

//             <hr className="my-8 border-gray-300" />

//             {/* Two-column layout with vertical divider */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
//               {/* Vertical divider */}
//               <div className="hidden md:block absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-px bg-gray-300"></div>

//               {/* Left Side: Notes and Bank Details */}
//               <div className="flex flex-col gap-6 pr-4">
//                 {/* Notes Section */}
//                 <section>
//                   {showNotesInput ? (
//                     <div>
//                       <h2 className="text-xl font-semibold mb-4 text-gray-700">Notes</h2>
//                       <textarea
//                         name="notes"
//                         value={formData.notes}
//                         onChange={handleInputChange}
//                         className="form-control py-2 w-full"
//                         rows="4"
//                       />
//                       <Button
//                         text="Save"
//                         className=" mt-2 text-lightModalHeaderColor dark:text-darkBtn  border py-1 border-lightModalHeaderColor dark:border-darkBtn hover:bg-lightModalHeaderColor/20"
//                         onClick={() => setShowNotesInput(false)}
//                       />
//                     </div>
//                   ) : formData.notes ? (
//                     <div>
//                       <h2 className="text-xl font-semibold mb-4 text-gray-700">Notes</h2>
//                       <p className="text-gray-700">{formData.notes}</p>
//                       <Button
//                         text="Edit Notes"
//                         className=" text-lightModalHeaderColor dark:text-darkBtn  border py-1 border-lightModalHeaderColor dark:border-darkBtn hover:bg-lightModalHeaderColor/20"
//                         onClick={() => setShowNotesInput(true)}
//                       />
//                     </div>
//                   ) : (
//                     <Button
//                       text="Add Notes"
//                       className=" text-lightModalHeaderColor dark:text-darkBtn  border py-1 border-lightModalHeaderColor dark:border-darkBtn hover:bg-lightModalHeaderColor/20"
//                       onClick={() => setShowNotesInput(true)}
//                     />
//                   )}
//                 </section>

//                 {/* Bank Details Section */}
//                 <section>
//                   {showBankInput ? (
//                     <div className="bg-white dark:bg-transparent rounded-lg border border-gray-200 p-4">
//                       <h2 className="text-xl font-semibold mb-4 text-gray-700">Bank Details for Payments</h2>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <input
//                           type="text"
//                           name="bankName"
//                           placeholder="Bank Name"
//                           value={formData.bankDetails.bankName}
//                           onChange={(e) => handleInputChange(e, 'bankDetails')}
//                           className="form-control py-2"
//                         />
//                         <input
//                           type="text"
//                           name="accountNumber"
//                           placeholder="Account Number"
//                           value={formData.bankDetails.accountNumber}
//                           onChange={(e) => handleInputChange(e, 'bankDetails')}
//                           className="form-control py-2"
//                         />
//                         <input
//                           type="text"
//                           name="ifscCode"
//                           placeholder="IFSC Code"
//                           value={formData.bankDetails.ifscCode}
//                           onChange={(e) => handleInputChange(e, 'bankDetails')}
//                           className="form-control py-2"
//                         />
//                         <input
//                           type="text"
//                           name="branch"
//                           placeholder="Branch"
//                           value={formData.bankDetails.branch}
//                           onChange={(e) => handleInputChange(e, 'bankDetails')}
//                           className="form-control py-2"
//                         />
//                       </div>
//                       <Button
//                         text="Save"
//                         className=" mt-2 text-lightModalHeaderColor dark:text-darkBtn  border py-1 border-lightModalHeaderColor dark:border-darkBtn hover:bg-lightModalHeaderColor/20"
//                         onClick={() => setShowBankInput(false)}
//                       />
//                     </div>
//                   ) : isBankFilled ? (
//                     <div className="bg-white dark:bg-transparent rounded-lg border border-gray-200 p-4">
//                       <h2 className="text-xl font-semibold mb-4 text-gray-700">Bank Details for Payments</h2>
//                       <div className="text-sm">
//                         <p><strong>Bank Name:</strong> {formData.bankDetails.bankName}</p>
//                         <p><strong>Account Number:</strong> {formData.bankDetails.accountNumber}</p>
//                         <p><strong>IFSC Code:</strong> {formData.bankDetails.ifscCode}</p>
//                         <p><strong>Branch:</strong> {formData.bankDetails.branch}</p>
//                       </div>
//                       <Button
//                         text="Edit Bank Details"
//                         className=" text-lightModalHeaderColor dark:text-darkBtn  border py-1 border-lightModalHeaderColor dark:border-darkBtn hover:bg-lightModalHeaderColor/20"
//                         onClick={() => setShowBankInput(true)}
//                       />
//                     </div>
//                   ) : (
//                     <Button
//                       text="Add Bank Detail"
//                       className=" text-lightModalHeaderColor dark:text-darkBtn  border py-1 border-lightModalHeaderColor dark:border-darkBtn hover:bg-lightModalHeaderColor/20"
//                       onClick={() => setShowBankInput(true)}
//                     />
//                   )}
//                 </section>
//               </div>

//               {/* Right Side: Payment Description */}
//               <div className="flex flex-col gap-6 pl-4">
//                 {/* Detailed Payment Summary */}
//                 <section>
//                   <h2 className="text-xl font-semibold mb-4 text-gray-700">Payment Summary</h2>
//                   <div className="bg-white dark:bg-transparent rounded-lg border border-gray-200 p-4">
//                     <div className="flex justify-between mb-2 text-sm">
//                       <span>Total Taxable Amount:</span>
//                       <span>{totals.totalTaxable.toFixed(2)}</span>
//                     </div>
//                     <div className="flex justify-between mb-2 text-sm">
//                       <span>Total CGST:</span>
//                       <span>{totals.totalCGST.toFixed(2)}</span>
//                     </div>
//                     <div className="flex justify-between mb-2 text-sm">
//                       <span>Total SGST:</span>
//                       <span>{totals.totalSGST.toFixed(2)}</span>
//                     </div>
//                     <div className="flex justify-between mb-2 text-sm">
//                       <span>Total IGST:</span>
//                       <span>{totals.totalIGST.toFixed(2)}</span>
//                     </div>
//                     <div className="flex justify-between mb-2 text-sm">
//                       <span>Total Tax Amount:</span>
//                       <span>{totals.totalTaxes.toFixed(2)}</span>
//                     </div>
//                     <div className='h-[1px] bg-gray-300 my-2'></div>
//                     <div className="flex justify-between font-bold text-sm">
//                       <span>Grand Total:</span>
//                       <span>{totals.grandTotal.toFixed(2)}</span>
//                     </div>
//                   </div>
//                 </section>

//                 {/* Round Off Option */}
//                 <div className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     name="roundOff"
//                     checked={formData.roundOff}
//                     onChange={(e) => setFormData({ ...formData, roundOff: e.target.checked })}
//                   />
//                   <label className="text-sm text-gray-700 dark:text-gray-50">Round Off</label>
//                   {formData.roundOff && (
//                     <span className="text-sm text-gray-700 dark:text-gray-200">Round Off Amount: {totals.roundOffAmount.toFixed(2)}</span>
//                   )}
//                 </div>

//                 {/* Payment Options */}
//                 <section>
//                   <h2 className="text-xl font-semibold mb-4 text-gray-700">Payment Options</h2>
//                   <div className="grid grid-cols-1 gap-4">
//                     <div>
//                       <label className="text-sm">Payment Method</label>
//                       <select
//                         name="paymentMethod"
//                         value={formData.paymentMethod}
//                         onChange={handleInputChange}
//                         className="form-control py-2 w-full"
//                       >
//                         <option value="">Select Method</option>
//                         <option value="Cash">Cash</option>
//                         <option value="Bank Transfer">Bank Transfer</option>
//                         <option value="Other">Other</option>
//                       </select>
//                     </div>
//                     <div>
//                       <label className="text-sm">Paid Amount</label>
//                       <input
//                         type="number"
//                         name="paidAmount"
//                         value={formData.paidAmount}
//                         onChange={handleInputChange}
//                         className="form-control py-2 w-full"
//                         min="0"
//                         step="0.01"
//                       />
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span>Balance:</span>
//                       <span>{formData.balance.toFixed(2)}</span>
//                     </div>
//                     <div className='flex justify-end'>
//                       <Button
//                         text="Full Payment"
//                         className=" text-lightModalHeaderColor dark:text-darkBtn  border py-1 border-lightModalHeaderColor dark:border-darkBtn hover:bg-lightModalHeaderColor/20"
//                         onClick={() => setFormData({ ...formData, paidAmount: totals.finalTotal, balance: 0 })}
//                       />
//                     </div>

//                   </div>
//                 </section>
//               </div>
//             </div>

//             <div className="text-right mt-8">
//               <button
//                 type="submit"
//                 className="rounded-md px-2 text-lightModalHeaderColor dark:text-darkBtn  border py-1 border-lightModalHeaderColor dark:border-darkBtn hover:bg-lightModalHeaderColor/20"
//               >
//                 Submit Purchase Order
//               </button>
//             </div>
//           </form>
//         </div>
//       </Card>

//       {/* Supplier Selection Modal */}
// <Transition appear show={openModal} as={Fragment}>
//   <Dialog
//     as="div"
//     className="relative z-[999]"
//     onClose={() => { }}
//   >
//     {(
//       <Transition.Child
//         as={Fragment}
//         enter={noFade ? "" : "duration-300 ease-out"}
//         enterFrom={noFade ? "" : "opacity-0"}
//         enterTo={noFade ? "" : "opacity-100"}
//         leave={noFade ? "" : "duration-200 ease-in"}
//         leaveFrom={noFade ? "" : "opacity-100"}
//         leaveTo={noFade ? "" : "opacity-0"}
//       >
//         <div className="fixed inset-0 bg-slate-900/50 backdrop-filter backdrop-blur-sm" />
//       </Transition.Child>
//     )}
//     <div
//       className="fixed inset-0 "
//     >
//       <div
//         className={`flex min-h-full justify-center text-center p-6 items-center `}
//       >
//         <Transition.Child
//           as={Fragment}
//           enter={noFade ? "" : "duration-300  ease-out"}
//           enterFrom={noFade ? "" : "opacity-0 scale-95"}
//           enterTo={noFade ? "" : "opacity-100 scale-100"}
//           leave={noFade ? "" : "duration-200 ease-in"}
//           leaveFrom={noFade ? "" : "opacity-100 scale-100"}
//           leaveTo={noFade ? "" : "opacity-0 scale-95"}
//         >
//           <Dialog.Panel
//             className={`w-full transform rounded-md text-left align-middle shadow-xl transition-all max-w-3xl ${isDark ? "bg-darkSecondary text-white" : "bg-light"}`}
//           >
//             <div
//               className={`relative overflow-hidden py-4 px-5 text-lightModalHeaderColor flex justify-between bg-white border-b border-lightBorderColor dark:bg-darkInput dark:border-b dark:border-darkSecondary `}
//             >
//               <h2 className="capitalize leading-6 tracking-wider text-xl font-semibold text-lightModalHeaderColor dark:text-darkTitleColor">
//                 Select Party
//               </h2>
//               <button onClick={() => setOpenModal(false)} className="text-lightmodalCrosscolor hover:text-lightmodalbtnText text-[22px]">
//                 <Icon icon="heroicons-outline:x" />
//               </button>
//             </div>

//             <div className="p-4 overflow-y-auto max-h-[50vh]">
//               {suppliers.length > 0 ? (
//                 suppliers.map((supplier) => (
//                   <div
//                     key={supplier._id}
//                     className={`p-2 my-2 rounded cursor-pointer hover:bg-indigo-100 hover:text-black-500 flex justify-between items-center dark:hover:bg-gray-700 ${formData.supplier?._id === supplier._id ? 'bg-indigo-50 text-gray-500' : ''
//                       }`}
//                     onClick={() => handleSelectSupplier(supplier)}
//                   >
//                     <div>
//                       <p className="font-medium">{supplier.name}</p>
//                       <p className="text-sm">{supplier.contactPerson} - {supplier.emailContact}</p>
//                     </div>
//                     {formData.supplier?._id === supplier._id && (
//                       <GoCheck className="text-green-500" />
//                     )}
//                   </div>
//                 ))
//               ) : (
//                 <p className={isDark ? 'text-gray-300' : 'text-gray-500'}>
//                   No suppliers available
//                 </p>
//               )}
//             </div>

//             <div className="px-4 py-3 flex justify-end space-x-3 border-t border-slate-100 dark:border-darkSecondary bg-white dark:bg-darkInput">
//               <Button
//                 text="Cancel"
//                 className="bg-lightmodalBgBtnHover lightmodalBgBtn text-white hover:bg-lightmodalBgBtn hover:text-lightmodalbtnText px-4 py-2 rounded"
//                 onClick={() => setOpenModal(false)}
//               />
//             </div>
//           </Dialog.Panel>
//         </Transition.Child>
//       </div>
//     </div>
//   </Dialog>
// </Transition>

//       {/* List address */}
// <Transition appear show={openModal2} as={Fragment}>
//   <Dialog
//     as="div"
//     className="relative z-[999]"
//     onClose={() => { }}
//   >
//     {(
//       <Transition.Child
//         as={Fragment}
//         enter={noFade ? "" : "duration-300 ease-out"}
//         enterFrom={noFade ? "" : "opacity-0"}
//         enterTo={noFade ? "" : "opacity-100"}
//         leave={noFade ? "" : "duration-200 ease-in"}
//         leaveFrom={noFade ? "" : "opacity-100"}
//         leaveTo={noFade ? "" : "opacity-0"}
//       >
//         <div className="fixed inset-0 bg-slate-900/50 backdrop-filter backdrop-blur-sm" />
//       </Transition.Child>
//     )}
//     <div
//       className="fixed inset-0 "
//     >
//       <div
//         className={`flex min-h-full justify-center text-center p-6 items-center `}
//       >
//         <Transition.Child
//           as={Fragment}
//           enter={noFade ? "" : "duration-300  ease-out"}
//           enterFrom={noFade ? "" : "opacity-0 scale-95"}
//           enterTo={noFade ? "" : "opacity-100 scale-100"}
//           leave={noFade ? "" : "duration-200 ease-in"}
//           leaveFrom={noFade ? "" : "opacity-100 scale-100"}
//           leaveTo={noFade ? "" : "opacity-0 scale-95"}
//         >
//           <Dialog.Panel
//             className={`w-full transform rounded-md text-left align-middle shadow-xl transition-all max-w-3xl ${isDark ? "bg-darkSecondary text-white" : "bg-light"}`}
//           >
//             <div
//               className={`relative overflow-hidden py-4 px-5 text-lightModalHeaderColor flex justify-between bg-white border-b border-lightBorderColor dark:bg-darkInput dark:border-b dark:border-darkSecondary `}
//             >
//               <h2 className="capitalize leading-6 tracking-wider text-xl font-semibold text-lightModalHeaderColor dark:text-darkTitleColor">
//                 Select Address
//               </h2>
//               <button onClick={() => setOpenModal2(false)} className="text-lightmodalCrosscolor hover:text-lightmodalbtnText text-[22px]">
//                 <Icon icon="heroicons-outline:x" />
//               </button>
//             </div>

//             <div className="p-4 overflow-y-auto max-h-[50vh]">
//               {addresses?.length > 0 ? (
//                 addresses.map((address) => (
//                   <div
//                     key={address._id}
//                     className={`p-2 my-2 rounded cursor-pointer hover:bg-indigo-100 hover:text-black-500 flex justify-between items-center dark:hover:bg-gray-700 ${formData.shippingAddress?._id === address._id ? 'bg-indigo-50 text-gray-500' : ''
//                       }`}
//                     onClick={() => handleSelectShippingAddress(address)}
//                   >
//                     <div>
//                       <p className="font-medium">{address.fullName}</p>
//                       <p className="text-sm">{address.phone}</p>
//                       <p className="text-sm">{address.address},{address?.city}, {address?.state}</p>
//                     </div>
//                     {formData.shippingAddress?._id === address._id && (
//                       <GoCheck className="text-green-500" />
//                     )}
//                   </div>
//                 ))
//               ) : (
//                 <p className={isDark ? 'text-gray-300' : 'text-gray-500'}>
//                   No address available
//                 </p>
//               )}
//             </div>

//             <div className="px-4 py-3 flex justify-end space-x-3 border-t border-slate-100 dark:border-darkSecondary bg-white dark:bg-darkInput">
//               <button
//                 type="button"
//                 onClick={() => {
//                   setOpenModal2(false)
//                   setTimeout(() => {
//                     setOpenModal3(true);
//                   }, 300);
//                 }}
//                 className='flex items-center px-2 hover:bg-lightHoverBgBtn/20 hover:text-white border border-dashed border-lightHoverBgBtn dark:border-darkBtn rounded-md'
//               >
//                 <BsPlus className='text-lightHoverBgBtn dark:text-darkBtn' />
//                 <span className='text-lightHoverBgBtn dark:text-darkBtn'>
//                   Add Address
//                 </span>
//               </button>
//               <Button
//                 text="Cancel"
//                 className="bg-lightmodalBgBtnHover lightmodalBgBtn text-white hover:bg-lightmodalBgBtn hover:text-lightmodalbtnText px-4 py-2 rounded"
//                 onClick={() => setOpenModal2(false)}
//               />
//             </div>
//           </Dialog.Panel>
//         </Transition.Child>
//       </div>
//     </div>
//   </Dialog>
// </Transition>

//       {/* add address  */}
//       <AddAddressModel openModal3={openModal3} setOpenModal3={setOpenModal3} getShippingAddress={getShippingAddress} currentSupplierId={currentSupplierId} />

//       {/* product list */}
//       <ProductListModel openModal3={openModal4} setOpenModal3={setOpenModal4} getShippingAddress={getShippingAddress} currentSupplierId={currentSupplierId} />

//     </div>
//   );
// };

// export default PurchaseOrderPage;


// new

import React, { useEffect, Fragment, useState } from 'react';
import { BsPlus } from "react-icons/bs";
import { Card } from "@mui/material";
import useDarkmode from '@/hooks/useDarkMode';
import { GoTrash, GoCheck } from "react-icons/go";
import supplierService from '@/services/supplier/supplier.service';
import { Dialog, Transition } from "@headlessui/react";
import Icon from "@/components/ui/Icon";
import Button from '../../components/ui/Button';
import AddAddressModel from './AddAddressModel';
import ProductListModel from './ProductListModel';
import AddTransportModel from './AddTransportModel';

const PurchaseOrderPage = ({ noFade, scrollContent }) => {
  const [isDark] = useDarkmode();
  const buyerState = "West Bengal"; // Assuming buyer's state; adjust as needed
  const [addresses, setAddresses] = useState([]);
  const [currentSupplierId, setCurrentSupplierId] = useState("");

  const [formData, setFormData] = useState({
    supplier: null,
    shippingAddress: {
      fullName: "",
      phone: "",
      alternamtivePhone: "",
      country: "",
      state: "",
      city: "",
      ZipCode: "",
      address: "",
      roadName: "",
      nearbyLandmark: "",
      houseNumber: "",
      _id: ""
    },
    poNumber: '',
    poDate: new Date().toISOString().split('T')[0],
    items: [
      {
        srNo: 1,
        itemName: {
          name: "",
          productStock: "",
          productMainStock: "",
          purchasePrice: ""
        },
        quantity: 1,
        mrp: 0,
        discount: 0,
        taxableAmount: 0,
        gstPercent: 0,
        cgstPercent: 0,
        sgstPercent: 0,
        igstPercent: 0,
        cgst: 0,
        sgst: 0,
        igst: 0,
        tax: 0,
        totalAmount: 0
      }
    ],
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

  console.log("formData", formData);


  const [suppliers, setSuppliers] = useState([]);
  const [openModal, setOpenModal] = useState(false);     // Supplier modal
  const [openModal2, setOpenModal2] = useState(false);   // Shipping Address list modal
  const [openModal3, setOpenModal3] = useState(false);   // Add Address modal
  const [openModal4, setOpenModal4] = useState(false);   // Product List modal
  const [openModal5, setOpenModal5] = useState(false);   // Add Transport modal
  const [showNotesInput, setShowNotesInput] = useState(false);
  const [showBankInput, setShowBankInput] = useState(false);

  // === Generic input handler ===
  const handleInputChange = (e, section) => {
    const { name, value } = e.target;
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: { ...prev[section], [name]: value },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // === Tax calculation logic ===
  const calculateTaxes = (item) => {
    const rate = item.gstPercent;
    const taxable = item.mrp * item.quantity - item.discount;

    if (formData.isInterState) {
      item.igstPercent = rate;
      item.cgstPercent = 0;
      item.sgstPercent = 0;
      item.igst = taxable * rate / 100;
      item.cgst = 0;
      item.sgst = 0;
    } else {
      item.cgstPercent = rate / 2;
      item.sgstPercent = rate / 2;
      item.igstPercent = 0;
      item.cgst = taxable * (rate / 2) / 100;
      item.sgst = item.cgst;
      item.igst = 0;
    }

    item.taxableAmount = taxable;
    item.tax = item.cgst + item.sgst + item.igst;
    item.totalAmount = taxable + item.tax;
  };

  // === Item change handler (quantity, mrp, discount, gst) ===
  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...formData.items];
    const parsedValue = name === 'itemName' ? value : (parseFloat(value) || 0);

    newItems[index] = { ...newItems[index], [name]: parsedValue };

    // Recalculate taxable amount and taxes
    const item = newItems[index];
    calculateTaxes(item);

    setFormData(prev => ({ ...prev, items: newItems }));
  };

  // === Add new item row ===
  const addItem = () => {
    const newSrNo = formData.items.length + 1;
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          srNo: newSrNo,
          itemName: {
            name: "",
            productStock: "",
            productMainStock: "",
            purchasePrice: ""
          },
          quantity: 1,
          mrp: 0,
          discount: 0,
          taxableAmount: 0,
          gstPercent: 0,
          cgstPercent: 0,
          sgstPercent: 0,
          igstPercent: 0,
          cgst: 0,
          sgst: 0,
          igst: 0,
          tax: 0,
          totalAmount: 0
        }
      ],
    }));
  };

  // === Remove item row ===
  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items
        .filter((_, i) => i !== index)
        .map((item, i) => ({ ...item, srNo: i + 1 }));
      setFormData(prev => ({ ...prev, items: newItems }));
    }
  };

  // === Totals calculation ===
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

    return {
      totalTaxable,
      totalTaxes,
      totalDiscount,
      totalCGST,
      totalSGST,
      totalIGST,
      grandTotal,
      roundOffAmount,
      finalTotal
    };
  };

  const totals = calculateTotals();

  // === Update balance when totals or paid amount change ===
  useEffect(() => {
    setFormData(prev => ({ ...prev, balance: totals.finalTotal - prev.paidAmount }));
  }, [totals.finalTotal, formData.paidAmount]);

  // === Fetch shipping addresses when supplier changes ===
  useEffect(() => {
    if (formData?.supplier) {
      getShippingAddress(formData?.supplier?._id);
      setCurrentSupplierId(formData?.supplier?._id);
    }
  }, [formData?.supplier]);

  // === Fetch supplier addresses ===
  const getShippingAddress = async (id, type) => {
    try {
      const response = await supplierService.getSupplierAddress(id);
      const addresses = response?.data?.addresses?.reverse() || [];
      setAddresses(addresses);

      if (addresses.length > 0) {
        setFormData(prev => ({
          ...prev,
          shippingAddress: addresses[0]
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          shippingAddress: null,
        }));
      }

      if (type === "new Address") {
        setOpenModal2(true);
      }
    } catch (error) {
      console.error("Error fetching shipping address:", error);
    }
  };

  // === Form submission ===
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.supplier) {
      alert('Please select a supplier before submitting.');
      return;
    }
    console.log('Purchase Order Data:', formData);
    alert('Purchase Order submitted successfully!');
  };

  // === Select supplier ===
  const handleSelectSupplier = (supplier) => {
    setFormData(prev => ({
      ...prev,
      supplier,
      isInterState: supplier.state !== buyerState,
    }));
    setOpenModal(false);
  };

  // === Select shipping address ===
  const handleSelectShippingAddress = (address) => {
    setFormData(prev => ({
      ...prev,
      shippingAddress: address
    }));
    setOpenModal2(false);
  };

  // === Fetch all suppliers on mount ===
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
            {/* Section 1: Supplier, Ship From, PO Details */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Purchase Invoice</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Card 1: Supplier */}
                <div className={`bg-white dark:bg-transparent rounded-lg border border-gray-200 ${formData.supplier ? "lg:col-span-1 md:col-span-1" : "lg:col-span-2 md:col-span-2"}`}>
                  <div className='bg-gray-100 dark:bg-transparent dark:border-b-[2px] dark:border-white lg:h-[20%] md:h-[30%] p-2 rounded-t-lg flex justify-between items-center'>
                    <h3 className="text-lg font-medium text-gray-700">Bill From</h3>
                    {formData.supplier && (
                      <Button
                        text="Change Party"
                        className="text-lightModalHeaderColor dark:text-darkBtn border py-1 border-lightModalHeaderColor dark:border-darkBtn hover:bg-lightModalHeaderColor/20"
                        onClick={() => setOpenModal(true)}
                      />
                    )}
                  </div>
                  <div className='lg:h-[80%] md:h-[70%] p-4'>
                    {formData.supplier ? (
                      <div className="text-sm space-y-1">
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
                        className='flex items-center p-4 w-full justify-center hover:bg-lightHoverBgBtn/20 hover:text-white border border-dashed border-lightHoverBgBtn dark:border-darkBtn rounded-md'
                      >
                        <BsPlus className='text-lightHoverBgBtn dark:text-darkBtn' />
                        <span className='text-lightHoverBgBtn dark:text-darkBtn ml-1'>Add Party</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Card 2: Ship From */}
                {formData.supplier && (
                  <div className="bg-white dark:bg-transparent lg:col-span-1 md:col-span-1 rounded-lg border border-gray-200">
                    <div className='bg-gray-100 dark:bg-transparent dark:border-b-[2px] dark:border-white md:h-[20%] p-2 rounded-t-lg flex justify-between items-center'>
                      <h3 className="text-lg font-medium text-gray-700">Ship From</h3>
                      {addresses.length > 0 && (
                        <Button
                          text="Change Shipping"
                          className="text-lightModalHeaderColor dark:text-darkBtn border py-1 border-lightModalHeaderColor dark:border-darkBtn hover:bg-lightModalHeaderColor/20"
                          onClick={() => setOpenModal2(true)}
                        />
                      )}
                    </div>
                    <div className='h-[80%] p-4'>
                      {formData.shippingAddress ? (
                        <div className="text-sm space-y-1">
                          <p><strong>Name:</strong> {formData.shippingAddress.fullName}</p>
                          <p><strong>Contact Number:</strong> {formData.shippingAddress.phone}</p>
                          <p><strong>Address:</strong> {formData.shippingAddress.address}, {formData.shippingAddress.city}, {formData.shippingAddress.state}, {formData.shippingAddress.ZipCode}</p>
                          <p><strong>Landmark:</strong> {formData.shippingAddress.nearbyLandmark || '—'}</p>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setOpenModal3(true)}
                          className='flex items-center p-4 w-full justify-center hover:bg-lightHoverBgBtn/20 hover:text-white border border-dashed border-lightHoverBgBtn dark:border-darkBtn rounded-md'
                        >
                          <BsPlus className='text-lightHoverBgBtn dark:text-darkBtn' />
                          <span className='text-lightHoverBgBtn dark:text-darkBtn ml-1'>Add Address</span>
                        </button>
                      )}
                      <div className='mt-2 flex justify-end'>
                        <Button
                          text="Add Trasnport"
                          className="text-lightModalHeaderColor  dark:text-darkBtn border py-1 border-lightModalHeaderColor dark:border-darkBtn hover:bg-lightModalHeaderColor/20"
                          onClick={() => setOpenModal5(true)}
                        />
                      </div>
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Inv No</label>
                      <input
                        type="text"
                        name="poNumber"
                        value={formData.poNumber}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Inv Date</label>
                      <input
                        type="date"
                        name="poDate"
                        value={formData.poDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div className='col-span-1 md:col-span-2 border-dashed border-2 p-3 rounded-md'>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                          <input
                            type="date"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Due Days</label>
                          <input
                            type="number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g. 30"
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
                    <tr className="bg-gray-200 dark:bg-gray-800">
                      <th className="py-2 px-4 border border-gray-300 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">SR. NO</th>
                      <th className="py-2 px-4 border border-gray-300 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Item Name</th>
                      <th className="py-2 px-4 border border-gray-300 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Qty</th>
                      <th className="py-2 px-4 border border-gray-300 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">MRP</th>
                      <th className="py-2 px-4 border border-gray-300 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Discount</th>
                      <th className="py-2 px-4 border border-gray-300 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Taxable Amt</th>
                      <th className="py-2 px-4 border border-gray-300 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">GST (%)</th>
                      <th className="py-2 px-4 border border-gray-300 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Tax Amt</th>
                      <th className="py-2 px-4 border border-gray-300 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Total Amt</th>
                      <th className="py-2 px-4 border border-gray-300 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200">
                    {formData.items.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="py-2 px-4 border border-gray-300 text-sm">{item.srNo}</td>
                        <td className="py-2 px-4 border border-gray-300">
                          <button
                            type="button"
                            onClick={() => setOpenModal4(true)}
                            className='flex w-full items-center p-2 text-left hover:bg-lightHoverBgBtn/20 hover:text-white border border-dashed border-lightHoverBgBtn dark:border-darkBtn rounded-md text-sm'
                          >
                            {/* <BsPlus className='text-lightHoverBgBtn dark:text-darkBtn' /> */}
                            <span className='ml-1 text-lightHoverBgBtn dark:text-darkBtn'>
                              {/* {item.itemName || 'Select Item'} */} {item?.itemName?.name}
                            </span>
                          </button>
                        </td>
                        <td className="py-2 px-4 border border-gray-300">
                          <input
                            type="number"
                            name="quantity"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, e)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            min="1"
                            step="1"
                            required
                          />
                        </td>
                        <td className="py-2 px-4 border border-gray-300">
                          <input
                            type="number"
                            name="mrp"
                            value={item.mrp}
                            onChange={(e) => handleItemChange(index, e)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            min="0"
                            step="0.01"
                          />
                        </td>
                        <td className="py-2 px-4 border border-gray-300 text-right text-sm font-medium">
                          {item.taxableAmount.toFixed(2)}
                        </td>
                        <td className="py-2 px-4 border border-gray-300">
                          <input
                            type="number"
                            name="gstPercent"
                            value={item.gstPercent}
                            onChange={(e) => handleItemChange(index, e)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            min="0"
                            step="0.01"
                          />
                        </td>
                        <td className="py-2 px-4 border border-gray-300 text-right text-sm font-medium">
                          {item.tax.toFixed(2)}
                        </td>
                        <td className="py-2 px-4 border border-gray-300 text-right text-sm font-medium">
                          {item.totalAmount.toFixed(2)}
                        </td>
                        <td className="py-2 px-4 border border-gray-300 text-center">
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={formData.items.length === 1}
                          >
                            <GoTrash className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-100 dark:bg-gray-800 font-medium">
                      <td colSpan={5} className="py-2 px-4 border border-gray-300 text-left text-sm">Total Discount: {totals.totalDiscount.toFixed(2)}</td>
                      <td className="py-2 px-4 border border-gray-300 text-left text-sm">Total Taxable: {totals.totalTaxable.toFixed(2)}</td>
                      <td colSpan={2} className="py-2 px-4 border border-gray-300 text-left text-sm">Total Taxes: {totals.totalTaxes.toFixed(2)}</td>
                      <td className="py-2 px-4 border border-gray-300 text-left text-sm font-bold">Grand Total: {totals.grandTotal.toFixed(2)}</td>
                      <td className="py-2 px-4 border border-gray-300"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <button
                type="button"
                // onClick={addItem}
                onClick={() => setOpenModal4(true)}
                className='mt-3 flex items-center px-3 py-2 text-sm hover:bg-lightHoverBgBtn/20 hover:text-white border border-dashed border-lightHoverBgBtn dark:border-darkBtn rounded-md'
              >
                <BsPlus className='text-lightHoverBgBtn dark:text-darkBtn' />
                <span className='ml-1 text-lightHoverBgBtn dark:text-darkBtn'>Add Item</span>
              </button>
            </section>

            <hr className="my-8 border-gray-300" />

            {/* Two-column layout: Notes/Bank | Payment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
              <div className="hidden md:block absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-px bg-gray-300"></div>

              {/* Left: Notes & Bank Details */}
              <div className="flex flex-col gap-6 pr-4">
                {/* Notes */}
                <section>
                  {showNotesInput ? (
                    <div>
                      <h2 className="text-xl font-semibold mb-3 text-gray-700">Notes</h2>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        rows="4"
                        placeholder="Enter any additional notes..."
                      />
                      <Button
                        text="Save"
                        className="mt-2 text-lightModalHeaderColor dark:text-darkBtn border py-1.5 px-3 border-lightModalHeaderColor dark:border-darkBtn hover:bg-lightModalHeaderColor/20 text-sm"
                        onClick={() => setShowNotesInput(false)}
                      />
                    </div>
                  ) : formData.notes ? (
                    <div>
                      <h2 className="text-xl font-semibold mb-3 text-gray-700">Notes</h2>
                      <p className="text-gray-700 text-sm">{formData.notes}</p>
                      <Button
                        text="Edit Notes"
                        className="mt-2 text-lightModalHeaderColor dark:text-darkBtn border py-1.5 px-3 border-lightModalHeaderColor dark:border-darkBtn hover:bg-lightModalHeaderColor/20 text-sm"
                        onClick={() => setShowNotesInput(true)}
                      />
                    </div>
                  ) : (
                    <Button
                      text="Add Notes"
                      className="text-lightModalHeaderColor dark:text-darkBtn border py-1.5 px-3 border-lightModalHeaderColor dark:border-darkBtn hover:bg-lightModalHeaderColor/20 text-sm"
                      onClick={() => setShowNotesInput(true)}
                    />
                  )}
                </section>

                {/* Bank Details */}
                <section>
                  {showBankInput ? (
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 p-4">
                      <h2 className="text-xl font-semibold mb-4 text-gray-700">Bank Details for Payments</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {['bankName', 'accountNumber', 'ifscCode', 'branch'].map(field => (
                          <input
                            key={field}
                            type="text"
                            name={field}
                            placeholder={field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            value={formData.bankDetails[field]}
                            onChange={(e) => handleInputChange(e, 'bankDetails')}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                          />
                        ))}
                      </div>
                      <Button
                        text="Save"
                        className="mt-3 text-lightModalHeaderColor dark:text-darkBtn border py-1.5 px-3 border-lightModalHeaderColor dark:border-darkBtn hover:bg-lightModalHeaderColor/20 text-sm"
                        onClick={() => setShowBankInput(false)}
                      />
                    </div>
                  ) : isBankFilled ? (
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 p-4">
                      <h2 className="text-xl font-semibold mb-4 text-gray-700">Bank Details for Payments</h2>
                      <div className="text-sm space-y-1">
                        <p><strong>Bank Name:</strong> {formData.bankDetails.bankName}</p>
                        <p><strong>Account Number:</strong> {formData.bankDetails.accountNumber}</p>
                        <p><strong>IFSC Code:</strong> {formData.bankDetails.ifscCode}</p>
                        <p><strong>Branch:</strong> {formData.bankDetails.branch}</p>
                      </div>
                      <Button
                        text="Edit Bank Details"
                        className="mt-3 text-lightModalHeaderColor dark:text-darkBtn border py-1.5 px-3 border-lightModalHeaderColor dark:border-darkBtn hover:bg-lightModalHeaderColor/20 text-sm"
                        onClick={() => setShowBankInput(true)}
                      />
                    </div>
                  ) : (
                    <Button
                      text="Add Bank Detail"
                      className="text-lightModalHeaderColor dark:text-darkBtn border py-1.5 px-3 border-lightModalHeaderColor dark:border-darkBtn hover:bg-lightModalHeaderColor/20 text-sm"
                      onClick={() => setShowBankInput(true)}
                    />
                  )}
                </section>
              </div>

              {/* Right: Payment Summary & Options */}
              <div className="flex flex-col gap-6 pl-4">
                <section>
                  <h2 className="text-xl font-semibold mb-4 text-gray-700">Payment Summary</h2>
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 p-4 space-y-2 text-sm">
                    <div className="flex justify-between"><span>Total Taxable Amount:</span> <span>{totals.totalTaxable.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Total CGST:</span> <span>{totals.totalCGST.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Total SGST:</span> <span>{totals.totalSGST.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Total IGST:</span> <span>{totals.totalIGST.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Total Tax Amount:</span> <span>{totals.totalTaxes.toFixed(2)}</span></div>
                    <div className="h-px bg-gray-300 my-2"></div>
                    <div className="flex justify-between font-bold"><span>Grand Total:</span> <span>{totals.grandTotal.toFixed(2)}</span></div>
                  </div>
                </section>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="roundOff"
                    checked={formData.roundOff}
                    onChange={(e) => setFormData(prev => ({ ...prev, roundOff: e.target.checked }))}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <label className="text-sm text-gray-700 dark:text-gray-300">Round Off</label>
                  {formData.roundOff && (
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Round Off: {totals.roundOffAmount.toFixed(2)}
                    </span>
                  )}
                </div>

                <section>
                  <h2 className="text-xl font-semibold mb-4 text-gray-700">Payment Options</h2>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                      <select
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      >
                        <option value="">Select Method</option>
                        <option value="Cash">Cash</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="UPI">UPI</option>
                        <option value="Cheque">Cheque</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Paid Amount</label>
                      <input
                        type="number"
                        name="paidAmount"
                        value={formData.paidAmount}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="flex justify-between text-sm font-medium">
                      <span>Balance Due:</span>
                      <span className={formData.balance > 0 ? "text-red-600" : "text-green-600"}>
                        {formData.balance.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        text="Full Payment"
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm"
                        onClick={() => setFormData(prev => ({ ...prev, paidAmount: totals.finalTotal, balance: 0 }))}
                      />
                    </div>
                  </div>
                </section>
              </div>
            </div>

            <div className="text-right mt-8">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 font-medium"
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
      {/* Shipping Address List Modal */}
      <Transition appear show={openModal2} as={Fragment}>
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
                  className={`w-full transform rounded-md text-left align-middle shadow-xl transition-all max-w-3xl ${isDark ? "bg-darkSecondary text-white" : "bg-light"}`}
                >
                  <div
                    className={`relative overflow-hidden py-4 px-5 text-lightModalHeaderColor flex justify-between bg-white border-b border-lightBorderColor dark:bg-darkInput dark:border-b dark:border-darkSecondary `}
                  >
                    <h2 className="capitalize leading-6 tracking-wider text-xl font-semibold text-lightModalHeaderColor dark:text-darkTitleColor">
                      Select Address
                    </h2>
                    <button onClick={() => setOpenModal2(false)} className="text-lightmodalCrosscolor hover:text-lightmodalbtnText text-[22px]">
                      <Icon icon="heroicons-outline:x" />
                    </button>
                  </div>

                  <div className="p-4 overflow-y-auto max-h-[50vh]">
                    {addresses?.length > 0 ? (
                      addresses.map((address) => (
                        <div
                          key={address._id}
                          className={`p-2 my-2 rounded cursor-pointer hover:bg-indigo-100 hover:text-black-500 flex justify-between items-center dark:hover:bg-gray-700 ${formData.shippingAddress?._id === address._id ? 'bg-indigo-50 text-gray-500' : ''
                            }`}
                          onClick={() => handleSelectShippingAddress(address)}
                        >
                          <div>
                            <p className="font-medium">{address.fullName}</p>
                            <p className="text-sm">{address.phone}</p>
                            <p className="text-sm">{address.address},{address?.city}, {address?.state}</p>
                          </div>
                          {formData.shippingAddress?._id === address._id && (
                            <GoCheck className="text-green-500" />
                          )}
                        </div>
                      ))
                    ) : (
                      <p className={isDark ? 'text-gray-300' : 'text-gray-500'}>
                        No address available
                      </p>
                    )}
                  </div>

                  <div className="px-4 py-3 flex justify-end space-x-3 border-t border-slate-100 dark:border-darkSecondary bg-white dark:bg-darkInput">
                    <button
                      type="button"
                      onClick={() => {
                        setOpenModal2(false)
                        setTimeout(() => {
                          setOpenModal3(true);
                        }, 300);
                      }}
                      className='flex items-center px-2 hover:bg-lightHoverBgBtn/20 hover:text-white border border-dashed border-lightHoverBgBtn dark:border-darkBtn rounded-md'
                    >
                      <BsPlus className='text-lightHoverBgBtn dark:text-darkBtn' />
                      <span className='text-lightHoverBgBtn dark:text-darkBtn'>
                        Add Address
                      </span>
                    </button>
                    <Button
                      text="Cancel"
                      className="bg-lightmodalBgBtnHover lightmodalBgBtn text-white hover:bg-lightmodalBgBtn hover:text-lightmodalbtnText px-4 py-2 rounded"
                      onClick={() => setOpenModal2(false)}
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Add Address Modal */}
      <AddAddressModel
        openModal3={openModal3}
        setOpenModal3={setOpenModal3}
        getShippingAddress={getShippingAddress}
        currentSupplierId={currentSupplierId}
      />

      {/* Add Transport Model */}
      <AddTransportModel
        openModal3={openModal5}
        setOpenModal3={setOpenModal5}
        getShippingAddress={getShippingAddress}
        currentSupplierId={currentSupplierId}
      />

      {/* Product List Modal */}
      <ProductListModel
        items={formData?.items}
        setItem={setFormData}
        openModal3={openModal4}
        setOpenModal3={setOpenModal4}
        getShippingAddress={getShippingAddress}
        currentSupplierId={currentSupplierId}
      />
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