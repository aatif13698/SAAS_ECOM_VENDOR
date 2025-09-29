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
import shiftService from "@/services/shift/shift.service";



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




const CreateShift = ({ noFade, scrollContent }) => {
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

        shiftName: "",
        startTime: "",
        endTime: "",
        duration: "",
        shiftType: "",
        status: "",
        requiredEmployees: "",
        notes: "",
        frequency: "",
        days: []
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

        shiftName: "",
        startTime: "",
        endTime: "",
        duration: "",
        shiftType: "",
        status: "",
        requiredEmployees: "",
        notes: "",
        frequency: "",
        days: ""
    });

    const {
        level,
        businessUnit,
        branch,
        warehouse,

        shiftName,
        startTime,
        endTime,
        duration,
        shiftType,
        status,
        requiredEmployees,
        notes,
        frequency,
        days
    } = formData;

    const [isViewed, setIsViewed] = useState(false);
    const [showAddButton, setShowAddButton] = useState(true);
    const [loading, setLoading] = useState(false);

    const calculateDuration = (start, end) => {
        if (!start || !end) return "";
        const [startHours, startMinutes] = start.split(":").map(Number);
        const [endHours, endMinutes] = end.split(":").map(Number);
        const startDate = new Date(2000, 0, 1, startHours, startMinutes);
        let endDate = new Date(2000, 0, 1, endHours, endMinutes);

        // Handle case where endTime is on the next day (e.g., 22:00 to 02:00)
        if (endDate <= startDate) {
            endDate.setDate(endDate.getDate() + 1);
        }

        const diffInMinutes = (endDate - startDate) / (1000 * 60);
        return diffInMinutes >= 0 ? diffInMinutes.toString() : "";
    };

    const validationFunction = () => {
        const { level, businessUnit, branch, warehouse } = formData;
        let errors = {
            shiftName: validateField("shiftName", shiftName),
            startTime: validateField("startTime", startTime),
            endTime: validateField("endTime", endTime),
            duration: validateField("duration", duration),
            shiftType: validateField("shiftType", shiftType),
            status: validateField("status", status),
            requiredEmployees: validateField("requiredEmployees", requiredEmployees),
            notes: validateField("notes", notes),
            frequency: validateField("frequency", frequency),
            days: validateField("days", days),
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

    const validateField = (name, value, formData = {}) => {
        const rules = {
            shiftName: [
                [!value, "Shift Name is required"],
                [value && value.length < 3, "Minimum 3 characters required"]
            ],
            startTime: [[!value, "Start time is required"]],
            endTime: [[!value, "End time is required"]],
            duration: [
                [!value && formData.startTime && formData.endTime, "Invalid time range: End time must be after start time"],
                [value && (isNaN(value) || value <= 0), "Duration must be a positive number"]
            ],
            shiftType: [[!value, "Shift type is required"]],
            status: [[!value, "Status is required"]],
            requiredEmployees: [
                [!value, "Employees limit is required"],
                [value && (isNaN(value) || value <= 0), "Must be a positive number"]
            ],
            notes: [[!value, "Notes are required"]],
            frequency: [[!value, "Frequency is required"]],
            days: [[!value || value.length === 0, "At least one day must be selected"]],
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

            // Calculate duration if startTime or endTime changes
            if (name === "startTime" || name === "endTime") {
                updatedFormData.duration = calculateDuration(
                    name === "startTime" ? value : prev.startTime,
                    name === "endTime" ? value : prev.endTime
                );
            }

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
            [name]: validateField(name, value, { startTime: formData.startTime, endTime: formData.endTime }),
            ...(name === "startTime" || name === "endTime"
                ? {
                    duration: validateField("duration", calculateDuration(
                        name === "startTime" ? value : formData.startTime,
                        name === "endTime" ? value : formData.endTime
                    ), { startTime: name === "startTime" ? value : formData.startTime, endTime: name === "endTime" ? value : formData.endTime })
                }
                : {})
        }));
    };

    const handleDaysChange = (selectedOptions) => {
        const selectedDays = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setFormData((prev) => ({
            ...prev,
            days: selectedDays
        }));
        setFormDataErr((prev) => ({
            ...prev,
            days: validateField("days", selectedDays)
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
                    shiftName: shiftName,
                    startTime: startTime,
                    shiftType: shiftType,
                    duration: duration,
                    endTime: endTime,
                    status: status,
                    requiredEmployees: requiredEmployees,
                    recurring: {
                        frequency: frequency,
                        days: days
                    },
                    notes: notes
                }

                if (id) {
                    const response = await shiftService.update({...dataObject, shiftId: id})
                    toast.success(response?.data?.message);
                } else {
                    const response = await shiftService.create(dataObject);
                    toast.success(response?.data?.message);
                }

                setFormData({
                    level: "",
                    businessUnit: "",
                    branch: "",
                    warehouse: "",
                    shiftName: "",
                    startTime: "",
                    endTime: "",
                    duration: "",
                    shiftType: "",
                    status: "",
                    requiredEmployees: "",
                    notes: "",
                    frequency: "",
                    days: []
                });
                setFormDataErr({
                    level: "",
                    businessUnit: "",
                    branch: "",
                    warehouse: "",
                    shiftName: "",
                    startTime: "",
                    endTime: "",
                    duration: "",
                    shiftType: "",
                    status: "",
                    requiredEmployees: "",
                    notes: "",
                    frequency: "",
                    days: ""
                })
                setLoading(false);
                navigate("/shift-list");

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
                    setFormData((prev) => ({
                        ...prev,
                        level: level,
                        businessUnit: baseAddress.businessUnit,
                        branch: baseAddress.branch,
                        warehouse: baseAddress.warehouse,
                        shiftName: baseAddress?.shiftName,
                        startTime: baseAddress?.startTime,
                        endTime: baseAddress?.endTime,
                        duration: baseAddress?.duration,
                        shiftType: baseAddress?.shiftType,
                        status: baseAddress?.status,
                        requiredEmployees: baseAddress?.requiredEmployees,
                        notes: baseAddress?.notes,
                        frequency: baseAddress?.recurring?.frequency,
                        days: baseAddress?.recurring?.days
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
                                            className={`fromGroup   ${formDataErr?.shiftName !== "" ? "has-error" : ""
                                                } `}
                                        >
                                            <p className="form-label">
                                                Shift Name <span className="text-red-500">*</span>
                                            </p>
                                            <input
                                                name="shiftName"
                                                type="text"
                                                placeholder="Enter shift name"
                                                value={shiftName}
                                                onChange={handleChange}
                                                className="form-control py-2"
                                                disabled={isViewed}
                                            />
                                            {
                                                <p className="text-sm text-red-500">
                                                    {formDataErr.shiftName}
                                                </p>
                                            }
                                        </label>

                                        <label
                                            className={`fromGroup   ${formDataErr?.startTime !== "" ? "has-error" : ""
                                                } `}
                                        >
                                            <p className="form-label">
                                                Start Time <span className="text-red-500">*</span>
                                            </p>
                                            <input
                                                name="startTime"
                                                type="time"
                                                value={startTime}
                                                onChange={handleChange}
                                                className="form-control py-2"
                                                disabled={isViewed}
                                            />
                                            {
                                                <p className="text-sm text-red-500">
                                                    {formDataErr.startTime}
                                                </p>
                                            }
                                        </label>

                                        <label
                                            className={`fromGroup   ${formDataErr?.endTime !== "" ? "has-error" : ""
                                                } `}
                                        >
                                            <p className="form-label">
                                                End Time <span className="text-red-500">*</span>
                                            </p>
                                            <input
                                                name="endTime"
                                                type="time"
                                                value={endTime}
                                                onChange={handleChange}
                                                className="form-control py-2"
                                                disabled={isViewed}
                                            />
                                            {
                                                <p className="text-sm text-red-500">
                                                    {formDataErr.endTime}
                                                </p>
                                            }
                                        </label>

                                        <label className={`fromGroup ${formDataErr?.duration ? "has-error" : ""}`}>
                                            <p className="form-label">
                                                Duration (minutes) <span className="text-red-500">*</span>
                                            </p>
                                            <input
                                                name="duration"
                                                type="number"
                                                placeholder="Auto-calculated"
                                                value={duration}
                                                className="form-control py-2 bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                                                disabled
                                            />
                                            {formDataErr?.duration && <p className="text-sm text-red-500">{formDataErr.duration}</p>}
                                        </label>

                                        <label className={`fromGroup   ${formDataErr?.shiftType !== "" ? "has-error" : ""
                                            } `}>
                                            <p className=" form-label">
                                                Shift Type
                                                <span className="text-red-500">*</span>
                                            </p>
                                            <select
                                                name="shiftType"
                                                value={shiftType}
                                                className="form-control outline-none w-[100%] rounded-md px-4 py-2.5 border border-lightborderInputColor dark:border-darkSecondary text-lightinputTextColor dark:placeholder-darkPlaceholder bg-lightBgInputColor dark:bg-darkIconAndSearchBg dark:text-white"
                                                onChange={handleChange}
                                                disabled={isViewed}
                                            >
                                                <option value="">Select</option>
                                                <option value="day"> Day</option>
                                                <option value="night">Night</option>
                                                <option value="rotating">Rotating</option>
                                                <option value="on-call">On-call</option>
                                            </select>
                                            {<p className="text-red-600  text-xs">{formDataErr.shiftType}</p>}
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
                                                <option value="planned"> Planned</option>
                                                <option value="active">Active</option>
                                                <option value="completed">Completed</option>
                                                <option value="canceled">Cancelled</option>
                                            </select>
                                            {<p className="text-red-600  text-xs">{formDataErr.status}</p>}
                                        </label>

                                        <label
                                            className={`fromGroup   ${formDataErr?.requiredEmployees !== "" ? "has-error" : ""
                                                } `}
                                        >
                                            <p className="form-label">
                                                Employee Limit <span className="text-red-500">*</span>
                                            </p>
                                            <input
                                                name="requiredEmployees"
                                                type="number"
                                                placeholder="Enter employee limit"
                                                value={requiredEmployees}
                                                onChange={handleChange}
                                                className="form-control py-2"
                                                disabled={isViewed}
                                            />
                                            {
                                                <p className="text-sm text-red-500">
                                                    {formDataErr.requiredEmployees}
                                                </p>
                                            }
                                        </label>

                                        <label className={`fromGroup   ${formDataErr?.frequency !== "" ? "has-error" : ""
                                            } `}>
                                            <p className=" form-label">
                                                frequency
                                                <span className="text-red-500">*</span>
                                            </p>
                                            <select
                                                name="frequency"
                                                value={frequency}
                                                className="form-control outline-none w-[100%] rounded-md px-4 py-2.5 border border-lightborderInputColor dark:border-darkSecondary text-lightinputTextColor dark:placeholder-darkPlaceholder bg-lightBgInputColor dark:bg-darkIconAndSearchBg dark:text-white"
                                                onChange={handleChange}
                                                disabled={isViewed}
                                            >
                                                <option value="">Select</option>
                                                <option value="daily"> Daily</option>
                                                <option value="weekly">Weekly</option>
                                                <option value="monthly">Monthly</option>
                                            </select>
                                            {<p className="text-red-600  text-xs">{formDataErr.frequency}</p>}
                                        </label>

                                        <label className={`fromGroup ${formDataErr?.days ? "has-error" : ""}`}>
                                            <p className="form-label">
                                                Days <span className="text-red-500">*</span>
                                            </p>
                                            <Select
                                                isMulti
                                                name="days"
                                                options={daysOptions}
                                                value={daysOptions.filter(option => days.includes(option.value))}
                                                onChange={handleDaysChange}
                                                isDisabled={isViewed}
                                                className="react-select-container"
                                                classNamePrefix="react-select"
                                                styles={{
                                                    control: (base) => ({
                                                        ...base,
                                                        backgroundColor: isDark ? '#1a202c' : '#fff',
                                                        borderColor: isDark ? '#4a5568' : '#e2e8f0',
                                                        color: isDark ? '#fff' : '#000',
                                                        padding: '0.5rem',
                                                        borderRadius: '0.375rem'
                                                    }),
                                                    menu: (base) => ({
                                                        ...base,
                                                        backgroundColor: isDark ? '#1a202c' : '#fff',
                                                        color: isDark ? '#fff' : '#000'
                                                    }),
                                                    multiValue: (base) => ({
                                                        ...base,
                                                        backgroundColor: isDark ? '#4a5568' : '#ff0d0d',
                                                        color: isDark ? '#fff' : '#ff0d0d'
                                                    }),
                                                    multiValueLabel: (base) => ({
                                                        ...base,
                                                        color: isDark ? '#fff' : '#fff'
                                                    })
                                                }}
                                                placeholder="Select Days"
                                            />
                                            {formDataErr?.days && <p className="text-red-600 text-xs">{formDataErr.days}</p>}
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

export default CreateShift;
