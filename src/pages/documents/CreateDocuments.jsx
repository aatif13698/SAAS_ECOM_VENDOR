import { Card } from "@mui/material";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import useDarkMode from "@/hooks/useDarkMode";
import { useLocation, useNavigate } from "react-router-dom";
import "../../assets/scss/common.scss"
import { useSelector } from "react-redux";
import FormLoader from "@/Common/formLoader/FormLoader";
import warehouseService from "@/services/warehouse/warehouse.service";
import employeeService from "@/services/employee/employee.service";
import departmentService from "@/services/department/department.service";
import Button from "@/components/ui/Button";
import Select from 'react-select';
import { FiPlus } from "react-icons/fi";
import { FaExclamationCircle } from "react-icons/fa";
import documentService from "@/services/document/document.service";


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

const CreateDocument = ({ noFade, scrollContent }) => {
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
    const [currentlevelId, setCurrentLevelId] = useState("");
    const [parentLedgers, setParentLedgers] = useState([]);
    const [fields, setFields] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [roleList, setRoleList] = useState([]);
    const [documentData, setDocumentData] = useState(null)

    const [formData, setFormData] = useState({
        level: "",
        businessUnit: "",
        branch: "",
        warehouse: "",

        workDepartment: "",
        jobRole: "",
        docName: "",
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
                setLevelList([]);
                setFormData((prev) => ({ ...prev, businessUnit: currentUser.businessUnit, branch: currentUser.branch }))
            } else if (currentUser.isWarehouseLevel) {
                setLevelList([])
                setFormData((prev) => ({ ...prev, businessUnit: currentUser.businessUnit, branch: currentUser.branch, warehouse: currentUser.warehouse }))
            }
        }

    }, [currentUser])

    const [formDataErr, setFormDataErr] = useState({
        level: "",
        businessUnit: "",
        branch: "",
        warehouse: "",

        docName: "",
        workDepartment: "",
        jobRole: ""
    });

    const {
        level,
        businessUnit,
        branch,
        warehouse,
        docName,
        workDepartment,
        jobRole,
    } = formData;

    console.log("formData", formData);


    const [isViewed, setIsViewed] = useState(false);
    const [showAddButton, setShowAddButton] = useState(true);
    const [loading, setLoading] = useState(false);

    const validateField = (name, value) => {
        const rules = {
            docName: [
                [!value, "Name is Required"],
                [value.length <= 3, "Minimum 3 characters required."]
            ],
            jobRole: [
                [!value, "Job role is Required"],
            ],
            workDepartment: [
                [!value, "Department is Required"],
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
            docName: validateField("docName", docName),
            workDepartment: validateField("workDepartment", workDepartment),
            jobRole: validateField("jobRole", jobRole),
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
            console.log("currentUser dsff", currentUser);

            if (level === "vendor") {
                setLevelResult(1);
                // getAllRespectiveDepartment(level)
            } else if (level === "business") {
                setLevelResult(2)
                // getAllRespectiveDepartment(level, currentUser?.businessUnit)
            } else if (level === "branch") {
                setLevelResult(3)
                // getAllRespectiveDepartment(level, currentUser?.branch)
            } else if (level === "warehouse") {
                setLevelResult(4)
                // getAllRespectiveDepartment(level, currentUser?.warehouse)
            }
        } else {
            setLevelResult(0)
        }
    }, [level, currentUser]);


    async function getAllRespectiveDepartment(level, currentlevelId) {
        try {
            const response = await departmentService.all(level, currentlevelId);
            setDepartments(response?.data?.department)
        } catch (error) {
            console.log("error in getting respective department", error);
        }
    }


    // useEffect(() => {
    //     if (level) {
    //         if (level === "vendor") {
    //             setLevelResult(1);
    //             setCurrentLevelId(null)
    //         } else if (level === "business") {
    //             setLevelResult(2)
    //             setCurrentLevelId(currentUser?.businessUnit)
    //         } else if (level === "branch") {
    //             setLevelResult(3)
    //             setCurrentLevelId(currentUser?.branch)
    //         } else if (level === "warehouse") {
    //             setLevelResult(4)
    //             setCurrentLevelId(currentUser?.warehouse)
    //         }
    //     } else {
    //         setLevelResult(0)
    //     }
    // },[currentlevelId, level])


    useEffect(() => {
        if (businessUnit) {
            getBranchByBusiness(businessUnit);
            if (level === "business") {
                getAllRespectiveDepartment(level, businessUnit);
            }

            if (!id) {
                setFormData((prev) => {
                    return { ...prev, workDepartment: "" }
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
                getAllRespectiveDepartment(level, branch);
            }
            if (!id) {
                setFormData((prev) => {
                    return { ...prev, workDepartment: "" }
                })
            }
        }
    }, [branch]);

    useEffect(() => {
        if (warehouse && level === "warehouse") {
            getAllRespectiveDepartment(level, warehouse);
        }
        if (!id) {
            setFormData((prev) => {
                return { ...prev, workDepartment: "" }
            })
        }
    }, [warehouse]);

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
                    const response = await documentService.update({ ...formData, name: docName, clientId: clientId, groupId: id })
                    toast.success(response?.data?.message);
                } else {
                    const response = await documentService.create({ ...formData, name: docName, clientId: clientId });
                    toast.success(response?.data?.message);

                    setDocumentData(response?.data?.data?.document)

                    getCustomField(response?.data?.data?.document?._id);
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.log("error while creating ledger group", error);
            }
        }
    };

    async function getCustomField(id) {
        try {
            const response = await documentService.getAllField(id);
            setFields(response?.data?.fields)
        } catch (error) {
            console.log("error in getting the fields", error);
        }
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

                    setDocumentData(baseAddress)

                    setFormData((prev) => ({
                        ...prev,
                        level: level,
                        businessUnit: baseAddress.businessUnit,
                        branch: baseAddress.branch,
                        warehouse: baseAddress.warehouse,
                        workDepartment: baseAddress.workDepartment,
                        jobRole: baseAddress.jobRole,
                        docName: baseAddress.name,
                    }));
                    setPageLoading(false)
                } catch (error) {
                    setPageLoading(false)
                    console.log("error in fetching vendor data");
                }
            }
            getBranch();
            getCustomField(location?.state?.row?._id);
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
        getActiveBusinessUnit();
        getAllactiveRoles();
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




    async function getAllactiveRoles() {
        try {
            const response = await employeeService.getActiveRoles();
            setRoleList(response?.listOfRoles)
        } catch (error) {
            console.log("Error while getting active role list", error);
        }
    }


    const renderFieldPreview = (field) => {
        const options = field?.options ? field?.options?.map((item) => ({ value: item, label: item })) : [];

        // console.log("options", options);

        const baseStyles = "w-[100%] bg-transparent   p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";

        switch (field.type) {
            case 'text':
            case 'number':
            case 'email':
            case 'hyperlink':
                return (
                    <input
                        disabled={true}
                        type={field?.type}
                        placeholder={field?.placeholder}
                        className={baseStyles}
                    />
                );
            case 'textarea':
                return (
                    <textarea
                        disabled={true}
                        placeholder={field?.placeholder}
                        className={`${baseStyles} min-h-[100px]`}
                    />
                );
            case 'select':
                return (
                    // <select
                    //     // disabled={true}

                    //     className={baseStyles}>
                    //     <option value="">{field?.placeholder || 'Select an option'}</option>
                    //     {field?.options?.map((opt, idx) => (
                    //         <option key={idx} value={opt}>{opt}</option>
                    //     ))}
                    // </select>
                    <Select
                        isDisabled={true}
                        name="select"
                        options={options}
                        className="basic-multi-select"
                        classNamePrefix="select"
                    />
                );
            case 'multiselect':
                return (
                    <Select
                        isDisabled={true}
                        isMulti
                        name="colors"
                        options={options}
                        className="basic-multi-select"
                        classNamePrefix="select"
                    />
                );
            case 'checkbox':
                return (
                    <input
                        disabled={true}
                        type="checkbox"
                        className="h-5 w-5 text-blue-600"
                    />
                );
            case 'file':
                return (
                    <input
                        type="file"
                        disabled={true}
                        accept={field?.validation?.fileTypes?.join(',')}
                        className={baseStyles}
                    />
                );
            case 'date':
                return (
                    <input
                        type="date"
                        disabled={true}
                        placeholder={field?.placeholder || 'Select a date'}
                        className={baseStyles}
                    />
                );
            case 'timepicker':
                return (
                    <input
                        type="time"
                        disabled={true}
                        placeholder={field?.placeholder || 'Select a time'}
                        className={baseStyles}
                    />
                );
            case 'color':
                return (
                    <input
                        type="color"
                        disabled={true}
                        className={`${baseStyles} h-10 cursor-not-allowed`}
                    />
                );
            default:
                return <div className={baseStyles}>{field?.type} (Preview not available)</div>;
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

                                    <label className={`fromGroup   ${formDataErr?.workDepartment !== "" ? "has-error" : ""
                                        } `}>
                                        <p className="form-label">
                                            Department  <span className="text-red-500">*</span>
                                        </p>
                                        <select
                                            value={formData?.workDepartment}
                                            onChange={handleChange}
                                            disabled={isViewed}
                                            name="workDepartment" className="form-control outline-none w-[100%] rounded-md px-4 py-2.5 border border-lightborderInputColor dark:border-darkSecondary text-lightinputTextColor dark:placeholder-darkPlaceholder bg-lightBgInputColor dark:bg-darkIconAndSearchBg dark:text-white"
                                        >
                                            <option value="" >--Select department--</option>
                                            {
                                                departments && departments.length > 0 && departments.map((item) => {
                                                    return (
                                                        <option key={item._id} value={item._id}>{item?.departmentName}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                        {<p className="text-red-600  text-xs">{formDataErr.workDepartment}</p>}
                                    </label>
                                    <label className={`fromGroup   ${formDataErr?.jobRole !== "" ? "has-error" : ""
                                        } `}>
                                        <p className="form-label">
                                            Job Role  <span className="text-red-500">*</span>
                                        </p>
                                        <select
                                            value={formData?.jobRole}
                                            onChange={handleChange}
                                            disabled={isViewed}
                                            name="jobRole" className="form-control outline-none w-[100%] rounded-md px-4 py-2.5 border border-lightborderInputColor dark:border-darkSecondary text-lightinputTextColor dark:placeholder-darkPlaceholder bg-lightBgInputColor dark:bg-darkIconAndSearchBg dark:text-white"
                                        >
                                            <option value="" >--Select Job Role--</option>
                                            {
                                                roleList && roleList.length > 0 && roleList.map((item) => {
                                                    return (
                                                        <option key={item._id} value={item._id}>{item?.name}</option>
                                                    )
                                                })
                                            }

                                        </select>
                                        {<p className="text-red-600  text-xs">{formDataErr.roleId}</p>}
                                    </label>


                                    <label
                                        className={`fromGroup   ${formDataErr?.docName !== "" ? "has-error" : ""
                                            } `}
                                    >
                                        <p className="form-label">
                                            Name <span className="text-red-500">*</span>
                                        </p>
                                        <input
                                            name="docName"
                                            type="text"
                                            placeholder="Enter name"
                                            value={docName}
                                            onChange={handleChange}
                                            className="form-control py-2"
                                            disabled={isViewed}
                                        />
                                        {
                                            <p className="text-sm text-red-500">
                                                {formDataErr.docName}
                                            </p>
                                        }
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

                            {

                                fields?.length > 0 &&

                                <>

                                    <h4 className="mb-2">Dynamic Fields</h4>

                                    <div className=" border-2 border-dashed border-lightBtn dark:border-darkBtn px-2 py-4">

                                        {
                                            [...fields, ...fields].length > 0 ?
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
                                                    {[...fields]
                                                        .sort((a, b) => a.gridConfig?.order - b.gridConfig?.order)
                                                        .map((field, index) => {
                                                            return (
                                                                <div
                                                                    className='relative'
                                                                    key={index}
                                                                    style={{ order: field?.gridConfig?.order }}
                                                                >

                                                                    {/* {
                                                                    field?.isDeleteAble ?
                                                                        <Tippy
                                                                            content={"delete"}
                                                                            placement="top"
                                                                        >
                                                                            <button
                                                                                // onClick={() => handleDeleteField(field?._id)}
                                                                                className={`bg-red-400/20 dark:bg-red-600 absolute right-0 text-[.90rem] font-bold text-black dark:text-white px-1 py-1 rounded-md`}
                                                                            >
                                                                                <RxCross2 className='text-red-600 dark:text-red-200' />
                                                                            </button>
                                                                        </Tippy> :

                                                                        <span className=' absolute right-0'>
                                                                            <RxValueNone className='text-green-900 dark:text-green-200' />
                                                                        </span>


                                                                } */}

                                                                    <label className="block text-sm font-medium text-formLabelLight dark:text-formLabelDark mb-1">
                                                                        {field?.label}{field?.isRequired && <span className="text-red-500">*</span>}
                                                                    </label>
                                                                    {renderFieldPreview(field)}
                                                                </div>
                                                            )
                                                        }
                                                        )
                                                    }
                                                </div>
                                                :
                                                <div className="flex mt-4 flex-col justify-center items-center py-8 sm:py-12 bg-gray-100 dark:bg-gray-900 rounded-xl shadow-md">
                                                    <FaExclamationCircle className="text-3xl sm:text-4xl text-gray-400 dark:text-gray-500 mb-3 sm:mb-4" />
                                                    <p className="text-base sm:text-lg font-medium text-gray-600 dark:text-gray-300 mb-3 sm:mb-4">
                                                        No Fields Found
                                                    </p>
                                                </div>
                                        }

                                        <div className="flex justify-start py-5 ">
                                            <button
                                                // className="border bg-blue-gray-300 rounded px-5 py-2"
                                                className={`border-lightBtn border-2 w-[100%] dark:border-darkBtn p-3 rounded-md text-lightBtn dark:text-darkBtn  items-center flex justify-center`}
                                                onClick={() => navigate("/documents/custom-field", { state: { group: documentData } })}
                                                isLoading={loading}
                                            >
                                                <span><FiPlus /></span>
                                                <span>Add More Field</span>

                                            </button>
                                        </div>
                                    </div>

                                </>


                            }
                        </div>
                    </div>
            }
        </>

    );
};

export default CreateDocument;
