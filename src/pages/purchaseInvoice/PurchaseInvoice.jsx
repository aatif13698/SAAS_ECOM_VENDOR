
import React, { useEffect, Fragment, useState } from 'react';
import { BsPlus } from "react-icons/bs";
import useDarkmode from '@/hooks/useDarkMode';
import { GoTrash, GoCheck } from "react-icons/go";
import supplierService from '@/services/supplier/supplier.service';
import { Dialog, Transition } from "@headlessui/react";
import Icon from "@/components/ui/Icon";
import Button from '../../components/ui/Button';
import AddAddressModel from '../purchaseOrder/AddAddressModel';
import ProductListModel from './ProductListModel';
import AddTransportModel from '../purchaseOrder/AddTransportModel';
import { useSelector } from 'react-redux';
import warehouseService from '@/services/warehouse/warehouse.service';
import { removeItemsList, resetPurchaseOrder, setAccountNumber, setBalance, setBankName, setBranch, setBranchName, setBusinessUnit, setIfscCode, setIsInterState, setItemsList, setLevel, setNotes, setPaidAmount, setPayedFrom, setPaymentMethod, setPoDate, setPoNumber, setShippingAddress, setSupplier, setWarehouse } from '@/store/slices/purchaseInvoice/purhcaseInvoiceSclice';
import { useDispatch } from 'react-redux';
import purchaseInvoiceService from '@/services/purchaseInvoice/purchaseInvoice.service';
import { formatDate } from '@fullcalendar/core';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import purchasePaymentConfigureService from '@/services/purchasePaymentConfig/purchasePaymentConfigure.service';
import transactionSeriesService from "../../services/transactionSeries/tansactionSeries.service"

const defaultState = {
  level: "",
  businessUnit: "",
  branch: "",
  warehouse: "",
  supplier: null,
  shippingAddress: {
    fullName: "",
    phone: "",
    alternamtivePhone: "",
    country: "",
    state: "",
    city: "",
    ZipCode: "",
    address: "",
    roadName: "",
    nearbyLandmark: "",
    houseNumber: "",
    _id: ""
  },
  poNumber: '',
  poDate: new Date().toISOString().split('T')[0],
  items: [
    {
      srNo: 1,
      itemName: {
        name: "",
        productStock: "",
        productMainStock: "",
        purchasePrice: ""
      },
      quantity: 1,
      mrp: 0,
      discount: 0,
      taxableAmount: 0,
      gstPercent: 0,
      cgstPercent: 0,
      sgstPercent: 0,
      igstPercent: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      tax: 0,
      totalAmount: 0
    }
  ],
  notes: '',
  bankDetails: {
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    branch: '',
  },
  isInterState: false,
  roundOff: false,
  paymentMethod: '',
  paidAmount: 0,
  balance: 0,

};

const PurchaseInvoice = ({ noFade, scrollContent }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation();


  const { changeCount } = useSelector((state) => state.financialYearChangeSclice);


  // const {id, row} = location?.state;

  const purhcaseOrderDraftData = useSelector((state) => state.purchaseInvoiceSlice);
  const store = useSelector((state) => state);
  console.log("store", purhcaseOrderDraftData);

  const [isDark] = useDarkmode();
  const [addresses, setAddresses] = useState([]);
  const [currentSupplierId, setCurrentSupplierId] = useState("");

  const [formData, setFormData] = useState({
    level: purhcaseOrderDraftData?.level,
    businessUnit: purhcaseOrderDraftData?.businessUnit,
    branch: purhcaseOrderDraftData?.branch,
    warehouse: purhcaseOrderDraftData.warehouse,
    supplier: null,
    shippingAddress: {
      fullName: "",
      phone: "",
      alternamtivePhone: "",
      country: "",
      state: "",
      city: "",
      ZipCode: "",
      address: "",
      roadName: "",
      nearbyLandmark: "",
      houseNumber: "",
      _id: ""
    },
    poNumber: '',
    poDate: new Date().toISOString().split('T')[0],
    items: [
      {
        srNo: 1,
        itemName: {
          name: "",
          productStock: "",
          productMainStock: "",
          purchasePrice: ""
        },
        quantity: 1,
        mrp: 0,
        discount: 0,
        taxableAmount: 0,
        gstPercent: 0,
        cgstPercent: 0,
        sgstPercent: 0,
        igstPercent: 0,
        cgst: 0,
        sgst: 0,
        igst: 0,
        tax: 0,
        totalAmount: 0
      }
    ],
    notes: '',
    bankDetails: {
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      branch: '',
    },
    isInterState: false,
    roundOff: false,
    paymentMethod: '',
    payedFrom: '',
    paidAmount: 0,
    balance: 0,
  });

  const { user: currentUser, isAuth: isAuthenticated } = useSelector((state) => state.auth);

  const [currentWorkingFy, setCurrentWorkingFy] = useState(null);



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
        setFormData((prev) => ({ ...prev, businessUnit: currentUser.businessUnit }));
        dispatch(setBusinessUnit(currentUser.businessUnit));
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
        setFormData((prev) => ({ ...prev, businessUnit: currentUser.businessUnit, branch: currentUser.branch }));
        dispatch(setBusinessUnit(currentUser.businessUnit));
        dispatch(setBranch(currentUser.branch));

      } else if (currentUser.isWarehouseLevel) {
        setLevelList([
          {
            name: "Warehouse",
            value: "warehouse"
          },
        ])
        setFormData((prev) => ({ ...prev, businessUnit: currentUser.businessUnit, branch: currentUser.branch, warehouse: currentUser.warehouse }));
        dispatch(setBusinessUnit(currentUser.businessUnit));
        dispatch(setBranch(currentUser.branch));
        dispatch(setWarehouse(currentUser.warehouse));
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
    if (!purhcaseOrderDraftData?.level) return;
    setFormData((prev) => ({
      ...prev,
      level: purhcaseOrderDraftData.level ?? prev.level,
      businessUnit: purhcaseOrderDraftData.businessUnit ? purhcaseOrderDraftData.businessUnit : prev.businessUnit,
      branch: purhcaseOrderDraftData.branch ? purhcaseOrderDraftData.branch : prev.branch,
      warehouse: purhcaseOrderDraftData.warehouse ? purhcaseOrderDraftData.warehouse : "",
      supplier: purhcaseOrderDraftData?.supplier ? purhcaseOrderDraftData?.supplier : null,
      shippingAddress: purhcaseOrderDraftData?.shippingAddress ? purhcaseOrderDraftData?.shippingAddress : prev.shippingAddress,
      items: purhcaseOrderDraftData?.items ? purhcaseOrderDraftData?.items : prev?.items,
      isInterState: purhcaseOrderDraftData?.isInterState,
      poNumber: purhcaseOrderDraftData?.poNumber,
      poDate: purhcaseOrderDraftData?.poDate,
      notes: purhcaseOrderDraftData?.notes,
      bankDetails: {
        bankName: purhcaseOrderDraftData?.bankDetails?.bankName || "",
        accountNumber: purhcaseOrderDraftData?.bankDetails?.accountNumber || "",
        ifscCode: purhcaseOrderDraftData?.bankDetails?.ifscCode || "",
        branch: purhcaseOrderDraftData?.bankDetails?.branch || ""
      },

      paymentMethod: purhcaseOrderDraftData?.paymentMethod,
      paidAmount: purhcaseOrderDraftData?.paidAmount,
      payedFrom: purhcaseOrderDraftData?.payedFrom,
      balance: purhcaseOrderDraftData?.balance

    }));

    const warehouseDetail = activeWarehouse.find((item) => item?._id == purhcaseOrderDraftData.warehouse);
    if (warehouseDetail) {
      setCurrentWarehouseDetal(warehouseDetail);
    }
  }, [purhcaseOrderDraftData]);



  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      poNumber: purhcaseOrderDraftData?.poNumber,
    }))
  }, [purhcaseOrderDraftData?.poNumber])

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
      const response = await transactionSeriesService.getNextSerialNumber(financialYear, "purchase_invoice");
      setCurrentWorkingFy(response?.data?.financialYear)
      const nextNumber = Number(response?.data?.series?.nextNum) + 1;
      const series = `${response?.data?.series?.prefix + "" + nextNumber}`;
      dispatch(setPoNumber(series))
    } catch (error) {
      console.log("error while getting the next series", error);
    }
  }


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

      if (name == "bankName") {
        dispatch(setBankName(value));
      } else if (name == "accountNumber") {
        dispatch(setAccountNumber(value));
      } else if (name == "ifscCode") {
        dispatch(setIfscCode(value));
      } else if (name == "branch") {
        dispatch(setBranchName(value));
      }
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

  // === Tax calculation logic ===
  const calculateTaxes = (item, name, parsedValue) => {
    const rate = item.gstPercent;
    const taxable = item.mrp * item.quantity - item.discount;

    if (formData.isInterState) {
      if (name == "cgstPercent") {
        item.cgstPercent = parsedValue;
        item.cgst = taxable * (parsedValue / 100);
      }
      if (name == "sgstPercent") {
        item.sgstPercent = parsedValue;
        item.sgst = taxable * (parsedValue / 100);
      }

      if (name == "mrp" || name == "discount" || name == "quantity") {
        item.cgst = taxable * (item.cgstPercent / 100);
        item.sgst = taxable * (item.sgstPercent / 100);
      }

      item.taxableAmount = taxable;
      item.tax = item.cgst + item.sgst;
      item.totalAmount = taxable + item.tax;

    } else {

      if (name == "igstPercent") {
        item.igstPercent = parsedValue;
        item.igst = taxable * (parsedValue / 100);
      }

      if (name == "mrp" || name == "discount" || name == "quantity") {
        item.igst = taxable * (item.igstPercent / 100);
      }

      item.taxableAmount = taxable;
      item.tax = item.igst;
      item.totalAmount = taxable + item.tax;

    }


  };

  // === Item change handler (quantity, mrp, discount, gst) ===
  const handleItemChange = (index, e) => {
    const { name, value } = e.target;

    const newItems = [...formData.items];
    const parsedValue = name === 'itemName' ? value : (parseFloat(value) || 0);

    // console.log("parsedValue", parsedValue);


    newItems[index] = { ...newItems[index], [name]: parsedValue };

    // Recalculate taxable amount and taxes
    const item = newItems[index];

    // console.log("item", item);

    calculateTaxes(item, name, parsedValue);

    setFormData(prev => ({ ...prev, items: newItems }));
    dispatch(setItemsList(newItems))
  };



  // === Remove item row ===
  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items
        .filter((_, i) => i !== index)
        .map((item, i) => ({ ...item, srNo: i + 1 }));
      setFormData(prev => ({ ...prev, items: newItems }));
    }
  };

  // === Totals calculation ===
  const calculateTotals = () => {
    const totalTaxable = formData.items.reduce((sum, item) => sum + item.taxableAmount, 0);
    const totalTaxes = formData.items.reduce((sum, item) => sum + item.tax, 0);
    const totalDiscount = formData.items.reduce((sum, item) => sum + item.discount, 0);
    const totalCGST = formData.items.reduce((sum, item) => sum + item.cgst, 0);
    const totalSGST = formData.items.reduce((sum, item) => sum + item.sgst, 0);
    const totalIGST = formData.items.reduce((sum, item) => sum + item.igst, 0);
    const grandTotal = totalTaxable + totalTaxes;
    const roundOffAmount = formData.roundOff ? Math.round(grandTotal) - grandTotal : 0;
    const finalTotal = grandTotal + roundOffAmount;

    return {
      totalTaxable,
      totalTaxes,
      totalDiscount,
      totalCGST,
      totalSGST,
      totalIGST,
      grandTotal,
      roundOffAmount,
      finalTotal
    };
  };

  const totals = calculateTotals();

  // === Update balance when totals or paid amount change ===
  useEffect(() => {
    setFormData(prev => ({ ...prev, balance: totals.finalTotal - prev.paidAmount }));
    dispatch(setBalance(totals.finalTotal - formData?.paidAmount))
  }, [totals.finalTotal, formData.paidAmount]);

  // === Fetch shipping addresses when supplier changes ===
  useEffect(() => {
    if (formData?.supplier) {
      getShippingAddress(formData?.supplier?._id);
      setCurrentSupplierId(formData?.supplier?._id);
    }
  }, [formData?.supplier]);

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
    if (purhcaseOrderDraftData?.level !== "") {
      let prevItem = formData?.items;
      if (currentWarehouseDetail?.state && formData?.shippingAddress?.state) {
        console.log("222");
        dispatch(setIsInterState(currentWarehouseDetail?.state !== formData?.shippingAddress?.state ? false : true));
        if (!purhcaseOrderDraftData?.shippingAddress?.fullName) {
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

  }, [currentWarehouseDetail, formData?.shippingAddress?.state, purhcaseOrderDraftData]);






  // === Select supplier ===
  const handleSelectSupplier = (supplier) => {
    setFormData(prev => ({
      ...prev,
      supplier,
    }));
    dispatch(setSupplier(supplier));
    dispatch(removeItemsList([
      {
        srNo: 1,
        itemName: {
          name: "",
          productStock: "",
          productMainStock: "",
          purchasePrice: ""
        },
        quantity: 1,
        mrp: 0,
        discount: 0,
        taxableAmount: 0,
        gstPercent: 0,
        cgstPercent: 0,
        sgstPercent: 0,
        igstPercent: 0,
        cgst: 0,
        sgst: 0,
        igst: 0,
        tax: 0,
        totalAmount: 0
      }
    ]))
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

      if (currentWorkingFy && currentWorkingFy?._id) {
        dataObject.financialYear = currentWorkingFy?._id
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
    dispatch(resetPurchaseOrder());
    setFormData(defaultState);
    navigate('/purchase-invoices-list');
  }


  const isBankFilled = Object.values(formData.bankDetails).some(value => value !== '');

  return (
    <div className=' bg-white dark:bg-darkSecondary rounded-lg relative'>

      <div className='bg-white shadow-sm flex gap-2 justify-between dark:bg-darkSecondary sticky z-[99] top-[3.54rem] p-4  border-b-2'>

        <div>
          <h2 className="text-xl font-semibold   text-gray-700">Create Purchase Invoice</h2>
        </div>
        <div className='flex gap-2'>
          {
            purhcaseOrderDraftData?.level ? <button type='button' className='bg-red-600 text-white border border-gray-200 hover:bg-red-500 rounded-lg px-2 py-1 ' onClick={() => {
              dispatch(resetPurchaseOrder());
              setFormData(defaultState);

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
                      disabled={(currentUser.isBuLevel || currentUser.isBranchLevel || currentUser.isWarehouseLevel) ? true : formData?.items[0]?.itemName?.name ? true : false}
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
                      disabled={(currentUser.isBranchLevel || currentUser.isWarehouseLevel) ? true : formData?.items[0]?.itemName?.name ? true : false}
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
                      disabled={(currentUser.isWarehouseLevel) ? true : formData?.items[0]?.itemName?.name ? true : false}

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
              <div className={`bg-white dark:bg-transparent rounded-lg border border-gray-200 ${formData.supplier ? "lg:col-span-1 md:col-span-1" : "lg:col-span-2 md:col-span-2"}`}>
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

              {/* Card 2: Ship From */}
              {formData.supplier && (
                <div className="bg-white dark:bg-transparent lg:col-span-1 md:col-span-1 rounded-lg border border-gray-200">
                  <div className='bg-gray-100 dark:bg-transparent dark:border-b-[2px] dark:border-white md:h-[20%] p-2 rounded-t-lg flex justify-between items-center'>
                    <h3 className="text-lg font-medium text-gray-700">Ship From</h3>
                    {addresses.length > 0 && (
                      <Button
                        text={`${formData?.shippingAddress?.fullName ? "Change Shipping" : "Select Shipping"} `}
                        className="text-lightModalHeaderColor dark:text-darkBtn border py-1 border-lightModalHeaderColor dark:border-darkBtn hover:bg-lightModalHeaderColor/20"
                        onClick={() => {
                          formData?.items[0]?.itemName?.name ? "" : setOpenModal2(true);
                        }}
                        disabled={formData?.items[0]?.itemName?.name ? true : false}
                      />
                    )}
                  </div>
                  <div className='h-[80%] p-4'>
                    {formData?.shippingAddress?.fullName ? (
                      <div className="text-sm space-y-1">
                        <p><strong>Name:</strong> {formData.shippingAddress.fullName}</p>
                        <p><strong>Contact Number:</strong> {formData.shippingAddress.phone}</p>
                        <p><strong>Address:</strong> {formData.shippingAddress.address}, {formData.shippingAddress.city}, {formData.shippingAddress.state}, {formData.shippingAddress.ZipCode}</p>
                        <p><strong>Landmark:</strong> {formData.shippingAddress.nearbyLandmark || '—'}</p>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setOpenModal3(true)}
                        className='flex items-center p-4 w-full justify-center hover:bg-lightHoverBgBtn/20 hover:text-white border border-dashed border-lightHoverBgBtn dark:border-darkBtn rounded-md'
                      >
                        <BsPlus className='text-lightHoverBgBtn dark:text-darkBtn' />
                        <span className='text-lightHoverBgBtn dark:text-darkBtn ml-1'>Add Address</span>
                      </button>
                    )}
                    {/* <div className='mt-2 flex justify-end'>
                        <Button
                          text="Add Trasnport"
                          className="text-lightModalHeaderColor  dark:text-darkBtn border py-1 border-lightModalHeaderColor dark:border-darkBtn hover:bg-lightModalHeaderColor/20"
                          onClick={() => setOpenModal5(true)}
                        />
                      </div> */}
                  </div>
                </div>
              )}

              {/* Card 3: PO Details */}
              <div className="bg-white dark:bg-transparent lg:col-span-1 md:col-span-2 rounded-lg border border-gray-200">
                <div className='bg-gray-100 dark:bg-transparent dark:border-b-[2px] dark:border-white  p-2 rounded-t-lg'>
                  <h3 className="md:text-base text-base font-medium mb-2 text-gray-700">Purchase Invoice Details</h3>
                </div>
                <div className="h-[80%] p-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Inv No</label>
                    <input
                      type="text"
                      name="poNumber"
                      value={formData.poNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                      disabled={true}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Inv Date</label>
                    <input
                      type="date"
                      name="poDate"
                      value={formData.poDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  {/* <div className='col-span-1 md:col-span-2 border-dashed border-2 p-3 rounded-md'>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                          <input
                          name='due'
                            type="date"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Due Days</label>
                          <input
                            type="number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g. 30"
                          />
                        </div>
                      </div>
                    </div> */}
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Items Table */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Items</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-transparent border border-gray-300 table-fixed">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-800">
                    <th className="w-12 py-2 px-4 border border-gray-300 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">SR. NO</th>

                    {/* ← Narrower Item column */}
                    <th className="w-48 py-2 px-4 border border-gray-300 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Item Name</th>

                    {/* ← Wider Qty column */}
                    <th className="md:w-32 w-52 py-2 px-4 border border-gray-300 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Qty</th>

                    {/* ← Wider Price column */}
                    <th className="md:w-20 w-40 py-2 px-4 border border-gray-300 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Price</th>

                    <th className="w-32 py-2 px-4 border border-gray-300 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Discount</th>
                    <th className="w-40 py-2 px-4 border border-gray-300 text-right text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Taxable Amt</th>

                    {formData?.isInterState ? (
                      <>
                        <th className="w-28 py-2 px-4 border border-gray-300 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">CGST (%)</th>
                        <th className="w-28 py-2 px-4 border border-gray-300 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">SGST (%)</th>
                      </>
                    ) : (
                      <th className="w-28 py-2 px-4 border border-gray-300 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">IGST (%)</th>
                    )}

                    <th className="w-36 py-2 px-4 border border-gray-300 text-right text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Tax Amt</th>
                    <th className="w-40 py-2 px-4 border border-gray-300 text-right text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Total Amt</th>
                    <th className="w-24 py-2 px-4 border border-gray-300 text-center text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>

                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200">
                  {formData.items.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-2 px-4 border border-gray-300 text-sm text-center">{item.srNo}</td>

                      {/* Item Name – narrower but still usable */}
                      <td className="py-2 px-4 border border-gray-300">
                        <button
                          type="button"
                          onClick={() => setOpenModal4(true)}
                          className="flex w-full items-center p-2 text-left hover:bg-lightHoverBgBtn/20 hover:text-white border border-dashed border-lightHoverBgBtn dark:border-darkBtn rounded-md text-sm truncate"
                        >
                          <span className="text-[.8rem] text-lightHoverBgBtn dark:text-darkBtn truncate block">
                            {item?.itemName?.name || "Select Item"}
                          </span>
                        </button>
                      </td>

                      {/* Wider Qty */}
                      <td className="py-2 px-4 border border-gray-300">
                        <input
                          type="number"
                          name="quantity"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, e)}
                          className="md:w-20 w-full px-2 py-1 border border-gray-300 rounded text-sm text-right focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          min="1"
                          step="1"
                          required
                        />
                      </td>

                      {/* Wider Price */}
                      <td className="py-2 px-4 border border-gray-300">
                        <input
                          type="number"
                          name="mrp"
                          value={item.mrp}
                          onChange={(e) => handleItemChange(index, e)}
                          className="md:w-20 w-full px-2 py-1 border border-gray-300 rounded text-sm text-right focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          min="0"
                          step="0.01"
                          required
                        />
                      </td>

                      {/* Rest of the columns (unchanged) */}
                      <td className="py-2 px-4 border border-gray-300">
                        <input
                          type="number"
                          name="discount"
                          value={item.discount}
                          onChange={(e) => handleItemChange(index, e)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-right focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          min="0"
                          step="0.01"
                        />
                      </td>

                      <td className="py-2 px-4 border border-gray-300 text-right text-sm font-medium pr-3">
                        {item.taxableAmount.toFixed(2)}
                      </td>

                      {formData?.isInterState ? (
                        <>
                          <td className="py-2 px-4 border border-gray-300">
                            <input type="number" name="cgstPercent" value={item.cgstPercent} onChange={(e) => handleItemChange(index, e)}
                              className="md:w-14 w-full px-2 py-1 border border-gray-300 rounded text-sm text-right focus:outline-none focus:ring-1 focus:ring-indigo-500" min="0" step="0.01" />
                          </td>
                          <td className="py-2 px-4 border border-gray-300">
                            <input type="number" name="sgstPercent" value={item.sgstPercent} onChange={(e) => handleItemChange(index, e)}
                              className="md:w-14 w-full px-2 py-1 border border-gray-300 rounded text-sm text-right focus:outline-none focus:ring-1 focus:ring-indigo-500" min="0" step="0.01" />
                          </td>
                        </>
                      ) : (
                        <td className="py-2 px-4 border border-gray-300">
                          <input type="number" name="igstPercent" value={item.igstPercent} onChange={(e) => handleItemChange(index, e)}
                            className="md:w-14 w-full px-2 py-1 border border-gray-300 rounded text-sm text-right focus:outline-none focus:ring-1 focus:ring-indigo-500" min="0" step="0.01" />
                        </td>
                      )}

                      <td className="py-2 px-4 border border-gray-300 text-right text-sm font-medium pr-3">
                        {item.tax.toFixed(2)}
                      </td>
                      <td className="py-2 px-4 border border-gray-300 text-right text-sm font-medium pr-3 font-bold">
                        {item.totalAmount.toFixed(2)}
                      </td>
                      <td className="py-2 px-4 border border-gray-300 text-center">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={formData.items.length === 1}
                        >
                          <GoTrash className="w-5 h-5 mx-auto" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>

                {/* tfoot remains the same */}
                <tfoot>
                  <tr className="bg-gray-100 dark:bg-gray-800 font-medium text-sm">
                    <td colSpan={5} className="py-3 px-4 border border-gray-300 text-left">Total Discount: {totals.totalDiscount.toFixed(2)}</td>
                    <td className="py-3 px-4 border border-gray-300 text-right pr-3">Total Taxable: {totals.totalTaxable.toFixed(2)}</td>
                    <td colSpan={formData?.isInterState ? 3 : 2} className="py-3 px-4 border border-gray-300 text-right pr-3">
                      Total Taxes: {totals.totalTaxes.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 border border-gray-300 text-right pr-3 font-bold text-base">
                      Grand Total: {totals.grandTotal.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 border border-gray-300"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <button
              type="button"
              // onClick={addItem}
              onClick={() => setOpenModal4(true)}
              className='mt-3 flex items-center px-3 py-2 text-sm hover:bg-lightHoverBgBtn/20 hover:text-white border border-dashed border-lightHoverBgBtn dark:border-darkBtn rounded-md'
            >
              <BsPlus className='text-lightHoverBgBtn dark:text-darkBtn' />
              <span className='ml-1 text-lightHoverBgBtn dark:text-darkBtn'>Add Item</span>
            </button>
          </section>

          <hr className="my-8 border-gray-300" />

          {/* Two-column layout: Notes/Bank | Payment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
            <div className="hidden md:block absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-px bg-gray-300"></div>

            {/* Left: Notes & Bank Details */}
            <div className="flex flex-col gap-6 pr-4">
              {/* Notes */}
              <section>
                {showNotesInput ? (
                  <div>
                    <h2 className="text-xl font-semibold mb-3 text-gray-700">Notes</h2>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      rows="4"
                      placeholder="Enter any additional notes..."
                    />
                    <Button
                      text="Save"
                      className="mt-2 text-lightModalHeaderColor dark:text-darkBtn border py-1.5 px-3 border-lightModalHeaderColor dark:border-darkBtn hover:bg-lightModalHeaderColor/20 text-sm"
                      onClick={() => setShowNotesInput(false)}
                    />
                  </div>
                ) : formData.notes ? (
                  <div>
                    <h2 className="text-xl font-semibold mb-3 text-gray-700">Notes</h2>
                    <p className="text-gray-700 text-sm">{formData.notes}</p>
                    <Button
                      text="Edit Notes"
                      className="mt-2 text-lightModalHeaderColor dark:text-darkBtn border py-1.5 px-3 border-lightModalHeaderColor dark:border-darkBtn hover:bg-lightModalHeaderColor/20 text-sm"
                      onClick={() => setShowNotesInput(true)}
                    />
                  </div>
                ) : (
                  <Button
                    text="Add Notes"
                    className="text-lightModalHeaderColor dark:text-darkBtn border py-1.5 px-3 border-lightModalHeaderColor dark:border-darkBtn hover:bg-lightModalHeaderColor/20 text-sm"
                    onClick={() => setShowNotesInput(true)}
                  />
                )}
              </section>

              {/* Bank Details */}
              <section>
                {showBankInput ? (
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 p-4">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Bank Details for Payments</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {['bankName', 'accountNumber', 'ifscCode', 'branch'].map(field => (
                        <input
                          key={field}
                          type="text"
                          name={field}
                          placeholder={field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          value={formData.bankDetails[field]}
                          onChange={(e) => handleInputChange(e, 'bankDetails')}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        />
                      ))}
                    </div>
                    <Button
                      text="Save"
                      className="mt-3 text-lightModalHeaderColor dark:text-darkBtn border py-1.5 px-3 border-lightModalHeaderColor dark:border-darkBtn hover:bg-lightModalHeaderColor/20 text-sm"
                      onClick={() => setShowBankInput(false)}
                    />
                  </div>
                ) : isBankFilled ? (
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 p-4">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Bank Details for Payments</h2>
                    <div className="text-sm space-y-1">
                      <p><strong>Bank Name:</strong> {formData.bankDetails.bankName}</p>
                      <p><strong>Account Number:</strong> {formData.bankDetails.accountNumber}</p>
                      <p><strong>IFSC Code:</strong> {formData.bankDetails.ifscCode}</p>
                      <p><strong>Branch:</strong> {formData.bankDetails.branch}</p>
                    </div>
                    <Button
                      text="Edit Bank Details"
                      className="mt-3 text-lightModalHeaderColor dark:text-darkBtn border py-1.5 px-3 border-lightModalHeaderColor dark:border-darkBtn hover:bg-lightModalHeaderColor/20 text-sm"
                      onClick={() => setShowBankInput(true)}
                    />
                  </div>
                ) : (
                  <Button
                    text="Add Bank Detail"
                    className="text-lightModalHeaderColor dark:text-darkBtn border py-1.5 px-3 border-lightModalHeaderColor dark:border-darkBtn hover:bg-lightModalHeaderColor/20 text-sm"
                    onClick={() => setShowBankInput(true)}
                  />
                )}
              </section>
            </div>

            {/* Right: Payment Summary & Options */}
            <div className="flex flex-col gap-6 pl-4">
              <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Payment Summary</h2>
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 p-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span>Total Taxable Amount:</span> <span>{totals.totalTaxable.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Total CGST:</span> <span>{totals.totalCGST.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Total SGST:</span> <span>{totals.totalSGST.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Total IGST:</span> <span>{totals.totalIGST.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Total Tax Amount:</span> <span>{totals.totalTaxes.toFixed(2)}</span></div>
                  <div className="h-px bg-gray-300 my-2"></div>
                  <div className="flex justify-between font-bold"><span>Grand Total:</span> <span>{totals.grandTotal.toFixed(2)}</span></div>
                </div>
              </section>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="roundOff"
                  checked={formData.roundOff}
                  onChange={(e) => setFormData(prev => ({ ...prev, roundOff: e.target.checked }))}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <label className="text-sm text-gray-700 dark:text-gray-300">Round Off</label>
                {formData.roundOff && (
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Round Off: {totals.roundOffAmount.toFixed(2)}
                  </span>
                )}
              </div>

              {/* <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Payment Options</h2>
                <div className="space-y-3">
                  <div className='grid md:grid-cols-2'>
                    <div>
                      <label className=" text-sm font-medium text-gray-700 mb-1">Paid Amount</label>
                      <input
                        type="number"
                        name="paidAmount"
                        value={formData.paidAmount}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button
                        text="Full Payment"
                        className="bg-indigo-600 h-fit text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, paidAmount: totals.finalTotal, balance: 0 }));
                          dispatch(setPaidAmount(totals.finalTotal));
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                    <select
                      disabled={!warehouse}
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    >
                      <option value="">Select Method</option>
                      <option value="cash">Cash</option>
                      <option value="cheque">Cheque</option>
                      <option value="online">Online</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="UPI">UPI</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment From</label>
                    <select
                      disabled={!warehouse}
                      name="paymentMethod"
                      // value={formData.paymentMethod}
                      // onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    >
                      <option value="">Select Ledger</option>
                      {paymentFrom &&
                        paymentFrom?.map((item) => (
                          <option value={item._id} key={item?._id}>
                            {item && item?.ledgerName}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="flex justify-between text-sm font-medium">
                    <span>Balance Due:</span>
                    <span className={formData.balance > 0 ? "text-red-600" : "text-green-600"}>
                      {formData.balance.toFixed(2)}
                    </span>
                  </div>

                </div>
              </section> */}

              <section className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-800">Payment Details</h2>

                {/* Paid Amount + Quick Full Payment */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label
                      htmlFor="paidAmount"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Amount Paid
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                        {'₹'}
                      </span>
                      <input
                        id="paidAmount"
                        name="paidAmount"
                        type="number"
                        value={formData.paidAmount ?? ''}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm
                     focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                     disabled:bg-gray-100 disabled:text-gray-500 transition-colors"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="flex items-end pb-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          paidAmount: totals.finalTotal,
                          balance: 0
                        }));
                        dispatch(setPaidAmount(totals.finalTotal));
                      }}
                      disabled={totals.finalTotal <= 0}
                      className="px-4 py-2 border border-dashed w-full border-emerald-500 text-emerald-500 text-sm font-medium rounded-lg
                   hover:bg-emerald-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:ring-offset-2
                   disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Mark Full Amount
                    </button>
                  </div>
                </div>

                {/* Payment Method + Payment From (in one row on larger screens) */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* Payment Method */}
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

                  {/* Payment From (Ledger) */}
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
                </div>

                {/* Balance Summary */}
                <div className="pt-4 border-t border-gray-200">
                  <dl className="flex justify-between items-center text-sm">
                    <dt className="font-medium text-gray-700">Balance Due</dt>
                    <dd
                      className={`font-semibold ${formData.balance > 0
                        ? 'text-red-600'
                        : formData.balance < 0
                          ? 'text-amber-600'
                          : 'text-green-600'
                        }`}
                    >
                      {Math.abs(formData.balance).toFixed(2)} {'₹'}
                      {formData.balance < 0 && ' (Overpaid)'}
                    </dd>
                  </dl>
                </div>
              </section>
            </div>
          </div>
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
      {/* Shipping Address List Modal */}
      <Transition appear show={openModal2} as={Fragment}>
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
                      Select Address
                    </h2>
                    <button onClick={() => setOpenModal2(false)} className="text-lightmodalCrosscolor hover:text-lightmodalbtnText text-[22px]">
                      <Icon icon="heroicons-outline:x" />
                    </button>
                  </div>

                  <div className="p-4 overflow-y-auto max-h-[50vh]">
                    {addresses?.length > 0 ? (
                      addresses.map((address) => (
                        <div
                          key={address._id}
                          className={`p-2 my-2 rounded cursor-pointer hover:bg-indigo-100 hover:text-black-500 flex justify-between items-center dark:hover:bg-gray-700 ${formData.shippingAddress?._id === address._id ? 'bg-indigo-50 text-gray-500' : ''
                            }`}
                          onClick={() => handleSelectShippingAddress(address)}
                        >
                          <div>
                            <p className="font-medium">{address.fullName}</p>
                            <p className="text-sm">{address.phone}</p>
                            <p className="text-sm">{address.address},{address?.city}, {address?.state}</p>
                          </div>
                          {formData.shippingAddress?._id === address._id && (
                            <GoCheck className="text-green-500" />
                          )}
                        </div>
                      ))
                    ) : (
                      <p className={isDark ? 'text-gray-300' : 'text-gray-500'}>
                        No address available
                      </p>
                    )}
                  </div>

                  <div className="px-4 py-3 flex justify-end space-x-3 border-t border-slate-100 dark:border-darkSecondary bg-white dark:bg-darkInput">
                    <button
                      type="button"
                      onClick={() => {
                        setOpenModal2(false)
                        setTimeout(() => {
                          setOpenModal3(true);
                        }, 300);
                      }}
                      className='flex items-center px-2 hover:bg-lightHoverBgBtn/20 hover:text-white border border-dashed border-lightHoverBgBtn dark:border-darkBtn rounded-md'
                    >
                      <BsPlus className='text-lightHoverBgBtn dark:text-darkBtn' />
                      <span className='text-lightHoverBgBtn dark:text-darkBtn'>
                        Add Address
                      </span>
                    </button>
                    <Button
                      text="Cancel"
                      className="bg-lightmodalBgBtnHover lightmodalBgBtn text-white hover:bg-lightmodalBgBtn hover:text-lightmodalbtnText px-4 py-2 rounded"
                      onClick={() => setOpenModal2(false)}
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Add Address Modal */}
      <AddAddressModel
        openModal3={openModal3}
        setOpenModal3={setOpenModal3}
        getShippingAddress={getShippingAddress}
        currentSupplierId={currentSupplierId}
      />

      {/* Add Transport Model */}
      <AddTransportModel
        openModal3={openModal5}
        setOpenModal3={setOpenModal5}
        getShippingAddress={getShippingAddress}
        currentSupplierId={currentSupplierId}
      />

      {/* Product List Modal */}
      <ProductListModel
        items={formData?.items}
        isInterState={formData?.isInterState}
        setItem={setFormData}
        openModal3={openModal4}
        setOpenModal3={setOpenModal4}
        getShippingAddress={getShippingAddress}
        currentSupplierId={currentSupplierId}
        supplier={formData?.supplier?._id}
      />
    </div>
  );
};

export default PurchaseInvoice;






