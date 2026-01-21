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
import changeShiftService from "@/services/changeShift/changeShift.service";



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




const CreateChangeShift = ({ noFade, scrollContent }) => {
    const navigate = useNavigate();
    const { user: currentUser, isAuth: isAuthenticated } = useSelector((state) => state.auth);
    const [levelList, setLevelList] = useState([
        // {
        //     name: "Vendor",
        //     value: "vendor"
        // },
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

    const [status, setStatus] = useState("pending");

    console.log('status', status);


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
    const [shifts, setShifts] = useState([]);

    const [formData, setFormData] = useState({
        level: "",
        businessUnit: "",
        branch: "",
        warehouse: "",

        chosenShift: "",
        reason: "",
        description: "",

    });

    console.log("formData", formData);


    useEffect(() => {
        if (currentUser && isAuthenticated) {
            let level = "";
            let levelId = "";
            if (currentUser.isVendorLevel) {
                setLevelList([
                    // {
                    //     name: "Vendor",
                    //     value: "vendor"
                    // },
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
                setFormData((prev) => ({ ...prev, businessUnit: currentUser.businessUnit, level: "business" }));
                level = "business";
                levelId = currentUser.businessUnit;
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
                setFormData((prev) => ({ ...prev, businessUnit: currentUser.businessUnit, branch: currentUser.branch, level: "branch" }));
                level = "branch";
                levelId = currentUser.branch;
            } else if (currentUser.isWarehouseLevel) {
                setLevelList([
                    {
                        name: "Warehouse",
                        value: "warehouse"
                    },
                ])
                setFormData((prev) => ({ ...prev, businessUnit: currentUser.businessUnit, branch: currentUser.branch, warehouse: currentUser.warehouse, level: "warehouse" }));
                level = "warehouse";
                levelId = currentUser.warehouse;
            }

            getDepartmentAndShift(level, levelId)

        }

    }, [currentUser])

    const [formDataErr, setFormDataErr] = useState({
        level: "",
        businessUnit: "",
        branch: "",
        warehouse: "",

        chosenShift: "",
        reason: "",
        description: "",
    });

    const {
        level,
        businessUnit,
        branch,
        warehouse,

        chosenShift,
        reason,
        description,
    } = formData;

    const [isViewed, setIsViewed] = useState(false);
    const [showAddButton, setShowAddButton] = useState(true);
    const [loading, setLoading] = useState(false);

    const validationFunction = () => {
        const { level, businessUnit, branch, warehouse } = formData;
        let errors = {
            reason: validateField("reason", reason),
            description: validateField("description", description),
            chosenShift: validateField("chosenShift", chosenShift)
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
            reason: [
                [!value, "Reason is required"],
                [value && value.length < 3, "Minimum 3 characters required"]
            ],
            description: [[!value, "Description is required"]],
            chosenShift: [[!value, "Shift is required"]],
            level: [[!value, "Level is required"]],
            businessUnit: [[!value && levelResult > 1, "Business Unit is required"]],
            branch: [[!value && levelResult > 2, "Branch is required"]],
            warehouse: [[!value && levelResult > 3, "Warehouse is required"]]
        };
        return (rules[name] || []).find(([condition]) => condition)?.[1] || "";
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const updatedFormData = { ...prev, [name]: value };
            return updatedFormData;
        });

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

        setFormDataErr((prev) => ({
            ...prev,
            [name]: validateField(name, value),
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
                const dataObject = {
                    clientId: clientId,
                    level: level,
                    businessUnit: businessUnit,
                    branch: branch,
                    warehouse: warehouse,
                    chosenShift: chosenShift,
                    reason: reason,
                    description: description,
                }

                if (id) {
                    const response = await changeShiftService.update({ ...dataObject, shiftId: id })
                    toast.success(response?.data?.message);
                } else {
                    const response = await changeShiftService.create(dataObject);
                    toast.success(response?.data?.message);
                }

                setFormData({
                    level: "",
                    businessUnit: "",
                    branch: "",
                    warehouse: "",
                    chosenShift: "",
                    reason: "",
                    description: "",
                });
                setFormDataErr({
                    level: "",
                    businessUnit: "",
                    branch: "",
                    warehouse: "",
                    chosenShift: "",
                    reason: "",
                    description: "",
                })
                setLoading(false);
                navigate("/change-shift-list");

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
            async function setData() {
                try {
                    setPageLoading(true)
                    const baseAddress = location?.state?.row;
                    console.log("baseAddress", baseAddress);
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

                    setStatus(baseAddress?.status)

                    setFormData((prev) => ({
                        ...prev,
                        level: level,
                        businessUnit: baseAddress.businessUnit?._id,
                        branch: baseAddress.branch?._id,
                        warehouse: baseAddress.warehouse?._id,
                        chosenShift: baseAddress?.chosenShift?._id,
                        reason: baseAddress?.reason,
                        description: baseAddress?.description,
                    }));
                    setPageLoading(false)
                } catch (error) {
                    setPageLoading(false)
                    console.log("error in setting shift data", error);
                }
            }
            setData()
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
    }, []);

    async function getDepartmentAndShift(currentLevel, levelId) {
        try {
            const [shifts] = await Promise.all([
                employeeService.getShiftOfLevel(currentLevel, levelId)
            ]);
            setShifts(shifts?.data?.shifts);
        } catch (error) {
            console.log("error while getting the department and shift", error);
        }
    }

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
                                    <div className="grid grid-cols-1 md:grid-cols-3  gap-5 ">

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
                                                disabled={true}

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

                                        <div
                                            className={`fromGroup   ${formDataErr?.chosenShift !== "" ? "has-error" : ""
                                                } `}
                                        >
                                            <label htmlFor=" hh" className="form-label ">
                                                <p className="form-label">
                                                    Shift <span className="text-red-500">*</span>
                                                </p>
                                            </label>
                                            <select
                                                name="chosenShift"
                                                value={chosenShift}
                                                onChange={handleChange}
                                                disabled={isViewed || (id && status !== "pending")}
                                                className="form-control py-2  appearance-none relative flex-1"
                                            >
                                                <option value="">None</option>

                                                {shifts &&
                                                    shifts?.map((item) => (
                                                        <option value={item?._id} key={item?._id}>{item?.shiftName}</option>
                                                    ))}
                                            </select>
                                            {<p className="text-sm text-red-500">{formDataErr.chosenShift}</p>}
                                        </div>

                                        <label
                                            className={`fromGroup   ${formDataErr?.reason !== "" ? "has-error" : ""
                                                } `}
                                        >
                                            <p className="form-label">
                                                Reason <span className="text-red-500">*</span>
                                            </p>
                                            <input
                                                name="reason"
                                                type="text"
                                                placeholder="Enter reason name"
                                                value={reason}
                                                onChange={handleChange}
                                                className="form-control py-2"
                                                disabled={isViewed || (id && status !== "pending")}
                                            />
                                            {
                                                <p className="text-sm text-red-500">
                                                    {formDataErr.reason}
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
                                                disabled={isViewed || (id && status !== "pending")}
                                            />
                                            {
                                                <p className="text-sm text-red-500">
                                                    {formDataErr.description}
                                                </p>
                                            }
                                        </label>
                                    </div>
                                    {
                                        isViewed && (
                                            <div className="lg:col-span-2 col-span-1">

                                                {
                                                    (id && status !== "pending") ? "" :
                                                        <div className="flex justify-end py-5 ">
                                                            <Button
                                                                text="Edit"
                                                                // className="border bg-blue-gray-300 rounded px-5 py-2"
                                                                className={`bg-lightBtn dark:bg-darkBtn p-3 rounded-md text-white  text-center btn btn inline-flex justify-center`}
                                                                onClick={() => setIsViewed(false)}
                                                                isLoading={loading}
                                                            />
                                                        </div>
                                                }


                                            </div>
                                        )
                                    }
                                    {
                                        !isViewed && (
                                            <div className="lg:col-span-2 col-span-1">
                                                <div className="ltr:text-right rtl:text-left p-5">
                                                    {showAddButton ? (
                                                        <>
                                                            {
                                                                (id && status !== "pending") ? "" :
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
                                                            }

                                                        </>

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

export default CreateChangeShift;
