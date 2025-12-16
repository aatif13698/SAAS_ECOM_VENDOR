import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useDarkMode from "@/hooks/useDarkMode";
import assetService from "@/services/asset/asset.service";
import FormLoader from "@/Common/formLoader/FormLoader";
import ProfileImage from "../../assets/images/asset.jpg"; // Reuse or replace with asset default if needed
import { BiArrowBack } from "react-icons/bi";
import { FaRegEdit } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";

const ViewAssetAndTool = () => {
    const [isDark] = useDarkMode();
    const location = useLocation();
    const id = location?.state?.id;
    const navigate = useNavigate();
    const [pageLoading, setPageLoading] = useState(true);
    const [assetData, setAssetData] = useState({});
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        async function getAsset() {
            try {
                setPageLoading(true);
                const response = await assetService.getOne(id); // Assuming getOne method exists in assetService
                setAssetData(response?.data || {});
                setPageLoading(false);
            } catch (error) {
                setPageLoading(false);
                console.log("error in fetching asset");
            }
        }
        getAsset();
    }, [id]);

    if (pageLoading) {
        return (
            <div className="flex justify-center items-center h-screen flex-col">
                <div className="flex flex-col justify-center mt-5 items-center gap-2">
                    <FormLoader />
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen pb-8 relative ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
            {/* Sticky Header */}
            <div className="sticky top-14 z-10 bg-white dark:bg-gray-800 p-4 flex justify-between items-center shadow-md">
                <div className="flex items-center gap-3 cursor-pointer hover:text-blue-500" onClick={() => navigate("/assets-&-tools-list")}>
                    <BiArrowBack className="text-xl" />
                    <h2 className="text-xl font-semibold">{assetData.assetName || "Asset/Tool"}</h2>
                </div>
                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
                    <button title="Edit" className="hover:text-blue-500" onClick={() => navigate("/edit-asset", { state: { id, name: "edit" } })}>
                        <FaRegEdit className="text-xl" />
                    </button>
                    <button title="Settings" className="hover:text-blue-500">
                        <IoIosSettings className="text-xl" />
                    </button>
                </div>
            </div>

            <div className="bg-gray-200">
                {/* Tabs */}
                <div className="flex border-b bg-white border-gray-300 dark:border-gray-700 pt-4">
                    <button
                        className={`flex-1 py-2 text-center ${tabValue === 0 ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500 dark:text-gray-400'}`}
                        onClick={() => setTabValue(0)}
                    >
                        Overview
                    </button>
                    <button
                        className={`flex-1 py-2 text-center ${tabValue === 1 ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500 dark:text-gray-400'}`}
                        onClick={() => setTabValue(1)}
                    >
                        Assigned To
                    </button>
                    <button
                        className={`flex-1 py-2 text-center ${tabValue === 2 ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500 dark:text-gray-400'}`}
                        onClick={() => setTabValue(2)}
                    >
                        Track Logs
                    </button>
                </div>

                {/* Tab Content */}
                {tabValue === 0 && <Overview data={assetData} isDark={isDark} />}
                {tabValue === 1 && <AssignedTo data={assetData} isDark={isDark} />}
                {tabValue === 2 && <TrackLogs data={assetData} isDark={isDark} />}
            </div>
        </div>
    );
};

const Overview = ({ data, isDark }) => {
    const getLevel = (data) => {
        if (data.isVendorLevel) return "Vendor";
        if (data.isBuLevel) return "Business";
        if (data.isBranchLevel) return "Branch";
        if (data.isWarehouseLevel) return "Warehouse";
        return "N/A";
    };

    return (
        <div className="md:p-6 p-2">
            {/* Asset Card */}
            <div className={`rounded-lg shadow-md md:p-6 p-2 mb-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                <div className={`rounded-lg p-6 mb-6 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="relative">
                            <img
                                src={data.icon || ProfileImage} // Use asset icon if available, else default
                                alt="Asset Icon"
                                className="w-20 h-20 object-cover rounded-full shadow-md border-2 border-gray-200 dark:border-gray-700"
                            />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{data.assetName || "N/A"}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Asset/Tool</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Serial Number</p>
                            <p className="text-sm">{data.serialNumber || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Model</p>
                            <p className="text-sm">{data.model || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</p>
                            <p className="text-sm">{data.status || "N/A"}</p>
                        </div>
                    </div>
                </div>

                <div className={`mt-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                    <h3 className="text-lg font-semibold border-b-2 mb-4">Asset Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Level</p>
                            <p className="text-sm">{getLevel(data)}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Business Unit</p>
                            <p className="text-sm">{data.businessUnit?.name || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Branch</p>
                            <p className="text-sm">{data.branch?.name || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Warehouse</p>
                            <p className="text-sm">{data.warehouse?.name || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Purchase Date</p>
                            <p className="text-sm">{data.purchaseDate ? new Date(data.purchaseDate).toLocaleDateString() : "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Purchase Cost</p>
                            <p className="text-sm">{data.purchaseCost ? `$${data.purchaseCost}` : "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Value</p>
                            <p className="text-sm">{data.currentValue ? `$${data.currentValue}` : "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Useful Life</p>
                            <p className="text-sm">{data.usefulLife ? `${data.usefulLife} months` : "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Condition</p>
                            <p className="text-sm">{data.condition || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Warranty End Date</p>
                            <p className="text-sm">{data.warrantyEndDate ? new Date(data.warrantyEndDate).toLocaleDateString() : "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Disposal Date</p>
                            <p className="text-sm">{data.disposalDate ? new Date(data.disposalDate).toLocaleDateString() : "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Disposal Reason</p>
                            <p className="text-sm">{data.disposalReason || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Expiration Date</p>
                            <p className="text-sm">{data.expirationDate ? new Date(data.expirationDate).toLocaleDateString() : "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Active</p>
                            <p className="text-sm">{data.isActive ? "Yes" : "No"}</p>
                        </div>
                        <div className="md:col-span-3">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes</p>
                            <p className="text-sm">{data.notes || "N/A"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AssignedTo = ({ data, isDark }) => {
    const assignedTo = data.assignedTo; // Assuming data has assignedTo field
    return (
        <div className="md:p-6 p-2">
            <h3 className="text-lg font-semibold mb-4">Assigned To</h3>
            <div className={`rounded-lg shadow-md p-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                {assignedTo ? (
                    <div className="flex items-start space-x-4">
                        <img
                            src={assignedTo.profileImage || ProfileImage}
                            alt={`${assignedTo.firstName} ${assignedTo.lastName || ''}`}
                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-300 dark:border-gray-700"
                        />
                        <div className="flex-1">
                            <p className="text-base font-medium text-gray-900 dark:text-white">
                                Name: {assignedTo.firstName} {assignedTo.lastName || ''}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Email: {assignedTo.email || "N/A"}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Phone: {assignedTo.phone || "N/A"}
                            </p>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-400">Not assigned to any employee.</p>
                )}
            </div>
        </div>
    );
};

const TrackLogs = ({ data, isDark }) => {
    const logs = [...(data.auditLogs || [])].sort((a, b) => new Date(b.logDate) - new Date(a.logDate));
    return (
        <div className="md:p-6 p-2">
            <h3 className="text-lg font-semibold mb-4">Track Logs</h3>
            <div className={`rounded-lg shadow-md p-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                {logs.length > 0 ? (
                    <div className="relative border-l border-gray-200 dark:border-gray-700">
                        {logs.map((log, index) => (
                            <div key={index} className="mb-10 ml-6">
                                <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-200 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                                    <svg className="w-3 h-3 text-blue-600 dark:text-blue-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path></svg>
                                </span>
                                <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600">
                                    <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">{new Date(log.logDate).toLocaleString()}</time>
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{log.action || "Action"}</h4>
                                    <p className="mb-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                                        Status: {log.status || "N/A"} {log.defectInterval ? ` (Defect Interval: ${log.defectInterval} days)` : ""}
                                    </p>
                                    <p className="mb-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                                        Notes: {log.notes || "N/A"}
                                    </p>
                                    {log.user && (
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={log.user.profileImage || ProfileImage}
                                                alt={`${log.user.firstName} ${log.user.lastName || ''}`}
                                                className="w-8 h-8 rounded-full"
                                            />
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                By: {log.user.firstName} {log.user.lastName || ''} ({log.user.email})
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-400">No track logs available.</p>
                )}
            </div>
        </div>
    );
};

export default ViewAssetAndTool;