import { Card } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Country, State, City } from "country-state-city";
import toast from "react-hot-toast";
import useDarkMode from "@/hooks/useDarkMode";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../../assets/scss/common.scss"
import BusinessLogo from "../../assets/images/logo.png"
import DocImage from "../../assets/images/demo-doc.avif"
import FormLoader from "@/Common/formLoader/FormLoader";
import businessUnitService from "@/services/businessUnit/businessUnit.service";
import Button from "@/components/ui/Button";

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


const CreateBusinessUnit = () => {
    const [isDark] = useDarkMode();
    const location = useLocation();
    const {id: encryptedId} = useParams();
    const mode = location?.state?.name;
    const id = location?.state?.id;
    const [pageLoading, setPageLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        emailContact: "",
        contactNumber: "",
        tinNumber: "",
        businessLicenseNumber: "",
        cinNumber: "",
        tanNumber: "",
        panNumber: "",
        country: "",
        city: "",
        state: "",
        houseOrFlat: "",
        streetOrLocality: "",
        landmark: "",
        address: "",
        ZipCode: "",
    });
    const [formDataErr, setFormDataErr] = useState({
        name: "",
        emailContact: "",
        contactNumber: "",
        tinNumber: "",
        businessLicenseNumber: "",
        cinNumber: "",
        tanNumber: "",
        panNumber: "",
        country: "",
        city: "",
        state: "",
        houseOrFlat: "",
        streetOrLocality: "",
        landmark: "",
        address: "",
        ZipCode: "",
        icon: "",
        tinImage: "",
        cinImage: "",
        tanImage: "",
        businessLicenseImage: "",
        panImage: "",
    });
    const {
        name,
        emailContact,
        contactNumber,
        tinNumber,
        businessLicenseNumber,
        cinNumber,
        tanNumber,
        panNumber,
        country,
        city,
        state,
        houseOrFlat,
        streetOrLocality,
        landmark,
        address,
        ZipCode,
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
    const [imgPreview, setImgPreview] = useState(null);
    const [tinPreview, setTinPreview] = useState(null);
    const [cinPreview, setCinPreview] = useState(null);
    const [tanPreview, setTanPreview] = useState(null);
    const [businessLicensePreview, setBusinessLicensePreview] = useState(null);
    const [panPreview, setPanPreview] = useState(null);
    const [ImgErr, setImgErr] = useState("");
    const [tinImgErr, setTinImgErr] = useState("");
    const [cinImgErr, setCinImgErr] = useState("");
    const [tanImgErr, setTanImgErr] = useState("");
    const [businessLicenseImgErr, setBusinessLicenseImgErr] = useState("");
    const [panImgErr, setPanImgErr] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedTinFile, setSelectedTinFile] = useState(null);
    const [selectedCinFile, setSelectedCinFile] = useState(null);
    const [selectedTanFile, setSelectedTanFile] = useState(null);
    const [selectedBusinessLicenseFile, setSelectedBusinessLicenseFile] = useState(null);
    const [selectedPanFile, setSelectedPanFile] = useState(null);
    const navigate = useNavigate();
    const validateField = (fieldName, value) => {
        const rules = {
            name: [
                [!value, "Name Is Required."],
                [value && value.length <= 3, "Minimum 3 characters required."],
            ],
            emailContact: [
                [!value, "Email Is Required."],
                [value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), "Enter valid Email "],
            ],
            contactNumber: [
                [!value, "Phone Number Is Required."],
                [value && !/^[0-9]{10}$/.test(value), "Enter a valid phone number."],
            ],
            panNumber: [
                [!value, "PAN Number Is Required."],
            ],
            country: [
                [!value, "Country is Required"],
            ],
            state: [
                [!value, "State is Required"],
            ],
            city: [
                [!value, "City is Required"],
            ],
            ZipCode: [
                [!value, "Zip Code Is Required."],
            ],
            address: [
                [!value, "Address Is Required."],
            ],
        };
        return (rules[fieldName] || []).find(([condition]) => condition)?.[1] || "";
    };
    const validationFunction = () => {
        const errors = {
            name: validateField("name", name),
            emailContact: validateField("emailContact", emailContact),
            contactNumber: validateField("contactNumber", contactNumber),
            tinNumber: validateField("tinNumber", tinNumber),
            businessLicenseNumber: validateField("businessLicenseNumber", businessLicenseNumber),
            cinNumber: validateField("cinNumber", cinNumber),
            tanNumber: validateField("tanNumber", tanNumber),
            panNumber: validateField("panNumber", panNumber),
            country: validateField("country", countryData.countryName),
            state: validateField("state", countryData.stateName),
            city: validateField("city", countryData.cityName),
            ZipCode: validateField("ZipCode", ZipCode),
            address: validateField("address", address),
            icon: !id && !selectedFile ? "Logo is required." : "",
            tinImage: tinNumber && !selectedTinFile && !tinPreview ? "TIN document is required if TIN number is provided." : "",
            cinImage: cinNumber && !selectedCinFile && !cinPreview ? "CIN document is required if CIN number is provided." : "",
            tanImage: tanNumber && !selectedTanFile && !tanPreview ? "TAN document is required if TAN number is provided." : "",
            businessLicenseImage: businessLicenseNumber && !selectedBusinessLicenseFile && !businessLicensePreview ? "Business License document is required if Business License number is provided." : "",
            panImage: !selectedPanFile && !panPreview ? "PAN document is required." : "",
        };
        setFormDataErr((prev) => ({
            ...prev,
            ...errors,
        }));
        return Object.values(errors).some((error) => error);
    };
    const handleCountry = (e) => {
        const { value } = e.target;
        const selectedCountry = countryList.find((country) => country?.name === value);
        if (selectedCountry) {
            setCountryData((prev) => ({
                ...prev,
                countryName: selectedCountry?.name,
                countryISOCode: selectedCountry?.isoCode,
                CountryISDCode: selectedCountry?.contactNumbercode,
            }));
            setFormData((prev) => ({
                ...prev,
                country: selectedCountry?.name,
            }));
            setFormDataErr((prev) => ({
                ...prev,
                country: validateField("country", selectedCountry?.name),
            }));
        } else {
            setCountryData((prev) => ({
                ...prev,
                countryName: "",
                countryISOCode: "",
                CountryISDCode: "",
            }));
            setFormData((prev) => ({
                ...prev,
                country: "",
            }));
            setFormDataErr((prev) => ({
                ...prev,
                country: validateField("country", ""),
            }));
        }
    };
    const handleState = (e) => {
        const { value } = e.target;
        const selectedState = stateList.find((state) => state?.name === value);
        if (selectedState) {
            setCountryData((prev) => ({
                ...prev,
                stateName: selectedState?.name,
                stateISOCode: selectedState?.isoCode,
            }));
            setFormData((prev) => ({
                ...prev,
                state: selectedState?.name,
            }));
            setFormDataErr((prev) => ({
                ...prev,
                state: validateField("state", selectedState?.name),
            }));
        } else {
            setCountryData((prev) => ({
                ...prev,
                stateName: "",
                stateISOCode: "",
            }));
            setFormData((prev) => ({
                ...prev,
                state: "",
            }));
            setFormDataErr((prev) => ({
                ...prev,
                state: validateField("state", ""),
            }));
        }
    };
    const handleCity = (e) => {
        const { value } = e.target;
        setCountryData((prev) => ({
            ...prev,
            cityName: value,
        }));
        setFormData((prev) => ({
            ...prev,
            city: value,
        }));
        setFormDataErr((prev) => ({
            ...prev,
            city: validateField("city", value),
        }));
    };
    useEffect(() => {
        setCountryData((prev) => ({
            ...prev,
            countryList: Country.getAllCountries(),
        }));
    }, []);
    useEffect(() => {
        setCountryData((prev) => ({
            ...prev,
            stateList: State.getStatesOfCountry(countryISOCode),
        }));
    }, [countryISOCode]);
    useEffect(() => {
        setCountryData((prev) => ({
            ...prev,
            cityList: City.getCitiesOfState(countryISOCode, stateISOCode),
        }));
    }, [countryISOCode, stateISOCode]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setFormDataErr((prev) => ({
            ...prev,
            [name]: validateField(name, value),
        }));
        if (name === "tinNumber" && !value) {
            setSelectedTinFile(null);
            setTinPreview(null);
            setFormDataErr((prev) => ({ ...prev, tinImage: "" }));
        }
        if (name === "cinNumber" && !value) {
            setSelectedCinFile(null);
            setCinPreview(null);
            setFormDataErr((prev) => ({ ...prev, cinImage: "" }));
        }
        if (name === "tanNumber" && !value) {
            setSelectedTanFile(null);
            setTanPreview(null);
            setFormDataErr((prev) => ({ ...prev, tanImage: "" }));
        }
        if (name === "businessLicenseNumber" && !value) {
            setSelectedBusinessLicenseFile(null);
            setBusinessLicensePreview(null);
            setFormDataErr((prev) => ({ ...prev, businessLicenseImage: "" }));
        }
    };
    const onSubmit = async (e) => {
        e.preventDefault();
        setIsViewed(false);
        const hasError = validationFunction();
        setLoading(true);
        if (hasError) {
            setLoading(false);
            return;
        }
        try {
            const clientId = localStorage.getItem("saas_client_clientId");
            const payload = new FormData();
            payload.append("clientId", clientId);
            payload.append("icon", selectedFile);
            payload.append("name", name);
            payload.append("emailContact", emailContact);
            payload.append("contactNumber", contactNumber);
            payload.append("tinNumber", tinNumber);
            if (selectedTinFile) payload.append("tinDocument", selectedTinFile);
            payload.append("businessLicenseNumber", businessLicenseNumber);
            if (selectedBusinessLicenseFile) payload.append("businessLicenseDocument", selectedBusinessLicenseFile);
            payload.append("cinNumber", cinNumber);
            if (selectedCinFile) payload.append("cinDocument", selectedCinFile);
            payload.append("tanNumber", tanNumber);
            if (selectedTanFile) payload.append("tanDocument", selectedTanFile);
            payload.append("panNumber", panNumber);
            if (selectedPanFile) payload.append("panDocument", selectedPanFile);
            payload.append("country", countryData?.countryName);
            payload.append("state", countryData?.stateName);
            payload.append("city", countryData?.cityName);
            payload.append("houseOrFlat", houseOrFlat);
            payload.append("streetOrLocality", streetOrLocality);
            payload.append("landmark", landmark);
            payload.append("address", address);
            payload.append("ZipCode", ZipCode);
            if (id) {
                payload.append("businessUnitId", id);
                const response = await businessUnitService.updateBusinessUnit(payload)
                toast.success(response?.data?.message);
            } else {
                const response = await businessUnitService.createBusinessUnit(payload);
                toast.success(response?.data?.message);
            }
            // setCountryData((prev) => ({
            //     ...prev,
            //     countryISOCode: "",
            //     countryName: "",
            //     stateISOCode: "",
            //     stateName: "",
            //     cityName: "",
            // }));
            // setFormData({
            //     name: "",
            //     emailContact: "",
            //     contactNumber: "",
            //     tinNumber: "",
            //     businessLicenseNumber: "",
            //     cinNumber: "",
            //     tanNumber: "",
            //     panNumber: "",
            //     country: "",
            //     city: "",
            //     state: "",
            //     houseOrFlat: "",
            //     streetOrLocality: "",
            //     landmark: "",
            //     address: "",
            //     ZipCode: "",
            // });
            // setFormDataErr({
            //     name: "",
            //     emailContact: "",
            //     contactNumber: "",
            //     tinNumber: "",
            //     businessLicenseNumber: "",
            //     cinNumber: "",
            //     tanNumber: "",
            //     panNumber: "",
            //     country: "",
            //     city: "",
            //     state: "",
            //     houseOrFlat: "",
            //     streetOrLocality: "",
            //     landmark: "",
            //     address: "",
            //     ZipCode: "",
            //     icon: "",
            //     tinImage: "",
            //     cinImage: "",
            //     tanImage: "",
            //     businessLicenseImage: "",
            //     panImage: "",
            // })
            // setImgPreview(null);
            // setTinPreview(null);
            // setCinPreview(null);
            // setTanPreview(null);
            // setBusinessLicensePreview(null);
            // setPanPreview(null);
            // setSelectedFile(null);
            // setSelectedTinFile(null);
            // setSelectedCinFile(null);
            // setSelectedTanFile(null);
            // setSelectedBusinessLicenseFile(null);
            // setSelectedPanFile(null);
            setLoading(false);
            // navigate("/business-unit-list");
        } catch (error) {
            setLoading(false);
            toast.error(error?.response?.data?.message)
            console.log("error while creating / updating business unit", error);
        }
    };
    useEffect(() => {
        if (encryptedId) {
            if (mode == "view") {
                setIsViewed(true)
            } else {
                setIsViewed(false)
            }

            const decryptedId = decryptId(encryptedId)
            getBusinessUnit(decryptedId)

            async function getBusinessUnit(id) {
                try {
                    setPageLoading(true)
                    const response = await businessUnitService.getOne(id);
                    console.log('Response get business unit', response?.data);
                    const baseAddress = response?.data;
                    setFormData((prev) => ({
                        ...prev,
                        name: baseAddress?.name,
                        emailContact: baseAddress?.emailContact,
                        contactNumber: baseAddress?.contactNumber,
                        tinNumber: baseAddress?.tinNumber,
                        businessLicenseNumber: baseAddress?.businessLicenseNumber,
                        cinNumber: baseAddress?.cinNumber,
                        tanNumber: baseAddress?.tanNumber,
                        panNumber: baseAddress?.panNumber,
                        country: baseAddress?.country,
                        state: baseAddress?.state,
                        city: baseAddress?.city,
                        houseOrFlat: baseAddress?.houseOrFlat || "",
                        streetOrLocality: baseAddress?.streetOrLocality || "",
                        landmark: baseAddress?.landmark || "",
                        ZipCode: baseAddress?.ZipCode,
                        address: baseAddress?.address,
                    }));
                    setImgPreview(baseAddress?.icon ? `${baseAddress?.icon}` : null);
                    setTinPreview(baseAddress?.tinDocument ? `${baseAddress?.tinDocument}` : null);
                    setCinPreview(baseAddress?.cinDocument ? `${baseAddress?.cinDocument}` : null);
                    setTanPreview(baseAddress?.tanDocument ? `${baseAddress?.tanDocument}` : null);
                    setBusinessLicensePreview(baseAddress?.businessLicenseDocument ? `${baseAddress?.businessLicenseDocument}` : null);
                    setPanPreview(baseAddress?.panDocument ? `${baseAddress?.panDocument}` : null);
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
        } else {
            setPageLoading(false)
        }
    }, [encryptedId, countryList]);
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
    const handleFileChange = (e) => {
        setImgErr("");
        const file = e.target.files[0];
        let fileSize = 0;
        let errorCount = 0;
        if (file) {
            fileSize = file.size / 1024;
            if (!file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
                setImgErr("Only images are allowed");
                errorCount++;
            }
            if (fileSize > 1024) {
                setImgErr("Image size should not be more than 1MB.");
                errorCount++;
            }
            if (errorCount === 0) {
                const imageAsBase64 = URL.createObjectURL(file);
                setSelectedFile(file);
                setImgPreview(imageAsBase64);
                setFormDataErr((prev) => ({
                    ...prev,
                    icon: "",
                }));
            }
        } else {
            setFormDataErr((prev) => ({
                ...prev,
                icon: !id ? "Logo is required." : "",
            }));
        }
    };
    const handleTinFileChange = (e) => {
        setTinImgErr("");
        const file = e.target.files[0];
        let fileSize = 0;
        let errorCount = 0;
        if (file) {
            fileSize = file.size / 1024;
            if (!file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
                setTinImgErr("Only images are allowed");
                errorCount++;
            }
            if (fileSize > 1024) {
                setTinImgErr("Image size should not be more than 1MB.");
                errorCount++;
            }
            if (errorCount === 0) {
                const imageAsBase64 = URL.createObjectURL(file);
                setSelectedTinFile(file);
                setTinPreview(imageAsBase64);
                setFormDataErr((prev) => ({
                    ...prev,
                    tinImage: "",
                }));
            }
        } else {
            setFormDataErr((prev) => ({
                ...prev,
                tinImage: tinNumber ? "TIN document is required if TIN number is provided." : "",
            }));
        }
    };
    const handleCinFileChange = (e) => {
        setCinImgErr("");
        const file = e.target.files[0];
        let fileSize = 0;
        let errorCount = 0;
        if (file) {
            fileSize = file.size / 1024;
            if (!file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
                setCinImgErr("Only images are allowed");
                errorCount++;
            }
            if (fileSize > 1024) {
                setCinImgErr("Image size should not be more than 1MB.");
                errorCount++;
            }
            if (errorCount === 0) {
                const imageAsBase64 = URL.createObjectURL(file);
                setSelectedCinFile(file);
                setCinPreview(imageAsBase64);
                setFormDataErr((prev) => ({
                    ...prev,
                    cinImage: "",
                }));
            }
        } else {
            setFormDataErr((prev) => ({
                ...prev,
                cinImage: cinNumber ? "CIN document is required if CIN number is provided." : "",
            }));
        }
    };
    const handleTanFileChange = (e) => {
        setTanImgErr("");
        const file = e.target.files[0];
        let fileSize = 0;
        let errorCount = 0;
        if (file) {
            fileSize = file.size / 1024;
            if (!file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
                setTanImgErr("Only images are allowed");
                errorCount++;
            }
            if (fileSize > 1024) {
                setTanImgErr("Image size should not be more than 1MB.");
                errorCount++;
            }
            if (errorCount === 0) {
                const imageAsBase64 = URL.createObjectURL(file);
                setSelectedTanFile(file);
                setTanPreview(imageAsBase64);
                setFormDataErr((prev) => ({
                    ...prev,
                    tanImage: "",
                }));
            }
        } else {
            setFormDataErr((prev) => ({
                ...prev,
                tanImage: tanNumber ? "TAN document is required if TAN number is provided." : "",
            }));
        }
    };
    const handleBusinessLicenseFileChange = (e) => {
        setBusinessLicenseImgErr("");
        const file = e.target.files[0];
        let fileSize = 0;
        let errorCount = 0;
        if (file) {
            fileSize = file.size / 1024;
            if (!file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
                setBusinessLicenseImgErr("Only images are allowed");
                errorCount++;
            }
            if (fileSize > 1024) {
                setBusinessLicenseImgErr("Image size should not be more than 1MB.");
                errorCount++;
            }
            if (errorCount === 0) {
                const imageAsBase64 = URL.createObjectURL(file);
                setSelectedBusinessLicenseFile(file);
                setBusinessLicensePreview(imageAsBase64);
                setFormDataErr((prev) => ({
                    ...prev,
                    businessLicenseImage: "",
                }));
            }
        } else {
            setFormDataErr((prev) => ({
                ...prev,
                businessLicenseImage: businessLicenseNumber ? "Business License document is required if Business License number is provided." : "",
            }));
        }
    };
    const handlePanFileChange = (e) => {
        setPanImgErr("");
        const file = e.target.files[0];
        let fileSize = 0;
        let errorCount = 0;
        if (file) {
            fileSize = file.size / 1024;
            if (!file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
                setPanImgErr("Only images are allowed");
                errorCount++;
            }
            if (fileSize > 1024) {
                setPanImgErr("Image size should not be more than 1MB.");
                errorCount++;
            }
            if (errorCount === 0) {
                const imageAsBase64 = URL.createObjectURL(file);
                setSelectedPanFile(file);
                setPanPreview(imageAsBase64);
                setFormDataErr((prev) => ({
                    ...prev,
                    panImage: "",
                }));
            }
        } else {
            setFormDataErr((prev) => ({
                ...prev,
                panImage: "PAN document is required.",
            }));
        }
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
                        <div className="flex flex-col justify-center mt-5 items-center gap-2">
                            <FormLoader />
                        </div>
                    </div>
                    :
                    <div>
                        <Card>
                            <div className={`${isDark ? "bg-darkSecondary text-white" : ""} p-5`}>
                                <form onSubmit={onSubmit}>
                                    <div className="grid lg:grid-cols-3 flex-col gap-3">
                                        <label
                                            className={`fromGroup ${formDataErr?.name !== "" ? "has-error" : ""
                                                } `}
                                        >
                                            <p className="form-label">
                                                Name <span className="text-red-500">*</span>
                                            </p>
                                            <input
                                                name="name"
                                                type="text"
                                                placeholder="Enter Name"
                                                value={name}
                                                onChange={handleChange}
                                                className="form-control py-2"
                                                disabled={isViewed}
                                            />
                                            {
                                                <p className="text-sm text-red-500">
                                                    {formDataErr.name}
                                                </p>
                                            }
                                        </label>
                                        <label
                                            className={`fromGroup ${formDataErr?.emailContact !== "" ? "has-error" : ""
                                                } `}
                                        >
                                            <p className="form-label">
                                                Contact Email <span className="text-red-500">*</span>
                                            </p>
                                            <input
                                                name="emailContact"
                                                type="email"
                                                placeholder="Enter Email"
                                                value={emailContact}
                                                onChange={handleChange}
                                                disabled={isViewed}
                                                className="form-control py-2"
                                            />
                                            {<p className="text-sm text-red-500">{formDataErr.emailContact}</p>}
                                        </label>
                                        <label
                                            className={`fromGroup ${formDataErr?.contactNumber !== "" ? "has-error" : ""
                                                } `}
                                        >
                                            <p className=" form-label">
                                                Contact Number <span className="text-red-500">*</span>
                                            </p>
                                            <input
                                                name="contactNumber"
                                                type="text"
                                                placeholder="Enter contact number"
                                                value={contactNumber}
                                                onChange={handleChange}
                                                className="form-control py-2"
                                                disabled={isViewed}
                                                onInput={handleKeyPress}
                                            />
                                            {<p className="text-sm text-red-500">{formDataErr.contactNumber}</p>}
                                        </label>
                                        <div
                                            className={`fromGroup ${formDataErr?.country !== "" ? "has-error" : ""
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
                                                className="form-control py-2 appearance-none relative flex-1"
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
                                            className={`fromGroup ${formDataErr?.state !== "" ? "has-error" : ""
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
                                                className="form-control py-2 appearance-none relative flex-1"
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
                                            className={`fromGroup ${formDataErr?.city !== "" ? "has-error" : ""
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
                                                className="form-control py-2 appearance-none relative flex-1"
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
                                            className={`fromGroup ${formDataErr?.ZipCode !== "" ? "has-error" : ""
                                                } `}
                                        >
                                            <p className="form-label">
                                                Pin Code<span className="text-red-500">*</span>
                                            </p>
                                            <input
                                                name="ZipCode"
                                                type="text"
                                                placeholder="Enter ZipCode"
                                                value={ZipCode}
                                                onChange={handleChange}
                                                className="form-control py-2"
                                                disabled={isViewed}
                                                onInput={handleKeyPress}
                                            />
                                            {
                                                <p className="text-sm text-red-500">
                                                    {formDataErr.ZipCode}
                                                </p>
                                            }
                                        </label>
                                        {/* Address section */}
                                        <label
                                            className={`fromGroup ${formDataErr?.houseOrFlat !== "" ? "has-error" : ""
                                                } `}
                                        >
                                            <p className="form-label">
                                                House/Flat
                                            </p>
                                            <input
                                                name="houseOrFlat"
                                                type="text"
                                                placeholder="Enter House/Flat"
                                                value={houseOrFlat}
                                                onChange={handleChange}
                                                className="form-control py-2"
                                                disabled={isViewed}
                                            />
                                            {<p className="text-sm text-red-500">{formDataErr.houseOrFlat}</p>}
                                        </label>
                                        <label
                                            className={`fromGroup ${formDataErr?.streetOrLocality !== "" ? "has-error" : ""
                                                } `}
                                        >
                                            <p className="form-label">
                                                Street/Locality
                                            </p>
                                            <input
                                                name="streetOrLocality"
                                                type="text"
                                                placeholder="Enter Street/Locality"
                                                value={streetOrLocality}
                                                onChange={handleChange}
                                                className="form-control py-2"
                                                disabled={isViewed}
                                            />
                                            {<p className="text-sm text-red-500">{formDataErr.streetOrLocality}</p>}
                                        </label>
                                        <label
                                            className={`fromGroup ${formDataErr?.landmark !== "" ? "has-error" : ""
                                                } `}
                                        >
                                            <p className="form-label">
                                                Landmark
                                            </p>
                                            <input
                                                name="landmark"
                                                type="text"
                                                placeholder="Enter Landmark"
                                                value={landmark}
                                                onChange={handleChange}
                                                className="form-control py-2"
                                                disabled={isViewed}
                                            />
                                            {<p className="text-sm text-red-500">{formDataErr.landmark}</p>}
                                        </label>
                                        {/* address one */}
                                        <label
                                            className={`fromGroup col-span-3 ${formDataErr?.address !== "" ? "has-error" : ""
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
                                                disabled={isViewed}
                                            />
                                            {
                                                <p className="text-sm text-red-500">
                                                    {formDataErr.address}
                                                </p>
                                            }
                                        </label>
                                        {/* Documents Section */}
                                        <div className="col-span-3">
                                            <h2 className="text-lg font-bold mb-4">Documents</h2>
                                            <div className="grid lg:grid-cols-2 grid-col-1 gap-3">
                                                <label
                                                    className={`fromGroup ${formDataErr?.tinNumber !== "" ? "has-error" : ""
                                                        } `}
                                                >
                                                    <p className=" form-label">
                                                        TIN Number
                                                    </p>
                                                    <input
                                                        name="tinNumber"
                                                        type="text"
                                                        placeholder="Enter TIN number"
                                                        value={tinNumber}
                                                        onChange={handleChange}
                                                        className="form-control py-2"
                                                        disabled={isViewed}
                                                    />
                                                    {<p className="text-sm text-red-500">{formDataErr.tinNumber}</p>}
                                                </label>
                                                {tinNumber && (
                                                    <div
                                                        className={`fromGroup mt-2 ${formDataErr?.tinImage !== "" ? "has-error" : ""
                                                            } `}
                                                    >
                                                        <p className="form-label">
                                                            TIN Document <span className="text-red-500">*</span>
                                                        </p>
                                                        <label
                                                            htmlFor={isViewed ? "" : "tinImageInput"}
                                                            className="cursor-pointer"
                                                        >
                                                            <div
                                                                htmlFor="tinImageInput"
                                                                className="flex flex-col items-center justify-between pl-3 form-control py-5"
                                                            >
                                                                <label
                                                                    htmlFor={isViewed ? "" : "tinImageInput"}
                                                                    className="cursor-pointer"
                                                                >
                                                                    <img
                                                                        src={
                                                                            tinPreview ? tinPreview : DocImage
                                                                        }
                                                                        alt="TIN Document"
                                                                        className={`${tinPreview ? "w-[100%] object-cover" : "w-36 h-36 object-contain"} rounded-md`}
                                                                    />
                                                                </label>
                                                                <input
                                                                    name="tinDocument"
                                                                    id="tinImageInput"
                                                                    type="file"
                                                                    className="hidden"
                                                                    accept="image/*"
                                                                    onChange={handleTinFileChange}
                                                                    disabled={isViewed}
                                                                />
                                                                <span style={{ color: "red", fontSize: "0.7em" }}>
                                                                    {tinImgErr}
                                                                </span>
                                                                <label
                                                                    htmlFor="tinImageInput"
                                                                    className="text-sm mt-2 text-gray-500 cursor-pointer"
                                                                >
                                                                    <p
                                                                        className={`${isDark ? "text-secondary-300" : ""
                                                                            }`}
                                                                    >
                                                                        click to upload TIN document
                                                                    </p>
                                                                </label>{" "}
                                                                {
                                                                    <p className="text-sm text-red-500">
                                                                        {formDataErr.tinImage}
                                                                    </p>
                                                                }
                                                            </div>
                                                        </label>
                                                    </div>
                                                )}
                                                <label
                                                    className={`fromGroup ${formDataErr?.businessLicenseNumber !== "" ? "has-error" : ""
                                                        } `}
                                                >
                                                    <p className=" form-label">
                                                        Business License Number
                                                    </p>
                                                    <input
                                                        name="businessLicenseNumber"
                                                        type="text"
                                                        placeholder="Enter business license number"
                                                        value={businessLicenseNumber}
                                                        onChange={handleChange}
                                                        className="form-control py-2"
                                                        disabled={isViewed}
                                                    />
                                                    {<p className="text-sm text-red-500">{formDataErr.businessLicenseNumber}</p>}
                                                </label>
                                                {businessLicenseNumber && (
                                                    <div
                                                        className={`fromGroup mt-2 ${formDataErr?.businessLicenseImage !== "" ? "has-error" : ""
                                                            } `}
                                                    >
                                                        <p className="form-label">
                                                            Business License Document <span className="text-red-500">*</span>
                                                        </p>
                                                        <label
                                                            htmlFor={isViewed ? "" : "businessLicenseImageInput"}
                                                            className="cursor-pointer"
                                                        >
                                                            <div
                                                                htmlFor="businessLicenseImageInput"
                                                                className="flex flex-col items-center justify-between pl-3 form-control py-5"
                                                            >
                                                                <label
                                                                    htmlFor={isViewed ? "" : "businessLicenseImageInput"}
                                                                    className="cursor-pointer"
                                                                >
                                                                    <img
                                                                        src={
                                                                            businessLicensePreview ? businessLicensePreview : DocImage
                                                                        }
                                                                        alt="Business License Document"
                                                                        className={`${businessLicensePreview ? "w-[100%] object-cover" : "w-36 h-36 object-contain"} rounded-md`}
                                                                    />
                                                                </label>
                                                                <input
                                                                    name="businessLicenseDocument"
                                                                    id="businessLicenseImageInput"
                                                                    type="file"
                                                                    className="hidden"
                                                                    accept="image/*"
                                                                    onChange={handleBusinessLicenseFileChange}
                                                                    disabled={isViewed}
                                                                />
                                                                <span style={{ color: "red", fontSize: "0.7em" }}>
                                                                    {businessLicenseImgErr}
                                                                </span>
                                                                <label
                                                                    htmlFor="businessLicenseImageInput"
                                                                    className="text-sm mt-2 text-gray-500 cursor-pointer"
                                                                >
                                                                    <p
                                                                        className={`${isDark ? "text-secondary-300" : ""
                                                                            }`}
                                                                    >
                                                                        click to upload Business License document
                                                                    </p>
                                                                </label>{" "}
                                                                {
                                                                    <p className="text-sm text-red-500">
                                                                        {formDataErr.businessLicenseImage}
                                                                    </p>
                                                                }
                                                            </div>
                                                        </label>
                                                    </div>
                                                )}
                                                <label
                                                    className={`fromGroup ${formDataErr?.cinNumber !== "" ? "has-error" : ""
                                                        } `}
                                                >
                                                    <p className=" form-label">
                                                        CIN Number
                                                    </p>
                                                    <input
                                                        name="cinNumber"
                                                        type="text"
                                                        placeholder="Enter CIN number"
                                                        value={cinNumber}
                                                        onChange={handleChange}
                                                        className="form-control py-2"
                                                        disabled={isViewed}
                                                    />
                                                    {<p className="text-sm text-red-500">{formDataErr.cinNumber}</p>}
                                                </label>
                                                {cinNumber && (
                                                    <div
                                                        className={`fromGroup mt-2 ${formDataErr?.cinImage !== "" ? "has-error" : ""
                                                            } `}
                                                    >
                                                        <p className="form-label">
                                                            CIN Document <span className="text-red-500">*</span>
                                                        </p>
                                                        <label
                                                            htmlFor={isViewed ? "" : "cinImageInput"}
                                                            className="cursor-pointer"
                                                        >
                                                            <div
                                                                htmlFor="cinImageInput"
                                                                className="flex flex-col items-center justify-between pl-3 form-control py-5"
                                                            >
                                                                <label
                                                                    htmlFor={isViewed ? "" : "cinImageInput"}
                                                                    className="cursor-pointer"
                                                                >
                                                                    <img
                                                                        src={
                                                                            cinPreview ? cinPreview : DocImage
                                                                        }
                                                                        alt="CIN Document"
                                                                        className={`${cinPreview ? "w-[100%] object-cover" : "w-36 h-36 object-contain"} rounded-md`}
                                                                    />
                                                                </label>
                                                                <input
                                                                    name="cinDocument"
                                                                    id="cinImageInput"
                                                                    type="file"
                                                                    className="hidden"
                                                                    accept="image/*"
                                                                    onChange={handleCinFileChange}
                                                                    disabled={isViewed}
                                                                />
                                                                <span style={{ color: "red", fontSize: "0.7em" }}>
                                                                    {cinImgErr}
                                                                </span>
                                                                <label
                                                                    htmlFor="cinImageInput"
                                                                    className="text-sm mt-2 text-gray-500 cursor-pointer"
                                                                >
                                                                    <p
                                                                        className={`${isDark ? "text-secondary-300" : ""
                                                                            }`}
                                                                    >
                                                                        click to upload CIN document
                                                                    </p>
                                                                </label>{" "}
                                                                {
                                                                    <p className="text-sm text-red-500">
                                                                        {formDataErr.cinImage}
                                                                    </p>
                                                                }
                                                            </div>
                                                        </label>
                                                    </div>
                                                )}
                                                <label
                                                    className={`fromGroup ${formDataErr?.tanNumber !== "" ? "has-error" : ""
                                                        } `}
                                                >
                                                    <p className=" form-label">
                                                        TAN Number
                                                    </p>
                                                    <input
                                                        name="tanNumber"
                                                        type="text"
                                                        placeholder="Enter TAN number"
                                                        value={tanNumber}
                                                        onChange={handleChange}
                                                        className="form-control py-2"
                                                        disabled={isViewed}
                                                    />
                                                    {<p className="text-sm text-red-500">{formDataErr.tanNumber}</p>}
                                                </label>
                                                {tanNumber && (
                                                    <div
                                                        className={`fromGroup mt-2 ${formDataErr?.tanImage !== "" ? "has-error" : ""
                                                            } `}
                                                    >
                                                        <p className="form-label">
                                                            TAN Document <span className="text-red-500">*</span>
                                                        </p>
                                                        <label
                                                            htmlFor={isViewed ? "" : "tanImageInput"}
                                                            className="cursor-pointer"
                                                        >
                                                            <div
                                                                htmlFor="tanImageInput"
                                                                className="flex flex-col items-center justify-between pl-3 form-control py-5"
                                                            >
                                                                <label
                                                                    htmlFor={isViewed ? "" : "tanImageInput"}
                                                                    className="cursor-pointer"
                                                                >
                                                                    <img
                                                                        src={
                                                                            tanPreview ? tanPreview : DocImage
                                                                        }
                                                                        alt="TAN Document"
                                                                        className={`${tanPreview ? "w-[100%] object-cover" : "w-36 h-36 object-contain"} rounded-md`}
                                                                    />
                                                                </label>
                                                                <input
                                                                    name="tanDocument"
                                                                    id="tanImageInput"
                                                                    type="file"
                                                                    className="hidden"
                                                                    accept="image/*"
                                                                    onChange={handleTanFileChange}
                                                                    disabled={isViewed}
                                                                />
                                                                <span style={{ color: "red", fontSize: "0.7em" }}>
                                                                    {tanImgErr}
                                                                </span>
                                                                <label
                                                                    htmlFor="tanImageInput"
                                                                    className="text-sm mt-2 text-gray-500 cursor-pointer"
                                                                >
                                                                    <p
                                                                        className={`${isDark ? "text-secondary-300" : ""
                                                                            }`}
                                                                    >
                                                                        click to upload TAN document
                                                                    </p>
                                                                </label>{" "}
                                                                {
                                                                    <p className="text-sm text-red-500">
                                                                        {formDataErr.tanImage}
                                                                    </p>
                                                                }
                                                            </div>
                                                        </label>
                                                    </div>
                                                )}
                                                <label
                                                    className={`fromGroup ${formDataErr?.panNumber !== "" ? "has-error" : ""
                                                        } `}
                                                >
                                                    <p className=" form-label">
                                                        PAN Number <span className="text-red-500">*</span>
                                                    </p>
                                                    <input
                                                        name="panNumber"
                                                        type="text"
                                                        placeholder="Enter PAN number"
                                                        value={panNumber}
                                                        onChange={handleChange}
                                                        className="form-control py-2"
                                                        disabled={isViewed}
                                                    />
                                                    {<p className="text-sm text-red-500">{formDataErr.panNumber}</p>}
                                                </label>
                                                <div
                                                    className={`fromGroup mt-2 ${formDataErr?.panImage !== "" ? "has-error" : ""
                                                        } `}
                                                >
                                                    <p className="form-label">
                                                        PAN Document <span className="text-red-500">*</span>
                                                    </p>
                                                    <label
                                                        htmlFor={isViewed ? "" : "panImageInput"}
                                                        className="cursor-pointer"
                                                    >
                                                        <div
                                                            htmlFor="panImageInput"
                                                            className="flex flex-col items-center justify-between pl-3 form-control py-5"
                                                        >
                                                            <label
                                                                htmlFor={isViewed ? "" : "panImageInput"}
                                                                className="cursor-pointer"
                                                            >
                                                                <img
                                                                    src={
                                                                        panPreview ? panPreview : DocImage
                                                                    }
                                                                    alt="PAN Document"
                                                                    className={`${panPreview ? "w-[100%] object-cover" : "w-36 h-36 object-contain"} rounded-md`}
                                                                />
                                                            </label>
                                                            <input
                                                                name="panDocument"
                                                                id="panImageInput"
                                                                type="file"
                                                                className="hidden"
                                                                accept="image/*"
                                                                onChange={handlePanFileChange}
                                                                disabled={isViewed}
                                                            />
                                                            <span style={{ color: "red", fontSize: "0.7em" }}>
                                                                {panImgErr}
                                                            </span>
                                                            <label
                                                                htmlFor="panImageInput"
                                                                className="text-sm mt-2 text-gray-500 cursor-pointer"
                                                            >
                                                                <p
                                                                    className={`${isDark ? "text-secondary-300" : ""
                                                                        }`}
                                                                >
                                                                    click to upload PAN document
                                                                </p>
                                                            </label>{" "}
                                                            {
                                                                <p className="text-sm text-red-500">
                                                                    {formDataErr.panImage}
                                                                </p>
                                                            }
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className={`fromGroup mt-2 ${formDataErr?.icon !== "" ? "has-error" : ""
                                            } `}
                                    >
                                        <p className="form-label">
                                            Business Logo
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
                                                            imgPreview ? imgPreview : BusinessLogo
                                                        }
                                                        alt="Default"
                                                        className="w-full h-20 object-cover rounded-md"
                                                    />
                                                </label>
                                                <input
                                                    name="BusinessLogo"
                                                    id="imageInput"
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                    disabled={isViewed}
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
                                                        click to upload logo
                                                    </p>
                                                </label>{" "}
                                                {
                                                    <p className="text-sm text-red-500">
                                                        {formDataErr.icon}
                                                    </p>
                                                }
                                            </div>
                                        </label>
                                    </div>
                                    {
                                        isViewed && (
                                            <div className="lg:col-span-2 col-span-1">
                                                <div className="flex justify-end py-5 ">
                                                    <Button
                                                        text="Edit"
                                                        className={`bg-lightBtn dark:bg-darkBtn p-3 rounded-md text-white text-center btn btn inline-flex justify-center`}
                                                        onClick={() => setIsViewed(false)}
                                                        isLoading={loading}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    }
                                    {
                                        !isViewed && (
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
                                                            className={`bg-lightBtn dark:bg-darkBtn p-3 rounded-md text-white text-center btn btn inline-flex justify-center`}
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
                                        )
                                    }
                                </form>
                            </div>
                        </Card>
                    </div>
            }
        </>
    );
};
export default CreateBusinessUnit;