import { Card } from "@mui/material";
import React, { useState, Fragment, useEffect } from "react";
import useDarkMode from "@/hooks/useDarkMode";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import "../../assets/scss/common.scss"

import { useSelector } from "react-redux";
import FormLoader from "@/Common/formLoader/FormLoader";
import warehouseService from "@/services/warehouse/warehouse.service";
import productBlueprintService from "@/services/productBlueprint/productBlueprint.service";
import stockService from "@/services/stock/stock.service";
import { FaRegTrashAlt } from "react-icons/fa";

const AddProductQA = () => {

    const [isDark] = useDarkMode();
    const dispatch = useDispatch();
    const location = useLocation();
    const row = location?.state?.row;
    const id = location?.state?.id;

    const { user: currentUser, isAuth: isAuthenticated } = useSelector((state) => state.auth);

    const [pageLoading, setPageLoading] = useState(true);

    const [activeBusinessUnits, setActiveBusinessUnits] = useState([])
    const [activeBranches, setActiveBranches] = useState([]);
    const [activeWarehouses, setActiveWarehouses] = useState([]);
    const [activeProductBlueprint, setActiveProductBlueprint] = useState([])

    const [isEditing, setIsEditing] = useState(false);

    const [normalStocks, setNormalStocks] = useState([]);

    console.log("normalStocks", normalStocks);
    console.log("activeProductBlueprint", activeProductBlueprint);
    

    const [formData, setFormData] = useState({
        product: "",
        variant: "",
        businessUnit: "",
        branch: "",
        warehouse: "",

        productMainStockId: "",
        questionAndAnswer: [
            { question: "", answer: "" }
        ]
    });

    const [formDataErr, setFormDataErr] = useState({
        product: "",
        businessUnit: "",
        branch: "",
        warehouse: "",
        productMainStockId: "",
    });

    const {
        product,
        businessUnit,
        branch,
        warehouse,
        productMainStockId,
    } = formData;

    const [isViewed, setIsViewed] = useState(false);
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target;
        const requiredFields = [
            "businessUnit",
            "branch",
            "warehouse",
            "product",
            "name",
            "description",
            "totalStock",
            "onlineStock",
            "offlineStock",
            "lowStockThreshold",
            "restockQuantity",
            "productMainStockId"
        ];

        // Validation for required fields
        if (requiredFields.includes(name)) {
            setFormDataErr(prev => ({
                ...prev,
                [name]: value === "" ? `${formatLabel(name)} is Required.` : ""
            }));
        }

        // Handle special logic for businessUnit
        if (name === "businessUnit") {
            if (value === "") {
                setFormDataErr(prev => ({
                    ...prev,
                    businessUnit: "Business Unit is Required"
                }));
            } else {
                setActiveBranches([]);
                setFormData(prev => ({
                    ...prev,
                    branchId: ""
                }));
            }
        }

        if (name === "variant") {
            if (value === "") {
                setFormDataErr(prev => ({
                    ...prev,
                    variant: "Variant is Required"
                }));
            } else {
                setFormDataErr(prev => ({
                    ...prev,
                    variant: ""
                }));
            }
        }

        // Update form data
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Helper function to format camelCase to Title Case for labels
    const formatLabel = (fieldName) => {
        return fieldName
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase());
    };

    const handleQAChange = (index, field, value) => {
        const newQA = [...formData.questionAndAnswer];
        newQA[index][field] = value;
        setFormData({ ...formData, questionAndAnswer: newQA });
    };

    const handleDeleteQA = async (index) => {
        const qa = formData.questionAndAnswer[index];
        if (qa._id) {
            try {
                await stockService.deleteQuestionAndAnswer(qa._id);
            } catch (error) {
                console.log("error while deleting QA", error);
                return;
            }
        }
        const newQA = [...formData.questionAndAnswer];
        newQA.splice(index, 1);
        setFormData({
            ...formData,
            questionAndAnswer: newQA.length === 0 ? [{ question: "", answer: "" }] : newQA
        });
    };

    const onSubmit = async () => {
        if (!productMainStockId) {
            setFormDataErr(prev => ({ ...prev, productMainStockId: "Item is Required" }));
            return;
        }

        // Additional validation can be added here for QA pairs if needed

        setLoading(true);
        const newQAList = [...formData.questionAndAnswer];
        for (let i = 0; i < newQAList.length; i++) {
            const qa = newQAList[i];
            if (!qa.question.trim() || !qa.answer.trim()) {
                continue; // Skip empty QA pairs
            }
            try {
                if (qa._id) {
                    await stockService.updateQuestionAndAnswer(qa._id, {
                        question: qa.question,
                        answer: qa.answer
                    });
                } else {
                    const response = await stockService.addQuestionAndAnswer(productMainStockId, {
                        question: qa.question,
                        answer: qa.answer
                    });
                    newQAList[i] = response.data; // Assume response.data contains the created QA with _id
                }
            } catch (error) {
                console.log("error while saving QA", error);
                // Optionally handle errors per QA, e.g., toast notification
            }
        }
        setFormData({ ...formData, questionAndAnswer: newQAList });

        if (!isEditing) {
            setFormData(prev => ({
                ...prev,
                questionAndAnswer: [...newQAList, { question: "", answer: "" }]
            }));
        }

        setLoading(false);
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

    const [baseAddress, setBaseAddress] = useState(null);

    useEffect(() => {
        if (baseAddress) {
            setFormData((prev) => ({
                ...prev,
                product: baseAddress?.product || "",
                businessUnit: baseAddress?.businessUnit || "",
                branch: baseAddress?.branch || "",
                warehouse: baseAddress?.warehouse || "",
                totalStock: baseAddress?.totalStock || "",
                onlineStock: baseAddress?.onlineStock || "",
                offlineStock: baseAddress?.offlineStock || "",
                lowStockThreshold: baseAddress?.lowStockThreshold || "",
                restockQuantity: baseAddress?.restockQuantity || "",
                productMainStockId: baseAddress?._id || "",
                questionAndAnswer: baseAddress?.questionAndAnswer?.length > 0 
                    ? baseAddress.questionAndAnswer 
                    : [{ question: "", answer: "" }]
            }));
            setNormalStocks(baseAddress?.normalSaleStock || []);
        }
    }, [baseAddress]);

    useEffect(() => {
        if (id) {
            async function getBranch() {
                try {
                    setPageLoading(true)
                    const response = await stockService.getParticularStocks(id);
                    console.log('Response stock data', response?.data);
                    const baseAddress = response?.data;
                    setBaseAddress(response?.data)
                    setPageLoading(false)
                } catch (error) {
                    setPageLoading(false)
                    console.log("error in fetching stock data");
                }
            }
            getBranch();
            setIsViewed(true);
            setIsEditing(true); // Enable edit mode if id is present
        } else {
            setPageLoading(false);
            setIsViewed(false);
        }
    }, [id]);

    useEffect(() => {
        async function getActiveBusinessUnit() {
            try {
                const response = await warehouseService.getActiveBusinessUnit();
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
            console.log("response blue", response);
            
            setActiveProductBlueprint(response.data.roductBluePrints) // Fixed typo: roductBluePrints -> productBluePrints
        } catch (error) {
            console.log("error in getting active", error);
        }
    }

    useEffect(() => {
        if (product) {
            getStockByProduct(product)
        }
    }, [product]);

    async function getStockByProduct(product) {
        try {
            const response = await stockService.getStockByProduct(product);
            setNormalStocks(response?.data[0]?.normalSaleStock)
        } catch (error) {
            console.log("error while getting the stock by product", error);
        }
    }

    useEffect(() => {
        if (currentUser && isAuthenticated) {
            if (currentUser.isVendorLevel) {

            } else if (currentUser.isBuLevel) {
                setFormData((prev) => ({ ...prev, businessUnit: currentUser.businessUnit }))
            } else if (currentUser.isBranchLevel) {
                setFormData((prev) => ({ ...prev, businessUnit: currentUser.businessUnit, branch: currentUser.branch }))
            } else if (currentUser.isWarehouseLevel) {
                setFormData((prev) => ({ ...prev, businessUnit: currentUser.businessUnit, branch: currentUser.branch, warehouse: currentUser.warehouse }))
            }
        }
    }, [currentUser])

    const disableItemSelect = formData.questionAndAnswer.some(qa => !!qa._id);

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
                                        <div
                                            className={`fromGroup   ${formDataErr?.productMainStockId !== "" ? "has-error" : ""
                                                } `}
                                        >
                                            <label htmlFor=" hh" className="form-label ">
                                                <p className="form-label">
                                                    Items <span className="text-red-500">*</span>
                                                </p>
                                            </label>
                                            <select
                                                name="productMainStockId"
                                                value={productMainStockId}
                                                onChange={handleChange}
                                                disabled={disableItemSelect || isViewed}
                                                className="form-control py-2  appearance-none relative flex-1"
                                            >
                                                <option value="">None</option>

                                                {normalStocks &&
                                                    normalStocks?.map((item) => (
                                                        <option value={item?._id} key={item?._id}>{item?.name}</option>
                                                    ))}
                                            </select>
                                            {<p className="text-sm text-red-500">{formDataErr.productMainStockId}</p>}
                                        </div>
                                    </div>

                                    <div className="mt-5">
                                        <h4 className="text-lg font-bold">Questions and Answers</h4>
                                        <div className="space-y-4 mt-3">
                                            {formData.questionAndAnswer.map((qa, index) => (
                                                <div
                                                    key={index}
                                                    className={`p-4 relative border rounded ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
                                                >
                                                    <div className="fromGroup">
                                                        <label className="form-label">Question</label>
                                                        <input
                                                            className="form-control py-2"
                                                            value={qa.question}
                                                            onChange={(e) => handleQAChange(index, 'question', e.target.value)}
                                                            placeholder="Enter question"
                                                        />
                                                    </div>
                                                    <div className="fromGroup mt-2">
                                                        <label className="form-label">Answer</label>
                                                        <textarea
                                                            className="form-control py-2"
                                                            rows={3}
                                                            value={qa.answer}
                                                            onChange={(e) => handleQAChange(index, 'answer', e.target.value)}
                                                            placeholder="Enter answer"
                                                        />
                                                    </div>
                                                    { (
                                                        <button
                                                            onClick={() => handleDeleteQA(index)}
                                                            className="bg-red-500 absolute top-0 right-4 text-white p-2 rounded mt-2"
                                                        >
                                                            <FaRegTrashAlt/>
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="lg:col-span-2 col-span-1">
                                        <div className="ltr:text-right rtl:text-left p-5">
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
                                                    : isEditing
                                                        ? "Update"
                                                        : "Save & add more"}
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
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
            }
        </>

    );
};

export default AddProductQA;