import { Card } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Country, State, City } from "country-state-city";
import toast from "react-hot-toast";
import useDarkMode from "@/hooks/useDarkMode";
import { useLocation, useNavigate } from "react-router-dom";
import "../../assets/scss/common.scss"

import { useSelector } from "react-redux";
import { Dialog, Transition } from "@headlessui/react";
import FormLoader from "@/Common/formLoader/FormLoader";
import warehouseService from "@/services/warehouse/warehouse.service";
import employeeService from "@/services/employee/employee.service";
import departmentService from "@/services/department/department.service";
import Button from "@/components/ui/Button";
import Select from 'react-select';
import ledgerGroupService from "@/services/ledgerGroup/ledgerGroup.service";
import { FiPlus } from "react-icons/fi";
import Tippy from "@tippyjs/react";
import { RxCross2, RxValueNone } from "react-icons/rx";
import { FaExclamationCircle } from "react-icons/fa";
import VoucherGroup from "./VoucherGroup";
import voucherGroupService from "@/services/voucherGroup/voucherGroup.service";


// Options for days multi-select
const daysOptions = [
    { value: 'Mon', label: 'Monday' },
    { value: 'Tue', label: 'Tuesday' },
    { value: 'Wed', label: 'Wednesday' },
    { value: 'Thu', label: 'Thursday' },
    { value: 'Fri', label: 'Friday' },
    { value: 'Sat', label: 'Saturday' },
    { value: 'Sun', label: 'Sunday' }
];

const CreateVoucherGroup = ({ noFade, scrollContent }) => {
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
        // {
        //     name: "Branch",
        //     value: "branch"
        // },
        // {
        //     name: "Warehouse",
        //     value: "warehouse"
        // },
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
    const [currentLevel, setCurrentLevel] = useState("");
    const [levelId, setLevelId] = useState("");
    const [financialYears, setFinancialYears] = useState([]);
    const [fields, setFields] = useState([]);
    const [ledgerData, setLedgerData] = useState(null)
    const [formData, setFormData] = useState({
        level: "",
        businessUnit: "",
        branch: "",
        warehouse: "",

        VoucherGroupName: "",
        code: "",
        category: "",
        description: "",
        isTaxable: false,
        approvalRequired: false,
        relatedToInventory: false,
        gstApplicable: false,
        resetFrequency: "",
        financialYear: ""
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
                ])
            } else if (currentUser.isBuLevel) {
                setLevelList([
                    {
                        name: "Business",
                        value: "business"
                    },

                ]);
                setFormData((prev) => ({ ...prev, businessUnit: currentUser.businessUnit }))
            } else if (currentUser.isBranchLevel) {
                setLevelList([

                ]);
                setFormData((prev) => ({ ...prev, businessUnit: currentUser.businessUnit, branch: currentUser.branch }))
            } else if (currentUser.isWarehouseLevel) {
                setLevelList([

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

        VoucherGroupName: "",
        code: "",
        category: "",
        description: "",
        resetFrequency: "",
        financialYear: ""
    });

    const {
        level,
        businessUnit,
        branch,
        warehouse,
        VoucherGroupName,
        code,
        category,
        description,
        resetFrequency,
        financialYear,
        isTaxable,
        approvalRequired,
        relatedToInventory,
        gstApplicable
    } = formData;

    const [isViewed, setIsViewed] = useState(false);
    const [showAddButton, setShowAddButton] = useState(true);
    const [loading, setLoading] = useState(false);

    const validateField = (name, value) => {
        const rules = {
            VoucherGroupName: [
                [!value, "Voucher Gruop Name is required"],
                [value.length <= 3, "Minimum 3 characters required."]
            ],
            code: [
                [!value, "Code is required"],
            ],
            category: [
                [!value, "Category is required"],
            ],
            description: [
                [!value, "Description is required"],
            ],
            resetFrequency: [
                [!value, "Reset frequency is required"],
            ],
            financialYear: [
                [!value, "Financial year is required"]
            ],
            level: [[!value, "Level is required"]],
            businessUnit: [[!value && levelResult > 1, "Business Unit is required"]],
            branch: [[!value && levelResult > 2, "Branch is required"]],
            warehouse: [[!value && levelResult > 3, "Warehouse is required"]]
        };
        return (rules[name] || []).find(([condition]) => condition)?.[1] || "";
    };


    const validationFunction = () => {
        const { level, businessUnit, branch, warehouse } = formData;
        let errors = {
            VoucherGroupName: validateField("VoucherGroupName", VoucherGroupName),
            code: validateField("code", code),
            category: validateField("category", category),
            description: validateField("description", description),
            resetFrequency: validateField("resetFrequency", resetFrequency),
            financialYear: validateField("financialYear", financialYear),
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
                    const response = await voucherGroupService.update({ ...formData, name: VoucherGroupName, clientId: clientId, groupId: id })
                    toast.success(response?.data?.message);
                } else {
                    const response = await voucherGroupService.create({ ...formData, name: VoucherGroupName, clientId: clientId });
                    toast.success(response?.data?.message);
                }
                setLoading(false);
                navigate("/voucher-group-list");

            } catch (error) {
                setLoading(false);
                console.log("error while creating voucher group", error);
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
                        VoucherGroupName: baseAddress?.name,
                        code: baseAddress?.code,
                        category: baseAddress?.category,
                        description: baseAddress?.description,
                        resetFrequency: baseAddress?.resetFrequency,
                        financialYear: baseAddress?.financialYear?._id,
                        isTaxable: baseAddress?.isTaxable,
                        approvalRequired: baseAddress?.approvalRequired,
                        relatedToInventory: baseAddress?.relatedToInventory,
                        gstApplicable: baseAddress?.gstApplicable

                    }));
                    setPageLoading(false)
                } catch (error) {
                    setPageLoading(false)
                }
            }
            getData();
        } else {
            setPageLoading(false)
        }
    }, [id]);

    async function getFinancialYears() {
        try {
            const response = await voucherGroupService.getFinancialYears(currentLevel, levelId);
            setFinancialYears(response?.data?.financialYears);
        } catch (error) {
            console.log("error while fetching financial year");
        }
    }

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
        getActiveBusinessUnit();
        getFinancialYears();
    }, []);


    useEffect(() => {

        if (currentUser && isAuthenticated) {
            if (currentUser.isVendorLevel) {
                setCurrentLevel("vendor");
            } else if (currentUser.isBuLevel) {
                setCurrentLevel("business");
                setLevelId(currentUser.businessUnit)
            } else if (currentUser.isBranchLevel) {
                setCurrentLevel("branch");
                setLevelId(currentUser.branch)
            } else if (currentUser.isWarehouseLevel) {
                setCurrentLevel("warehouse");
                setLevelId(currentUser.warehouse)
            } else {
                setCurrentLevel("vendor");
            }
        } else {


        }

    }, [currentUser]);

    const handleIsTaxable = () => {
        if (!isViewed) {
            setFormData((prev) => ({
                ...prev,
                isTaxable: !prev.isTaxable
            }));
        }
    };

    const handleApprovalRequired = () => {
        if (!isViewed) {
            setFormData((prev) => ({
                ...prev,
                approvalRequired: !prev.approvalRequired
            }));
        }
    };

    const handleRelatedToInventory = () => {
        if (!isViewed) {
            setFormData((prev) => ({
                ...prev,
                relatedToInventory: !prev.relatedToInventory
            }));
        }
    };

    const handleGstApplicable = () => {
        if (!isViewed) {
            setFormData((prev) => ({
                ...prev,
                gstApplicable: !prev.gstApplicable
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
                        <div className={`${isDark ? "bg-darkSecondary text-white" : "bg-white text-black-900"} p-5 shadow-lg`}>

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
                                        className={`fromGroup   ${formDataErr?.VoucherGroupName !== "" ? "has-error" : ""
                                            } `}
                                    >
                                        <p className="form-label">
                                            Voucher Name <span className="text-red-500">*</span>
                                        </p>
                                        <input
                                            name="VoucherGroupName"
                                            type="text"
                                            placeholder="Enter voucher group name"
                                            value={VoucherGroupName}
                                            onChange={handleChange}
                                            className="form-control py-2"
                                            disabled={isViewed}
                                        />
                                        {
                                            <p className="text-sm text-red-500">
                                                {formDataErr.VoucherGroupName}
                                            </p>
                                        }
                                    </label>

                                    <label
                                        className={`fromGroup   ${formDataErr?.code !== "" ? "has-error" : ""
                                            } `}
                                    >
                                        <p className="form-label">
                                            Voucher Code <span className="text-red-500">*</span>
                                        </p>
                                        <input
                                            name="code"
                                            type="text"
                                            placeholder="Enter voucher code"
                                            value={code}
                                            onChange={handleChange}
                                            className="form-control py-2"
                                            disabled={isViewed}
                                        />
                                        {
                                            <p className="text-sm text-red-500">
                                                {formDataErr.code}
                                            </p>
                                        }
                                    </label>
                                    <label
                                        className={`fromGroup   ${formDataErr?.category !== "" ? "has-error" : ""
                                            } `}
                                    >
                                        <p className="form-label">
                                            Category <span className="text-red-500">*</span>
                                        </p>
                                        <input
                                            name="category"
                                            type="text"
                                            placeholder="Enter voucher category"
                                            value={category}
                                            onChange={handleChange}
                                            className="form-control py-2"
                                            disabled={isViewed}
                                        />
                                        {
                                            <p className="text-sm text-red-500">
                                                {formDataErr.category}
                                            </p>
                                        }
                                    </label>

                                    <label
                                        className={`fromGroup   ${formDataErr?.description !== "" ? "has-error" : ""
                                            } `}
                                    >
                                        <p className="form-label">
                                            Description <span className="text-red-500">*</span>
                                        </p>
                                        <input
                                            name="description"
                                            type="text"
                                            placeholder="Enter description"
                                            value={description}
                                            onChange={handleChange}
                                            className="form-control py-2"
                                            disabled={isViewed}
                                        />
                                        {
                                            <p className="text-sm text-red-500">
                                                {formDataErr.description}
                                            </p>
                                        }
                                    </label>
                                    <label className={`fromGroup   ${formDataErr?.resetFrequency !== "" ? "has-error" : ""
                                        } `}>
                                        <p className=" form-label">
                                            Frequency
                                            <span className="text-red-500">*</span>
                                        </p>
                                        <select
                                            name="resetFrequency"
                                            value={resetFrequency}
                                            className="form-control outline-none w-[100%] rounded-md px-4 py-2.5 border border-lightborderInputColor dark:border-darkSecondary text-lightinputTextColor dark:placeholder-darkPlaceholder bg-lightBgInputColor dark:bg-darkIconAndSearchBg dark:text-white"
                                            onChange={handleChange}
                                            disabled={isViewed}
                                        >
                                            <option value=""> Select</option>
                                            <option value="monthly">Monthly</option>
                                            <option value="yearly">Yearly</option>
                                        </select>
                                        {<p className="text-red-600  text-xs">{formDataErr.resetFrequency}</p>}
                                    </label>

                                    <label className={`fromGroup   ${formDataErr?.financialYear !== "" ? "has-error" : ""
                                        } `}>
                                        <p className="form-label">
                                            Financial Year  <span className="text-red-500">*</span>
                                        </p>
                                        <select
                                            value={formData?.financialYear}
                                            onChange={handleChange}
                                            disabled={isViewed}
                                            name="financialYear" className="form-control outline-none w-[100%] rounded-md px-4 py-2.5 border border-lightborderInputColor dark:border-darkSecondary text-lightinputTextColor dark:placeholder-darkPlaceholder bg-lightBgInputColor dark:bg-darkIconAndSearchBg dark:text-white"
                                        >
                                            <option value="" >--Select financial year--</option>
                                            {
                                                financialYears && financialYears.length > 0 && financialYears.map((item) => {
                                                    return (
                                                        <option key={item._id} value={item._id}>{item?.name}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                        {<p className="text-red-600  text-xs">{formDataErr.financialYear}</p>}
                                    </label>

                                    <label className={`fromGroup `}>
                                        <p className={`mb-1 ${isDark ? "text-white" : "text-black"}`}>
                                            Is Taxable
                                        </p>
                                        <div
                                            className={`w-10 h-5 flex items-center rounded-full p-1 ${isViewed ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${isTaxable ? "bg-lightBtn dark:bg-darkBtn" : "bg-gray-300 dark:bg-gray-600"}`}
                                            onClick={handleIsTaxable}
                                        >
                                            <div
                                                className={`w-4 h-4 bg-white rounded-full shadow-md transform ${isTaxable ? "translate-x-4" : "translate-x-0"}`}
                                            ></div>
                                        </div>
                                    </label>

                                    <label className={`fromGroup `}>
                                        <p className={`mb-1 ${isDark ? "text-white" : "text-black"}`}>
                                            Approval Required
                                        </p>
                                        <div
                                            className={`w-10 h-5 flex items-center rounded-full p-1 ${isViewed ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${approvalRequired ? "bg-lightBtn dark:bg-darkBtn" : "bg-gray-300 dark:bg-gray-600"}`}
                                            onClick={handleApprovalRequired}
                                        >
                                            <div
                                                className={`w-4 h-4 bg-white rounded-full shadow-md transform ${approvalRequired ? "translate-x-4" : "translate-x-0"}`}
                                            ></div>
                                        </div>
                                    </label>

                                    <label className={`fromGroup `}>
                                        <p className={`mb-1 ${isDark ? "text-white" : "text-black"}`}>
                                            Related To Inventory
                                        </p>
                                        <div
                                            className={`w-10 h-5 flex items-center rounded-full p-1 ${isViewed ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${relatedToInventory ? "bg-lightBtn dark:bg-darkBtn" : "bg-gray-300 dark:bg-gray-600"}`}
                                            onClick={handleRelatedToInventory}
                                        >
                                            <div
                                                className={`w-4 h-4 bg-white rounded-full shadow-md transform ${relatedToInventory ? "translate-x-4" : "translate-x-0"}`}
                                            ></div>
                                        </div>
                                    </label>


                                    <label className={`fromGroup `}>
                                        <p className={`mb-1 ${isDark ? "text-white" : "text-black"}`}>
                                            GST Applicable
                                        </p>
                                        <div
                                            className={`w-10 h-5 flex items-center rounded-full p-1 ${isViewed ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${gstApplicable ? "bg-lightBtn dark:bg-darkBtn" : "bg-gray-300 dark:bg-gray-600"}`}
                                            onClick={handleGstApplicable}
                                        >
                                            <div
                                                className={`w-4 h-4 bg-white rounded-full shadow-md transform ${gstApplicable ? "translate-x-4" : "translate-x-0"}`}
                                            ></div>
                                        </div>
                                    </label>



                                </div>

                                <div className="lg:col-span-2 col-span-1">
                                    <div className="flex justify-end py-5 ">
                                        {
                                            isViewed ?
                                                <Button
                                                    text="Edit"
                                                    // className="border bg-blue-gray-300 rounded px-5 py-2"
                                                    className={`bg-lightBtn dark:bg-darkBtn p-3 rounded-md text-white  text-center btn btn inline-flex justify-center`}
                                                    onClick={() => setIsViewed(false)}
                                                    isLoading={loading}
                                                /> :

                                                <>

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
                                                </>
                                        }
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
            }
        </>

    );
};

export default CreateVoucherGroup;
