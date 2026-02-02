

import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { BiArrowBack, BiEdit, BiMailSend, BiDownload, BiPrinter, BiDotsVerticalRounded } from "react-icons/bi";
import { FiLoader } from 'react-icons/fi';
import html2pdf from 'html2pdf.js'; // npm install html2pdf.js
import { useDispatch } from 'react-redux';
import saleInvoiceService from "../../services/saleInvoice/saleInvoice.service"

import CryptoJS from "crypto-js";

// Secret key for decryption (same as used for encryption)
const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY || "my-secret-key";
const decryptId = (encryptedId) => {
    try {
        const decoded = decodeURIComponent(encryptedId);
        const bytes = CryptoJS.AES.decrypt(decoded, SECRET_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error("Decryption failed:", error);
        return null;
    }
};

function ViewSaleInvoice() {
    const navigate = useNavigate();
    const { id: encryptedId } = useParams();
    const [poData, setPoData] = useState({});
    const pdfRef = useRef(null); // Ref for the PDF content div

    const [loading, setLoading] = useState(true)

    console.log("poData", poData);

    useEffect(() => {
        if (encryptedId) {
            const decryptedId = decryptId(encryptedId);
            getInvoice(decryptedId);
        }
        async function getInvoice(id) {
            try {
                setLoading(true)
                const response = await saleInvoiceService .getParticular(id);
                console.log("response aaa", response?.data);
                setPoData(response?.data);
                setLoading(false)

            } catch (error) {
                setLoading(false)

                console.log("error in fetching", error);
            }
        }
    }, [encryptedId]);



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

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2 }).format(amount || 0);
    };

    // Generate PDF using html2pdf (client-side, matches backend design)
    const generatePDF = async (isPrint = false) => {
        const element = pdfRef.current;
        if (!element) return;

        const opt = {
            margin: [5, 5, 15, 5],
            filename: `PO-${poData.poNumber || 'unknown'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                letterRendering: true,
                allowTaint: true
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };



        if (isPrint) {
            // For print: Open in new window and trigger print
            const pdfBlob = await html2pdf().set(opt).from(element).outputPdf('blob');
            const url = URL.createObjectURL(pdfBlob);
            const printWindow = window.open(url);
            printWindow.onload = () => {
                printWindow.print();
                printWindow.onafterprint = () => URL.revokeObjectURL(url);
            };
        } else {
            // For download: Direct save
            html2pdf().set(opt).from(element).save();
        }
    };

    const handleDownload = () => {
        generatePDF(false);
    };

    const handlePrint = () => {
        generatePDF(true);
    };

    // Dynamic status badge text
    const getStatusBadge = () => {
        switch (poData.status) {
            case 'draft': return 'Draft';
            case 'full_due': return 'Full Due';
            case 'paid': return 'Paid';
            case 'partially_paid': return 'Partially Paid';
            case 'overdue': return 'Overdue';
            case 'closed': return 'Closed';
            default: return poData.status?.replace('_', ' ') || 'Unknown';
        }
    };

    const getBadgeColor = () => {
        switch (poData.status) {
            case 'draft': return 'Draft';
            case 'full_due': return 'bg-[#ef4444]';
            case 'paid': return 'bg-[#22c55e]';
            case 'partially_paid': return 'bg-[#8b5cf6]';
            case 'overdue': return 'Overdue';
            case 'closed': return 'Closed';
            default: return poData.status?.replace('_', ' ') || 'Unknown';
        }
    }


    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen pb-8 bg-gray-300 rounded-md dark:bg-gray-900">
            <div className="sticky top-14 z-10 bg-white dark:bg-gray-800 p-4 flex justify-between items-center shadow-md">
                <div className="flex items-center gap-3 cursor-pointer hover:text-blue-500" onClick={() => navigate("/sales-invoices-list")}>
                    <BiArrowBack className="text-xl" />
                    <h3 className="md:text-lg text-sm font-semibold text-gray-800 dark:text-gray-200">
                        Sale invoice # {poData?.siNumber || 'N/A'}
                    </h3>
                </div>
                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">

                    {/* <button onClick={handleEdit} title="Edit" className="hover:text-blue-500">
                        <BiEdit className="text-xl" />
                    </button> */}
                    <button onClick={handleDownload} title="Download PDF" className="hover:text-blue-500">
                        <BiDownload className="text-xl" />
                    </button>
                    <button onClick={handlePrint} title="Print PDF" className="hover:text-blue-500">
                        <BiPrinter className="text-xl" />
                    </button>
                    {/* <div className="relative" ref={dropdownRef}>
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
                                        className={`block ${poData?.status == status ? "bg-blue-300" : ""} px-4 py-2 text-sm  dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left capitalize`}
                                    >
                                        {status.replace('_', ' ')}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div> */}
                </div>
            </div>
            <div
                ref={pdfRef}
                className="md:max-w-4xl max-w-full relative mx-auto bg-white dark:bg-gray-800 p-6 md:p-8 mt-6 shadow-lg rounded-lg print:shadow-none print:p-0 print:mt-0 print:bg-white"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '10pt', color: '#1a1a1a' }}
            >
                {/* Status Badge - Dynamic */}
                <div className={`absolute top-0 left-0 text-[1rem] font-bold text-white [--f:.5em] leading-[1.8] px-[1lh] pb-[var(--f)] [border-image:conic-gradient(#0008_0_0)_51%/var(--f)] [clip-path:polygon(100%_calc(100%_-_var(--f)),100%_100%,calc(100%_-_var(--f))_calc(100%_-_var(--f)),var(--f)_calc(100%_-_var(--f)),_0_100%,0_calc(100%_-_var(--f)),999px_calc(100%_-_var(--f)_-_999px),calc(100%_-_999px)_calc(100%_-_var(--f)_-_999px))] translate-x-[calc((cos(45deg)-1)*100%)] translate-y-[-100%] rotate-[-45deg] origin-[100%_100%]  only-screen:block print:hidden
                    ${getBadgeColor()}
                    `}>
                    {getStatusBadge()}
                </div>

                {/* Header */}
                <div className="text-center mb-8" style={{ lineHeight: 1.2 }}>
                    <h1 style={{ fontSize: '26pt', margin: 0, color: '#1a1a1a' }}>SALE INVOICE</h1>
                    <p style={{ margin: '8px 0', fontSize: '12pt', color: '#444' }}>
                        <strong>SI Number:</strong> {poData.siNumber || 'N/A'} &nbsp;|&nbsp; <strong>Date:</strong> {poData.siDate ? formatDate(poData.piDate) : 'N/A'}
                    </p>
                </div>

                {/* Company & Supplier Info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
                    <div style={{ width: '32%' }}>
                        <h3 style={{ fontSize: '14pt', margin: '0 0 12px 0', color: '#1a1a1a', borderBottom: '2px solid #1a1a1a', paddingBottom: '2px' }}>From (Seller)</h3>
                        <p><strong>Aestree</strong></p>
                        <p>West Bengal</p>
                        <p>India</p>
                        <p>91-9851199912</p>
                        <p>aayesha@yopmail.com</p>
                    </div>
                  <div style={{ width: '32%' }}>
                        <h3 style={{ fontSize: '14pt', margin: '0 0 12px 0', color: '#1a1a1a', borderBottom: '2px solid #1a1a1a', paddingBottom: '2px' }}>To (Customer)</h3>
                        <p><strong>{poData.customer?.firstName+" "+poData.customer?.lastName || 'N/A'}</strong></p>
                        <p>{poData.customer?.address || 'N/A'}</p>
                        <p>{poData.customer?.city || ''}, {poData.customer?.state || ''} - {poData.customer?.ZipCode || ''}</p>
                        <p>Phone: {poData.customer?.phone || 'N/A'}</p>
                        <p>Email: {poData.customer?.email || 'N/A'}</p>
                    </div>

                    <div style={{ width: '32%' }}>
                        <h3 style={{ fontSize: '14pt', margin: '0 0 12px 0', color: '#1a1a1a', borderBottom: '2px solid #1a1a1a', paddingBottom: '2px' }}>Ship To</h3>
                        <p><strong>{poData.shippingAddress?.fullName || 'N/A'}</strong></p>
                        <p>{poData.shippingAddress?.address || 'N/A'}</p>
                        <p>{`${poData.shippingAddress?.city || ''}, ${poData.shippingAddress?.state || ''}`}</p>
                        <p>{poData.shippingAddress?.country || 'N/A'}</p>
                        <p>{poData.shippingAddress?.phone || 'N/A'}</p>
                        <p>aayesha@yopmail.com</p>
                    </div>

                </div>



                {/* <hr style={{ border: 'none', borderTop: '2px solid #eee', margin: '10px 0' }} /> */}

                {/* Items Table */}
                <div className="overflow-x-auto mb-6">
                    <table style={{ width: '100%', borderCollapse: 'collapse', margin: '25px 0' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f5f5f5' }}>
                                <th style={{ border: '1px solid #ddd', padding: '8px 6px', textAlign: 'center', width: '5%' }}>Sr.No</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px 6px', textAlign: 'left', width: '30%' }}>Item</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px 6px', textAlign: 'center', width: '8%' }}>Qty</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px 6px', textAlign: 'right', width: '10%' }}>Price</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px 6px', textAlign: 'right', width: '8%' }}>Disc.</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px 6px', textAlign: 'right', width: '12%' }}>Taxable Amt</th>
                                {poData.isInterState ? (
                                    <>
                                        <th style={{ border: '1px solid #ddd', padding: '8px 6px', textAlign: 'right', width: '10%' }}>CGST</th>
                                        <th style={{ border: '1px solid #ddd', padding: '8px 6px', textAlign: 'right', width: '10%' }}>SGST</th>
                                    </>
                                ) : (
                                    <th style={{ border: '1px solid #ddd', padding: '8px 6px', textAlign: 'right', width: '15%' }}>IGST</th>
                                )}
                                <th style={{ border: '1px solid #ddd', padding: '8px 6px', textAlign: 'right', width: '12%' }}>Total Amount</th>
                            </tr>
                        </thead>
                        <tbody style={{ fontSize: '9.5pt' }}>
                            {poData.items?.map(item => (
                                <tr key={item._id}>
                                    <td style={{ border: '1px solid #ddd', padding: '8px 6px', textAlign: 'center' }}>{item.srNo}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px 6px' }}>{item.itemName?.name || 'N/A'}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px 6px', textAlign: 'center' }}>{item.quantity}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px 6px', textAlign: 'right' }}>₹{formatCurrency(item.mrp)}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px 6px', textAlign: 'right' }}>{formatCurrency(item.discount)}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px 6px', textAlign: 'right' }}>₹{formatCurrency(item.taxableAmount)}</td>
                                    {poData.isInterState ? (
                                        <>
                                            <td style={{ border: '1px solid #ddd', padding: '8px 6px', textAlign: 'right', whiteSpace: 'nowrap', fontSize: '9pt', lineHeight: 1.3 }}>
                                                ₹{formatCurrency(item.cgst)}
                                                <small style={{ display: 'block', color: '#666', fontSize: '8pt' }}>({item.cgstPercent}%)</small>
                                            </td>
                                            <td style={{ border: '1px solid #ddd', padding: '8px 6px', textAlign: 'right', whiteSpace: 'nowrap', fontSize: '9pt', lineHeight: 1.3 }}>
                                                ₹{formatCurrency(item.sgst)}
                                                <small style={{ display: 'block', color: '#666', fontSize: '8pt' }}>({item.sgstPercent}%)</small>
                                            </td>
                                        </>
                                    ) : (
                                        <td style={{ border: '1px solid #ddd', padding: '8px 6px', textAlign: 'right', whiteSpace: 'nowrap', fontSize: '9pt', lineHeight: 1.3 }}>
                                            ₹{formatCurrency(item.igst)}
                                            <small style={{ display: 'block', color: '#666', fontSize: '8pt' }}>({item.igstPercent}%)</small>
                                        </td>
                                    )}
                                    <td style={{ border: '1px solid #ddd', padding: '8px 6px', textAlign: 'right' }}><strong>₹{formatCurrency(item.totalAmount)}</strong></td>
                                </tr>
                            )) || (
                                    <tr>
                                        <td colSpan={poData.isInterState ? 9 : 8} style={{ border: '1px solid #ddd', padding: '8px 6px', textAlign: 'center' }}>No items available</td>
                                    </tr>
                                )}
                        </tbody>
                    </table>
                </div>

                {/* Totals Box - Matches Backend */}
                <div
                    className={`flex ${poData.notes ? "justify-between" : "justify-end"}  mb-8`}
                // style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}
                >

                    <div className=' w-[40%]'>
                        {poData.notes && (
                            <div style={{ marginTop: '20px', }}>
                                <strong>Notes:</strong> {poData.notes}

                            </div>
                        )}
                        {/* {poData.bankDetails && (
                            <div style={{ marginTop: '30px',  }}>
                                <strong>Bank Details:</strong><br />
                                <p>Bank: {poData.bankDetails.bankName} </p>
                                <p>A/c No: {poData.bankDetails.accountNumber}</p>
                                <p> IFSC: {poData.bankDetails.ifscCode}</p>
                                <p> Branch: {poData.bankDetails.branch}</p>
                            </div>
                        )} */}
                    </div>

                    <div className='bg-green-200' style={{ float: 'right', width: '50%', padding: '12px', background: '#f9f9f9', marginTop: '20px', fontSize: '11pt' }}>
                        <p style={{ margin: '6px 0', display: 'flex', justifyContent: 'space-between' }}><span className="label" style={{ fontWeight: 'bold' }}>Total Taxable Amount:</span> <span>₹{formatCurrency(totalTaxable)}</span></p>
                        <p style={{ margin: '6px 0', display: 'flex', justifyContent: 'space-between' }}><span className="label" style={{ fontWeight: 'bold' }}>Total CGST:</span> <span>₹{formatCurrency(totalCgst)}</span></p>
                        <p style={{ margin: '6px 0', display: 'flex', justifyContent: 'space-between' }}><span className="label" style={{ fontWeight: 'bold' }}>Total SGST:</span> <span>₹{formatCurrency(totalSgst)}</span></p>
                        <p style={{ margin: '6px 0', display: 'flex', justifyContent: 'space-between' }}><span className="label" style={{ fontWeight: 'bold' }}>Total IGST:</span> <span>₹{formatCurrency(totalIgst)}</span></p>
                        <p style={{ margin: '6px 0', display: 'flex', justifyContent: 'space-between' }}><span className="label" style={{ fontWeight: 'bold' }}>Total Tax Amount:</span> <span>₹{formatCurrency(totalTax)}</span></p>
                        <p className="grand" style={{ fontWeight: 'bold', fontSize: '13pt', color: '#d00', borderTop: '2px solid #333', paddingTop: '8px', marginTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
                            <span className="label">Grand Total:</span> <span>₹{formatCurrency(grandTotal)}</span>
                        </p>
                        {
                            poData?.payedFrom && poData?.payedFrom?.length > 0 && poData?.payedFrom?.map((ledg) => {
                                const type = ledg?.paymentType
                                return (
                                    <p className={` font-semibold ${type == "Payment" ? "text-gray-600" : type == "Settlement" ? "text-gray-600" : ""} `} style={{ margin: '6px 0', display: 'flex', justifyContent: 'space-between' }}><span className="label" style={{ fontWeight: 'bold' }}>{ledg?.paymentType}:</span> <span>(-) ₹{formatCurrency(ledg?.amount)}</span></p>
                                )
                            })
                        }
                        <p className='text-green-600 font-semibold' style={{ margin: '6px 0', display: 'flex', justifyContent: 'space-between' }}><span className="label" style={{ fontWeight: 'bold' }}>Paid Amount:</span> <span>₹{formatCurrency(poData.paidAmount)}</span></p>
                        <p className='text-blue-600 font-semibold' style={{ margin: '6px 0', display: 'flex', justifyContent: 'space-between' }}><span className="label" style={{ fontWeight: 'bold' }}>Balance Due:</span> <span>₹{formatCurrency(poData.balance)}</span></p>
                    </div>
                </div>


                {/* Authorized Signature */}
                <div style={{ marginTop: '20px', textAlign: 'left', fontSize: '10pt' }}>
                    <p style={{ marginBottom: '40px' }}>Authorized Signature</p>
                    <hr style={{ width: '200px', border: '1px solid #ccc' }} />
                </div>

                {/* Footer */}
                {/* <div style={{ marginTop: '50px', textAlign: 'center', fontSize: '9pt', color: '#777', paddingTop: '15px', borderTop: '1px solid #eee' }}>
                    This is a computer-generated Purchase Order. No signature required.
                </div> */}


            </div>
        </div>
    );
}

export default ViewSaleInvoice;