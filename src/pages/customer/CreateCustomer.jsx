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
import Button from "@/components/ui/Button";
import customerService from "@/services/customer/customer.service";



// const levelList = [
//     {
//         name: "Vendor",
//         value: "vendor"
//     },
//     {
//         name: "Business",
//         value: "business"
//     },
//     {
//         name: "Branch",
//         value: "branch"
//     },
//     {
//         name: "Warehouse",
//         value: "warehouse"
//     },
// ]


const CreateCustomer = ({ noFade, scrollContent }) => {

    // useEffect(() => {
    //     if (roleId !== 1) {
    //         navigate("/dashboard");
    //         return;
    //     }
    //     return;
    // }, []);

    const { user: currentUser, isAuth: isAuthenticated } = useSelector((state) => state.auth);
    // console.log("store user", currentUser);

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
    const name = location?.state?.name;
    const id = location?.state?.id;

    console.log("id", id);
    console.log("id", location);

    const [pageLoading, setPageLoading] = useState(true);
    const [showLoadingModal, setShowLoadingModal] = useState(false);

    const [activeBusinessUnits, setActiveBusinessUnits] = useState([]);
    const [levelResult, setLevelResult] = useState(0)
    const [activeBranches, setActiveBranches] = useState([]);
    const [activeWarehouse, setActiveWarehouse] = useState([]);
    const [roleList, setRoleList] = useState([]);




    const [formData, setFormData] = useState({
        level: "",
        businessUnit: "",
        branch: "",
        warehouse: "",
        roleId: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        gender: "",
        password: "",
        confirmPassword: "",

        country: "",
        city: "",
        state: "",
        address: "",
        ZipCode: "",
    });

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


    console.log("formData", formData);


    const [formDataErr, setFormDataErr] = useState({
        level: "",
        businessUnit: "",
        branch: "",
        warehouse: "",
        roleId: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",

        gender: "",
        password: "",
        confirmPassword: "",

        country: "",
        city: "",
        state: "",
        address: "",
        ZipCode: "",

        icon: "",
    });

    console.log("formDataErr", formDataErr);

    const {
        level,
        businessUnit,
        branch,
        warehouse,
        roleId,
        firstName,
        lastName,
        email,
        phone,
        password,
        confirmPassword,
        gender,
        country,
        city,
        state,
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

        if (!lastName) {
            setFormDataErr((prev) => ({
                ...prev,
                lastName: "Last Name Is Required.",
            }));
            errorCount++
        } else {
            setFormDataErr((prev) => ({
                ...prev,
                lastName: "",
            }));
        }

        if (!gender) {
            setFormDataErr((prev) => ({
                ...prev,
                gender: "Gender is Required"
            }))
            errorCount++
        } else {
            setFormDataErr((prev) => ({
                ...prev,
                gender: ""
            }))
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setFormDataErr((prev) => ({
                ...prev,
                email: "Email is Required"
            }))
            errorCount++
        } else if (!emailRegex.test(email)) {
            setFormDataErr((prev) => ({
                ...prev,
                email: "Enter valid Email "
            }))
            errorCount++
        }
        else {
            setFormDataErr((prev) => ({
                ...prev,
                email: ""
            }))
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

        if (!ZipCode) {
            setFormDataErr((prev) => ({
                ...prev,
                ZipCode: "ZipCode Code Is Required.",
            }));
            errorCount++

        } else {
            setFormDataErr((prev) => ({
                ...prev,
                ZipCode: "",
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

        if (!id) {

            if (!password) {
                setFormDataErr((prev) => ({
                    ...prev,
                    password: "Password is Required"
                }))
                errorCount++
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    password: ""
                }))
            }

            if (!confirmPassword) {
                setFormDataErr((prev) => ({
                    ...prev,
                    confirmPassword: "Confirm Password is Required"
                }))
                errorCount++
            } else if (confirmPassword !== password) {
                setFormDataErr((prev) => ({
                    ...prev,
                    confirmPassword: "Confirm Password is Required"
                }))
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    confirmPassword: ""
                }))
            }
        }
        if (ImgErr) {
            errorCount++
        }

        // if (id == null) {
        //     if (!selectedFile) {
        //         setFormDataErr((prev) => ({
        //             ...prev,
        //             icon: "Logo is required."
        //         }))
        //         errorCount++
        //     }
        // }
        console.log("errorCount", errorCount);

        if (errorCount > 0) {
            return true
        } else {
            return false
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
                    firstName: "Firs tName Is Required.",
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

        if (name === "lastName") {
            if (value === "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    lastName: "Last Name Is Required.",
                }));
            } else if (value?.length <= 3) {
                setFormDataErr((prev) => ({
                    ...prev,
                    lastName: "Minimum 3 characters required.",
                }));
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    lastName: "",
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
        if (name === "phone") {
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(value) || value.length === 0) {
                setFormDataErr((prev) => ({ ...prev, phone: "Enter a valid phone number." }));
            } else {
                setFormDataErr((prev) => ({ ...prev, phone: "" }));
            }
        }

        if (name == "gender") {
            if (value == "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    gender: "gender is Required"
                }))
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    gender: ""
                }))
            }
        }

        if (name == "ZipCode") {
            if (value === "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    ZipCode: "Zip Code Is Required.",
                }));
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    ZipCode: "",
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

        if (name == "password") {
            if (value == "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    password: "Password is Required"
                }))
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    password: ""
                }))
            }
        }

        if (name == "confirmPassword") {
            if (value == "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    confirmPassword: "Confirm Password is Required"
                }))
            } else if (password !== value) {
                setFormDataErr((prev) => ({
                    ...prev,
                    confirmPassword: "Password doesn't Match"
                }))
            }
            else {
                setFormDataErr((prev) => ({
                    ...prev,
                    confirmPassword: ""
                }))
            }
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        if (level) {
            console.log("level", level);

            if (level === "vendor") {
                setLevelResult(1);
            } else if (level === "business") {
                setLevelResult(2)
            } else if (level === "branch") {
                setLevelResult(3)
            } else if (level === "warehouse") {
                setLevelResult(4)
            }
        } else {
            setLevelResult(0)
        }
    }, [level])


    useEffect(() => {
        if (businessUnit) {
            getBranchByBusiness(businessUnit)
        }
    }, [businessUnit]);

    async function getBranchByBusiness(id) {

        try {
            const response = await warehouseService.getBranchByBusiness(id);

            setActiveBranches(response.data)


        } catch (error) {
            console.log("error while getting branch by business unit");
        }
    }

    useEffect(() => {
        if (branch) {
            getWarehouseByBranch(branch)
        }
    }, [branch]);

    async function getWarehouseByBranch(id) {
        try {
            const response = await warehouseService.getWarehouseByBranch(id);
            setActiveWarehouse(response.data)
        } catch (error) {
            console.log("error while getting warehouse by branch");
        }
    }




    //---------- Adding & Editing the Organiser ----------

    const onSubmit = async (e) => {
        e.preventDefault();
        setIsViewed(false);
        const error = validationFunction();
        setLoading(true);
        if (error) {
            console.log("error", error);

            setLoading(false);
            return
        } else {
            try {
                const clientId = localStorage.getItem("saas_client_clientId");
                const payload = new FormData();
                payload.append("clientId", clientId);
                payload.append("profileImage", selectedFile);
                payload.append("firstName", firstName);
                payload.append("lastName", lastName);
                payload.append("gender", gender);
                payload.append("email", email);
                payload.append("phone", phone);
                payload.append("country", countryData?.countryName);
                payload.append("state", countryData?.stateName);
                payload.append("city", countryData?.cityName);
                payload.append("address", address);
                payload.append("ZipCode", ZipCode);

                console.log("form asd", formData);


                if (password) {
                    payload.append("password", password);
                }

                if (id) {
                    payload.append("customerId", id);
                    const response = await customerService.update(payload)
                    toast.success(response?.data?.message);
                } else {
                    const response = await customerService.create(payload);
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
                    level: "",
                    businessUnit: "",
                    branch: "",
                    warehouse: "",
                    roleId: "",
                    firstName: "",
                    lastName: "",
                    email: "",
                    phone: "",
                    gender: "",
                    password: "",
                    confirmPassword: "",

                    country: "",
                    city: "",
                    state: "",
                    address: "",
                    ZipCode: "",
                });
                setFormDataErr({
                    level: "",
                    businessUnit: "",
                    branch: "",
                    warehouse: "",
                    roleId: "",
                    firstName: "",
                    lastName: "",
                    email: "",
                    phone: "",

                    gender: "",
                    password: "",
                    confirmPassword: "",

                    country: "",
                    city: "",
                    state: "",
                    address: "",
                    ZipCode: "",

                    icon: "",
                })
                setImgPreviwe(null);
                setselectedFile(null);
                setLoading(false);
                navigate("/customer-list");

            } catch (error) {
                setLoading(false);
                console.log("error while creating branch", error);
            }
        }
    };
    // -----setting the data if contain id ----------
    useEffect(() => {
        if (id) {
            if (name == "view") {
                setIsViewed(true)
            } else {
                setIsViewed(false)
            }
            async function getData() {
                try {
                    setPageLoading(true)
                    const response = await customerService.getOne(id);
                    console.log('Response get customer', response?.data);
                    const baseAddress = response?.data;


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
                        level: level,
                        businessUnit: baseAddress.businessUnit,
                        branch: baseAddress.branch,
                        warehouse: baseAddress.warehouse,
                        roleId: baseAddress.role,
                        firstName: baseAddress.firstName,
                        lastName: baseAddress.lastName,
                        email: baseAddress.email,
                        phone: baseAddress.phone,
                        gender: baseAddress.gender,

                        country: baseAddress.country,
                        city: baseAddress.city,
                        state: baseAddress.state,
                        address: baseAddress.address,
                        ZipCode: baseAddress.ZipCode,

                    }));

                    setImgPreviwe(`http://localhost:8088/profile/${baseAddress?.profileImage}`)

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
            getData()
        } else {
            setPageLoading(false)
        }
    }, [id, countryList]);





    useEffect(() => {
        async function getActiveBusinessUnit() {
            console.log("yess");

            try {
                const response = await warehouseService.getActiveBusinessUnit();
                console.log("respone active", response);
                setActiveBusinessUnits(response?.data?.businessUnits)
            } catch (error) {
                console.log("error while getting the active business unit", error);
            }
        }

        getActiveBusinessUnit()
        getAllactiveRoles()
    }, [])

    async function getAllactiveRoles() {
        try {
            const response = await employeeService.getActiveRoles();
            setRoleList(response?.listOfRoles)
        } catch (error) {
            console.log("Error while getting active role list", error);
        }
    }


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
                    icon: "Logo is required.",
                }));
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    icon: "",
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
                                            className={`fromGroup   ${formDataErr?.firstName !== "" ? "has-error" : ""
                                                } `}
                                        >
                                            <p className="form-label">
                                                First Name <span className="text-red-500">*</span>
                                            </p>
                                            <input
                                                name="firstName"
                                                type="text"
                                                placeholder="Enter Name"
                                                value={firstName}
                                                onChange={handleChange}
                                                className="form-control py-2"
                                                disabled={isViewed}
                                            />
                                            {
                                                <p className="text-sm text-red-500">
                                                    {formDataErr.firstName}
                                                </p>
                                            }
                                        </label>

                                        <label
                                            className={`fromGroup   ${formDataErr?.lastName !== "" ? "has-error" : ""
                                                } `}
                                        >
                                            <p className="form-label">
                                                Last Name <span className="text-red-500">*</span>
                                            </p>
                                            <input
                                                name="lastName"
                                                type="text"
                                                placeholder="Enter Last Name"
                                                value={lastName}
                                                onChange={handleChange}
                                                className="form-control py-2"
                                                disabled={isViewed}
                                            />
                                            {
                                                <p className="text-sm text-red-500">
                                                    {formDataErr.lastName}
                                                </p>
                                            }
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
                                                disabled={isViewed}

                                                className="form-control py-2"
                                            />
                                            {<p className="text-sm text-red-500">{formDataErr.email}</p>}
                                        </label>

                                        <label
                                            className={`fromGroup   ${formDataErr?.phone !== "" ? "has-error" : ""
                                                } `}
                                        >
                                            <p className=" form-label">
                                                Phone <span className="text-red-500">*</span>
                                            </p>
                                            <input
                                                name="phone"
                                                type="text"
                                                placeholder="Enter contact number"
                                                value={phone}
                                                onChange={handleChange}
                                                className="form-control py-2"
                                                disabled={isViewed}
                                                onInput={handleKeyPress}

                                            />
                                            {<p className="text-sm text-red-500">{formDataErr.phone}</p>}
                                        </label>
                                        <label className={`fromGroup   ${formDataErr?.gender !== "" ? "has-error" : ""
                                            } `}>
                                            <p className=" form-label">
                                                Gender
                                                <span className="text-red-500">*</span>
                                            </p>
                                            <select
                                                name="gender"
                                                value={gender}
                                                className="form-control outline-none w-[100%] rounded-md px-4 py-2.5 border border-lightborderInputColor dark:border-darkSecondary text-lightinputTextColor dark:placeholder-darkPlaceholder bg-lightBgInputColor dark:bg-darkIconAndSearchBg dark:text-white"
                                                onChange={handleChange}
                                                disabled={isViewed}
                                            >
                                                <option value=""> Select</option>
                                                <option value="Male"> Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other"> Other</option>
                                                <option value="Prefer not to say"> Prefer not to say</option>
                                            </select>
                                            {<p className="text-red-600  text-xs">{formDataErr.gender}</p>}
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
                                            className={`fromGroup    ${formDataErr?.ZipCode !== "" ? "has-error" : ""
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
                                            />
                                            {
                                                <p className="text-sm text-red-500">
                                                    {formDataErr.ZipCode}
                                                </p>
                                            }
                                        </label>

                                        {/* address one */}
                                        <label
                                            className={`fromGroup col-span-2  ${formDataErr?.address !== "" ? "has-error" : ""
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
                                    </div>

                                    <div
                                        className={`fromGroup  mt-2  ${formDataErr?.icon !== "" ? "has-error" : ""
                                            } `}
                                    >
                                        <p className="form-label">
                                            Profile photo
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
                                                        click to upload
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

                                    <div className="grid lg:grid-cols-2 grid-col-1 flex-col gap-3">
                                        <div className="  relative ">
                                            <label>
                                                <p className="form-label">
                                                    Password <span className="text-red-500">*</span>
                                                </p>
                                                <input
                                                    name="password"
                                                    type={isPasswordVissible ? "text" : "password"}
                                                    value={password}
                                                    placeholder="Enter Password"
                                                    onChange={handleChange}
                                                    disabled={isViewed}
                                                    className="form-control outline-none w-[100%] rounded-md px-4 py-2 border border-lightborderInputColor dark:border-darkSecondary text-lightinputTextColor dark:placeholder-darkPlaceholder bg-lightBgInputColor dark:bg-darkIconAndSearchBg dark:text-white"
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute right-0 top-12 transform -translate-y-1/2 p-2"
                                                    onClick={(e) =>
                                                        setIsPasswordVissile((prev) => !prev)
                                                    }
                                                >
                                                    {isPasswordVissible ? <FaEye /> : <FaEyeSlash />}
                                                </button>
                                                {<p className="text-red-600  text-xs"> {formDataErr.password}</p>}
                                            </label>
                                        </div>

                                        <div className=" relative">
                                            <label>
                                                <p className="form-label">
                                                    Confirm Password <span className="text-red-500">*</span>
                                                </p>
                                                <input
                                                    name="confirmPassword"
                                                    type={isConfirmPasswordVissible ? "text" : "password"}
                                                    value={confirmPassword}
                                                    placeholder="Enter Confirm Password"
                                                    onChange={handleChange}
                                                    disabled={isViewed}
                                                    className="form-control outline-none w-[100%] rounded-md px-4 py-2 border border-lightborderInputColor dark:border-darkSecondary text-lightinputTextColor dark:placeholder-darkPlaceholder bg-lightBgInputColor dark:bg-darkIconAndSearchBg dark:text-white"
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute right-0 top-12 transform -translate-y-1/2 p-2"
                                                    onClick={(e) =>
                                                        setConfirmIsPasswordVissile((prev) => !prev)
                                                    }
                                                >
                                                    {isConfirmPasswordVissible ? <FaEye /> : <FaEyeSlash />}
                                                </button>

                                                {<p className="text-red-600  text-xs"> {formDataErr.confirmPassword}</p>}
                                            </label>
                                        </div>


                                    </div>

                                    {
                                        isViewed && (
                                            <div className="lg:col-span-2 col-span-1">
                                                <div className="flex justify-end py-5 ">
                                                    <Button
                                                        text="Edit"
                                                        // className="border bg-blue-gray-300 rounded px-5 py-2"
                                                        className={`bg-lightBtn dark:bg-darkBtn p-3 rounded-md text-white  text-center btn btn inline-flex justify-center`}
                                                        onClick={() => setIsViewed(false)}
                                                        isLoading={loading}
                                                    />
                                                </div>
                                            </div>


                                        )
                                    }


                                    {
                                        !isViewed && (
                                            <div className="">
                                                <div className=" flex flex-row items-center justify-between py-5">



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
                                        )
                                    }



                                </form>

                                {
                                    id ?
                                        <button
                                            onClick={() => navigate("/create-customer/add/address", { state: { customerId: id } })}
                                            className={`bg-lightBtn dark:bg-darkBtn p-3 rounded-md text-white  text-center btn btn inline-flex justify-center`}
                                        >
                                            Add Address
                                        </button>
                                        : ""
                                }


                            </div>
                        </Card>
                    </div>
            }
        </>

    );
};

export default CreateCustomer;
