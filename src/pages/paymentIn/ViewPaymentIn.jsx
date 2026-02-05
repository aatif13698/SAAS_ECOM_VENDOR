

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useDarkmode from '@/hooks/useDarkMode';
import purchasePaymentConfigureService from '@/services/purchasePaymentConfig/purchasePaymentConfigure.service';

import CryptoJS from "crypto-js";
import salePaymentInConfigureService from '../../services/salePaymentInConfigure/salePaymentInConfigure.service';
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

const encryptId = (id) => {
    const encrypted = CryptoJS.AES.encrypt(id.toString(), SECRET_KEY).toString();
    return encodeURIComponent(encrypted);
};


const formatDate = (isoDate) => {
    if (!isoDate) return '—';
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

const formatCurrency = (amount) => {
    return Number(amount || 0).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

const ViewPaymentIn = () => {
    const [isDark] = useDarkmode();
    const navigate = useNavigate();
    const { id: encryptedId } = useParams();


    const [paymentOut, setPaymentOut] = useState(null);
    const [loading, setLoading] = useState(true);

    console.log("paymentOut", paymentOut);



    const fetchPaymentOut = async (decryptedId) => {
        try {
            setLoading(true);
            const response = await salePaymentInConfigureService.getParticularPaymentIn(decryptedId);
            const data = response?.data;

            if (!data) {
                toast.error('Payment record not found');
                //   navigate('/payment-outs');
                return;
            }

            setPaymentOut(data);
        } catch (error) {
            console.error('Error fetching payment out:', error);
            toast.error('Failed to load payment details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!encryptedId) return;
        const decryptedId = decryptId(encryptedId);
        if (!decryptedId) {
            toast.error('Invalid payment ID');
            navigate('/payment-outs');
            return;
        }
        fetchPaymentOut(decryptedId);
    }, [encryptedId, navigate]);



    function navigateToInvoice(id) {
        
        navigate(`/view/sale-invoice/${encryptId(id)}`, { state: { id: id, name: "view" } });

    }




    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!paymentOut) {
        return (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                Payment record not found
            </div>
        );
    }

    const {
        paymentInNumber,
        paymentInDate,
        customer,
        warehouse,
        branch,
        businessUnit,
        paymentMethod,
        paidAmount = 0,
        notes,
        // Assuming these come from backend when you implement allocation
        invoices = [],
    } = paymentOut;

    console.log("invoices", invoices);
    

    const totalSettled = invoices.reduce((sum, item) => sum + (item.settlementAmount || 0), 0);
    const totalUnpaid = invoices.reduce((sum, item) => sum + (item.balance || 0), 0) + paidAmount;

    return (
        <div className="relative min-h-screen pb-8 bg-white rounded-md dark:bg-gray-900">
            {/* Header */}
            <div className="sticky top-14 z-10 bg-white dark:bg-gray-800 p-3 flex justify-between items-center shadow-md">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        Payment In #{paymentInNumber || '—'}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Date: {formatDate(paymentInDate)}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md text-sm font-medium"
                    >
                        Back
                    </button>
                    {/* You can add Print / PDF / Edit (if allowed) buttons here */}
                </div>
            </div>

            <div className="p-6 space-y-8 ">
                {/* Party & Payment Info - 2 column layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* customer / Bill From */}
                    <div className="bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                            Paid To
                        </h3>

                        {customer ? (
                            <div className="space-y-2 text-sm">
                                <div>
                                    <span className="font-medium text-gray-700 dark:text-gray-300">Name:</span>{' '}
                                    {customer?.firstName+" "+customer?.className}
                                </div>
                                {customer.phone && (
                                    <div>
                                        <span className="font-medium">Contact Nmber:</span> {customer.phone}
                                    </div>
                                )}
                                
                                {customer.email && (
                                    <div>
                                        <span className="font-medium">Email:</span> {customer.email}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-gray-500 dark:text-gray-400 italic">No customer selected</div>
                        )}
                    </div>

                    {/* Payment Details */}
                    <div className="bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                            Payment Details
                        </h3>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <div className="text-gray-600 dark:text-gray-400">Payment No</div>
                                <div className="font-medium text-gray-900 dark:text-gray-100">
                                    {paymentInNumber || '—'}
                                </div>
                            </div>

                            <div>
                                <div className="text-gray-600 dark:text-gray-400">Payment Date</div>
                                <div className="font-medium">{formatDate(paymentInDate)}</div>
                            </div>

                            <div>
                                <div className="text-gray-600 dark:text-gray-400">Amount Paid</div>
                                <div className="text-xl font-bold text-green-600 dark:text-green-400">
                                    ₹{formatCurrency(paidAmount)}
                                </div>
                            </div>

                            <div>
                                <div className="text-gray-600 dark:text-gray-400">Payment Method</div>
                                <div className="font-medium capitalize">
                                    {paymentMethod ? paymentMethod.replace('_', ' ') : '—'}
                                </div>
                            </div>

                            {warehouse && (
                                <div>
                                    <div className="text-gray-600 dark:text-gray-400">Warehouse</div>
                                    <div className="font-medium">{warehouse?.name || '—'}</div>
                                </div>
                            )}

                            {branch && (
                                <div>
                                    <div className="text-gray-600 dark:text-gray-400">Branch</div>
                                    <div className="font-medium">{branch?.name || '—'}</div>
                                </div>
                            )}
                        </div>

                        {notes && (
                            <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="text-gray-600 dark:text-gray-400 mb-1">Notes</div>
                                <div className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                                    {notes}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Allocation Table - Settled Invoices */}

                {invoices.length > 0 && (
                    <div className="bg-white dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
                        <div className="bg-white dark:bg-gray-700 px-6 py-3 border-b border-gray-200 dark:border-gray-600">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                Settled Against Invoices
                            </h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border-collapse">
                                <thead>
                                    <tr className="bg-gray-100 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600">
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600">
                                            Invoice No
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600">
                                            Invoice Amount
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                            Amount Settled
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="bg-white dark:bg-transparent divide-y divide-gray-200 dark:divide-gray-700">
                                    {invoices.map((alloc) => (
                                        <tr
                                            onClick={() => navigateToInvoice(alloc?.id?._id)}
                                            key={alloc._id}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200 border-r border-gray-200 dark:border-gray-700">
                                                {formatDate(alloc?.id?.siDate)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 border-r border-gray-200 dark:border-gray-700">
                                                {alloc?.id?.siNumber || '—'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-gray-200 border-r border-gray-200 dark:border-gray-700">
                                                ₹{formatCurrency(alloc?.id?.totalOrderAmount)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-blue-600 dark:text-blue-400">
                                                ₹{formatCurrency(alloc.settlementAmount)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>

                                {/* Footer - Totals */}
                                <tfoot className="bg-gray-50 dark:bg-gray-800 font-medium">
                                    <tr className="border-t border-gray-300 dark:border-gray-600">
                                        <td
                                            colSpan={2}
                                            className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100 border-r border-gray-200 dark:border-gray-700"
                                        >
                                            Total
                                        </td>
                                        <td className="px-6 py-4 text-sm text-right font-semibold text-gray-900 dark:text-gray-100 border-r border-gray-200 dark:border-gray-700">
                                            ₹{formatCurrency(
                                                invoices.reduce((sum, item) => sum + (item?.id?.totalOrderAmount || 0), 0)
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-right font-bold text-blue-700 dark:text-blue-400">
                                            ₹{formatCurrency(totalSettled)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                )}

                {invoices.length === 0 && (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/40 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
                        This payment was not allocated against any invoices
                    </div>
                )}

                {invoices.length === 0 && (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/40 rounded-lg border border-dashed">
                        This payment was not allocated against any invoices
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewPaymentIn;