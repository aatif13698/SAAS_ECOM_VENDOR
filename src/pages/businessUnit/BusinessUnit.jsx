

// new code

import React, { useCallback, useEffect, useState, Fragment } from "react";
import { useDispatch } from "react-redux";
import "react-contexify/dist/ReactContexify.css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useDarkMode from "@/hooks/useDarkMode";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import Swal from "sweetalert2";
import { Card } from "@mui/material";
import vendorService from "@/services/vendor/vendor.service";
import debounceFunction from "@/helper/Debounce";
import loadingImg from "../../assets/images/aestree-logo.png"
import businessUnitService from "@/services/businessUnit/businessUnit.service";
import { Dialog, Transition } from "@headlessui/react";
import FormLoader from "@/Common/formLoader/FormLoader";
import tableConfigure from "../common/tableConfigure";
import ProfileImage from "../../assets/images/users/user-4.jpg"; // Assuming default logo
import CryptoJS from "crypto-js";



// Secret key for encryption (store this securely in .env in production)
const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY || "my-secret-key";

const encryptId = (id) => {
  const encrypted = CryptoJS.AES.encrypt(id.toString(), SECRET_KEY).toString();
  // URL-safe encoding
  return encodeURIComponent(encrypted);
};

const BusinessUnit = ({ noFade, scrollContent }) => {
    const { noDataStyle } = tableConfigure();

    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const handleCloseLoadingModal = () => {
        setShowLoadingModal(false);
    };

    const [isDark] = useDarkMode();

    const [pending, setPending] = useState(true);
    const [totalRows, setTotalRows] = useState(0);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isViewed, setIsViewed] = useState(false);
    const [userId, setUserId] = useState(null);
    const [refresh, setRefresh] = useState(0);
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };
    const handleView = (row) => {
        scrollToTop();
        const id = row._id;
        setUserId(id);
        const name = "view";
        setIsViewed(true);
        navigate(`/view-businessunit/${encryptId(id)}`, { state: { id, row, name } });
    };

    const handleEdit = (row) => {
        scrollToTop();
        const id = row._id;
        setUserId(id);
        const name = "edit";
        setIsViewed(false);
        navigate("/create-businessunit", { state: { id, row, name } });
    };

    const handleDelete = (row) => {
        const id = row._id;
        Swal.fire({
            title: `Are You Sure You Want To Permanantly Delete ${row?.name}?`,
            icon: "error",
            showCloseButton: true,
            showCancelButton: true,
            cancelButtonText: "Cancel",
            customClass: {
                popup: "sweet-alert-popup-dark-mode-style",
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                deleteOne(id);
            }
        });
    };

    async function deleteOne(id) {
        try {
            const dataObject = {
                keyword: keyWord,
                page: page,
                perPage: perPage,
                businessUnitId: id,
            };
            const response = await businessUnitService.deleteOne(dataObject);
            setTotalRows(response?.data?.data?.count);
            setPaginationData(response?.data?.data?.businessUnits);
            toast.success(`Deleted Successfully`);
        } catch (error) {
            console.error("Error while fetching manufacturer:", error);
        }
    }

    const handleActive = async (row) => {
        setShowLoadingModal(true);
        const id = row._id;
        let status = 1;
        row.isActive == 1 ? (status = 0) : (status = 1);
        try {
            const clinetId = localStorage.getItem("saas_client_clientId");
            const dataObject = {
                keyword: keyWord,
                page: page,
                perPage: perPage,
                status: status,
                id: id,
                clientId: clinetId,
            };
            const response = await businessUnitService.activeInactive(dataObject);
            setTotalRows(response?.data?.data?.count);
            setPaginationData(response?.data?.data?.businessUnits);
            toast.success(`${status == 0 ? "Deactivated Successfully" : "Activated Successfully"}`);
            setShowLoadingModal(false);
        } catch (error) {
            setShowLoadingModal(false);
            console.error("Error while activating:", error);
        }
    };

    const [paginationData, setPaginationData] = useState([]);
    const [keyWord, setkeyWord] = useState("");

    const handleFilter = (e) => {
        let currentKeyword = e.target.value;
        setkeyWord(currentKeyword);
        setPending(true);
        debounceSearch(currentKeyword);
    };

    const debounceSearch = useCallback(
        debounceFunction(
            async (nextValue) => {
                try {
                    const response = await businessUnitService.getList(page, nextValue, perPage);
                    setTotalRows(response?.data?.count);
                    setPaginationData(response?.data?.businessUnits);
                    setPending(false);
                } catch (error) {
                    console.error("Error while fetching business:", error);
                }
            },
            1000
        ),
        [page, perPage]
    );

    async function getList() {
        try {
            const response = await businessUnitService.getList(page, keyWord, perPage);
            setTotalRows(response?.data?.count);
            setPaginationData(response?.data?.businessUnits);
            setPending(false);
        } catch (error) {
            setPending(false);
            console.log("error while fetching vendors");
        }
    }

    useEffect(() => {
        getList();
    }, [refresh, page, perPage]);

    const handlePageChange = async (newPage) => {
        setPage(newPage);
    };

    const handlePerRowChange = async (newPerPage) => {
        setPerPage(newPerPage);
        setPage(1); // Reset to first page on perPage change
    };

    const totalPages = Math.ceil(totalRows / perPage);

    const subHeaderComponent = (
        <div className="w-full grid xl:grid-cols-2 md:grid-cols-1 md:text-start gap-3 items-center">
            <div className="table-heading text-start">

                <button
                    className={` bg-lightBtn hover:bg-lightBtnHover dark:bg-darkBtn hover:dark:bg-darkBtnHover text-white dark:hover:text-black-900  px-3 py-2 rounded   `}
                    onClick={() => navigate("/create-businessunit")}
                >
                    Create Business unit
                </button>

            </div>
            <div className="grid lg:justify-end md:justify-start">
                <input
                    type="text"
                    placeholder="Search.."
                    onChange={handleFilter}
                    className="form-control rounded-md px-4 py-2 border border-lightborderInputColor dark:border-darkSecondary text-lightinputTextColor bg-lightBgInputColor dark:bg-darkInput dark:text-white"
                />
            </div>
        </div>
    );

    return (
        <div className={`${isDark ? "bg-darkSecondary text-white" : "bg-white p-4 rounded-lg"} min-h-[80vh]`}>
            <Card></Card>
            <div className="text-end mb-4">
                <div className="flex gap-5 justify-between"></div>
            </div>

            {subHeaderComponent}

            {pending ? (
                <div style={{ display: "flex", marginTop: "12px", justifyContent: "center", padding: "2rem", border: "2px solid white", flexDirection: "row", gap: "1rem", background: isDark ? "#0F172A" : "", width: "100%" }}>
                    <img src={loadingImg} alt="No Data Image" style={{ height: "2rem", width: "2rem" }} />
                    <p className="text-center text-bold text-2xl" style={noDataStyle}>
                        Processing...
                    </p>
                </div>
            ) : paginationData?.length === 0 ? (
                <div className={`${isDark ? "bg-darkBody" : ""}`} style={{ display: "flex", justifyContent: "center", padding: "2rem", border: "2px solid white", flexDirection: "row", gap: "1rem", width: "100%" }}>
                    <p className="text-center text-bold text-2xl" style={noDataStyle}>
                        There is no record to display
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {paginationData.map((row) => (
                        <div className={`p-6 rounded-lg shadow-md ${isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'} cursor-pointer`}>
                            <div onClick={() => handleView(row)} key={row._id} className="flex items-center gap-4 mb-4">
                                <img
                                    src={row.icon || ProfileImage}
                                    alt="Business Logo"
                                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                                />
                                <div>
                                    <h3 className="text-lg font-semibold">{row.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{row.city || "N/A"}</p>
                                </div>
                            </div>
                            <div className="space-y-2 mb-4">
                                <p className="text-sm"><span className="font-medium">Email:</span> {row.emailContact || "N/A"}</p>
                                <p className="text-sm"><span className="font-medium">Phone:</span> {row.contactNumber || "N/A"}</p>
                            </div>
                            <div className="flex justify-between items-center">
                                <span
                                    className={`px-3 py-1 rounded-full text-sm cursor-pointer ${row.isActive ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'}`}
                                    onClick={() => handleActive(row)}
                                >
                                    {row.isActive ? "Active" : "Inactive"}
                                </span>
                                <div className="flex gap-2">
                                    <Tooltip content="View" placement="top" arrow animation="shift-away">
                                        <button className="text-blue-500 hover:text-blue-700" onClick={() => handleView(row)}>
                                            <Icon icon="heroicons:eye" />
                                        </button>
                                    </Tooltip>
                                    <Tooltip content="Edit" placement="top" arrow animation="shift-away">
                                        <button className="text-green-500 hover:text-green-700" onClick={() => handleEdit(row)}>
                                            <Icon icon="heroicons:pencil-square" />
                                        </button>
                                    </Tooltip>
                                    <Tooltip content="Delete" placement="top" arrow animation="shift-away" theme="danger">
                                        <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(row)}>
                                            <Icon icon="heroicons:trash" />
                                        </button>
                                    </Tooltip>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Custom Pagination */}
            {!pending && paginationData?.length > 0 && (
                <div className="flex justify-between items-center mt-6">
                    <select
                        value={perPage}
                        onChange={(e) => handlePerRowChange(Number(e.target.value))}
                        className="px-2 py-1 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    >
                        <option value={10}>10 per page</option>
                        <option value={20}>20 per page</option>
                        <option value={50}>50 per page</option>
                    </select>
                    <div className="flex gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => handlePageChange(page - 1)}
                            className="px-3 py-1 border rounded disabled:opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        >
                            Previous
                        </button>
                        <span className="px-3 py-1">Page {page} of {totalPages}</span>
                        <button
                            disabled={page === totalPages}
                            onClick={() => handlePageChange(page + 1)}
                            className="px-3 py-1 border rounded disabled:opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            <Transition appear show={showLoadingModal} as={Fragment}>
                <Dialog as="div" className="relative z-[99999]" onClose={handleCloseLoadingModal}>
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
                        <div className={`flex min-h-full justify-center text-center p-6 items-center`}>
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
                                    className={`w-full transform overflow-hidden rounded-md bg-white dark:bg-darkSecondary text-left align-middle shadow-xl transition-all max-w-[17rem] py-10`}
                                >
                                    <div className="flex flex-col justify-center mt-5 items-center gap-2">
                                        <FormLoader />
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

export default BusinessUnit;