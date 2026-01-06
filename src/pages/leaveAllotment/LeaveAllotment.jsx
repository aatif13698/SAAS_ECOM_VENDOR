import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import useDarkMode from "@/hooks/useDarkMode";
import { useLocation, useNavigate } from "react-router-dom";
import "../../assets/scss/common.scss"

import { useSelector } from "react-redux";
import FormLoader from "@/Common/formLoader/FormLoader";
import warehouseService from "@/services/warehouse/warehouse.service";
import departmentService from "@/services/department/department.service";
import Button from "@/components/ui/Button";
import ledgerGroupService from "@/services/ledgerGroup/ledgerGroup.service";
import leaveCategoryService from "@/services/leaveCategory/leaveCategory.service";
import { categories } from "@/constant/data";




const LeaveAllotment = ({ noFade, scrollContent }) => {
    const navigate = useNavigate();
    const { user: currentUser, isAuth: isAuthenticated } = useSelector((state) => state.auth);
    const [levelList, setLevelList] = useState([
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
    const [departments, setDepartments] = useState([]);
    const [leaveCategories, setLeaveCategories] = useState([]);
    const [allotments, setAllotments] = useState([
        {
            categoryId: "",
            allocated: 0,
        }
    ]);


    const [formData, setFormData] = useState({
        level: "",
        businessUnit: "",
        branch: "",
        warehouse: "",

        workingDepartment: "",
    });


    useEffect(() => {
        if (currentUser && isAuthenticated) {
            if (currentUser.isVendorLevel) {
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

        }

    }, [currentUser])

    const [formDataErr, setFormDataErr] = useState({
        level: "",
        businessUnit: "",
        branch: "",
        warehouse: "",

        workingDepartment: "",
    });

    const {
        level,
        businessUnit,
        branch,
        warehouse,

        workingDepartment,
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
            groupName: validateField("groupName", groupName),
        };
        if (hasParent && workingDepartment == "") {
            errors.workingDepartment = "Parent group is required"
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
            getBranchByBusiness(businessUnit);
            if (level === "business") {
                getDepartments(level, businessUnit);
                getLeaveCategory(level, businessUnit);
            }
            if (!id) {
                setFormData((prev) => {
                    return { ...prev, workingDepartment: "" }
                })
            }
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
            getWarehouseByBranch(branch);
            if (level === "branch") {
                getDepartments(level, branch);
                getLeaveCategory(level, branch);
            }
            if (!id) {
                setFormData((prev) => {
                    return { ...prev, workingDepartment: "" }
                })
            }
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
        if (warehouse && level === "warehouse") {
            getDepartments(level, warehouse);
            getLeaveCategory(level, warehouse);
        }
        if (!id) {
            setFormData((prev) => {
                return { ...prev, workingDepartment: "" }
            })
        }
    }, [warehouse]);


    useEffect(() => {
        if (workingDepartment && level) {
            if (level == "business") {
                getLeaveAllotments(level, businessUnit, workingDepartment)
            } else if (level == "branch") {
                getLeaveAllotments(level, branch, workingDepartment)
            } else if (level == "warehouse") {
                getLeaveAllotments(level, warehouse, workingDepartment)
            }
        }
    }, [workingDepartment]);


    async function getLeaveAllotments(level, levelid, workingDepartment) {
        try {
            const response = await leaveCategoryService.getLeaveAllotmentByDepartment(level, levelid, workingDepartment);
            if (response?.data?.leaveAllotment) {
                setAllotments(response?.data?.leaveAllotment?.leaveCategories)
            }
        } catch (error) {
            console.log("error while getting leave allotment", error);
        }
    }


    const onSubmit = async (e) => {
        e.preventDefault();
        setIsViewed(false);
        const error = validationFunction();
        setLoading(true);
        if (error) {

        } else {

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
                        businessUnit: baseAddress.businessUnit?._id,
                        branch: baseAddress.branch?._id,
                        warehouse: baseAddress.warehouse?._id,
                        groupName: baseAddress.groupName,
                        hasParent: baseAddress.hasParent,
                        workingDepartment: baseAddress.workingDepartment?._id
                    }));
                    setPageLoading(false)
                } catch (error) {
                    setPageLoading(false)
                    console.log("error in fetching vendor data");
                }
            }
            getBranch();
        } else {
            setPageLoading(false)
        }
    }, [id, parentLedgers]);

    async function getDepartments(level, levelId) {
        try {
            const response = await departmentService.all(level, levelId);
            setDepartments(response?.data?.departments);
        } catch (error) {
            console.log("error while fetching departments", error);
        }
    }

    async function getLeaveCategory(level, levelId) {
        try {
            const response = await leaveCategoryService.getAllLeaveCategory(level, levelId);
            setLeaveCategories(response?.data?.leaveCategories)
        } catch (error) {
            console.log("error while fetching departments", error);
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

                    <>
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


                                        {
                                            departments?.length > 0 ?
                                                <>
                                                    <div
                                                        className={`fromGroup md:col-span-2   ${formDataErr?.workingDepartment !== "" ? "has-error" : ""
                                                            } `}
                                                    >
                                                        <label htmlFor=" hh" className="form-label ">
                                                            <p className="form-label">
                                                                Department <span className="text-red-500">*</span>
                                                            </p>
                                                        </label>
                                                        <select
                                                            name="workingDepartment"
                                                            disabled={isViewed || id}

                                                            value={workingDepartment}
                                                            onChange={handleChange}
                                                            className="form-control py-2  appearance-none relative flex-1"
                                                        >
                                                            <option value="">None</option>
                                                            {departments &&
                                                                departments?.map((item) => (
                                                                    <option value={item?._id} key={item?._id}>{item?.departmentName}</option>
                                                                ))}
                                                        </select>
                                                        {<p className="text-sm text-red-500">{formDataErr.workingDepartment}</p>}
                                                    </div>
                                                </>

                                                : <div>No Departments Available</div>
                                        }
                                    </div>
                                </form>
                            </div>
                        </div>


                        <div className="bg-white shadow-lg mt-2 p-4">
                            {
                                allotments?.map((item) => {
                                    return (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className={`fromGroup `}>
                                                <label htmlFor="name" className="form-label ">Select Leave Category</label>
                                                <select className="form-control py-2  appearance-none relative flex-1" name="" id="">
                                                    <option value="Select one"></option>
                                                    {
                                                        leaveCategories && leaveCategories?.length > 0 && leaveCategories?.map((cat, index) => {
                                                            return (
                                                                <option key={cat?._id} value={cat?._id}>{cat?.name}</option>
                                                            )
                                                        })
                                                    }
                                                </select>  
                                            </div>
                                            <div lassName={`fromGroup `}>
                                                <label className="form-label " htmlFor="name">Days</label>
                                                <input className="form-control py-2  appearance-none relative flex-1" type="number" placeholder="Enter number of days." />
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </>






            }
        </>

    );
};

export default LeaveAllotment;
