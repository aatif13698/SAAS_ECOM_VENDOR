import { createSlice } from "@reduxjs/toolkit";

const storedAdmin = JSON.parse(localStorage.getItem("adminInfo"));


export const purchaseOrderSlice = createSlice({
    name: "addPurchaseOrder",
    initialState: {
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

    },
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
    },
});

export const { setLevel, setBusinessUnit, setBranch, remveBranch, setWarehouse, removePurchaseOrder, removeWarehouse,
    setSupplier,
    setShippingAddress,
    setItemsList,
    removeItemsList,
    setIsInterState
} = purchaseOrderSlice.actions;
export default purchaseOrderSlice.reducer;
