import { Card } from "@mui/material";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import useDarkMode from "@/hooks/useDarkMode";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import warehouseService from "@/services/warehouse/warehouse.service";
import holidayService from "@/services/holiday/holiday.service";
import FormLoader from "@/Common/formLoader/FormLoader";

const CreateHoliday = ({ noFade, scrollContent }) => {
    const navigate = useNavigate();
    const { user: currentUser, isAuth: isAuthenticated } = useSelector((state) => state.auth);
    const [isDark] = useDarkMode();
    const location = useLocation();
    const row = location?.state?.row;
    const id = location?.state?.id;

    const [pageLoading, setPageLoading] = useState(true);
    const [levelList, setLevelList] = useState([
        // { name: "Vendor", value: "vendor" },
        { name: "Business", value: "business" },
        { name: "Branch", value: "branch" },
        { name: "Warehouse", value: "warehouse" },
    ]);
    const [activeBusinessUnits, setActiveBusinessUnits] = useState([]);
    const [activeBranches, setActiveBranches] = useState([]);
    const [activeWarehouse, setActiveWarehouse] = useState([]);
    const [levelResult, setLevelResult] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isViewed, setIsViewed] = useState(false);

    const [formData, setFormData] = useState({
        level: "",
        businessUnit: "",
        branch: "",
        warehouse: "",
        name: "",
        code: "",
        description: "",
        startDate: "",
        endDate: "",
        isHalfDay: false,
    });

    const [formDataErr, setFormDataErr] = useState({
        level: "",
        businessUnit: "",
        branch: "",
        warehouse: "",
        name: "",
        code: "",
        description: "",
        startDate: "",
        endDate: "",
        isHalfDay: "",
    });

    const {
        level,
        businessUnit,
        branch,
        warehouse,
        name,
        code,
        description,
        startDate,
        endDate,
        isHalfDay,
    } = formData;

    // Calculate if isHalfDay should be disabled
    const isHalfDayDisabled = () => {
        if (!startDate || !endDate) return false;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffInDays = (end - start) / (1000 * 60 * 60 * 24);
        return diffInDays > 0;
    };

    useEffect(() => {
        if (isHalfDayDisabled() && isHalfDay) {
            setFormData((prev) => ({ ...prev, isHalfDay: false }));
        }
    }, [startDate, endDate]);

    useEffect(() => {
        if (currentUser && isAuthenticated) {
            if (currentUser.isVendorLevel) {
                setLevelList([
                    { name: "Vendor", value: "vendor" },
                    { name: "Business", value: "business" },
                    { name: "Branch", value: "branch" },
                    { name: "Warehouse", value: "warehouse" },
                ]);
            } else if (currentUser.isBuLevel) {
                setLevelList([
                    { name: "Business", value: "business" },
                    { name: "Branch", value: "branch" },
                    { name: "Warehouse", value: "warehouse" },
                ]);
                setFormData((prev) => ({ ...prev, businessUnit: currentUser.businessUnit }));
            } else if (currentUser.isBranchLevel) {
                setLevelList([
                    { name: "Branch", value: "branch" },
                    { name: "Warehouse", value: "warehouse" },
                ]);
                setFormData((prev) => ({ ...prev, businessUnit: currentUser.businessUnit, branch: currentUser.branch }));
            } else if (currentUser.isWarehouseLevel) {
                setLevelList([{ name: "Warehouse", value: "warehouse" }]);
                setFormData((prev) => ({
                    ...prev,
                    businessUnit: currentUser.businessUnit,
                    branch: currentUser.branch,
                    warehouse: currentUser.warehouse,
                }));
            }
        }
    }, [currentUser, isAuthenticated]);

    useEffect(() => {
        async function getActiveBusinessUnit() {
            try {
                const response = await warehouseService.getActiveBusinessUnit();
                setActiveBusinessUnits(response?.data?.businessUnits || []);
            } catch (error) {
                console.error("Error fetching active business units:", error);
            }
        }
        getActiveBusinessUnit();
    }, []);

    useEffect(() => {
        if (businessUnit) {
            getBranchByBusiness(businessUnit);
        }
    }, [businessUnit]);

    async function getBranchByBusiness(id) {
        try {
            const response = await warehouseService.getBranchByBusiness(id);
            setActiveBranches(response.data || []);
        } catch (error) {
            console.error("Error fetching branches by business unit:", error);
        }
    }

    useEffect(() => {
        if (branch) {
            getWarehouseByBranch(branch);
        }
    }, [branch]);

    async function getWarehouseByBranch(id) {
        try {
            const response = await warehouseService.getWarehouseByBranch(id);
            setActiveWarehouse(response.data || []);
        } catch (error) {
            console.error("Error fetching warehouses by branch:", error);
        }
    }

    useEffect(() => {
        if (level) {
            if (level === "vendor") {
                setLevelResult(1);
                setFormData((prev) => ({
                    ...prev,
                    isVendorLevel: true,
                    isBuLevel: false,
                    isBranchLevel: false,
                    isWarehouseLevel: false,
                }));
            } else if (level === "business") {
                setLevelResult(2);
                setFormData((prev) => ({
                    ...prev,
                    isVendorLevel: false,
                    isBuLevel: true,
                    isBranchLevel: false,
                    isWarehouseLevel: false,
                }));
            } else if (level === "branch") {
                setLevelResult(3);
                setFormData((prev) => ({
                    ...prev,
                    isVendorLevel: false,
                    isBuLevel: false,
                    isBranchLevel: true,
                    isWarehouseLevel: false,
                }));
            } else if (level === "warehouse") {
                setLevelResult(4);
                setFormData((prev) => ({
                    ...prev,
                    isVendorLevel: false,
                    isBuLevel: false,
                    isBranchLevel: false,
                    isWarehouseLevel: true,
                }));
            }
        } else {
            setLevelResult(0);
            setFormData((prev) => ({
                ...prev,
                isVendorLevel: false,
                isBuLevel: false,
                isBranchLevel: false,
                isWarehouseLevel: false,
            }));
        }
    }, [level]);

    useEffect(() => {
        if (id && row) {
            setIsViewed(location?.state?.name === "view");
            setFormData({
                level: row.isVendorLevel
                    ? "vendor"
                    : row.isBuLevel
                        ? "business"
                        : row.isBranchLevel
                            ? "branch"
                            : row.isWarehouseLevel
                                ? "warehouse"
                                : "",
                businessUnit: row.businessUnit || "",
                branch: row.branch || "",
                warehouse: row.warehouse || "",
                name: row.name || "",
                code: row.code || "",
                description: row.description || "",
                startDate: row.startDate ? new Date(row.startDate).toISOString().split("T")[0] : "",
                endDate: row.endDate ? new Date(row.endDate).toISOString().split("T")[0] : "",
                isHalfDay: row.isHalfDay || false,
            });
            setPageLoading(false);
        } else {
            setPageLoading(false);
        }
    }, [id, row]);

    const validateField = (name, value) => {
        const rules = {
            level: [[!value, "Level is required"]],
            businessUnit: [[!value && (level === "business" || level === "branch" || level === "warehouse"), "Business Unit is required"]],
            branch: [[!value && (level === "branch" || level === "warehouse"), "Branch is required"]],
            warehouse: [[!value && level === "warehouse", "Warehouse is required"]],
            name: [
                [!value, "Name is required"],
                [value.length < 3, "Name must be at least 3 characters"],
            ],
            code: [
                [!value, "Code is required"],
                [value.length < 3, "Code must be at least 3 characters"],
            ],
            description: [[value && value.length < 3, "Description must be at least 3 characters"]],
            startDate: [[!value, "Start Date is required"]],
            endDate: [
                [!value, "End Date is required"],
                [value && startDate && new Date(value) < new Date(startDate), "End Date must be on or after Start Date"],
            ],
        };
        return (rules[name] || []).find(([condition]) => condition)?.[1] || "";
    };

    const validationFunction = () => {
        const errors = {
            level: validateField("level", level),
            businessUnit: validateField("businessUnit", businessUnit),
            branch: validateField("branch", branch),
            warehouse: validateField("warehouse", warehouse),
            name: validateField("name", name),
            code: validateField("code", code),
            description: validateField("description", description),
            startDate: validateField("startDate", startDate),
            endDate: validateField("endDate", endDate),
        };
        setFormDataErr((prev) => ({ ...prev, ...errors }));
        return Object.values(errors).some((error) => error);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === "checkbox" ? checked : value;
        setFormData((prev) => ({
            ...prev,
            [name]: newValue,
        }));
        setFormDataErr((prev) => ({
            ...prev,
            [name]: validateField(name, newValue),
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setIsViewed(false);
        if (validationFunction()) {
            setLoading(false);
            toast.error("Please fix the errors in the form");
            return;
        }
        setLoading(true);
        try {
            const clientId = localStorage.getItem("saas_client_clientId");
            const payload = {
                ...formData,
                clientId,
                isVendorLevel: formData.isVendorLevel || false,
                isBuLevel: formData.isBuLevel || false,
                isBranchLevel: formData.isBranchLevel || false,
                isWarehouseLevel: formData.isWarehouseLevel || false,
                startDate: new Date(formData.startDate),
                endDate: new Date(formData.endDate),
            };
            if (id) {
                const response = await holidayService.update({ ...payload, holidayId: id });
                toast.success(response?.data?.message || "Holiday updated successfully");
            } else {
                const response = await holidayService.create(payload);
                toast.success(response?.data?.message || "Holiday created successfully");
            }
            setFormData({
                level: "",
                businessUnit: "",
                branch: "",
                warehouse: "",
                name: "",
                code: "",
                description: "",
                startDate: "",
                endDate: "",
                isHalfDay: false,
            });
            setFormDataErr({
                level: "",
                businessUnit: "",
                branch: "",
                warehouse: "",
                name: "",
                code: "",
                description: "",
                startDate: "",
                endDate: "",
                isHalfDay: "",
            });
            navigate("/holiday-list");
        } catch (error) {
            console.error("Error saving holiday:", error);
            toast.error("Failed to save holiday");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {pageLoading ? (
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
            ) : (
                <div>
                    <Card>
                        <div className={`${isDark ? "bg-darkSecondary text-white" : ""} p-5`}>
                            <form onSubmit={onSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Level Selection */}
                                    <div className={`fromGroup ${formDataErr.level ? "has-error" : ""}`}>
                                        <label htmlFor="level" className="form-label">
                                            Level <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="level"
                                            value={level}
                                            onChange={handleChange}
                                            disabled={isViewed}
                                            className="form-control py-2 appearance-none relative flex-1"
                                        >
                                            <option value="">None</option>
                                            {levelList.map((item) => (
                                                <option value={item.value} key={item.value}>
                                                    {item.name}
                                                </option>
                                            ))}
                                        </select>
                                        {formDataErr.level && <p className="text-sm text-red-500">{formDataErr.level}</p>}
                                    </div>

                                    {/* Business Unit Selection */}
                                    {(levelResult === 0 || levelResult === 1) ? null : (
                                        <div className={`fromGroup ${formDataErr.businessUnit ? "has-error" : ""}`}>
                                            <label htmlFor="businessUnit" className="form-label">
                                                Business Unit <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                name="businessUnit"
                                                value={businessUnit}
                                                onChange={handleChange}
                                                disabled={isViewed || currentUser.isBuLevel || currentUser.isBranchLevel || currentUser.isWarehouseLevel}
                                                className="form-control py-2 appearance-none relative flex-1"
                                            >
                                                <option value="">None</option>
                                                {activeBusinessUnits.map((item) => (
                                                    <option value={item._id} key={item._id}>
                                                        {item.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {formDataErr.businessUnit && <p className="text-sm text-red-500">{formDataErr.businessUnit}</p>}
                                        </div>
                                    )}

                                    {/* Branch Selection */}
                                    {(levelResult === 0 || levelResult === 1 || levelResult === 2) ? null : (
                                        <div className={`fromGroup ${formDataErr.branch ? "has-error" : ""}`}>
                                            <label htmlFor="branch" className="form-label">
                                                Branch <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                name="branch"
                                                value={branch}
                                                onChange={handleChange}
                                                disabled={isViewed || currentUser.isBranchLevel || currentUser.isWarehouseLevel}
                                                className="form-control py-2 appearance-none relative flex-1"
                                            >
                                                <option value="">None</option>
                                                {activeBranches.map((item) => (
                                                    <option value={item._id} key={item._id}>
                                                        {item.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {formDataErr.branch && <p className="text-sm text-red-500">{formDataErr.branch}</p>}
                                        </div>
                                    )}

                                    {/* Warehouse Selection */}
                                    {(levelResult === 0 || levelResult === 1 || levelResult === 2 || levelResult === 3) ? null : (
                                        <div className={`fromGroup ${formDataErr.warehouse ? "has-error" : ""}`}>
                                            <label htmlFor="warehouse" className="form-label">
                                                Warehouse <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                name="warehouse"
                                                value={warehouse}
                                                onChange={handleChange}
                                                disabled={isViewed || currentUser.isWarehouseLevel}
                                                className="form-control py-2 appearance-none relative flex-1"
                                            >
                                                <option value="">None</option>
                                                {activeWarehouse.map((item) => (
                                                    <option value={item._id} key={item._id}>
                                                        {item.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {formDataErr.warehouse && <p className="text-sm text-red-500">{formDataErr.warehouse}</p>}
                                        </div>
                                    )}

                                    {/* Name */}
                                    <div className={`fromGroup ${formDataErr.name ? "has-error" : ""}`}>
                                        <label htmlFor="name" className="form-label">
                                            Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            name="name"
                                            type="text"
                                            placeholder="Enter Holiday Name"
                                            value={name}
                                            onChange={handleChange}
                                            className="form-control py-2"
                                            disabled={isViewed}
                                        />
                                        {formDataErr.name && <p className="text-sm text-red-500">{formDataErr.name}</p>}
                                    </div>

                                    {/* Code */}
                                    <div className={`fromGroup ${formDataErr.code ? "has-error" : ""}`}>
                                        <label htmlFor="code" className="form-label">
                                            Code <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            name="code"
                                            type="text"
                                            placeholder="Enter Holiday Code"
                                            value={code}
                                            onChange={handleChange}
                                            className="form-control py-2"
                                            disabled={isViewed}
                                        />
                                        {formDataErr.code && <p className="text-sm text-red-500">{formDataErr.code}</p>}
                                    </div>

                                    {/* Description */}
                                    <div className={`fromGroup ${formDataErr.description ? "has-error" : ""}`}>
                                        <label htmlFor="description" className="form-label">
                                            Description
                                        </label>
                                        <textarea
                                            name="description"
                                            placeholder="Enter Description"
                                            value={description}
                                            onChange={handleChange}
                                            className="form-control py-2"
                                            disabled={isViewed}
                                        />
                                        {formDataErr.description && <p className="text-sm text-red-500">{formDataErr.description}</p>}
                                    </div>

                                    {/* Start Date */}
                                    <div className={`fromGroup ${formDataErr.startDate ? "has-error" : ""}`}>
                                        <label htmlFor="startDate" className="form-label">
                                            Start Date <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            name="startDate"
                                            type="date"
                                            value={startDate}
                                            onChange={handleChange}
                                            className="form-control py-2"
                                            disabled={isViewed}
                                        />
                                        {formDataErr.startDate && <p className="text-sm text-red-500">{formDataErr.startDate}</p>}
                                    </div>

                                    {/* End Date */}
                                    <div className={`fromGroup ${formDataErr.endDate ? "has-error" : ""}`}>
                                        <label htmlFor="endDate" className="form-label">
                                            End Date <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            name="endDate"
                                            type="date"
                                            value={endDate}
                                            onChange={handleChange}
                                            className="form-control py-2"
                                            disabled={isViewed}
                                        />
                                        {formDataErr.endDate && <p className="text-sm text-red-500">{formDataErr.endDate}</p>}
                                    </div>

                                    {/* Is Half Day */}
                                    <div className={`fromGroup ${formDataErr.isHalfDay ? "has-error" : ""}`}>
                                        <label htmlFor="isHalfDay" className="form-label">
                                            Half Day
                                        </label>
                                        <div
                                            className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer ${isHalfDay ? "bg-lightBtn" : "bg-gray-400"
                                                } ${isHalfDayDisabled() ? "opacity-50 cursor-not-allowed" : ""}`}
                                            onClick={() => {
                                                if (!isHalfDayDisabled() && !isViewed) {
                                                    setFormData((prev) => ({ ...prev, isHalfDay: !isHalfDay }));
                                                }
                                            }}
                                        >
                                            <div
                                                className={`w-4 h-4 bg-white rounded-full shadow-md transform ${isHalfDay ? "translate-x-4" : "translate-x-0"
                                                    }`}
                                            ></div>
                                        </div>
                                        {formDataErr.isHalfDay && <p className="text-sm text-red-500">{formDataErr.isHalfDay}</p>}
                                    </div>
                                </div>

                                {isViewed && (
                                    <div className="lg:col-span-2 col-span-1">
                                        <div className="flex justify-end py-5">
                                            <Button
                                                text="Edit"
                                                className="bg-lightBtn dark:bg-darkBtn p-3 rounded-md text-white text-center btn inline-flex justify-center"
                                                onClick={() => setIsViewed(false)}
                                                isLoading={loading}
                                            />
                                        </div>
                                    </div>
                                )}

                                {!isViewed && (
                                    <div className="lg:col-span-2 col-span-1">
                                        <div className="ltr:text-right rtl:text-left p-5">
                                            <button
                                                disabled={loading}
                                                style={loading ? { opacity: "0.5", cursor: "not-allowed" } : { opacity: "1" }}
                                                className="bg-lightBtn dark:bg-darkBtn p-3 rounded-md text-white text-center btn inline-flex justify-center"
                                            >
                                                {loading ? (
                                                    <>
                                                        <svg
                                                            className="animate-spin ltr:-ml-1 ltr:mr-3 rtl:-mr-1 rtl:ml-3 h-5 w-5"
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
                                                        Loading...
                                                    </>
                                                ) : id ? (
                                                    "Update"
                                                ) : (
                                                    "Save"
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </form>
                        </div>
                    </Card >
                </div >
            )}
        </>
    );
};

export default CreateHoliday;