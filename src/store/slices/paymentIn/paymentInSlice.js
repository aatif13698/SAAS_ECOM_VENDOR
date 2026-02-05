import { createSlice } from "@reduxjs/toolkit";
import { actions } from "react-table";

const storedAdmin = JSON.parse(localStorage.getItem("adminInfo"));


const initialState = {
    level: "",
    businessUnit: "",
    branch: "",
    warehouse: "",
    customer: null,

    paymentInNumber: '',
    paymentInDate: new Date().toISOString().split('T')[0],
    notes: '',
    paymentMethod: '',
    paidAmount: 0,
    payedFrom: null,

}

export const paymentInSlice = createSlice({
    name: "paymentIn",
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
        setcustomer: (state, action) => {
            state.customer = action.payload;
        },
        setPaymentInNumber: (state, action) => {
            state.paymentInNumber = action.payload
        },
        setPaymentInDate: (state, action) => {
            state.paymentInDate = action.payload
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
       
        resetPaymentIn: () => initialState,

        setPaymentOut: (state, action) => {
            console.log("action.payload", action.payload);
            return action.payload
        },
    },
});




export const { setLevel, setBusinessUnit, setBranch, remveBranch, setWarehouse, removeWarehouse,
    setcustomer,
    setNotes,
    setPaymentMethod,
    setPaidAmount,
    setPayedFrom,
    setPaymentInNumber,
    setPaymentInDate,
    resetPaymentIn,
    setPaymentOut,

} = paymentInSlice.actions;
export default paymentInSlice.reducer;
