import useDarkmode from '@/hooks/useDarkMode';
import React, { useEffect, useState } from 'react'
import ProfileImage from "../../assets/images/asset.jpg"; // Reuse or replace with asset default if needed
import assetService from '@/services/asset/asset.service';
import { useSelector } from 'react-redux';


function Assets() {
    const [isDark] = useDarkmode();
    const { profileData: profile } = useSelector((state) => state.profile);


    console.log("profile", profile);




    const [assignedAssets, setAssignedAssets] = useState([]);


    useEffect(() => {

        getAssignedAssets();

    }, []);


    async function getAssignedAssets() {

        try {

            const response = await assetService.getAssetsOfEmployee(profile?._id);

            setAssignedAssets(response?.data)

        } catch (error) {
            console.log("error", error);

        }

    }

    return (
        <>

            <div className='min-h-screen bg-gray-50 p-4 rounded-lg'>

                <h4 className='text-lg py-3'>Assigned assets</h4>
                {
                    assignedAssets && assignedAssets?.length > 0 ? assignedAssets?.map((asset) => {

                        console.log("asset", asset);


                        return (
                            <Overview data={asset?.assetId} isDark={isDark} />
                        )
                    }) : ""
                }

            </div>




        </>
    )
}




const Overview = ({ data, isDark }) => {
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
            </div>
        </div>
    );
};

export default Assets