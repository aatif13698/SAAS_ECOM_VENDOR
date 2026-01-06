
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
import { formatDate } from '@fullcalendar/core';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import purchasePaymentConfigureService from '@/services/purchasePaymentConfig/purchasePaymentConfigure.service';

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

};

const CreatePaymentOut = ({ noFade, scrollContent }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const location = useLocation();

    // const {id, row} = location?.state;

    const paymentOutDrafData = useSelector((state) => state.paymentOutSlice);
    const store = useSelector((state) => state);
    console.log("store", store);

    const [isDark] = useDarkmode();
    const [addresses, setAddresses] = useState([]);
    const [currentSupplierId, setCurrentSupplierId] = useState("");

    const [formData, setFormData] = useState({
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
    });

    const { user: currentUser, isAuth: isAuthenticated } = useSelector((state) => state.auth);

    const [levelResult, setLevelResult] = useState(0);
    const [activeBusinessUnits, setActiveBusinessUnits] = useState([]);
    const [activeBranches, setActiveBranches] = useState([]);
    const [activeWarehouse, setActiveWarehouse] = useState([]);
    const [currentWarehouseDetail, setCurrentWarehouseDetal] = useState(null)
    const [levelList, setLevelList] = useState([
        {
            name: "Warehouse",
            value: "warehouse"
        },
    ]);

    console.log("formData", formData);



    const [formDataErr, setFormDataErr] = useState({
        level: "",
        businessUnit: "",
        branch: "",
        warehouse: "",
    });

    // const [formData2, setFormData] = useState({
    //   level: "",
    //   businessUnit: "",
    //   branch: "",
    //   warehouse: "",
    // });

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

        if (name === "level" && value) {
            dispatch(setLevel(value))
        }


        if (name === "businessUnit" && value) {
            dispatch(setBusinessUnit(value));
        }
        if (name === "branch" && value) {
            dispatch(setBranch(value));
        }
        if (name === "warehouse" && value) {
            dispatch(setWarehouse(value))
        }

        if (name === "businessUnit" && value !== "") {
            setActiveBranches([]);
            setFormData((prev) => ({
                ...prev,
                branch: ""
            }));
        }
        if (name === "warehouse" && value !== "") {
            const warehouseDetail = activeWarehouse.find((item) => item?._id == value);
            if (warehouseDetail) {
                setCurrentWarehouseDetal(warehouseDetail);
            }
        }
        setFormDataErr((prev) => ({
            ...prev,
            [name]: validateField(name, value)
        }));
    };

    useEffect(() => {
        if (!paymentOutDrafData?.level) return;
        setFormData((prev) => ({
            ...prev,
            level: paymentOutDrafData.level ?? prev.level,
            businessUnit: paymentOutDrafData.businessUnit ? paymentOutDrafData.businessUnit : prev.businessUnit,
            branch: paymentOutDrafData.branch ? paymentOutDrafData.branch : prev.branch,
            warehouse: paymentOutDrafData.warehouse ? paymentOutDrafData.warehouse : "",
            supplier: paymentOutDrafData?.supplier ? paymentOutDrafData?.supplier : null,
            shippingAddress: paymentOutDrafData?.shippingAddress ? paymentOutDrafData?.shippingAddress : prev.shippingAddress,
            items: paymentOutDrafData?.items ? paymentOutDrafData?.items : prev?.items,
            isInterState: paymentOutDrafData?.isInterState,
            poNumber: paymentOutDrafData?.poNumber,
            poDate: paymentOutDrafData?.poDate,
            notes: paymentOutDrafData?.notes,
            bankDetails: {
                bankName: paymentOutDrafData?.bankDetails?.bankName || "",
                accountNumber: paymentOutDrafData?.bankDetails?.accountNumber || "",
                ifscCode: paymentOutDrafData?.bankDetails?.ifscCode || "",
                branch: paymentOutDrafData?.bankDetails?.branch || ""
            },

            paymentMethod: paymentOutDrafData?.paymentMethod,
            paidAmount: paymentOutDrafData?.paidAmount,
            payedFrom: paymentOutDrafData?.payedFrom,
            balance: paymentOutDrafData?.balance

        }));

        const warehouseDetail = activeWarehouse.find((item) => item?._id == paymentOutDrafData.warehouse);
        if (warehouseDetail) {
            setCurrentWarehouseDetal(warehouseDetail);
        }
    }, [paymentOutDrafData]);


    // useEffect(() => {
    //   if(id && paymentOutDrafData){

    //   }

    // },[id])



    const [suppliers, setSuppliers] = useState([]);
    const [openModal, setOpenModal] = useState(false);     // Supplier modal
    const [openModal2, setOpenModal2] = useState(false);   // Shipping Address list modal
    const [openModal3, setOpenModal3] = useState(false);   // Add Address modal
    const [openModal4, setOpenModal4] = useState(false);   // Product List modal
    const [openModal5, setOpenModal5] = useState(false);   // Add Transport modal
    const [showNotesInput, setShowNotesInput] = useState(false);
    const [showBankInput, setShowBankInput] = useState(false);

    // === Generic input handler ===
    const handleInputChange = (e, section) => {
        const { name, value } = e.target;
        if (section) {
            setFormData(prev => ({
                ...prev,
                [section]: { ...prev[section], [name]: value },
            }));


        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
            if (name == "poNumber") {
                dispatch(setPoNumber(value))
            }
            if (name == "poDate") {
                dispatch(setPoDate(value))
            }
            if (name === "notes") {
                dispatch(setNotes(value));
            }
            if (name == "paymentMethod") {
                dispatch(setPaymentMethod(value));
            }
            if (name == "payedFrom") {
                dispatch(setPayedFrom(value))
            }
            if (name == "paidAmount") {
                dispatch(setPaidAmount(value));
            }
        }
    };



    // === Fetch shipping addresses when supplier changes ===
    useEffect(() => {
        if (formData?.supplier) {
            getShippingAddress(formData?.supplier?._id);
            setCurrentSupplierId(formData?.supplier?._id);
            getUnPaidInvoices(formData?.supplier?._id, formData?.supplier?.ledgerLinkedId)
        }
    }, [formData?.supplier]);

    async function getUnPaidInvoices(supplier, supplierLedger) {
        try {
            const response = await purchaseInvoiceService.getUnpaidInvoices("warehouse", warehouse, supplier, supplierLedger );
            console.log("response unpaid", response);
        } catch (error) {
            console.log("error while getting the unpaid invoices", error);
        }
    }

    // === Fetch supplier addresses ===
    const getShippingAddress = async (id, type) => {
        try {
            const response = await supplierService.getSupplierAddress(id);
            const addresses = response?.data?.addresses?.reverse() || [];
            setAddresses(addresses);

            if (addresses.length > 0) {
                // setFormData(prev => ({
                //   ...prev,
                //   shippingAddress: addresses[0]
                // }));
                // dispatch(setShippingAddress(addresses[0]))

            } else {
                setFormData(prev => ({
                    ...prev,
                    shippingAddress: null,
                }));
            }

            if (type === "new Address") {
                setOpenModal2(true);
            }
        } catch (error) {
            console.error("Error fetching shipping address:", error);
        }
    };

    useEffect(() => {
        if (paymentOutDrafData?.level !== "") {
            let prevItem = formData?.items;
            if (currentWarehouseDetail?.state && formData?.shippingAddress?.state) {
                console.log("222");
                if (!paymentOutDrafData?.shippingAddress?.fullName) {
                    const items = formData?.items;
                    const updatedItem = items?.map((item) => {
                        return {
                            ...item,
                            sgstPercent: 0,
                            cgstPercent: 0,
                            igstPercent: 0,

                            sgst: 0,
                            cgst: 0,
                            igst: 0,

                            tax: 0,
                            totalAmount: item?.taxableAmount,
                        }
                    });
                    prevItem = updatedItem;
                    setFormData(prev => ({
                        ...prev,
                        isInterState: currentWarehouseDetail?.state !== formData?.shippingAddress?.state ? false : true,
                        items: prevItem
                    }));
                    dispatch(setItemsList(prevItem));
                }
            }
        }

    }, [currentWarehouseDetail, formData?.shippingAddress?.state, paymentOutDrafData]);






    // === Select supplier ===
    const handleSelectSupplier = (supplier) => {
        setFormData(prev => ({
            ...prev,
            supplier,
        }));
        dispatch(setSupplier(supplier));
        setOpenModal(false);
    };

    // === Select shipping address ===
    const handleSelectShippingAddress = (address) => {
        setFormData(prev => ({
            ...prev,
            shippingAddress: address
        }));
        dispatch(setShippingAddress(address))
        setOpenModal2(false);
    };

    // === Fetch all suppliers on mount ===
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
                setActiveBusinessUnits(response?.data?.businessUnits)
            } catch (error) {
                console.log("error while getting the active business unit", error);
            }
        }
        getActiveBusinessUnit();
    }, []);

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
            getBranchByBusiness(businessUnit);
        }
    }, [businessUnit]);

    useEffect(() => {
        if (branch) {
            getWarehouseByBranch(branch);
        }
    }, [branch]);


    useEffect(() => {

        if (warehouse && formData.paymentMethod) {
            console.log("formData.paymentMethod", formData.paymentMethod);
            loadData("warehouse", warehouse, formData.paymentMethod)
        }

    }, [warehouse, formData.paymentMethod]);


    const [paymentFrom, setPaymentFrom] = useState([]);


    const loadData = async (currentLevel, levelId, method) => {
        try {
            const configures = await purchasePaymentConfigureService.getPaymentFromLedgers(currentLevel, levelId);
            console.log("configures", configures);
            let ledgerArray = [];
            if (method == "cash" && configures.data.cashLedgers?.length > 0) {
                if (configures.data.cashLedgers?.length > 0) {
                    const cashArray = configures.data.cashLedgers?.map((cash) => {
                        return {
                            ...cash.id,

                        }
                    });
                    ledgerArray = cashArray
                }
            } else {
                if (configures.data.bankLedgers?.length > 0) {
                    const bankArray = configures.data.bankLedgers?.map((bank) => {
                        return {
                            ...bank.id,
                        }
                    });
                    ledgerArray = bankArray
                }
            }
            setPaymentFrom(ledgerArray)
        } catch (err) {
            console.error(err);
        }
    };


    async function getWarehouseByBranch(id) {
        try {
            const response = await warehouseService.getWarehouseByBranch(id);
            setActiveWarehouse(response.data)
        } catch (error) {
            console.log("error while getting warehouse by branch");
        }
    }

    async function getBranchByBusiness(id) {
        try {
            const response = await warehouseService.getBranchByBusiness(id);
            setActiveBranches(response.data)
        } catch (error) {
            console.log("error while getting branch by business unit");
        }
    }

    // === Form submission ===
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.supplier) {
            alert('Please select a supplier before submitting.');
            return;
        }
        let emptyMrpCount = 0
        for (let index = 0; index < formData?.items?.length; index++) {
            const item = formData?.items[index];
            if (item?.mrp == 0) emptyMrpCount++
        }
        if (emptyMrpCount > 0) {
            alert('Please enter price for the items.');
            return
        }

        try {

            const dataObject = {
                clientId: localStorage.getItem("saas_client_clientId"),
                level: level,
                businessUnit: businessUnit,
                branch: branch,
                warehouse: warehouse,

                supplier: formData?.supplier?._id,
                supplierLedger: formData?.supplier?.ledgerLinkedId,
                shippingAddress: formData?.shippingAddress,
                piNumber: formData?.poNumber,
                piDate: formData?.poDate,
                items: formData?.items,
                notes: formData?.notes,
                bankDetails: formData?.bankDetails,
                isInterState: formData?.isInterState,
                roundOff: formData?.roundOff,
                paymentMethod: formData?.paymentMethod,
                payedFrom: formData?.payedFrom,
                paidAmount: formData?.paidAmount,
                balance: formData?.balance,
            }
            const response = await purchaseInvoiceService?.create(dataObject);
            toast.success('Purchase Order submitted successfully!');
            resetAllAndNavigate()

        } catch (error) {
            const message = error?.response?.data?.message;

            toast.error(message)

            console.log("error while submitting the purchase order", message);
        }
    };

    function resetAllAndNavigate() {
        setFormData(defaultState);
        navigate('/purchase-invoices-list');

    }



    return (
        <div className=' bg-white dark:bg-darkSecondary rounded-lg relative'>

            <div className='bg-white shadow-sm flex gap-2 justify-between dark:bg-darkSecondary sticky z-[99] top-[3.54rem] p-4  border-b-2'>

                <div>
                    <h2 className="text-xl font-semibold   text-gray-700">Create Payment Out</h2>
                </div>
                <div className='flex gap-2'>
                    {
                        paymentOutDrafData?.level ? <button type='button' className='bg-red-600 text-white border border-gray-200 hover:bg-red-500 rounded-lg px-2 py-1 ' onClick={() => {
                            setFormData(defaultState);
                            dispatch(resetPaymentOut());

                        }}>Reset</button> : ""
                    }
                    <button type='button'
                        className={`bg-lightBtn dark:bg-darkBtn px-2 py-1  rounded-md text-white  text-center  inline-flex justify-center`}
                        onClick={(e) => {
                            handleSubmit(e)
                        }}>Save</button>
                </div>


            </div>


            <div className={`${isDark ? "bg-darkSecondary text-white" : ""} p-5 `}>

                <form className='relative' onSubmit={handleSubmit}>
                    <div className='flex items-center gap-2 mb-4'>



                    </div>

                    <section className="mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-100 dark:bg-transparent border dark:border-white p-2 rounded-lg">
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
                                    // disabled={isViewed}
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
                                            // disabled={formData?.items[0]?.itemName?.name ? true : false}
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
                                            // disabled={formData?.items[0]?.itemName?.name ? true : false}
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
                                            // disabled={formData?.items[0]?.itemName?.name ? true : false}

                                            // disabled={isViewed || currentUser.isWarehouseLevel}
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


                    </section>

                    {/* Section 1: Supplier, Ship From, PO Details */}
                    <section className="mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Card 1: Supplier */}
                            <div className={`bg-white dark:bg-transparent rounded-lg border border-gray-200 ${formData.supplier ? "lg:col-span-1 md:col-span-1" : "lg:col-span-1 md:col-span-2"}`}>
                                <div className='bg-gray-100 dark:bg-transparent dark:border-b-[2px] dark:border-white  p-2 rounded-t-lg flex justify-between items-center'>
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
                                            className={` ${!warehouse ? "cursor-not-allowed" : ""} flex items-center p-4 w-fill justify-center hover:bg-lightHoverBgBtn/20 hover:text-white border border-dashed border-lightHoverBgBtn dark:border-darkBtn rounded-md`}
                                        >
                                            <BsPlus className='text-lightHoverBgBtn dark:text-darkBtn' />
                                            <span className='text-lightHoverBgBtn dark:text-darkBtn ml-1'>Add Supplier</span>
                                        </button>
                                    )}
                                </div>
                            </div>


                            {/* Card 3: PO Details */}
                            <div className="bg-white dark:bg-transparent lg:col-span-1 md:col-span-2 rounded-lg border border-gray-200">
                                <div className='bg-gray-100 dark:bg-transparent dark:border-b-[2px] dark:border-white  p-2 rounded-t-lg'>
                                    <h3 className="md:text-base text-base font-medium mb-2 text-gray-700">Payment Out Details</h3>
                                </div>
                                <div className="h-[80%] p-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Out No</label>
                                        <input
                                            type="text"
                                            name="poNumber"
                                            value={formData.poNumber}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Out Date</label>
                                        <input
                                            type="date"
                                            name="poDate"
                                            value={formData.poDate}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            required
                                        />
                                    </div>
                                    <div className='md:col-span-2'>
                                        <label className="block text-sm font-medium text-gray-700 mb-1 ">Payment Amount</label>
                                        <input
                                            type="text"
                                            name="poNumber"
                                            value={formData.poNumber}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* ledger detail */}

                            <div className="bg-white dark:bg-transparent lg:col-span-1 md:col-span-2 rounded-lg border border-gray-200">
                                <div className='bg-gray-100 dark:bg-transparent dark:border-b-[2px] dark:border-white  p-2 rounded-t-lg'>
                                    <h3 className="md:text-base text-base font-medium mb-2 text-gray-700">Payment Ledger Details</h3>
                                </div>
                                <div className="h-[80%] p-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label
                                            htmlFor="paymentMethod"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Payment Method
                                        </label>
                                        <select
                                            id="paymentMethod"
                                            name="paymentMethod"
                                            value={formData.paymentMethod || ''}
                                            onChange={handleInputChange}
                                            disabled={!warehouse}
                                            className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm
                   bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                   disabled:bg-gray-100 disabled:text-gray-500 transition-colors"
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
                                        <label
                                            htmlFor="payedFrom"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Paid From
                                        </label>
                                        <select
                                            id="payedFrom"
                                            name="payedFrom"           // ← fixed name!
                                            value={formData.payedFrom || ''}
                                            onChange={handleInputChange}
                                            disabled={!warehouse || !paymentFrom?.length}
                                            className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm
                   bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                   disabled:bg-gray-100 disabled:text-gray-500 transition-colors"
                                        >
                                            <option value="">Select ledger / account</option>
                                            {paymentFrom?.map((ledger) => (
                                                <option key={ledger._id} value={ledger._id}>
                                                    {ledger.ledgerName}
                                                    {/* {ledger.accountNumber && ` • ${ledger.accountNumber}`} */}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className='md:col-span-2'>
                                        <label className="block text-sm font-medium text-gray-700 mb-1 ">Notes</label>
                                        <textarea
                                            type="text"
                                            name="poNumber"
                                            value={formData.poNumber}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </form>
            </div>

            {/* Supplier Selection Modal */}
            <Transition appear show={openModal} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-[999]"
                    onClose={() => { }}
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
                    <div
                        className="fixed inset-0 "
                    >
                        <div
                            className={`flex min-h-full justify-center text-center p-6 items-center `}
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
                                    className={`w-full transform rounded-md text-left align-middle shadow-xl transition-all max-w-3xl ${isDark ? "bg-darkSecondary text-white" : "bg-light"}`}
                                >
                                    <div
                                        className={`relative overflow-hidden py-4 px-5 text-lightModalHeaderColor flex justify-between bg-white border-b border-lightBorderColor dark:bg-darkInput dark:border-b dark:border-darkSecondary `}
                                    >
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
                                                    className={`p-2 my-2 rounded cursor-pointer hover:bg-indigo-100 hover:text-black-500 flex justify-between items-center dark:hover:bg-gray-700 ${formData.supplier?._id === supplier._id ? 'bg-indigo-50 text-gray-500' : ''
                                                        }`}
                                                    onClick={() => handleSelectSupplier(supplier)}
                                                >
                                                    <div>
                                                        <p className="font-medium">{supplier.name}</p>
                                                        <p className="text-sm">{supplier.contactPerson} - {supplier.emailContact}</p>
                                                    </div>
                                                    {formData.supplier?._id === supplier._id && (
                                                        <GoCheck className="text-green-500" />
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <p className={isDark ? 'text-gray-300' : 'text-gray-500'}>
                                                No suppliers available
                                            </p>
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






