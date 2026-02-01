import React, { useCallback, useEffect, useState, Fragment } from "react";
import { useDispatch } from "react-redux";
import DataTable from "react-data-table-component";
import "react-contexify/dist/ReactContexify.css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useDarkMode from "@/hooks/useDarkMode";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import { Card } from "@mui/material";
import debounceFunction from "@/helper/Debounce";
import loadingImg from "../../assets/images/aestree-logo.png";
import { Dialog, Transition } from "@headlessui/react";
import FormLoader from "@/Common/formLoader/FormLoader";
import tableConfigure from "../common/tableConfigure";
import { useSelector } from "react-redux";
import assetRequestService from "@/services/assetRequest/assetRequest.service";
import assetService from "@/services/asset/asset.service";
import Button from '../../components/ui/Button';


const AssetRequests = ({ noFade, scrollContent }) => {
    const { noDataStyle, customStyles } = tableConfigure();
    const [currentLevel, setCurrentLevel] = useState("");
    const [levelId, setLevelId] = useState("");
    const [availableAssets, setAvailableAssets] = useState([]);

    const { user: currentUser, isAuth: isAuthenticated } = useSelector(
        (state) => state.auth
    );

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
    const navigate = useNavigate();

    // Modal states
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        status: "",
        newAssetId: "",
    });
    const [submitting, setSubmitting] = useState(false);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleView = (row) => {
        scrollToTop();
        setSelectedRequest(row);
        setFormData({ status: "", newAssetId: "" });
        setIsViewModalOpen(true);
    };

    const closeModal = () => {
        setIsViewModalOpen(false);
        setSelectedRequest(null);
        setFormData({ status: "", newAssetId: "" });
    };

    function truncateText(text, limit = 12) {
        if (!text) return "";
        return text.length > limit ? text.substring(0, limit) + "..." : text;
    }

    const columns = [
        {
            name: "Level",
            selector: (row) => {
                if (row?.isBuLevel) return "Business Unit";
                if (row?.isBranchLevel) return "Branch";
                if (row?.isWarehouseLevel) return "Warehouse";
                return "-";
            },
            sortable: true,
        },
        {
            name: "Unit",
            selector: (row) => {
                let unit = "";
                if (row?.isBuLevel) unit = row?.businessUnit?.name;
                else if (row?.isBranchLevel) unit = row?.branch?.name;
                else if (row?.isWarehouseLevel) unit = row?.warehouse?.name;
                return (
                    <Tooltip content={unit} placement="top-end" arrow animation="shift-away">
                        <span>{truncateText(unit, 24)}</span>
                    </Tooltip>
                );
            },
            sortable: true,
        },
        {
            name: "Emp Name",
            selector: (row) =>
                `${row?.employeeId?.firstName || ""} ${row?.employeeId?.lastName || ""}`,
            sortable: true,
        },
        {
            name: "Asset",
            selector: (row) => row?.assetId?.assetName || "-",
            sortable: false,
        },
        {
            name: "Type",
            selector: (row) => row.requestType,
            sortable: true,
        },
        {
            name: "Status",
            sortable: true,
            cell: (row) => {
                const status = row?.status || "pending";
                const colors = {
                    pending: "text-yellow-600 bg-yellow-500",
                    approved: "text-green-600 bg-green-500",
                    denied: "text-red-600 bg-red-500",
                    default: "text-gray-600 bg-gray-500",
                };
                return (
                    <span className="block ">
                        <span
                            className={`inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${colors[status] || colors.default
                                }`}
                        >
                            {status.toUpperCase()}
                        </span>
                    </span>
                );
            },
        },
        {
            name: "Action",
            cell: (row) => (
                <div className="flex space-x-1 rtl:space-x-reverse">
                    <Tooltip content="View" placement="top" arrow animation="shift-away">
                        <button className="action-btn" type="button" onClick={() => {
                            if (row?.status == "pending") {
                                handleView(row)
                            }
                        }}>
                            <Icon icon="heroicons:eye" />
                        </button>
                    </Tooltip>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    const [paginationData, setPaginationData] = useState([]);
    const [keyWord, setKeyWord] = useState("");

    const handleFilter = (e) => {
        const value = e.target.value;
        setKeyWord(value);
        debounceSearch(value);
    };

    const debounceSearch = useCallback(
        debounceFunction(async (nextValue) => {
            try {
                const response = await assetRequestService.getList(
                    page,
                    nextValue,
                    perPage,
                    currentLevel,
                    levelId
                );
                setTotalRows(response?.data?.count || 0);
                setPaginationData(response?.data?.assetRequests || []);
            } catch (error) {
                console.error("Search error:", error);
            }
        }, 800),
        [page, perPage, currentLevel, levelId]
    );

    const getList = async () => {
        try {
            setPending(true);
            const response = await assetRequestService.getList(
                page,
                keyWord,
                perPage,
                currentLevel,
                levelId
            );
            setTotalRows(response?.data?.count || 0);
            setPaginationData(response?.data?.assetRequests || []);
        } catch (error) {
            console.error("Fetch list error:", error);
        } finally {
            setPending(false);
        }
    };

    const getAvailableAssets = async () => {
        try {
            const response = await assetService.getAvailableAssets(
                1,
                "",
                100,
                currentLevel,
                levelId
            );
            setAvailableAssets(response?.data?.assets || []);
        } catch (error) {
            console.error("Fetch available assets error:", error);
            toast.error("Failed to load available assets");
        }
    };

    useEffect(() => {
        if (currentLevel) {
            getList();
            getAvailableAssets();
        }
    }, [currentLevel, page, perPage, keyWord]);

    const handlePageChange = (newPage) => setPage(newPage);
    const handlePerRowChange = (newPerPage) => {
        setPerPage(newPerPage);
        setPage(1);
    };

    const handleSubmitAction = async () => {
        if (!selectedRequest?._id) return;

        if (formData.status === "approved" && selectedRequest.requestType === "exchange") {
            if (!formData.newAssetId) {
                toast.error("Please select a new asset for exchange");
                return;
            }
        }

        if (!formData.status) {
            toast.error("Please select a status");
            return;
        }

        setSubmitting(true);
        try {
            const clientId = localStorage.getItem("saas_client_clientId");

            const payload = {
                clientId: clientId,
                status: formData.status,
                assetRequestId: selectedRequest?._id,
                ...(formData.newAssetId && { newAssetId: formData.newAssetId }),
            };

            // You should have an update method in your service
            await assetRequestService.actionRequestAsset(payload);

            toast.success(`Request ${formData.status} successfully`);
            closeModal();
            getList(); // refresh list
        } catch (error) {
            console.error("Action error:", error);
            toast.error(error?.response?.data?.message || "Failed to process request");
        } finally {
            setSubmitting(false);
        }
    };

    const subHeaderComponent = (
        <div className="w-full grid xl:grid-cols-2 md:grid-cols-1 md:text-start gap-3 items-center">
            {/* <button
                className="w-fit bg-lightBtn hover:bg-lightBtnHover dark:bg-darkBtn hover:dark:bg-darkBtnHover text-white dark:hover:text-black-900 px-3 py-2 rounded"
                onClick={() => navigate("/create-assets-&-tools")}
            >
                Create Asset Request
            </button> */}
            <div className="table-heading text-start ">Request List</div>
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

    const paginationOptions = {
        rowsPerPageText: "Rows per page",
        rangeSeparatorText: "of",
    };

    const needsNewAsset = selectedRequest?.requestType === "exchange";

    return (
        <div className={`${isDark ? "bg-darkSecondary text-white" : ""}`}>
            <Card></Card>

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
                        <p className="text-center text-bold text-2xl" style={noDataStyle}>
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
                        <img src={loadingImg} alt="Loading" style={{ height: "2rem", width: "2rem" }} />
                        <p className="text-center text-bold text-2xl" style={noDataStyle}>
                            Processing...
                        </p>
                    </div>
                }
            />

            {/* View & Action Modal */}
            {/* <Transition appear show={isViewModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel
                                    className={`w-full max-w-2xl transform overflow-hidden rounded-2xl 
                    bg-white dark:bg-slate-800 text-left align-middle shadow-xl transition-all p-6
                    ${isDark ? "text-slate-200" : "text-slate-900"}`}
                                >
                                    <Dialog.Title className="text-xl font-semibold mb-5 flex items-center justify-between">
                                        <span>Asset Request Details</span>
                                        <button
                                            onClick={closeModal}
                                            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                        >
                                            <Icon icon="heroicons:x-mark" className="h-6 w-6" />
                                        </button>
                                    </Dialog.Title>

                                    {selectedRequest && (
                                        <div className="space-y-6">
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div>
                                                    <h3 className="font-medium mb-2 text-lg">Employee</h3>
                                                    <div className="space-y-1.5 text-sm">
                                                        <p>
                                                            <span className="font-medium">Name:</span>{" "}
                                                            {selectedRequest.employeeId?.firstName}{" "}
                                                            {selectedRequest.employeeId?.lastName}
                                                        </p>
                                                        <p>
                                                            <span className="font-medium">Email:</span>{" "}
                                                            {selectedRequest.employeeId?.email || "-"}
                                                        </p>
                                                        <p>
                                                            <span className="font-medium">Phone:</span>{" "}
                                                            {selectedRequest.employeeId?.phone || "-"}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="font-medium mb-2 text-lg">Request Info</h3>
                                                    <div className="space-y-1.5 text-sm">
                                                        <p>
                                                            <span className="font-medium">Type:</span>{" "}
                                                            {selectedRequest.requestType?.toUpperCase()}
                                                        </p>
                                                        <p>
                                                            <span className="font-medium">Current Asset:</span>{" "}
                                                            {selectedRequest.assetId?.assetName || "-"}
                                                        </p>
                                                        <p>
                                                            <span className="font-medium">Reason:</span>{" "}
                                                            {selectedRequest.reason || "-"}
                                                        </p>
                                                        <p>
                                                            <span className="font-medium">Notes:</span>{" "}
                                                            {selectedRequest.notes || "-"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="border-t dark:border-slate-600 pt-6 mt-6">
                                                <h3 className="font-medium mb-4 text-lg">Take Action</h3>

                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <div>
                                                        <label className="block text-sm font-medium mb-1.5">
                                                            Status <span className="text-red-500">*</span>
                                                        </label>
                                                        <select
                                                            value={formData.status}
                                                            onChange={(e) =>
                                                                setFormData({ ...formData, status: e.target.value })
                                                            }
                                                            className="w-full px-3 py-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                        >
                                                            <option value="">Select action</option>
                                                            <option value="approved">Approve</option>
                                                            <option value="denied">Deny</option>
                                                        </select>
                                                    </div>

                                                    {needsNewAsset && (
                                                        <div>
                                                            <label className="block text-sm font-medium mb-1.5">
                                                                New Asset <span className="text-red-500">*</span>
                                                            </label>
                                                            <select
                                                                value={formData.newAssetId}
                                                                onChange={(e) =>
                                                                    setFormData({ ...formData, newAssetId: e.target.value })
                                                                }
                                                                disabled={formData.status !== "approved"}
                                                                className="w-full px-3 py-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-60"
                                                            >
                                                                <option value="">Select replacement asset</option>
                                                                {availableAssets.map((asset) => (
                                                                    <option key={asset._id} value={asset._id}>
                                                                        {asset.assetName} ({asset.assetCode || "-"})
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="mt-8 flex justify-end gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={closeModal}
                                                        className="px-5 py-2.5 border rounded-md hover:bg-gray-100 dark:hover:bg-slate-700"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={handleSubmitAction}
                                                        disabled={submitting || !formData.status}
                                                        className="px-6 py-2.5 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                                                    >
                                                        {submitting && <FormLoader size="small" />}
                                                        Submit
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition> */}


            <Transition appear show={isViewModalOpen} as={Fragment}>
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
                                        text-left align-middle shadow-xl transition-alll max-w-3xl ${isDark ? "bg-darkSecondary text-white" : "bg-light"}`}
                                >
                                    <div
                                        className={`relative overflow-hidden py-4 px-5 text-lightModalHeaderColor flex justify-between bg-white border-b border-lightBorderColor dark:bg-darkInput dark:border-b dark:border-darkSecondary `}
                                    >
                                        <h2 className="capitalize leading-6 tracking-wider  text-xl font-semibold text-lightModalHeaderColor dark:text-darkTitleColor">
                                            Asset Request Details
                                        </h2>
                                        <button onClick={closeModal} className=" text-lightmodalCrosscolor hover:text-lightmodalbtnText text-[22px]">
                                            <Icon icon="heroicons-outline:x" />
                                        </button>
                                    </div>

                                    <div
                                        className={`px-0 py-8 ${scrollContent ? "overflow-y-auto max-h-[400px]" : ""
                                            }`}
                                    >


                                        {selectedRequest && (
                                            <div className="space-y-6 p-4">
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <div>
                                                        <h3 className="font-medium mb-2 text-lg">Employee</h3>
                                                        <div className="space-y-1.5 text-sm">
                                                            <p>
                                                                <span className="font-medium">Name:</span>{" "}
                                                                {selectedRequest.employeeId?.firstName}{" "}
                                                                {selectedRequest.employeeId?.lastName}
                                                            </p>
                                                            <p>
                                                                <span className="font-medium">Email:</span>{" "}
                                                                {selectedRequest.employeeId?.email || "-"}
                                                            </p>
                                                            <p>
                                                                <span className="font-medium">Phone:</span>{" "}
                                                                {selectedRequest.employeeId?.phone || "-"}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <h3 className="font-medium mb-2 text-lg">Request Info</h3>
                                                        <div className="space-y-1.5 text-sm">
                                                            <p>
                                                                <span className="font-medium">Type:</span>{" "}
                                                                {selectedRequest.requestType?.toUpperCase()}
                                                            </p>
                                                            <p>
                                                                <span className="font-medium">Current Asset:</span>{" "}
                                                                {selectedRequest.assetId?.assetName || "-"}
                                                            </p>
                                                            <p>
                                                                <span className="font-medium">Reason:</span>{" "}
                                                                {selectedRequest.reason || "-"}
                                                            </p>
                                                            <p>
                                                                <span className="font-medium">Notes:</span>{" "}
                                                                {selectedRequest.notes || "-"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="border-t-2 border-slate-400 pt-6 mt-6">
                                                    <h3 className="font-medium mb-4 text-lg">Take Action</h3>

                                                    <div className="grid md:grid-cols-2 gap-6">
                                                        <div>
                                                            <label className="block text-sm font-medium mb-1.5">
                                                                Status <span className="text-red-500">*</span>
                                                            </label>
                                                            <select
                                                                value={formData.status}
                                                                onChange={(e) =>
                                                                    setFormData({ ...formData, status: e.target.value })
                                                                }
                                                                className="w-full px-3 py-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                            >
                                                                <option value="">Select action</option>
                                                                <option value="approved">Approve</option>
                                                                <option value="denied">Deny</option>
                                                            </select>
                                                        </div>

                                                        {needsNewAsset && (
                                                            <div>
                                                                <label className="block text-sm font-medium mb-1.5">
                                                                    New Asset <span className="text-red-500">*</span>
                                                                </label>
                                                                <select
                                                                    value={formData.newAssetId}
                                                                    onChange={(e) =>
                                                                        setFormData({ ...formData, newAssetId: e.target.value })
                                                                    }
                                                                    disabled={formData.status !== "approved"}
                                                                    className="w-full px-3 py-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-60"
                                                                >
                                                                    <option value="">Select replacement asset</option>
                                                                    {availableAssets.map((asset) => (
                                                                        <option key={asset._id} value={asset._id}>
                                                                            {asset.assetName} ({asset.assetCode || "-"})
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        )}
                                                    </div>


                                                </div>
                                            </div>
                                        )}



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
                                                <button
                                                    type="button"
                                                    onClick={handleSubmitAction}
                                                    disabled={submitting || !formData.status}
                                                    className={` bg-lightBtn hover:bg-lightBtnHover dark:bg-darkBtn hover:dark:bg-darkBtnHover text-white dark:hover:text-black-900  px-4 py-2 rounded`}
                                                >
                                                    {submitting ? "Submiting.." :  "Submit"}
                                                    
                                                </button>


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
};

export default AssetRequests;