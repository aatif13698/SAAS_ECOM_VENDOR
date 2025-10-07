import useDarkmode from '@/hooks/useDarkMode';
import ledgerService from '@/services/ledger/ledger.service';
import voucherGroupService from '@/services/voucherGroup/voucherGroup.service';
import warehouseService from '@/services/warehouse/warehouse.service';
import React, { useState, useEffect } from 'react';
import { Item } from 'react-contexify';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

function CreateVoucher() {

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
        // {
        //     name: "Branch",
        //     value: "branch"
        // },
        // {
        //     name: "Warehouse",
        //     value: "warehouse"
        // },
    ])

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
    const [fields, setFields] = useState([]);
    const [ledgerData, setLedgerData] = useState(null)


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
                    // {
                    //     name: "Branch",
                    //     value: "branch"
                    // },
                    // {
                    //     name: "Warehouse",
                    //     value: "warehouse"
                    // },
                ])
            } else if (currentUser.isBuLevel) {
                setLevelList([
                    {
                        name: "Business",
                        value: "business"
                    },
                    // {
                    //     name: "Branch",
                    //     value: "branch"
                    // },
                    // {
                    //     name: "Warehouse",
                    //     value: "warehouse"
                    // },
                ]);
                setFormData((prev) => ({ ...prev, businessUnit: currentUser.businessUnit }))
            } else if (currentUser.isBranchLevel) {
                setLevelList([
                    // {
                    //     name: "Branch",
                    //     value: "branch"
                    // },
                    // {
                    //     name: "Warehouse",
                    //     value: "warehouse"
                    // },
                ]);
                setFormData((prev) => ({ ...prev, businessUnit: currentUser.businessUnit, branch: currentUser.branch }))
            } else if (currentUser.isWarehouseLevel) {
                setLevelList([
                    // {
                    //     name: "Warehouse",
                    //     value: "warehouse"
                    // },
                ])
                setFormData((prev) => ({ ...prev, businessUnit: currentUser.businessUnit, branch: currentUser.branch, warehouse: currentUser.warehouse }))
            }

        } else {

        }

    }, [currentUser]);

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
    });

    const [formDataErr, setFormDataErr] = useState({
        level: "",
        businessUnit: "",
        branch: "",
        warehouse: "",

        groupName: "",
        hasParent: "",
        parentGroup: "",
    });

    console.log("formData", formData);


    const {
        level,
        businessUnit,
        branch,
        warehouse,

    } = formData;

    const [isViewed, setIsViewed] = useState(false);
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
        if (hasParent && parentGroup == "") {
            errors.parentGroup = "Parent group is required"
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




    const handleChange = (e, index) => {
        const { name, value } = e.target;
        if (index || index == 0 && name !== "credit" && name !== "debit") {
            const existInEntries = formData?.entries?.find((item) => {
                if(item?.ledger == value){

                    return item

                }
            });
            console.log("existInEntries", existInEntries);
            
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
        }
        else {
            setFormData(prev => ({ ...prev, [name]: value }));
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
        console.log("error", error);

        setLoading(true);
        if (error) {
            setLoading(false);

            return
        } else {
            try {
                const clientId = localStorage.getItem("saas_client_clientId");

                if (id) {
                    const response = await ledgerGroupService.update({ ...formData, clientId: clientId, groupId: id })
                    toast.success(response?.data?.message);
                } else {
                    const response = await ledgerGroupService.create({ ...formData, clientId: clientId });
                    toast.success(response?.data?.message);

                    setLedgerData(response?.data?.data?.group)

                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.log("error while creating ledger group", error);
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

                    setLedgerData(baseAddress)

                    setFormData((prev) => ({
                        ...prev,
                        level: level,
                        businessUnit: baseAddress.businessUnit,
                        branch: baseAddress.branch,
                        warehouse: baseAddress.warehouse,
                        groupName: baseAddress.groupName,
                        hasParent: baseAddress.hasParent,
                        parentGroup: baseAddress.parentGroup?._id
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

    const [voucherGroups, setVoucherGroups] = useState([]);
    const [ledgers, setLedgers] = useState([])

    console.log("voucherGroups", voucherGroups);


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
        } catch (error) {
            console.log("error while fetching voucher groups");
        }
    }

    async function getLedgers(level, levelId) {
        try {
            const response = await ledgerService.getAll(level, levelId);
            console.log("response lll", response);
            setLedgers(response?.data?.ledgers
            )
        } catch (error) {
            console.log("error while fetching ledger account");
        }
    }

    // -----------------------------------------------------------------------


    const [isDark] = useDarkmode();




    // State management


    const [totals, setTotals] = useState({ debit: 0, credit: 0 });

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

    // Handle input changes
    const handleInputChange = (field, value, index = null) => {
        if (index !== null) {
            setFormData(prev => ({
                ...prev,
                entries: prev.entries.map((entry, i) =>
                    i === index ? { ...entry, [field]: value } : entry
                ),
            }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.voucherGroup) {
            alert('Please select a voucher group.');
            return;
        }
        if (formData.entries.some(entry => !entry.ledger)) {
            alert('Please select a ledger for all entries.');
            return;
        }
        if (totals.debit !== totals.credit || totals.debit === 0) {
            alert('Debit and Credit totals must balance and be non-zero.');
            return;
        }
        // API call placeholder (replace with actual API call)
        console.log('Submitting voucher:', {
            ...formData,
            clientId: 'demoClientId', // Replace with actual clientId
            level: 'vendor', // Replace with actual level
        });
        // Reset form after submission
        setFormData({
            voucherGroup: '',
            entries: [
                { ledger: '', credit: '', debit: '', type: 'credit' },
                { ledger: '', credit: '', debit: '', type: 'debit' },
            ],
            narration: '',
        });
    };

    return (
        <div>

            <div className={`${isDark ? "bg-darkSecondary text-white" : "bg-white text-black-900"} p-5 shadow-lg`}>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 ">
                    Voucher Entry
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
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
                            className={`fromGroup   ${formDataErr?.level !== "" ? "has-error" : ""
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
                                    <option key={group.id} value={group.id}>
                                        {group.name}
                                    </option>
                                ))}
                            </select>

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
                    <div>
                        <label
                            htmlFor="narration"
                            className="block form-label text-sm font-medium text-gray-700 mb-1"
                        >
                            Narration
                        </label>
                        <textarea
                            id="narration"
                            value={formData.narration}
                            onChange={(e) => handleInputChange('narration', e.target.value)}
                            className="w-full form-control p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows="4"
                            placeholder="Enter narration..."
                            aria-label="Narration"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className={`bg-lightBtn dark:bg-darkBtn p-3 rounded-md text-white  text-center btn btn inline-flex justify-center`}
                        >
                            Save Voucher
                        </button>
                    </div>
                </form>
            </div>
        </div>



    );
}

export default CreateVoucher;