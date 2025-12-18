import React, { useState, useEffect } from "react";
import { Country, State, City } from "country-state-city";
import toast from "react-hot-toast";
import useDarkMode from "@/hooks/useDarkMode";
import { useLocation, useNavigate } from "react-router-dom";
import "../../assets/scss/common.scss";
import DocImage from "../../assets/images/demo-doc.avif";
import FormLoader from "@/Common/formLoader/FormLoader";
import branchService from "@/services/branch/branch.service";
import Button from "@/components/ui/Button";

const CreateBranch = () => {
    const [isDark] = useDarkMode();
    const location = useLocation();
    const mode = location?.state?.name;
    const id = location?.state?.id;
    const [pageLoading, setPageLoading] = useState(true);

    const [formData, setFormData] = useState({
        businessUnit: "",
        name: "",
        emailContact: "",
        contactNumber: "",
        gstInNumber: "",
        houseOrFlat: "",
        streetOrLocality: "",
        landmark: "",
        country: "",
        city: "",
        state: "",
        address: "",
        ZipCode: "",
    });

    const [formDataErr, setFormDataErr] = useState({
        businessUnit: "",
        name: "",
        emailContact: "",
        contactNumber: "",
        gstInNumber: "",
        houseOrFlat: "",
        streetOrLocality: "",
        landmark: "",
        country: "",
        city: "",
        state: "",
        address: "",
        ZipCode: "",
        gstDocument: "",
    });

    const {
        businessUnit,
        name,
        emailContact,
        contactNumber,
        gstInNumber,
        houseOrFlat,
        streetOrLocality,
        landmark,
        country,
        city,
        state,
        address,
        ZipCode,
    } = formData;

    const [countryData, setCountryData] = useState({
        countryList: [],
        countryName: "",
        countryISOCode: "",
        stateList: [],
        stateName: "",
        stateISOCode: "",
        cityList: [],
        cityName: "",
    });

    const {
        countryList,
        countryName,
        countryISOCode,
        stateList,
        stateName,
        stateISOCode,
        cityList,
        cityName,
    } = countryData;

    const [activeBusinessUnits, setActiveBusinessUnits] = useState([]);
    const [isViewed, setIsViewed] = useState(false);
    const [loading, setLoading] = useState(false);

    // GST Document states
    const [gstPreview, setGstPreview] = useState(null);
    const [gstImgErr, setGstImgErr] = useState("");
    const [selectedGstFile, setSelectedGstFile] = useState(null);

    const navigate = useNavigate();

    // Validation rules (houseOrFlat, streetOrLocality, landmark are optional → no rules)
    const validateField = (fieldName, value) => {
        const rules = {
            businessUnit: [[!value, "Business Unit is Required"]],
            name: [
                [!value, "Name is Required"],
                [value && value.length <= 3, "Minimum 3 characters required"],
            ],
            emailContact: [
                [!value, "Email is Required"],
                [value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), "Enter valid Email"],
            ],
            contactNumber: [
                [!value, "Phone Number is Required"],
                [value && !/^[0-9]{10}$/.test(value), "Enter a valid 10-digit phone number"],
            ],
            gstInNumber: [[!value, "GSTIN Number is Required"]],
            country: [[!value, "Country is Required"]],
            state: [[!value, "State is Required"]],
            city: [[!value, "City is Required"]],
            ZipCode: [[!value, "Zip Code is Required"]],
            address: [[!value, "Address is Required"]],
        };
        return (rules[fieldName] || []).find(([condition]) => condition)?.[1] || "";
    };

    const validationFunction = () => {
        const errors = {
            businessUnit: validateField("businessUnit", businessUnit),
            name: validateField("name", name),
            emailContact: validateField("emailContact", emailContact),
            contactNumber: validateField("contactNumber", contactNumber),
            gstInNumber: validateField("gstInNumber", gstInNumber),
            country: validateField("country", countryData.countryName),
            state: validateField("state", countryData.stateName),
            city: validateField("city", countryData.cityName),
            ZipCode: validateField("ZipCode", ZipCode),
            address: validateField("address", address),
            gstDocument: !selectedGstFile && !gstPreview ? "GST Document is required" : "",
        };

        setFormDataErr((prev) => ({ ...prev, ...errors }));
        return Object.values(errors).some((error) => error);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setFormDataErr((prev) => ({ ...prev, [name]: validateField(name, value) }));
    };

    const handleCountry = (e) => {
        const { value } = e.target;
        const selectedCountry = countryList.find((c) => c?.name === value);
        if (selectedCountry) {
            setCountryData((prev) => ({
                ...prev,
                countryName: selectedCountry.name,
                countryISOCode: selectedCountry.isoCode,
            }));
            setFormDataErr((prev) => ({ ...prev, country: "" }));
        } else {
            setCountryData((prev) => ({
                ...prev,
                countryName: "",
                countryISOCode: "",
            }));
            setFormDataErr((prev) => ({ ...prev, country: "Country is Required" }));
        }
    };

    const handleState = (e) => {
        const { value } = e.target;
        const selectedState = stateList.find((s) => s?.name === value);
        if (selectedState) {
            setCountryData((prev) => ({
                ...prev,
                stateName: selectedState.name,
                stateISOCode: selectedState.isoCode,
            }));
            setFormDataErr((prev) => ({ ...prev, state: "" }));
        } else {
            setCountryData((prev) => ({
                ...prev,
                stateName: "",
                stateISOCode: "",
            }));
            setFormDataErr((prev) => ({ ...prev, state: "State is Required" }));
        }
    };

    const handleCity = (e) => {
        const { value } = e.target;
        setCountryData((prev) => ({ ...prev, cityName: value }));
        setFormDataErr((prev) => ({ ...prev, city: value ? "" : "City is Required" }));
    };

    // Load countries, states, cities
    useEffect(() => {
        setCountryData((prev) => ({ ...prev, countryList: Country.getAllCountries() }));
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

    // Fetch active business units
    useEffect(() => {
        async function fetchActiveBusinessUnits() {
            try {
                const response = await branchService.getActiveBusinessUnit();
                setActiveBusinessUnits(response?.data?.businessUnits || []);
            } catch (error) {
                console.log("Error fetching active business units", error);
            }
        }
        fetchActiveBusinessUnits();
    }, []);

    // Load branch data if editing/viewing
    useEffect(() => {
        if (id) {
            if (mode === "view") setIsViewed(true);
            async function fetchBranch() {
                try {
                    setPageLoading(true);
                    const response = await branchService.getOne(id);
                    const data = response?.data;

                    setFormData((prev) => ({
                        ...prev,
                        businessUnit: data.businessUnit?._id || data.businessUnit,
                        name: data.name || "",
                        emailContact: data.emailContact || "",
                        contactNumber: data.contactNumber || "",
                        gstInNumber: data.gstInNumber || "",
                        houseOrFlat: data.houseOrFlat || "",
                        streetOrLocality: data.streetOrLocality || "",
                        landmark: data.landmark || "",
                        ZipCode: data.ZipCode || "",
                        address: data.address || "",
                    }));

                    setGstPreview(data.gstInDocument || null);

                    const selectedCountry = Country.getAllCountries().find((c) => c.name === data.country);
                    const states = selectedCountry ? State.getStatesOfCountry(selectedCountry.isoCode) : [];
                    const selectedState = states.find((s) => s.name === data.state);

                    setCountryData((prev) => ({
                        ...prev,
                        countryName: data.country || "",
                        countryISOCode: selectedCountry?.isoCode || "",
                        stateName: data.state || "",
                        stateISOCode: selectedState?.isoCode || "",
                        cityName: data.city || "",
                    }));

                    setPageLoading(false);
                } catch (error) {
                    setPageLoading(false);
                    console.log("Error fetching branch", error);
                }
            }
            fetchBranch();
        } else {
            setPageLoading(false);
        }
    }, [id, mode]);

    const handleGstFileChange = (e) => {
        setGstImgErr("");
        const file = e.target.files[0];
        let errorCount = 0;

        if (file) {
            const fileSize = file.size / 1024; // KB
            if (!file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
                setGstImgErr("Only images are allowed");
                errorCount++;
            }
            if (fileSize > 1024) {
                setGstImgErr("Image size should not exceed 1MB");
                errorCount++;
            }
            if (errorCount === 0) {
                const preview = URL.createObjectURL(file);
                setSelectedGstFile(file);
                setGstPreview(preview);
                setFormDataErr((prev) => ({ ...prev, gstDocument: "" }));
            }
        } else {
            setFormDataErr((prev) => ({ ...prev, gstDocument: "GST Document is required" }));
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
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
            payload.append("businessUnit", businessUnit);
            payload.append("name", name);
            payload.append("emailContact", emailContact);
            payload.append("contactNumber", contactNumber);
            payload.append("gstInNumber", gstInNumber);
            payload.append("houseOrFlat", houseOrFlat);
            payload.append("streetOrLocality", streetOrLocality);
            payload.append("landmark", landmark);
            payload.append("country", countryData.countryName);
            payload.append("state", countryData.stateName);
            payload.append("city", countryData.cityName);
            payload.append("address", address);
            payload.append("ZipCode", ZipCode);

            if (selectedGstFile) payload.append("gstDocument", selectedGstFile);

            if (id) {
                payload.append("branchId", id);
                const response = await branchService.updateBranch(payload);
                toast.success(response?.data?.message || "Branch updated successfully");
            } else {
                const response = await branchService.createBranch(payload);
                toast.success(response?.data?.message || "Branch created successfully");
            }

            navigate("/branch-list");
        } catch (error) {
            setLoading(false);
            toast.error(error?.response?.data?.message || "Something went wrong");
            console.log("Error submitting branch", error);
        }
    };

    return (
        <>
            {pageLoading ? (
                <div className="flex justify-center items-center h-screen">
                    <FormLoader />
                </div>
            ) : (
                <div>
                    <div className={`p-6 ${isDark ? "bg-darkSecondary text-white" : "bg-white"}`}>
                        <form onSubmit={onSubmit}>
                            <div className="grid lg:grid-cols-3 gap-4 mb-6">
                                <div className={`space-y-1 ${formDataErr.businessUnit ? "text-red-500" : ""}`}>
                                    <label className="form-label">
                                        Business Unit <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="businessUnit"
                                        value={businessUnit}
                                        onChange={handleChange}
                                        disabled={isViewed}
                                        className="form-control py-2"
                                    >
                                        <option value="">Select Business Unit</option>
                                        {activeBusinessUnits.map((bu) => (
                                            <option key={bu._id} value={bu._id}>
                                                {bu.name}
                                            </option>
                                        ))}
                                    </select>
                                    {formDataErr.businessUnit && <p className="text-sm">{formDataErr.businessUnit}</p>}
                                </div>

                                <div className={`space-y-1 ${formDataErr.name ? "text-red-500" : ""}`}>
                                    <label className="form-label">
                                        Branch Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="name"
                                        type="text"
                                        placeholder="Enter branch name"
                                        value={name}
                                        onChange={handleChange}
                                        disabled={isViewed}
                                        className="form-control py-2"
                                    />
                                    {formDataErr.name && <p className="text-sm">{formDataErr.name}</p>}
                                </div>

                                <div className={`space-y-1 ${formDataErr.emailContact ? "text-red-500" : ""}`}>
                                    <label className="form-label">
                                        Contact Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="emailContact"
                                        type="email"
                                        placeholder="Enter email"
                                        value={emailContact}
                                        onChange={handleChange}
                                        disabled={isViewed}
                                        className="form-control py-2"
                                    />
                                    {formDataErr.emailContact && <p className="text-sm">{formDataErr.emailContact}</p>}
                                </div>

                                <div className={`space-y-1 ${formDataErr.contactNumber ? "text-red-500" : ""}`}>
                                    <label className="form-label">
                                        Contact Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="contactNumber"
                                        type="text"
                                        placeholder="Enter 10-digit number"
                                        value={contactNumber}
                                        onChange={handleChange}
                                        disabled={isViewed}
                                        className="form-control py-2"
                                        maxLength="10"
                                    />
                                    {formDataErr.contactNumber && <p className="text-sm">{formDataErr.contactNumber}</p>}
                                </div>

                                <div className={`space-y-1 ${formDataErr.gstInNumber ? "text-red-500" : ""}`}>
                                    <label className="form-label">
                                        GSTIN Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="gstInNumber"
                                        type="text"
                                        placeholder="Enter GSTIN"
                                        value={gstInNumber}
                                        onChange={handleChange}
                                        disabled={isViewed}
                                        className="form-control py-2"
                                    />
                                    {formDataErr.gstInNumber && <p className="text-sm">{formDataErr.gstInNumber}</p>}
                                </div>



                                <div className={`space-y-1 ${formDataErr.country ? "text-red-500" : ""}`}>
                                    <label className="form-label">
                                        Country <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={countryName}
                                        onChange={handleCountry}
                                        disabled={isViewed}
                                        className="form-control py-2"
                                    >
                                        <option value="">Select Country</option>
                                        {countryList.map((c) => (
                                            <option key={c.isoCode}>{c.name}</option>
                                        ))}
                                    </select>
                                    {formDataErr.country && <p className="text-sm">{formDataErr.country}</p>}
                                </div>

                                <div className={`space-y-1 ${formDataErr.state ? "text-red-500" : ""}`}>
                                    <label className="form-label">
                                        State <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={stateName}
                                        onChange={handleState}
                                        disabled={isViewed || !countryISOCode}
                                        className="form-control py-2"
                                    >
                                        <option value="">Select State</option>
                                        {stateList.map((s) => (
                                            <option key={s.isoCode}>{s.name}</option>
                                        ))}
                                    </select>
                                    {formDataErr.state && <p className="text-sm">{formDataErr.state}</p>}
                                </div>

                                <div className={`space-y-1 ${formDataErr.city ? "text-red-500" : ""}`}>
                                    <label className="form-label">
                                        City <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={cityName}
                                        onChange={handleCity}
                                        disabled={isViewed || !stateISOCode}
                                        className="form-control py-2"
                                    >
                                        <option value="">Select City</option>
                                        {cityList.map((c) => (
                                            <option key={c.name}>{c.name}</option>
                                        ))}
                                    </select>
                                    {formDataErr.city && <p className="text-sm">{formDataErr.city}</p>}
                                </div>

                                <div className={`space-y-1 ${formDataErr.ZipCode ? "text-red-500" : ""}`}>
                                    <label className="form-label">
                                        Pin Code <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="ZipCode"
                                        type="text"
                                        placeholder="Enter pin code"
                                        value={ZipCode}
                                        onChange={handleChange}
                                        disabled={isViewed}
                                        className="form-control py-2"
                                    />
                                    {formDataErr.ZipCode && <p className="text-sm">{formDataErr.ZipCode}</p>}
                                </div>
                                {/* Optional Address Fields */}
                                <div className="space-y-1">
                                    <label className="form-label">House/Flat (Optional)</label>
                                    <input
                                        name="houseOrFlat"
                                        type="text"
                                        placeholder="e.g., Flat 101, Tower A"
                                        value={houseOrFlat}
                                        onChange={handleChange}
                                        disabled={isViewed}
                                        className="form-control py-2"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="form-label">Street/Locality (Optional)</label>
                                    <input
                                        name="streetOrLocality"
                                        type="text"
                                        placeholder="e.g., MG Road"
                                        value={streetOrLocality}
                                        onChange={handleChange}
                                        disabled={isViewed}
                                        className="form-control py-2"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="form-label">Landmark (Optional)</label>
                                    <input
                                        name="landmark"
                                        type="text"
                                        placeholder="e.g., Near Metro Station"
                                        value={landmark}
                                        onChange={handleChange}
                                        disabled={isViewed}
                                        className="form-control py-2"
                                    />
                                </div>

                                <div className={`space-y-1 col-span-3 ${formDataErr.address ? "text-red-500" : ""}`}>
                                    <label className="form-label">
                                        Address <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        name="address"
                                        placeholder="Enter full address"
                                        value={address}
                                        onChange={handleChange}
                                        disabled={isViewed}
                                        className="form-control py-2 h-24"
                                    />
                                    {formDataErr.address && <p className="text-sm">{formDataErr.address}</p>}
                                </div>
                            </div>

                            {/* GST Document Upload - Mandatory */}
                            <div className={`space-y-2 mb-8 ${formDataErr.gstDocument ? "text-red-500" : ""}`}>
                                <label className="form-label">
                                    GST Document <span className="text-red-500">*</span>
                                </label>
                                <label htmlFor={isViewed ? "" : "gstDocumentInput"} className="cursor-pointer block">
                                    <div className="flex flex-col items-center justify-center border rounded-lg p-6 ">
                                        <img
                                            src={gstPreview || DocImage}
                                            alt="GST Document Preview"
                                            className={`rounded-md ${gstPreview ? "w-full max-h-96 object-contain" : "w-32 h-32"}`}
                                        />
                                        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                                            Click to {gstPreview ? "change" : "upload"} GST document
                                        </p>
                                    </div>
                                    <input
                                        id="gstDocumentInput"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleGstFileChange}
                                        disabled={isViewed}
                                    />
                                </label>
                                {gstImgErr && <p className="text-sm">{gstImgErr}</p>}
                                {formDataErr.gstDocument && <p className="text-sm">{formDataErr.gstDocument}</p>}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-4 mt-8">
                                {isViewed && (
                                    <Button
                                        text="Edit"
                                        onClick={() => setIsViewed(false)}
                                        className={`bg-lightBtn dark:bg-darkBtn p-3 rounded-md text-white text-center btn btn inline-flex justify-center`}
                                    />
                                )}
                                {!isViewed && (
                                    <Button
                                        type="submit"
                                        text={id ? "Update" : "Save"}
                                        isLoading={loading}
                                        className={`bg-lightBtn dark:bg-darkBtn p-3 rounded-md text-white text-center btn btn inline-flex justify-center`}
                                    />
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default CreateBranch;