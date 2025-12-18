import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useDarkMode from "@/hooks/useDarkMode";
import warehouseService from "@/services/warehouse/warehouse.service";
import FormLoader from "@/Common/formLoader/FormLoader";
import ProfileImage from "../../assets/images/users/user-4.jpg";
import DocImage from "../../assets/images/demo-doc.avif";
import { BiArrowBack } from "react-icons/bi";
import { FaRegEdit } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";
import CryptoJS from "crypto-js";

// Secret key for decryption (same as used for encryption)
const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY || "my-secret-key";

const encryptId = (id) => {
    const encrypted = CryptoJS.AES.encrypt(id.toString(), SECRET_KEY).toString();
    // URL-safe encoding
    return encodeURIComponent(encrypted);
};

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

const ViewWarehouse = () => {
    const [isDark] = useDarkMode();
    const location = useLocation();
    const { id: encryptedId } = useParams();
    const id = location?.state?.id;
    const navigate = useNavigate();
    const [pageLoading, setPageLoading] = useState(true);
    const [warehouseData, setWarehouseData] = useState({});

    useEffect(() => {
        if (encryptedId) {
            const decryptedId = decryptId(encryptedId);
            getWarehouse(decryptedId);
        }
        async function getWarehouse(id) {
            try {
                setPageLoading(true);
                const response = await warehouseService.getOne(id);
                setWarehouseData(response?.data || {});
                setPageLoading(false);
            } catch (error) {
                setPageLoading(false);
                console.log("error in fetching warehouse");
            }
        }
    }, [encryptedId]);

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
                <div className="flex items-center gap-3 cursor-pointer hover:text-blue-500" onClick={() => navigate("/warehouse-list")}>
                    <BiArrowBack className="text-xl" />
                    <h2 className="text-xl font-semibold">{warehouseData.name || "Warehouse"}</h2>
                </div>
                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
                    <button title="Edit" className="hover:text-blue-500" onClick={() => navigate(`/edit-warehouse/${encryptId(id)}`, { state: { id, name: "edit" } })}>
                        <FaRegEdit className="text-xl" />
                    </button>
                    <button title="Settings" className="hover:text-blue-500">
                        <IoIosSettings className="text-xl" />
                    </button>
                </div>
            </div>

            {/* Content (Only Overview since no nested elements) */}
            <div className="bg-gray-200">
                <h3 className="text-lg font-semibold  p-4">Overview</h3>
                <div className="bg-white p-4">
                    <div className={`rounded-lg p-6 mb-6 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                        <div className="flex items-center mb-4">
                            {/* <div className="relative">
                            <img
                                src={warehouseData.icon || ProfileImage}
                                alt="Warehouse Logo"
                                className="w-20 h-20 object-cover rounded-full shadow-md border-2 border-gray-200 dark:border-gray-700"
                            />
                            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                        </div> */}
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{warehouseData.name || "N/A"}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Warehouse</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
                            <div>
                                <p className="text-sm">{warehouseData.emailContact || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm">{warehouseData.contactNumber || "N/A"}</p>
                            </div>
                        </div>

                    </div>
                    {/* Address Details */}
                    <div className={` mt-4 p-4 rounded-lg  ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                        <h3 className="text-lg font-semibold border-b-2 mb-4">Address Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">House/Flat</p>
                                <p className="text-sm">{warehouseData.houseOrFlat || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Street/Locality</p>
                                <p className="text-sm">{warehouseData.streetOrLocality || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Landmark</p>
                                <p className="text-sm">{warehouseData.landmark || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">City</p>
                                <p className="text-sm">{warehouseData.city || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">State</p>
                                <p className="text-sm">{warehouseData.state || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Country</p>
                                <p className="text-sm">{warehouseData.country || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Zip Code</p>
                                <p className="text-sm">{warehouseData.ZipCode || "N/A"}</p>
                            </div>
                            <div className="md:col-span-2">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Address</p>
                                <p className="text-sm">{warehouseData.address || "N/A"}</p>
                            </div>
                        </div>
                    </div>

                </div>


            </div>
        </div>
    );
};

export default ViewWarehouse;