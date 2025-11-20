import { Card } from "@mui/material";
import React, { useState, Fragment, useEffect } from "react";
import { Country, State, City } from "country-state-city";
import toast from "react-hot-toast";
import useDarkMode from "@/hooks/useDarkMode";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import "../../assets/scss/common.scss"

import { useSelector } from "react-redux";
import ProfileImage from "../../assets/images/users/user-4.jpg"
import TradingLicense from "../../assets/images/tradingLicense.png"
import vendorService from "@/services/vendor/vendor.service";
import Fileinput from "@/components/ui/Fileinput";
import { Dialog, Transition } from "@headlessui/react";
import FormLoader from "@/Common/formLoader/FormLoader";
import warehouseService from "@/services/warehouse/warehouse.service";
import employeeService from "@/services/employee/employee.service";
import supplierService from "@/services/supplier/supplier.service";





const CreateSupplierTransport = ({ noFade, scrollContent }) => {

    const { user: currentUser, isAuth: isAuthenticated } = useSelector((state) => state.auth);
    const [levelList, setLevelList] = useState([
        {
            name: "Vendor",
            value: "vendor"
        },
        {
            name: "Business",
            value: "business"
        },
        {
            name: "Branch",
            value: "branch"
        },
        {
            name: "Warehouse",
            value: "warehouse"
        },
    ])


    const [isDark] = useDarkMode();
    const dispatch = useDispatch();
    const location = useLocation();
    const row = location?.state?.row;
    const id = location?.state?.id;

    const [pageLoading, setPageLoading] = useState(true);
    const [activeSuppliers, setActiveSuppliers] = useState([])
    const [formData, setFormData] = useState({
        supplierId: "",
        transporterName: "",
        transporterGstin: "",
        transporterPan: "",
        transporterAddress: "",
        country: "",
        state: "",
        city: "",
        transporterContactPerson: "",
        transporterPhone: "",
        transporterEmail: "",
        transporterId: ""
    });

    console.log("formData", formData);


    useEffect(() => {
        if (currentUser && isAuthenticated) {
            if (currentUser.isVendorLevel) {
                setLevelList([
                    {
                        name: "Vendor",
                        value: "vendor"
                    },
                    {
                        name: "Business",
                        value: "business"
                    },
                    {
                        name: "Branch",
                        value: "branch"
                    },
                    {
                        name: "Warehouse",
                        value: "warehouse"
                    },
                ])
            } else if (currentUser.isBuLevel) {
                setLevelList([
                    {
                        name: "Business",
                        value: "business"
                    },
                    {
                        name: "Branch",
                        value: "branch"
                    },
                    {
                        name: "Warehouse",
                        value: "warehouse"
                    },
                ]);
                setFormData((prev) => ({ ...prev, businessUnit: currentUser.businessUnit }))
            } else if (currentUser.isBranchLevel) {
                setLevelList([
                    {
                        name: "Branch",
                        value: "branch"
                    },
                    {
                        name: "Warehouse",
                        value: "warehouse"
                    },
                ]);
                setFormData((prev) => ({ ...prev, businessUnit: currentUser.businessUnit, branch: currentUser.branch }))
            } else if (currentUser.isWarehouseLevel) {
                setLevelList([
                    {
                        name: "Warehouse",
                        value: "warehouse"
                    },
                ])
                setFormData((prev) => ({ ...prev, businessUnit: currentUser.businessUnit, branch: currentUser.branch, warehouse: currentUser.warehouse }))
            }

        } else {

        }

    }, [currentUser])




    const [formDataErr, setFormDataErr] = useState({
        transporterName: "",
        transporterGstin: "",
        transporterPan: "",
        transporterAddress: "",
        country: "",
        state: "",
        city: "",
        transporterContactPerson: "",
        transporterPhone: "",
        transporterEmail: "",
        transporterId: ""
    });

    const {
        transporterId,
        transporterName,
        transporterGstin,
        transporterPan,
        transporterAddress,
        country,
        state,
        city,
        transporterContactPerson,
        transporterPhone,
        transporterEmail,
    } = formData;


    const [countryData, setCountryData] = useState({
        countryList: "",
        countryName: "",
        countryISOCode: "",
        CountryISDCode: "",
        stateList: "",
        stateName: "",
        stateISOCode: "",
        cityList: "",
        cityName: "",
    });
    const {
        countryList,
        countryName,
        countryISOCode,
        CountryISDCode,
        stateList,
        stateName,
        stateISOCode,
        cityList,
        cityName,
    } = countryData;

    const [isViewed, setIsViewed] = useState(false);
    const [showAddButton, setShowAddButton] = useState(true);
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate();

    //------- Handling the VAlidation ------
    function validationFunction() {
        let errorCount = 0;

        if (!transporterContactPerson) {
            setFormDataErr((prev) => ({
                ...prev,
                transporterContactPerson: "Contact Person Is Required.",
            }));
            errorCount++
        } else {
            setFormDataErr((prev) => ({
                ...prev,
                transporterContactPerson: "",
            }));
        }

        if (!transporterId) {
            setFormDataErr((prev) => ({
                ...prev,
                transporterId: "Transporter Id Is Required.",
            }));
            errorCount++
        } else {
            setFormDataErr((prev) => ({
                ...prev,
                transporterId: "",
            }));
        }


        if (!transporterName) {
            setFormDataErr((prev) => ({
                ...prev,
                transporterName: "Transporter Name Is Required.",
            }));
            errorCount++
        } else {
            setFormDataErr((prev) => ({
                ...prev,
                transporterName: "",
            }));
        }

        if (!transporterGstin) {
            setFormDataErr((prev) => ({
                ...prev,
                transporterGstin: "Gstin Is Required.",
            }));
            errorCount++
        } else {
            setFormDataErr((prev) => ({
                ...prev,
                transporterGstin: "",
            }));
        }

        if (!transporterPan) {
            setFormDataErr((prev) => ({
                ...prev,
                transporterPan: "PAN Is Required.",
            }));
            errorCount++
        } else {
            setFormDataErr((prev) => ({
                ...prev,
                transporterPan: "",
            }));
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!transporterEmail) {
            setFormDataErr((prev) => ({
                ...prev,
                transporterEmail: "Email is Required"
            }))
            errorCount++
        } else if (!emailRegex.test(transporterEmail)) {
            setFormDataErr((prev) => ({
                ...prev,
                transporterEmail: "Enter valid Email "
            }))
            errorCount++
        } else {
            setFormDataErr((prev) => ({
                ...prev,
                transporterEmail: ""
            }))
        }


        const phoneRegex = /^[0-9]{10}$/;
        if (!transporterPhone) {
            setFormDataErr((prev) => ({
                ...prev,
                transporterPhone: "Phone Number Is Required.",
            }));
            errorCount++
        } else {
            if (!phoneRegex.test(transporterPhone) || transporterPhone.length === 0) {
                setFormDataErr((prev) => ({ ...prev, transporterPhone: "Enter a valid phone number." }));
            } else {
                setFormDataErr((prev) => ({ ...prev, transporterPhone: "" }));
            }
        }


        if (!countryData?.countryName) {
            setFormDataErr((prev) => ({
                ...prev,
                country: "Country is Required"
            }))
            errorCount++
        } else {
            setFormDataErr((prev) => ({
                ...prev,
                country: ""
            }))
        }
        if (!countryData?.stateName) {
            setFormDataErr((prev) => ({
                ...prev,
                state: "State is Required"
            }))
            errorCount++
        } else {
            setFormDataErr((prev) => ({
                ...prev,
                state: ""
            }))
        }
        if (!countryData?.cityName) {
            setFormDataErr((prev) => ({
                ...prev,
                city: "City is Required"
            }))
            errorCount++
        } else {
            setFormDataErr((prev) => ({
                ...prev,
                city: ""
            }))
        }

        if (!transporterAddress) {
            setFormDataErr((prev) => ({
                ...prev,
                transporterAddress: "Address Is Required.",
            }));
            errorCount++
        } else {
            setFormDataErr((prev) => ({
                ...prev,
                transporterAddress: "",
            }));
        }

        if (errorCount > 0) {
            return false
        } else {
            return true
        }
    }

    const handleCountry = (e) => {
        const { name, value } = e.target;
        const selectedCountry = countryList.find(
            (country) => country?.name === value
        );
        if (name == "country") {
            if (value == "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    country: "Country is required",
                }));
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    country: "",
                }));
            }
        }
        if (selectedCountry) {
            setCountryData((prev) => ({
                ...prev,
                countryName: selectedCountry?.name,
                countryISOCode: selectedCountry?.isoCode,
                CountryISDCode: selectedCountry?.contactNumbercode,
            }));
            setFormData((prev) => ({
                ...prev,
                country: selectedCountry?.name
            }))
        }
    };

    // ----- Handling the state name as per the country name
    const handleState = (e) => {
        const { name, value } = e.target;
        const selectedState = stateList.find((state) => state?.name === value);
        if (name === "state") {
            if (value === "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    state: "State is required",
                }));
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    state: "",
                }));
            }
        }
        if (selectedState) {
            setCountryData((prev) => ({
                ...prev,
                stateName: selectedState?.name,
                stateISOCode: selectedState?.isoCode,
            }));
            setFormData((prev) => ({
                ...prev,
                state: selectedState?.name
            }))
        }
    };

    // ----- Handling the city name as per the state name
    const handleCity = (e) => {
        const { name, value } = e.target;
        if (name === "city") {
            if (value === "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    city: "City is required",
                }));
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    city: "",
                }));
            }
        }
        setCountryData((prev) => ({
            ...prev,
            cityName: value,
        }));
        setFormData((prev) => ({
            ...prev,
            city: value
        }))
    };

    //------ mounting the all country data -------
    useEffect(() => {
        setCountryData((prev) => ({
            ...prev,
            countryList: Country.getAllCountries(),
        }));
    }, []);

    //------ mounting the all state data as per the country name -------
    useEffect(() => {
        setCountryData((prev) => ({
            ...prev,
            stateList: State.getStatesOfCountry(countryISOCode),
        }));
    }, [isViewed, countryISOCode, id]);
    //------ mounting the all city data as per the state name -------
    useEffect(() => {
        setCountryData((prev) => ({
            ...prev,
            cityList: City.getCitiesOfState(countryISOCode, stateISOCode),
        }));
    }, [isViewed, countryISOCode, stateISOCode]);
    // ------ HAndling the change in the form ---

    const handleChange = (e) => {
        const { name, value } = e.target;


        if (name === "transporterName") {
            if (value === "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    transporterName: "Transporter Name Is Required.",
                }));
            } else if (value?.length <= 3) {
                setFormDataErr((prev) => ({
                    ...prev,
                    transporterName: "Minimum 3 characters required.",
                }));
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    transporterName: "",
                }));
            }
        }


        if (name === "transporterGstin") {
            if (value === "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    transporterGstin: "Gstin Is Required.",
                }));
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    transporterGstin: "",
                }));
            }
        }

        if (name === "transporterPan") {
            if (value === "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    transporterPan: "PAN Is Required.",
                }));
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    transporterPan: "",
                }));
            }
        }

        if (name == "transporterEmail") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value == "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    transporterEmail: "Email is Required"
                }))
            } else if (!emailRegex.test(value)) {
                setFormDataErr((prev) => ({
                    ...prev,
                    transporterEmail: "Enter valid Email "
                }))
            }
            else {
                setFormDataErr((prev) => ({
                    ...prev,
                    transporterEmail: ""
                }))
            }
        }

        if (name === "transporterPhone") {
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(value) || value.length === 0) {
                setFormDataErr((prev) => ({ ...prev, transporterPhone: "Enter a valid phone number." }));
            } else {
                setFormDataErr((prev) => ({ ...prev, transporterPhone: "" }));
            }
        }

        if (name == "transporterId") {
            if (value === "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    transporterId: "Transporter Id Is Required.",
                }));
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    transporterId: "",
                }));
            }
        }

        if (name == "transporterContactPerson") {
            if (value === "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    transporterContactPerson: "Contact person Is Required.",
                }));
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    transporterContactPerson: "",
                }));
            }
        }
        if (name == "transporterAddress") {
            if (value === "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    transporterAddress: "Address Is Required.",
                }));
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    transporterAddress: "",
                }));
            }
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };



    const onSubmit = async (e) => {
        e.preventDefault();
        setIsViewed(false);
        const error = validationFunction();
        setLoading(true);
        if (!error) {
            setLoading(false)
            return
        } else {
            try {
                const clientId = localStorage.getItem("saas_client_clientId");
                let dataObject = {
                    clientId: clientId,

                    transporterName,
                    transporterGstin,
                    transporterPan,
                    transporterAddress,
                    transporterContactPerson,
                    transporterPhone,
                    transporterEmail,
                    transporterId,

                    city: countryData?.cityName,
                    state: countryData?.stateName,
                    country: countryData?.countryName,

                }

                if (id) {
                    const response = await supplierService.updateTransporter({...dataObject, transportId: id})
                    toast.success(response?.data?.message);
                } else {
                    const response = await supplierService.createTransporter(dataObject);
                    toast.success(response?.data?.message);
                }
                setCountryData((prev) => ({
                    ...prev,
                    countryISOCode: "",
                    countryName: "",
                    stateISOCode: "",
                    stateName: "",
                    cityName: "",
                }));
                setFormData({
                    supplierId: "",
                    transporterName: "",
                    transporterGstin: "",
                    transporterPan: "",
                    transporterAddress: "",
                    country: "",
                    state: "",
                    city: "",
                    transporterContactPerson: "",
                    transporterPhone: "",
                    transporterEmail: "",
                    transporterId: ""
                });
                setFormDataErr({
                    supplierId: "",
                    transporterName: "",
                    transporterGstin: "",
                    transporterPan: "",
                    transporterAddress: "",
                    country: "",
                    state: "",
                    city: "",
                    transporterContactPerson: "",
                    transporterPhone: "",
                    transporterEmail: "",
                    transporterId: ""
                })
                setLoading(false);
                navigate("/transport-list");

            } catch (error) {
                setLoading(false);
                console.log("error while creating", error);
            }
        }
    };
    // -----setting the data if contain id ----------
    useEffect(() => {
        if (id) {
            async function getBranch() {
                try {
                    setPageLoading(true)
                    const baseAddress = row;
                    let level = "";
                    if (baseAddress.isBuLevel) {
                        level = "business"
                    } else if (baseAddress.isVendorLevel) {
                        level = "vendor"
                    } else if (baseAddress.isWarehouseLevel) {
                        level = "warehouse"
                    } else if (baseAddress.isBranchLevel) {
                        level = "branch"
                    }
                    setFormData((prev) => ({
                        ...prev,
                        supplierId: baseAddress?.supplierId,
                        transporterName: baseAddress?.transporterName,
                        transporterGstin: baseAddress?.transporterGstin,
                        transporterPan: baseAddress?.transporterPan,
                        transporterAddress: baseAddress?.transporterAddress,
                        transporterContactPerson: baseAddress?.transporterContactPerson,
                        transporterPhone: baseAddress?.transporterPhone,
                        transporterEmail: baseAddress?.transporterEmail,
                        transporterId: baseAddress?.transporterId

                    }));
                    const selectedCountry = Country?.getAllCountries()?.find((item) => item?.name == baseAddress?.country);
                    const state = State.getStatesOfCountry(selectedCountry?.isoCode);
                    const stateName = state?.find(
                        (item) => item?.name === baseAddress?.state
                    );
                    setCountryData((prev) => ({
                        ...prev,
                        stateList: state,
                        countryName: selectedCountry?.name,
                        countryISOCode: selectedCountry?.isoCode,
                        stateName: stateName?.name,
                        stateISOCode: stateName?.isoCode,
                        cityName: baseAddress?.city,
                    }));
                    setPageLoading(false)
                } catch (error) {
                    setPageLoading(false)
                    console.log("error in fetching supplier data");
                }
            }
            getBranch()
        } else {
            setPageLoading(false)
        }
    }, [id, countryList]);


    useEffect(() => {

        getActiveSuppliers()

    }, []);


    async function getActiveSuppliers(params) {
        try {
            const response = await supplierService.getAllActive();
            console.log("active supplier", response?.data);
            setActiveSuppliers(response?.data)
        } catch (error) {
            console.log("error while getting the supplier", error);
        }
    }



    //------------- Allow only Numbers in contact number -------------
    const handleKeyPress = (e) => {
        const value = e.target.value;
        const cleanedValue = value.replace(/[^0-9]/g, '');
        if (cleanedValue.trim() !== "") {
            if ((cleanedValue.match(/\./g) || []).length <= 1) {
                const formattedValue = cleanedValue.toLocaleString('en-US');
                e.target.value = formattedValue;
            } else {
                e.target.value = cleanedValue.replace(/\.(?=.*\.)/g, '');
            }
        } else {
            e.target.value = '';
        }
    }

    return (

        <>
            {
                pageLoading ?
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            height: "100vh",
                            alignItems: "center",
                            flexDirection: "column",
                        }}
                    >

                        <div className="flex flex-col justify-center mt-5 items-center gap-2">
                            <FormLoader />

                        </div>

                    </div>

                    :
                    <div>
                        <Card>
                            <div className={`${isDark ? "bg-darkSecondary text-white" : ""} p-5`}>

                                <form onSubmit={onSubmit}>
                                    <div className="grid grid-cols-1 md:grid-cols-2  gap-5 ">




                                        <label
                                            className={`fromGroup   ${formDataErr?.transporterName !== "" ? "has-error" : ""
                                                } `}
                                        >
                                            <p className="form-label">
                                                Transporter Name <span className="text-red-500">*</span>
                                            </p>
                                            <input
                                                name="transporterName"
                                                type="text"
                                                placeholder="Enter Transporter Name"
                                                value={transporterName}
                                                onChange={handleChange}
                                                className="form-control py-2"
                                                readOnly={isViewed}
                                            />
                                            {
                                                <p className="text-sm text-red-500">
                                                    {formDataErr.transporterName}
                                                </p>
                                            }
                                        </label>

                                        <label
                                            className={`fromGroup   ${formDataErr?.transporterContactPerson !== "" ? "has-error" : ""
                                                } `}
                                        >
                                            <p className="form-label">
                                                Contact Person <span className="text-red-500">*</span>
                                            </p>
                                            <input
                                                name="transporterContactPerson"
                                                type="text"
                                                placeholder="Enter contanct person"
                                                value={transporterContactPerson}
                                                onChange={handleChange}
                                                className="form-control py-2"
                                                readOnly={isViewed}
                                            />
                                            {
                                                <p className="text-sm text-red-500">
                                                    {formDataErr.transporterContactPerson}
                                                </p>
                                            }
                                        </label>

                                        <label
                                            className={`fromGroup   ${formDataErr?.transporterGstin !== "" ? "has-error" : ""
                                                } `}
                                        >
                                            <p className="form-label">
                                                GSTIN<span className="text-red-500">*</span>
                                            </p>
                                            <input
                                                name="transporterGstin"
                                                type="text"
                                                placeholder="Enter GSTIN"
                                                value={transporterGstin}
                                                onChange={handleChange}
                                                className="form-control py-2"
                                                readOnly={isViewed}
                                            />
                                            {
                                                <p className="text-sm text-red-500">
                                                    {formDataErr.transporterGstin}
                                                </p>
                                            }
                                        </label>

                                        <label
                                            className={`fromGroup   ${formDataErr?.transporterPan !== "" ? "has-error" : ""
                                                } `}
                                        >
                                            <p className="form-label">
                                                PAN<span className="text-red-500">*</span>
                                            </p>
                                            <input
                                                name="transporterPan"
                                                type="text"
                                                placeholder="Enter PAN"
                                                value={transporterPan}
                                                onChange={handleChange}
                                                className="form-control py-2"
                                                readOnly={isViewed}
                                            />
                                            {
                                                <p className="text-sm text-red-500">
                                                    {formDataErr.transporterPan}
                                                </p>
                                            }
                                        </label>

                                        <label
                                            className={`fromGroup   ${formDataErr?.transporterEmail !== "" ? "has-error" : ""
                                                } `}
                                        >
                                            <p className="form-label">
                                                Email <span className="text-red-500">*</span>
                                            </p>
                                            <input
                                                name="transporterEmail"
                                                type="email"
                                                placeholder="Enter Email"
                                                value={transporterEmail}
                                                onChange={handleChange}
                                                readOnly={isViewed}

                                                className="form-control py-2"
                                            />
                                            {<p className="text-sm text-red-500">{formDataErr.transporterEmail}</p>}
                                        </label>

                                        <label
                                            className={`fromGroup   ${formDataErr?.transporterPhone !== "" ? "has-error" : ""
                                                } `}
                                        >
                                            <p className=" form-label">
                                                Phone <span className="text-red-500">*</span>
                                            </p>
                                            <input
                                                name="transporterPhone"
                                                type="text"
                                                placeholder="Enter phone number"
                                                value={transporterPhone}
                                                onChange={handleChange}
                                                className="form-control py-2"
                                                readOnly={isViewed}
                                                onInput={handleKeyPress}

                                            />
                                            {<p className="text-sm text-red-500">{formDataErr.transporterPhone}</p>}
                                        </label>

                                        <label
                                            className={`fromGroup   ${formDataErr?.transporterId !== "" ? "has-error" : ""
                                                } `}
                                        >
                                            <p className="form-label">
                                                Transporter ID <span className="text-red-500">*</span>
                                            </p>
                                            <input
                                                name="transporterId"
                                                type="text"
                                                placeholder="Enter Transport Id"
                                                value={transporterId}
                                                onChange={handleChange}
                                                className="form-control py-2"
                                                readOnly={isViewed}
                                            />
                                            {
                                                <p className="text-sm text-red-500">
                                                    {formDataErr.transporterId}
                                                </p>
                                            }
                                        </label>

                                        <div
                                            className={`fromGroup   ${formDataErr?.country !== "" ? "has-error" : ""
                                                } `}
                                        >
                                            <label htmlFor=" hh" className="form-label ">
                                                <p className="form-label">
                                                    {" "}
                                                    Country <span className="text-red-500">*</span>
                                                </p>
                                            </label>
                                            <select
                                                name="country"
                                                value={countryName}
                                                onChange={(e) => handleCountry(e)}
                                                disabled={isViewed}
                                                className="form-control py-2  appearance-none relative flex-1"
                                            >
                                                <option value="">None</option>
                                                {countryList &&
                                                    countryList?.map((country) => (
                                                        <option key={country?.isoCode}>
                                                            {country && country?.name}
                                                        </option>
                                                    ))}
                                            </select>
                                            {
                                                <p className="text-sm text-red-500">
                                                    {formDataErr.country}
                                                </p>
                                            }
                                        </div>

                                        <div
                                            className={`fromGroup   ${formDataErr?.state !== "" ? "has-error" : ""
                                                } `}
                                        >
                                            <label htmlFor=" hh" className="form-label ">
                                                <p className="form-label">
                                                    State <span className="text-red-500">*</span>
                                                </p>
                                            </label>
                                            <select
                                                name="state"
                                                value={stateName}
                                                onChange={(e) => handleState(e)}
                                                disabled={isViewed}
                                                className="form-control py-2  appearance-none relative flex-1"
                                            >
                                                <option value="">None</option>

                                                {stateList &&
                                                    stateList?.map((state) => (
                                                        <option key={state?.isoCode}>
                                                            {state && state?.name}
                                                        </option>
                                                    ))}
                                            </select>
                                            {<p className="text-sm text-red-500">{formDataErr.state}</p>}
                                        </div>
                                        <div
                                            className={`fromGroup   ${formDataErr?.city !== "" ? "has-error" : ""
                                                } `}
                                        >
                                            <label htmlFor=" hh" className="form-label ">
                                                <p className="form-label">
                                                    City <span className="text-red-500">*</span>
                                                </p>
                                            </label>
                                            <select
                                                name="city"
                                                value={cityName}
                                                onChange={(e) => handleCity(e)}
                                                disabled={isViewed}
                                                className="form-control py-2  appearance-none relative flex-1"
                                            >
                                                <option value="">None</option>

                                                {cityList &&
                                                    cityList?.map((city) => (
                                                        <option key={city?.name}>{city && city?.name}</option>
                                                    ))}
                                            </select>
                                            {<p className="text-sm text-red-500">{formDataErr.city}</p>}
                                        </div>

                                        {/* address one */}
                                        <label
                                            className={`fromGroup col-span-2  ${formDataErr?.transporterAddress !== "" ? "has-error" : ""
                                                } `}
                                        >
                                            <p className="form-label">
                                                Address<span className="text-red-500">*</span>
                                            </p>
                                            <textarea
                                                name="transporterAddress"
                                                type="text"
                                                placeholder="Enter address"
                                                value={transporterAddress}
                                                onChange={handleChange}
                                                className="form-control py-2"
                                                readOnly={isViewed}
                                            />
                                            {
                                                <p className="text-sm text-red-500">
                                                    {formDataErr.transporterAddress}
                                                </p>
                                            }
                                        </label>
                                    </div>


                                    <div className="lg:col-span-2 col-span-1">
                                        <div className="ltr:text-right rtl:text-left p-5">
                                            {showAddButton ? (
                                                <button
                                                    disabled={loading}
                                                    style={
                                                        loading
                                                            ? { opacity: "0.5", cursor: "not-allowed" }
                                                            : { opacity: "1" }
                                                    }
                                                    className={`bg-lightBtn dark:bg-darkBtn p-3 rounded-md text-white  text-center btn btn inline-flex justify-center`}
                                                >
                                                    {loading
                                                        ? ""
                                                        : showAddButton && id
                                                            ? "Update"
                                                            : "Save"}
                                                    {loading && (
                                                        <>
                                                            <svg
                                                                className={`animate-spin ltr:-ml-1 ltr:mr-3 rtl:-mr-1 rtl:ml-3 h-5 w-5 unset-classname`}
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <circle
                                                                    className="opacity-25"
                                                                    cx="12"
                                                                    cy="12"
                                                                    r="10"
                                                                    stroke="currentColor"
                                                                    strokeWidth="4"
                                                                ></circle>
                                                                <path
                                                                    className="opacity-75"
                                                                    fill="currentColor"
                                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                                ></path>
                                                            </svg>
                                                            Loading..
                                                        </>
                                                    )}
                                                </button>
                                            ) : (
                                                ""
                                            )}
                                        </div>
                                    </div>
                                </form>

                            </div>
                        </Card>
                    </div>
            }
        </>

    );
};

export default CreateSupplierTransport;
