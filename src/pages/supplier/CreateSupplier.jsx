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


const CreateSupplier = ({ noFade, scrollContent }) => {

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
            name: "Warehouse",
            value: "warehouse"
        },
    ])





    const [isDark] = useDarkMode();
    const dispatch = useDispatch();
    const location = useLocation();
    const row = location?.state?.row;
    const id = location?.state?.id;

    console.log("id", id);

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

        name: '',
        contactPerson: '',
        emailContact: "",
        contactNumber: "",
        url: "",
        GstVanNumber: "",
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
                        name: "Warehouse",
                        value: "warehouse"
                    },
                ])
            } else if (currentUser.isBuLevel) {
                setLevelList([
                    {
                        name: "Warehouse",
                        value: "warehouse"
                    },
                ]);
                setFormData((prev) => ({ ...prev, businessUnit: currentUser.businessUnit }))
            } else if (currentUser.isBranchLevel) {
                setLevelList([
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

    }, [currentUser]);




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


        name: '',
        contactPerson: '',
        emailContact: "",
        contactNumber: "",
        url: "",
        GstVanNumber: "",

        country: "",
        city: "",
        state: "",
        address: "",
        ZipCode: "",

        icon: "",
    });







    const {
        level,
        businessUnit,
        branch,
        warehouse,

        name,
        contactPerson,
        emailContact,
        contactNumber,
        url,
        GstVanNumber,

        country,
        city,
        state,
        address,
        ZipCode,

    } = formData;



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
    }, [level]);




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

        console.log("ssss");


        if (!name) {
            setFormDataErr((prev) => ({
                ...prev,
                name: "Name Is Required.",
            }));
            errorCount++
        } else {
            setFormDataErr((prev) => ({
                ...prev,
                name: "",
            }));
        }

        // if (!contactPerson) {
        //     setFormDataErr((prev) => ({
        //         ...prev,
        //         contactPerson: "Contact Person Is Required.",
        //     }));
        //     errorCount++
        // } else {
        //     setFormDataErr((prev) => ({
        //         ...prev,
        //         contactPerson: "",
        //     }));
        // }

        // if (!url) {
        //     setFormDataErr((prev) => ({
        //         ...prev,
        //         url: "URL Is Required.",
        //     }));
        //     errorCount++
        // } else {
        //     setFormDataErr((prev) => ({
        //         ...prev,
        //         url: "",
        //     }));
        // }

        if (!GstVanNumber) {
            setFormDataErr((prev) => ({
                ...prev,
                GstVanNumber: "Gst Van Number Is Required.",
            }));
            errorCount++
        } else {
            setFormDataErr((prev) => ({
                ...prev,
                GstVanNumber: "",
            }));
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailContact) {
            setFormDataErr((prev) => ({
                ...prev,
                emailContact: "Email is Required"
            }))
            errorCount++
        } else if (!emailRegex.test(emailContact)) {
            setFormDataErr((prev) => ({
                ...prev,
                emailContact: "Enter valid Email "
            }))
            errorCount++
        } else {
            setFormDataErr((prev) => ({
                ...prev,
                emailContact: ""
            }))
        }


        const phoneRegex = /^[0-9]{10}$/;
        if (!contactNumber) {
            setFormDataErr((prev) => ({
                ...prev,
                contactNumber: "Phone Number Is Required.",
            }));
            errorCount++
        } else {
            if (!phoneRegex.test(contactNumber) || contactNumber.length === 0) {
                setFormDataErr((prev) => ({ ...prev, contactNumber: "Enter a valid phone number." }));
            } else {
                setFormDataErr((prev) => ({ ...prev, contactNumber: "" }));
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
                ZipCode: "Zip Code Is Required.",
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


        if (level == "") {
            setFormDataErr((prev) => ({
                ...prev,
                level: "Level Is Required.",
            }));
            errorCount++
        } else {
            setFormDataErr((prev) => ({
                ...prev,
                level: "",
            }));
            
        }

        if (level == "business") {
            if (!businessUnit) {
                setFormDataErr((prev) => ({
                    ...prev,
                    businessUnit: "Business Unit Is Required.",
                }));
                errorCount++
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    businessUnit: "",
                }));
            }

        }

        if (level == "branch") {

            if (!businessUnit) {
                setFormDataErr((prev) => ({
                    ...prev,
                    businessUnit: "Business Unit Is Required.",
                }));
                errorCount++
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    businessUnit: "",
                }));
            }

            if (!branch) {
                setFormDataErr((prev) => ({
                    ...prev,
                    branch: "Branch Is Required.",
                }));
                errorCount++
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    branch: "",
                }));
            }


        }

        if (level == "warehouse") {
            if (!businessUnit) {
                setFormDataErr((prev) => ({
                    ...prev,
                    businessUnit: "Business Unit Is Required.",
                }));
                errorCount++
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    businessUnit: "",
                }));
            }
            if (!branch) {
                setFormDataErr((prev) => ({
                    ...prev,
                    branch: "Branch Is Required.",
                }));
                errorCount++
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    branch: "",
                }));
            }
            if (!warehouse) {
                setFormDataErr((prev) => ({
                    ...prev,
                    warehouse: "Warehouse Is Required.",
                }));
                errorCount++
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    warehouse: "",
                }));
            }
        }

        console.log("errorCount", errorCount);

        // if (id == null) {
        //     if (!selectedFile) {
        //         setFormDataErr((prev) => ({
        //             ...prev,
        //             icon: "Logo is required."
        //         }))
        //         errorCount++
        //     }
        // }
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

        if (name === "name") {
            if (value === "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    name: "Name Is Required.",
                }));
            } else if (value?.length <= 3) {
                setFormDataErr((prev) => ({
                    ...prev,
                    name: "Minimum 3 characters required.",
                }));
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    name: "",
                }));
            }
        }

        // if (name === "contactPerson") {
        //     if (value === "") {
        //         setFormDataErr((prev) => ({
        //             ...prev,
        //             contactPerson: "Contact Person Is Required.",
        //         }));
        //     } else if (value?.length <= 3) {
        //         setFormDataErr((prev) => ({
        //             ...prev,
        //             contactPerson: "Minimum 3 characters required.",
        //         }));
        //     } else {
        //         setFormDataErr((prev) => ({
        //             ...prev,
        //             contactPerson: "",
        //         }));
        //     }
        // }
        if (name == "emailContact") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value == "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    emailContact: "Email is Required"
                }))
            } else if (!emailRegex.test(value)) {
                setFormDataErr((prev) => ({
                    ...prev,
                    emailContact: "Enter valid Email "
                }))
            }
            else {
                setFormDataErr((prev) => ({
                    ...prev,
                    emailContact: ""
                }))
            }
        }
        if (name === "contactNumber") {
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(value) || value.length === 0) {
                setFormDataErr((prev) => ({ ...prev, contactNumber: "Enter a valid phone number." }));
            } else {
                setFormDataErr((prev) => ({ ...prev, contactNumber: "" }));
            }
        }

        // if (name == "url") {
        //     if (value === "") {
        //         setFormDataErr((prev) => ({
        //             ...prev,
        //             url: "URL Is Required.",
        //         }));
        //     } else {
        //         setFormDataErr((prev) => ({
        //             ...prev,
        //             url: "",
        //         }));
        //     }
        // }

        if (name == "GstVanNumber") {
            if (value === "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    GstVanNumber: "Gst Van Number Is Required.",
                }));
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    GstVanNumber: "",
                }));
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

        if (name === "businessUnit" && value) {
            setActiveBranches([]);
            setFormData((prev) => ({
                ...prev,
                branch: "",
                warehouse: ""
            }));
            setFormDataErr((prev) => ({
                ...prev,
                branch: "",
                warehouse: ""
            }));
        }

         if (name == "level") {
            if (value === "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    level: "Level Is Required.",
                }));
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    level: "",
                }));
            }
        }



        if (name == "businessUnit") {
            if (value == "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    businessUnit: "Business Unit is Required"
                }))
            } else {
                setActiveBranches([])
                setFormData((prev) => ({
                    ...prev,
                    branchId: ""
                }))
                setFormDataErr((prev) => ({
                    ...prev,
                    businessUnit: ""
                }))
            }
        }

        if (name == "branch") {
            if (value == "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    branch: "Branch is Required"
                }))
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    branch: ""
                }))
            }
        }

        if (name == "warehouse") {
            if (value == "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    warehouse: "Warehouse is Required"
                }))
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    warehouse: ""
                }))
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
                    level: level,
                    businessUnit: businessUnit,
                    branch: branch,
                    warehouse: warehouse,
                    supplierId: id,
                    name,
                    contactPerson,
                    emailContact,
                    contactNumber,
                    url,
                    GstVanNumber,
                    city: countryData?.cityName,
                    state: countryData?.stateName,
                    country: countryData?.countryName,
                    ZipCode: ZipCode,
                    address: address,
                }

                if (id) {
                    const response = await supplierService.update(dataObject)
                    toast.success(response?.data?.message);
                } else {
                    const response = await supplierService.create(dataObject);
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
                    name: '',
                    contactPerson: '',
                    emailContact: "",
                    contactNumber: "",
                    url: "",
                    GstVanNumber: "",
                    country: "",
                    city: "",
                    state: "",
                    address: "",
                    ZipCode: "",
                });
                setFormDataErr({
                    name: '',
                    contactPerson: '',
                    emailContact: "",
                    contactNumber: "",
                    url: "",
                    GstVanNumber: "",
                    country: "",
                    city: "",
                    state: "",
                    address: "",
                    ZipCode: "",
                })
                setImgPreviwe(null);
                setselectedFile(null);
                setLoading(false);
                navigate("/supplier-list");

            } catch (error) {
                setLoading(false);
                toast.error(error?.response?.data?.message)
                console.log("error while creating branch", error?.response?.data?.message);
            }
        }
    };
    // -----setting the data if contain id ----------
    useEffect(() => {
        if (id) {
            async function getBranch() {
                try {
                    setPageLoading(true)
                    const response = await supplierService.getOne(id);
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
                        businessUnit: baseAddress.businessUnit?._id,
                        branch: baseAddress.branch?._id,
                        warehouse: baseAddress.warehouse?._id,
                        name: baseAddress?.name,
                        contactPerson: baseAddress?.contactPerson,
                        emailContact: baseAddress?.emailContact,
                        contactNumber: baseAddress?.contactNumber,
                        url: baseAddress?.url,
                        GstVanNumber: baseAddress?.GstVanNumber,
                        country: baseAddress?.country,
                        city: baseAddress?.city,
                        state: baseAddress?.state,
                        address: baseAddress?.address,
                        ZipCode: baseAddress?.ZipCode,

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



    useEffect(() => {
        async function getActiveBusinessUnit() {
            try {
                const response = await warehouseService.getActiveBusinessUnit();
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
                                        <div
                                            className={`fromGroup   ${formDataErr?.level !== "" ? "has-error" : ""
                                                } `}
                                        >
                                            <label htmlFor="level" className="form-label ">
                                                <p className="form-label">
                                                    Level <span className="text-red-500">*</span>
                                                </p>
                                            </label>
                                            <select
                                                name="level"
                                                value={level}
                                                onChange={handleChange}
                                                disabled={isViewed || id}
                                                className="form-control py-2  appearance-none relative flex-1"
                                            >
                                                <option value="">None</option>

                                                {levelList &&
                                                    levelList?.map((item) => (
                                                        <option value={item.value} key={item?.value}>
                                                            {item && item?.name}
                                                        </option>
                                                    ))}
                                            </select>
                                            {<p className="text-sm text-red-500">{formDataErr.level}</p>}
                                        </div>


                                        {
                                            (levelResult == 0 || levelResult == 1) ? "" :

                                                <div
                                                    className={`fromGroup   ${formDataErr?.businessUnit !== "" ? "has-error" : ""
                                                        } `}
                                                >
                                                    <label htmlFor=" hh" className="form-label ">
                                                        <p className="form-label">
                                                            Business Unit <span className="text-red-500">*</span>
                                                        </p>
                                                    </label>
                                                    <select
                                                        name="businessUnit"
                                                        value={businessUnit}
                                                        onChange={handleChange}
                                                        disabled={isViewed || currentUser.isBuLevel || currentUser.isBranchLevel || currentUser.isWarehouseLevel || id}
                                                        className="form-control py-2  appearance-none relative flex-1"
                                                    >
                                                        <option value="">None</option>

                                                        {activeBusinessUnits &&
                                                            activeBusinessUnits?.map((item) => (
                                                                <option value={item?._id} key={item?._id}>{item?.name}</option>
                                                            ))}
                                                    </select>
                                                    {<p className="text-sm text-red-500">{formDataErr.businessUnit}</p>}
                                                </div>
                                        }


                                        {
                                            (levelResult == 0 || levelResult == 1 || levelResult == 2) ? "" :

                                                <div
                                                    className={`fromGroup   ${formDataErr?.branch !== "" ? "has-error" : ""
                                                        } `}
                                                >
                                                    <label htmlFor=" hh" className="form-label ">
                                                        <p className="form-label">
                                                            Branch <span className="text-red-500">*</span>
                                                        </p>
                                                    </label>
                                                    <select
                                                        name="branch"
                                                        value={branch}
                                                        onChange={handleChange}
                                                        disabled={isViewed || currentUser.isBranchLevel || currentUser.isWarehouseLevel || id}
                                                        className="form-control py-2  appearance-none relative flex-1"
                                                    >
                                                        <option value="">None</option>

                                                        {activeBranches &&
                                                            activeBranches?.map((item) => (
                                                                <option value={item?._id} key={item?._id}>{item?.name}</option>
                                                            ))}
                                                    </select>
                                                    {<p className="text-sm text-red-500">{formDataErr.branch}</p>}
                                                </div>

                                        }

                                        {
                                            (levelResult == 0 || levelResult == 1 || levelResult == 2 || levelResult == 3) ? "" :
                                                <div
                                                    className={`fromGroup   ${formDataErr?.warehouse !== "" ? "has-error" : ""
                                                        } `}
                                                >
                                                    <label htmlFor=" hh" className="form-label ">
                                                        <p className="form-label">
                                                            Warehouse <span className="text-red-500">*</span>
                                                        </p>
                                                    </label>
                                                    <select
                                                        name="warehouse"
                                                        value={warehouse}
                                                        onChange={handleChange}
                                                        disabled={isViewed || currentUser.isWarehouseLevel || id}
                                                        className="form-control py-2  appearance-none relative flex-1"
                                                    >
                                                        <option value="">None</option>

                                                        {activeWarehouse &&
                                                            activeWarehouse?.map((item) => (
                                                                <option value={item?._id} key={item?._id}>{item?.name}</option>
                                                            ))}
                                                    </select>
                                                    {<p className="text-sm text-red-500">{formDataErr.warehouse}</p>}
                                                </div>
                                        }
                                        <label
                                            className={`fromGroup   ${formDataErr?.name !== "" ? "has-error" : ""
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
                                                readOnly={isViewed || id}
                                            />
                                            {
                                                <p className="text-sm text-red-500">
                                                    {formDataErr.name}
                                                </p>
                                            }
                                        </label>

                                        <label
                                            className={`fromGroup   ${formDataErr?.contactPerson !== "" ? "has-error" : ""
                                                } `}
                                        >
                                            <p className="form-label">
                                                contact Person
                                            </p>
                                            <input
                                                name="contactPerson"
                                                type="text"
                                                placeholder="Enter contact Person"
                                                value={contactPerson}
                                                onChange={handleChange}
                                                className="form-control py-2"
                                                readOnly={isViewed || id}
                                            />
                                            {
                                                <p className="text-sm text-red-500">
                                                    {formDataErr.contactPerson}
                                                </p>
                                            }
                                        </label>

                                        <label
                                            className={`fromGroup   ${formDataErr?.emailContact !== "" ? "has-error" : ""
                                                } `}
                                        >
                                            <p className="form-label">
                                                Email <span className="text-red-500">*</span>
                                            </p>
                                            <input
                                                name="emailContact"
                                                type="email"
                                                placeholder="Enter Email"
                                                value={emailContact}
                                                onChange={handleChange}
                                                readOnly={isViewed || id}

                                                className="form-control py-2"
                                            />
                                            {<p className="text-sm text-red-500">{formDataErr.emailContact}</p>}
                                        </label>

                                        <label
                                            className={`fromGroup   ${formDataErr?.contactNumber !== "" ? "has-error" : ""
                                                } `}
                                        >
                                            <p className=" form-label">
                                                Phone <span className="text-red-500">*</span>
                                            </p>
                                            <input
                                                name="contactNumber"
                                                type="text"
                                                placeholder="Enter contact number"
                                                value={contactNumber}
                                                onChange={handleChange}
                                                className="form-control py-2"
                                                readOnly={isViewed || id}
                                                onInput={handleKeyPress}

                                            />
                                            {<p className="text-sm text-red-500">{formDataErr.contactNumber}</p>}
                                        </label>

                                        <label
                                            className={`fromGroup   ${formDataErr?.url !== "" ? "has-error" : ""
                                                } `}
                                        >
                                            <p className="form-label">
                                                URL 
                                            </p>
                                            <input
                                                name="url"
                                                type="text"
                                                placeholder="Enter URL"
                                                value={url}
                                                onChange={handleChange}
                                                className="form-control py-2"
                                                readOnly={isViewed}
                                            />
                                            {
                                                <p className="text-sm text-red-500">
                                                    {formDataErr.url}
                                                </p>
                                            }
                                        </label>

                                        <label
                                            className={`fromGroup   ${formDataErr?.GstVanNumber !== "" ? "has-error" : ""
                                                } `}
                                        >
                                            <p className="form-label">
                                                GstVanNumber <span className="text-red-500">*</span>
                                            </p>
                                            <input
                                                name="GstVanNumber"
                                                type="text"
                                                placeholder="Enter URL"
                                                value={GstVanNumber}
                                                onChange={handleChange}
                                                className="form-control py-2"
                                                readOnly={isViewed}
                                            />
                                            {
                                                <p className="text-sm text-red-500">
                                                    {formDataErr.GstVanNumber}
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
                                                readOnly={isViewed}
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
                                                readOnly={isViewed}
                                            />
                                            {
                                                <p className="text-sm text-red-500">
                                                    {formDataErr.address}
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

                                <hr />

                                <div className="flex gap-2 mt-2">

                                    {
                                        id ?
                                            <button
                                                onClick={() => navigate("/create-supplier/add/address", { state: { customerId: id } })}
                                                className={`bg-lightBtn dark:bg-darkBtn p-3 rounded-md text-white  text-center btn btn inline-flex justify-center`}
                                            >
                                                Add Address
                                            </button>
                                            : ""
                                    }

                                    {
                                        id ?
                                            <button
                                                onClick={() => navigate(`/create-supplier/link/items`, { state: { supplierId: id } })}
                                                className={`bg-lightBtn dark:bg-darkBtn p-3 rounded-md text-white  text-center btn btn inline-flex justify-center`}
                                            >
                                                Linked Items
                                            </button>
                                            : ""
                                    }

                                </div>




                            </div>
                        </Card>
                    </div>
            }
        </>

    );
};

export default CreateSupplier;
