import supplierService from '@/services/supplier/supplier.service';
import React, { Fragment, useEffect, useState } from 'react'
import { Country, State, City } from "country-state-city";
import toast from 'react-hot-toast';
import { Dialog, Transition } from "@headlessui/react";
import useDarkmode from '@/hooks/useDarkMode';
import Icon from "@/components/ui/Icon";
import Button from '../../components/ui/Button';
import customerService from '@/services/customer/customer.service';

function AddAddressModel({ noFade, openModal3, setOpenModal3, getShippingAddress, currentSupplierId }) {

    
    
    const [isDark] = useDarkmode();
    // const [openModal3, setOpenModal3] = useState(false);
    const [formData2, setFormData2] = useState({
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


    const [formDataErr2, setFormDataErr2] = useState({
        fullName: "", phone: "", alternamtivePhone: "", country: "", state: "", city: "", ZipCode: "", houseNumber: "", roadName: "", nearbyLandmark: "", address: ""
    });
    const {
        fullName, phone, alternamtivePhone, country, state, city, ZipCode, houseNumber, roadName, nearbyLandmark, address
    } = formData2;

    const handleChange = (e) => {
        const { name, value } = e.target;
        let dataobject = {
            fullName: formData2.fullName,
            phone: formData2.phone,
            alternamtivePhone: formData2.alternamtivePhone,
            ZipCode: formData2.ZipCode,
            houseNumber: formData2.houseNumber,
            roadName: formData2.roadName,
            nearbyLandmark: formData2.nearbyLandmark,
            address: formData2.address,
        }

        if (name == "fullName") {
            if (!value) {
                setFormDataErr2((prev) => ({
                    ...prev,
                    fullName: "Full Name is required!"
                }))

            } else if (value.length < 3) {
                setFormDataErr2((prev) => ({
                    ...prev,
                    fullName: "At least 3 characters required!"
                }))
            } else {
                setFormDataErr2((prev) => ({
                    ...prev,
                    fullName: ""
                }))
            }
            dataobject.fullName = value
        } else if (name == "phone") {
            const phone = /^\d{10}$/;
            if (!value) {
                setFormDataErr2((prev) => ({
                    ...prev,
                    phone: "Phone number is required!"
                }))
            } else if (!phone.test(value)) {
                setFormDataErr2((prev) => ({
                    ...prev,
                    phone: "Phone number should be 10-digit!"
                }))
            } else {
                setFormDataErr2((prev) => ({
                    ...prev,
                    phone: ""
                }))
            }
            dataobject.phone = value
        } else if (name == "alternamtivePhone") {
            const phone = /^\d{10}$/;
            if (!value) {
                setFormDataErr2((prev) => ({
                    ...prev,
                    alternamtivePhone: "Phone number is required!"
                }))
            } else if (!phone.test(value)) {
                setFormDataErr2((prev) => ({
                    ...prev,
                    alternamtivePhone: "Phone number should be 10-digit!"
                }))
            } else {
                setFormDataErr2((prev) => ({
                    ...prev,
                    alternamtivePhone: ""
                }))
            }
            dataobject.alternamtivePhone = value


        } else if (name == "ZipCode") {

            if (!value) {
                setFormDataErr2((prev) => ({
                    ...prev,
                    ZipCode: "Zip Code is required!"
                }))

            } else {
                setFormDataErr2((prev) => ({
                    ...prev,
                    ZipCode: ""
                }))
            }
            dataobject.ZipCode = value

        } else if (name == "houseNumber") {

            if (!value) {
                setFormDataErr2((prev) => ({
                    ...prev,
                    houseNumber: "House Number is required!"
                }))

            } else {
                setFormDataErr2((prev) => ({
                    ...prev,
                    houseNumber: ""
                }))
            }
            dataobject.houseNumber = value

        } else if (name == "roadName") {

            if (!value) {
                setFormDataErr2((prev) => ({
                    ...prev,
                    roadName: "Road Name is required!"
                }))

            } else {
                setFormDataErr2((prev) => ({
                    ...prev,
                    roadName: ""
                }))
            }
            dataobject.roadName = value

        } else if (name == "nearbyLandmark") {

            if (!value) {
                setFormDataErr2((prev) => ({
                    ...prev,
                    nearbyLandmark: "Nearby Landmark is required!"
                }))

            } else {
                setFormDataErr2((prev) => ({
                    ...prev,
                    nearbyLandmark: ""
                }))
            }
            dataobject.nearbyLandmark = value

        } else if (name == "address") {

            if (!value) {
                setFormDataErr2((prev) => ({
                    ...prev,
                    address: "Address is required!"
                }))

            } else {
                setFormDataErr2((prev) => ({
                    ...prev,
                    address: ""
                }))
            }
            dataobject.address = value

        }

        setFormData2(dataobject)


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
                setFormDataErr2((prev) => ({
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
            setFormData2((prev) => ({
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
                setFormDataErr2((prev) => ({
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
            setFormData2((prev) => ({
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
                setFormDataErr2((prev) => ({
                    ...prev,
                    city: "City is required",
                }));
            } else {
                setFormDataErr2((prev) => ({
                    ...prev,
                    city: "",
                }));
            }
        }
        setCountryData((prev) => ({
            ...prev,
            cityName: value,
        }));

        setFormData2((prev) => ({
            ...prev,
            city: value
        }))
    };

    function validation() {
        let errorCount = 0;

        if (!fullName) {
            setFormDataErr2((prev) => ({
                ...prev,
                fullName: "Full Name is Required"
            }))
            errorCount++
        } else {
            setFormDataErr2((prev) => ({
                ...prev,
                fullName: ""
            }))
        }

        const phoneRegex = /^\d{10}$/;
        if (!phone) {
            setFormDataErr2((prev) => ({
                ...prev,
                phone: "Phone No. is Required"
            }))
            errorCount++
        } else if (!phoneRegex.test(phone)) {
            setFormDataErr2((prev) => ({
                ...prev,
                phone: "Phone number should be 10-digit"
            }))
            errorCount++
        }
        else {
            setFormDataErr2((prev) => ({
                ...prev,
                phone: ""
            }))
        }

        if (!alternamtivePhone) {
            setFormDataErr2((prev) => ({
                ...prev,
                alternamtivePhone: "Alternative Phone No. is Required"
            }))
            errorCount++
        } else if (!phoneRegex.test(phone)) {
            setFormDataErr2((prev) => ({
                ...prev,
                alternamtivePhone: "Alternative Phone number should be 10-digit"
            }))
            errorCount++
        }
        else {
            setFormDataErr2((prev) => ({
                ...prev,
                alternamtivePhone: ""
            }))
        }

        if (!ZipCode) {
            setFormDataErr2((prev) => ({
                ...prev,
                ZipCode: "Zip Code is Required"
            }))
            errorCount++
        } else {
            setFormDataErr2((prev) => ({
                ...prev,
                ZipCode: ""
            }))
        }

        if (!address) {
            setFormDataErr2((prev) => ({
                ...prev,
                address: "Address is Required"
            }))
            errorCount++
        } else {
            setFormDataErr2((prev) => ({
                ...prev,
                address: ""
            }))
        }
        if (!houseNumber) {
            setFormDataErr2((prev) => ({
                ...prev,
                houseNumber: "House Number is Required"
            }))
            errorCount++
        } else {
            setFormDataErr2((prev) => ({
                ...prev,
                houseNumber: ""
            }))
        }

        if (!roadName) {
            setFormDataErr2((prev) => ({
                ...prev,
                roadName: "Road Name is Required"
            }))
            errorCount++
        } else {
            setFormDataErr2((prev) => ({
                ...prev,
                roadName: ""
            }))
        }
        if (!nearbyLandmark) {
            setFormDataErr2((prev) => ({
                ...prev,
                nearbyLandmark: "Nearby Landmark is Required"
            }))
            errorCount++
        } else {
            setFormDataErr2((prev) => ({
                ...prev,
                nearbyLandmark: ""
            }))
        }

        if (!countryData?.countryName) {
            setFormDataErr2((prev) => ({
                ...prev,
                country: "Country is Required"
            }))
            errorCount++
        } else {
            setFormDataErr2((prev) => ({
                ...prev,
                country: ""
            }))
        }

        countryData?.countryName
        if (!countryData?.stateName) {
            setFormDataErr2((prev) => ({
                ...prev,
                state: "State is Required"
            }))
            errorCount++
        } else {
            setFormDataErr2((prev) => ({
                ...prev,
                state: ""
            }))
        }
        if (!countryData?.cityName) {
            setFormDataErr2((prev) => ({
                ...prev,
                city: "City is Required"
            }))
            errorCount++
        } else {
            setFormDataErr2((prev) => ({
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

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSave = async () => {
        const isError = validation();
        if (!isError) {
            setIsSubmitting(true)
            const data = {
                ...formData2, country: countryData?.countryName,
                state: countryData?.stateName,
                city: countryData?.cityName
            }
            try {
                const response = await customerService.addAddress({ ...data, customerId: currentSupplierId })
                clearData();
                setIsSubmitting(false);
                setOpenModal3(false);
                toast.success("Address Added Successfully")
                getShippingAddress(currentSupplierId, "new Address")
            } catch (error) {
                setIsSubmitting(false)
                console.log("Error while adding address", error);
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

        setFormData2({
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


    const handleKeyPress = (e) => {
        const value = e.target.value;
        const cleanedValue = value.replace(/[^6-9\d]/g, ""); //Allow only number starts with 6 to 9
        if (cleanedValue.trim() !== "") {
            e.target.value = cleanedValue;
        } else {
            e.target.value = ""; // Clear the input if no valid characters are present
        }
    };

    return (
        <div>

            <Transition appear show={openModal3} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-[9999]"
                    onClose={() => { }}
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
                    <div
                        className="fixed inset-0 "
                    >
                        <div
                            className={`flex min-h-full justify-center text-center p-6 items-center `}
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
                                    className={`w-full transform rounded-md text-left align-middle shadow-xl transition-all max-w-3xl ${isDark ? "bg-darkSecondary text-white" : "bg-light"}`}
                                >
                                    <div
                                        className={`relative overflow-hidden py-4 px-5 text-lightModalHeaderColor flex justify-between bg-white border-b border-lightBorderColor dark:bg-darkInput dark:border-b dark:border-darkSecondary `}
                                    >
                                        <h2 className="capitalize leading-6 tracking-wider text-xl font-semibold text-lightModalHeaderColor dark:text-darkTitleColor">
                                            Add Address
                                        </h2>
                                        <button onClick={() => setOpenModal3(false)} className="text-lightmodalCrosscolor hover:text-lightmodalbtnText text-[22px]">
                                            <Icon icon="heroicons-outline:x" />
                                        </button>
                                    </div>

                                    <div className="p-4 overflow-y-auto max-h-[50vh]">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="">
                                                <input
                                                    type="text"
                                                    name="fullName"
                                                    value={formData2.fullName}
                                                    onChange={handleChange}
                                                    placeholder="Full Name"
                                                    className="form-control py-2"
                                                />
                                                <span className="text-red-800">{formDataErr2?.fullName}</span>
                                            </div>

                                            <div>
                                                <input
                                                    type="text"
                                                    name="phone"
                                                    onInput={handleKeyPress}
                                                    value={formData2.phone}
                                                    onChange={handleChange}
                                                    placeholder="Phone Number"
                                                    className="form-control py-2"
                                                />
                                                <span className="text-red-800">{formDataErr2?.phone}</span>

                                            </div>

                                            <div>
                                                <input
                                                    type="text"
                                                    name="alternamtivePhone"
                                                    onInput={handleKeyPress}
                                                    value={formData2.alternamtivePhone}
                                                    onChange={handleChange}
                                                    placeholder="Alternative Phone Number"
                                                    className="form-control py-2"
                                                />
                                                <span className="text-red-800">{formDataErr2?.alternamtivePhone}</span>

                                            </div>

                                            <div>
                                                <input
                                                    type="text"
                                                    name="ZipCode"
                                                    value={formData2.ZipCode}
                                                    onChange={handleChange}
                                                    placeholder="Pincode"
                                                    className="form-control py-2"
                                                />
                                                <span className="text-red-800">{formDataErr2?.ZipCode}</span>

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
                                                <span className="text-red-800">{formDataErr2?.country}</span>
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
                                                <span className="text-red-800">{formDataErr2?.state}</span>
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
                                                <span className="text-red-800">{formDataErr2?.city}</span>
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    name="houseNumber"
                                                    value={formData2.houseNumber}
                                                    onChange={handleChange}
                                                    placeholder="House Number"
                                                    className="form-control py-2"

                                                />
                                                <span className="text-red-800">{formDataErr2?.houseNumber}</span>
                                            </div>

                                            <div>
                                                <input
                                                    type="text"
                                                    name="roadName"
                                                    value={formData2.roadName}
                                                    onChange={handleChange}
                                                    placeholder="Road Name"
                                                    className="form-control py-2"

                                                />

                                                <span className="text-red-800">{formDataErr2?.roadName}</span>

                                            </div>

                                            <div>
                                                <input
                                                    type="text"
                                                    name="nearbyLandmark"
                                                    value={formData2.nearbyLandmark}
                                                    onChange={handleChange}
                                                    placeholder="Nearby Landmark"
                                                    className="form-control py-2"
                                                />
                                                <span className="text-red-800">{formDataErr2?.nearbyLandmark}</span>

                                            </div>

                                            <div>
                                                <input
                                                    type="text"
                                                    name="address"
                                                    value={formData2.address}
                                                    onChange={handleChange}
                                                    placeholder="Address"
                                                    className="form-control py-2"
                                                />
                                                <span className="text-red-800">{formDataErr2?.address}</span>

                                            </div>

                                        </div>
                                    </div>

                                    <div className="px-4 py-3 flex justify-end space-x-3 border-t border-slate-100 dark:border-darkSecondary bg-white dark:bg-darkInput">
                                        <Button
                                            text="Cancel"
                                            className="bg-lightmodalBgBtnHover lightmodalBgBtn text-white hover:bg-lightmodalBgBtn hover:text-lightmodalbtnText px-4 py-2 rounded"
                                            onClick={() => setOpenModal3(false)}
                                        />
                                        <Button
                                            text="Save"
                                            className={` bg-lightBtn hover:bg-lightBtnHover dark:bg-darkBtn hover:dark:bg-darkBtnHover text-white dark:hover:text-black-900  px-4 py-2 rounded`}
                                            onClick={handleSave}
                                            isLoading={isSubmitting}
                                        />
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>


        </div>
    )
}

export default AddAddressModel