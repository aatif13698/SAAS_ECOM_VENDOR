import useDarkmode from '@/hooks/useDarkMode';
import ledgerService from '@/services/ledger/ledger.service';
import ledgerGroupService from '@/services/ledgerGroup/ledgerGroup.service';
import voucherService from '@/services/voucher/voucher.service';
import voucherGroupService from '@/services/voucherGroup/voucherGroup.service';
import warehouseService from '@/services/warehouse/warehouse.service';
import React, { useState, useEffect } from 'react';
import { Item } from 'react-contexify';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from 'react';
import Icon from "@/components/ui/Icon";
import { MdOutlineSettings } from "react-icons/md";

function CreateVoucher({ noFade, scrollContent }) {
    const navigate = useNavigate();
    const [isDark] = useDarkmode();

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
    ])

    const location = useLocation();
    const row = location?.state?.row;
    const name = location?.state?.name;
    const id = location?.state?.id;

    const [showModal, setShowModal] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [activeBusinessUnits, setActiveBusinessUnits] = useState([]);
    const [financialYears, setFinancialYear] = useState([]);
    const [currencies, setCurrencies] = useState([]);
    const [levelResult, setLevelResult] = useState(0)
    const [activeBranches, setActiveBranches] = useState([]);
    const [activeWarehouse, setActiveWarehouse] = useState([]);
    const [currentLevel, setCurrentLevel] = useState("");
    const [levelId, setLevelId] = useState("");
    const [totals, setTotals] = useState({ debit: 0, credit: 0 });
    const [selectedFinancialYear, setSelectedFinancialYear] = useState(null);
    const [selectedCurrency, setSelectedCurrency] = useState(null);


    const [formData, setFormData] = useState({
        level: "",
        businessUnit: "",
        branch: "",
        warehouse: "",

        voucherGroup: '',
        entries: [
            { ledger: '', credit: '', debit: '', type: 'credit' }, // First row: Credit
            { ledger: '', credit: '', debit: '', type: 'debit' },  // Second row: Debit
        ],
        narration: '',
        financialYear: '',
        currency: ''
    });

    console.log("formData", formData);

    const [formDataErr, setFormDataErr] = useState({
        level: "",
        businessUnit: "",
        branch: "",
        warehouse: "",
        voucherGroup: "",
        narration: "",
        financialYear: "",
        currency: ""
    });


    const {
        level,
        businessUnit,
        branch,
        warehouse,

    } = formData;

    const [isViewed, setIsViewed] = useState(false);
    const [loading, setLoading] = useState(false);

    const closeModal = () => {
        setShowModal(false);
    };


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

        } else {

        }

    }, [currentUser]);




    const validateField = (name, value) => {
        const rules = {
            voucherGroup: [
                [!value, "Gruop is Required"],
            ],
            narration: [
                [!value, "Narration is Required"],
            ],
            financialYear: [
                [!value, "Financial year is Required"],
            ],
            level: [[!value, "Level is required."]],
            businessUnit: [[!value && levelResult > 1, "Business Unit is required"]],
            branch: [[!value && levelResult > 2, "Branch is required"]],
            warehouse: [[!value && levelResult > 3, "Warehouse is required"]]
        };
        return (rules[name] || []).find(([condition]) => condition)?.[1] || "";
    };


    const validationFunction = () => {
        const { level, businessUnit, branch, warehouse } = formData;
        let errors = {
            voucherGroup: validateField("voucherGroup", formData.voucherGroup),
            narration: validateField("narration", formData.narration),
        };
        if (formData.entries.some(entry => !entry.ledger)) {
            alert('Please select a ledger for all entries.');
        }
        if (formData.entries.map((entry, index) => {
            if (index == 0 && !entry.credit) {
                alert('Please fill credit.');
            } else if (index == 1 && !entry.debit) {
                alert('Please fill debit.');
            }
        }))
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

        setFormDataErr((prev) => ({
            ...prev,
            ...errors
        }));
        return Object.values(errors).some((error) => error);
    };




    const handleChange = (e, index) => {
        const { name, value } = e.target;
        if (index || index == 0 && name !== "credit" && name !== "debit") {
            const existInEntries = formData?.entries?.find((item) => {
                if (item?.ledger == value) {

                    return item

                }
            });
            if (existInEntries) {
                toast.error("same ledger can not be repeated")
            } else {
                setFormData(prev => ({
                    ...prev,
                    entries: prev.entries.map((entry, i) =>
                        i === index ? { ...entry, [name]: value } : entry
                    ),
                }));
            }
        } else if (index || index == 0 || index == 1 && (name == "credit" || name == "debit")) {
            setFormData(prev => ({
                ...prev,
                entries: prev.entries.map((entry, i) => {
                    if (i == 0) {
                        return { ...entry, ["credit"]: value, ["debit"]: "" }
                    } else if (i == 1) {
                        return { ...entry, ["credit"]: "", ["debit"]: value }

                    }
                }),
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        if (name == "financialYear" && financialYears.length > 0) {
            const year = financialYears.find((item) => {
                if (item?._id == value) {
                    return item
                }
            });
            if (year) {
                setSelectedFinancialYear(year)
            }
        }

        if (name == "currency" && currencies.length > 0) {
            const currency = currencies.find((item) => {
                if (item?._id == value) {
                    return item
                }
            });
            if (currency) {
                setSelectedCurrency(currency)
            }
        }

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
        setLoading(true);
        if (error) {
            setLoading(false);
            return
        } else {
            try {
                const clientId = localStorage.getItem("saas_client_clientId");
                if (id) {
                    const response = await voucherService.update({ ...formData, clientId: clientId, groupId: id })
                    toast.success(response?.data?.message);
                } else {
                    const response = await voucherService.create({ ...formData, clientId: clientId, isSingleEntry: false });
                    toast.success(response?.data?.message);
                }
                setLoading(false);
                setFormData({
                    voucherGroup: '',
                    entries: [
                        { ledger: '', credit: '', debit: '', type: 'credit' },
                        { ledger: '', credit: '', debit: '', type: 'debit' },
                    ],
                    narration: '',
                });
            } catch (error) {
                setLoading(false);
                console.log("error while creating voucher", error);
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

                    const response = await voucherService.getLinkedVoucher(baseAddress?.voucherLinkId);

                    console.log("response voucher linked", response);

                    // {
                    //     level: "",
                    //         businessUnit: "",
                    //             branch: "",
                    //                 warehouse: "",

                    //                     voucherGroup: '',
                    //                         entries: [
                    //                             { ledger: '', credit: '', debit: '', type: 'credit' }, // First row: Credit
                    //                             { ledger: '', credit: '', debit: '', type: 'debit' },  // Second row: Debit
                    //                         ],
                    //                             narration: '',
                    //                                 financialYear: '',
                    //                                     currency: ''
                    // }
                    const entries = response?.data?.vouchers?.map((item) => {
                        if (item?.credit !== 0) {
                            return { ledger: item.ledger, credit: item?.credit, debit: "", type: 'credit' }
                        } else if (item?.debit !== 0) {
                            return { ledger: item.ledger, credit: "", debit: item?.debit, type: 'debit' }

                        }
                    });
                    setFormData((prev) => ({
                        ...prev,
                        level: level,
                        businessUnit: baseAddress.businessUnit,
                        branch: baseAddress.branch,
                        warehouse: baseAddress.warehouse,
                        voucherGroup: baseAddress?.voucherGroup,
                        narration: baseAddress?.narration,
                        financialYear: baseAddress?.financialYear?._id,
                        currency: baseAddress?.currency?._id,
                        entries: entries

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
    }, [id]);


    useEffect(() => {
        getActiveBusinessUnit();
        getCurrencies();
        getFinancialYears()
    }, []);

    async function getActiveBusinessUnit() {
        try {
            const response = await warehouseService.getActiveBusinessUnit();
            setActiveBusinessUnits(response?.data?.businessUnits)
        } catch (error) {
            console.log("error while getting the active business unit", error);
        }
    }

    async function getFinancialYears() {
        try {
            const response = await voucherService.getAllFinancialYear();
            setFinancialYear(response?.data?.financialYears);
            setSelectedFinancialYear(response?.data?.financialYears[0])
            setFormData((prev) => {
                return { ...prev, financialYear: response?.data?.financialYears[0]?._id }
            })
        } catch (error) {
            console.log("error while getting the active business unit", error);
        }
    }

    async function getCurrencies() {
        try {
            const response = await voucherService.getAllCurrencies();
            setCurrencies(response?.data?.currencies);
            setSelectedCurrency(response?.data?.currencies[0])
            setFormData((prev) => {
                return { ...prev, currency: response?.data?.currencies[0]?._id }
            })
        } catch (error) {
            console.log("error while getting the active business unit", error);
        }
    }


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

    const [voucherGroups, setVoucherGroups] = useState([]);
    const [ledgers, setLedgers] = useState([])

    useEffect(() => {
        if (level) {
            if (level == "vendor") {
                getList("vendor", null)
                getLedgers("vendor", null)
            } else if (level == "business" && businessUnit) {
                getList("business", businessUnit)
                getLedgers("business", businessUnit)
            } else if (level == "branch" && branch) {
                getList("branch", branch)
                getLedgers("branch", branch)
            } else if (level == "warehouse" && warehouse) {
                getList("warehouse", warehouse)
                getLedgers("warehouse", warehouse)
            }
        }
    }, [level, businessUnit, branch, warehouse]);

    async function getList(level, levelId) {
        try {
            const response = await voucherGroupService.getAll(level, levelId);
            setVoucherGroups(response?.data?.voucherGroups);
            if (!id) {
                setFormData((prev) => {
                    return { ...prev, voucherGroup: "" }
                })
            }
        } catch (error) {
            console.log("error while fetching voucher groups");
        }
    }

    async function getLedgers(level, levelId) {
        try {
            const response = await ledgerService.getAll(level, levelId);
            console.log("response lll", response);
            setLedgers(response?.data?.ledgers);
            if (!id) {
                setFormData((prev) => {
                    const entries = prev.entries.map((item) => {
                        return { ...item, ledger: "" }
                    })
                    return {
                        ...prev, entries: entries
                    }
                })
            }
        } catch (error) {
            console.log("error while fetching ledger account");
        }
    }

    // -----------------------------------------------------------------------



    // Update totals when entries change
    useEffect(() => {
        const debitTotal = formData.entries.reduce((sum, entry) => {
            return entry.type === 'debit' ? sum + (parseFloat(entry.debit) || 0) : sum;
        }, 0);
        const creditTotal = formData.entries.reduce((sum, entry) => {
            return entry.type === 'credit' ? sum + (parseFloat(entry.credit) || 0) : sum;
        }, 0);
        setTotals({ debit: debitTotal, credit: creditTotal });
    }, [formData.entries]);

    return (
        <div>

            <div className={`${isDark ? "bg-darkSecondary text-white" : "bg-white text-black-900"} p-5 shadow-lg relative`}>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 ">
                    Voucher Entry
                </h2>
                <form onSubmit={onSubmit} className="space-y-6 ">



                    <div className='absolute  top-2 right-2 flex justify-center items-center gap-2'>
                        <div className='flex gap-2'>
                            <span>{selectedFinancialYear?.name}</span> _
                            <span>{selectedCurrency?.code}</span>
                        </div>
                        <span onClick={() => setShowModal(!showModal)} >
                            <MdOutlineSettings className='text-lg cursor-pointer' />
                        </span>
                    </div>


                    {/* Voucher Group Dropdown */}
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

                        <div
                            className={`fromGroup   ${formDataErr?.voucherGroup !== "" ? "has-error" : ""
                                } `}
                        >
                            <label
                                htmlFor="voucherGroup"
                                className="form-label"
                            >
                                Voucher Group
                            </label>
                            <select
                                id="voucherGroup"
                                name='voucherGroup'
                                value={formData.voucherGroup}
                                // onChange={(e) => handleInputChange('voucherGroup', e.target.value)}
                                onChange={(e) => handleChange(e)}
                                className="form-control py-2  appearance-none relative flex-1"
                                aria-required="true"
                            >
                                <option value="">Select Voucher Group</option>
                                {voucherGroups && voucherGroups?.length > 0 && voucherGroups.map(group => (
                                    <option key={group._id} value={group._id}>
                                        {group.name}
                                    </option>
                                ))}
                            </select>
                            {<p className="text-sm text-red-500">{formDataErr.voucherGroup}</p>}

                        </div>
                    </div>



                    {/* Voucher Entries Table */}
                    <div>
                        <div className="grid grid-cols-4 gap-4 font-medium text-gray-700 border-b border-gray-200 pb-2 mb-4">
                            <div className='form-label'>Type</div>
                            <div className='form-label'>Particulars</div>
                            <div className="text-right form-label">Debit</div>
                            <div className="text-right form-label">Credit</div>
                        </div>
                        {formData.entries.map((entry, index) => (
                            <div key={index} className="grid grid-cols-4 gap-4 mb-4 items-center">
                                {/* Type Column */}
                                <input
                                    type="text"
                                    value={entry.type.charAt(0).toUpperCase() + entry.type.slice(1)} // Capitalize 'credit'/'debit'
                                    disabled
                                    className="form-control py-2  appearance-none relative flex-1"
                                    aria-label={`Entry type: ${entry.type}`}
                                />

                                {/* Particulars (Ledger) */}
                                <select
                                    value={entry.ledger}
                                    name='ledger'
                                    onChange={(e) => handleChange(e, index)}
                                    className="form-control py-2  appearance-none relative flex-1" aria-label={`Ledger for ${entry.type} entry`}
                                    aria-required="true"
                                >
                                    <option value="">Select Ledger</option>
                                    {ledgers.map(ledger => (
                                        <option key={ledger._id} value={ledger._id}>
                                            {ledger.ledgerName}
                                        </option>
                                    ))}
                                </select>

                                {/* Debit Input */}
                                <input
                                    type="number"
                                    name='debit'
                                    value={entry.debit}
                                    onChange={(e) => handleChange(e, index)}
                                    disabled={entry.type === 'credit'}
                                    className={`p-2 border form-control border-gray-300 rounded-md text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${entry.type === 'credit' ? 'bg-gray-100 cursor-not-allowed' : ''
                                        }`}
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    aria-label="Debit amount"
                                />

                                {/* Credit Input */}
                                <input
                                    type="number"
                                    name='credit'
                                    value={entry.credit}
                                    onChange={(e) => handleChange(e, index)}
                                    disabled={entry.type === 'debit'}
                                    className={`p-2 border form-control border-gray-300 rounded-md text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${entry.type === 'debit' ? 'bg-gray-100 cursor-not-allowed' : ''
                                        }`}
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    aria-label="Credit amount"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Totals Section */}
                    <div className="grid grid-cols-4 gap-4 font-medium text-gray-700 border-t border-gray-200 pt-2">
                        <div></div>
                        <div className='form-label'>Total</div>
                        <div className="text-right form-label">
                            {totals.debit.toFixed(2)}
                        </div>
                        <div className="text-right form-label">
                            {totals.credit.toFixed(2)}
                        </div>
                    </div>

                    {/* Narration */}

                    <label
                        className={`block form-label text-sm font-medium text-gray-700 mb-1  ${formDataErr?.narration !== "" ? "has-error" : ""
                            } `}


                    >
                        <p className="form-label">
                            Narration<span className="text-red-500">*</span>
                        </p>
                        <textarea
                            id="narration"
                            name='narration'
                            value={formData.narration}
                            onChange={(e) => handleChange(e)}
                            className="w-full form-control p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows="4"
                            placeholder="Enter narration..."
                            aria-label="Narration"
                        />
                        {
                            <p className="text-sm text-red-500">
                                {formDataErr.narration}
                            </p>
                        }
                    </label>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className={`bg-lightBtn dark:bg-darkBtn p-3 rounded-md text-white  text-center btn btn inline-flex justify-center`}
                        >
                            {loading ? (
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
                            ) : "Save Voucher"}
                        </button>
                    </div>
                </form>


                <Transition appear show={showModal} as={Fragment}>
                    <Dialog
                        as="div"
                        className="relative z-[99999]"
                        onClose={closeModal}
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
                                        text-left align-middle shadow-xl transition-alll max-w-3xl ${isDark ? "bg-darkSecondary text-white" : "bg-light"}`}
                                    >
                                        <div
                                            className={`relative overflow-hidden py-4 px-5 text-lightModalHeaderColor flex justify-between bg-white border-b border-lightBorderColor dark:bg-darkInput dark:border-b dark:border-darkSecondary `}
                                        >
                                            <h2 className="capitalize leading-6 tracking-wider  text-xl font-semibold text-lightModalHeaderColor dark:text-darkTitleColor">
                                                set Financial Year
                                            </h2>
                                            <button onClick={closeModal} className=" text-lightmodalCrosscolor hover:text-lightmodalbtnText text-[22px]">
                                                <Icon icon="heroicons-outline:x" />
                                            </button>
                                        </div>

                                        <div
                                            className={`px-0 py-8 ${scrollContent ? "overflow-y-auto max-h-[400px]" : ""
                                                }`}
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 overflow-hidden p-4">

                                                <div
                                                    className={`fromGroup   ${formDataErr?.financialYear !== "" ? "has-error" : ""
                                                        } `}
                                                >
                                                    <label htmlFor=" hh" className="form-label ">
                                                        <p className="form-label">
                                                            Financial year <span className="text-red-500">*</span>
                                                        </p>
                                                    </label>
                                                    <select
                                                        name="financialYear"
                                                        value={formData.financialYear}
                                                        onChange={handleChange}
                                                        disabled={isViewed}
                                                        className="form-control py-2  appearance-none relative flex-1"
                                                    >
                                                        <option value="">None</option>

                                                        {financialYears &&
                                                            financialYears?.map((item) => (
                                                                <option value={item?._id} key={item?._id}>{item?.name}</option>
                                                            ))}
                                                    </select>
                                                    {<p className="text-sm text-red-500">{formDataErr.financialYear}</p>}
                                                </div>
                                                <div
                                                    className={`fromGroup   ${formDataErr?.currency !== "" ? "has-error" : ""
                                                        } `}
                                                >
                                                    <label htmlFor=" hh" className="form-label ">
                                                        <p className="form-label">
                                                            Currency <span className="text-red-500">*</span>
                                                        </p>
                                                    </label>
                                                    <select
                                                        name="currency"
                                                        value={formData.currency}
                                                        onChange={handleChange}
                                                        disabled={isViewed}
                                                        className="form-control py-2  appearance-none relative flex-1"
                                                    >
                                                        <option value="">None</option>
                                                        {currencies &&
                                                            currencies?.map((item) => (
                                                                <option value={item?._id} key={item?._id}>{item?.code}</option>
                                                            ))}
                                                    </select>
                                                    {<p className="text-sm text-red-500">{formDataErr.currency}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>





            </div>
        </div>



    );
}

export default CreateVoucher;