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
import productBlueprintService from "@/services/productBlueprint/productBlueprint.service";
import priceService from "@/services/price/price.service";
import PriceOptions from "./PriceOptions";
import Multiselect from "multiselect-react-dropdown";
import stockService from "@/services/stock/stock.service";



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


const CreateStock = ({ noFade, scrollContent }) => {

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

    const [activeBusinessUnits, setActiveBusinessUnits] = useState([])
    const [activeBranches, setActiveBranches] = useState([]);
    const [activeWarehouses, setActiveWarehouses] = useState([]);
    const [activeProductBlueprint, setActiveProductBlueprint] = useState([])
    const [activePriceOptions, setActivePriceOptions] = useState([]);
    const [selectedPrices, setSelectedPrices] = useState([]);

    console.log("selectedPrices", selectedPrices);




    const [formData, setFormData] = useState({
        product: "",
        businessUnit: "",
        branch: "",
        warehouse: "",

        totalStock: "",
        onlineStock: "",
        offlineStock: "",
        lowStockThreshold: "",
        restockQuantity: "",
        priceOptions: [],
    });

    console.log("formData", formData);



    const [formDataErr, setFormDataErr] = useState({
        product: "",
        businessUnit: "",
        branch: "",
        warehouse: "",

        totalStock: "",
        onlineStock: "",
        offlineStock: "",
        lowStockThreshold: "",
        restockQuantity: "",
        priceOptions: "",
    });
    const {
        product,
        businessUnit,
        branch,
        warehouse,


        totalStock,
        onlineStock,
        offlineStock,
        lowStockThreshold,
        restockQuantity,
        priceOptions,

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



    useEffect(() => {
        if (selectedPrices.length == 0) {
            setFormDataErr((prev) => ({
                ...prev,
                priceOptions: "Price Is Required.",
            }));
        } else {
            setFormDataErr((prev) => ({
                ...prev,
                priceOptions: "",
            }));
        }
    }, [selectedPrices])





    //------- Handling the VAlidation ------
    function validationFunction() {
        let errorCount = 0;

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

        if (!product) {
            setFormDataErr((prev) => ({
                ...prev,
                product: "Product Is Required.",
            }));
            errorCount++
        } else {
            setFormDataErr((prev) => ({
                ...prev,
                product: "",
            }));
        }


        if (!totalStock) {
            setFormDataErr((prev) => ({
                ...prev,
                totalStock: "Total Stock Is Required.",
            }));
            errorCount++
        } else {
            setFormDataErr((prev) => ({
                ...prev,
                totalStock: "",
            }));
        }

        if (!onlineStock) {
            setFormDataErr((prev) => ({
                ...prev,
                onlineStock: "Online Stock Is Required.",
            }));
            errorCount++
        } else {
            setFormDataErr((prev) => ({
                ...prev,
                onlineStock: "",
            }));
        }

        if (!offlineStock) {
            setFormDataErr((prev) => ({
                ...prev,
                offlineStock: "Offline Stock Is Required.",
            }));
            errorCount++
        } else {
            setFormDataErr((prev) => ({
                ...prev,
                offlineStock: "",
            }));
        }

        if (!lowStockThreshold) {
            setFormDataErr((prev) => ({
                ...prev,
                lowStockThreshold: "Low Stock Threshold Is Required.",
            }));
            errorCount++
        } else {
            setFormDataErr((prev) => ({
                ...prev,
                lowStockThreshold: "",
            }));
        }

        if (!restockQuantity) {
            setFormDataErr((prev) => ({
                ...prev,
                restockQuantity: "Restock Quantity Is Required.",
            }));
            errorCount++
        } else {
            setFormDataErr((prev) => ({
                ...prev,
                restockQuantity: "",
            }));
        }


        if (selectedPrices.length == 0) {
            setFormDataErr((prev) => ({
                ...prev,
                priceOptions: "Price Is Required.",
            }));
            errorCount++
        } else {
            setFormDataErr((prev) => ({
                ...prev,
                priceOptions: "",
            }));
            errorCount++
        }


        if (errorCount > 0) {
            return false
        } else {
            return true
        }
    }






    const handleChange = (e) => {
        const { name, value } = e.target;

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

        if (name == "product") {
            if (value == "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    product: "Product is Required"
                }))
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    product: ""
                }))
            }
        }

        if (name === "totalStock") {
            if (value === "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    totalStock: "Total Stock Is Required.",
                }));
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    totalStock: "",
                }));
            }
        }

        if (name === "onlineStock") {
            if (value === "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    onlineStock: "Online Stock Is Required.",
                }));
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    onlineStock: "",
                }));
            }
        }

        if (name === "offlineStock") {
            if (value === "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    offlineStock: "Offline Stock Is Required.",
                }));
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    offlineStock: "",
                }));
            }
        }

        if (name === "lowStockThreshold") {
            if (value === "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    lowStockThreshold: "Low Stock Threshold Is Required.",
                }));
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    lowStockThreshold: "",
                }));
            }
        }

        if (name === "restockQuantity") {
            if (value === "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    restockQuantity: "Restock Quantity Is Required.",
                }));
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    restockQuantity: "",
                }));
            }
        }
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


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
            setActiveWarehouses(response.data)

        } catch (error) {
            console.log("error while getting warehouse by branch");
        }
    }


    useEffect(() => {
        if (product) {
            getPriceListByProduct(product)
        }
    }, [product]);

    async function getPriceListByProduct(id) {
        try {
            const response = await priceService.getRateByProductId(id);
            setActivePriceOptions(response.data.priceOptions)

        } catch (error) {
            console.log("error while getting rate by product");
        }
    }

    //---------- Adding & Editing the Organiser ----------

    const onSubmit = async (e) => {
        e.preventDefault();
        setIsViewed(false);
        const error = validationFunction();
        setLoading(true);
        if (error) {
            setLoading(false);
            return
        } else {
            console.log("yess");
            try {
                const clientId = localStorage.getItem("saas_client_clientId");

                let dataObject = {
                    clientId: clientId,
                    
                    product: product,
                    businessUnit: businessUnit,
                    branch: branch,
                    warehouse: warehouse,
                    totalStock: totalStock,
                    priceOptions: selectedPrices,
                    onlineStock: onlineStock,
                    offlineStock: offlineStock,
                    lowStockThreshold: lowStockThreshold,
                    restockQuantity: restockQuantity,
                }

                if (id) {
                    const response = await stockService.update({...dataObject,stockId: id, })
                    toast.success(response?.data?.message);
                } else {
                    const response = await stockService.create(dataObject);
                    toast.success(response?.data?.message);
                }

                setFormData({
                    product: "",
                    businessUnit: "",
                    branch: "",
                    warehouse: "",

                    totalStock: "",
                    onlineStock: "",
                    offlineStock: "",
                    lowStockThreshold: "",
                    restockQuantity: "",
                    priceOptions: [],
                });
                setFormDataErr({
                    product: "",
                    businessUnit: "",
                    branch: "",
                    warehouse: "",

                    totalStock: "",
                    onlineStock: "",
                    offlineStock: "",
                    lowStockThreshold: "",
                    restockQuantity: "",
                    priceOptions: "",
                })
                setLoading(false);
                navigate("/stock-list");

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
                    const response = await stockService.getParticularStocks(id);
                    console.log('Response stock data', response?.data);
                    const baseAddress = response?.data;
                    setFormData((prev) => ({
                        ...prev,
                        product: baseAddress?.product,
                        businessUnit: baseAddress?.businessUnit,
                        branch: baseAddress?.branch,
                        warehouse: baseAddress?.warehouse,

                        totalStock: baseAddress?.totalStock,
                        onlineStock: baseAddress?.onlineStock,
                        offlineStock: baseAddress?.offlineStock,
                        lowStockThreshold: baseAddress?.lowStockThreshold,
                        restockQuantity: baseAddress?.restockQuantity,
                        // priceOptions: baseAddress?.priceOptions,
                    }));
                    console.log("baseAddress?.priceOptions", baseAddress?.priceOptions);
                    const filteredOptions = baseAddress?.priceOptions?.length > 0 ? baseAddress?.priceOptions?.map((item) => {
                        return {
                            price: item?.price,
                            quantity: item?.quantity,
                            unit: item?.unit
                        }
                    }) : []
                    setSelectedPrices(filteredOptions)
                    setPageLoading(false)
                } catch (error) {
                    setPageLoading(false)
                    console.log("error in fetching stock data");
                }
            }
            getBranch()
        } else {
            setPageLoading(false)
        }
    }, [id, countryList]);





    useEffect(() => {
        async function getActiveBusinessUnit() {
            try {
                const response = await warehouseService.getActiveBusinessUnit();
                console.log("respone active", response);
                setActiveBusinessUnits(response?.data?.businessUnits)
            } catch (error) {
                console.log("error while getting the active business unit", error);
            }
        }
        getActiveBusinessUnit()
        getActiveProducctBlueprint()
    }, [])

    async function getActiveProducctBlueprint() {
        try {
            const response = await productBlueprintService.getActive();
            setActiveProductBlueprint(response.data.roductBluePrints)
        } catch (error) {
            console.log("error in getting active", error);
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




    const onSelect = (selectedList, selectedItem) => {
        console.log("Selected List: ", selectedList);
        setSelectedPrices(selectedList);
    };

    const onRemove = (selectedList, removedItem) => {
        console.log("Updated List: ", selectedList);
        setSelectedPrices(selectedList);
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
                                {isUserClicked && (
                                    <div>
                                        <div className="grid lg:grid-cols-3 flex-col gap-3">

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
                                                    disabled={isViewed}
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
                                                    disabled={isViewed}
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
                                                    disabled={isViewed}
                                                    className="form-control py-2  appearance-none relative flex-1"
                                                >
                                                    <option value="">None</option>

                                                    {activeWarehouses &&
                                                        activeWarehouses?.map((item) => (
                                                            <option value={item?._id} key={item?._id}>{item?.name}</option>
                                                        ))}
                                                </select>
                                                {<p className="text-sm text-red-500">{formDataErr.warehouse}</p>}
                                            </div>

                                            <div
                                                className={`fromGroup   ${formDataErr?.product !== "" ? "has-error" : ""
                                                    } `}
                                            >
                                                <label htmlFor=" hh" className="form-label ">
                                                    <p className="form-label">
                                                        Product <span className="text-red-500">*</span>
                                                    </p>
                                                </label>
                                                <select
                                                    name="product"
                                                    value={product}
                                                    onChange={handleChange}
                                                    disabled={isViewed}
                                                    className="form-control py-2  appearance-none relative flex-1"
                                                >
                                                    <option value="">None</option>

                                                    {activeProductBlueprint &&
                                                        activeProductBlueprint?.map((item) => (
                                                            <option value={item?._id} key={item?._id}>{item?.name}</option>
                                                        ))}
                                                </select>
                                                {<p className="text-sm text-red-500">{formDataErr.product}</p>}
                                            </div>

                                            <div>

                                                <p className="form-label">
                                                    Select Prices <span className="text-red-500">*</span>
                                                </p>
                                                <PriceOptions activePriceOptions={activePriceOptions} selectedFinding={selectedPrices} setSelectedFinding={setSelectedPrices} />
                                                {<p className="text-sm text-red-500">{formDataErr.priceOptions}</p>}
                                            </div>


                                            <label
                                                className={`fromGroup   ${formDataErr?.totalStock !== "" ? "has-error" : ""
                                                    } `}
                                            >
                                                <p className="form-label">
                                                    Total Stock <span className="text-red-500">*</span>
                                                </p>
                                                <input
                                                    name="totalStock"
                                                    type="number"
                                                    placeholder="Enter total Stock"
                                                    value={totalStock}
                                                    onChange={handleChange}
                                                    className="form-control py-2"
                                                    readOnly={isViewed}
                                                />
                                                {
                                                    <p className="text-sm text-red-500">
                                                        {formDataErr.totalStock}
                                                    </p>
                                                }
                                            </label>

                                            <label
                                                className={`fromGroup   ${formDataErr?.onlineStock !== "" ? "has-error" : ""
                                                    } `}
                                            >
                                                <p className="form-label">
                                                    Online Stock <span className="text-red-500">*</span>
                                                </p>
                                                <input
                                                    name="onlineStock"
                                                    type="number"
                                                    placeholder="Enter online stock"
                                                    value={onlineStock}
                                                    onChange={handleChange}
                                                    className="form-control py-2"
                                                    readOnly={isViewed}
                                                />
                                                {
                                                    <p className="text-sm text-red-500">
                                                        {formDataErr.onlineStock}
                                                    </p>
                                                }
                                            </label>

                                            <label
                                                className={`fromGroup   ${formDataErr?.offlineStock !== "" ? "has-error" : ""
                                                    } `}
                                            >
                                                <p className="form-label">
                                                    Offline Stock <span className="text-red-500">*</span>
                                                </p>
                                                <input
                                                    name="offlineStock"
                                                    type="number"
                                                    placeholder="Enter offline Stock"
                                                    value={offlineStock}
                                                    onChange={handleChange}
                                                    className="form-control py-2"
                                                    readOnly={isViewed}
                                                />
                                                {
                                                    <p className="text-sm text-red-500">
                                                        {formDataErr.offlineStock}
                                                    </p>
                                                }
                                            </label>

                                            <label
                                                className={`fromGroup   ${formDataErr?.lowStockThreshold !== "" ? "has-error" : ""
                                                    } `}
                                            >
                                                <p className="form-label">
                                                    Low Stock Threshold <span className="text-red-500">*</span>
                                                </p>
                                                <input
                                                    name="lowStockThreshold"
                                                    type="number"
                                                    placeholder="Enter low stock threshold"
                                                    value={lowStockThreshold}
                                                    onChange={handleChange}
                                                    className="form-control py-2"
                                                    readOnly={isViewed}
                                                />
                                                {
                                                    <p className="text-sm text-red-500">
                                                        {formDataErr.lowStockThreshold}
                                                    </p>
                                                }
                                            </label>

                                            <label
                                                className={`fromGroup   ${formDataErr?.restockQuantity !== "" ? "has-error" : ""
                                                    } `}
                                            >
                                                <p className="form-label">
                                                    Restock Quantity <span className="text-red-500">*</span>
                                                </p>
                                                <input
                                                    name="restockQuantity"
                                                    type="number"
                                                    placeholder="Enter restock quantity"
                                                    value={restockQuantity}
                                                    onChange={handleChange}
                                                    className="form-control py-2"
                                                    readOnly={isViewed}
                                                />
                                                {
                                                    <p className="text-sm text-red-500">
                                                        {formDataErr.restockQuantity}
                                                    </p>
                                                }
                                            </label>







                                        </div>


                                        <div className="lg:col-span-2 col-span-1">
                                            <div className="ltr:text-right rtl:text-left p-5">
                                                {showAddButton ? (
                                                    <button
                                                        onClick={onSubmit}
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
                                    </div>
                                )}

                            </div>
                        </Card>
                    </div>
            }
        </>

    );
};

export default CreateStock;
