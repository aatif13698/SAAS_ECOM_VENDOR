
import React, { useEffect, Fragment, useState } from 'react';
import { BsPlus } from "react-icons/bs";
import useDarkmode from '@/hooks/useDarkMode';
import { GoTrash, GoCheck } from "react-icons/go";
import supplierService from '@/services/supplier/supplier.service';
import { Dialog, Transition } from "@headlessui/react";
import Icon from "@/components/ui/Icon";
import Button from '../../components/ui/Button';
import { useSelector } from 'react-redux';
import warehouseService from '@/services/warehouse/warehouse.service';
import { resetPaymentOut, setBranch, setBusinessUnit, setLevel, setNotes, setPaidAmount, setPayedFrom, setPaymentMethod, setPaymentOutDate, setPaymentOutNumber, setSupplier, setWarehouse } from '@/store/slices/paymentOut/paymentOutSlice';
import { useDispatch } from 'react-redux';
import purchaseInvoiceService from '@/services/purchaseInvoice/purchaseInvoice.service';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import purchasePaymentConfigureService from '@/services/purchasePaymentConfig/purchasePaymentConfigure.service';
import transactionSeriesService from "../../services/transactionSeries/tansactionSeries.service";


const defaultState = {
    level: "",
    businessUnit: "",
    branch: "",
    warehouse: "",
    supplier: null,

    paymentOutNumber: '',
    paymentOutDate: new Date().toISOString().split('T')[0],
    notes: '',
    paymentMethod: '',
    paidAmount: 0,
    payedFrom: null,
    balance: 0,
};

const CreatePaymentOut = ({ noFade, scrollContent }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const paymentOutDrafData = useSelector((state) => state.paymentOutSlice);
    const store = useSelector((state) => state);

    const [isDark] = useDarkmode();
    const [currentSupplierId, setCurrentSupplierId] = useState("");

    const [formData, setFormData] = useState(defaultState);

    // console.log("formData", formData);
    // console.log("paymentOutDrafData", paymentOutDrafData);

    const { changeCount } = useSelector((state) => state.financialYearChangeSclice);
    const [currentWorkingFy, setCurrentWorkingFy] = useState(null);


    const { user: currentUser, isAuth: isAuthenticated } = useSelector((state) => state.auth);

    const [levelResult, setLevelResult] = useState(0);
    const [activeBusinessUnits, setActiveBusinessUnits] = useState([]);
    const [activeBranches, setActiveBranches] = useState([]);
    const [activeWarehouse, setActiveWarehouse] = useState([]);
    const [currentWarehouseDetail, setCurrentWarehouseDetal] = useState(null);
    const [unPaidInvoices, setUnpaidInvoices] = useState([]);
    const [allocations, setAllocations] = useState([]);
    const [totalUnpaid, setTotalUnpaid] = useState(0);
    const [totalSettled, setTotalSettled] = useState(0);
    const [levelList, setLevelList] = useState([
        {
            name: "Warehouse",
            value: "warehouse"
        },
    ]);

    const [formDataErr, setFormDataErr] = useState({
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

    useEffect(() => {
        if (currentUser && isAuthenticated) {
            if (currentUser.isVendorLevel) {
                setLevelList([
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
                setFormData((prev) => ({ ...prev, businessUnit: currentUser.businessUnit, branch: currentUser.branch, warehouse: currentUser.warehouse }));
            }
        }
    }, [currentUser]);

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

        if (name === "level" && value) dispatch(setLevel(value));
        if (name === "businessUnit" && value) dispatch(setBusinessUnit(value));
        if (name === "branch" && value) dispatch(setBranch(value));
        if (name === "warehouse" && value) dispatch(setWarehouse(value));

        if (name === "businessUnit" && value !== "") {
            setActiveBranches([]);
            setFormData((prev) => ({ ...prev, branch: "" }));
        }
        if (name === "warehouse" && value !== "") {
            const warehouseDetail = activeWarehouse.find((item) => item?._id === value);
            if (warehouseDetail) setCurrentWarehouseDetal(warehouseDetail);
        }
        setFormDataErr((prev) => ({
            ...prev,
            [name]: validateField(name, value)
        }));
    };

    useEffect(() => {
        if (!paymentOutDrafData?.level) return;
        setFormData((prev) => {
            return ({
                ...prev,
                level: paymentOutDrafData.level ?? prev.level,
                businessUnit: paymentOutDrafData.businessUnit ? paymentOutDrafData.businessUnit : prev.businessUnit,
                branch: paymentOutDrafData.branch ? paymentOutDrafData.branch : prev.branch,
                warehouse: paymentOutDrafData.warehouse ? paymentOutDrafData.warehouse : "",
                supplier: paymentOutDrafData?.supplier ? paymentOutDrafData?.supplier : null,
                paymentOutNumber: paymentOutDrafData?.paymentOutNumber,
                paymentOutDate: paymentOutDrafData?.paymentOutDate,
                notes: paymentOutDrafData?.notes,
                paymentMethod: paymentOutDrafData?.paymentMethod,
                paidAmount: paymentOutDrafData?.paidAmount,
                payedFrom: paymentOutDrafData?.payedFrom,
                balance: paymentOutDrafData?.balance
            })
        });

        const warehouseDetail = activeWarehouse.find((item) => item?._id === paymentOutDrafData.warehouse);
        if (warehouseDetail) setCurrentWarehouseDetal(warehouseDetail);
    }, [paymentOutDrafData]);




    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            paymentOutNumber: paymentOutDrafData?.paymentOutNumber,
        }))
    }, [paymentOutDrafData?.paymentOutNumber])

    useEffect(() => {
        getNextSerial();
    }, [changeCount]);

    function getFiscalYearRange(date) {
        const year = date.getFullYear();
        const nextYear = year + 1;
        const nextYearShort = nextYear % 100; // Gets the last two digits
        return `${year}-${nextYearShort.toString().padStart(2, '0')}`; // Ensures two digits, e.g., 2025-26
    }

    async function getNextSerial() {
        try {
            const currentDate = new Date();
            const financialYear = getFiscalYearRange(currentDate);
            const response = await transactionSeriesService.getNextSerialNumber(financialYear, "payment_out");
            setCurrentWorkingFy(response?.data?.financialYear);
            const nextNumber = Number(response?.data?.series?.nextNum) + 1;
            const series = `${response?.data?.series?.prefix + "" + nextNumber}`;
            dispatch(setPaymentOutNumber(series))
        } catch (error) {
            console.log("error while getting the next series", error);
        }
    }





    const [suppliers, setSuppliers] = useState([]);
    const [openModal, setOpenModal] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "paidAmount") {
            handlePaidAmountChange(parseFloat(value) || 0);
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
            if (name === "paymentOutNumber") dispatch(setPaymentOutNumber(value));
            if (name === "paymentOutDate") dispatch(setPaymentOutDate(value));
            if (name === "notes") dispatch(setNotes(value));
            if (name === "paymentMethod") dispatch(setPaymentMethod(value));
            if (name === "payedFrom") dispatch(setPayedFrom(value));
        }
    };

    const handlePaidAmountChange = (newValue) => {
        setFormData(prev => ({ ...prev, paidAmount: newValue }));
        dispatch(setPaidAmount(newValue));
        handleAutoAllocate(newValue);
    };

    const handleAutoAllocate = (target) => {
        let newAllocs = [...allocations];
        const currentSum = newAllocs.reduce((sum, a) => sum + a.applied, 0);

        if (target === currentSum) return;

        if (target > currentSum) {
            let diff = target - currentSum;
            const nonFixed = newAllocs
                .filter(a => !a.isFixed && (a.balance - a.applied) > 0)
                .sort((a, b) => new Date(a.piDate) - new Date(b.piDate));

            for (let i = 0; i < nonFixed.length && diff > 0; i++) {
                const a = nonFixed[i];
                const addAmount = Math.min(diff, a.balance - a.applied);
                a.applied += addAmount;
                diff -= addAmount;
            }
            if (diff > 0) {
                toast.success("Not enough remaining balance to allocate the full amount.");
                const achievedPaid = currentSum + (target - currentSum - diff);
                setFormData(prev => ({ ...prev, paidAmount: achievedPaid }));
                dispatch(setPaidAmount(achievedPaid));
                return;
            }
        } else {
            let diff = currentSum - target;
            const nonFixedWithApplied = newAllocs
                .filter(a => !a.isFixed && a.applied > 0)
                .sort((a, b) => new Date(b.piDate) - new Date(a.piDate));

            for (let i = 0; i < nonFixedWithApplied.length && diff > 0; i++) {
                const a = nonFixedWithApplied[i];
                const reduceAmount = Math.min(diff, a.applied);
                a.applied -= reduceAmount;
                diff -= reduceAmount;
            }

            if (diff > 0) {
                toast.error("Cannot reduce below the fixed settlements amount.");
                setFormData(prev => ({ ...prev, paidAmount: currentSum }));
                dispatch(setPaidAmount(currentSum));
                return;
            }
        }

        setAllocations(newAllocs);
    };

    // useEffect(() => {
    //     if (allocations && paymentOutDrafData) {
    //         handleAutoAllocate(paymentOutDrafData?.paidAmount)
    //     }
    // }, [allocations, paymentOutDrafData])

    const handleCheckboxChange = (checked, alloc) => {
        let newAllocs = [...allocations];
        const targetAlloc = newAllocs.find(a => a._id === alloc._id);

        if (checked) {
            const diff = targetAlloc.balance - targetAlloc.applied;
            const newPaid = formData.paidAmount + diff;
            setFormData(prev => ({ ...prev, paidAmount: newPaid }));
            dispatch(setPaidAmount(newPaid));
            targetAlloc.applied = targetAlloc.balance;
            targetAlloc.isFixed = true;
        } else {
            const diff = targetAlloc.applied;
            const newPaid = formData.paidAmount - diff;
            setFormData(prev => ({ ...prev, paidAmount: newPaid }));
            dispatch(setPaidAmount(newPaid));
            targetAlloc.applied = 0;
            targetAlloc.isFixed = false;
        }

        setAllocations(newAllocs);
    };

    useEffect(() => {
        if (formData?.supplier) {
            setCurrentSupplierId(formData?.supplier?._id);
            getUnPaidInvoices(formData?.supplier?._id, formData?.supplier?.ledgerLinkedId);
        }
    }, [formData?.supplier]);

    async function getUnPaidInvoices(supplier, supplierLedger) {
        try {
            const response = await purchaseInvoiceService.getUnpaidInvoices(level, formData[level], supplier, supplierLedger);
            if (response?.data?.purchaseInvoices?.length > 0) {
                const formatedInvoices = response.data.purchaseInvoices.map(inv => ({
                    _id: inv._id,
                    piDate: inv.piDate,
                    supplier: inv.supplier,
                    supplierLedger: inv.supplierLedger,
                    piNumber: inv.piNumber,
                    totalOrderAmount: inv.totalOrderAmount,
                    paidAmount: inv.paidAmount,
                    balance: inv.balance
                }));
                setUnpaidInvoices(formatedInvoices);
            } else {
                setUnpaidInvoices([]);
            }
        } catch (error) {
            console.log("Error fetching unpaid invoices:", error);
        }
    }

    useEffect(() => {
        if (unPaidInvoices.length > 0) {
            const sorted = [...unPaidInvoices].sort((a, b) => new Date(a.piDate) - new Date(b.piDate));
            setAllocations(sorted.map(inv => ({ ...inv, applied: 0, isFixed: false })));
        } else {
            setAllocations([]);
        }
    }, [unPaidInvoices]);

    useEffect(() => {
        const unpaid = unPaidInvoices.reduce((sum, inv) => sum + inv.balance, 0);
        setTotalUnpaid(unpaid);
        const settled = allocations.reduce((sum, a) => sum + a.applied, 0);
        setTotalSettled(settled);
        setFormData(prev => ({ ...prev, paidAmount: settled, balance: unpaid - settled }));
    }, [unPaidInvoices, allocations]);

    const handleSelectSupplier = (supplier) => {
        setFormData(prev => ({ ...prev, supplier }));
        dispatch(setSupplier(supplier));
        setOpenModal(false);
    };

    useEffect(() => {
        const getParties = async () => {
            try {
                const response = await supplierService.getAllActive();
                setSuppliers(response?.data || []);
            } catch (error) {
                console.error("Error fetching suppliers:", error);
            }
        };
        getParties();
    }, []);

    useEffect(() => {
        async function getActiveBusinessUnit() {
            try {
                const response = await warehouseService.getActiveBusinessUnit();
                setActiveBusinessUnits(response?.data?.businessUnits || []);
            } catch (error) {
                console.log("Error fetching business units:", error);
            }
        }
        getActiveBusinessUnit();
    }, []);

    useEffect(() => {
        if (level) {
            const levels = { vendor: 1, business: 2, branch: 3, warehouse: 4 };
            setLevelResult(levels[level] || 0);
        } else {
            setLevelResult(0);
        }
    }, [level]);

    useEffect(() => {
        if (businessUnit) getBranchByBusiness(businessUnit);
    }, [businessUnit]);

    useEffect(() => {
        if (branch) getWarehouseByBranch(branch);
    }, [branch]);

    useEffect(() => {
        if (warehouse && formData.paymentMethod) {
            loadData(level, formData[level], formData.paymentMethod);
        }
    }, [warehouse, formData.paymentMethod, level]);

    const [paymentFrom, setPaymentFrom] = useState([]);

    const loadData = async (currentLevel, levelId, method) => {
        try {
            const configures = await purchasePaymentConfigureService.getPaymentFromLedgers(currentLevel, levelId);
            let ledgerArray = [];
            if (method === "cash" && configures.data.cashLedgers?.length > 0) {
                ledgerArray = configures.data.cashLedgers.map(cash => ({ ...cash.id }));
            } else if (configures.data.bankLedgers?.length > 0) {
                ledgerArray = configures.data.bankLedgers.map(bank => ({ ...bank.id }));
            }
            setPaymentFrom(ledgerArray);
        } catch (err) {
            console.error("Error loading payment ledgers:", err);
        }
    };

    async function getWarehouseByBranch(id) {
        try {
            const response = await warehouseService.getWarehouseByBranch(id);
            setActiveWarehouse(response.data || []);
        } catch (error) {
            console.log("Error fetching warehouses:", error);
        }
    }

    async function getBranchByBusiness(id) {
        try {
            const response = await warehouseService.getBranchByBusiness(id);
            setActiveBranches(response.data || []);
        } catch (error) {
            console.log("Error fetching branches:", error);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.supplier) {
            toast.error('Please select a supplier before submitting.');
            return;
        }
        try {
            const dataObject = {
                clientId: localStorage.getItem("saas_client_clientId"),
                level,
                businessUnit,
                branch,
                warehouse,
                supplier: formData?.supplier?._id,
                supplierLedger: formData?.supplier?.ledgerLinkedId,
                paymentOutNumber: formData.paymentOutNumber,
                paymentOutDate: formData.paymentOutDate,
                notes: formData.notes,
                paymentMethod: formData.paymentMethod,
                payedFrom: formData.payedFrom,
                paidAmount: formData.paidAmount,
                balance: formData.balance,
                payments: allocations.filter(a => a.applied > 0).map(a => ({
                    purchaseInvoice: a._id,
                    amount: a.applied
                }))
            };
            if (currentWorkingFy && currentWorkingFy?._id) {
                dataObject.financialYear = currentWorkingFy?._id
            }
            console.log("dataObject", dataObject);
            const response = await purchasePaymentConfigureService?.createPaymentOut(dataObject);
            toast.success('Payment Out submitted successfully!');
            resetAllAndNavigate();
        } catch (error) {
            const message = error?.response?.data?.message;
            toast.error(message);
            console.log("Error submitting payment out:", message);
        }
    };

    function resetAllAndNavigate() {
        setFormData(defaultState);
        navigate('/payment-out-list');
    }

    function formatDate(isoDate) {
        const date = new Date(isoDate);
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }


    return (
        <div className='bg-white dark:bg-darkSecondary rounded-lg relative'>
            <div className='bg-white shadow-sm flex gap-2 justify-between dark:bg-darkSecondary sticky z-[99] top-[3.54rem] p-4 border-b-2'>
                <div>
                    <h2 className="text-xl font-semibold text-gray-700">Create Payment Out</h2>
                </div>
                <div className='flex gap-2'>
                    {paymentOutDrafData?.level && (
                        <button
                            type='button'
                            className='bg-red-600 text-white border border-gray-200 hover:bg-red-500 rounded-lg px-2 py-1'
                            onClick={() => {
                                setFormData(defaultState);
                                setUnpaidInvoices([])
                                dispatch(resetPaymentOut());
                            }}
                        >
                            Reset
                        </button>
                    )}
                    <button
                        type='button'
                        className={`bg-lightBtn dark:bg-darkBtn px-2 py-1 rounded-md text-white text-center inline-flex justify-center`}
                        onClick={handleSubmit}
                    >
                        Save
                    </button>
                </div>
            </div>

            <div className={`${isDark ? "bg-darkSecondary text-white" : ""} p-5`}>
                <form className='relative' onSubmit={handleSubmit}>
                    <section className="mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-100 dark:bg-transparent border dark:border-white p-2 rounded-lg">
                            <div className={`fromGroup ${formDataErr?.level !== "" ? "has-error" : ""}`}>
                                <label htmlFor="level" className="form-label">
                                    Level <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="level"
                                    value={level}
                                    onChange={handleChange}
                                    className="form-control py-2 appearance-none relative flex-1"
                                >
                                    <option value="">None</option>
                                    {levelList.map((item) => (
                                        <option value={item.value} key={item.value}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-sm text-red-500">{formDataErr.level}</p>
                            </div>

                            {levelResult > 1 && (
                                <div className={`fromGroup ${formDataErr?.businessUnit !== "" ? "has-error" : ""}`}>
                                    <label htmlFor="businessUnit" className="form-label">
                                        Business Unit <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="businessUnit"
                                        value={businessUnit}
                                        onChange={handleChange}
                                        className="form-control py-2 appearance-none relative flex-1"
                                    >
                                        <option value="">None</option>
                                        {activeBusinessUnits.map((item) => (
                                            <option value={item._id} key={item._id}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-sm text-red-500">{formDataErr.businessUnit}</p>
                                </div>
                            )}

                            {levelResult > 2 && (
                                <div className={`fromGroup ${formDataErr?.branch !== "" ? "has-error" : ""}`}>
                                    <label htmlFor="branch" className="form-label">
                                        Branch <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="branch"
                                        value={branch}
                                        onChange={handleChange}
                                        className="form-control py-2 appearance-none relative flex-1"
                                    >
                                        <option value="">None</option>
                                        {activeBranches.map((item) => (
                                            <option value={item._id} key={item._id}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-sm text-red-500">{formDataErr.branch}</p>
                                </div>
                            )}

                            {levelResult > 3 && (
                                <div className={`fromGroup ${formDataErr?.warehouse !== "" ? "has-error" : ""}`}>
                                    <label htmlFor="warehouse" className="form-label">
                                        Warehouse <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="warehouse"
                                        value={warehouse}
                                        onChange={handleChange}
                                        className="form-control py-2 appearance-none relative flex-1"
                                    >
                                        <option value="">None</option>
                                        {activeWarehouse.map((item) => (
                                            <option value={item._id} key={item._id}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-sm text-red-500">{formDataErr.warehouse}</p>
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className={`bg-white dark:bg-transparent rounded-lg border border-gray-200 ${formData.supplier ? "lg:col-span-1 md:col-span-1" : "lg:col-span-1 md:col-span-2"}`}>
                                <div className='bg-gray-100 dark:bg-transparent dark:border-b-[2px] dark:border-white p-2 rounded-t-lg flex justify-between items-center'>
                                    <h3 className="text-lg font-medium text-gray-700">Bill From</h3>
                                    {formData.supplier && (
                                        <Button
                                            text="Change Supplier"
                                            className="text-lightModalHeaderColor dark:text-darkBtn border py-1 border-lightModalHeaderColor dark:border-darkBtn hover:bg-lightModalHeaderColor/20"
                                            onClick={() => setOpenModal(true)}
                                        />
                                    )}
                                </div>
                                <div className='lg:h-[80%] md:h-[70%] p-4'>
                                    {formData.supplier ? (
                                        <div className="text-sm space-y-1">
                                            <p><strong>Name:</strong> {formData.supplier.name}</p>
                                            <p><strong>Contact Person:</strong> {formData.supplier.contactPerson}</p>
                                            <p><strong>Email:</strong> {formData.supplier.emailContact}</p>
                                            <p><strong>Contact Number:</strong> {formData.supplier.contactNumber}</p>
                                            <p><strong>Address:</strong> {formData.supplier.address}, {formData.supplier.city}, {formData.supplier.state}, {formData.supplier.ZipCode}, {formData.supplier.country}</p>
                                            <p><strong>GST/VAT:</strong> {formData.supplier.GstVanNumber}</p>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            disabled={!warehouse}
                                            onClick={() => setOpenModal(true)}
                                            className={` ${!warehouse ? "cursor-not-allowed" : ""} flex items-center p-4 w-full justify-center hover:bg-lightHoverBgBtn/20 hover:text-white border border-dashed border-lightHoverBgBtn dark:border-darkBtn rounded-md`}
                                        >
                                            <BsPlus className='text-lightHoverBgBtn dark:text-darkBtn' />
                                            <span className='text-lightHoverBgBtn dark:text-darkBtn ml-1'>Add Supplier</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white dark:bg-transparent lg:col-span-1 md:col-span-2 rounded-lg border border-gray-200">
                                <div className='bg-gray-100 dark:bg-transparent dark:border-b-[2px] dark:border-white p-2 rounded-t-lg'>
                                    <h3 className="md:text-base text-base font-medium mb-2 text-gray-700">Payment Out Details</h3>
                                </div>
                                <div className="h-[80%] p-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Out No</label>
                                        <input
                                            type="text"
                                            name="paymentOutNumber"
                                            value={formData.paymentOutNumber}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Out Date</label>
                                        <input
                                            type="date"
                                            name="paymentOutDate"
                                            value={formData.paymentOutDate}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            required
                                        />
                                    </div>
                                    <div className='md:col-span-2'>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Amount</label>
                                        <input
                                            type="number"
                                            name="paidAmount"
                                            value={formData.paidAmount}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-transparent lg:col-span-1 md:col-span-2 rounded-lg border border-gray-200">
                                <div className='bg-gray-100 dark:bg-transparent dark:border-b-[2px] dark:border-white p-2 rounded-t-lg'>
                                    <h3 className="md:text-base text-base font-medium mb-2 text-gray-700">Payment Ledger Details</h3>
                                </div>
                                <div className="h-[80%] p-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
                                            Payment Method
                                        </label>
                                        <select
                                            id="paymentMethod"
                                            name="paymentMethod"
                                            value={formData.paymentMethod || ''}
                                            onChange={handleInputChange}
                                            disabled={!warehouse}
                                            className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-500 transition-colors"
                                        >
                                            <option value="">Select payment method</option>
                                            <option value="cash">Cash</option>
                                            <option value="cheque">Cheque</option>
                                            <option value="online">Online Payment</option>
                                            <option value="bank_transfer">Bank Transfer</option>
                                            <option value="UPI">UPI</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label htmlFor="payedFrom" className="block text-sm font-medium text-gray-700">
                                            Paid From
                                        </label>
                                        <select
                                            id="payedFrom"
                                            name="payedFrom"
                                            value={formData.payedFrom || ''}
                                            onChange={handleInputChange}
                                            disabled={!warehouse || !paymentFrom?.length}
                                            className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-500 transition-colors"
                                        >
                                            <option value="">Select ledger / account</option>
                                            {paymentFrom.map((ledger) => (
                                                <option key={ledger._id} value={ledger._id}>
                                                    {ledger.ledgerName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className='md:col-span-2'>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                        <textarea
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>
                            </div>


                        </div>
                    </section>
                    <div className="bg-white dark:bg-transparent lg:col-span-2 md:col-span-2 rounded-lg border border-gray-200 col-span-3">
                        <div className='bg-white dark:bg-transparent dark:border-b-[2px] dark:border-white p-4 rounded-t-lg'>
                            <h3 className="text-lg font-medium text-gray-700">Settle Unpaid Invoices</h3>
                        </div>

                        <div className="overflow-x-auto">
                            {allocations.length > 0 ? (
                                <>
                                    <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600 border border-gray-300 dark:border-gray-600">
                                        <thead className="bg-gray-100 dark:bg-gray-800">
                                            <tr className="border-b border-gray-300 dark:border-gray-600">
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300 dark:border-gray-600">
                                                    Pay Full
                                                </th>
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300 dark:border-gray-600">
                                                    Date
                                                </th>
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300 dark:border-gray-600">
                                                    Invoice Number
                                                </th>
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300 dark:border-gray-600">
                                                    Invoice Amount
                                                </th>
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300 dark:border-gray-600">
                                                    Balance
                                                </th>
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                    Amount Settled
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-transparent dark:divide-gray-700">
                                            {allocations.map((alloc) => (
                                                <tr key={alloc._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200 border-r border-gray-200 dark:border-gray-700">
                                                        <input
                                                            type="checkbox"
                                                            checked={alloc.isFixed}
                                                            onChange={(e) => handleCheckboxChange(e.target.checked, alloc)}
                                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200 border-r border-gray-200 dark:border-gray-700">
                                                        {formatDate(alloc.piDate)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200 border-r border-gray-200 dark:border-gray-700">
                                                        {alloc.piNumber}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200 border-r border-gray-200 dark:border-gray-700">
                                                        {alloc.totalOrderAmount.toFixed(2)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200 border-r border-gray-200 dark:border-gray-700">
                                                        {alloc.balance.toFixed(2)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
                                                        {alloc.applied.toFixed(2)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {/* Summary footer with proper borders */}
                                    <div className="grid grid-cols-6 bg-white dark:bg-gray-900 border-t border-gray-300 dark:border-gray-600">

                                        <div className="px-6 py-4  flex justify-start col-span-2 relative bg-gray-100 dark:bg-gray-800">
                                            {/* Remaining Balance positioned on the left side */}
                                            <div className=" whitespace-nowrap text-sm">
                                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Remaining: </span>
                                                <span className="font-semibold text-red-600 dark:text-red-400">
                                                    {(totalUnpaid - totalSettled).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="px-6 py-4 col-span-2 flex gap-2 items-center justify-end  border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800">
                                            <div className="text-xs font-medium text-gray-700 dark:text-gray-300">Total Unpaid:</div>
                                            <div className="text-sm font-semibold text-green-700 dark:text-green-400">
                                                {totalUnpaid.toFixed(2)}
                                            </div>
                                        </div>


                                        {/* Total Settled - under Amount Settled column + Remaining Balance on left */}
                                        <div className="px-6 py-4  flex justify-end items-center gap-2 col-span-2 relative bg-gray-100 dark:bg-gray-800">
                                            <div className="text-xs font-medium text-gray-700 dark:text-gray-300">Total Settled:</div>
                                            <div className="text-sm font-semibold text-blue-700 dark:text-blue-400 ">
                                                {totalSettled.toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="p-8 text-center text-gray-500 dark:text-gray-400 border-t border-gray-300 dark:border-gray-600">
                                    No unpaid invoices available.
                                </div>
                            )}
                        </div>
                    </div>
                </form>
            </div>

            <Transition appear show={openModal} as={Fragment}>
                <Dialog as="div" className="relative z-[999]" onClose={() => { }}>
                    <Transition.Child
                        as={Fragment}
                        enter="duration-300 ease-out"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="duration-200 ease-in"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-slate-900/50 backdrop-filter backdrop-blur-sm" />
                    </Transition.Child>
                    <div className="fixed inset-0">
                        <div className="flex min-h-full justify-center text-center p-6 items-center">
                            <Transition.Child
                                as={Fragment}
                                enter="duration-300 ease-out"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="duration-200 ease-in"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className={`w-full transform rounded-md text-left align-middle shadow-xl transition-all max-w-3xl ${isDark ? "bg-darkSecondary text-white" : "bg-light"}`}>
                                    <div className="relative overflow-hidden py-4 px-5 text-lightModalHeaderColor flex justify-between bg-white border-b border-lightBorderColor dark:bg-darkInput dark:border-b dark:border-darkSecondary">
                                        <h2 className="capitalize leading-6 tracking-wider text-xl font-semibold text-lightModalHeaderColor dark:text-darkTitleColor">
                                            Select Supplier
                                        </h2>
                                        <button onClick={() => setOpenModal(false)} className="text-lightmodalCrosscolor hover:text-lightmodalbtnText text-[22px]">
                                            <Icon icon="heroicons-outline:x" />
                                        </button>
                                    </div>
                                    <div className="p-4 overflow-y-auto max-h-[50vh]">
                                        {suppliers.length > 0 ? (
                                            suppliers.map((supplier) => (
                                                <div
                                                    key={supplier._id}
                                                    className={`p-2 my-2 rounded cursor-pointer hover:bg-indigo-100 hover:text-black-500 flex justify-between items-center dark:hover:bg-gray-700 ${formData.supplier?._id === supplier._id ? 'bg-indigo-50 text-gray-500' : ''}`}
                                                    onClick={() => handleSelectSupplier(supplier)}
                                                >
                                                    <div>
                                                        <p className="font-medium">{supplier.name}</p>
                                                        <p className="text-sm">{supplier.contactPerson} - {supplier.emailContact}</p>
                                                    </div>
                                                    {formData.supplier?._id === supplier._id && <GoCheck className="text-green-500" />}
                                                </div>
                                            ))
                                        ) : (
                                            <p className={isDark ? 'text-gray-300' : 'text-gray-500'}>No suppliers available</p>
                                        )}
                                    </div>
                                    <div className="px-4 py-3 flex justify-end space-x-3 border-t border-slate-100 dark:border-darkSecondary bg-white dark:bg-darkInput">
                                        <Button
                                            text="Cancel"
                                            className="bg-lightmodalBgBtnHover lightmodalBgBtn text-white hover:bg-lightmodalBgBtn hover:text-lightmodalbtnText px-4 py-2 rounded"
                                            onClick={() => setOpenModal(false)}
                                        />
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

export default CreatePaymentOut;