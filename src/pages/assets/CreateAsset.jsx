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
import departmentService from "@/services/department/department.service";
import Button from "@/components/ui/Button";
import assetService from "@/services/asset/asset.service";



const CreateAsset = ({ noFade, scrollContent }) => {
    const navigate = useNavigate();
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
    const location = useLocation();
    const row = location?.state?.row;
    const name = location?.state?.name;
    const id = location?.state?.id;
    const [pageLoading, setPageLoading] = useState(true);
    const [activeBusinessUnits, setActiveBusinessUnits] = useState([]);
    const [levelResult, setLevelResult] = useState(0)
    const [activeBranches, setActiveBranches] = useState([]);
    const [activeWarehouse, setActiveWarehouse] = useState([]);

    const [formData, setFormData] = useState({
        level: "",
        businessUnit: "",
        branch: "",
        warehouse: "",

        assetName: "",
        serialNumber: "",
        model: "",
        purchaseDate: "",
        purchaseCost: "",
        currentValue: "",
        usefulLife: "",
        status: "",
        condition: "",
        warrantyEndDate: "",
        disposalDate: "",
        disposalReason: "",
        notes: "",
        expirationDate: "",
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
        level: "",
        businessUnit: "",
        branch: "",
        warehouse: "",

        assetName: "",
        serialNumber: "",
        model: "",
        purchaseDate: "",
        purchaseCost: "",
        currentValue: "",
        usefulLife: "",
        status: "",
        condition: "",
        warrantyEndDate: "",
        disposalDate: "",
        disposalReason: "",
        notes: "",
        expirationDate: "",
    });

    const {
        level,
        businessUnit,
        branch,
        warehouse,

        assetName,
        serialNumber,
        model,
        purchaseDate,
        purchaseCost,
        currentValue,
        usefulLife,
        status,
        condition,
        warrantyEndDate,
        disposalDate,
        disposalReason,
        notes,
        expirationDate,
    } = formData;

    const [isViewed, setIsViewed] = useState(false);
    const [showAddButton, setShowAddButton] = useState(true);
    const [loading, setLoading] = useState(false)

    const validationFunction = () => {
        const { level, businessUnit, branch, warehouse } = formData;
        let errors = {
            assetName: validateField("assetName", assetName),
            serialNumber: validateField("serialNumber", serialNumber),
            model: validateField("model", model),
            purchaseDate: validateField("purchaseDate", purchaseDate),
            currentValue: validateField("currentValue", currentValue),
            purchaseCost: validateField("purchaseCost", purchaseCost),
            usefulLife: validateField("usefulLife", usefulLife),
            condition: validateField("condition", condition),
            warrantyEndDate: validateField("warrantyEndDate", warrantyEndDate),
            expirationDate: validateField("expirationDate", expirationDate),
            status: validateField("status", status),
            notes: validateField("notes", notes),
        };
        errors.level = validateField("level", level);
        if (level === "business" || level === "branch" || level === "warehouse") {
            errors.businessUnit = validateField("businessUnit", businessUnit);
        }
        if (level === "branch" || level === "warehouse") {
            errors.branch = validateField("branch", branch);
        }
        if (level === "warehouse") {
            errors.warehouse = validateField("warehouse", warehouse);
        }
        console.log("errors", errors);

        setFormDataErr((prev) => ({
            ...prev,
            ...errors
        }));
        return Object.values(errors).some((error) => error);
    };

    const validateField = (name, value) => {
        const rules = {
            assetName: [
                [!value, "Asset Name is Required"],
                [value.length <= 3, "Minimum 3 characters required."]
            ],
            serialNumber: [
                [!value, "Serial Number is Required"],
                [value.length <= 3, "Minimum 3 characters required."]
            ],
            model: [
                [!value, "Model is Required"],
                [value.length <= 3, "Minimum 3 characters required."]
            ],
            purchaseDate: [[!value, "Purchase Date is Required"]],
            purchaseCost: [[!value, "Purchase Cost is Required"]],
            currentValue: [[!value, "Current Value is Required"]],
            usefulLife: [[!value, "Useful Life is Required"]],
            status: [[!value, "Status is Required"]],
            condition: [[!value, "Condition is Required"]],
            warrantyEndDate: [[!value, "Warranty End Date is Required"]],
            disposalDate: [[!value, "Disposal Date is Required"]],
            disposalReason: [[!value, "DisposalReason Date is Required"]],
            expirationDate: [[!value, "Expiration Date Date is Required"]],
            notes: [[!value, "Notes are Required"]],

            level: [[!value, "Level is Required"]],
            businessUnit: [[!value, "Business Unit is Required"]],
            branch: [[!value, "Branch is Required"]],
            warehouse: [[!value, "Warehouse is Required"]]
        };
        return (rules[name] || []).find(([condition]) => condition)?.[1] || "";
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
        if (name === "businessUnit" && value !== "") {
            setActiveBranches([]);
            setFormData((prev) => ({
                ...prev,
                branchId: ""
            }));
        }
        setFormDataErr((prev) => ({
            ...prev,
            [name]: validateField(name, value)
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


    const onSubmit = async (e) => {
        e.preventDefault();
        setIsViewed(false);
        const error = validationFunction();
        console.log("error", error);

        setLoading(true);
        if (error) {
            setLoading(false);

            return
        } else {
            try {
                const clientId = localStorage.getItem("saas_client_clientId");
                if (id) {
                    const response = await assetService.update({ ...formData, clientId: clientId, assetId: id })
                    toast.success(response?.data?.message);
                } else {
                    const response = await assetService.create({ ...formData, clientId: clientId });
                    toast.success(response?.data?.message);
                }

                setFormData({
                    level: "",
                    businessUnit: "",
                    branch: "",
                    warehouse: "",
                    assetName: "",
                    serialNumber: "",
                    model: "",
                    purchaseDate: "",
                    purchaseCost: "",
                    currentValue: "",
                    usefulLife: "",
                    status: "",
                    condition: "",
                    warrantyEndDate: "",
                    disposalDate: "",
                    disposalReason: "",
                    notes: "",
                    expirationDate: "",
                });
                setFormDataErr({
                    level: "",
                    businessUnit: "",
                    branch: "",
                    warehouse: "",
                    assetName: "",
                    serialNumber: "",
                    model: "",
                    purchaseDate: "",
                    purchaseCost: "",
                    currentValue: "",
                    usefulLife: "",
                    status: "",
                    condition: "",
                    warrantyEndDate: "",
                    disposalDate: "",
                    disposalReason: "",
                    notes: "",
                    expirationDate: "",
                })
                setLoading(false);
                navigate("/assets-tools-list");

            } catch (error) {
                setLoading(false);
                console.log("error while creating asset", error);
            }
        }
    };
    function formatDate(isoDate) {
        const date = new Date(isoDate);
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // -----setting the data if contain id ----------
    useEffect(() => {
        if (id) {
            if (name == "view") {
                setIsViewed(true)
            } else {
                setIsViewed(false)
            }
            async function getBranch() {
                try {
                    setPageLoading(true)
                    // const response = await employeeService.getOne(id);
                    // console.log('Response get employee', response?.data);
                    // const baseAddress = response?.data;
                    const baseAddress = location?.state?.row;



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
                        assetName: baseAddress.assetName,
                        serialNumber: baseAddress.serialNumber,
                        model: baseAddress.model,
                        purchaseDate: formatDate(baseAddress.purchaseDate),
                        purchaseCost: baseAddress.purchaseCost,
                        currentValue: baseAddress.currentValue,
                        usefulLife: baseAddress.usefulLife,
                        status: baseAddress.status,
                        condition: baseAddress.condition,
                        warrantyEndDate: formatDate(baseAddress.warrantyEndDate),
                        disposalDate: formatDate(baseAddress.disposalDate),
                        disposalReason: baseAddress.disposalReason,
                        notes: baseAddress.notes,
                        expirationDate: baseAddress.expirationDate,
                    }));

                    setPageLoading(false)

                } catch (error) {
                    setPageLoading(false)
                    console.log("error in fetching vendor data");
                }
            }
            getBranch()
        } else {
            setPageLoading(false)
        }
    }, [id]);


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
    }, [])

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

                                        {/* select level */}
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
                                                disabled={isViewed}
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
                                                        disabled={isViewed || currentUser.isBuLevel || currentUser.isBranchLevel || currentUser.isWarehouseLevel}
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
                                                        disabled={isViewed || currentUser.isBranchLevel || currentUser.isWarehouseLevel}
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
                                                        disabled={isViewed || currentUser.isWarehouseLevel}
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
                                            className={`fromGroup   ${formDataErr?.assetName !== "" ? "has-error" : ""
                                                } `}
                                        >
                                            <p className="form-label">
                                                Asset Name <span className="text-red-500">*</span>
                                            </p>
                                            <input
                                                name="assetName"
                                                type="text"
                                                placeholder="Enter Asset Name"
                                                value={assetName}
                                                onChange={handleChange}
                                                className="form-control py-2"
                                                disabled={isViewed}
                                            />
                                            {
                                                <p className="text-sm text-red-500">
                                                    {formDataErr.assetName}
                                                </p>
                                            }
                                        </label>
                                        <label
                                            className={`fromGroup   ${formDataErr?.serialNumber !== "" ? "has-error" : ""
                                                } `}
                                        >
                                            <p className="form-label">
                                                Serial Number <span className="text-red-500">*</span>
                                            </p>
                                            <input
                                                name="serialNumber"
                                                type="text"
                                                placeholder="Enter Serial Number"
                                                value={serialNumber}
                                                onChange={handleChange}
                                                className="form-control py-2"
                                                disabled={isViewed}
                                            />
                                            {
                                                <p className="text-sm text-red-500">
                                                    {formDataErr.serialNumber}
                                                </p>
                                            }
                                        </label>
                                        <label
                                            className={`fromGroup   ${formDataErr?.model !== "" ? "has-error" : ""
                                                } `}
                                        >
                                            <p className="form-label">
                                                Model <span className="text-red-500">*</span>
                                            </p>
                                            <input
                                                name="model"
                                                type="text"
                                                placeholder="Enter Model"
                                                value={model}
                                                onChange={handleChange}
                                                className="form-control py-2"
                                                disabled={isViewed}
                                            />
                                            {
                                                <p className="text-sm text-red-500">
                                                    {formDataErr.model}
                                                </p>
                                            }
                                        </label>

                                        <label
                                            className={`fromGroup   ${formDataErr?.purchaseDate !== "" ? "has-error" : ""
                                                } `}
                                        >
                                            <p className="form-label">
                                                Purchase Date <span className="text-red-500">*</span>
                                            </p>
                                            <input
                                                name="purchaseDate"
                                                type="date"
                                                value={purchaseDate}
                                                onChange={handleChange}
                                                className="form-control py-2"
                                                disabled={isViewed}
                                            />
                                            {
                                                <p className="text-sm text-red-500">
                                                    {formDataErr.purchaseDate}
                                                </p>
                                            }
                                        </label>
                                        <label
                                            className={`fromGroup   ${formDataErr?.purchaseCost !== "" ? "has-error" : ""
                                                } `}
                                        >
                                            <p className="form-label">
                                                Purchase Cost <span className="text-red-500">*</span>
                                            </p>
                                            <input
                                                name="purchaseCost"
                                                type="number"
                                                placeholder="Enter Purchase Cost"
                                                value={purchaseCost}
                                                onChange={handleChange}
                                                className="form-control py-2"
                                                disabled={isViewed}
                                            />
                                            {
                                                <p className="text-sm text-red-500">
                                                    {formDataErr.purchaseCost}
                                                </p>
                                            }
                                        </label>
                                        <label
                                            className={`fromGroup   ${formDataErr?.currentValue !== "" ? "has-error" : ""
                                                } `}
                                        >
                                            <p className="form-label">
                                                Current Value <span className="text-red-500">*</span>
                                            </p>
                                            <input
                                                name="currentValue"
                                                type="number"
                                                placeholder="Enter Current Value"
                                                value={currentValue}
                                                onChange={handleChange}
                                                className="form-control py-2"
                                                disabled={isViewed}
                                            />
                                            {
                                                <p className="text-sm text-red-500">
                                                    {formDataErr.currentValue}
                                                </p>
                                            }
                                        </label>
                                        <label
                                            className={`fromGroup   ${formDataErr?.usefulLife !== "" ? "has-error" : ""
                                                } `}
                                        >
                                            <p className="form-label">
                                                Usefull Life <span className="text-red-500">*</span>
                                            </p>
                                            <input
                                                name="usefulLife"
                                                type="number"
                                                placeholder="Enter Useful Life."
                                                value={usefulLife}
                                                onChange={handleChange}
                                                className="form-control py-2"
                                                disabled={isViewed}
                                            />
                                            {
                                                <p className="text-sm text-red-500">
                                                    {formDataErr.usefulLife}
                                                </p>
                                            }
                                        </label>

                                        <label className={`fromGroup   ${formDataErr?.status !== "" ? "has-error" : ""
                                            } `}>
                                            <p className=" form-label">
                                                Status
                                                <span className="text-red-500">*</span>
                                            </p>
                                            <select
                                                name="status"
                                                value={status}
                                                className="form-control outline-none w-[100%] rounded-md px-4 py-2.5 border border-lightborderInputColor dark:border-darkSecondary text-lightinputTextColor dark:placeholder-darkPlaceholder bg-lightBgInputColor dark:bg-darkIconAndSearchBg dark:text-white"
                                                onChange={handleChange}
                                                disabled={isViewed}
                                            >
                                                <option value="">Select</option>
                                                <option value="available">Available</option>
                                                <option value="assigned">Assigned</option>
                                                <option value="in-maintenance">In-maintenance</option>
                                                <option value="defective">Defective</option>
                                                <option value="disposed">Disposed</option>
                                            </select>
                                            {<p className="text-red-600  text-xs">{formDataErr.status}</p>}
                                        </label>
                                        <label className={`fromGroup   ${formDataErr?.condition !== "" ? "has-error" : ""
                                            } `}>
                                            <p className=" form-label">
                                                Condition
                                                <span className="text-red-500">*</span>
                                            </p>
                                            <select
                                                name="condition"
                                                value={condition}
                                                className="form-control outline-none w-[100%] rounded-md px-4 py-2.5 border border-lightborderInputColor dark:border-darkSecondary text-lightinputTextColor dark:placeholder-darkPlaceholder bg-lightBgInputColor dark:bg-darkIconAndSearchBg dark:text-white"
                                                onChange={handleChange}
                                                disabled={isViewed}
                                            >
                                                <option value="">Select</option>
                                                <option value="new">New</option>
                                                <option value="good">Good</option>
                                                <option value="fair">Fair</option>
                                                <option value="poor">Poor</option>
                                            </select>
                                            {<p className="text-red-600  text-xs">{formDataErr.condition}</p>}
                                        </label>
                                        <label
                                            className={`fromGroup   ${formDataErr?.warrantyEndDate !== "" ? "has-error" : ""
                                                } `}
                                        >
                                            <p className="form-label">
                                                Warranty End Date <span className="text-red-500">*</span>
                                            </p>
                                            <input
                                                name="warrantyEndDate"
                                                type="date"
                                                value={warrantyEndDate}
                                                onChange={handleChange}
                                                className="form-control py-2"
                                                disabled={isViewed}
                                            />
                                            {
                                                <p className="text-sm text-red-500">
                                                    {formDataErr.warrantyEndDate}
                                                </p>
                                            }
                                        </label>
                                        <label
                                            className={`fromGroup   ${formDataErr?.disposalDate !== "" ? "has-error" : ""
                                                } `}
                                        >
                                            <p className="form-label">
                                                Disposal Date
                                            </p>
                                            <input
                                                name="disposalDate"
                                                type="date"
                                                value={disposalDate}
                                                onChange={handleChange}
                                                className="form-control py-2"
                                                disabled={isViewed}
                                            />
                                            {
                                                <p className="text-sm text-red-500">
                                                    {formDataErr.disposalDate}
                                                </p>
                                            }
                                        </label>

                                        <label
                                            className={`fromGroup   ${formDataErr?.disposalReason !== "" ? "has-error" : ""
                                                } `}
                                        >
                                            <p className="form-label">
                                                Disposal Reason
                                            </p>
                                            <input
                                                name="disposalReason"
                                                type="text"
                                                placeholder="Enter reason"
                                                value={disposalReason}
                                                onChange={handleChange}
                                                className="form-control py-2"
                                                disabled={isViewed}
                                            />
                                            {
                                                <p className="text-sm text-red-500">
                                                    {formDataErr.disposalReason}
                                                </p>
                                            }
                                        </label>



                                        <label
                                            className={`fromGroup   ${formDataErr?.notes !== "" ? "has-error" : ""
                                                } `}
                                        >
                                            <p className="form-label">
                                                Notes <span className="text-red-500">*</span>
                                            </p>
                                            <input
                                                name="notes"
                                                type="text"
                                                placeholder="Enter notes"
                                                value={notes}
                                                onChange={handleChange}
                                                className="form-control py-2"
                                                disabled={isViewed}
                                            />
                                            {
                                                <p className="text-sm text-red-500">
                                                    {formDataErr.notes}
                                                </p>
                                            }
                                        </label>
                                        <label
                                            className={`fromGroup   ${formDataErr?.expirationDate !== "" ? "has-error" : ""
                                                } `}
                                        >
                                            <p className="form-label">
                                                Expiration Date <span className="text-red-500">*</span>
                                            </p>
                                            <input
                                                name="expirationDate"
                                                type="date"
                                                value={expirationDate}
                                                onChange={handleChange}
                                                className="form-control py-2"
                                                disabled={isViewed}
                                            />
                                            {
                                                <p className="text-sm text-red-500">
                                                    {formDataErr.expirationDate}
                                                </p>
                                            }
                                        </label>
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

export default CreateAsset;
