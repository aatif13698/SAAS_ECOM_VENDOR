import { Card } from "@mui/material";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import useDarkMode from "@/hooks/useDarkMode";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import warehouseService from "@/services/warehouse/warehouse.service";
import FormLoader from "@/Common/formLoader/FormLoader";
import leaveCategoryService from "@/services/leaveCategory/leaveCategory.service";

const CreateLeaveCategory = ({ noFade, scrollContent }) => {
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
        maxLimit: "",
        carryOverLimit: "",
        defaultEntitlement: "",
        requiresApproval: false,
        isLossOfPay: false,
        isEarnedLeave: false,
    });

    const [formDataErr, setFormDataErr] = useState({
        level: "",
        businessUnit: "",
        branch: "",
        warehouse: "",
        name: "",
        code: "",
        description: "",
        maxLimit: "",
        carryOverLimit: "",
        defaultEntitlement: "",
        requiresApproval: "",
        isLossOfPay: "",
        isEarnedLeave: "",
    });

    const {
        level,
        businessUnit,
        branch,
        warehouse,
        name,
        code,
        description,
        maxLimit,
        carryOverLimit,
        defaultEntitlement,
        requiresApproval,
        isLossOfPay,
        isEarnedLeave,
    } = formData;

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
                businessUnit: row?.businessUnit?._id || "",
                branch: row?.branch?._id || "",
                warehouse: row?.warehouse?._id || "",
                name: row.name || "",
                code: row.code || "",
                description: row.description || "",
                maxLimit: row.maxLimit || "",
                carryOverLimit: row.carryOverLimit || "",
                defaultEntitlement: row.defaultEntitlement || "",
                requiresApproval: row.requiresApproval ?? true,
                isLossOfPay: row.isLossOfPay ?? true,
                isEarnedLeave: row.isEarnedLeave ?? true,
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
            maxLimit: [
                [value === "", "Max Limit is required"],
                [isNaN(value) || value < 0, "Max Limit must be a non-negative number"],
            ],
            carryOverLimit: [
                [value === "", "Carry Over Limit is required"],
                [isNaN(value) || value < 0, "Carry Over Limit must be a non-negative number"],
            ],
            defaultEntitlement: [
                [value === "", "Default Entitlement is required"],
                [isNaN(value) || value < 0, "Default Entitlement must be a non-negative number"],
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
            maxLimit: validateField("maxLimit", maxLimit),
            carryOverLimit: validateField("carryOverLimit", carryOverLimit),
            defaultEntitlement: validateField("defaultEntitlement", defaultEntitlement),
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
                maxLimit: Number(formData.maxLimit),
                carryOverLimit: Number(formData.carryOverLimit),
                defaultEntitlement: Number(formData.defaultEntitlement),
            };
            if (id) {
                const response = await leaveCategoryService.update({ ...payload, leaveCategoryId: id });
                toast.success(response?.data?.message || "Leave category updated successfully");
            } else {
                const response = await leaveCategoryService.create(payload);
                console.log("response leave category", response);
                
                toast.success(response?.data?.message || "Leave category created successfully");
            }
            setFormData({
                level: "",
                businessUnit: "",
                branch: "",
                warehouse: "",
                name: "",
                code: "",
                description: "",
                maxLimit: "",
                carryOverLimit: "",
                defaultEntitlement: "",
                requiresApproval: false,
                isLossOfPay: false,
                isEarnedLeave: false,
            });
            setFormDataErr({
                level: "",
                businessUnit: "",
                branch: "",
                warehouse: "",
                name: "",
                code: "",
                description: "",
                maxLimit: "",
                carryOverLimit: "",
                defaultEntitlement: "",
                requiresApproval: "",
                isLossOfPay: "",
                isEarnedLeave: "",
            });
            navigate("/leave-category-list");
        } catch (error) {
            console.error("Error saving leave category:", error);
            toast.error("Failed to save leave category");
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
                                            placeholder="Enter Leave Category Name"
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
                                            placeholder="Enter Leave Code"
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

                                    {/* Max Limit */}
                                    <div className={`fromGroup ${formDataErr.maxLimit ? "has-error" : ""}`}>
                                        <label htmlFor="maxLimit" className="form-label">
                                            Max Limit <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            name="maxLimit"
                                            type="number"
                                            min="0"
                                            placeholder="Enter Maximum Leave Balance"
                                            value={maxLimit}
                                            onChange={handleChange}
                                            className="form-control py-2"
                                            disabled={isViewed}
                                        />
                                        {formDataErr.maxLimit && <p className="text-sm text-red-500">{formDataErr.maxLimit}</p>}
                                    </div>

                                    {/* Carry Over Limit */}
                                    <div className={`fromGroup ${formDataErr.carryOverLimit ? "has-error" : ""}`}>
                                        <label htmlFor="carryOverLimit" className="form-label">
                                            Carry Over Limit <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            name="carryOverLimit"
                                            type="number"
                                            min="0"
                                            placeholder="Enter Carry Over Limit"
                                            value={carryOverLimit}
                                            onChange={handleChange}
                                            className="form-control py-2"
                                            disabled={isViewed}
                                        />
                                        {formDataErr.carryOverLimit && <p className="text-sm text-red-500">{formDataErr.carryOverLimit}</p>}
                                    </div>

                                    {/* Default Entitlement */}
                                    <div className={`fromGroup ${formDataErr.defaultEntitlement ? "has-error" : ""}`}>
                                        <label htmlFor="defaultEntitlement" className="form-label">
                                            Default Entitlement <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            name="defaultEntitlement"
                                            type="number"
                                            min="0"
                                            placeholder="Enter Default Entitlement"
                                            value={defaultEntitlement}
                                            onChange={handleChange}
                                            className="form-control py-2"
                                            disabled={isViewed}
                                        />
                                        {formDataErr.defaultEntitlement && (
                                            <p className="text-sm text-red-500">{formDataErr.defaultEntitlement}</p>
                                        )}
                                    </div>

                                    {/* Requires Approval */}
                                    <label className={`fromGroup   ${formDataErr?.requiresApproval !== "" ? "has-error" : ""
                                        } `}>
                                        <p className={`mb-1 ${isDark ? "text-white" : "text-black"}`}>
                                            Requires Approval
                                        </p>
                                        <div
                                            className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer ${requiresApproval ? "bg-lightBtn" : "bg-gray-400"
                                                }`}
                                            onClick={() => setFormData((prev) => ({ ...prev, requiresApproval: !requiresApproval }))}
                                        >
                                            <div
                                                className={`w-4 h-4 bg-white rounded-full shadow-md transform ${requiresApproval ? "translate-x-4" : "translate-x-0"
                                                    }`}
                                            ></div>
                                        </div>
                                        {<p className="text-red-600  text-xs"> {formDataErr.requiresApproval}</p>}
                                    </label>

                                    {/* Is Loss of Pay */}
                                    <label className={`fromGroup   ${formDataErr?.isLossOfPay !== "" ? "has-error" : ""
                                        } `}>
                                        <p className={`mb-1 ${isDark ? "text-white" : "text-black"}`}>
                                            Loss of Pay
                                        </p>
                                        <div
                                            className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer ${isLossOfPay ? "bg-lightBtn" : "bg-gray-400"
                                                }`}
                                            onClick={() => setFormData((prev) => ({ ...prev, isLossOfPay: !isLossOfPay }))}
                                        >
                                            <div
                                                className={`w-4 h-4 bg-white rounded-full shadow-md transform ${isLossOfPay ? "translate-x-4" : "translate-x-0"
                                                    }`}
                                            ></div>
                                        </div>
                                        {<p className="text-red-600  text-xs"> {formDataErr.isLossOfPay}</p>}
                                    </label>


                                    {/* Is Earned Leave */}
                                    <label className={`fromGroup   ${formDataErr?.isEarnedLeave !== "" ? "has-error" : ""
                                        } `}>
                                        <p className={`mb-1 ${isDark ? "text-white" : "text-black"}`}>
                                            Earned Leave
                                        </p>
                                        <div
                                            className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer ${isEarnedLeave ? "bg-lightBtn" : "bg-gray-400"
                                                }`}
                                            onClick={() => setFormData((prev) => ({ ...prev, isEarnedLeave: !isEarnedLeave }))}
                                        >
                                            <div
                                                className={`w-4 h-4 bg-white rounded-full shadow-md transform ${isEarnedLeave ? "translate-x-4" : "translate-x-0"
                                                    }`}
                                            ></div>
                                        </div>
                                        {<p className="text-red-600  text-xs"> {formDataErr.isEarnedLeave}</p>}
                                    </label>
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
                    </Card>
                </div>
            )}
        </>
    );
};

export default CreateLeaveCategory;