import React, { useCallback, useEffect, useState, Fragment } from "react";
import { useDispatch } from "react-redux";
import DataTable from "react-data-table-component";
import "react-contexify/dist/ReactContexify.css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useDarkMode from "@/hooks/useDarkMode";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Card } from "@mui/material";
import vendorService from "@/services/vendor/vendor.service";
import debounceFunction from "@/helper/Debounce";

import loadingImg from "../../assets/images/aestree-logo.png"
import businessUnitService from "@/services/businessUnit/businessUnit.service";
import { data } from "autoprefixer";
import { Dialog, Transition } from "@headlessui/react";
import FormLoader from "@/Common/formLoader/FormLoader";
import tableConfigure from "../common/tableConfigure";
import branchService from "@/services/branch/branch.service";
import warehouseService from "@/services/warehouse/warehouse.service";
import employeeService from "@/services/employee/employee.service";
import { useSelector } from "react-redux";
import departmentService from "@/services/department/department.service";
import assetService from "@/services/asset/asset.service";
import leaveCategoryService from "@/services/leaveCategory/leaveCategory.service";


const LeaveRequest = ({ noFade, scrollContent }) => {

    const { noDataStyle, customStyles } = tableConfigure();
    const [currentLevel, setCurrentLevel] = useState("");
    const [levelId, setLevelId] = useState("");

    console.log("currentLevel", currentLevel);
    console.log("levelId", levelId);


    const { user: currentUser, isAuth: isAuthenticated } = useSelector((state) => state.auth);


    useEffect(() => {

        if (currentUser && isAuthenticated) {
            if (currentUser.isVendorLevel) {
                setCurrentLevel("vendor");
            } else if (currentUser.isBuLevel) {
                setCurrentLevel("business");
                setLevelId(currentUser.businessUnit)
            } else if (currentUser.isBranchLevel) {
                setCurrentLevel("branch");
                setLevelId(currentUser.branch)
            } else if (currentUser.isWarehouseLevel) {
                setCurrentLevel("warehouse");
                setLevelId(currentUser.warehouse)
            } else {
                setCurrentLevel("vendor");
            }
        } else {


        }

    }, [currentUser])


    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const handleCloseLoadingModal = () => {
        setShowLoadingModal(false);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLeaveRequest, setSelectedLeaveRequest] = useState(null);
    const [isApproveChecked, setIsApproveChecked] = useState(false);
    const [isRejectChecked, setIsRejectChecked] = useState(false);
    const [remark, setRemark] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedLeaveRequest(null);
        setIsApproveChecked(false);
        setIsRejectChecked(false);
        setRemark("");
    };

    const handleActionChange = (action) => {
        if (action === 'approve') {
            setIsApproveChecked(true);
            setIsRejectChecked(false);
        } else if (action === 'reject') {
            setIsApproveChecked(false);
            setIsRejectChecked(true);
        }
    };

    const handleSubmitAction = async () => {
        if (!isApproveChecked && !isRejectChecked) {
            toast.error("Please select approve or reject.");
            return;
        }

        const status = isApproveChecked ? 'approved' : 'rejected';
        setIsSubmitting(true);
        const clientId = localStorage.getItem("saas_client_clientId");
        try {
            // Replace with actual API call, e.g., leaveCategoryService.updateLeaveRequestStatus(selectedLeaveRequest._id, status, remark)
            const response = await leaveCategoryService.actionLeaveRequest({
                clientId: clientId,
                leaveRequestId: selectedLeaveRequest._id,
                status,
                remark,
                approvedBy: currentUser._id, // Assuming currentUser has _id
            });

            if (response?.data?.success) { // Adjust based on your API response structure
                toast.success(`Leave request ${status} successfully.`);
                handleCloseModal();
                setRefresh((prev) => prev + 1); // Refresh the list
            } else {
                toast.error("Failed to update leave request.");
            }
        } catch (error) {
            console.error("Error updating leave request:", error);
            toast.error("An error occurred while updating the leave request.");
        } finally {
            setIsSubmitting(false);
        }
    };





    const [isDark] = useDarkMode();

    const [pending, setPending] = useState(true);
    const [totalRows, setTotalRows] = useState();
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isViewed, setIsViewed] = useState(false);
    const [userId, setUserId] = useState(null);
    const inputBoxStyle = {
        backgroundColor: isDark ? "#0F172A" : "",
        padding: "12px 14px",
        border: isDark ? "1px solid white" : "1px solid black",
        height: "38px",
        borderRadius: "0.5rem",
    };


    const [refresh, setRefresh] = useState(0);
    const handleView = (row) => {
        setSelectedLeaveRequest(row);
        setIsModalOpen(true);
    };

    function formatDate(isoDate) {
        const date = new Date(isoDate);
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    //   ------- Data Table Columns ---
    function truncateText(text, limit = 12) {
        if (!text) return "";
        return text.length > limit ? text.substring(0, limit) + "..." : text;
    }
    const columns = [
        {
            name: "Level",
            selector: (row) => {
                let level = "";
                if (row?.isBuLevel) {
                    level = "Business Unit"
                } else if (row?.isBranchLevel) {
                    level = "Branch"
                } else if (row?.isWarehouseLevel) {
                    level = "Warehouse"
                }
                return level
            },
            sortable: true,
            style: {
                width: "20px", // Set the desired width here
            },
        },
        {
            name: "Unit",
            selector: (row) => {
                let unit = "";
                if (row?.isBuLevel) {
                    unit = row?.businessUnit?.name
                } else if (row?.isBranchLevel) {
                    unit = row?.branch?.name
                } else if (row?.isWarehouseLevel) {
                    unit = row?.warehouse?.name
                }
                return <Tooltip
                    content={unit}
                    placement="top-end"
                    arrow
                    animation="shift-away"
                >
                    <span>{truncateText(unit, 24)}</span>
                </Tooltip>
            },
            sortable: true,
            style: {
                width: "20px", // Set the desired width here
            },
        },
        {
            name: "Name",
            selector: (row) => (row?.employeeId?.firstName + " " + row?.employeeId?.lastName),
            sortable: true,
            style: {
                width: "20px", // Set the desired width here
            },
        },
        {
            name: "Leave Type",
            selector: (row) => row?.leaveTypeId?.name,
            sortable: false,

        },
        {
            name: "Days",
            selector: (row) => row.totalDays,
            sortable: true,
            style: {
                width: "20px", // Set the desired width here
            },
        },
        {
            name: "Status",
            sortable: true,

            selector: (row) => {

                return (
                    <span className="block w-full">
                        <span
                            className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25  ${row?.status == "approved" ? "text-success-500 bg-success-500" : ""
                                }
             `}


                        >
                            {row.status}
                        </span>
                    </span>
                );
            },
        },
        {
            name: "Action",
            selector: (row) => {
                return (
                    <div className="flex  space-x-1 rtl:space-x-reverse ">
                        <Tooltip
                            content="View"
                            placement="top"
                            arrow
                            animation="shift-away"
                        >
                            <button
                                className="action-btn"
                                type="button"
                                onClick={() => handleView(row)}
                            >
                                <Icon icon="heroicons:eye" />
                            </button>
                        </Tooltip>

                    </div>
                );
            },
        },
    ];
    //------ Applying server side Pagination------
    // const [paginationData, setPaginationData] = useState(records);
    const [paginationData, setPaginationData] = useState();

    // FIlter the Data Based on the search
    const [filterData, setFilterData] = useState();
    const [keyWord, setkeyWord] = useState("");
    const handleFilter = (e) => {
        let currentKeyword = e.target.value;
        setkeyWord(currentKeyword);
        debounceSearch(currentKeyword);
    };

    const debounceSearch = useCallback(
        debounceFunction(
            async (nextValue) => {
                try {
                    const response = await leaveCategoryService.getListLeaveRequests(page, nextValue, perPage, currentLevel, levelId);
                    setTotalRows(response?.data?.count);
                    setPaginationData(response?.data?.leaverequests);
                } catch (error) {
                    console.error("Error while fetching:", error);
                }
            },
            1000
        ),
        []
    );


    async function getListLeaveRequests() {
        try {
            const response = await leaveCategoryService.getListLeaveRequests(page, keyWord, perPage, currentLevel, levelId);
            setTotalRows(response?.data?.count);
            setPaginationData(response?.data?.leaverequests);
            setPending(false);
        } catch (error) {
            setPending(false);
            console.log("error while fetching assets");
        }
    }

    useEffect(() => {

        if (currentLevel) {
            getListLeaveRequests()
        }
    }, [refresh, currentLevel]);

    // ------Performing Action when page change -----------
    const handlePageChange = async (page) => {
        try {
            const response = await leaveCategoryService.getListLeaveRequests(page, keyWord, perPage);
            setTotalRows(response?.data?.count);
            setPaginationData(response?.data?.leaverequests);
            setPage(page);
        } catch (error) {
            console.log("error while fetching", error);
        }
    };
    // ------Handling Action after the perPage data change ---------
    const handlePerRowChange = async (perPage) => {
        try {
            const response = await leaveCategoryService.getListLeaveRequests(page, keyWord, perPage);
            setTotalRows(response?.data?.count);
            setPaginationData(response?.data?.leaverequests);
            setPerPage(perPage);
        } catch (error) {
            console.log("error while fetching", error);
        }
        setPerPage(perPage);
    };

    // -----Adding a Search Box ---------

    const subHeaderComponent = (
        <div className="w-full grid xl:grid-cols-1 md:grid-cols-1 md:text-start gap-3  items-center">
            <div className="grid lg:justify-end md:justify-end">
                <input
                    type="text"
                    placeholder="Search.."
                    // style={inputBoxStyle}
                    onChange={handleFilter}
                    className="form-control rounded-md px-4 py-2 border border-lightborderInputColor  dark:border-darkSecondary text-lightinputTextColor  bg-lightBgInputColor dark:bg-darkInput dark:text-white"
                />
            </div>
        </div>
    );

    const paginationOptions = {
        rowsPerPageText: "row",
        rangeSeparatorText: "of",
    };
    return (
        <div className={`${isDark ? "bg-darkSecondary text-white" : ""}`}>
            <Card></Card>
            <div className="text-end mb-4">
                <div className="flex gap-5 justify-between"></div>
            </div>

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
                // selectableRows
                pointerOnHover
                progressPending={pending}
                subHeader
                subHeaderComponent={subHeaderComponent}
                paginationComponentOptions={paginationOptions}
                noDataComponent={<div className={`${isDark ? "bg-darkBody" : ""}`} style={{ display: "flex", justifyContent: "center", padding: "2rem", border: "2px solid white", flexDirection: "row", gap: "1rem", width: "100%" }}>

                    <p className="text-center text-bold text-2xl" style={noDataStyle}>
                        There is no record to display
                    </p>
                </div>
                }
                progressComponent={
                    <div style={{ display: "flex", justifyContent: "center", padding: "2rem", border: "2px solid white", flexDirection: "row", gap: "1rem", background: isDark ? "#0F172A" : "", width: "100%" }}>
                        <img src={loadingImg} alt="No Data Image" style={{ height: "2rem", width: "2rem" }} />

                        <p className="text-center text-bold text-2xl" style={noDataStyle}>
                            Processing...
                        </p>
                    </div>
                }
            />

            <Transition appear show={showLoadingModal} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-[99999]"
                    onClose={handleCloseLoadingModal}
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
                                       bg-white dark:bg-darkSecondary text-left align-middle shadow-xl transition-alll max-w-[17rem] py-10 `}
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

            {/* Leave Request Details Modal */}
            {/* Leave Request Details Modal */}
            <Transition appear show={isModalOpen} as={Fragment}>
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
                                            Leave Request Details
                                        </Dialog.Title>

                                        <button
                                            type="button"
                                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl transition-colors"
                                            onClick={handleCloseModal}
                                        >
                                            <Icon icon="heroicons-outline:x" />
                                        </button>
                                    </div>

                                    {/* Body */}
                                    <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
                                        {selectedLeaveRequest ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Left Column - Main Info */}
                                                <div className="space-y-5">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                            Employee Name
                                                        </label>
                                                        <p className="text-base font-medium text-gray-900 dark:text-white">
                                                            {selectedLeaveRequest.employeeId?.firstName}{" "}
                                                            {selectedLeaveRequest.employeeId?.lastName}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                            Email
                                                        </label>
                                                        <p className="text-gray-800 dark:text-gray-200">
                                                            {selectedLeaveRequest.employeeId?.email}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                            Leave Type
                                                        </label>
                                                        <p className="text-gray-800 dark:text-gray-200">
                                                            {selectedLeaveRequest.leaveTypeId?.name}
                                                            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                                                                ({selectedLeaveRequest.leaveTypeId?.code})
                                                            </span>
                                                        </p>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                                Start Date
                                                            </label>
                                                            <p className="text-gray-800 dark:text-gray-200">
                                                                {formatDate(selectedLeaveRequest.startDate)}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                                End Date
                                                            </label>
                                                            <p className="text-gray-800 dark:text-gray-200">
                                                                {formatDate(selectedLeaveRequest.endDate)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                            Total Days
                                                        </label>
                                                        <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                                                            {selectedLeaveRequest.totalDays} day{selectedLeaveRequest.totalDays > 1 ? 's' : ''}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Right Column - Reason & Status + Action */}
                                                <div className="space-y-5">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                            Reason
                                                        </label>
                                                        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                                                            {selectedLeaveRequest.reason || "No reason provided"}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                            Current Status
                                                        </label>
                                                        <span
                                                            className={`inline-flex px-4 py-1.5 rounded-full text-sm font-medium
                          ${selectedLeaveRequest.status === "approved"
                                                                    ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                                                                    : selectedLeaveRequest.status === "rejected"
                                                                        ? "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                                                                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300"
                                                                }`}
                                                        >
                                                            {selectedLeaveRequest.status?.toUpperCase()}
                                                        </span>
                                                    </div>

                                                    {/* Action Section - Only for pending requests */}
                                                    {selectedLeaveRequest.status === "pending" && (
                                                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                                            <label className="block text-base font-medium text-gray-800 dark:text-gray-200 mb-3">
                                                                Take Action
                                                            </label>

                                                            <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-5">
                                                                <label className="flex items-center cursor-pointer">
                                                                    <input
                                                                        type="radio"
                                                                        name="action"
                                                                        checked={isApproveChecked}
                                                                        onChange={() => handleActionChange("approve")}
                                                                        className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                                                    />
                                                                    <span className="ml-3 text-gray-900 dark:text-white font-medium">Approve</span>
                                                                </label>

                                                                <label className="flex items-center cursor-pointer">
                                                                    <input
                                                                        type="radio"
                                                                        name="action"
                                                                        checked={isRejectChecked}
                                                                        onChange={() => handleActionChange("reject")}
                                                                        className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                                                    />
                                                                    <span className="ml-3 text-gray-900 dark:text-white font-medium">Reject</span>
                                                                </label>
                                                            </div>

                                                            <div>
                                                                <label
                                                                    htmlFor="remark"
                                                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                                                >
                                                                    Remark / Comments
                                                                </label>
                                                                <textarea
                                                                    id="remark"
                                                                    rows={4}
                                                                    value={remark}
                                                                    onChange={(e) => setRemark(e.target.value)}
                                                                    placeholder="Add your remarks or reason for rejection..."
                                                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 
                              bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
                              px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                              outline-none transition-all"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                                                Loading leave request details...
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer */}
                                    <div
                                        className={`px-6 py-4 flex gap-2 justify-end border-t 
                ${isDark ? "border-darkBorder bg-darkInput" : "border-gray-200 bg-gray-50"}`}
                                    >
                                        <button
                                            type="button"
                                            onClick={handleCloseModal}
                                            className="px-6 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg 
                  font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                                        >
                                            Close
                                        </button>

                                        {selectedLeaveRequest?.status === "pending" && (
                                            <button
                                                type="button"
                                                onClick={handleSubmitAction}
                                                disabled={isSubmitting || (!isApproveChecked && !isRejectChecked)}
                                                className={`px-6 py-2.5 rounded-lg font-medium text-white transition-all
                    ${isSubmitting
                                                        ? "bg-gray-500 cursor-not-allowed"
                                                        : isApproveChecked
                                                            ? "bg-green-600 hover:bg-green-700"
                                                            : isRejectChecked
                                                                ? "bg-red-600 hover:bg-red-700"
                                                                : "bg-gray-400 cursor-not-allowed"
                                                    } disabled:opacity-60`}
                                            >
                                                {isSubmitting ? (
                                                    <span className="flex items-center">
                                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                                        </svg>
                                                        Processing...
                                                    </span>
                                                ) : (
                                                    "Submit Decision"
                                                )}
                                            </button>
                                        )}
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

export default LeaveRequest;