import React, { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import useWidth from "@/hooks/useWidth";
import useDarkmode from "@/hooks/useDarkMode";
import { Country, State, City } from "country-state-city";
import toast from "react-hot-toast";
import { motion } from "framer-motion"
import { Card } from "@mui/material";
import supplierService from "@/services/supplier/supplier.service";



const AddSupplierAddress = () => {

    const location = useLocation();
    const id = location?.state?.customerId;

    console.log("supplierid", id);
    



    const { width, breakpoints } = useWidth();
    const [isDark] = useDarkmode();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [addresses, setAddresses] = useState([]);
    const [refresh, setRefresh] = useState(0)

    const [showForm, setShowForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [addressId, setAddressId] = useState(null);

    console.log("addresses", addresses);
    console.log("addressId", addressId);



    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        alternamtivePhone: "",
        country: "",
        state: "",
        city: "",
        ZipCode: "",
        houseNumber: "",
        roadName: "",
        nearbyLandmark: "",
        address: ""
    });


    const [formDataErr, setFormDataErr] = useState({
        fullName: "", phone: "", alternamtivePhone: "", country: "", state: "", city: "", ZipCode: "", houseNumber: "", roadName: "", nearbyLandmark: "", address: ""
    });
    const {
        fullName, phone, alternamtivePhone, country, state, city, ZipCode, houseNumber, roadName, nearbyLandmark, address
    } = formData;

    const handleChange = (e) => {
        const { name, value } = e.target;
        let dataobject = {
            fullName: formData.fullName,
            phone: formData.phone,
            alternamtivePhone: formData.alternamtivePhone,
            ZipCode: formData.ZipCode,
            houseNumber: formData.houseNumber,
            roadName: formData.roadName,
            nearbyLandmark: formData.nearbyLandmark,
            address: formData.address,
        }

        if (name == "fullName") {
            if (!value) {
                setFormDataErr((prev) => ({
                    ...prev,
                    fullName: "Full Name is required!"
                }))

            } else if (value.length < 3) {
                setFormDataErr((prev) => ({
                    ...prev,
                    fullName: "At least 3 characters required!"
                }))
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    fullName: ""
                }))
            }
            dataobject.fullName = value
        } else if (name == "phone") {
            const phone = /^\d{10}$/;
            if (!value) {
                setFormDataErr((prev) => ({
                    ...prev,
                    phone: "Phone number is required!"
                }))
            } else if (!phone.test(value)) {
                setFormDataErr((prev) => ({
                    ...prev,
                    phone: "Phone number should be 10-digit!"
                }))
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    phone: ""
                }))
            }
            dataobject.phone = value
        } else if (name == "alternamtivePhone") {
            const phone = /^\d{10}$/;
            if (!value) {
                setFormDataErr((prev) => ({
                    ...prev,
                    alternamtivePhone: "Phone number is required!"
                }))
            } else if (!phone.test(value)) {
                setFormDataErr((prev) => ({
                    ...prev,
                    alternamtivePhone: "Phone number should be 10-digit!"
                }))
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    alternamtivePhone: ""
                }))
            }
            dataobject.alternamtivePhone = value


        } else if (name == "ZipCode") {

            if (!value) {
                setFormDataErr((prev) => ({
                    ...prev,
                    ZipCode: "Zip Code is required!"
                }))

            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    ZipCode: ""
                }))
            }
            dataobject.ZipCode = value

        } else if (name == "houseNumber") {

            if (!value) {
                setFormDataErr((prev) => ({
                    ...prev,
                    houseNumber: "House Number is required!"
                }))

            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    houseNumber: ""
                }))
            }
            dataobject.houseNumber = value

        } else if (name == "roadName") {

            if (!value) {
                setFormDataErr((prev) => ({
                    ...prev,
                    roadName: "Road Name is required!"
                }))

            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    roadName: ""
                }))
            }
            dataobject.roadName = value

        } else if (name == "nearbyLandmark") {

            if (!value) {
                setFormDataErr((prev) => ({
                    ...prev,
                    nearbyLandmark: "Nearby Landmark is required!"
                }))

            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    nearbyLandmark: ""
                }))
            }
            dataobject.nearbyLandmark = value

        } else if (name == "address") {

            if (!value) {
                setFormDataErr((prev) => ({
                    ...prev,
                    address: "Address is required!"
                }))

            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    address: ""
                }))
            }
            dataobject.address = value

        }

        setFormData(dataobject)


    };

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




    useEffect(() => {
        setCountryData((prev) => ({
            ...prev,
            countryList: Country.getAllCountries(),
            stateList: State.getStatesOfCountry(countryISOCode),
            cityList: City.getCitiesOfState(countryISOCode, stateISOCode),
        }));
    }, [countryISOCode, stateISOCode]);

    // ----- Handling the country name
    const handleCountry = (e) => {
        const { name, value } = e.target;
        const selectedCountry = countryList.find(
            (country) => country?.name === value
        );
        if (name == "country") {
            if (value == "") {
                // setFormDataErr((prev) => ({
                //     ...prev,
                //     country: "Country is required",
                // }));

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
        } else {

            setCountryData((prev) => ({
                ...prev,
                countryName: "",
                countryISOCode: "",
                CountryISDCode: "",
            }));

        }
    };

    // ----- Handling the state name as per the country name
    const handleState = (e) => {
        const { name, value } = e.target;
        const selectedState = stateList.find((state) => state?.name === value);
        if (name === "state") {
            if (value === "") {
                // setFormDataErr((prev) => ({
                //     ...prev,
                //     state: "State is required",
                // }));
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
        } else {
            setCountryData((prev) => ({
                ...prev,
                stateName: "",
                stateISOCode: "",
            }));

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

    function validation() {
        let errorCount = 0;

        if (!fullName) {
            setFormDataErr((prev) => ({
                ...prev,
                fullName: "Full Name is Required"
            }))
            errorCount++
        } else {
            setFormDataErr((prev) => ({
                ...prev,
                fullName: ""
            }))
        }





        const phoneRegex = /^\d{10}$/;
        if (!phone) {
            setFormDataErr((prev) => ({
                ...prev,
                phone: "Phone No. is Required"
            }))
            errorCount++
        } else if (!phoneRegex.test(phone)) {
            setFormDataErr((prev) => ({
                ...prev,
                phone: "Phone number should be 10-digit"
            }))
            errorCount++
        }
        else {
            setFormDataErr((prev) => ({
                ...prev,
                phone: ""
            }))
        }

        if (!alternamtivePhone) {
            setFormDataErr((prev) => ({
                ...prev,
                alternamtivePhone: "Alternative Phone No. is Required"
            }))
            errorCount++
        } else if (!phoneRegex.test(phone)) {
            setFormDataErr((prev) => ({
                ...prev,
                alternamtivePhone: "Alternative Phone number should be 10-digit"
            }))
            errorCount++
        }
        else {
            setFormDataErr((prev) => ({
                ...prev,
                alternamtivePhone: ""
            }))
        }



        if (!ZipCode) {
            setFormDataErr((prev) => ({
                ...prev,
                ZipCode: "Zip Code is Required"
            }))
            errorCount++
        } else {
            setFormDataErr((prev) => ({
                ...prev,
                ZipCode: ""
            }))
        }

        if (!address) {
            setFormDataErr((prev) => ({
                ...prev,
                address: "Address is Required"
            }))
            errorCount++
        } else {
            setFormDataErr((prev) => ({
                ...prev,
                address: ""
            }))
        }
        if (!houseNumber) {
            setFormDataErr((prev) => ({
                ...prev,
                houseNumber: "House Number is Required"
            }))
            errorCount++
        } else {
            setFormDataErr((prev) => ({
                ...prev,
                houseNumber: ""
            }))
        }

        if (!roadName) {
            setFormDataErr((prev) => ({
                ...prev,
                roadName: "Road Name is Required"
            }))
            errorCount++
        } else {
            setFormDataErr((prev) => ({
                ...prev,
                roadName: ""
            }))
        }
        if (!nearbyLandmark) {
            setFormDataErr((prev) => ({
                ...prev,
                nearbyLandmark: "Nearby Landmark is Required"
            }))
            errorCount++
        } else {
            setFormDataErr((prev) => ({
                ...prev,
                nearbyLandmark: ""
            }))
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

        countryData?.countryName
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

        if (errorCount > 0) {
            return true
        } else {
            return false
        }
    }

    const handleSave = async () => {

        const isError = validation();

        if (!isError) {
            setIsSubmitting(true)
            const data = {
                ...formData, country: countryData?.countryName,
                state: countryData?.stateName,
                city: countryData?.cityName
            }
            if (addressId) {
                try {
                    const response = await supplierService.updateAddress({ ...data, addressId: addressId, customerId: id })
                    setIsSubmitting(false)
                    toast.success(response.data.message)
                    setShowForm(false);
                    setAddressId(null);
                    clearData();
                    setRefresh((prev) => prev + 1)
                } catch (error) {
                    setIsSubmitting(false);
                    toast.error(error.message)
                    console.log("Error while updating address", error);
                }
            } else {
                try {
                    const response = await supplierService.addAddress({ ...data, customerId: id })
                    setIsSubmitting(false)
                    toast.success(response.data.message)
                    setAddressId(null);
                    setShowForm(false);
                    clearData();
                    setRefresh((prev) => prev + 1)
                } catch (error) {
                    setIsSubmitting(false)
                    toast.error(error?.response?.data?.message)
                    console.log("Error while adding address", error);
                }
            }
        }


    };

    function clearData() {
        setCountryData({
            countryList: "",
            countryName: "",
            countryISOCode: "",
            CountryISDCode: "",
            stateList: "",
            stateName: "",
            stateISOCode: "",
            cityList: "",
            cityName: "",
        })

        setFormData({
            fullName: "",
            phone: "",
            alternamtivePhone: "",
            country: "",
            state: "",
            city: "",
            ZipCode: "",
            houseNumber: "",
            roadName: "",
            nearbyLandmark: "",
            address: ""
        })
    }

    const handleDelete = async (id) => {

        try {
            const response = await supplierService.deleteAddress({ addressId: id });
            toast.success(response.data.message);
            setRefresh((prev) => prev + 1)

        } catch (error) {
            console.log("error while deleting address", error);
        }
    };



    const handleKeyPress = (e) => {
        const value = e.target.value;
        const cleanedValue = value.replace(/[^6-9\d]/g, ""); //Allow only number starts with 6 to 9
        if (cleanedValue.trim() !== "") {
            e.target.value = cleanedValue;
        } else {
            e.target.value = ""; // Clear the input if no valid characters are present
        }
    };


    useEffect(() => {
        getAdresses()
    }, [refresh])


    async function getAdresses() {
        try {
            const response = await supplierService.getSupplierAddress(id);
            setAddresses(response?.data?.addresses)
            // if(!defaultAddress){
            //     dispatch(setDefaultAddress(response?.data?.addresses[0]))
            // }
        } catch (error) {
            console.log("error while getting the addresses", error);
        }
    }


    const animationVariants = {
        initial: { y: "-100%", opacity: 0, scale: 0.9 }, // Start from top with small scale
        animate: { y: 0, opacity: 1, scale: 1 }, // Move down and scale up
        exit: { y: "-100%", opacity: 0, scale: 0.9 } // Move up and shrink when unmounting
    };


    return (


        <div >
            {/* Add New Address Button */}
            <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center  px-4 gap-2 text-blue-900"
            >
                <FaPlus /> Add a New Address
            </button>

            {/* Address Form */}
            {showForm && (
                <Card>
                    <div className={`${isDark ? "bg-darkSecondary text-white" : ""} p-5 py-10`}>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="">
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Full Name"
                                    className="form-control py-2"
                                />
                                <span className="text-red-800">{formDataErr?.fullName}</span>
                            </div>

                            <div>
                                <input
                                    type="text"
                                    name="phone"
                                    onInput={handleKeyPress}
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Phone Number"
                                    className="form-control py-2"
                                />
                                <span className="text-red-800">{formDataErr?.phone}</span>

                            </div>

                            <div>
                                <input
                                    type="text"
                                    name="alternamtivePhone"
                                    onInput={handleKeyPress}
                                    value={formData.alternamtivePhone}
                                    onChange={handleChange}
                                    placeholder="Alternative Phone Number"
                                    className="form-control py-2"
                                />
                                <span className="text-red-800">{formDataErr?.alternamtivePhone}</span>

                            </div>

                            <div>
                                <input
                                    type="text"
                                    name="ZipCode"
                                    value={formData.ZipCode}
                                    onChange={handleChange}
                                    placeholder="Pincode"
                                    className="form-control py-2"
                                />
                                <span className="text-red-800">{formDataErr?.ZipCode}</span>

                            </div>


                            <div className="">
                                <select
                                    name="country"
                                    value={countryName}
                                    className="form-control py-2"
                                    onChange={(e) => handleCountry(e)}
                                >
                                    <option value="">--select country--</option>
                                    {countryList && countryList.length > 0 &&
                                        countryList?.map((country) => (
                                            <option className="w-[100%]" key={country?.isoCode}>
                                                {country && country?.name}
                                            </option>
                                        ))}
                                </select>
                                <span className="text-red-800">{formDataErr?.country}</span>
                            </div>

                            <div>
                                <select
                                    name="state"
                                    value={stateName}
                                    // disabled={isViewed}
                                    onChange={(e) => handleState(e)}
                                    className="form-control py-2"
                                >
                                    <option value="">---select state---</option>
                                    {stateList &&
                                        stateList?.map((state) => (
                                            <option key={state?.isoCode}>
                                                {state && state?.name}
                                            </option>
                                        ))}
                                </select>
                                <span className="text-red-800">{formDataErr?.state}</span>


                            </div>

                            <div>
                                <select
                                    name="city"
                                    value={cityName}
                                    // disabled={isViewed}
                                    onChange={(e) => handleCity(e)}
                                    className="form-control py-2"
                                >
                                    <option value="">---Select city---</option>
                                    {cityList &&
                                        cityList?.map((city) => (
                                            <option key={city?.name}>
                                                {city && city?.name}
                                            </option>
                                        ))}
                                </select>
                                <span className="text-red-800">{formDataErr?.city}</span>

                            </div>


                            <div>
                                <input
                                    type="text"
                                    name="houseNumber"
                                    value={formData.houseNumber}
                                    onChange={handleChange}
                                    placeholder="House Number"
                                    className="form-control py-2"

                                />

                                <span className="text-red-800">{formDataErr?.houseNumber}</span>

                            </div>

                            <div>
                                <input
                                    type="text"
                                    name="roadName"
                                    value={formData.roadName}
                                    onChange={handleChange}
                                    placeholder="Road Name"
                                    className="form-control py-2"

                                />

                                <span className="text-red-800">{formDataErr?.roadName}</span>

                            </div>

                            <div>
                                <input
                                    type="text"
                                    name="nearbyLandmark"
                                    value={formData.nearbyLandmark}
                                    onChange={handleChange}
                                    placeholder="Nearby Landmark"
                                    className="form-control py-2"
                                />
                                <span className="text-red-800">{formDataErr?.nearbyLandmark}</span>

                            </div>

                            <div>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Address"
                                    className="form-control py-2"
                                />
                                <span className="text-red-800">{formDataErr?.address}</span>

                            </div>


                        </div>

                        <div className="mt-4 w-[100%] flex gap-2 justify-end">

                            {
                                addressId ?
                                    <button
                                        onClick={() => {
                                            setShowForm(false)
                                            clearData();
                                            setAddressId(null)
                                        }}
                                        // disabled={isSubmitting}
                                        className={`bg-red-400 hover:bg-red-400/35 text-white  ${width < breakpoints.sm ? "w-[100%] " : "w-[20%]"}  py-2 rounded  transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50`}
                                    >
                                        Cancel
                                    </button>
                                    : ""
                            }

                            <button
                                onClick={handleSave}
                                // disabled={isSubmitting}
                                className={`bg-lightBtn dark:bg-darkBtn p-3 rounded-md text-white  text-center btn btn inline-flex justify-center`}
                            >
                                {isSubmitting ? (
                                    <svg
                                        className="animate-spin h-5 w-5 text-white"
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
                                            d="M4 12a8 8 0 018-8v8H4z"
                                        ></path>
                                    </svg>
                                ) : (
                                    addressId ? "Update Address" : "Save Address"
                                )}
                            </button>
                        </div>
                    </div>
                </Card>

            )}

            {/* Saved Addresses */}
            <div className="mt-6">
                <h2 className="font-bold text-lg  px-2 mb-3">Saved Addresses</h2>
                {addresses.length === 0 ? (
                    <p className="text-gray-500">No addresses saved yet.</p>
                ) : (
                    <div className="grid gap-3">
                        {addresses.reverse().map((address, index) => (
                            <div
                                key={index}
                                className={` shadow-sm p-4 rounded-lg border relative ${isDark ? "bg-darkSecondary text-white" : "bg-white text-dark"}`}
                            >
                                <p className="font-bold">{address.fullName}</p>
                                <p className="text-gray-600 dark:text-white">{address.phone}</p>
                                <p className="text-gray-600 dark:text-white">{address.altPhoneNumber}</p>
                                <p className="text-gray-600 dark:text-white">{address.houseNumber}, {address.roadName}, {address.city}, {address.state}, {address.country}, {address.pincode}</p>
                                <p className="text-gray-500 dark:text-white text-sm">Landmark: {address.nearbyLandmark}</p>

                                {/* Edit & Delete Buttons */}
                                <div className="flex gap-2 mt-3">
                                    <button onClick={() => {
                                        setFormData(address);
                                        setAddressId(address?._id)
                                        const selectedCountry = Country?.getAllCountries()?.find((item) => item?.name == address?.country);
                                        const state = State.getStatesOfCountry(selectedCountry?.isoCode);
                                        const stateName = state?.find(
                                            (item) => item?.name === address?.state
                                        );
                                        setCountryData((prev) => ({
                                            ...prev,
                                            stateList: state,
                                            countryName: selectedCountry?.name,
                                            countryISOCode: selectedCountry?.isoCode,
                                            stateName: stateName?.name,
                                            stateISOCode: stateName?.isoCode,
                                            cityName: address?.city,
                                        }));
                                        setShowForm(true)
                                    }} className="bg-yellow-500 text-white px-3 py-1 rounded-md flex items-center gap-1 hover:bg-yellow-600 transition-all">
                                        <FaEdit /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(address?._id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded-md flex items-center gap-1 hover:bg-red-600 transition-all"
                                    >
                                        <FaTrash /> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>



    );
};

export default AddSupplierAddress;
