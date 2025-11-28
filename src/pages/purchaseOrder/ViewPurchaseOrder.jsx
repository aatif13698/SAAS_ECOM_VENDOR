// import React, { useState, useRef, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { BiArrowBack, BiEdit, BiMailSend, BiDownload, BiPrinter, BiChevronDown } from "react-icons/bi";
// import jsPDF from 'jspdf';

// function ViewPurchaseOrder() {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const [poData, setPoData] = useState(location.state?.row || {});
//     const [showDropdown, setShowDropdown] = useState(false);
//     const dropdownRef = useRef(null);

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//                 setShowDropdown(false);
//             }
//         };
//         document.addEventListener('mousedown', handleClickOutside);
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, []);

//     console.log("purchaseOrderData", poData);

//     const handleEdit = () => {
//         navigate('/edit-purchase-order', { state: { row: poData } });
//     };

//     const handleSendMail = () => {
//         // Placeholder for sending email with PDF attachment
//         // In a real app, this would integrate with an email service like EmailJS or backend API
//         alert('Sending purchase order via email...');
//     };

//     const calculateTotals = () => {
//         const items = poData.items || [];
//         const totalTaxable = items.reduce((sum, item) => sum + (item.taxableAmount || 0), 0);
//         const totalCgst = items.reduce((sum, item) => sum + (item.cgst || 0), 0);
//         const totalSgst = items.reduce((sum, item) => sum + (item.sgst || 0), 0);
//         const totalIgst = items.reduce((sum, item) => sum + (item.igst || 0), 0);
//         const totalTax = items.reduce((sum, item) => sum + (item.tax || 0), 0);
//         const grandTotal = poData.totalOrderAmount || 0;
//         return { totalTaxable, totalCgst, totalSgst, totalIgst, totalTax, grandTotal };
//     };

//     const { totalTaxable, totalCgst, totalSgst, totalIgst, totalTax, grandTotal } = calculateTotals();

//   const generatePDF = () => {
//         const doc = new jsPDF('p', 'pt', 'a4');
//         const pageWidth = doc.internal.pageSize.getWidth();
//         const margin = 40;
//         let y = 60;

//         // Company Header
//         doc.setFontSize(16);
//         doc.setFont('helvetica', 'bold');
//         doc.text('Aestree', margin, y);
//         y += 20;
//         doc.setFontSize(10);
//         doc.setFont('helvetica', 'normal');
//         doc.text('West Bengal', margin, y);
//         y += 15;
//         doc.text('India', margin, y);
//         y += 15;
//         doc.text('91-9851199912', margin, y);
//         y += 15;
//         doc.text('aayesha@yopmail.com', margin, y);

//         // Title
//         doc.setFontSize(20);
//         doc.setFont('helvetica', 'bold');
//         doc.text('PURCHASE ORDER', pageWidth - margin, 80, { align: 'right' });
//         doc.setFontSize(11);
//         doc.text(`# ${poData.poNumber || 'PO-00000'}`, pageWidth - margin, 100, { align: 'right' });

//         y = 140;

//         // Vendor & Delivery Address
//         doc.setFontSize(10);
//         doc.setFont('helvetica', 'bold');
//         doc.text('Vendor Address', margin, y);
//         doc.text('Deliver To', pageWidth / 2 + 20, y);
//         doc.setFont('helvetica', 'normal');

//         y += 20;
//         doc.text(poData.supplier?.contactPerson || 'Mr. Vendor', margin, y);
//         doc.text(poData.shippingAddress?.fullName || 'Deliver To', pageWidth / 2 + 20, y);

//         y += 15;
//         doc.text(poData.supplier?.address || '', margin, y);
//         doc.text(poData.shippingAddress?.address || '', pageWidth / 2 + 20, y);

//         y += 15;
//         doc.text(`${poData.supplier?.city || ''}, ${poData.supplier?.state || ''}`, margin, y);
//         doc.text(`${poData.shippingAddress?.city || ''}, ${poData.shippingAddress?.state || ''}`, pageWidth / 2 + 20, y);

//         y += 15;
//         doc.text(poData.supplier?.country || 'India', margin, y);
//         doc.text(poData.shippingAddress?.country || 'India', pageWidth / 2 + 20, y);

//         y += 15;
//         doc.text(poData.supplier?.contactNumber || '', margin, y);
//         doc.text(poData.shippingAddress?.phone || '', pageWidth / 2 + 20, y);

//         y += 15;
//         doc.text(poData.supplier?.emailContact || '', margin, y);

//         // Dates
//         const poDate = poData.poDate ? new Date(poData.poDate).toLocaleDateString('en-GB') : 'N/A';
//         const delDate = poData.poDate ? new Date(new Date(poData.poDate).setDate(new Date(poData.poDate).getDate() + 1)).toLocaleDateString('en-GB') : 'N/A';
//         doc.setFontSize(10);
//         doc.text(`Date : ${poDate}`, pageWidth - margin, 180, { align: 'right' });
//         doc.text(`Delivery Date : ${delDate}`, pageWidth - margin, 200, { align: 'right' });

//         // Table Header
//         y = 260;
//         doc.setFillColor(50, 50, 50);
//         doc.rect(margin, y, pageWidth - 2 * margin, 25, 'F');
//         doc.setTextColor(255, 255, 255);
//         doc.setFontSize(10);
//         doc.setFont('helvetica', 'bold');
//         doc.text('#', margin + 10, y + 17);
//         doc.text('Item & Description', margin + 50, y + 17);
//         doc.text('Qty', pageWidth - 300, y + 17);
//         doc.text('Rate', pageWidth - 200, y + 17);
//         doc.text('Amount', pageWidth - margin - 60, y + 17, { align: 'right' });

//         // Table Rows
//         doc.setTextColor(0, 0, 0);
//         doc.setFont('helvetica', 'normal');
//         y += 35;

//         poData.items?.forEach((item, idx) => {
//             const lines = doc.splitTextToSize(item.itemName?.name || 'N/A', 200);
//             const itemHeight = lines.length * 15;

//             doc.text((idx + 1).toString(), margin + 10, y);
//             doc.text(lines, margin + 50, y);
//             doc.text(item.quantity.toString(), pageWidth - 300, y);
//             doc.text(item.mrp.toFixed(2), pageWidth - 200, y);
//             doc.text(item.totalAmount.toFixed(2), pageWidth - margin - 60, y, { align: 'right' });

//             if (lines.length > 1) y += itemHeight - 15;
//             y += 25;

//             if (y > 750) {
//                 doc.addPage();
//                 y = 60;
//             }
//         });

//         // Totals
//         // y += 20;
//         // doc.setFont('helvetica', 'bold');
//         // doc.text('Sub Total', pageWidth - 300, y);
//         // doc.text(`${totalTaxable.toFixed(2)}`, pageWidth - margin - 60, y, { align: 'right' });

//         // y += 20;
//         // doc.text('Total', pageWidth - 300, y);
//         // doc.text(`₹${grandTotal.toFixed(2)}`, pageWidth - margin - 60, y, { align: 'right' });

//         // Detailed Tax (optional — can be shown if needed)
//         y += 30;
//         doc.setFontSize(9);
//         doc.setFont('helvetica', 'normal');
//         doc.text(`Total Taxable Amount: ${totalTaxable.toFixed(2)}`, pageWidth - margin - 200, y);
//         y += 15;
//         doc.text(`Total CGST: ${totalCgst.toFixed(2)}`, pageWidth - margin - 200, y);
//         y += 15;
//         doc.text(`Total SGST: ${totalSgst.toFixed(2)}`, pageWidth - margin - 200, y);
//         y += 15;
//         doc.text(`Total IGST: ${totalIgst.toFixed(2)}`, pageWidth - margin - 200, y);
//         y += 15;
//         doc.text(`Total Tax Amount: ${totalTax.toFixed(2)}`, pageWidth - margin - 200, y);

//         // Signature
//         y = 700;
//         doc.setFontSize(10);
//         doc.text('Authorized Signature ________________________', margin, y);

//         return doc;
//     };
//     const handleDownload = () => {
//         const doc = generatePDF();
//         doc.save(`PO-${poData.poNumber || 'unknown'}.pdf`);
//     };

//     const handlePrint = () => {
//         const doc = generatePDF();
//         doc.autoPrint();
//         doc.output('dataurlnewwindow');
//     };

//     const handleStatusChange = (newStatus) => {
//         setPoData(prev => ({ ...prev, status: newStatus }));
//         setShowDropdown(false);
//         // In a real app, call API to update status on backend
//         console.log(`Status changed to: ${newStatus}`);
//     };

//     const statuses = ['draft', 'issued', 'invoiced', 'partially_invoiced', 'pending_approval', 'approved', 'closed', 'canceled'];

//     let tableHeaders = ['#', 'Item & Description', 'Qty', 'Rate', 'Discount', 'Taxable Amount'];
//     if (poData.isInterState) {
//         tableHeaders.push('CGST', 'SGST');
//     } else {
//         tableHeaders.push('IGST');
//     }
//     tableHeaders.push('Tax', 'Amount');

//     return (
//         <div className="relative min-h-screen bg-gray-100 dark:bg-gray-900">
//             <div className="sticky top-14 z-10 bg-white dark:bg-gray-800 p-4 flex justify-between items-center shadow-md">
//                 <div className="flex items-center gap-3 cursor-pointer hover:text-blue-500" onClick={() => navigate("/purchase-order-list")}>
//                     <BiArrowBack className="text-xl" />
//                     <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
//                         Purchase order # {poData?.poNumber || 'N/A'}
//                     </h3>
//                 </div>
//                 <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
//                     <button onClick={handleEdit} title="Edit" className="hover:text-blue-500">
//                         <BiEdit className="text-xl" />
//                     </button>
//                     <button onClick={handleSendMail} title="Send Mail" className="hover:text-blue-500">
//                         <BiMailSend className="text-xl" />
//                     </button>
//                     <button onClick={handleDownload} title="Download PDF" className="hover:text-blue-500">
//                         <BiDownload className="text-xl" />
//                     </button>
//                     <button onClick={handlePrint} title="Print PDF" className="hover:text-blue-500">
//                         <BiPrinter className="text-xl" />
//                     </button>
//                     <div className="relative" ref={dropdownRef}>
//                         <button
//                             onClick={() => setShowDropdown(!showDropdown)}
//                             title="Change Status"
//                             className="flex items-center hover:text-blue-500"
//                         >
//                             <BiChevronDown className="text-xl" />
//                         </button>
//                         {showDropdown && (
//                             <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md py-1 z-20 border border-gray-200 dark:border-gray-700">
//                                 {statuses.map(status => (
//                                     <button
//                                         key={status}
//                                         onClick={() => handleStatusChange(status)}
//                                         className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left capitalize"
//                                     >
//                                         {status.replace('_', ' ')}
//                                     </button>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {/* PDF-like View - Responsive Layout */}
//             <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 md:p-8 mt-6 shadow-lg rounded-lg print:shadow-none print:p-0 print:mt-0">
//                 <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-0">
//                     <div className="text-sm text-gray-700 dark:text-gray-300">
//                         <h4 className="font-semibold">Aestree</h4>
//                         <p>West Bengal</p>
//                         <p>India</p>
//                         <p>91-9851199912</p>
//                         <p>aayesha@yopmail.com</p>
//                     </div>
//                     <div className="text-right">
//                         <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">PURCHASE ORDER</h1>
//                         <p className="text-sm text-gray-600 dark:text-gray-400"># {poData.poNumber || 'N/A'}</p>
//                     </div>
//                 </div>

//                 <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
//                     <div>
//                         <h5 className="font-semibold text-gray-800 dark:text-gray-200">Vendor Address</h5>
//                         <p>{poData.supplier?.contactPerson || 'N/A'}</p>
//                         <p>{poData.supplier?.address || 'N/A'}</p>
//                         <p>{`${poData.supplier?.city || ''}, ${poData.supplier?.state || ''}`}</p>
//                         <p>{poData.supplier?.country || 'N/A'}</p>
//                         <p>{poData.supplier?.contactNumber || 'N/A'}</p>
//                         <p>{poData.supplier?.emailContact || 'N/A'}</p>
//                     </div>
//                     <div>
//                         <h5 className="font-semibold text-gray-800 dark:text-gray-200">Deliver To</h5>
//                         <p>{poData.shippingAddress?.fullName || 'N/A'}</p>
//                         <p>{poData.shippingAddress?.address || 'N/A'}</p>
//                         <p>{`${poData.shippingAddress?.city || ''}, ${poData.shippingAddress?.state || ''}`}</p>
//                         <p>{poData.shippingAddress?.country || 'N/A'}</p>
//                         <p>{poData.shippingAddress?.phone || 'N/A'}</p>
//                     </div>
//                 </div>

//                 <div className="mt-6 text-right text-sm text-gray-700 dark:text-gray-300">
//                     <p>Date: {poData.poDate ? new Date(poData.poDate).toLocaleDateString('en-GB') : 'N/A'}</p>
//                     <p>Delivery Date: {poData.poDate ? new Date(new Date(poData.poDate).setDate(new Date(poData.poDate).getDate() + 1)).toLocaleDateString('en-GB') : 'N/A'}</p>
//                 </div>

//                 <div className="mt-8 overflow-x-auto">
//                     <table className="w-full border-collapse text-sm">
//                         <thead>
//                             <tr className="bg-gray-800 text-white">
//                                 {tableHeaders.map(header => (
//                                     <th key={header} className="p-2 text-left">{header}</th>
//                                 ))}
//                             </tr>
//                         </thead>
//                         <tbody className="text-gray-700 dark:text-gray-300">
//                             {poData.items?.map(item => (
//                                 <tr key={item._id} className="border-b">
//                                     <td className="p-2">{item.srNo}</td>
//                                     <td className="p-2">{item.itemName?.name || 'N/A'}</td>
//                                     <td className="p-2">{item.quantity}</td>
//                                     <td className="p-2">{item.mrp}</td>
//                                     <td className="p-2">{item.discount}</td>
//                                     <td className="p-2">{item.taxableAmount}</td>
//                                     {poData.isInterState ? (
//                                         <>
//                                             <td className="p-2">{item.cgst} ({item.cgstPercent} %)</td>
//                                             <td className="p-2">{item.sgst} ({item.sgstPercent} %)</td>
//                                         </>
//                                     ) : (
//                                         <td className="p-2">{item.igst} ({item.igstPercent} %)</td>
//                                     )}
//                                     <td className="p-2">{item.tax}</td>
//                                     <td className="p-2">{item.totalAmount}</td>
//                                 </tr>
//                             )) || <tr><td colSpan={tableHeaders.length} className="p-2 text-center">No items available</td></tr>}
//                         </tbody>
//                     </table>
//                 </div>

//                 <div className="mt-6 text-right text-sm text-gray-700 dark:text-gray-300">
//                     <p>Total Taxable Amount: {totalTaxable.toFixed(2)}</p>
//                     <p>Total CGST: {totalCgst.toFixed(2)}</p>
//                     <p>Total SGST: {totalSgst.toFixed(2)}</p>
//                     <p>Total IGST: {totalIgst.toFixed(2)}</p>
//                     <p>Total Tax Amount: {totalTax.toFixed(2)}</p>
//                     <p className="font-semibold">Grand Total: {grandTotal.toFixed(2)}</p>
//                 </div>

//                 <div className="mt-12 text-sm text-gray-700 dark:text-gray-300">
//                     <p>Authorized Signature</p>
//                     <hr className="w-48 border-gray-400 dark:border-gray-600" />
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default ViewPurchaseOrder;


import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BiArrowBack, BiEdit, BiMailSend, BiDownload, BiPrinter, BiChevronDown } from "react-icons/bi";
import { BiDotsVerticalRounded } from "react-icons/bi";

import jsPDF from 'jspdf';

function ViewPurchaseOrder() {
    const location = useLocation();
    const navigate = useNavigate();
    const [poData, setPoData] = useState(location.state?.row || {});
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    console.log("purchaseOrderData", poData);

    const handleEdit = () => {
        navigate('/edit-purchase-order', { state: { row: poData } });
    };

    const handleSendMail = () => {
        // Placeholder for sending email with PDF attachment
        // In a real app, this would integrate with an email service like EmailJS or backend API
        alert('Sending purchase order via email...');
    };

    const calculateTotals = () => {
        const items = poData.items || [];
        const totalTaxable = items.reduce((sum, item) => sum + (item.taxableAmount || 0), 0);
        const totalCgst = items.reduce((sum, item) => sum + (item.cgst || 0), 0);
        const totalSgst = items.reduce((sum, item) => sum + (item.sgst || 0), 0);
        const totalIgst = items.reduce((sum, item) => sum + (item.igst || 0), 0);
        const totalTax = items.reduce((sum, item) => sum + (item.tax || 0), 0);
        const grandTotal = poData.totalOrderAmount || 0;
        return { totalTaxable, totalCgst, totalSgst, totalIgst, totalTax, grandTotal };
    };

    const { totalTaxable, totalCgst, totalSgst, totalIgst, totalTax, grandTotal } = calculateTotals();

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-GB');
    };

    const generatePDF = () => {
        const doc = new jsPDF('p', 'pt', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 30;
        let y = 60;

        const poDate = poData.poDate ? formatDate(poData.poDate) : 'N/A';
        const deliveryDate = poData.poDate ? formatDate(new Date(new Date(poData.poDate).setDate(new Date(poData.poDate).getDate() + 1))) : 'N/A';
        doc.setFontSize(10);
        doc.text(`Date: ${poDate}`, pageWidth - margin, 180, { align: 'right' });
        doc.text(`Delivery Date: ${deliveryDate}`, pageWidth - margin, 200, { align: 'right' });

        // Company Header
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Aestree', margin, y);
        y += 20;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('West Bengal', margin, y);
        y += 15;
        doc.text('India', margin, y);
        y += 15;
        doc.text('91-9851199912', margin, y);
        y += 15;
        doc.text('aayesha@yopmail.com', margin, y);

        // Title
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('PURCHASE ORDER', pageWidth - margin, 80, { align: 'right' });
        doc.setFontSize(11);
        doc.text(`# ${poData.poNumber || 'PO-00000'}`, pageWidth - margin, 100, { align: 'right' });

        y = 140;

        // Dates



        // Vendor & Delivery Address
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Vendor Address', margin, y);
        doc.text('Deliver To', pageWidth / 2 + 20, y);
        doc.setFont('helvetica', 'normal');

        y += 20;
        doc.text(poData.supplier?.contactPerson || 'N/A', margin, y);
        doc.text(poData.shippingAddress?.fullName || 'N/A', pageWidth / 2 + 20, y);

        y += 15;
        doc.text(poData.supplier?.address || 'N/A', margin, y);
        doc.text(poData.shippingAddress?.address || 'N/A', pageWidth / 2 + 20, y);

        y += 15;
        doc.text(`${poData.supplier?.city || ''}, ${poData.supplier?.state || ''}`, margin, y);
        doc.text(`${poData.shippingAddress?.city || ''}, ${poData.shippingAddress?.state || ''}`, pageWidth / 2 + 20, y);

        y += 15;
        doc.text(poData.supplier?.country || 'N/A', margin, y);
        doc.text(poData.shippingAddress?.country || 'N/A', pageWidth / 2 + 20, y);

        y += 15;
        doc.text(poData.supplier?.contactNumber || 'N/A', margin, y);
        doc.text(poData.shippingAddress?.phone || 'N/A', pageWidth / 2 + 20, y);

        y += 15;
        doc.text(poData.supplier?.emailContact || 'N/A', margin, y);
        doc.text('aayesha@yopmail.com', pageWidth / 2 + 20, y);


        // Table Setup
        y = 260;
        const tableWidth = pageWidth - 2 * margin;
        const colWidths = {
            srNo: 30,
            desc: 150,
            qty: 40,
            rate: 50,
            discount: 50,
            taxable: 60,
            tax: 40,
            amount: 60
        };
        let taxWidth = poData.isInterState ? 60 : 120; // CGST+SGST or IGST
        if (poData.isInterState) {
            colWidths.cgst = 60;
            colWidths.sgst = 60;
        } else {
            colWidths.igst = 120;
        }

        // Adjust desc if needed to fit
        colWidths.desc = tableWidth - (colWidths.srNo + colWidths.qty + colWidths.rate + colWidths.discount + colWidths.taxable + taxWidth + colWidths.tax + colWidths.amount) - poData.isInterState ? 70 : 10;

        // Table Header
        doc.setFillColor(50, 50, 50);
        doc.rect(margin, y, tableWidth, 25, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');

        let x = margin + 5;
        doc.text('#', x + colWidths.srNo / 2, y + 17, { align: 'center' });
        x += colWidths.srNo;
        doc.text('Item', x + colWidths.desc / 2, y + 17, { align: 'center' });
        x += colWidths.desc;
        doc.text('Qty', x + colWidths.qty / 2, y + 17, { align: 'center' });
        x += colWidths.qty;
        doc.text('Rate', x + colWidths.rate / 2, y + 17, { align: 'center' });
        x += colWidths.rate;
        doc.text('Discount', x + colWidths.discount / 2, y + 17, { align: 'center' });
        x += colWidths.discount;
        doc.text('TA', x + colWidths.taxable / 2, y + 17, { align: 'center' });
        x += colWidths.taxable;
        if (poData.isInterState) {
            doc.text('CGST', x + colWidths.cgst / 2, y + 17, { align: 'center' });
            x += colWidths.cgst;
            doc.text('SGST', x + colWidths.sgst / 2, y + 17, { align: 'center' });
            x += colWidths.sgst;
        } else {
            doc.text('IGST', x + colWidths.igst / 2, y + 17, { align: 'center' });
            x += colWidths.igst;
        }
        doc.text('Tax', x + colWidths.tax / 2, y + 17, { align: 'center' });
        x += colWidths.tax;
        doc.text('Amount', x + colWidths.amount / 2, y + 17, { align: 'center' });

        // Table Rows
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        y += 25;

        poData.items?.forEach((item, idx) => {
            const rowHeight = 25;
            const lines = doc.splitTextToSize(item.itemName?.name || 'N/A', colWidths.desc - 10);

            // Alternate row color
            if (idx % 2 === 1) {
                doc.setFillColor(240, 240, 240);
                doc.rect(margin, y, tableWidth, rowHeight, 'F');
            }

            // Border  
            doc.setDrawColor(200);
            doc.rect(margin, y, tableWidth, rowHeight);

            x = margin + 5;
            doc.text(item.srNo.toString(), x + colWidths.srNo / 2, y + 15, { align: 'center' });
            x += colWidths.srNo;
            doc.text(lines[0], x + 5, y + 15); // First line only, truncate if long
            x += colWidths.desc;
            doc.text(item.quantity.toString(), x + colWidths.qty / 2, y + 15, { align: 'center' });
            x += colWidths.qty;
            doc.text(item.mrp.toFixed(2), x + colWidths.rate / 2, y + 15, { align: 'center' });
            x += colWidths.rate;
            doc.text(item.discount.toString(), x + colWidths.discount / 2, y + 15, { align: 'center' });
            x += colWidths.discount;
            doc.text(item.taxableAmount.toFixed(2), x + colWidths.taxable / 2, y + 15, { align: 'center' });
            x += colWidths.taxable;
            if (poData.isInterState) {
                doc.text(`${item.cgst?.toFixed(2)} 
             
                `, x + colWidths.cgst / 2, y + 15, { align: 'center' });
                x += colWidths.cgst;
                doc.text(`${item.sgst?.toFixed(2)} 
                
                `, x + colWidths.sgst / 2, y + 15, { align: 'center' });
                x += colWidths.sgst;
            } else {
                doc.text(`${item.igst?.toFixed(2)} 
                
                `, x + colWidths.igst / 2, y + 15, { align: 'center' });
                x += colWidths.igst;
            }
            doc.text(item.tax.toFixed(2), x + colWidths.tax / 2, y + 15, { align: 'center' });
            x += colWidths.tax;
            doc.text(item.totalAmount.toFixed(2), x + colWidths.amount / 2, y + 15, { align: 'center' });

            y += rowHeight;

            if (y > pageHeight - 150) {
                doc.addPage();
                y = 60;
            }
        });

        // Totals
        y += 20;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text(`Total Taxable Amount: ${totalTaxable.toFixed(2)}`, pageWidth - margin, y, { align: 'right' });
        y += 15;
        doc.text(`Total CGST: ${totalCgst.toFixed(2)}`, pageWidth - margin, y, { align: 'right' });
        y += 15;
        doc.text(`Total SGST: ${totalSgst.toFixed(2)}`, pageWidth - margin, y, { align: 'right' });
        y += 15;
        doc.text(`Total IGST: ${totalIgst.toFixed(2)}`, pageWidth - margin, y, { align: 'right' });
        y += 15;
        doc.text(`Total Tax Amount: ${totalTax.toFixed(2)}`, pageWidth - margin, y, { align: 'right' });
        y += 15;
        doc.setFontSize(10);
        doc.text(`Grand Total: ${grandTotal.toFixed(2)}`, pageWidth - margin, y, { align: 'right' });

        // Authorized Signature
        y = pageHeight - 50;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Authorized Signature', margin, y);
        doc.line(margin, y + 5, margin + 200, y + 5);

        return doc;
    };

    const handleDownload = () => {
        const doc = generatePDF();
        doc.save(`PO-${poData.poNumber || 'unknown'}.pdf`);
    };

    const handlePrint = () => {
        const doc = generatePDF();
        const blob = doc.output('blob');
        const url = URL.createObjectURL(blob);
        const printWindow = window.open(url);
        printWindow.onload = () => {
            printWindow.print();
            printWindow.onafterprint = () => URL.revokeObjectURL(url);
        };
    };

    const handleStatusChange = (newStatus) => {
        setPoData(prev => ({ ...prev, status: newStatus }));
        setShowDropdown(false);
        // In a real app, call API to update status on backend
        console.log(`Status changed to: ${newStatus}`);
    };

    const statuses = ['draft', 'issued', 'invoiced', 'partially_invoiced', 'pending_approval', 'approved', 'closed', 'canceled'];

    let tableHeaders = ['#', 'Item', 'Qty', 'Rate', 'Discount', 'TA'];
    if (poData.isInterState) {
        tableHeaders.push('CGST', 'SGST');
    } else {
        tableHeaders.push('IGST');
    }
    tableHeaders.push('Tax', 'Amount');

    return (
        <div className="relative min-h-screen pb-8 bg-gray-300 rounded-md dark:bg-gray-900">
            <div className="sticky top-14 z-10 bg-white dark:bg-gray-800 p-4 flex justify-between items-center shadow-md">
                <div className="flex items-center gap-3 cursor-pointer hover:text-blue-500" onClick={() => navigate("/purchase-order-list")}>
                    <BiArrowBack className="text-xl" />
                    <h3 className="md:text-lg text-sm font-semibold text-gray-800 dark:text-gray-200">
                        Purchase order # {poData?.poNumber || 'N/A'}
                    </h3>
                </div>
                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
                     <button onClick={handleSendMail} title="Send Mail" className="hover:text-blue-500 flex gap-1 ring-2 ring-gray-500 dark:ring-gray-400 hover:ring-blue-500 dark:hover:ring-blue-500 rounded-md p-1">
                        <span className='text-sm text-gray-500 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-500'>Send Mail</span>
                        <BiMailSend className="text-xl" /> 
                    </button>
                    <button onClick={handleEdit} title="Edit" className="hover:text-blue-500">
                        <BiEdit className="text-xl" />
                    </button>
                   
                    <button onClick={handleDownload} title="Download PDF" className="hover:text-blue-500">
                        <BiDownload className="text-xl" />
                    </button>
                    <button onClick={handlePrint} title="Print PDF" className="hover:text-blue-500">
                        <BiPrinter className="text-xl" />
                    </button>
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            title="Change Status"
                            className="flex items-center hover:text-blue-500"
                        >
                            <BiDotsVerticalRounded className="text-2xl" />
                        </button>
                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md py-1 z-20 border border-gray-200 dark:border-gray-700">
                                {statuses.map(status => (
                                    <button
                                        key={status}
                                        onClick={() => handleStatusChange(status)}
                                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left capitalize"
                                    >
                                        {status.replace('_', ' ')}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>


            {/* PDF-like View - Responsive Layout */}
            <div className="md:max-w-4xl max-w-full relative mx-auto bg-white dark:bg-gray-800 p-6 md:p-8 mt-6 shadow-lg rounded-lg print:shadow-none print:p-0 print:mt-0">
                <div className="absolute top-0 left-0 text-[1rem] font-bold text-white [--f:.5em] leading-[1.8] px-[1lh] pb-[var(--f)] [border-image:conic-gradient(#0008_0_0)_51%/var(--f)] [clip-path:polygon(100%_calc(100%_-_var(--f)),100%_100%,calc(100%_-_var(--f))_calc(100%_-_var(--f)),var(--f)_calc(100%_-_var(--f)),_0_100%,0_calc(100%_-_var(--f)),999px_calc(100%_-_var(--f)_-_999px),calc(100%_-_999px)_calc(100%_-_var(--f)_-_999px))] translate-x-[calc((cos(45deg)-1)*100%)] translate-y-[-100%] rotate-[-45deg] origin-[100%_100%] bg-[#009499]">
                {"Draft"}
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-0">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                        <h4 className="font-semibold">Aestree</h4>
                        <p>West Bengal</p>
                        <p>India</p>
                        <p>91-9851199912</p>
                        <p>aayesha@yopmail.com</p>
                    </div>
                    <div className="text-right">
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">PURCHASE ORDER</h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400"># {poData.poNumber || 'N/A'}</p>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h5 className="font-semibold text-gray-800 dark:text-gray-200">Vendor Address</h5>
                        <p>{poData.supplier?.contactPerson || 'N/A'}</p>
                        <p>{poData.supplier?.address || 'N/A'}</p>
                        <p>{`${poData.supplier?.city || ''}, ${poData.supplier?.state || ''}`}</p>
                        <p>{poData.supplier?.country || 'N/A'}</p>
                        <p>{poData.supplier?.contactNumber || 'N/A'}</p>
                        <p>{poData.supplier?.emailContact || 'N/A'}</p>
                    </div>
                    <div>
                        <h5 className="font-semibold text-gray-800 dark:text-gray-200">Deliver To</h5>
                        <p>{poData.shippingAddress?.fullName || 'N/A'}</p>
                        <p>{poData.shippingAddress?.address || 'N/A'}</p>
                        <p>{`${poData.shippingAddress?.city || ''}, ${poData.shippingAddress?.state || ''}`}</p>
                        <p>{poData.shippingAddress?.country || 'N/A'}</p>
                        <p>{poData.shippingAddress?.phone || 'N/A'}</p>
                        <p>aayesha@yopmail.com</p>
                    </div>
                </div>

                <div className="mt-6 text-right text-sm text-gray-700 dark:text-gray-300">
                    <p>Date: {poData.poDate ? formatDate(poData.poDate) : 'N/A'}</p>
                    <p>Delivery Date: {poData.poDate ? formatDate(new Date(new Date(poData.poDate).setDate(new Date(poData.poDate).getDate() + 1))) : 'N/A'}</p>
                </div>

                <div className="mt-8 overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="bg-gray-800 text-white">
                                {tableHeaders.map(header => (
                                    <th key={header} className="p-2 text-left">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="text-gray-700 dark:text-gray-300">
                            {poData.items?.map(item => (
                                <tr key={item._id} className="border-b">
                                    <td className="p-2">{item.srNo}</td>
                                    <td className="p-2">{item.itemName?.name || 'N/A'}</td>
                                    <td className="p-2">{item.quantity}</td>
                                    <td className="p-2">{item.mrp}</td>
                                    <td className="p-2">{item.discount}</td>
                                    <td className="p-2">{item.taxableAmount?.toFixed(2)}</td>
                                    {poData.isInterState ? (
                                        <>
                                            <td className="p-2">{item.cgst?.toFixed(2)} ({item.cgstPercent} %)</td>
                                            <td className="p-2">{item.sgst?.toFixed(2)} ({item.sgstPercent} %)</td>
                                        </>
                                    ) : (
                                        <td className="p-2">{item.igst?.toFixed(2)} ({item.igstPercent} %)</td>
                                    )}
                                    <td className="p-2">{item.tax?.toFixed(2)}</td>
                                    <td className="p-2">{item.totalAmount?.toFixed(2)}</td>
                                </tr>
                            )) || <tr><td colSpan={tableHeaders.length} className="p-2 text-center">No items available</td></tr>}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 text-right text-sm text-gray-700 dark:text-gray-300">
                    <p>Total Taxable Amount: {totalTaxable.toFixed(2)}</p>
                    <p>Total CGST: {totalCgst.toFixed(2)}</p>
                    <p>Total SGST: {totalSgst.toFixed(2)}</p>
                    <p>Total IGST: {totalIgst.toFixed(2)}</p>
                    <p>Total Tax Amount: {totalTax.toFixed(2)}</p>
                    <p className="font-semibold">Grand Total: {grandTotal.toFixed(2)}</p>
                </div>

                <div className="mt-12 text-sm text-gray-700 dark:text-gray-300">
                    <p>Authorized Signature</p>
                    <hr className="w-48 border-gray-400 dark:border-gray-600" />
                </div>
            </div>
        </div>
    );
}

export default ViewPurchaseOrder;