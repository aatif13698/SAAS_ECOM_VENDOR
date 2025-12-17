

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useDarkMode from "@/hooks/useDarkMode";
import businessUnitService from "@/services/businessUnit/businessUnit.service";
import FormLoader from "@/Common/formLoader/FormLoader";
import ProfileImage from "../../assets/images/users/user-4.jpg";
import DocImage from "../../assets/images/demo-doc.avif";
import { BiArrowBack, BiCross } from "react-icons/bi";
import { FaCross, FaRegEdit } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";
import CryptoJS from "crypto-js";
import employeeService from "@/services/employee/employee.service";
import Tooltip from "@/components/ui/Tooltip";
import { RxCross2 } from "react-icons/rx";

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

const ViewBusinessUnit = () => {
    const [isDark] = useDarkMode();
    const location = useLocation();
    const { id: encryptedId } = useParams();

    const id = location?.state?.id;
    const navigate = useNavigate();
    const [pageLoading, setPageLoading] = useState(true);
    const [businessData, setBusinessData] = useState({});
    const [tabValue, setTabValue] = useState(0);

    // branche state
    const [branches, setBranches] = useState([]);
    const [branchesLoading, setBranchesLoading] = useState(true);

    console.log("branches", branches);


    useEffect(() => {
        if (encryptedId) {
            const decryptedId = decryptId(encryptedId);
            getBusinessUnit(decryptedId)
        }
        async function getBusinessUnit(id) {
            try {
                setPageLoading(true);
                const response = await businessUnitService.getOne(id);
                setBusinessData(response?.data || {});
                setPageLoading(false);
            } catch (error) {
                setPageLoading(false);
                console.log("error in fetching business unit");
            }
        }
    }, [encryptedId]);


    useEffect(() => {
        if (businessData?._id) {
            getBranches(businessData?._id)
        }
        async function getBranches(id) {
            try {
                setBranchesLoading(true);
                const respone = await employeeService.getBranchByBusiness(id);
                console.log("respone bbb", respone);
                setBranches(respone?.data || []);
                setBranchesLoading(false);

            } catch (error) {
                setBranchesLoading(false);
                console.log("error while getting business branches", error);
            }
        }
    }, [businessData])

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
            <div className="sticky top-14 z-10 bg-white dark:bg-gray-800 p-4  flex justify-between items-center shadow-md">
                <div className="flex items-center gap-3 cursor-pointer hover:text-blue-500" onClick={() => navigate("/business-unit-list")}>
                    <BiArrowBack className="text-xl" />
                    <h2 className="text-xl font-semibold">{businessData.name || "Business Unit"}</h2>
                </div>
                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
                    <button title="Edit" className="hover:text-blue-500" onClick={() => navigate(`/edit-business-unit/${encryptId(id)}`, { state: { id, name: "edit" } })}>
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
                        Documents
                    </button>
                </div>

                {/* Tab Content */}
                {tabValue === 0 && <Overview data={businessData} isDark={isDark} branches={branches} branchesLoading={branchesLoading} setBranches={setBranches} />}
                {tabValue === 1 && <Documents data={businessData} isDark={isDark} />}
            </div>


        </div>
    );
};

const Overview = ({ data, isDark, branches, branchesLoading, setBranches }) => {
    const navigate = useNavigate();
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [branchTabValue, setBranchTabValue] = useState(0);

    const handleView = (row) => {
        setSelectedBranch(row);
        setBranchTabValue(0); // Default to Overview
    };

    const handleEdit = (row) => {
        navigate(`/edit-branch/${encryptId(row._id)}`, { state: { id: row._id, name: "edit" } });
    };

    return (
        <div className="md:p-6 p-2">
            {/* Profile Card */}
            <div className={`rounded-lg shadow-md border-green-700 border md:p-6 p-2 mb-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                <div className={`rounded-lg  p-6 mb-6 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="relative">
                            <img
                                src={data.icon || ProfileImage}
                                alt="Business Logo"
                                className="w-20 h-20 object-cover rounded-full shadow-md border-2 border-gray-200 dark:border-gray-700"
                            />
                            {/* <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div> */}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{data.name || "N/A"}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Business Unit</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
                        <div>
                            {/* <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Contact Email</p> */}
                            <p className="text-sm">{data.emailContact || "N/A"}</p>
                        </div>
                        <div>
                            {/* <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Contact Number</p> */}
                            <p className="text-sm">{data.contactNumber || "N/A"}</p>
                        </div>
                    </div>
                </div>


                <div className={` mt-4  ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                    <h3 className="text-lg font-semibold border-b-2 mb-4">Address Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">House/Flat</p>
                            <p className="text-sm">{data.houseOrFlat || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Street/Locality</p>
                            <p className="text-sm">{data.streetOrLocality || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Landmark</p>
                            <p className="text-sm">{data.landmark || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">City</p>
                            <p className="text-sm">{data.city || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">State</p>
                            <p className="text-sm">{data.state || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Country</p>
                            <p className="text-sm">{data.country || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Zip Code</p>
                            <p className="text-sm">{data.ZipCode || "N/A"}</p>
                        </div>
                        <div className="md:col-span-2">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Address</p>
                            <p className="text-sm">{data.address || "N/A"}</p>
                        </div>
                    </div>
                </div>
                {/* Branches */}

                <h3 className="text-lg font-semibold border-b-2 my-4">Branches</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {branchesLoading ? (
                        <div className="flex lg:col-span-3 md:col-span-2 col-span-1 justify-center items-center w-full">
                            <FormLoader />
                        </div>
                    ) : branches?.length > 0 ? (
                        branches.map((row) => (
                            <div onClick={() => handleView(row)} className={`p-6 rounded-lg shadow-md ${isDark ? 'bg-gray-800 text-white' : 'bg-blue-100/30 text-gray-900'} cursor-pointer ${selectedBranch?._id === row._id ? 'border-2 border-blue-500' : ''}`} key={row._id}>
                                <div className="flex items-center gap-4 mb-4">
                                    <img
                                        src={row.icon || ProfileImage}
                                        alt="branch logo"
                                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                                    />
                                    <div className="flex-1">
                                        <div>
                                            <h3 className="text-lg font-semibold">{row.name}</h3>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{row.city || "N/A"}</p>
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm  ${row.isActive ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'}`}
                                            >
                                                {row.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2 mb-4">
                                    <p className="text-sm"><span className="font-medium">Email:</span> {row.emailContact || "N/A"}</p>
                                    <p className="text-sm"><span className="font-medium">Phone:</span> {row.contactNumber || "N/A"}</p>
                                </div>
                                {/* <div className="flex justify-between items-center">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm  ${row.isActive ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'}`}
                                    >
                                        {row.isActive ? "Active" : "Inactive"}
                                    </span>
                                </div> */}
                            </div>
                        ))
                    ) : (
                        <div>No Branch Found</div>
                    )}
                </div>

                {/* Selected Branch Details */}
                {selectedBranch && (
                    <div className="mt-8 shadow-md border-blue-700 border rounded-lg pt-2">
                        {/* Branch Header */}
                        <div className="bg-white dark:bg-gray-800 p-4 flex justify-between items-center shadow-lg">
                            <div className="flex items-center gap-3 cursor-pointer hover:text-blue-500" onClick={() => setSelectedBranch(null)}>
                                <RxCross2 className="text-xl" />
                                <h2 className="text-xl font-semibold">{selectedBranch.name || "Branch"}</h2>
                            </div>
                            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
                                <button title="Edit" className="hover:text-blue-500" onClick={() => handleEdit(selectedBranch)}>
                                    <FaRegEdit className="text-xl" />
                                </button>
                                <button title="Settings" className="hover:text-blue-500">
                                    <IoIosSettings className="text-xl" />
                                </button>
                            </div>
                        </div>

                        {/* Branch Tabs */}
                        <div className="flex border-b bg-white border-gray-300 dark:border-gray-700 pt-4">
                            <button
                                className={`flex-1 py-2 text-center ${branchTabValue === 0 ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500 dark:text-gray-400'}`}
                                onClick={() => setBranchTabValue(0)}
                            >
                                Overview
                            </button>
                            <button
                                className={`flex-1 py-2 text-center ${branchTabValue === 1 ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500 dark:text-gray-400'}`}
                                onClick={() => setBranchTabValue(1)}
                            >
                                Documents
                            </button>
                        </div>

                        {/* Branch Tab Content */}
                        {branchTabValue === 0 && <BranchOverview data={selectedBranch} isDark={isDark} />}
                        {branchTabValue === 1 && <BranchDocuments data={selectedBranch} isDark={isDark} />}
                    </div>
                )}
            </div>



        </div>
    );
};

const BranchOverview = ({ data, isDark }) => {
    const navigate = useNavigate();
    const [warehouses, setWarehouses] = useState([]);
    const [warehousesLoading, setWarehousesLoading] = useState(false);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [warehouseTabValue, setWarehouseTabValue] = useState(0);

    console.log("warehouses", warehouses);

    useEffect(() => {
        if (data?._id) {
            getWarehouses(data._id);
        }
        async function getWarehouses(id) {
            try {
                setWarehousesLoading(true);
                const response = await employeeService.getWarehouseByBranch(id);
                setWarehouses(response?.data || []);
                setSelectedWarehouse(null)
                setWarehousesLoading(false);
            } catch (error) {
                setWarehousesLoading(false);
                console.log("error while gettig the warehouses", error);
            }
        }
    }, [data]);

    const handleWarehouseView = (row) => {
        setSelectedWarehouse(row);
        setWarehouseTabValue(0); // Default to Overview
    };

    const handleWarehouseEdit = (row) => {
        navigate(`/edit-warehouse/${encryptId(row._id)}`, { state: { id: row._id, name: "edit" } });
    };

    return (
        <div className="md:p-1 p-2">
            <div className={`rounded-lg  md:p-4 p-2 mb-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                <div className={`rounded-lg p-6 mb-6 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="relative">
                            <img
                                src={data.icon || ProfileImage}
                                alt="Branch Logo"
                                className="w-20 h-20 object-cover rounded-full shadow-md border-2 border-gray-200 dark:border-gray-700"
                            />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{data.name || "N/A"}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Branch</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
                        <div>
                            <p className="text-sm">{data.emailContact || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm">{data.contactNumber || "N/A"}</p>
                        </div>
                    </div>
                </div>

                <div className={`mt-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                    <h3 className="text-lg font-semibold border-b-2 mb-4">Address Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">House/Flat</p>
                            <p className="text-sm">{data.houseOrFlat || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Street/Locality</p>
                            <p className="text-sm">{data.streetOrLocality || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Landmark</p>
                            <p className="text-sm">{data.landmark || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">City</p>
                            <p className="text-sm">{data.city || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">State</p>
                            <p className="text-sm">{data.state || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Country</p>
                            <p className="text-sm">{data.country || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Zip Code</p>
                            <p className="text-sm">{data.ZipCode || "N/A"}</p>
                        </div>
                        <div className="md:col-span-2">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Address</p>
                            <p className="text-sm">{data.address || "N/A"}</p>
                        </div>
                    </div>
                </div>

                {/* Warehouses */}
                <h3 className="text-lg font-semibold border-b-2 my-4">Warehouses</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {warehousesLoading ? (
                        <div className="lg:col-span-3 md:col-span-2 col-span-1 flex justify-center items-center w-full">
                            <FormLoader />
                        </div>
                    ) : warehouses?.length > 0 ? (
                        warehouses.map((row) => (
                            <div onClick={() => handleWarehouseView(row)} className={`p-6 rounded-lg shadow-md ${isDark ? 'bg-gray-800 text-white' : 'bg-blue-100/30 text-gray-900'} cursor-pointer ${selectedWarehouse?._id === row._id ? 'border-2 border-red-500' : ''}`} key={row._id}>
                                <div className="flex items-center gap-4 mb-4">
                                    <img
                                        src={row.icon || ProfileImage}
                                        alt="warehouse logo"
                                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                                    />
                                    <div className="flex-1">
                                        <div>
                                            <h3 className="text-lg font-semibold">{row.name}</h3>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{row.city || "N/A"}</p>
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm  ${row.isActive ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'}`}
                                            >
                                                {row.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2 mb-4">
                                    <p className="text-sm"><span className="font-medium">Email:</span> {row.emailContact || "N/A"}</p>
                                    <p className="text-sm"><span className="font-medium">Phone:</span> {row.contactNumber || "N/A"}</p>
                                </div>
                                {/* <div className="flex justify-between items-center">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm  ${row.isActive ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'}`}
                                    >
                                        {row.isActive ? "Active" : "Inactive"}
                                    </span>
                                </div> */}
                            </div>
                        ))
                    ) : (
                        <div>No Warehouse Found</div>
                    )}
                </div>

                {/* Selected Warehouse Details */}
                {selectedWarehouse && (
                    <div className="mt-8 border-red-500 border rounded-lg pt-2 shadow-md">
                        {/* Warehouse Header */}
                        <div className="bg-white dark:bg-gray-800 p-4 flex justify-between items-center shadow-lg">
                            <div className="flex items-center gap-3 cursor-pointer hover:text-blue-500" onClick={() => setSelectedWarehouse(null)}>
                                <RxCross2 className="text-xl" />
                                <h2 className="text-xl font-semibold">{selectedWarehouse.name || "Warehouse"}</h2>
                            </div>
                            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
                                <button title="Edit" className="hover:text-blue-500" onClick={() => handleWarehouseEdit(selectedWarehouse)}>
                                    <FaRegEdit className="text-xl" />
                                </button>
                                <button title="Settings" className="hover:text-blue-500">
                                    <IoIosSettings className="text-xl" />
                                </button>
                            </div>
                        </div>

                        {/* Warehouse Tabs */}
                        <div className="flex border-b bg-white border-gray-300 dark:border-gray-700 pt-4">
                            <button
                                className={`flex-1 py-2 text-center ${warehouseTabValue === 0 ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500 dark:text-gray-400'}`}
                                onClick={() => setWarehouseTabValue(0)}
                            >
                                Overview
                            </button>
                            <button
                                className={`flex-1 py-2 text-center ${warehouseTabValue === 1 ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500 dark:text-gray-400'}`}
                                onClick={() => setWarehouseTabValue(1)}
                            >
                                Documents
                            </button>
                        </div>

                        {/* Warehouse Tab Content */}
                        {warehouseTabValue === 0 && <WarehouseOverview data={selectedWarehouse} isDark={isDark} />}
                        {warehouseTabValue === 1 && <WarehouseDocuments data={selectedWarehouse} isDark={isDark} />}
                    </div>
                )}
            </div>
        </div>
    );
};

const WarehouseOverview = ({ data, isDark }) => {
    return (
        <div className="md:p-6 p-2">
            <div className={`rounded-lg md:p-1 p-2 mb-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                <div className={`rounded-lg p-6 mb-6 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="relative">
                            <img
                                src={data.icon || ProfileImage}
                                alt="Warehouse Logo"
                                className="w-20 h-20 object-cover rounded-full shadow-md border-2 border-gray-200 dark:border-gray-700"
                            />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{data.name || "N/A"}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Warehouse</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
                        <div>
                            <p className="text-sm">{data.emailContact || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm">{data.contactNumber || "N/A"}</p>
                        </div>
                    </div>
                </div>

                <div className={`mt-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                    <h3 className="text-lg font-semibold border-b-2 mb-4">Address Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">House/Flat</p>
                            <p className="text-sm">{data.houseOrFlat || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Street/Locality</p>
                            <p className="text-sm">{data.streetOrLocality || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Landmark</p>
                            <p className="text-sm">{data.landmark || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">City</p>
                            <p className="text-sm">{data.city || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">State</p>
                            <p className="text-sm">{data.state || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Country</p>
                            <p className="text-sm">{data.country || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Zip Code</p>
                            <p className="text-sm">{data.ZipCode || "N/A"}</p>
                        </div>
                        <div className="md:col-span-2">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Address</p>
                            <p className="text-sm">{data.address || "N/A"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Documents = ({ data, isDark }) => {
    const documents = [
        { label: "PAN", number: data.panNumber, image: data.panDocument },
        { label: "TIN", number: data.tinNumber !== "nul" ? data.tinNumber : "N/A", image: data.tinDocument },
        { label: "CIN", number: data.cinNumber !== "null" ? data.cinNumber : "N/A", image: data.cinDocument },
        { label: "TAN", number: data.tanNumber !== "null" ? data.tanNumber : "N/A", image: data.tanDocument },
        { label: "Business License", number: data.businessLicenseNumber, image: data.businessLicenseDocument },
    ].filter(doc => doc.number); // Only show if number is present

    return (
        <div className="md:p-6 p-2">
            <h3 className="text-lg font-semibold mb-4">Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {documents.map((doc, index) => (
                    <div key={index} className={`rounded-lg shadow-md p-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                        <h4 className="text-sm font-medium mb-2">{doc.label} Number: {doc.number}</h4>
                        <img
                            src={doc.image || DocImage}
                            alt={`${doc.label} Document`}
                            className="w-full rounded-md"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

const BranchDocuments = ({ data, isDark }) => {
    const documents = [
        { label: "PAN", number: data.panNumber, image: data.panDocument },
        { label: "TIN", number: data.tinNumber !== "nul" ? data.tinNumber : "N/A", image: data.tinDocument },
        { label: "CIN", number: data.cinNumber !== "null" ? data.cinNumber : "N/A", image: data.cinDocument },
        { label: "TAN", number: data.tanNumber !== "null" ? data.tanNumber : "N/A", image: data.tanDocument },
        { label: "Business License", number: data.businessLicenseNumber, image: data.businessLicenseDocument },
    ].filter(doc => doc.number); // Only show if number is present

    return (
        <div className="md:p-6 p-2">
            <h3 className="text-lg font-semibold mb-4">Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {documents.map((doc, index) => (
                    <div key={index} className={`rounded-lg shadow-md p-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                        <h4 className="text-sm font-medium mb-2">{doc.label} Number: {doc.number}</h4>
                        <img
                            src={doc.image || DocImage}
                            alt={`${doc.label} Document`}
                            className="w-full rounded-md"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

const WarehouseDocuments = ({ data, isDark }) => {
    const documents = [
        { label: "PAN", number: data.panNumber, image: data.panDocument },
        { label: "TIN", number: data.tinNumber !== "nul" ? data.tinNumber : "N/A", image: data.tinDocument },
        { label: "CIN", number: data.cinNumber !== "null" ? data.cinNumber : "N/A", image: data.cinDocument },
        { label: "TAN", number: data.tanNumber !== "null" ? data.tanNumber : "N/A", image: data.tanDocument },
        { label: "Business License", number: data.businessLicenseNumber, image: data.businessLicenseDocument },
    ].filter(doc => doc.number); // Only show if number is present

    return (
        <div className="md:p-6 p-2">
            <h3 className="text-lg font-semibold mb-4">Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {documents.map((doc, index) => (
                    <div key={index} className={`rounded-lg shadow-md p-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                        <h4 className="text-sm font-medium mb-2">{doc.label} Number: {doc.number}</h4>
                        <img
                            src={doc.image || DocImage}
                            alt={`${doc.label} Document`}
                            className="w-full rounded-md"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ViewBusinessUnit;