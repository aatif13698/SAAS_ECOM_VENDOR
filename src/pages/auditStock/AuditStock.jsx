

import React, { useCallback, useEffect, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useDarkMode from "@/hooks/useDarkMode";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import { Card } from "@mui/material";
import { Dialog, Transition } from "@headlessui/react";
import tableConfigure from "../common/tableConfigure";
import purchaseInvoiceService from "@/services/purchaseInvoice/purchaseInvoice.service";
import { formatDate } from "@fullcalendar/core";
import debounceFunction from "@/helper/Debounce";

import CryptoJS from "crypto-js";

// Secret key for encryption
const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY || "my-secret-key";

const encryptId = (id) => {
    const encrypted = CryptoJS.AES.encrypt(id.toString(), SECRET_KEY).toString();
    return encodeURIComponent(encrypted);
};

const AuditStock = ({ noFade }) => {
    const { noDataStyle, customStyles } = tableConfigure();
    const [currentLevel, setCurrentLevel] = useState("");
    const [levelId, setLevelId] = useState("");

    const [openAuditTable, setOpenAuditTable] = useState(false);
    const [auditData, setAuditData] = useState(null);

    const { user: currentUser, isAuth: isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        if (currentUser && isAuthenticated) {
            if (currentUser.isVendorLevel) {
                setCurrentLevel("vendor");
            } else if (currentUser.isBuLevel) {
                setCurrentLevel("business");
                setLevelId(currentUser.businessUnit);
            } else if (currentUser.isBranchLevel) {
                setCurrentLevel("branch");
                setLevelId(currentUser.branch);
            } else if (currentUser.isWarehouseLevel) {
                setCurrentLevel("warehouse");
                setLevelId(currentUser.warehouse);
            } else {
                setCurrentLevel("vendor");
            }
        }
    }, [currentUser, isAuthenticated]);

    const [isDark] = useDarkMode();

    const [pending, setPending] = useState(true);
    const [totalRows, setTotalRows] = useState(0);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [paginationData, setPaginationData] = useState([]);

    const [keyWord, setKeyWord] = useState("");
    const handleFilter = (e) => {
        const currentKeyword = e.target.value;
        setKeyWord(currentKeyword);
        debounceSearch(currentKeyword);
    };

    const debounceSearch = useCallback(
        debounceFunction(async (nextValue) => {
            try {
                const response = await purchaseInvoiceService.getList(page, nextValue, perPage, currentLevel, levelId);
                setTotalRows(response?.data?.count || 0);
                setPaginationData(response?.data?.purchaseInvoices || []);
            } catch (error) {
                console.error("Error while fetching:", error);
            }
        }, 1000),
        [page, perPage, currentLevel, levelId]
    );

    async function getList() {
        try {
            const response = await purchaseInvoiceService.getList(page, keyWord, perPage, currentLevel, levelId);
            setTotalRows(response?.data?.count || 0);
            setPaginationData(response?.data?.purchaseInvoices || []);
            setPending(false);
        } catch (error) {
            setPending(false);
            console.error("Error while fetching list:", error);
        }
    }

    useEffect(() => {
        if (currentLevel) {
            getList();
        }
    }, [currentLevel, levelId, page, perPage, keyWord]);

    const handlePageChange = async (newPage) => {
        setPage(newPage);
    };

    const handlePerRowChange = async (newPerPage) => {
        setPerPage(newPerPage);
        setPage(1);
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleView = (row) => {
        scrollToTop();
        const id = row._id;
        getAuditPurchaseInvoice(id);
    };

    async function getAuditPurchaseInvoice(id) {
        try {
            const response = await purchaseInvoiceService.getAuditPurchaseInvoice(id);
            setAuditData(response?.data);
            setOpenAuditTable(true);
        } catch (error) {
            setOpenAuditTable(false);
            toast.error("Error fetching audit data");
            console.error("Error fetching audit data:", error);
        }
    }

    async function handleAudit(purchaseId, itemId) {
        try {
            // Assuming purchaseInvoiceService.auditItem(purchaseId, itemId) exists and audits the item
            await purchaseInvoiceService.auditItem(purchaseId, itemId);
            // Update local state to reflect audited status
            setAuditData((prev) => ({
                ...prev,
                items: prev.items.map((it) =>
                    it._id === itemId ? { ...it, audited: true } : it
                ),
            }));
            toast.success("Item audited successfully");
        } catch (error) {
            toast.error("Error auditing item");
            console.error("Error auditing item:", error);
        }
    }

    const columns = [
        {
            name: "Date",
            selector: (row) => formatDate(row?.piDate),
            sortable: true,
        },
        {
            name: "PO Number",
            selector: (row) => row?.piNumber,
            sortable: true,
        },
        {
            name: "Supplier",
            selector: (row) => row?.supplier?.name,
            sortable: false,
        },
        {
            name: "Amount",
            selector: (row) => row.totalOrderAmount,
            sortable: true,
        },
        {
            name: "Action",
            selector: (row) => (
                <div className="flex space-x-1 rtl:space-x-reverse">
                    <Tooltip content="View" placement="top" arrow animation="shift-away">
                        <button
                            className="action-btn"
                            type="button"
                            onClick={() => handleView(row)}
                        >
                            <Icon icon="heroicons:eye" />
                        </button>
                    </Tooltip>
                </div>
            ),
        },
    ];

    const subHeaderComponent = (
        <div className="w-full grid xl:grid-cols-2 md:grid-cols-1 gap-3 items-center">
            <div className="table-heading text-start"></div>
            <div className="grid lg:justify-end md:justify-start">
                <input
                    type="text"
                    placeholder="Search..."
                    className="form-control rounded-md px-4 py-2 border border-lightborderInputColor dark:border-darkInput text-lightinputTextColor bg-lightBgInputColor dark:bg-darkInput dark:text-white"
                    onChange={handleFilter}
                />
            </div>
        </div>
    );

    const paginationOptions = {
        rowsPerPageText: "row",
        rangeSeparatorText: "of",
    };

    return (
        <div className={`${isDark ? "bg-darkSecondary text-white" : ""} min-h-[80vh]`}>
            <Card />
            <DataTable
                columns={columns}
                data={paginationData}
                highlightOnHover
                customStyles={customStyles}
                fixedHeader
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                onChangePage={handlePageChange}
                onChangeRowsPerPage={handlePerRowChange}
                pointerOnHover
                progressPending={pending}
                subHeader
                subHeaderComponent={subHeaderComponent}
                paginationComponentOptions={paginationOptions}
                noDataComponent={
                    <div
                        className={`${isDark ? "bg-darkBody" : ""}`}
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            padding: "2rem",
                            border: "2px solid white",
                            flexDirection: "row",
                            gap: "1rem",
                            width: "100%",
                        }}
                    >
                        <p className="text-center font-bold text-2xl" style={noDataStyle}>
                            There is no record to display
                        </p>
                    </div>
                }
                progressComponent={
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            padding: "2rem",
                            border: "2px solid white",
                            flexDirection: "row",
                            gap: "1rem",
                            background: isDark ? "#0F172A" : "",
                            width: "100%",
                        }}
                    >
                        <p className="text-center font-bold text-2xl" style={noDataStyle}>
                            Processing...
                        </p>
                    </div>
                }
            />

            <Transition appear show={openAuditTable} as={Fragment}>
                <Dialog as="div" className="relative z-[9999]" onClose={() => setOpenAuditTable(false)}>
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

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter={noFade ? "" : "duration-300 ease-out"}
                                enterFrom={noFade ? "" : "opacity-0 scale-95"}
                                enterTo={noFade ? "" : "opacity-100 scale-100"}
                                leave={noFade ? "" : "duration-200 ease-in"}
                                leaveFrom={noFade ? "" : "opacity-100 scale-100"}
                                leaveTo={noFade ? "" : "opacity-0 scale-95"}
                            >
                                <Dialog.Panel
                                    className={`w-full max-w-6xl transform overflow-hidden rounded-lg text-left align-middle shadow-2xl transition-all
              ${isDark ? "bg-darkSecondary text-white" : "bg-white"}`}
                                >
                                    {/* Header */}
                                    <div
                                        className={`relative flex items-center justify-between px-6 py-4 border-b 
                ${isDark ? "border-darkBorder bg-darkInput" : "border-gray-200 bg-gray-50"}`}
                                    >
                                        <Dialog.Title
                                            as="h3"
                                            className="text-xl font-semibold leading-6 tracking-wide text-lightModalHeaderColor dark:text-darkTitleColor"
                                        >
                                            Audit Purchase Invoice - # {auditData?.piNumber || "Loading..."}
                                        </Dialog.Title>

                                        <button
                                            type="button"
                                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl transition-colors"
                                            onClick={() => setOpenAuditTable(false)}
                                        >
                                            <Icon icon="heroicons-outline:x" />
                                        </button>
                                    </div>

                                    {/* Body */}
                                    <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
                                        {auditData ? (
                                            <div className="overflow-x-auto">
                                                <table className={`min-w-full divide-y ${isDark ? "divide-gray-700" : "divide-gray-200"}`}>
                                                    <thead>
                                                        <tr className={`${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3.5 text-left text-sm font-semibold uppercase tracking-wider"
                                                            >
                                                                Item Name
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3.5 text-left text-sm font-semibold uppercase tracking-wider"
                                                            >
                                                                Purchase Qty
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3.5 text-left text-sm font-semibold uppercase tracking-wider"
                                                            >
                                                                Current Stock
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3.5 text-left text-sm font-semibold uppercase tracking-wider"
                                                            >
                                                                Total After Audit
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3.5 text-left text-sm font-semibold uppercase tracking-wider"
                                                            >
                                                                Action
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className={`${isDark ? "bg-gray-900 divide-gray-700" : "bg-white divide-gray-200"}`}>
                                                        {auditData.items.map((item) => (
                                                            <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                                    {item.itemName.name}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                                    {item.quantity}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                                    {item.oldItemStock}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                                    {item.quantity + item.oldItemStock}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                                    {item.audited ? (
                                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
                                                                            Audited
                                                                        </span>
                                                                    ) : (
                                                                        <button
                                                                            onClick={() => handleAudit(auditData._id, item._id)}
                                                                            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                                                        // disabled={loadingAudit} // optional: add loading state if needed
                                                                        >
                                                                            Audit Item
                                                                        </button>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                                                Loading audit information...
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer */}
                                    <div
                                        className={`px-6 py-4 flex justify-end border-t 
                ${isDark ? "border-darkBorder bg-darkInput" : "border-gray-200 bg-gray-50"}`}
                                    >
                                        <button
                                            type="button"
                                            className="px-5 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                            onClick={() => setOpenAuditTable(false)}
                                        >
                                            Close
                                        </button>
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

export default AuditStock;
