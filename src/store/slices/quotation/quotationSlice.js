import { createSlice } from "@reduxjs/toolkit";
import { actions } from "react-table";

const storedAdmin = JSON.parse(localStorage.getItem("adminInfo"));


const initialState = {
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
    sqNumber: '',
    sqDate: new Date().toISOString().split('T')[0],
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

}

export const quotationSlice = createSlice({
    name: "addQuotation",
    initialState: initialState,
    reducers: {
        setLevel: (state, action) => {
            state.level = action.payload;
        },
        setBusinessUnit: (state, action) => {
            state.businessUnit = action.payload;
            state.branch = "";
            state.warehouse = "";
        },
        setBranch: (state, action) => {
            state.branch = action.payload;
            state.warehouse = ""
        },
        remveBranch: (state, action) => {
            state.branch = "";
        },
        setWarehouse: (state, action) => {
            state.warehouse = action.payload;
        },
        removeWarehouse: (state, action) => {
            state.warehouse = "";
        },
        removePurchaseOrder: (state, action) => {
            state.capability = null;
            state.isCapability = false;
        },

        setSupplier: (state, action) => {
            state.supplier = action.payload;
        },
        setShippingAddress: (state, action) => {
            state.shippingAddress = action.payload;
        },
        setItemsList: (state, action) => {
            state.items = action.payload;
        },
        removeItemsList: (state, action) => {
            state.items = action.payload;
        },
        setIsInterState: (state, action) => {
            state.isInterState = action.payload;
        },

        setsqNumber: (state, action) => {
            state.sqNumber = action.payload
        },
        setsqDate: (state, action) => {
            state.sqDate = action.payload
        },

        setBankName: (state, action) => {
            state.bankDetails.bankName = action.payload;
        },
        setAccountNumber: (state, action) => {
            state.bankDetails.accountNumber = action.payload;
        },
        setIfscCode: (state, action) => {
            state.bankDetails.ifscCode = action.payload;
        },
        setBranchName: (state, action) => {
            state.bankDetails.branch = action.payload;
        },
        setNotes: (state, action) => {
            state.notes = action.payload;
        },
        setPaymentMethod: (state, action) => {
            state.paymentMethod = action.payload;
        },
        setPayedFrom: (state, action) => {
            state.payedFrom = action.payload;
        },
        setPaidAmount: (state, action) => {
            state.paidAmount = action.payload;
        },
        setBalance: (state, action) => {
            state.balance = action.payload;
        },
        resetQuotation: () => initialState,
        setSaleQuotation: (state, action) => {
            console.log("action.payload", action.payload);

            return action.payload
            
        },
    },
});




export const { setLevel, setBusinessUnit, setBranch, remveBranch, setWarehouse, removePurchaseOrder, removeWarehouse,
    setSupplier,
    setShippingAddress,
    setItemsList,
    removeItemsList,
    setIsInterState,
    resetQuotation,
    setsqNumber,
    setsqDate,
    setBankName,
    setAccountNumber,
    setIfscCode,
    setBranchName,
    setNotes,
    setPaidAmount,
    setBaymentMethod,
    setPalance,
    setSaleQuotation,
    setPayedFrom
} = quotationSlice.actions;
export default quotationSlice.reducer;
