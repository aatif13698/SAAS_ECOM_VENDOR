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

const CreateLedgerGroup = ({ noFade, scrollContent }) => {
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
    const [currentLevel, setCurrentLevel] = useState("");
    const [levelId, setLevelId] = useState("");
    const [parentLedgers, setParentLedgers] = useState([]);
    const [formData, setFormData] = useState({
        level: "",
        businessUnit: "",
        branch: "",
        warehouse: "",

        groupName: "",
        hasParent: false,
        parentGroup: "",
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

    const [formDataErr, setFormDataErr] = useState({
        level: "",
        businessUnit: "",
        branch: "",
        warehouse: "",

        groupName: "",
        hasParent: "",
        parentGroup: "",
    });

    const {
        level,
        businessUnit,
        branch,
        warehouse,

        groupName,
        hasParent,
        parentGroup,
    } = formData;

    const [isViewed, setIsViewed] = useState(false);
    const [showAddButton, setShowAddButton] = useState(true);
    const [loading, setLoading] = useState(false);

    const validateField = (name, value) => {
        const rules = {
            groupName: [
                [!value, "Gruop Name is Required"],
                [value.length <= 3, "Minimum 3 characters required."]
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
            groupName: validateField("shiftName", groupName),
        };
        if (hasParent && parentGroup == "") {
            errors.parentGroup = "Parent group is required"
        }
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

    //---------- Adding & Editing the Organiser ----------

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
                    const response = await ledgerGroupService.update({ ...formData, clientId: clientId , groupId: id})
                    toast.success(response?.data?.message);
                } else {
                    const response = await ledgerGroupService.create({ ...formData, clientId: clientId });
                    toast.success(response?.data?.message);
                }

                setFormData({
                    level: "",
                    businessUnit: "",
                    branch: "",
                    warehouse: "",

                    groupName: "",
                    hasParent: false,
                    parentGroup: "",
                });
                setFormDataErr({
                    level: "",
                    businessUnit: "",
                    branch: "",
                    warehouse: "",

                    groupName: "",
                    hasParent: "",
                    parentGroup: "",
                })
                setLoading(false);
                navigate("/group-list");

            } catch (error) {
                setLoading(false);
                console.log("error while creating ledger group", error);
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
            async function getBranch() {
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
                        groupName: baseAddress.groupName,
                        hasParent: baseAddress.hasParent,
                        parentGroup: baseAddress.parentGroup?._id
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
    }, [id, parentLedgers]);

    async function getAllParent() {
        try {
            const response = await ledgerGroupService.getAllParent(currentLevel, levelId);
            setParentLedgers(response?.data?.ledgerGroup);
        } catch (error) {
            console.log("error while fetching ledger group");
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
        getAllParent();
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


      const handleHasParentToggle = () => {
        if (!isViewed) {
            setFormData((prev) => ({
                ...prev,
                hasParent: !prev.hasParent
            }));
            setFormDataErr((prev) => ({
                ...prev,
                hasParent: validateField("hasParent", !prev.hasParent)
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
                                        className={`fromGroup   ${formDataErr?.groupName !== "" ? "has-error" : ""
                                            } `}
                                    >
                                        <p className="form-label">
                                            Name <span className="text-red-500">*</span>
                                        </p>
                                        <input
                                            name="groupName"
                                            type="text"
                                            placeholder="Enter group name"
                                            value={groupName}
                                            onChange={handleChange}
                                            className="form-control py-2"
                                            disabled={isViewed}
                                        />
                                        {
                                            <p className="text-sm text-red-500">
                                                {formDataErr.groupName}
                                            </p>
                                        }
                                    </label>

                                    {
                                        parentLedgers?.length > 0 ?


                                            <>

                                                <label className={`fromGroup ${formDataErr?.hasParent ? "has-error" : ""}`}>
                                                    <p className={`mb-1 ${isDark ? "text-white" : "text-black"}`}>
                                                        Has Parent
                                                    </p>
                                                    <div
                                                        className={`w-10 h-5 flex items-center rounded-full p-1 ${isViewed ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${hasParent ? "bg-lightBtn dark:bg-darkBtn" : "bg-gray-300 dark:bg-gray-600"}`}
                                                        onClick={handleHasParentToggle}
                                                    >
                                                        <div
                                                            className={`w-4 h-4 bg-white rounded-full shadow-md transform ${hasParent ? "translate-x-4" : "translate-x-0"}`}
                                                        ></div>
                                                    </div>
                                                    {formDataErr?.hasParent && <p className="text-red-600 text-xs">{formDataErr.hasParent}</p>}
                                                </label>

                                                {

                                                    hasParent ?
                                                        <div
                                                            className={`fromGroup   ${formDataErr?.parentGroup !== "" ? "has-error" : ""
                                                                } `}
                                                        >
                                                            <label htmlFor=" hh" className="form-label ">
                                                                <p className="form-label">
                                                                    Parent Group <span className="text-red-500">*</span>
                                                                </p>
                                                            </label>
                                                            <select
                                                                name="parentGroup"
                                                                disabled={isViewed}

                                                                value={parentGroup}
                                                                onChange={handleChange}
                                                                className="form-control py-2  appearance-none relative flex-1"
                                                            >
                                                                <option value="">None</option>

                                                                {parentLedgers &&
                                                                    parentLedgers?.map((item) => (
                                                                        <option value={item?._id} key={item?._id}>{item?.groupName}</option>
                                                                    ))}
                                                            </select>
                                                            {<p className="text-sm text-red-500">{formDataErr.parentGroup}</p>}
                                                        </div> : ""

                                                }




                                            </>

                                            : ""
                                    }



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
                    </div>
            }
        </>

    );
};

export default CreateLedgerGroup;
