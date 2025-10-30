



import React, { useEffect, useState, useCallback, Fragment } from "react";
import { Card } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { FaRegTrashAlt } from "react-icons/fa";
import { Dialog, Transition } from "@headlessui/react";

import useDarkMode from "@/hooks/useDarkMode";
import FormLoader from "@/Common/formLoader/FormLoader";

import warehouseService from "@/services/warehouse/warehouse.service";
import productBlueprintService from "@/services/productBlueprint/productBlueprint.service";
import stockService from "@/services/stock/stock.service";
import productQaService from "@/services/productQa/productQa.service";

import "../../assets/scss/common.scss";
import toast from "react-hot-toast";

const ProductQaOut = ({ noFade, scrollContent }) => {

    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const handleCloseLoadingModal = () => {
        setShowLoadingModal(false);
    };

    const [canOpenNewForm, setCanOpeNewForm] = useState(false);

    const [isDark] = useDarkMode();
    const dispatch = useDispatch();
    const location = useLocation();
    const { user: currentUser, isAuth: isAuthenticated } = useSelector(
        (state) => state.auth
    );

    const [pageLoading, setPageLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [qaLoading, setQaLoading] = useState(false);

    // Dropdown Data
    const [activeBusinessUnits, setActiveBusinessUnits] = useState([]);
    const [activeBranches, setActiveBranches] = useState([]);
    const [activeWarehouses, setActiveWarehouses] = useState([]);
    const [activeProductBlueprints, setActiveProductBlueprints] = useState([]);
    const [normalStocks, setNormalStocks] = useState([]);

    // Form State
    const [formData, setFormData] = useState({
        product: "",
        productStock: "",
        businessUnit: "",
        branch: "",
        warehouse: "",
        productMainStockId: "",
    });

    const [formErrors, setFormErrors] = useState({
        product: "",
        businessUnit: "",
        branch: "",
        warehouse: "",
        productMainStockId: "",
    });

    // Q&A List
    const [qaList, setQaList] = useState([]);

    console.log("qaList", qaList);


    // Helper: Format label
    const formatLabel = (field) => {
        return field
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase());
    };

    // Validation
    const validateForm = useCallback(() => {
        const required = [
            "productMainStockId",
            "businessUnit",
            "branch",
            "warehouse",
            "product",
        ];
        let hasError = false;
        const newErrors = {};

        required.forEach((field) => {
            if (!formData[field]) {
                newErrors[field] = `${formatLabel(field)} is Required.`;
                hasError = true;
            }
        });

        setFormErrors((prev) => ({ ...prev, ...newErrors }));
        return hasError;
    }, [formData]);

    // Handle Select Change
    const handleSelectChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setFormErrors((prev) => ({ ...prev, [name]: "" }));
    };

    // Handle Q&A Input Change
    const handleQAChange = (index, field, value) => {
        setQaList((prev) => {
            const updated = [...prev];
            updated[index][field] = value;
            return updated;
        });
    };

    // Delete Q&A
    const publish = async (index) => {
        const qa = qaList[index];
        if (qa._id) {
            try {
                setShowLoadingModal(true);
                await productQaService.publishQaOut(qa._id);
                setShowLoadingModal(false);

                fetchQA()

            } catch (error) {
                console.error("Publish failed:", error);
                setShowLoadingModal(false);
                alert("Failed to publish Q&A");
                return;
            }
        }
        setQaList((prev) => prev.filter((_, i) => i !== index));
    };

    // Save or Update Q&A
    const saveOrUpdateQA = async (index) => {
        if (validateForm()) return;
        const qa = qaList[index];


        if (!qa?.question.trim() || !qa?.answer.trim()) {
            alert("Both Question and Answer are required.");
            return;
        }

        setLoading(true);
        setShowLoadingModal(true);
        try {
            const clientId = localStorage.getItem("saas_client_clientId");
            const payload = {
                clientId,
                businessUnit: formData.businessUnit,
                branch: formData.branch,
                warehouse: formData.warehouse,
                product: formData.product,
                productStock: formData.productStock,
                productMainStockId: formData.productMainStockId,
                question: qa.question,
                answer: qa.answer,
            };
            let saved;
            if (qa._id) {
                saved = await productQaService.updateQaOut({ ...payload, qaId: qa._id, });
                toast.success("updated successfully.");
            } else {
                saved = await productQaService.create(payload);
                toast.success("Saved successfully.");

            }
            const newId = saved?._id || saved?.data?.workingDepartmentId || saved?.id;
            fetchQA()

        } catch (error) {
            console.error("Save/Update failed:", error);
            alert("Failed to save Q&A. Please try again.");
        } finally {
            setLoading(false);
            setShowLoadingModal(false);
            setCanOpeNewForm(true);

        }
    };

    // Load Business Units
    useEffect(() => {
        const fetchBusinessUnits = async () => {
            try {
                const res = await warehouseService.getActiveBusinessUnit();
                setActiveBusinessUnits(res?.data?.businessUnits || []);
            } catch (error) {
                console.error("Failed to load business units", error);
            }
        };
        fetchBusinessUnits();
    }, []);

    // Load Branches
    useEffect(() => {
        if (!formData.businessUnit) {
            setActiveBranches([]);
            return;
        }
        const fetchBranches = async () => {
            try {
                const res = await warehouseService.getBranchByBusiness(formData.businessUnit);
                setActiveBranches(res?.data || []);
            } catch (error) {
                console.error("Failed to load branches", error);
            }
        };
        fetchBranches();
    }, [formData.businessUnit]);

    // Load Warehouses
    useEffect(() => {
        if (!formData.branch) {
            setActiveWarehouses([]);
            return;
        }
        const fetchWarehouses = async () => {
            try {
                const res = await warehouseService.getWarehouseByBranch(formData.branch);
                setActiveWarehouses(res?.data || []);
            } catch (error) {
                console.error("Failed to load warehouses", error);
            }
        };
        fetchWarehouses();
    }, [formData.branch]);

    // Load Product Blueprints
    useEffect(() => {
        const fetchBlueprints = async () => {
            try {
                const res = await productBlueprintService.getActive();
                setActiveProductBlueprints(res?.data?.roductBluePrints || []);
            } catch (error) {
                console.error("Failed to load product blueprints", error);
            }
        };
        fetchBlueprints();
    }, []);

    // Load Normal Stocks
    useEffect(() => {
        if (!formData.product) {
            setNormalStocks([]);
            return;
        }
        const fetchStocks = async () => {
            try {
                const res = await stockService.getStockByProduct(formData.product);
                const stockList = res?.data?.[0]?.normalSaleStock || [];
                setNormalStocks(stockList);
                if (stockList.length > 0) {
                    setFormData((prev) => ({
                        ...prev,
                        productStock: res?.data?.[0]?._id || "",
                    }));
                }
            } catch (error) {
                console.error("Failed to load stocks", error);
            }
        };
        fetchStocks();
    }, [formData.product]);

    // Load Existing Q&A
    useEffect(() => {
        if (!formData.productMainStockId) {
            setQaList([]);
            return;
        }

        fetchQA();
    }, [formData.productMainStockId]);

    const fetchQA = async () => {
        try {
            setQaLoading(true)
            const res = await productQaService.getQaOutByProductMainStockId(
                formData.productMainStockId
            );
            const data = res?.data || [];
            setQaList(data.length > 0 ? data : []);
            setQaLoading(false)
        } catch (error) {
            setQaLoading(false)
            console.error("Failed to load Q&A", error);
            setQaList([]);
        }
    };

    // Auto-fill based on user level
    useEffect(() => {
        if (!currentUser || !isAuthenticated) return;

        if (currentUser.isBuLevel) {
            setFormData((prev) => ({ ...prev, businessUnit: currentUser.businessUnit }));
        } else if (currentUser.isBranchLevel) {
            setFormData((prev) => ({
                ...prev,
                businessUnit: currentUser

                    .businessUnit,
                branch: currentUser.branch,
            }));
        } else if (currentUser.isWarehouseLevel) {
            setFormData((prev) => ({
                ...prev,
                businessUnit: currentUser.businessUnit,
                branch: currentUser.branch,
                warehouse: currentUser.warehouse,
            }));
        }
    }, [currentUser, isAuthenticated]);

    // Page ready
    useEffect(() => {
        setPageLoading(false);
    }, []);

    useEffect(() => {

        if (qaList?.length > 0) {
            let count = 0;
            for (let index = 0; index < qaList.length; index++) {
                const element = qaList[index];
                if (element._id == "") {
                    count++
                }
            }

            if (count > 0) {
                setCanOpeNewForm(false)

            } else {
                setCanOpeNewForm(true)
            }
        }

    }, [qaList])

    if (pageLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <FormLoader />
            </div>
        );
    }

    return (
        <div className="p-4">
            <Card className={`${isDark ? "bg-darkSecondary text-white" : ""}`}>
                <div className="p-5">
                    {/* Dropdowns */}
                    <div className="grid lg:grid-cols-3 gap-4 mb-6">
                        {/* Business Unit */}
                        <div className={`formGroup ${formErrors.businessUnit ? "has-error" : ""}`}>
                            <label className="form-label">
                                Business Unit <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="businessUnit"
                                value={formData.businessUnit}
                                onChange={handleSelectChange}
                                disabled={
                                    currentUser?.isBuLevel ||
                                    currentUser?.isBranchLevel ||
                                    currentUser?.isWarehouseLevel
                                }
                                className="form-control py-2"
                            >
                                <option value="">None</option>
                                {activeBusinessUnits.map((bu) => (
                                    <option key={bu._id} value={bu._id}>
                                        {bu.name}
                                    </option>
                                ))}
                            </select>
                            <p className="text-sm text-red-500">{formErrors.businessUnit}</p>
                        </div>

                        {/* Branch */}
                        <div className={`formGroup ${formErrors.branch ? "has-error" : ""}`}>
                            <label className="form-label">
                                Branch <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="branch"
                                value={formData.branch}
                                onChange={handleSelectChange}
                                disabled={currentUser?.isBranchLevel || currentUser?.isWarehouseLevel}
                                className="form-control py-2"
                            >
                                <option value="">None</option>
                                {activeBranches.map((b) => (
                                    <option key={b._id} value={b._id}>
                                        {b.name}
                                    </option>
                                ))}
                            </select>
                            <p className="text-sm text-red-500">{formErrors.branch}</p>
                        </div>

                        {/* Warehouse */}
                        <div className={`formGroup ${formErrors.warehouse ? "has-error" : ""}`}>
                            <label className="form-label">
                                Warehouse <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="warehouse"
                                value={formData.warehouse}
                                onChange={handleSelectChange}
                                disabled={currentUser?.isWarehouseLevel}
                                className="form-control py-2"
                            >
                                <option value="">None</option>
                                {activeWarehouses.map((w) => (
                                    <option key={w._id} value={w._id}>
                                        {w.name}
                                    </option>
                                ))}
                            </select>
                            <p className="text-sm text-red-500">{formErrors.warehouse}</p>
                        </div>

                        {/* Product */}
                        <div className={`formGroup ${formErrors.product ? "has-error" : ""}`}>
                            <label className="form-label">
                                Product <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="product"
                                value={formData.product}
                                onChange={handleSelectChange}
                                className="form-control py-2"
                            >
                                <option value="">None</option>
                                {activeProductBlueprints.map((p) => (
                                    <option key={p._id} value={p._id}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>
                            <p className="text-sm text-red-500">{formErrors.product}</p>
                        </div>

                        {/* Item */}
                        <div className={`formGroup ${formErrors.productMainStockId ? "has-error" : ""}`}>
                            <label className="form-label">
                                Item <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="productMainStockId"
                                value={formData.productMainStockId}
                                onChange={handleSelectChange}
                                className="form-control py-2"
                            >
                                <option value="">None</option>
                                {normalStocks.map((s) => (
                                    <option key={s._id} value={s._id}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                            <p className="text-sm text-red-500">{formErrors.productMainStockId}</p>
                        </div>
                    </div>

                    {/* Q&A Section */}

                    {
                        formData?.productMainStockId && <div className="mt-8">
                            <h4 className="text-lg font-bold mb-4">Questions & Answers</h4>

                            {
                                qaLoading ?
                                    <div className="flex flex-col justify-center mt-5 items-center gap-2">
                                        <FormLoader />
                                    </div>
                                    :
                                    <>
                                        {qaList?.length > 0 ?
                                            qaList.map((qa, index) => (
                                                <div
                                                    key={qa._id || index}
                                                    className={`p-4 relative mb-4 border rounded  ${isDark ? "border-gray-700" : "border-gray-200"
                                                        }`}
                                                >
                                                    <div className="mb-3">
                                                        <label className="form-label">Question</label>
                                                        <input
                                                            className="form-control py-2 w-full"
                                                            placeholder="Enter question"
                                                            value={qa.question}
                                                            onChange={(e) => handleQAChange(index, "question", e.target.value)}
                                                        />
                                                    </div>

                                                    <div className="mb-3">
                                                        <label className="form-label">Answer</label>
                                                        <textarea
                                                            className="form-control py-2 w-full"
                                                            rows={3}
                                                            placeholder="Enter answer"
                                                            value={qa.answer}
                                                            onChange={(e) => handleQAChange(index, "answer", e.target.value)}
                                                        />
                                                    </div>

                                                    {
                                                        qa?.hasAnswered &&

                                                        <div className="flex gap-2 items-center top-2 right-4 absolute" >
                                                            <p>{qa.isVerified ? "Unpublish" : "Publish"}</p>
                                                            <div
                                                                className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer ${qa.isVerified ? "bg-lightBtn" : "bg-gray-400"
                                                                    }`}
                                                                onClick={() => publish(index)}

                                                            >
                                                                <div
                                                                    className={`w-4 h-4 bg-white rounded-full shadow-md transform ${qa.isVerified ? "translate-x-4" : "translate-x-0"
                                                                        }`}
                                                                    onClick={() => publish(index)}

                                                                ></div>
                                                            </div>
                                                        </div>

                                                    }



                                                    <div className="flex gap-2 justify-end">
                                                        <button
                                                            onClick={() => saveOrUpdateQA(index)}
                                                            disabled={loading}
                                                            className={`px-4 py-2 rounded text-white transition ${qa._id
                                                                ? "bg-blue-600 hover:bg-blue-700"
                                                                : "bg-green-600 hover:bg-green-700"
                                                                }`}
                                                        >
                                                            {qa._id ? "Update" : "Save"}
                                                        </button>
                                                    </div>
                                                </div>
                                            )) :

                                            <div className="flex justify-center bg-gray-300 p-4">
                                                <span>No Question Found</span>
                                            </div>
                                        }

                                    </>
                            }


                        </div>
                    }

                </div>
            </Card>


            <Transition appear show={showLoadingModal} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-[99999]"
                    onClose={handleCloseLoadingModal}
                >
                    {(
                        <Transition.Child
                            as={Fragment}
                            enter={noFade ? "" : "duration-300 ease-out"}
                            enterFrom={noFade ? "" : "opacity-0"}
                            enterTo={noFade ? "" : "opacity-100"}
                            leave={noFade ? "" : "duration-200 ease-in"}
                            leaveFrom={noFade ? "" : "opacity-100"}
                            leaveTo={noFade ? "" : "opacity-0"}
                        >
                            <div className="fixed inset-0 bg-slate-900/50 backdrop-filter backdrop-blur-sm" />
                        </Transition.Child>
                    )}

                    <div className="fixed inset-0 overflow-y-auto">
                        <div
                            className={`flex min-h-full justify-center text-center p-6 items-center "
                                    }`}
                        >
                            <Transition.Child
                                as={Fragment}
                                enter={noFade ? "" : "duration-300  ease-out"}
                                enterFrom={noFade ? "" : "opacity-0 scale-95"}
                                enterTo={noFade ? "" : "opacity-100 scale-100"}
                                leave={noFade ? "" : "duration-200 ease-in"}
                                leaveFrom={noFade ? "" : "opacity-100 scale-100"}
                                leaveTo={noFade ? "" : "opacity-0 scale-95"}
                            >
                                <Dialog.Panel
                                    className={`w-full transform overflow-hidden rounded-md
                                       bg-white dark:bg-darkSecondary text-left align-middle shadow-xl transition-alll max-w-[17rem] py-10 `}
                                >
                                    <div className="flex flex-col justify-center mt-5 items-center gap-2">
                                        <FormLoader />
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default ProductQaOut;