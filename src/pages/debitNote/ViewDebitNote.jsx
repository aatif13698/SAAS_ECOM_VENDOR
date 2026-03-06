

import React, { useState, useRef, useEffect, Fragment } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { BiArrowBack, BiEdit, BiMailSend, BiDownload, BiPrinter, BiDotsVerticalRounded } from "react-icons/bi";
import { FiLoader } from 'react-icons/fi';
import html2pdf from 'html2pdf.js'; // npm install html2pdf.js
import { useDispatch } from 'react-redux';
import debitNoteService from '@/services/debitNote/debitNote.service';
import salePaymentInConfigureService from '../../services/salePaymentInConfigure/salePaymentInConfigure.service';
import { Dialog, Transition } from "@headlessui/react";
import Icon from "@/components/ui/Icon";
import transactionSeriesService from "../../services/transactionSeries/tansactionSeries.service";
import Button from '../../components/ui/Button';
import CryptoJS from "crypto-js";
import toast from 'react-hot-toast';
import purchaseInvoiceService from '@/services/purchaseInvoice/purchaseInvoice.service';

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

function ViewDebitNote({ centered, noFade, scrollContent }) {
    const navigate = useNavigate();
    const { id: encryptedId } = useParams();
    const [poData, setPoData] = useState({});
    const pdfRef = useRef(null); // Ref for the PDF content div


    console.log("poData", poData);


    const [loading, setLoading] = useState(true);

    const [openPaymentForm, setOpenPaymentForm] = useState(false);
    const [openInvoiceForm, setOpenInvoiceForm] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [refreshCount, setRefreshCount] = useState(0);

    const [formData, setFormData] = useState({
        totalAmount: 0,
        paidAmount: 0,
        balance: 0,
        paymentMethod: "",
        payedFrom: "",
        paymentInDate: new Date().toISOString().split('T')[0],
        notes: ""

    });


    console.log("formData", formData);



    const [formDataErr, setFormDataErr] = useState({})
    const [paymentFrom, setPaymentFrom] = useState([]);
    const [currentWorkingFy, setCurrentWorkingFy] = useState(null);
    const [series, setSeries] = useState(null);

    console.log("series", series);




    useEffect(() => {
        if (poData) {
            setFormData((prev) => {
                return {
                    ...prev,
                    totalAmount: poData?.grandTotal,
                    balance: poData?.balance
                }
            })
        }
    }, [poData])


    const closeModal = () => {
        setOpenPaymentForm(false);
        setLoading2(false)
        setFormData((prev) => ({
            ...prev,
            totalAmount: 0,
            paidAmount: 0,
            paymentMethod: "",
            payedFrom: "",
            paymentInDate: new Date().toISOString().split('T')[0],
            notes: ""
        }));
        setFormDataErr((prev) => ({
            ...prev,
            name: "",
            description: "",
            slug: "",
            icon: "",
        }));
        // setRefresh((prev) => prev + 1)
    };

    const closeInvoiceModal = () => {
        setOpenInvoiceForm(false);
        setLoading2(false)
        setFormData((prev) => ({
            ...prev,
            totalAmount: 0,
            paidAmount: 0,
            paymentMethod: "",
            payedFrom: "",
            paymentInDate: new Date().toISOString().split('T')[0],
            notes: ""
        }));
        setFormDataErr((prev) => ({
            ...prev,
            name: "",
            description: "",
            slug: "",
            icon: "",
        }));
        // setRefresh((prev) => prev + 1)
    };

    function handleInputChange(e) {
        const { name, value } = e.target;
        if (name == "paidAmount") {
            if (value > formData?.balance) {
                toast.error("Can not enter more that balance");
                return
            }
        }
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const loadData = async (currentLevel, levelId, method) => {
        try {
            const configures = await salePaymentInConfigureService.getPaymentFromLedgers(currentLevel, levelId);
            console.log("configures", configures);
            let ledgerArray = [];
            if (method == "cash" && configures.data.cashLedgers?.length > 0) {
                if (configures.data.cashLedgers?.length > 0) {
                    const cashArray = configures.data.cashLedgers?.map((cash) => {
                        return {
                            ...cash.id,

                        }
                    });
                    ledgerArray = cashArray
                }
            } else {
                if (configures.data.bankLedgers?.length > 0) {
                    const bankArray = configures.data.bankLedgers?.map((bank) => {
                        return {
                            ...bank.id,
                        }
                    });
                    ledgerArray = bankArray
                }
            }
            setPaymentFrom(ledgerArray)
        } catch (err) {
            console.error(err);
        }
    };



    useEffect(() => {
        if (poData?.warehouse && formData.paymentMethod) {
            console.log("formData.paymentMethod", formData.paymentMethod);
            loadData("warehouse", poData?.warehouse, formData.paymentMethod)
        }
    }, [poData?.warehouse, formData.paymentMethod]);

    useEffect(() => {
        getNextSerial()
    }, [])

    function getFiscalYearRange(date) {
        const year = date.getFullYear();
        const nextYear = year + 1;
        const nextYearShort = nextYear % 100; // Gets the last two digits
        return `${year}-${nextYearShort.toString().padStart(2, '0')}`; // Ensures two digits, e.g., 2025-26
    }

    async function getNextSerial() {
        try {
            const currentDate = new Date();
            const financialYear = getFiscalYearRange(currentDate);
            const response = await transactionSeriesService.getNextSerialNumber(financialYear, "payment_in");
            setCurrentWorkingFy(response?.data?.financialYear)
            const nextNumber = Number(response?.data?.series?.nextNum) + 1;
            const series = `${response?.data?.series?.prefix + "" + nextNumber}`;
            setSeries(series)
        } catch (error) {
            console.log("error while getting the next series", error);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataObject = {
                clientId: localStorage.getItem("saas_client_clientId"),
                level: "warehouse",
                businessUnit: poData?.businessUnit,
                branch: poData?.branch,
                warehouse: poData?.warehouse,
                supplier: poData?.supplier?._id,
                supplierLedger: poData?.supplierLedger,
                paymentInNumber: series,
                paymentInDate: formData.paymentInDate,
                notes: formData.notes,
                paymentMethod: formData.paymentMethod,
                receivedIn: formData.payedFrom,
                paidAmount: formData.paidAmount,
                balance: formData.balance,
                payments: [{
                    saleInvoice: poData?._id,
                    amount: formData?.paidAmount
                }],
            };

            if (currentWorkingFy && currentWorkingFy?._id) {
                dataObject.financialYear = currentWorkingFy?._id
            }

            console.log("dataObject", dataObject);

            setLoading2(true);
            const response = await salePaymentInConfigureService?.createPaymentReceived(dataObject);
            setLoading2(false);
            setRefreshCount((prev) => prev + 1);
            closeModal();
            toast.success('Payment received submitted successfully!');
        } catch (error) {
            setLoading2(false);
            const message = error?.response?.data?.message;
            toast.error(message);
            console.log("Error submitting payment out:", message);
        }
    };












    console.log("poData", poData);

    useEffect(() => {
        if (encryptedId) {
            const decryptedId = decryptId(encryptedId);
            getInvoice(decryptedId);
        }
        async function getInvoice(id) {
            try {
                setLoading(true)
                const response = await debitNoteService.getParticular(id);
                console.log("response aaa", response?.data);
                setPoData(response?.data);
                setLoading(false)

            } catch (error) {
                setLoading(false)

                console.log("error in fetching", error);
            }
        }
    }, [encryptedId, refreshCount]);



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


    // invoice clearance 
    const [unPaidInvoices, setUnpaidInvoices] = useState([]);
    const [allocations, setAllocations] = useState([]);
    const [totalUnpaid, setTotalUnpaid] = useState(0);
    const [totalSettled, setTotalSettled] = useState(0);
    console.log("totalSettled", totalSettled);

    const [formData2, setFormData2] = useState({
        totalAmount: 0,
        paidAmount: 0,
        balance: 0,
        paymentMethod: "",
        payedFrom: "",
        paymentInDate: new Date().toISOString().split('T')[0],
        notes: ""

    });

    console.log("allocations", allocations);
    console.log("formData2", formData2);

    useEffect(() => {
        const unpaid = unPaidInvoices.reduce((sum, inv) => sum + inv.balance, 0);
        setTotalUnpaid(unpaid);
        const settled = allocations.reduce((sum, a) => sum + a.applied, 0);
        setTotalSettled(settled);
        setFormData2(prev => ({ ...prev, paidAmount: settled, balance: unpaid - settled }));
    }, [unPaidInvoices, allocations]);

    useEffect(() => {
        if (poData?.supplier) {
            // setCurrentSupplierId(formData?.supplier?._id);
            getUnPaidInvoices(poData?.supplier?._id, poData?.supplier?.ledgerLinkedId);
        }
    }, [poData?.supplier]);

    async function getUnPaidInvoices(supplier, supplierLedger) {
        try {
            const response = await purchaseInvoiceService.getUnpaidInvoices("warehouse", poData?.warehouse, supplier, supplierLedger);
            if (response?.data?.purchaseInvoices?.length > 0) {
                const formatedInvoices = response.data.purchaseInvoices.map(inv => ({
                    _id: inv._id,
                    piDate: inv.piDate,
                    supplier: inv.supplier,
                    supplierLedger: inv.supplierLedger,
                    piNumber: inv.piNumber,
                    totalOrderAmount: inv.totalOrderAmount,
                    paidAmount: inv.paidAmount,
                    balance: inv.balance
                }));
                setUnpaidInvoices(formatedInvoices);
            } else {
                setUnpaidInvoices([]);
            }
        } catch (error) {
            console.log("Error fetching unpaid invoices:", error);
        }
    }

    useEffect(() => {
        if (unPaidInvoices.length > 0) {
            const sorted = [...unPaidInvoices].sort((a, b) => new Date(a.piDate) - new Date(b.piDate));
            setAllocations(sorted.map(inv => ({ ...inv, applied: 0, isFixed: false })));
        } else {
            setAllocations([]);
        }
    }, [unPaidInvoices]);

    useEffect(() => {
        if (poData) {
            setFormData2((prev) => {
                return {
                    ...prev,
                    totalAmount: poData?.grandTotal,
                    balance: poData?.balance
                }
            })
        }
    }, [poData])


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
                <div className="flex items-center gap-3 cursor-pointer hover:text-blue-500" onClick={() => navigate("/debit-note-list")}>
                    <BiArrowBack className="text-xl" />
                    <h3 className="md:text-lg text-sm font-semibold text-gray-800 dark:text-gray-200">
                        Debit Note # {poData?.dnNumber || 'N/A'}
                    </h3>
                </div>
                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
                    {
                        poData?.balance > 0 ?
                            <button onClick={() => setOpenInvoiceForm(true)}
                                className="bg-emerald-500 h-8 p-2 flex items-center text-white rounded-lg cursor-pointer"
                            >
                                Clear Invoice
                            </button>
                            : ""
                    }
                    {
                        poData?.balance > 0 ?
                            <button onClick={() => setOpenPaymentForm(true)}
                                className="bg-emerald-500 h-8 p-2 flex items-center text-white rounded-lg cursor-pointer"
                            >
                                Receive Amount
                            </button>
                            : ""
                    }
                    <button onClick={handleDownload} title="Download PDF" className="hover:text-blue-500">
                        <BiDownload className="text-xl" />
                    </button>
                    <button onClick={handlePrint} title="Print PDF" className="hover:text-blue-500">
                        <BiPrinter className="text-xl" />
                    </button>
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
                    <h1 style={{ fontSize: '26pt', margin: 0, color: '#1a1a1a' }}>DEBIT NOTE</h1>
                    <p style={{ margin: '8px 0', fontSize: '12pt', color: '#444' }}>
                        <strong>DN Number:</strong> {poData.dnNumber || 'N/A'} &nbsp;|&nbsp; <strong>Date:</strong> {poData.dnDate ? formatDate(poData.dnDate) : 'N/A'}
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
                        <p><strong>{poData.customer?.firstName + " " + poData.customer?.lastName || 'N/A'}</strong></p>
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

                    <div className=' w-[100%] '>
                        {poData.notes && (
                            <div style={{ marginTop: '20px', }}>
                                <strong>Notes:</strong> {poData.notes}

                            </div>
                        )}
                        {poData.workOrderNumber && (
                            <div style={{ marginTop: '30px', }}>
                                <strong className='underline mb-4'>Work Order Details</strong><br />
                                <p>Work Order Number: <span className='font-bold'> {poData.workOrderNumber}</span> </p>
                                <p>Work Order Date: <span className='font-bold'> {formatDate(poData.workOrderDate)}</span>  </p>
                            </div>
                        )}
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
                            poData?.receivedIn && poData?.receivedIn?.length > 0 && poData?.receivedIn?.map((ledg) => {
                                const type = ledg?.paymentType
                                return (
                                    <p className={` font-semibold ${type == "Payment" ? "text-gray-600" : type == "Settlement" ? "text-gray-600" : ""} `} style={{ margin: '6px 0', display: 'flex', justifyContent: 'space-between' }}><span className="label" style={{ fontWeight: 'bold' }}>{ledg?.paymentType}:</span> <span>(-) ₹{formatCurrency(ledg?.amount)}</span></p>
                                )
                            })
                        }
                        {/* <p className='text-green-600 font-semibold' style={{ margin: '6px 0', display: 'flex', justifyContent: 'space-between' }}><span className="label" style={{ fontWeight: 'bold' }}>Paid Amount:</span> <span>₹{formatCurrency(poData.paidAmount)}</span></p> */}
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

            <Transition appear show={openPaymentForm} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-[99999]"
                    onClose={closeModal}
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
                    <div className="fixed inset-0 overflow-y-auto">
                        <div
                            className={`flex min-h-full justify-center text-center p-6 items-center "
                                    }`}
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
                                    className={`w-full transform overflow-hidden rounded-md
                                        text-left align-middle shadow-xl transition-alll max-w-3xl bg-light`}
                                >
                                    <div
                                        className={`relative overflow-hidden py-4 px-5 text-lightModalHeaderColor flex justify-between bg-white border-b border-lightBorderColor dark:bg-darkInput dark:border-b dark:border-darkSecondary `}
                                    >
                                        <h2 className="capitalize leading-6 tracking-wider  text-xl font-semibold text-lightModalHeaderColor dark:text-darkTitleColor">
                                            Receive Payment
                                        </h2>
                                        <button onClick={closeModal} className=" text-lightmodalCrosscolor hover:text-lightmodalbtnText text-[22px]">
                                            <Icon icon="heroicons-outline:x" />
                                        </button>
                                    </div>

                                    <div
                                        className={`px-0 py-8 ${scrollContent ? "overflow-y-auto max-h-[400px]" : ""
                                            }`}
                                    >

                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 p-4 bg-gray-100 rounded-lg mx-4">

                                            <div>
                                                <span>Total Balance: {formData?.balance}</span>
                                            </div>

                                            <div>
                                                <span>Remaining Balance: {Number(formData?.balance) - Number(formData?.paidAmount)}</span>
                                            </div>

                                        </div>
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 p-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Payment In No</label>
                                                <input
                                                    type="text"
                                                    name="paymentInNumber"
                                                    value={series}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                    required
                                                    disabled={true}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label
                                                    htmlFor="paidAmount"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Amount Received
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                                        {'₹'}
                                                    </span>
                                                    <input
                                                        id="paidAmount"
                                                        name="paidAmount"
                                                        type="number"
                                                        value={formData.paidAmount ?? ''}
                                                        onChange={handleInputChange}
                                                        step="0.01"
                                                        min="0"
                                                        className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm
                     focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                     disabled:bg-gray-100 disabled:text-gray-500 transition-colors"
                                                        placeholder="0.00"
                                                    />

                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <input type="checkbox"
                                                        onChange={(e) => { if (e.target.checked) { setFormData((prev) => ({ ...prev, paidAmount: poData?.balance, })); } }}
                                                    />
                                                    <span>Mark full amount</span>
                                                </div>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 overflow-hidden p-4">

                                            <div className="space-y-1">
                                                <label
                                                    htmlFor="paymentMethod"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Payment Method
                                                </label>
                                                <select
                                                    id="paymentMethod"
                                                    name="paymentMethod"
                                                    value={formData.paymentMethod || ''}
                                                    onChange={handleInputChange}
                                                    // disabled={!warehouse}
                                                    className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm
                   bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                   disabled:bg-gray-100 disabled:text-gray-500 transition-colors"
                                                >
                                                    <option value="">Select payment method</option>
                                                    <option value="cash">Cash</option>
                                                    <option value="cheque">Cheque</option>
                                                    <option value="online">Online Payment</option>
                                                    <option value="bank_transfer">Bank Transfer</option>
                                                    <option value="UPI">UPI</option>
                                                </select>
                                            </div>

                                            {/* Payment From (Ledger) */}
                                            <div className="space-y-1">
                                                <label
                                                    htmlFor="payedFrom"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Received In
                                                </label>
                                                <select
                                                    id="payedFrom"
                                                    name="payedFrom"           // ← fixed name!
                                                    value={formData.payedFrom || ''}
                                                    onChange={handleInputChange}
                                                    // disabled={!warehouse || !paymentFrom?.length}
                                                    className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm
                   bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                   disabled:bg-gray-100 disabled:text-gray-500 transition-colors"
                                                >
                                                    <option value="">Select ledger / account</option>
                                                    {paymentFrom?.map((ledger) => (
                                                        <option key={ledger._id} value={ledger._id}>
                                                            {ledger.ledgerName}
                                                            {/* {ledger.accountNumber && ` • ${ledger.accountNumber}`} */}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1"> Date</label>
                                                <input
                                                    type="date"
                                                    name="paymentInDate"
                                                    value={formData?.paymentInDate}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <label
                                                    htmlFor="notes"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Notes
                                                </label>
                                                <textarea
                                                    id="notes"
                                                    name="notes"
                                                    type="text"
                                                    value={formData?.notes ?? ''}
                                                    onChange={handleInputChange}
                                                    step="0.01"
                                                    min="0"
                                                    className="block w-full pl-4 py-2.5 border border-gray-300 rounded-lg text-sm
                     focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                     disabled:bg-gray-100 disabled:text-gray-500 transition-colors"
                                                    placeholder="notes"
                                                />
                                            </div>


                                        </div>
                                    </div>
                                    {(
                                        <div className="px-4 py-3 flex justify-end space-x-3 border-t border-slate-100 dark:border-darkSecondary  bg-white dark:bg-darkInput ">
                                            <div className="flex gap-2">
                                                <Button
                                                    text="Cancel"
                                                    // className="border bg-red-300 rounded px-5 py-2"
                                                    className="bg-lightmodalBgBtnHover lightmodalBgBtn text-white hover:bg-lightmodalBgBtn hover:text-lightmodalbtnText  px-4 py-2 rounded"
                                                    onClick={() => closeModal()}
                                                />
                                                <Button
                                                    text={`Save`}
                                                    // className="border bg-blue-gray-300 rounded px-5 py-2"
                                                    className={` bg-lightBtn hover:bg-lightBtnHover dark:bg-darkBtn hover:dark:bg-darkBtnHover text-white dark:hover:text-black-900  px-4 py-2 rounded`}
                                                    onClick={handleSubmit}
                                                    isLoading={loading2}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>


            {/* invoice clearance */}
            <Transition appear show={openInvoiceForm} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-[99999]"
                    onClose={closeInvoiceModal}
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
                    <div className="fixed inset-0 overflow-y-auto">
                        <div
                            className={`flex min-h-full justify-center items-start text-center p-6  "
                                    }`}
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
                                    className={`w-full transform overflow-hidden rounded-md
                                        text-left align-middle shadow-xl transition-alll max-w-7xl bg-light`}
                                >
                                    <div
                                        className={`relative overflow-hidden py-4 px-5 text-lightModalHeaderColor flex justify-between bg-white border-b border-lightBorderColor dark:bg-darkInput dark:border-b dark:border-darkSecondary `}
                                    >
                                        <h2 className="capitalize leading-6 tracking-wider  text-xl font-semibold text-lightModalHeaderColor dark:text-darkTitleColor">
                                            App credit from DN: # {poData?.dnNumber}
                                        </h2>
                                        <button onClick={closeInvoiceModal} className=" text-lightmodalCrosscolor hover:text-lightmodalbtnText text-[22px]">
                                            <Icon icon="heroicons-outline:x" />
                                        </button>
                                    </div>

                                    <div
                                        className={`px-0  ${scrollContent ? "overflow-y-auto max-h-[400px]" : ""
                                            }`}
                                    >

                                        <div className="bg-white dark:bg-transparent lg:col-span-2 md:col-span-2  border border-gray-200 col-span-3">
                                            <div className='bg-white dark:bg-transparent dark:border-b-[2px] dark:border-white p-4 rounded-t-lg flex justify-between items-center'>
                                                <h3 className="text-lg font-medium text-gray-700">Apply to Invoices</h3>
                                                <span>Available Credits: {'₹'} <span className='font-bold'>{poData?.balance}</span></span>
                                            </div>

                                            <div className="overflow-x-auto">
                                                {allocations.length > 0 ? (
                                                    <>
                                                        <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600 border border-gray-300 dark:border-gray-600">
                                                            <thead className="bg-gray-100 dark:bg-gray-800">
                                                                <tr className="border-b border-gray-300 dark:border-gray-600">

                                                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300 dark:border-gray-600">
                                                                        Date
                                                                    </th>
                                                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300 dark:border-gray-600">
                                                                        Invoice Number
                                                                    </th>
                                                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300 dark:border-gray-600">
                                                                        Invoice Amount
                                                                    </th>
                                                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300 dark:border-gray-600">
                                                                        Balance
                                                                    </th>
                                                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                                        Credit Amount
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="bg-white divide-y divide-gray-200 dark:bg-transparent dark:divide-gray-700">
                                                                {allocations.map((alloc) => {
                                                                    return (
                                                                        <tr key={alloc._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200 border-r border-gray-200 dark:border-gray-700">
                                                                                {formatDate(alloc.piDate)}
                                                                            </td>
                                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200 border-r border-gray-200 dark:border-gray-700">
                                                                                {alloc.piNumber}
                                                                            </td>
                                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200 border-r border-gray-200 dark:border-gray-700">
                                                                                {alloc.totalOrderAmount.toFixed(2)}
                                                                            </td>
                                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200 border-r border-gray-200 dark:border-gray-700">
                                                                                {alloc.balance.toFixed(2)}
                                                                            </td>
                                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
                                                                                {/* {alloc.applied.toFixed(2)} */}
                                                                                <div className="relative">
                                                                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                                                                        {'₹'}
                                                                                    </span>
                                                                                    <input
                                                                                        // id="paidAmount"
                                                                                        // name="paidAmount"
                                                                                        type="number"
                                                                                        value={alloc.applied ?? ''}
                                                                                        onChange={(e) => {
                                                                                            const value = e.target.value;
                                                                                            // if (poData?.balance < (Number(totalSettled)  + Number(value))) {
                                                                                            //     toast.error("Amount exceeds the credit balance")
                                                                                            // } else {

                                                                                            //     const newAllocations = allocations.map((item) => {
                                                                                            //         if (item?._id == alloc._id) {
                                                                                            //             return {
                                                                                            //                 ...item,
                                                                                            //                 applied: Number(value) 
                                                                                            //             }
                                                                                            //         } else {
                                                                                            //             return item
                                                                                            //         }
                                                                                            //     })
                                                                                            //     setAllocations(newAllocations)
                                                                                            // }
                                                                                            const newAllocations = allocations.map((item) => {
                                                                                                if (item?._id == alloc._id) {
                                                                                                    return {
                                                                                                        ...item,
                                                                                                        applied: Number(value)
                                                                                                    }
                                                                                                } else {
                                                                                                    return item
                                                                                                }
                                                                                            })
                                                                                            setAllocations(newAllocations)

                                                                                        }}
                                                                                        step="0.01"
                                                                                        min="0"
                                                                                        className="block  pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm
                     focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                     disabled:bg-gray-100 disabled:text-gray-500 transition-colors"
                                                                                        placeholder="0.00"
                                                                                    />

                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                })}
                                                            </tbody>
                                                        </table>

                                                        {/* Summary footer with proper borders */}
                                                        <div className="grid grid-cols-6 bg-white dark:bg-gray-900 border-t border-gray-300 dark:border-gray-600">

                                                            {/* <div className="px-6 py-4  flex justify-start col-span-2 relative bg-gray-100 dark:bg-gray-800">
                                                                <div className=" whitespace-nowrap text-sm">
                                                                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Remaining: </span>
                                                                    <span className="font-semibold text-red-600 dark:text-red-400">
                                                                        {(totalUnpaid - totalSettled).toFixed(2)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="px-6 py-4 col-span-2 flex gap-2 items-center justify-end  border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800">
                                                                <div className="text-xs font-medium text-gray-700 dark:text-gray-300">Total Unpaid:</div>
                                                                <div className="text-sm font-semibold text-green-700 dark:text-green-400">
                                                                    {totalUnpaid.toFixed(2)}
                                                                </div>
                                                            </div> */}
                                                            {/* <div className="px-6 py-4  flex justify-end items-center gap-2 col-span-2 relative bg-gray-100 dark:bg-gray-800">
                                                                <div className="text-xs font-medium text-gray-700 dark:text-gray-300">Total Settled:</div>
                                                                <div className="text-sm font-semibold text-blue-700 dark:text-blue-400 ">
                                                                    {totalSettled.toFixed(2)}
                                                                </div>
                                                            </div> */}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="p-8 text-center text-gray-500 dark:text-gray-400 border-t border-gray-300 dark:border-gray-600">
                                                        No unpaid invoices available.
                                                    </div>
                                                )}
                                            </div>

                                            <div className='flex justify-end mx-2 my-4'>
                                                <div className='flex flex-col p-2 rounded-md bg-gray-300 min-w-[20rem]'>
                                                    <div className='flex justify-between'>
                                                        <span>Total Amount To Credit:</span>
                                                        <span className='text-right min-w-[10rem] font-bold'>{totalSettled !== 0 ? totalSettled.toFixed(2) : "0.00"}</span>
                                                    </div>
                                                    <div className='flex justify-between'>
                                                        <span>Remaining Credit:</span>
                                                        <span className='text-right min-w-[10rem] font-bold'>{(Number(poData?.balance) - Number(totalSettled)).toFixed(2)} <span className='text-red-600 text-sm'>{Number(poData?.balance) - Number(totalSettled) < 0 ? "(Over Credit)" : ""}</span></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {(
                                        <div className="px-4 py-3 flex justify-end space-x-3 border-t border-slate-100 dark:border-darkSecondary  bg-white dark:bg-darkInput ">
                                            <div className="flex gap-2">
                                                <Button
                                                    text="Cancel"
                                                    // className="border bg-red-300 rounded px-5 py-2"
                                                    className="bg-lightmodalBgBtnHover lightmodalBgBtn text-white hover:bg-lightmodalBgBtn hover:text-lightmodalbtnText  px-4 py-2 rounded"
                                                    onClick={() => closeInvoiceModal()}
                                                />
                                                <Button
                                                    text={`Save`}
                                                    // className="border bg-blue-gray-300 rounded px-5 py-2"
                                                    className={` bg-lightBtn hover:bg-lightBtnHover dark:bg-darkBtn hover:dark:bg-darkBtnHover text-white dark:hover:text-black-900  px-4 py-2 rounded`}
                                                    onClick={handleSubmit}
                                                    isLoading={loading2}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>







        </div>
    );
}

export default ViewDebitNote;