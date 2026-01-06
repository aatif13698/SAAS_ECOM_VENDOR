import { createSlice } from "@reduxjs/toolkit";
import { actions } from "react-table";

const storedAdmin = JSON.parse(localStorage.getItem("adminInfo"));


const initialState = {
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

}

export const paymentOutSlice = createSlice({
    name: "paymentOut",
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
        setSupplier: (state, action) => {
            state.supplier = action.payload;
        },
        setPaymentOutNumber: (state, action) => {
            state.paymentOutNumber = action.payload
        },
        setPaymentOutDate: (state, action) => {
            state.paymentOutDate = action.payload
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
       
        resetPaymentOut: () => initialState,

        setPaymentOut: (state, action) => {
            console.log("action.payload", action.payload);
            return action.payload
        },
    },
});




export const { setLevel, setBusinessUnit, setBranch, remveBranch, setWarehouse, removeWarehouse,
    setSupplier,
    setNotes,
    setPaymentMethod,
    setPaidAmount,
    setPayedFrom,
    setPaymentOutNumber,
    setPaymentOutDate,
    resetPaymentOut,
    setPaymentOut,

} = paymentOutSlice.actions;
export default paymentOutSlice.reducer;
