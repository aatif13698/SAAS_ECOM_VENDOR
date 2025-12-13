import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useDarkMode from "@/hooks/useDarkMode";
import businessUnitService from "@/services/businessUnit/businessUnit.service";
import FormLoader from "@/Common/formLoader/FormLoader";
import ProfileImage from "../../assets/images/users/user-4.jpg";
import DocImage from "../../assets/images/demo-doc.avif";
import { BiArrowBack } from "react-icons/bi";
import { FaRegEdit } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";

const ViewBusinessUnit = () => {
    const [isDark] = useDarkMode();
    const location = useLocation();
    const id = location?.state?.id;
    const navigate = useNavigate();
    const [pageLoading, setPageLoading] = useState(true);
    const [businessData, setBusinessData] = useState({});
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        async function getBusinessUnit() {
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
        getBusinessUnit();
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
            <div className="sticky top-14 z-10 bg-white dark:bg-gray-800 p-4  flex justify-between items-center shadow-md">
                <div className="flex items-center gap-3 cursor-pointer hover:text-blue-500" onClick={() => navigate("/business-unit-list")}>
                    <BiArrowBack className="text-xl" />
                    <h2 className="text-xl font-semibold">{businessData.name || "Business Unit"}</h2>
                </div>
                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
                    <button title="Edit" className="hover:text-blue-500" onClick={() => navigate("/edit-business-unit", { state: { id, name: "edit" } })}>
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
                {tabValue === 0 && <Overview data={businessData} isDark={isDark} />}
                {tabValue === 1 && <Documents data={businessData} isDark={isDark} />}
            </div>


        </div>
    );
};

const Overview = ({ data, isDark }) => {
    return (
        <div className="md:p-6 p-2">
            {/* Profile Card */}
            <div className={`rounded-lg shadow-md md:p-6 p-2 mb-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
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
            </div>

            {/* Address Details */}

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

export default ViewBusinessUnit;