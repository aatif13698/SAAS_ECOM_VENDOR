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



const companyTypeList = [
    {
        name: "Sole Proprietorship",
        value: "soleProprietorship"
    },
    {
        name: "Partnership",
        value: "partnership"
    },
    {
        name: "Private Limited (Corporation)",
        value: "privateLimited"
    },
    {
        name: "Limited Liability Company",
        value: "limitedLiabilityCompany"
    },
    {
        name: "One Person Company",
        value: "onePersonCompany"
    },
    {
        name: "Public Limited",
        value: "publicLimited"
    }
]


const CreateVendor = ({ noFade, scrollContent }) => {

    // useEffect(() => {
    //     if (roleId !== 1) {
    //         navigate("/dashboard");
    //         return;
    //     }
    //     return;
    // }, []);
    const [isDark] = useDarkMode();
    const dispatch = useDispatch();
    const location = useLocation();
    const row = location?.state?.row;
    const id = location?.state?.id; 

    console.log("id", id);

    const [pageLoading, setPageLoading] = useState(true);
    const [showLoadingModal, setShowLoadingModal] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        optionalEmail: "",
        emergencyPhone: "",
        phone: "",
        firstName: "",
        lastName: "",
        country: "",
        city: "",
        state: "",
        password: "",
        confirmPassword: "",
        address: "",
        pinCode: "",
        companyType: "",
        panNumber: "",

    });

    console.log("formData", formData);


    const [formDataErr, setFormDataErr] = useState({
        email: "",
        optionalEmail: "",
        emergencyPhone: "",
        phone: "",
        firstName: "",
        lastName: "",
        country: "",
        city: "",
        state: "",
        password: "",
        confirmPassword: "",
        profileImage: "",
        trandeLicense: "",
        address: "",
        pinCode: "",
        companyType: "",
        panNumber: "",
    });
    const {
        email,
        optionalEmail,
        emergencyPhone,
        phone,
        firstName,
        lastName,
        country,
        city,
        state,
        password,
        confirmPassword,
        address,
        pinCode,
        companyType,
        panNumber

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

    const [passwordErr, setPasswordErr] = useState("");
    const [confirmPasswordErr, setConfirmPasswordErr] = useState("");
    const [isViewed, setIsViewed] = useState(false);
    const [showAddButton, setShowAddButton] = useState(true);
    const [isPasswordVissible, setIsPasswordVissile] = useState(false);
    const [loading, setLoading] = useState(false)
    const [isConfirmPasswordVissible, setConfirmIsPasswordVissile] = useState(false);
    const [refresh, setRefresh] = useState(0);

    const [imgPreview, setImgPreviwe] = useState(null);
    const [ImgErr, setImgErr] = useState("");
    const [selectedFile, setselectedFile] = useState(null);



    const [imgPreview2, setImgPreviwe2] = useState(null);
    const [ImgErr2, setImgErr2] = useState("");
    const [selectedFile2, setSelectedFile2] = useState(null);











    const navigate = useNavigate();
    const [vehicleViewByNotification, setVehicleViewByNotification] = useState(false);






    //------- Handling the VAlidation ------
    function validationFunction() {
        let errorCount = 0;
        if (!firstName) {
            setFormDataErr((prev) => ({
                ...prev,
                firstName: "First Name Is Required.",
            }));
            errorCount++
        } else {
            setFormDataErr((prev) => ({
                ...prev,
                firstName: "",
            }));
        }

        if (!email) {
            setFormDataErr((prev) => ({
                ...prev,
                email: "Email Is Required.",
            }));
            errorCount++

        } else {
            setFormDataErr((prev) => ({
                ...prev,
                email: "",
            }));
            errorCount++

        }
        if (!optionalEmail) {
            setFormDataErr((prev) => ({
                ...prev,
                optionalEmail: "Email Is Required.",
            }));
            errorCount++

        } else {
            setFormDataErr((prev) => ({
                ...prev,
                optionalEmail: "",
            }));
            errorCount++

        }

        const phoneRegex = /^[0-9]{10}$/;
        if (!phone) {
            setFormDataErr((prev) => ({
                ...prev,
                phone: "Phone Number Is Required.",
            }));
            errorCount++
        } else {
            if (!phoneRegex.test(phone) || phone.length === 0) {
                setFormDataErr((prev) => ({ ...prev, phone: "Enter a valid phone number." }));
            } else {
                setFormDataErr((prev) => ({ ...prev, phone: "" }));
            }
        }

        if (!emergencyPhone) {
            setFormDataErr((prev) => ({
                ...prev,
                emergencyPhone: "Phone Number Is Required.",
            }));
            errorCount++
        } else {
            if (!phoneRegex.test(emergencyPhone) || emergencyPhone.length === 0) {
                setFormDataErr((prev) => ({ ...prev, emergencyPhone: "Enter a valid phone number." }));
            } else {
                setFormDataErr((prev) => ({ ...prev, emergencyPhone: "" }));
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
        if (!panNumber) {
            setFormDataErr((prev) => ({
                ...prev,
                panNumber: "PAN Number Is Required.",
            }));
            errorCount++
        } else {
            setFormDataErr((prev) => ({
                ...prev,
                panNumber: "",
            }));
        }
        if (!pinCode) {
            setFormDataErr((prev) => ({
                ...prev,
                pinCode: "Pin Code Is Required.",
            }));
            errorCount++

        } else {
            setFormDataErr((prev) => ({
                ...prev,
                pinCode: "",
            }));
        }
        if (!address) {
            setFormDataErr((prev) => ({
                ...prev,
                address: "Address Is Required.",
            }));
            errorCount++
        } else {
            setFormDataErr((prev) => ({
                ...prev,
                address: "",
            }));
        }
        if (!companyType) {
            setFormDataErr((prev) => ({
                ...prev,
                companyType: "Company Type Is Required.",
            }));
            errorCount++

        } else {
            setFormDataErr((prev) => ({
                ...prev,
                companyType: "",
            }));
        }
        if (id == null) {
            if (!password) {
                setPasswordErr("Password Is Required.");
                errorCount++

            } else {
                setPasswordErr("");
            }
            if (!confirmPassword) {
                setConfirmPasswordErr("Confirm Password Is Required.");
                errorCount++

            } else {
                setConfirmPasswordErr("");
            }
            if (password !== confirmPassword) {
                setConfirmPasswordErr("Password Must Match.");
                errorCount++

            } else {
                setConfirmPasswordErr("");
            }
        }

        if (id == null) {
            if (!selectedFile) {
                setFormDataErr((prev) => ({
                    ...prev,
                    profileImage: "Profile image is required."
                }))
                errorCount++
            }
            if (!selectedFile2) {
                setFormDataErr((prev) => ({ ...prev, trandeLicense: "Trande Lincense Is Required." }));
                errorCount++;
            } else {
                setFormDataErr((prev) => ({ ...prev, trandeLicense: "" }))
            }
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
        if (name === "firstName") {
            if (value === "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    firstName: "First Name Is Required.",
                }));
            } else if (value?.length <= 3) {
                setFormDataErr((prev) => ({
                    ...prev,
                    firstName: "Minimum 3 characters required.",
                }));
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    firstName: "",
                }));
            }
        }

        if (name == "email") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value == "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    email: "Email is Required"
                }))
            } else if (!emailRegex.test(value)) {
                setFormDataErr((prev) => ({
                    ...prev,
                    email: "Enter valid Email "
                }))
            }
            else {
                setFormDataErr((prev) => ({
                    ...prev,
                    email: ""
                }))
            }
        }

        if (name == "optionalEmail") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value == "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    optionalEmail: "Email is Required"
                }))
            } else if (!emailRegex.test(value)) {
                setFormDataErr((prev) => ({
                    ...prev,
                    optionalEmail: "Enter valid Email "
                }))
            }
            else {
                setFormDataErr((prev) => ({
                    ...prev,
                    optionalEmail: ""
                }))
            }
        }

        if (name === "phone") {
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(value) || value.length === 0) {
                setFormDataErr((prev) => ({ ...prev, phone: "Enter a valid phone number." }));
            } else {
                setFormDataErr((prev) => ({ ...prev, phone: "" }));
            }
        }

        if (name === "emergencyPhone") {
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(value) || value.length === 0) {
                setFormDataErr((prev) => ({ ...prev, emergencyPhone: "Enter a valid phone number." }));
            } else {
                setFormDataErr((prev) => ({ ...prev, emergencyPhone: "" }));
            }
        }


        if (name === "password" && value === "") {
            setPasswordErr("Password Is Required.");
        } else if (name === "confirmPassword" && value === "") {
            setConfirmPasswordErr("Confirm Password Is Required");
        } else if (name === "confirmPassword" && password !== value) {
            setConfirmPasswordErr("Password Must Match");
        } else {
            setConfirmPasswordErr("");
            setPasswordErr("");
        }


        if (name == "panNumber") {
            if (value === "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    panNumber: "PAN Number Is Required.",
                }));
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    panNumber: "",
                }));
            }
        }

        if (name == "pinCode") {
            if (value === "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    pinCode: "Pin Code Is Required.",
                }));
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    pinCode: "",
                }));
            }
        }

        if (name == "address") {
            if (value === "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    address: "Address Is Required.",
                }));
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    address: "",
                }));
            }
        }


        if (name == "companyType") {
            if (value === "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    companyType: "Company Type Is Required.",
                }));
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    companyType: "",
                }));
            }
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    //---------- Adding & Editing the Organiser ----------

    const onSubmit = async (e) => {
        e.preventDefault();
        setIsViewed(false);
        const error = validationFunction();
        setLoading(true);
        if (id == null) {
            if (!password && !confirmPassword) {
                setPasswordErr("Password is required.");
                setConfirmPasswordErr("Confirm password is required.");
                setLoading(false)
                return;
            }
        }
        if (password !== confirmPassword) {
            toast.error("Password must match.");
            setLoading(false)
            return;
        }
        const roleId = 3;
        if (error) {
            return
        } else {
            try {

                const payload = new FormData();
                payload.append("images", selectedFile);
                payload.append("images", selectedFile2);
                payload.append("firstName", firstName);
                payload.append("lastName", lastName);
                payload.append("email", email);
                payload.append("optionalEmail", optionalEmail);
                payload.append("phone", phone);
                payload.append("emergencyPhone", emergencyPhone);
                payload.append("country", countryData?.countryName);
                payload.append("state", countryData?.stateName);
                payload.append("city", countryData?.cityName);
                payload.append("password", password);
                payload.append("address", address);
                payload.append("pinCode", pinCode);
                payload.append("companyType", companyType);
                payload.append("panNumber", panNumber);

                const response = await vendorService.createVendor(payload);
                toast.success(response?.data?.message);

                setCountryData((prev) => ({
                    ...prev,
                    countryISOCode: "",
                    countryName: "",
                    stateISOCode: "",
                    stateName: "",
                    cityName: "",
                }));
                setFormData({
                    email: "",
                    optionalEmail: "",
                    emergencyPhone: "",
                    phone: "",
                    firstName: "",
                    lastName: "",
                    country: "",
                    city: "",
                    state: "",
                    password: "",
                    confirmPassword: "",
                    address: "",
                    pinCode: "",
                    companyType: "",
                    panNumber: "",
                });
                setFormDataErr({
                    email: "",
                    optionalEmail: "",
                    emergencyPhone: "",
                    phone: "",
                    firstName: "",
                    lastName: "",
                    country: "",
                    city: "",
                    state: "",
                    password: "",
                    confirmPassword: "",
                    profileImage: "",
                    trandeLicense: "",
                    address: "",
                    pinCode: "",
                    companyType: "",
                    panNumber: "",
                })
                setImgPreviwe(null);
                setImgPreviwe2(null);
                setselectedFile(null);
                setSelectedFile2(null)
                setLoading(false);
                navigate("/vendors-list");

            } catch (error) {
                setLoading(false);
                console.log("error while creating vendor", error);
                alert(error?.response?.data?.message)
            }

        }


    };
    // -----setting the data if contain id ----------
    useEffect(() => {
        if (id) {
            async function getVendor() {
                try {
                    setPageLoading(true)
                    const response = await vendorService.getParticularVendor(id);
                    console.log('Response get vendor', response?.data);
                    const baseAddress = response?.data
                    setFormData((prev) => ({
                        ...prev,
                        firstName: baseAddress?.firstName,
                        lastName: baseAddress?.lastName,
                        email: baseAddress?.email,
                        optionalEmail: baseAddress?.optionalEmail,
                        emergencyPhone : baseAddress?.emergencyPhone,
                        phone: baseAddress?.phone,
                        panNumber: baseAddress?.panNumber,
                        pinCode: baseAddress?.pinCode,
                        address: baseAddress?.address,
                        companyType: baseAddress?.companyType,
                    }));

                    setImgPreviwe(`http://localhost:8088/images/${baseAddress?.profileImage}`)
                    setImgPreviwe2(`http://localhost:8088/images/${baseAddress?.tradeLicense}`)

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
                    console.log("error in fetching vendor data");
                }
            }
            getVendor()
        } else {
            setPageLoading(false)
        }
    }, [id, countryList]);


    const [isUserClicked, setIsUserClicked] = useState(true);





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




    const handleFileChange2 = (e) => {
        const { name, value } = e.target;
        setImgErr2("");
        if (name === "tradeLicense") {
            if (!selectedFile2 && value === "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    trandeLicense: "Trade License is required.",
                }));
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    trandeLicense: "",
                }));
            }
        }
        let fileSize = 0;

        let errorCount = 0;

        const file = e.target.files[0];

        if (file) {
            fileSize = file.size / 1024;

            if (!file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
                setImgErr2("Only images are allowed");

                errorCount++;
            }

            //check if filesize is not more than 1MB
            if (fileSize > 1024) {
                setImgErr2("Image size should not be more than 1MB.");

                errorCount++;
            }

            if (errorCount === 0) {
                const imageAsBase64 = URL.createObjectURL(file);

                setSelectedFile2(file);

                setImgPreviwe2(imageAsBase64);
            }
        }

    };



    // handle file change
    const handleFileChange = (e) => {
        const { name, value } = e.target;
        setImgErr("");
        if (name === "profileImage") {
            if (!selectedFile && value === "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    profileImage: "Profile img is required.",
                }));
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    profileImage: "",
                }));
            }
        }
        let fileSize = 0;

        let errorCount = 0;

        const file = e.target.files[0];

        if (file) {
            fileSize = file.size / 1024;

            if (!file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
                setImgErr("Only images are allowed");

                errorCount++;
            }

            //check if filesize is not more than 1MB
            if (fileSize > 1024) {
                setImgErr("Image size should not be more than 1MB.");

                errorCount++;
            }

            if (errorCount === 0) {
                const imageAsBase64 = URL.createObjectURL(file);

                setselectedFile(file);

                setImgPreviwe(imageAsBase64);
            }
        }
    };



    const handleCloseLoadingModal = () => {
        setShowLoadingModal(false);
    };





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
                        {/* loding dialog */}
                        {/* <Transition appear show={showLoadingModal} as={Fragment}>
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
                                       bg-white dark:bg-slate-800 text-left align-middle shadow-xl transition-alll max-w-[17rem] `}
                                            >
                                                <div className="flex flex-col justify-center mt-5 items-center gap-2">
                                                    <FormLoader />
                                                    {
                                                        toggleWord ? <p className='py-3'>Loading...</p> : <p className='py-5'>processing...</p>
                                                    }

                                                </div>
                                            </Dialog.Panel>
                                        </Transition.Child>
                                    </div>
                                </div>
                            </Dialog>
                        </Transition> */}

                        <div className="flex flex-col justify-center mt-5 items-center gap-2">
                            <FormLoader />
                            {/* {
                                                        toggleWord ? <p className='py-3'>Loading...</p> : <p className='py-5'>processing...</p>
                                                    } */}

                        </div>

                    </div>

                    :
                    <div>
                        <Card>
                            <div className={`${isDark ? "bg-darkSecondary text-white" : ""} p-5`}>
                                {isUserClicked && (
                                    <form onSubmit={onSubmit}>
                                        <div className="grid lg:grid-cols-3 flex-col gap-3">
                                            <label
                                                className={`fromGroup   ${formDataErr?.firstName !== "" ? "has-error" : ""
                                                    } `}
                                            >
                                                <p className="form-label">
                                                    First Name <span className="text-red-500">*</span>
                                                </p>
                                                <input
                                                    name="firstName"
                                                    type="text"
                                                    placeholder="Enter First Name"
                                                    value={firstName}
                                                    onChange={handleChange}
                                                    className="form-control py-2"
                                                    readOnly={isViewed}
                                                />
                                                {
                                                    <p className="text-sm text-red-500">
                                                        {formDataErr.firstName}
                                                    </p>
                                                }
                                            </label>
                                            <label>
                                                <p className="form-label">Last Name</p>
                                                <input
                                                    name="lastName"
                                                    type="text"
                                                    placeholder="Enter Last Name"
                                                    value={lastName}
                                                    onChange={handleChange}
                                                    className="form-control py-2"
                                                    readOnly={isViewed}

                                                />
                                                {/* {<p className="text-sm text-red-500">{formDataErr.lastName}</p>} */}
                                            </label>
                                            <label
                                                className={`fromGroup   ${formDataErr?.email !== "" ? "has-error" : ""
                                                    } `}
                                            >
                                                <p className="form-label">
                                                    Email <span className="text-red-500">*</span>
                                                </p>
                                                <input
                                                    name="email"
                                                    type="email"
                                                    placeholder="Enter Email"
                                                    value={email}
                                                    onChange={handleChange}
                                                    readOnly={isViewed}

                                                    className="form-control py-2"
                                                />
                                                {<p className="text-sm text-red-500">{formDataErr.email}</p>}
                                            </label>
                                            <label
                                                className={`fromGroup   ${formDataErr?.optionalEmail !== "" ? "has-error" : ""
                                                    } `}
                                            >
                                                <p className="form-label">
                                                    Other Email <span className="text-red-500">*</span>
                                                </p>
                                                <input
                                                    name="optionalEmail"
                                                    type="email"
                                                    placeholder="Enter Email"
                                                    value={optionalEmail}
                                                    onChange={handleChange}
                                                    readOnly={isViewed}
                                                    className="form-control py-2"
                                                />
                                                {<p className="text-sm text-red-500">{formDataErr.optionalEmail}</p>}
                                            </label>
                                            <label
                                                className={`fromGroup   ${formDataErr?.phone !== "" ? "has-error" : ""
                                                    } `}
                                            >
                                                <p className=" form-label">
                                                    Contact Number <span className="text-red-500">*</span>
                                                </p>
                                                <input
                                                    name="phone"
                                                    type="text"
                                                    placeholder="Enter contact number"
                                                    value={phone}
                                                    onChange={handleChange}
                                                    className="form-control py-2"
                                                    readOnly={isViewed}
                                                    onInput={handleKeyPress}

                                                />
                                                {<p className="text-sm text-red-500">{formDataErr.phone}</p>}
                                            </label>
                                            <label
                                                className={`fromGroup   ${formDataErr?.emergencyPhone !== "" ? "has-error" : ""
                                                    } `}
                                            >
                                                <p className=" form-label">
                                                    Other Contact Number <span className="text-red-500">*</span>
                                                </p>
                                                <input
                                                    name="emergencyPhone"
                                                    type="text"
                                                    placeholder="Enter contact number"
                                                    value={emergencyPhone}
                                                    onChange={handleChange}
                                                    className="form-control py-2"
                                                    readOnly={isViewed}
                                                    onInput={handleKeyPress}

                                                />
                                                {<p className="text-sm text-red-500">{formDataErr.emergencyPhone}</p>}
                                            </label>

                                            {/* Pan Number */}

                                            <label
                                                className={`fromGroup    ${formDataErr?.panNumber !== "" ? "has-error" : ""
                                                    } `}
                                            >
                                                <p className="form-label">
                                                    PAN Number<span className="text-red-500">*</span>
                                                </p>
                                                <input
                                                    name="panNumber"
                                                    type="text"
                                                    placeholder="Enter PAN Number"
                                                    value={panNumber}
                                                    onChange={handleChange}
                                                    className="form-control py-2"
                                                    readOnly={isViewed}
                                                />
                                                {
                                                    <p className="text-sm text-red-500">
                                                        {formDataErr.panNumber}
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

                                            {/* pin code */}

                                            <label
                                                className={`fromGroup    ${formDataErr?.pinCode !== "" ? "has-error" : ""
                                                    } `}
                                            >
                                                <p className="form-label">
                                                    Pin Code<span className="text-red-500">*</span>
                                                </p>
                                                <input
                                                    name="pinCode"
                                                    type="text"
                                                    placeholder="Enter address"
                                                    value={pinCode}
                                                    onChange={handleChange}
                                                    className="form-control py-2"
                                                    readOnly={isViewed}
                                                />
                                                {
                                                    <p className="text-sm text-red-500">
                                                        {formDataErr.pinCode}
                                                    </p>
                                                }
                                            </label>

                                            {/* address one */}


                                            <label
                                                className={`fromGroup col-span-3   ${formDataErr?.address !== "" ? "has-error" : ""
                                                    } `}
                                            >
                                                <p className="form-label">
                                                    Address<span className="text-red-500">*</span>
                                                </p>
                                                <textarea
                                                    name="address"
                                                    type="text"
                                                    placeholder="Enter address"
                                                    value={address}
                                                    onChange={handleChange}
                                                    className="form-control py-2"
                                                    readOnly={isViewed}
                                                />
                                                {
                                                    <p className="text-sm text-red-500">
                                                        {formDataErr.address}
                                                    </p>
                                                }
                                            </label>




                                            {/* Company type */}

                                            <div
                                                className={`fromGroup   ${formDataErr?.companyType !== "" ? "has-error" : ""
                                                    } `}
                                            >
                                                <label htmlFor=" hh" className="form-label ">
                                                    <p className="form-label">
                                                        Company Type <span className="text-red-500">*</span>
                                                    </p>
                                                </label>
                                                <select
                                                    name="companyType"
                                                    value={companyType}
                                                    onChange={handleChange}
                                                    disabled={isViewed}
                                                    className="form-control py-2  appearance-none relative flex-1"
                                                >
                                                    <option value="">None</option>

                                                    {companyTypeList &&
                                                        companyTypeList?.map((item) => (
                                                            <option value={item?.value} key={item?.name}>{item?.name}</option>
                                                        ))}
                                                </select>
                                                {<p className="text-sm text-red-500">{formDataErr.companyType}</p>}
                                            </div>






                                            <div>
                                                <label
                                                    className={`fromGroup   ${passwordErr !== "" ? "has-error" : ""
                                                        } `}
                                                >
                                                    <p className="form-label">
                                                        Password <span className="text-red-500">*</span>
                                                    </p>
                                                    <div className="relative">
                                                        <input
                                                            type={isPasswordVissible ? "text" : "password"}
                                                            name="password"
                                                            value={password}
                                                            onChange={handleChange}
                                                            placeholder="Enter Password."
                                                            className="form-control py-2"
                                                            readOnly={isViewed}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2"
                                                            onClick={(e) =>
                                                                setIsPasswordVissile((prev) => !prev)
                                                            }
                                                        >
                                                            {isPasswordVissible ? <FaEye /> : <FaEyeSlash />}
                                                        </button>
                                                    </div>

                                                    {
                                                        <p className="text-sm text-red-500">{passwordErr}</p>
                                                    }
                                                </label>
                                            </div>
                                            <div>
                                                <label
                                                    className={`fromGroup   ${confirmPasswordErr !== "" ? "has-error" : ""
                                                        } `}
                                                >
                                                    <p className="form-label">
                                                        Confirm Password{" "}
                                                        <span className="text-red-500">*</span>
                                                    </p>
                                                    <div className="relative">
                                                        <input
                                                            type={
                                                                isConfirmPasswordVissible ? "text" : "password"
                                                            }
                                                            name="confirmPassword"
                                                            value={confirmPassword}
                                                            onChange={handleChange}
                                                            placeholder="Enter Confirm Password"
                                                            className="form-control py-2"
                                                            readOnly={isViewed}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2"
                                                            onClick={(e) =>
                                                                setConfirmIsPasswordVissile((prev) => !prev)
                                                            }
                                                        >
                                                            {isConfirmPasswordVissible ? (
                                                                <FaEye />
                                                            ) : (
                                                                <FaEyeSlash />
                                                            )}
                                                        </button>
                                                    </div>

                                                    {
                                                        <p className="text-sm text-red-500">
                                                            {confirmPasswordErr}
                                                        </p>
                                                    }
                                                </label>
                                            </div>


                                            <div className="fromGroup col-span-3">
                                            <div
                                            className={`fromGroup  mt-2  ${formDataErr?.trandeLicense !== "" ? "has-error" : ""
                                                } `}
                                        >
                                            <p className="form-label">
                                            Trade License
                                                <span className="text-red-500">*</span>
                                            </p>

                                            <label
                                                htmlFor={isViewed ? "" : "imageInput2"}
                                                className="cursor-pointer"
                                            >
                                                <div
                                                    htmlFor="imageInput2"
                                                    className="flex flex-col items-center justify-between pl-3 form-control py-5"
                                                >
                                                    <label
                                                        htmlFor={isViewed ? "" : "imageInput2"}
                                                        className="cursor-pointer"
                                                    >
                                                        <img
                                                            src={
                                                                imgPreview2 ? imgPreview2 : TradingLicense
                                                            }
                                                            alt="Default"
                                                            className="w-full h-[30%] object-cover rounded-md"
                                                        />
                                                    </label>
                                                    <input
                                                        id="imageInput2"
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        name="tradeLicense"
                                                        selectedFile={selectedFile2}
                                                        onChange={handleFileChange2}
                                                        preview={imgPreview2}
                                                    />
                                                    <span style={{ color: "red", fontSize: "0.7em" }}>
                                                        {ImgErr2}
                                                    </span>
                                                    <label
                                                        htmlFor="imageInput2"
                                                        className="text-sm mt-2 text-gray-500 cursor-pointer"
                                                    >
                                                        <p
                                                            className={`${isDark ? "text-secondary-300" : ""
                                                                }`}
                                                        >
                                                            click to upload license 
                                                        </p>
                                                    </label>{" "}
                                                    {
                                                        <p className="text-sm text-red-500">
                                                            {formDataErr.trandeLicense}
                                                        </p>
                                                    }
                                                </div>
                                            </label>
                                        </div>
                                                {/* <p className="form-label">
                                                    Trade License{" "}
                                                    <span className="text-red-500">*</span>
                                                </p>
                                                <Fileinput
                                                    name="tradeLicense"
                                                    selectedFile={selectedFile2}
                                                    onChange={handleFileChange2}
                                                    preview={imgPreview2}
                                                    placeholder="Click to upload Trade License"
                                                />
                                                <div className="flex justify-center my-3">
                                                    <span style={{ color: "red", fontSize: "0.7em" }}>
                                                        {ImgErr2}
                                                    </span>
                                                </div>
                                                {
                                                    <p className="text-sm text-red-500">
                                                        {formDataErr.trandeLicense}
                                                    </p>
                                                } */}
                                            </div>



                                        </div>

                                        <div
                                            className={`fromGroup  mt-2  ${formDataErr?.profileImage !== "" ? "has-error" : ""
                                                } `}
                                        >
                                            <p className="form-label">
                                                vendor Profile
                                                <span className="text-red-500">*</span>
                                            </p>

                                            <label
                                                htmlFor={isViewed ? "" : "imageInput"}
                                                className="cursor-pointer"
                                            >
                                                <div
                                                    htmlFor="imageInput"
                                                    className="flex flex-col items-center justify-between pl-3 form-control py-5"
                                                >
                                                    <label
                                                        htmlFor={isViewed ? "" : "imageInput"}
                                                        className="cursor-pointer"
                                                    >
                                                        <img
                                                            src={
                                                                imgPreview ? imgPreview : ProfileImage
                                                            }
                                                            alt="Default"
                                                            className="w-20 h-20 object-cover rounded-md"
                                                        />
                                                    </label>
                                                    <input
                                                        name="profileImage"
                                                        id="imageInput"
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                    />
                                                    <span style={{ color: "red", fontSize: "0.7em" }}>
                                                        {ImgErr}
                                                    </span>
                                                    <label
                                                        htmlFor="imageInput"
                                                        className="text-sm mt-2 text-gray-500 cursor-pointer"
                                                    >
                                                        <p
                                                            className={`${isDark ? "text-secondary-300" : ""
                                                                }`}
                                                        >
                                                            click to upload vendor img
                                                        </p>
                                                    </label>{" "}
                                                    {
                                                        <p className="text-sm text-red-500">
                                                            {formDataErr.profileImage}
                                                        </p>
                                                    }
                                                </div>
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
                                )}

                            </div>
                        </Card>
                    </div>
            }
        </>

    );
};

export default CreateVendor;
