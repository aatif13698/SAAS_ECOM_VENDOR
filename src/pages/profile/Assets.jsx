import useDarkmode from '@/hooks/useDarkMode';
import React, { useEffect, Fragment, useState } from 'react';
import ProfileImage from "../../assets/images/asset.jpg"; // Reuse or replace with asset default if needed
import assetService from '@/services/asset/asset.service';
import { useSelector } from 'react-redux';
import { Dialog, Transition } from "@headlessui/react";
import Icon from "@/components/ui/Icon";
import toast from 'react-hot-toast';

function Assets({ noFade }) {
    const [isDark] = useDarkmode();
    const { profileData: profile } = useSelector((state) => state.profile);

    const [assignedAssets, setAssignedAssets] = useState([]);
    const [requests, setRequests] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentAssetId, setCurrentAssetId] = useState(null);
    const [formData, setFormData] = useState({
        requestType: 'exchange',
        reason: '',
        notes: '',
    });
    console.log("currentAssetId", currentAssetId);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        getAssignedAssets();
        getAssetRequests();
    }, []);

    async function getAssignedAssets() {
        try {
            const response = await assetService.getAssetsOfEmployee(profile?._id);
            setAssignedAssets(response?.data);
        } catch (error) {
            console.log("error", error);
        }
    }

     async function getAssetRequests() {
        try {
            const response = await assetService.getListAssetRequest(profile?._id);
            setRequests(response?.data);
        } catch (error) {
            console.log("error", error);
        }
    }

    const handleOpenModal = (asset) => {
        setCurrentAssetId(asset);
        setFormData({
            requestType: 'exchange',
            reason: '',
            notes: '',
        });
        setError(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentAssetId(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentAssetId || !profile?._id) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const clientId = localStorage.getItem("saas_client_clientId");

            const requestPayload = {
                clientId: clientId,
                assetId: currentAssetId?._id,
                employeeId: profile._id,
                requestType: formData.requestType,
                reason: formData.reason,
                notes: formData.notes,
            };
            await assetService.createAssetRequest(requestPayload); // Assuming this method exists in assetService
            handleCloseModal();
            toast.success("Request submitted successfully.")
            // Optionally refresh assigned assets if needed
            // await getAssignedAssets();
        } catch (err) {
            setError('Failed to submit request. Please try again.');
            console.error('Request submission error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className='min-h-screen bg-gray-50 p-4 rounded-lg'>
                <h4 className='text-lg py-3'>Assigned assets</h4>
                {assignedAssets && assignedAssets?.length > 0 ? (
                    assignedAssets.map((asset) => (
                        <Overview
                            key={asset?.assetId?._id}
                            data={asset?.assetId}
                            isDark={isDark}
                            onMakeRequest={() => handleOpenModal(asset?.assetId)}
                        />
                    ))
                ) : (
                    <p>No assigned assets found.</p>
                )}

                {
                    <>

                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-200">
                                <h2 className="text-lg font-medium text-gray-900">Asset Requests</h2>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Asset
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Type
                                            </th>
                                           
                                            <th
                                                scope="col"
                                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {requests && requests.map((req) => (
                                            <tr key={req._id} className="hover:bg-gray-50">
                                                 <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {req?.assetId?.assetName}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {req?.requestType}
                                                </td>
                                               
                                               
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    {req?.status.toUpperCase()} 
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {requests.length === 0 && (
                                <div className="py-12 text-center text-gray-500">No requests found</div>
                            )}
                        </div>

                    </>
                }
            </div>


            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-[99999]"
                    onClose={handleCloseModal}
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
                                            Make Asset Request
                                        </h2>
                                        <button onClick={handleCloseModal} className=" text-lightmodalCrosscolor hover:text-lightmodalbtnText text-[22px]">
                                            <Icon icon="heroicons-outline:x" />
                                        </button>
                                    </div>
                                    {error && <p className="text-red-500 mb-4">{error}</p>}
                                    <form
                                        className='flex flex-col p-4'
                                    // onSubmit={handleSubmit}
                                    >
                                        <div className='mb-4'>
                                            <label htmlFor=""> Asset Name: <span className='font-bold'>{currentAssetId?.assetName}</span> </label>
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="requestType" className="block text-sm font-medium mb-1">
                                                Request Type
                                            </label>
                                            <select
                                                id="requestType"
                                                name="requestType"
                                                value={formData.requestType}
                                                onChange={handleInputChange}
                                                className={`w-full p-2 border rounded-md ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                                                required
                                            >
                                                <option value="exchange">Exchange</option>
                                                <option value="repair">Repair</option>
                                                <option value="return">Return</option>
                                            </select>
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="reason" className="block text-sm font-medium mb-1">
                                                Reason
                                            </label>
                                            <textarea
                                                id="reason"
                                                name="reason"
                                                value={formData.reason}
                                                onChange={handleInputChange}
                                                className={`w-full p-2 border rounded-md ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                                                rows="3"
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="notes" className="block text-sm font-medium mb-1">
                                                Notes
                                            </label>
                                            <textarea
                                                id="notes"
                                                name="notes"
                                                value={formData.notes}
                                                onChange={handleInputChange}
                                                className={`w-full p-2 border rounded-md ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                                                rows="3"
                                            />
                                        </div>

                                    </form>

                                    {(
                                        <div className="px-4 py-3 flex justify-end space-x-3 border-t border-slate-100 dark:border-darkSecondary  bg-white dark:bg-darkInput ">
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={handleCloseModal}
                                                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                                                    disabled={isSubmitting}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleSubmit}
                                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
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

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className={`rounded-lg shadow-lg p-6 w-full max-w-md ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>

                    </div>
                </div>
            )}
        </>
    );
}

const Overview = ({ data, isDark, onMakeRequest }) => {
    const getLevel = (data) => {
        if (data.isVendorLevel) return "Vendor";
        if (data.isBuLevel) return "Business";
        if (data.isBranchLevel) return "Branch";
        if (data.isWarehouseLevel) return "Warehouse";
        return "N/A";
    };

    return (
        <div className="">
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
                    <div className="grid text-left grid-cols-1 md:grid-cols-3 gap-4">
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

                <div className={`mt-4 ${isDark ? 'bg-gray-800' : 'bg-white'} text-left`}>
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

                {/* Make Request Button */}
                <div className="mt-4 text-right">
                    <button
                        onClick={onMakeRequest}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                        Make Request
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Assets;