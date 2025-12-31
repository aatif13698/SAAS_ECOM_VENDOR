

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaRegEdit, FaStar, FaRegStar } from "react-icons/fa";
import ledgerGroupService from '@/services/ledgerGroup/ledgerGroup.service';
import { BsTrash } from "react-icons/bs";
import warehouseService from '@/services/warehouse/warehouse.service';

// import purchasePaymentService from '@/services/purchasePaymentConfig.service'; // create this

const PaymentAndLedger = () => {
    const { user: currentUser, isAuth } = useSelector(state => state.auth);
    const { isAuth: isAuthenticated } = useSelector(state => state.auth);

    const [currentLevel, setCurrentLevel] = useState('');
    const [levelId, setLevelId] = useState('');

    const [availableCash, setAvailableCash] = useState([]);
    const [availableBank, setAvailableBank] = useState([]);

    const [cashMethods, setCashMethods] = useState([]);     // [{ledgerId, name, isPrimary, _id?}]
    const [bankMethods, setBankMethods] = useState([]);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);


    const [activeBusinessUnits, setActiveBusinessUnits] = useState([]);
    const [levelResult, setLevelResult] = useState(0)
    const [activeBranches, setActiveBranches] = useState([]);
    const [activeWarehouse, setActiveWarehouse] = useState([]);


    const [formData, setFormData] = useState({
        level: "",
        businessUnit: "",
        branch: "",
        warehouse: "",
    });



    const {
        level,
        businessUnit,
        branch,
        warehouse,
    } = formData;

    const [formDataErr, setFormDataErr] = useState({
        level: "",
        businessUnit: "",
        branch: "",
        warehouse: "",
    });


    const validateField = (name, value) => {
        const rules = {

            level: [[!value, "Level is required"]],
            businessUnit: [[!value && levelResult > 1, "Business Unit is required"]],
            branch: [[!value && levelResult > 2, "Branch is required"]],
            warehouse: [[!value && levelResult > 3, "Warehouse is required"]]
        };
        return (rules[name] || []).find(([condition]) => condition)?.[1] || "";
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


    const [levelList, setLevelList] = useState([
        // {
        //   name: "Vendor",
        //   value: "vendor"
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


    useEffect(() => {
        if (currentUser && isAuthenticated) {
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



    useEffect(() => {
        async function getActiveBusinessUnit() {
            try {
                const response = await warehouseService.getActiveBusinessUnit();
                setActiveBusinessUnits(response?.data?.businessUnits)
            } catch (error) {
                console.log("error while getting the active business unit", error);
            }
        }
        getActiveBusinessUnit();
    }, []);


    useEffect(() => {
        if (businessUnit) {
            getBranchByBusiness(businessUnit);
            if (level === "business") {
                loadData(level, businessUnit);
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
                loadData(level, branch);
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
            loadData(level, warehouse);
        }
    }, [warehouse]);


    // Set level
    useEffect(() => {
        if (!currentUser || !isAuth) return;

        if (currentUser.isVendorLevel) {
            setCurrentLevel('vendor');
        } else if (currentUser.isBuLevel) {
            setCurrentLevel('business');
            setLevelId(currentUser.businessUnit || '');
        } else if (currentUser.isBranchLevel) {
            setCurrentLevel('branch');
            setLevelId(currentUser.branch || '');
        } else if (currentUser.isWarehouseLevel) {
            setCurrentLevel('warehouse');
            setLevelId(currentUser.warehouse || '');
        } else {
            setCurrentLevel('vendor');
        }
    }, [currentUser, isAuth]);

    useEffect(() => {
        if (level) {

            setAvailableCash([]);
            setAvailableBank([]);
            setCashMethods([]);
            setBankMethods([]);



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

    // Load available ledgers + saved configurations
    // useEffect(() => {
    //     if (!currentLevel) return;
    //     loadData(currentLevel, levelId);
    // }, [currentLevel, levelId]);

    const loadData = async (currentLevel, levelId) => {
        setLoading(true);
        try {
            // 1. Available ledgers
            const ledgersRes = await ledgerGroupService.getCashAndBankGroupLedger(currentLevel, levelId);
            setAvailableCash(ledgersRes?.data?.cashLedgers || []);
            setAvailableBank(ledgersRes?.data?.bankLedgers || []);

            // 2. Saved payment configurations (you'll need this endpoint)
            // const configRes = await purchasePaymentService.getConfigs(currentLevel, levelId);
            // setCashMethods(configRes.data.cashLedgers || []);
            // setBankMethods(configRes.data.bankLedgers || []);

            // For now simulate / use your real service
            setCashMethods([]);
            setBankMethods([]);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const addNew = (type) => {
        const setter = type === 'cash' ? setCashMethods : setBankMethods;
        setter(prev => [
            ...prev,
            { ledgerId: '', name: '', isPrimary: prev.length === 0, isEditing: true, isNew: true }
        ]);
    };

    const updateLedger = (type, index, ledgerId) => {
        const available = type === 'cash' ? availableCash : availableBank;
        const selected = available.find(l => l._id === ledgerId);

        const setter = type === 'cash' ? setCashMethods : setBankMethods;

        setter(prev => {
            const next = [...prev];
            next[index] = {
                ...next[index],
                ledgerId,
                name: selected?.ledgerName || '',
            };
            return next;
        });
    };

    const togglePrimary = (type, index) => {
        const setter = type === 'cash' ? setCashMethods : setBankMethods;
        setter(prev => {
            const next = [...prev];
            // Set all to false
            next.forEach(item => { item.isPrimary = false; });
            // Set clicked one to true
            next[index].isPrimary = true;
            return next;
        });
    };

    const toggleEdit = (type, index, shouldEdit = true) => {
        const setter = type === 'cash' ? setCashMethods : setBankMethods;
        setter(prev => {
            const next = [...prev];
            next[index].isEditing = shouldEdit;
            return next;
        });
    };

    const remove = (type, index) => {
        if (!window.confirm('Remove this payment method?')) return;

        const setter = type === 'cash' ? setCashMethods : setBankMethods;
        setter(prev => {
            const next = prev.filter((_, i) => i !== index);
            // If removed primary → make first remaining primary
            if (next.length > 0 && !next.some(item => item.isPrimary)) {
                next[0].isPrimary = true;
            }
            return next;
        });
    };

    const saveAll = async () => {
        setSaving(true);
        try {
            // You should call two separate requests or one bulk
            // Here we show separate for clarity

            if (cashMethods.length > 0) {
                await purchasePaymentService.upsert({
                    level: currentLevel,
                    levelId,
                    type: 'cash',
                    ledgers: cashMethods.map(m => ({
                        id: m.ledgerId,
                        isPrimary: m.isPrimary
                    }))
                });
            }

            if (bankMethods.length > 0) {
                await purchasePaymentService.upsert({
                    level: currentLevel,
                    levelId,
                    type: 'bank',
                    ledgers: bankMethods.map(m => ({
                        id: m.ledgerId,
                        isPrimary: m.isPrimary
                    }))
                });
            }

            alert('Changes saved successfully!');
            // Optionally reload data
        } catch (err) {
            console.error(err);
            alert('Failed to save changes');
        } finally {
            setSaving(false);
        }
    };

    const renderSection = (title, type, methods, available) => (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                <button
                    onClick={() => addNew(type)}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors flex items-center gap-2"
                    type="button"
                >
                    + Add {type === 'cash' ? 'Cash' : 'Bank'}
                </button>
            </div>

            {methods.length === 0 && (
                <div className="text-center py-10 text-gray-500 italic">
                    No {type} payment methods configured yet
                </div>
            )}

            <div className="space-y-3">
                {methods.map((method, index) => (
                    <div
                        key={method._id || method.ledgerId || index}
                        className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                        <select
                            value={method.ledgerId}
                            onChange={e => updateLedger(type, index, e.target.value)}
                            disabled={!method.isEditing}
                            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-100"
                        >
                            <option value="">Select {type === 'cash' ? 'Cash' : 'Bank'} Ledger</option>
                            {available.map(ledger => (
                                <option key={ledger._id} value={ledger._id}>
                                    {ledger.ledgerName}
                                </option>
                            ))}
                        </select>

                        <button
                            type="button"
                            onClick={() => togglePrimary(type, index)}
                            className="p-2 text-yellow-500 hover:text-yellow-600 transition-colors"
                            title={method.isPrimary ? "Primary" : "Set as primary"}
                        >
                            {method.isPrimary ? <FaStar size={20} /> : <FaRegStar size={20} />}
                        </button>

                        <div className="flex items-center gap-2">
                            {method.isEditing ? (
                                <button
                                    onClick={() => toggleEdit(type, index, false)}
                                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-sm"
                                >
                                    Done
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={() => toggleEdit(type, index, true)}
                                        className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
                                    >
                                        <FaRegEdit />
                                    </button>
                                    <button
                                        onClick={() => remove(type, index)}
                                        className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                                    >
                                        <BsTrash />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="mx-auto py-8 px-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Payment Methods Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 mb-4 gap-5 bg-gray-200 px-4 py-4 rounded-lg">
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
                                disabled={currentUser.isBuLevel || currentUser.isBranchLevel || currentUser.isWarehouseLevel}
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
                                disabled={currentUser.isBranchLevel || currentUser.isWarehouseLevel}
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
                                disabled={currentUser.isWarehouseLevel}
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
            </div>

            {loading ? (
                <div className="text-center   py-12 text-gray-600">Loading...</div>
            ) : (
                <div className="space-y-10  ">

                    <div className='grid grid-cols-1 md:grid-cols-2 mb-4 gap-5 bg-gray-100 px-4 py-4 rounded-lg'>
                        {renderSection('Cash Payment Methods', 'cash', cashMethods, availableCash)}
                        {renderSection('Bank Payment Methods', 'bank', bankMethods, availableBank)}


                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={saveAll}
                            disabled={saving || (cashMethods.length === 0 && bankMethods.length === 0)}
                            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save All Changes'}
                        </button>
                    </div>

                </div>
            )}
        </div>
    );
};

export default PaymentAndLedger;